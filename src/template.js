import { OPTIONS } from './options.js'
import { ValueError, LookupError, IndexError, KeyError, AttributeError } from './errors.js'
import { Spec } from './spec.js'
import { PyType, PyString } from './types.js'

const BRACE = /[{}]/g
const STEP = /\.([^.[]*)|\[([^\]]*)\]/y

/**
 * A format string, parsed once into literal text and replacement fields. Templates are
 * cached by their text, so formatting the same string again only renders.
 *
 * Python reports errors in field order as it works through a format string. To do the same
 * from a template parsed ahead of time, a syntax error is kept and raised only after the
 * fields before it have rendered.
 */
export class Template {
    static CACHED = 1000
    static cache = new Map()

    static compile(text) {
        const cache = this.cache
        let template = cache.get(text)
        if (!template) {
            template = new this(text)
            if (cache.size >= this.CACHED) {
                cache.clear()
            }
            cache.set(text, template)
        }
        return template
    }

    /** `outer` is the template whose field holds this one as a nested format spec. */
    constructor(text, outer) {
        this.outer = outer
        this.parts = []             // strings and Fields, in order
        this.manual = undefined     // whether fields are numbered {0} {1} or left to count themselves {} {}
        this.count = 0              // the next automatic number
        this.error = undefined      // the message of the syntax error that ends the template
        if (outer?.outer) {
            this.error = 'Max string recursion exceeded'
            return
        }
        try {
            this.parse(text)
        } catch (err) {
            if (!(err instanceof ValueError)) throw err
            this.error = err.message
        }
    }

    parse(text) {
        let pos = 0, literal = ''
        for (;;) {
            BRACE.lastIndex = pos
            const at = BRACE.exec(text)?.index ?? text.length
            literal += text.slice(pos, at)
            if (at >= text.length) {
                break
            }
            const brace = text[at]
            if (text[at + 1] === brace) {       // doubled: a literal brace
                literal += brace
                pos = at + 2
                continue
            }
            if (brace === '}') throw new ValueError("Single '}' encountered in format string")
            if (at + 1 >= text.length) throw new ValueError("Single '{' encountered in format string")

            if (literal) {
                this.parts.push(literal)
                literal = ''
            }
            const field = new Field(this)
            pos = field.parse(text, at + 1)
            this.parts.push(field)
        }
        if (literal) {
            this.parts.push(literal)
        }
    }

    /** `args` is an array of positional arguments or an object of named ones. */
    render(args) {
        let result = ''
        for (const part of this.parts) {
            result += typeof part === 'string' ? part : part.render(args)
        }
        if (this.error) throw new ValueError(this.error)
        return result
    }
}


/**
 * A replacement field:
 *
 *     "{" [name] ["!" conversion] [":" spec] "}"
 *
 * where name is an argument number or keyword followed by any number of .attribute and
 * [index] steps, and spec may itself contain replacement fields.
 */
export class Field {
    static CONVERSIONS = {s: '__str__', r: '__repr__', a: '__ascii__'}

    constructor(template) {
        this.template = template
        this.key = undefined            // argument number or keyword
        this.path = []                  // [isAttribute, name] steps into the argument
        this.pathError = undefined      // the message of the syntax error that ends the path
        this.conversion = undefined
        this.spec = ''
        this.nested = undefined         // the spec as a Template, when it has fields of its own
    }

    /** Parses the field that starts after the brace at pos; returns the position after it. */
    parse(text, pos) {
        const start = pos
        let char
        for (; pos < text.length; pos++) {
            char = text[pos]
            if (char === '{') throw new ValueError("unexpected '{' in field name")
            if (char === '[') {
                // an index may contain anything but its closing bracket
                pos = text.indexOf(']', pos)
                if (pos < 0) {
                    break
                }
            } else if (char === '}' || char === ':' || char === '!') {
                break
            }
        }
        if (pos < 0 || pos >= text.length) throw new ValueError("expected '}' before end of string")
        const name = text.slice(start, pos++)

        let spec = ''
        if (char === '!') {
            if (pos >= text.length) throw new ValueError('end of string while looking for conversion specifier')
            this.conversion = String.fromCodePoint(text.codePointAt(pos))
            pos += this.conversion.length
            if (pos < text.length) {
                char = text[pos++]
                if (char !== '}' && char !== ':') throw new ValueError("expected ':' after conversion specifier")
            }
        }
        if (char !== '}') {
            const from = pos
            for (let depth = 1; depth; pos++) {
                if (pos >= text.length) throw new ValueError("unmatched '{' in format spec")
                if (text[pos] === '{') {
                    depth++
                } else if (text[pos] === '}') {
                    depth--
                }
            }
            spec = text.slice(from, pos - 1)
        }

        // the name is numbered before the fields nested in the spec are
        this.name(name)
        if (spec.includes('{')) {
            this.nested = new Template(spec, this.template)
        } else {
            this.spec = spec
        }
        return pos
    }

    name(text) {
        const root = this.template.outer ?? this.template
        const head = /^[^.[]*/.exec(text)[0]
        if (head === '' || /^\d+$/.test(head)) {
            const manual = head !== ''
            if (root.manual === !manual) {
                throw new ValueError(manual
                    ? 'cannot switch from automatic field numbering to manual field specification'
                    : 'cannot switch from manual field specification to automatic field numbering')
            }
            root.manual = manual
            this.key = manual ? Spec.integer(head) : root.count++
        } else {
            this.key = head
        }
        // like a template's, the path's syntax error waits for what comes before it
        try {
            this.steps(text, head.length)
        } catch (err) {
            if (!(err instanceof ValueError)) throw err
            this.pathError = err.message
        }
    }

    steps(text, pos) {
        while (pos < text.length) {
            STEP.lastIndex = pos
            const match = STEP.exec(text)
            if (!match) throw new ValueError("Only '.' or '[' may follow ']' in format field specifier")
            const [all, attribute, index] = match
            const name = attribute ?? index
            if (!name) throw new ValueError('Empty attribute in format string')
            this.path.push([attribute !== undefined, /^\d+$/.test(index) ? Spec.integer(index) : name])
            pos += all.length
        }
    }

    render(args) {
        let value
        try {
            value = this.lookup(args)
        } catch (err) {
            if (OPTIONS.strict || !(err instanceof LookupError || err instanceof AttributeError)) throw err
            return ''
        }
        if (this.conversion) {
            const method = Field.CONVERSIONS[this.conversion]
            if (!method) throw new ValueError(`Unknown conversion specifier ${Spec.show(this.conversion)}`)
            value = PyType.wrap(value)[method]()
        }
        const spec = this.nested ? this.nested.render(args) : this.spec

        // an object that knows how to format itself does so, as in Python
        if (typeof value?.__format__ !== 'function') {
            value = PyType.wrap(value)
        }
        const result = value.__format__(spec)
        if (typeof result !== 'string') throw new TypeError(`__format__ must return a str, not ${typeof result}`)
        return result
    }

    /** The argument this field names, followed down its path. */
    lookup(args) {
        const key = this.key, numbered = typeof key === 'number'
        if (!(Array.isArray(args) ? numbered && key < args.length : Object.hasOwn(args, key))) {
            throw numbered
                ? new IndexError(`Replacement index ${key} out of range for positional args tuple`)
                : new KeyError(new PyString(key).__repr__())
        }
        let value = args[key]
        for (const [attribute, name] of this.path) {
            if (value == null || !(name in Object(value))) throw this.missing(value, attribute, name)
            value = value[name]
        }
        if (this.pathError) throw new ValueError(this.pathError)
        return value
    }

    missing(value, attribute, name) {
        if (attribute) {
            return new AttributeError(`object has no attribute '${name}'`)
        }
        if (typeof name === 'number' && typeof value === 'string') {
            return new IndexError('string index out of range')
        }
        if (typeof name === 'number' && Array.isArray(value)) {
            return new IndexError('list index out of range')
        }
        return new KeyError(new PyString(name).__repr__())
    }
}

import { ValueError, OverflowError } from './errors.js'
import { Digits } from './digits.js'
import { Spec } from './spec.js'

/**
 * Python's three formattable types. A JavaScript value is formatted by wrapping it in the
 * nearest one (see wrap), and a caller can wrap a value itself to choose: JavaScript has one
 * number type, so 3 formats as an int and `new PyFloat(3)` formats as the float 3.0.
 *
 * Each class implements Python's protocol: __format__(spec), __str__() and __repr__().
 * A presentation type such as 'x' is handled by the method named for it, format_x.
 */
export class PyType {
    constructor(value) {
        this.value = value
    }

    static wrap(value) {
        if (value instanceof PyType) {
            return value
        }
        switch (typeof value) {
            case 'bigint':
                return new PyInteger(value)
            case 'number':
                return Number.isInteger(value) ? new PyInteger(value) : new PyFloat(value)
        }
        return new PyString(value)
    }

    /** Python's format(value, spec). */
    __format__(text = '') {
        text = String(text)
        return text ? this.format(Spec.parse(text, this.constructor)) : this.__str__()
    }

    format(spec) {
        const method = this[spec.method]
        if (!method) {
            const name = this.constructor.NAME
            throw new ValueError(`Unknown format code '${Spec.show(spec.type)}' for object of type '${name}'`)
        }
        return method.call(this, spec)
    }

    __str__() {
        return String(this.value)
    }

    __repr__() {
        return this.__str__()
    }

    /** Python's ascii(): the repr with everything outside ASCII escaped. */
    __ascii__() {
        return this.__repr__().replace(/[^\x00-\x7f]/gu, PyType.escape)
    }

    static escape(char) {
        const code = char.codePointAt(0)
        if (code < 0x100) {
            return '\\x' + code.toString(16).padStart(2, '0')
        }
        if (code < 0x10000) {
            return '\\u' + code.toString(16).padStart(4, '0')
        }
        return '\\U' + code.toString(16).padStart(8, '0')
    }
}


/**
 * str. Anything that is not a number formats as its String() value, so that booleans, null,
 * arrays and objects read the way they do everywhere else in JavaScript.
 */
export class PyString extends PyType {
    static NAME = 'str'
    static CODE = 's'       // the presentation type when a spec names none
    static ALIGN = '<'
    static specs = new Map()

    static ESCAPES = {'\\': '\\\\', '\t': '\\t', '\n': '\\n', '\r': '\\r'}
    static QUOTED = /[\\'"]|[^\x20-\x7e]/gu     // characters repr may have to escape
    static UNPRINTABLE = /[\p{C}\p{Z}]/u        // Python escapes the Other and Separator categories

    /** Quotes a string as Python does; other values have no quotes to add. */
    __repr__() {
        const text = this.value
        if (typeof text !== 'string') {
            return this.__str__()
        }
        const quote = text.includes("'") && !text.includes('"') ? '"' : "'"
        const escaped = text.replace(PyString.QUOTED, (char) => {
            if (char === quote) {
                return '\\' + char
            }
            return PyString.ESCAPES[char] ?? (PyString.UNPRINTABLE.test(char) ? PyType.escape(char) : char)
        })
        return quote + escaped + quote
    }

    format_s(spec) {
        if (spec.sign) {
            throw new ValueError(`${spec.sign === ' ' ? 'Space' : 'Sign'} not allowed in string format specifier`)
        }
        if (spec.z) throw new ValueError('Negative zero coercion (z) not allowed in string format specifier')
        if (spec.alt) throw new ValueError('Alternate form (#) not allowed in string format specifier')
        if (spec.align === '=') throw new ValueError("'=' alignment not allowed in string format specifier")

        const text = this.__str__()
        return spec.pad(spec.precision === undefined ? text : Spec.clip(text, spec.precision))
    }
}


/**
 * int: a Number holding an integer, or a BigInt.
 */
export class PyInteger extends PyType {
    static NAME = 'int'
    static CODE = 'd'
    static ALIGN = '>'
    static specs = new Map()

    constructor(value) {
        super(typeof value === 'bigint' ? value : Math.trunc(value))
    }

    __str__() {
        return (this.value < 0 ? '-' : '') + this.digits(10)
    }

    /** The float presentation types convert the integer first, as Python does. */
    format(spec) {
        return 'eEfFgG%'.includes(spec.type) ? this.float().format(spec) : super.format(spec)
    }

    float() {
        const value = Number(this.value)
        if (!Number.isFinite(value)) throw new OverflowError('int too large to convert to float')
        return new PyFloat(value + 0)       // + 0 because an integer has no negative zero
    }

    /** The digits of the absolute value. */
    digits(base) {
        let value = this.value
        if (typeof value === 'number' && !Number.isSafeInteger(value)) {
            value = BigInt(value)       // a Number this large prints in exponent form
        }
        return (value < 0 ? -value : value).toString(base)
    }

    check(spec) {
        if (spec.precision !== undefined) throw new ValueError('Precision not allowed in integer format specifier')
        if (spec.z) throw new ValueError('Negative zero coercion (z) not allowed in integer format specifier')
    }

    integer(spec, base, prefix) {
        this.check(spec)
        return spec.number(spec.signFor(this.value < 0), spec.alt ? prefix : '', this.digits(base), '')
    }

    format_d(spec) {
        return this.integer(spec, 10, '')
    }

    /** Python's locale-aware type; this is the C locale, which has no separators. */
    format_n(spec) {
        return this.integer(spec, 10, '')
    }

    format_b(spec) {
        return this.integer(spec, 2, '0b')
    }

    format_o(spec) {
        return this.integer(spec, 8, '0o')
    }

    format_x(spec) {
        return this.integer(spec, 16, '0x')
    }

    format_X(spec) {
        this.check(spec)
        const digits = this.digits(16).toUpperCase()
        return spec.number(spec.signFor(this.value < 0), spec.alt ? '0X' : '', digits, '')
    }

    /** The character with this code point. */
    format_c(spec) {
        this.check(spec)
        if (spec.sign) throw new ValueError("Sign not allowed with integer format specifier 'c'")
        if (spec.alt) throw new ValueError("Alternate form (#) not allowed with integer format specifier 'c'")

        const code = this.value
        if (code >= 2n ** 63n || code < -(2n ** 63n)) throw new OverflowError('Python int too large to convert to C long')
        if (code < 0 || code > 0x10ffff) throw new OverflowError('%c arg not in range(0x110000)')
        return spec.number('', '', '', String.fromCodePoint(Number(code)))
    }
}


/**
 * float.
 */
export class PyFloat extends PyType {
    static NAME = 'float'
    static CODE = ''
    static ALIGN = '>'
    static specs = new Map()

    constructor(value) {
        super(Number(value))
    }

    __str__() {
        return this.format(Spec.parse('', this.constructor))
    }

    /** No presentation type: repr, or 'g' when a precision is given, keeping a fraction digit. */
    ['format_'](spec) {
        return spec.precision === undefined ? this.decimal(spec, 'r', 0) : this.decimal(spec, 'g')
    }

    format_e(spec) {
        return this.decimal(spec, 'e')
    }

    format_E(spec) {
        return this.decimal(spec, 'e')
    }

    format_f(spec) {
        return this.decimal(spec, 'f')
    }

    format_F(spec) {
        return this.decimal(spec, 'f')
    }

    format_g(spec) {
        return this.decimal(spec, 'g')
    }

    format_G(spec) {
        return this.decimal(spec, 'g')
    }

    /** Python's locale-aware type; this is the C locale, which has no separators. */
    format_n(spec) {
        return this.decimal(spec, 'g')
    }

    ['format_%'](spec) {
        return this.decimal(spec, 'f')
    }

    /** Formats with one of the layouts Digits knows; the spec's type adds the variations. */
    decimal(spec, code, precision = spec.precision ?? 6) {
        if (precision > 0x7fffffff) throw new ValueError('precision too big')
        const type = spec.type
        const value = type === '%' ? this.value * 100 : this.value
        let negative = value < 0 || Object.is(value, -0)

        // the whole digits, and what follows them
        let whole = '', rest = Number.isNaN(value) ? 'nan' : 'inf'
        if (Number.isFinite(value)) {
            const digits = new Digits(Math.abs(value), code, precision)
            if (spec.z && digits.zero) {
                negative = false
            }
            [whole, rest] = digits.layout(spec.alt, type === '')
        }
        if (type === '%') {
            rest += '%'
        }
        if (type >= 'E' && type <= 'G') {
            rest = rest.toUpperCase()       // the exponent's e, or inf and nan
        }
        if (spec.fracSep) {
            rest = rest.replace(/\d{3}(?=\d)/g, '$&' + spec.fracSep)
        }
        return spec.number(spec.signFor(negative), '', whole, rest)
    }
}

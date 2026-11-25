import { ValueError } from './errors.js'

const SURROGATE = /[\ud800-\udfff]/

/**
 * A parsed format spec, the part of a replacement field after the colon:
 *
 *     [[fill]align][sign][z][#][0][width][grouping][.[precision][grouping]][type]
 *
 * Python parses a spec on behalf of the type being formatted, which supplies the default
 * alignment and presentation type, so each type keeps its own cache of parsed specs.
 *
 * The spec also owns the layout work that every type shares: padding to the width and
 * grouping digits.
 */
export class Spec {
    static ALIGNS = '<>=^'
    static CACHED = 1000

    static parse(text, owner) {
        const specs = owner.specs
        let spec = specs.get(text)
        if (!spec) {
            spec = new this(text, owner)
            if (specs.size >= this.CACHED) {
                specs.clear()
            }
            specs.set(text, spec)
        }
        return spec
    }

    // The steps and their order are CPython's, so that the same spec raises the same error.
    constructor(text, owner) {
        const chars = Array.from(text)      // by code point: a fill character may be outside the BMP
        let pos = 0, fill, align

        if (Spec.ALIGNS.includes(chars[1])) {
            [fill, align] = chars
            pos = 2
        } else if (Spec.ALIGNS.includes(chars[0])) {
            align = chars[0]
            pos = 1
        }

        this.sign = '+- '.includes(chars[pos]) ? chars[pos++] : ''
        this.z = chars[pos] === 'z'
        if (this.z) pos++
        this.alt = chars[pos] === '#'
        if (this.alt) pos++

        // a leading zero means zero fill and, for numbers, padding after the sign
        if (fill === undefined && chars[pos] === '0') {
            fill = '0'
            if (align === undefined && owner.ALIGN === '>') {
                align = '='
            }
            pos++
        }
        this.fill = fill ?? ' '
        this.align = align ?? owner.ALIGN

        let stop = Spec.digits(chars, pos)
        this.width = Spec.integer(chars.slice(pos, stop).join(''))
        pos = stop

        this.sep = ''
        if (chars[pos] === ',') {
            this.sep = chars[pos++]
        }
        if (chars[pos] === '_') {
            if (this.sep) throw Spec.both()
            this.sep = chars[pos++]
        }
        if (chars[pos] === ',' && this.sep === '_') throw Spec.both()

        this.precision = undefined
        this.fracSep = ''
        if (chars[pos] === '.') {
            stop = Spec.digits(chars, ++pos)
            let given = stop - pos
            if (given) {
                this.precision = Spec.integer(chars.slice(pos, stop).join(''))
            }
            pos = stop
            if (chars[pos] === ',') {
                this.fracSep = chars[pos++]
                given++
            }
            if (chars[pos] === '_') {
                if (this.fracSep) throw Spec.both()
                this.fracSep = chars[pos++]
                given++
            }
            if (chars[pos] === ',' && this.fracSep === '_') throw Spec.both()
            if (!given) throw new ValueError('Format specifier missing precision')
        }

        if (chars.length - pos > 1) {
            throw new ValueError(`Invalid format specifier '${text}' for object of type '${owner.NAME}'`)
        }
        const type = this.type = pos < chars.length ? chars[pos] : owner.CODE
        this.method = 'format_' + type      // the owner's method for this presentation type

        // digits group in threes, or in fours for the power-of-two bases
        this.size = 3
        if (this.sep && type) {
            if ('boxX'.includes(type)) {
                if (this.sep === ',') throw Spec.cannot(this.sep, type)
                this.size = 4
            } else if (!'deEfFgG%'.includes(type)) {
                throw Spec.cannot(this.sep, type)
            }
        }
        if (this.fracSep && type === 'n') throw Spec.cannot(this.fracSep, type)
    }


    ///  Layout  ///

    /** The sign character for a number: always for a negative, on request for the rest. */
    signFor(negative) {
        return negative ? '-' : this.sign === '-' ? '' : this.sign
    }

    /** Pads text to the width. */
    pad(text) {
        const count = this.width - Spec.length(text)
        if (count <= 0) {
            return text
        }
        switch (this.align) {
            case '<':
                return text + this.fill.repeat(count)
            case '^': {
                const left = count >> 1
                return this.fill.repeat(left) + text + this.fill.repeat(count - left)
            }
        }
        return this.fill.repeat(count) + text
    }

    /**
     * Lays out a number from its parts: the sign and base prefix, the whole digits, and
     * whatever follows them (fraction, exponent, percent sign).
     */
    number(sign, prefix, digits, rest) {
        const head = sign + prefix
        if (digits) {
            // zero fill after the sign belongs to the digits, so that grouping runs through it
            const zeros = this.fill === '0' && this.align === '='
            digits = this.group(digits, zeros ? this.width - head.length - rest.length : 0)
        }
        if (this.align !== '=') {
            return this.pad(head + digits + rest)
        }
        const count = this.width - head.length - digits.length - Spec.length(rest)
        return head + (count > 0 ? this.fill.repeat(count) : '') + digits + rest
    }

    /**
     * Separates digits into groups, zero-filling on the left to at least the minimum length.
     * A result never starts with a separator, so it can be one longer than asked for.
     */
    group(digits, minimum) {
        if (!this.sep) {
            return digits.padStart(minimum, '0')
        }
        const groups = []
        let remaining = digits.length
        for (;;) {
            const length = Math.min(this.size, Math.max(remaining, minimum, 1))
            const taken = Math.min(remaining, length)
            groups.unshift('0'.repeat(length - taken) + digits.slice(remaining - taken, remaining))
            remaining -= taken
            minimum -= length
            if (remaining <= 0 && minimum <= 0) {
                return groups.join(this.sep)
            }
            minimum -= 1    // the separator
        }
    }


    ///  Helpers  ///

    /** Length in code points, which is how Python counts. */
    static length(text) {
        return SURROGATE.test(text) ? Array.from(text).length : text.length
    }

    /** The first `count` code points. */
    static clip(text, count) {
        return SURROGATE.test(text) ? Array.from(text).slice(0, count).join('') : text.slice(0, count)
    }

    /** The position after the run of decimal digits that starts at pos. */
    static digits(chars, pos) {
        while (chars[pos] >= '0' && chars[pos] <= '9') {
            pos++
        }
        return pos
    }

    /** The value of a string of decimal digits, within the range CPython accepts. */
    static integer(text) {
        const value = Number(text)
        if (value >= 2 ** 63) throw new ValueError('Too many decimal digits in format string')
        return value
    }

    /** A character as CPython prints it in an error message. */
    static show(char) {
        const code = char.codePointAt(0)
        return code > 32 && code < 127 ? char : '\\x' + code.toString(16)
    }

    static both() {
        return new ValueError("Cannot specify both ',' and '_'.")
    }

    static cannot(sep, type) {
        return new ValueError(`Cannot specify '${sep}' with '${Spec.show(type)}'.`)
    }
}

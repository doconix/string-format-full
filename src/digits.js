/**
 * The decimal digits of a non-negative finite number, rounded the way Python rounds them:
 * correctly, and to even when the discarded part is exactly a half.
 *
 * A number is held as a string of digits that starts with its first non-zero digit, plus the
 * position of the decimal point relative to the start of that string; 0.00123 is '123' with
 * point -2. That is the form CPython's own digit generator returns, and layout() arranges it
 * the way CPython's float formatter does, for one of four codes:
 *
 *     'r'   the shortest digits that read back as the same number (repr)
 *     'e'   precision digits after the point, always with an exponent
 *     'f'   precision digits after the point, never an exponent
 *     'g'   precision significant digits, with an exponent only when the number is large or small
 *
 * JavaScript's own toFixed() and toExponential() produce correct digits but round a half up,
 * so they are used and then corrected. Past their limits (100 digits, and 1e21 for toFixed)
 * the digits come from exact integer arithmetic instead.
 */
export class Digits {
    static NATIVE = 100     // the most fraction digits toFixed() and toExponential() accept

    constructor(value, code, precision) {
        this.code = code
        if (code === 'e') {
            precision += 1          // from digits after the point to significant digits
        } else if (code === 'g' && precision === 0) {
            precision = 1
        }
        this.precision = precision

        if (value === 0) {
            this.digits = '0'
            this.point = 1
            return
        }
        if (code === 'r') {
            this.shortest(value)
        } else if (code === 'f') {
            this.fixed(value, precision)
        } else {
            this.significant(value, precision)
        }
        if (code === 'g') {
            // the one layout that shows no more digits than it has
            let end = this.digits.length
            while (this.digits[end - 1] === '0') {
                end--
            }
            this.digits = this.digits.slice(0, end)
        }
    }

    /** True when the number rounded to nothing but zeros. */
    get zero() {
        return this.digits === '' || this.digits === '0'
    }

    shortest(value) {
        const [mantissa, exponent] = value.toExponential().split('e')
        this.digits = mantissa.replace('.', '')
        this.point = Number(exponent) + 1
    }

    /** Rounds to `count` significant digits. */
    significant(value, count) {
        if (count > Digits.NATIVE + 1) {
            return this.exact(value, count, false)
        }
        const [mantissa, exponent] = value.toExponential(count - 1).split('e')
        const digits = mantissa.replace('.', '')
        this.point = Number(exponent) + 1
        this.digits = Digits.tie(value, this.point - 1 - count) ? Digits.even(digits) : digits
    }

    /** Rounds to `count` digits after the decimal point. */
    fixed(value, count) {
        if (count > Digits.NATIVE || value >= 1e21) {
            return this.exact(value, count, true)
        }
        let text = value.toFixed(count)
        if (Digits.tie(value, -count - 1)) {
            text = Digits.even(text)
        }
        const whole = count ? text.length - count - 1 : text.length
        const digits = count ? text.slice(0, whole) + text.slice(whole + 1) : text
        let zeros = 0
        while (digits[zeros] === '0') {
            zeros++
        }
        this.digits = digits.slice(zeros)
        this.point = whole - zeros
    }

    /**
     * True when the value lies exactly half way between the two candidates for its last kept
     * digit: when its decimal expansion ends with a 5 in the place 10^exponent, the first one
     * dropped. A double is a whole multiple of a power of two, which makes the test exact.
     */
    static tie(value, exponent) {
        if (exponent < 0) {
            return Digits.odd(value * 2 ** -exponent)
        }
        const scaled = value / 2 ** exponent
        return Digits.odd(scaled) && scaled % 5 ** (exponent + 1) === 0
    }

    /** True for an odd integer. (Much faster than the % operator, which matters to tie.) */
    static odd(value) {
        return Math.floor(value) === value && Math.floor(value / 2) !== value / 2
    }

    /**
     * Corrects digits that toFixed() or toExponential() rounded up from a tie, which belongs
     * to its even neighbour. When the digits end odd, that neighbour is the one just below.
     */
    static even(digits) {
        const last = digits.at(-1)
        return last % 2 ? digits.slice(0, -1) + (last - 1) : digits
    }

    /**
     * Rounds from the exact decimal expansion, which every double has: its value is an
     * integer times a power of two. `count` is digits after the point when `fixed`, and
     * significant digits otherwise.
     */
    exact(value, count, fixed) {
        const view = new DataView(new ArrayBuffer(8))
        view.setFloat64(0, value)
        const bits = view.getBigUint64(0)
        const biased = Number(bits >> 52n)
        const mantissa = (bits & 0xfffffffffffffn) | (biased ? 1n << 52n : 0n)
        const exponent = Math.max(biased, 1) - 1075         // value === mantissa * 2 ** exponent

        // a negative power of two is that power of five over the same power of ten
        const whole = exponent < 0 ? mantissa * 5n ** BigInt(-exponent) : mantissa << BigInt(exponent)
        let digits = whole.toString()
        let point = digits.length + Math.min(exponent, 0)

        const keep = fixed ? point + count : count
        if (keep < digits.length) {
            let head = keep > 0 ? digits.slice(0, keep) : ''
            const tail = keep >= 0 ? digits.slice(keep) : '0'
            const up = tail[0] >= '5' && (tail[0] > '5' || /[1-9]/.test(tail.slice(1)) || head.at(-1) % 2 === 1)
            if (up) {
                const next = String(BigInt(head || 0) + 1n)
                if (next.length > head.length) {
                    point++
                }
                head = next
            } else if (!head) {
                point = -count      // everything rounded away
            }
            digits = head
        }
        this.digits = digits
        this.point = point
    }

    /**
     * The digits arranged as text, in two parts: the whole digits and everything after them.
     * `alt` is the spec's # flag, which keeps the decimal point and trailing zeros; `dot0`
     * keeps at least one fraction digit, as repr does.
     */
    layout(alt, dot0) {
        const digits = this.digits, precision = this.precision
        let point = this.point, end = digits.length, scientific = false
        switch (this.code) {
            case 'e':
                scientific = true
                end = precision
                break
            case 'f':
                end = point + precision
                break
            case 'g':
                scientific = point <= -4 || point > (dot0 ? precision - 1 : precision)
                if (alt) {
                    end = precision
                }
                break
            case 'r':
                scientific = point <= -4 || point > 16
        }

        let exponent = ''
        if (scientific) {
            const power = point - 1
            exponent = (power < 0 ? 'e-' : 'e+') + String(Math.abs(power)).padStart(2, '0')
            point = 1
        }

        // the digits sit in an endless run of zeros; take the stretch from start to end
        const start = point <= 0 ? point - 1 : 0
        end = Math.max(end, !scientific && dot0 ? point + 1 : point)
        const all = '0'.repeat(-start) + digits + '0'.repeat(Math.max(end - digits.length, 0))
        const fraction = all.slice(point - start)
        return [all.slice(0, point - start), (fraction || alt ? '.' : '') + fraction + exponent]
    }
}

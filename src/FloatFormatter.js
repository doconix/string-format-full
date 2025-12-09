// Copyright (c) Jython Developers
// Transcoded to Javascript by Conan Albrecht <doconix@gmail.com>
/* eslint-disable no-fallthrough */

import { InternalFormat } from './InternalFormat.js'
import { FormatError } from './exceptions'


/**
 * A class that provides the implementation of floating-point formatting. In a limited way, it acts
 * like a StringBuilder to which text and one or more numbers may be appended, formatted according
 * to the format specifier supplied at construction. These are ephemeral objects that are not, on
 * their own, thread safe.
 */
export class FloatFormatter extends InternalFormat.Formatter {

    /** Limit the size of results. */
    // No-one needs more than log(Double.MAX_VALUE) - log2(Double.MIN_VALUE) = 1383 digits.
    static MAX_PRECISION = 1400;

    /** If it contains no decimal point, this length is zero, and 1 otherwise. */
    lenPoint = 0;
    /** The length of the fractional part, right of the decimal point. */
    lenFraction = 0;
    /** The length of the exponent marker ("e"), "inf" or "nan", or zero if there isn't one. */
    lenMarker = 0;
    /** The length of the exponent sign and digits or zero if there isn't one. */
    lenExponent = 0;
    /** if &ge;0, minimum digits to follow decimal point (where consulted) */
    minFracDigits = 0;

    /**
     * Construct the formatter from a client-supplied buffer, to which the result will be appended,
     * and a specification. Sets {@link #mark} to the end of the buffer.
     *
     * @param result destination buffer
     * @param spec parsed conversion specification
     */
    constructor(result, spec) {
        // mimic the overloaded Java constructors
        if (spec === undefined) {
            spec = result
            result = ''
        }
        super(result, spec)

        if (this.spec.alternate) {
            // Alternate form means do not trim the zero fractional digits.
            this.minFracDigits = -1;
        } else if (this.spec.type === 'r' || this.spec.type === InternalFormat.Spec.NONE) {
            // These formats by default show at least one fractional digit.
            this.minFracDigits = 1;
        } else {
            /*
             * Every other format (if it does not ignore the setting) will by default trim off all
             * the trailing zero fractional digits.
             */
            this.minFracDigits = 0;
        }
    }


    /**
     * Override the default truncation behaviour for the specification originally supplied. Some
     * formats remove trailing zero digits, trimming to zero or one. Set member
     * <code>minFracDigits</code>, to modify this behaviour.
     *
     * @param minFracDigits if &lt;0 prevent truncation; if &ge;0 the minimum number of fractional
     *            digits; when this is zero, and all fractional digits are zero, the decimal point
     *            will also be removed.
     */
    setMinFracDigits(minFracDigits) {
        this.minFracDigits = minFracDigits;
    }

    reset() {
        // Clear the variables describing the latest number in result.
        super.reset();
        this.lenPoint = this.lenFraction = this.lenMarker = this.lenExponent = 0;
    }

    sectionLengths() {
        return [ this.lenSign, this.lenWhole, this.lenPoint, this.lenFraction, this.lenMarker, this.lenExponent ];
    }

    /**
     * Format a floating-point number according to the specification represented by this
     * <code>FloatFormatter</code>. The conversion type, precision, and flags for grouping or
     * percentage are dealt with here. At the point this is used, we know the {@link #spec} is one
     * of the floating-point types. This entry point allows explicit control of the prefix of
     * positive numbers, overriding defaults for the format type.
     *
     * @param value to convert
     * @param positivePrefix to use before positive values (e.g. "+") or null to default to ""
     * @return this object
     */
    format(value, positivePrefix=undefined) {

        // Puts all instance variables back to their starting defaults, and start = result.length.
        this.setStart();

        // Precision defaults to 6 (or 12 for none-format)
        let precision = this.spec.getPrecision(InternalFormat.Spec.specified(this.spec.type) ? 6 : 12);

        // Guard against excessive result precision
        // XXX Possibly better raised before result is allocated/sized.
        if (precision > this.constructor.MAX_PRECISION) {
            throw FormatError.precisionTooLarge('float')
        }

        /*
         * By default, the prefix of a positive number is "", but the format specifier may override
         * it, and the built-in type complex needs to override the format.
         */
        let sign = this.spec.sign;
        if (positivePrefix === null && InternalFormat.Spec.specified(sign) && sign !== '-') {
            positivePrefix = String(sign);
        }

        // Different process for each format type, ignoring case for now.
        switch (String(this.spec.type).toLowerCase()) {
            case 'e':
                // Exponential case: 1.23e-45
                this.format_e(value, positivePrefix, precision);
                break;

            case 'f':
                // Fixed case: 123.45
                this.format_f(value, positivePrefix, precision);
                break;

            case 'n':
                // Locale-sensitive version of g-format should be here. (Désolé de vous decevoir.)
                // XXX Set a variable here to signal localisation in/after groupDigits?
            case 'g':
                // General format: fixed or exponential according to value.
                this.format_g(value, positivePrefix, precision, 0);
                break;

            case InternalFormat.Spec.NONE:
                // None format like g-format but goes exponential at precision-1
                this.format_g(value, positivePrefix, precision, -1);
                break;

            case 'r':
                // For float.__repr__, very special case, breaks all the rules.
                this.format_r(value, positivePrefix);
                break;

            case '%':
                // Multiplies by 100 and displays in f-format, followed by a percent sign.
                this.format_f(100.0 * value, positivePrefix, precision);
                this.result += '%';
                break;

            default:
                // Should never get here, since this was checked in PyFloat.
                throw FormatError.unknownFormat(this.spec.type, "float");
        }

        // If the format type is an upper-case letter, convert the result to upper case.
        if (this.spec.type === String(this.spec.type).toUpperCase()) {
            this.uppercase();
        }

        // If required to, group the whole-part digits.
        if (this.spec.grouping) {
            this.groupDigits(3, ',');
        }

        return this;
    }

    /**
     * Convert just the letters in the representation of the current number (in {@link #result}) to
     * upper case. (That's the exponent marker or the "inf" or "nan".)
     */
    uppercase() {
        this.result = this.result.toUpperCase()
    }

    /**
     * Common code to deal with the sign, and the special cases "0", "-0", "nan, "inf", or "-inf".
     * If the method returns <code>false</code>, we have started a non-zero number and the sign is
     * already in {@link #result}. The client need then only encode <i>abs(value)</i>. If the method
     * returns <code>true</code>, and {@link #lenMarker}==0, the value was "0" or "-0": the caller
     * may have to zero-extend this, and/or add an exponent, to match the requested format. If the
     * method returns <code>true</code>, and {@link #lenMarker}>0, the method has placed "nan, "inf"
     * in the {@link #result} buffer (preceded by a sign if necessary).
     *
     * @param value to convert
     * @return true if the value was one of "0", "-0", "nan, "inf", or "-inf".
     * @param positivePrefix to use before positive values (e.g. "+") or null to default to ""
     */
    signAndSpecialNumber(value, positivePrefix) {
        if (isNaN(value)) {
            if (positivePrefix) {
                this.result += '+nan'
                this.lenSign = positivePrefix.length
            }else{
                this.result += 'nan'
            }
            this.lenMarker = 3
            return true

        }else if (value === Number.NEGATIVE_INFINITY) {
            this.result += '-inf'
            this.lenSign = 1
            this.lenMarker = 3
            return true

        }else if (value === Number.NEGATIVE_INFINITY) {
            if (positivePrefix) {
                this.result += '+inf'
                this.lenSign = positivePrefix.length
            }else{
                this.result += 'inf'
            }
            this.lenMarker = 3
            return true

        }else if (value === 0) {
            this.result += '0'
            this.lenWhole = 1
            return true

        }else if (value < 0) {
            this.result += '-'
            this.lenSign = 1
            // continues

        }

        return false
    }

    /**
     * The e-format helper function of {@link #format(double, String)} that uses Java's
     * {@link BigDecimal} to provide conversion and rounding. The converted number is appended to
     * the {@link #result} buffer, and {@link #start} will be set to the index of its first
     * character.
     *
     * @param value to convert
     * @param positivePrefix to use before positive values (e.g. "+") or null to default to ""
     * @param precision precision (maximum number of fractional digits)
     */
    format_e(value, positivePrefix, precision) {

        // Exponent (default value is for 0.0 and -0.0)
        let exp = 0;

        if (!this.signAndSpecialNumber(value, positivePrefix)) {
            value = Math.abs(Number(value));
            let scinum = value.toExponential(precision);
            let match = scinum.match(/(.+)e([+-].+)/);
            let [coefInt, coefDec] = `${match[1]}.`.split('.', 2);
            exp = Number(match[2]);

            // Take explicit control in order to get exponential notation out of BigDecimal.
            let digits = coefInt + coefDec
            let digitCount = digits.length;
            this.result += digits.charAt(0);
            this.lenWhole = 1;
            if (digitCount > 1) {
                // There is a fractional part
                this.result += '.' + digits.substring(1);
                this.lenPoint = 1;
                this.lenFraction = digitCount - 1;
            }
        }

        // If the result is not already complete, add point and zeros as necessary, and exponent.
        if (this.lenMarker === 0) {
            this.ensurePointAndTrailingZeros(precision);
            this.appendExponent(exp);
        }
    }

    /**
     * The f-format inner helper function of {@link #format(double, String)} that uses Java's
     * {@link BigDecimal} to provide conversion and rounding. The converted number is appended to
     * the {@link #result} buffer, and {@link #start} will be set to the index of its first
     * character.
     *
     * @param value to convert
     * @param positivePrefix to use before positive values (e.g. "+") or null to default to ""
     * @param precision precision (maximum number of fractional digits)
     */
    format_f(value, positivePrefix, precision) {

        if (!this.signAndSpecialNumber(value, positivePrefix)) {
            value = Math.abs(Number(value))

            // Truncate to the defined number of places to the right of the decimal point).
            value = value.toFixed(precision)

            // When converted to text, the number of fractional digits is exactly the scale we set.
            this.result += value;

            let [, coefDec] = `${value}.`.split('.', 2);
            if ((this.lenFraction = coefDec.length) > 0) {
                // There is a decimal point and some digits following
                this.lenWhole = this.result.length - (this.start + this.lenSign + (this.lenPoint = 1) + this.lenFraction);
            } else {
                // There are no fractional digits and so no decimal point
                this.lenWhole = this.result.length - (this.start + this.lenSign);
            }

        }

        // Finally, ensure we have all the fractional digits we should.
        if (this.lenMarker === 0) {
            this.ensurePointAndTrailingZeros(precision);
        }
    }

    /**
     * Append a decimal point and trailing fractional zeros if necessary for 'e' and 'f' format.
     * This should not be called if the result is not numeric ("inf" for example). This method deals
     * with the following complexities: on return there will be at least the number of fractional
     * digits specified in the argument <code>n</code>, and at least {@link #minFracDigits};
     * further, if <code>minFracDigits&lt;0</code>, signifying the "alternate mode" of certain
     * formats, the method will ensure there is a decimal point, even if there are no fractional
     * digits to follow.
     *
     * @param n smallest number of fractional digits on return
     */
    ensurePointAndTrailingZeros(n) {

        // Set n to the number of fractional digits we should have.
        if (n < this.minFracDigits) {
            n = this.minFracDigits;
        }

        // Do we have a decimal point already?
        if (this.lenPoint === 0) {
            // No decimal point: add one if there will be any fractional digits or
            if (n > 0 || this.minFracDigits < 0) {
                // First need to add a decimal point.
                this.result += '.';
                this.lenPoint = 1;
            }
        }

        // Do we have enough fractional digits already?
        let f = this.lenFraction;
        if (n > f) {
            // Make up the required number of zeros.
            for (; f < n; f++) {
                this.result += '0';
            }
            this.lenFraction = f;
        }
    }

    /**
     * Implementation of the variants of g-format, that uses Java's {@link BigDecimal} to provide
     * conversion and rounding. These variants are g-format proper, alternate g-format (available
     * for "%#g" formatting), n-format (as g but subsequently "internationalised"), and none-format
     * (type code Spec.NONE).
     * <p>
     * None-format is the basis of <code>float.__str__</code>.
     * <p>
     * According to the Python documentation for g-format, the precise rules are as follows: suppose
     * that the result formatted with presentation type <code>'e'</code> and precision <i>p-1</i>
     * would have exponent exp. Then if <i>-4 &lt;= exp < p</i>, the number is formatted with
     * presentation type <code>'f'</code> and precision <i>p-1-exp</i>. Otherwise, the number is
     * formatted with presentation type <code>'e'</code> and precision <i>p-1</i>. In both cases
     * insignificant trailing zeros are removed from the significand, and the decimal point is also
     * removed if there are no remaining digits following it.
     * <p>
     * The Python documentation says none-format is the same as g-format, but the observed behaviour
     * differs from this, in that f-format is only used if <i>-4 &lt;= exp < p-1</i> (i.e. one
     * less), and at least one digit to the right of the decimal point is preserved in the f-format
     * (but not the e-format). That behaviour is controlled through the following arguments, with
     * these recommended values:
     *
     * <table>
     * <caption>Recommended values for formatting arguments</caption>
     * <tr>
     * <th>type</th>
     * <th>precision</th>
     * <th>minFracDigits</th>
     * <th>expThresholdAdj</th>
     * <td>expThreshold</td>
     * </tr>
     * <tr>
     * <th>g</th>
     * <td>p</td>
     * <td>0</td>
     * <td>0</td>
     * <td>p</td>
     * </tr>
     * <tr>
     * <th>#g</th>
     * <td>p</td>
     * <td>-</td>
     * <td>0</td>
     * <td>p</td>
     * </tr>
     * <tr>
     * <th>\0</th>
     * <td>p</td>
     * <td>1</td>
     * <td>-1</td>
     * <td>p-1</td>
     * </tr>
     * <tr>
     * <th>__str__</th>
     * <td>12</td>
     * <td>1</td>
     * <td>-1</td>
     * <td>11</td>
     * </tr>
     * </table>
     *
     * @param value to convert
     * @param positivePrefix to use before positive values (e.g. "+") or null to default to ""
     * @param precision total number of significant digits (precision 0 behaves as 1)
     * @param expThresholdAdj <code>+precision =</code> the exponent at which to resume using
     *            exponential notation
     */
    format_g(value, positivePrefix, precision, expThresholdAdj) {
        // Precision 0 behaves as 1
        precision = Math.max(1, precision);

        // Use exponential notation if exponent would be bigger thatn:
        let expThreshold = precision + expThresholdAdj;

        if (this.signAndSpecialNumber(value, positivePrefix)) {
            // Finish formatting if zero result. (This is a no-op for nan or inf.)
            this.zeroHelper(precision, expThreshold);

        } else {
            // Convert abs(value) to decimal with p digits of accuracy.
            value = Math.abs(Number(value))

            // This gives us the digits we need for either fixed or exponential format.
            let [coefInt, coefDec] = `${value}.`.split('.', 2);
            let pointlessDigits = coefInt + coefDec;
            pointlessDigits = parseInt(pointlessDigits).toString()  // remove any leading zeros

            // If we were to complete this as e-format, the exponent would be:
            let scinum = value.toExponential(precision);
            let match = scinum.match(/(.+)e([+-].+)/);
            let exp = Number(match[2]);

            if (-4 <= exp && exp < expThreshold) {
                // Finish the job as f-format with variable-precision p-(exp+1).
                this.appendFixed(pointlessDigits, exp, precision);

            } else {
                // Finish the job as e-format.
                this.appendExponential(pointlessDigits, exp);
            }
        }
    }

    /**
     * Implementation of r-format (<code>float.__repr__</code>) that uses Java's
     * {@link Double#toString(double)} to provide conversion and rounding. That method gives us
     * almost what we need, but not quite (sometimes it yields 18 digits): here we always round to
     * 17 significant digits. Much of the formatting after conversion is shared with
     * {@link #format_g(double, String, int, int, int)}. <code>minFracDigits</code> is consulted
     * since while <code>float.__repr__</code> truncates to one digit, within
     * <code>complex.__repr__</code> we truncate fully.
     *
     * @param value to convert
     * @param positivePrefix to use before positive values (e.g. "+") or null to default to ""
     */
    format_r(value, positivePrefix) {
        // Characteristics of repr (precision = 17 and go exponential at 16).
        return this.format_g(value, positivePrefix, 17, 16)
    }

    /**
     * Common code for g-format, none-format and r-format called when the conversion yields "inf",
     * "nan" or zero. The method completes formatting of the zero, with the appropriate number of
     * decimal places or (in particular circumstances) exponential; notation.
     *
     * @param precision of conversion (number of significant digits).
     * @param expThreshold if zero, causes choice of exponential notation for zero.
     */
    zeroHelper(precision, expThreshold) {

        if (this.lenMarker === 0) {
            // May be 0 or -0 so we still need to ...
            if (this.minFracDigits < 0) {
                // In "alternate format", we won't economise trailing zeros.
                this.appendPointAndTrailingZeros(precision - 1);
            } else if (this.lenFraction < this.minFracDigits) {
                // Otherwise, it should be at least the stated minimum length.
                this.appendTrailingZeros(this.minFracDigits);
            }

            // And just occasionally (in none-format) we go exponential even when exp = 0...
            if (0 >= expThreshold) {
                this.appendExponent(0);
            }
        }
    }

    /**
     * Common code for g-format, none-format and r-format used when the exponent is such that a
     * fixed-point presentation is chosen. Normally the method removes trailing digits so as to
     * shorten the presentation without loss of significance. This method respects the minimum
     * number of fractional digits (digits after the decimal point), in member
     * <code>minFracDigits</code>, which is 0 for g-format and 1 for none-format and r-format. When
     * <code>minFracDigits&lt;0</code> this signifies "no truncation" mode, in which trailing zeros
     * generated in the conversion are not removed. This supports "%#g" format.
     *
     * @param digits from converting the value at a given precision.
     * @param exp would be the exponent (in e-format), used to position the decimal point.
     * @param precision of conversion (number of significant digits).
     */
    appendFixed(digits, exp, precision) {
        // Check for "alternate format", where we won't economise trailing zeros.
        let noTruncate = (this.minFracDigits < 0);

        let digitCount = digits.length;

        if (exp < 0) {
            // For a negative exponent, we must insert leading zeros 0.000 ...
            this.result += "0.";
            this.lenWhole = this.lenPoint = 1;
            for (let i = -1; i > exp; --i) {
                this.result += '0';
            }
            // Then the generated digits (always enough to satisfy no-truncate mode).
            this.result += digits
            this.lenFraction = digitCount - exp - 1;

        } else {
            // For a non-negative exponent, it's a question of placing the decimal point.
            let w = exp + 1;
            if (w < digitCount) {
                // There are w whole-part digits
                this.result += digits.substring(0, w);
                this.lenWhole = w;
                this.result += '.' + digits.substring(w, digitCount);
                this.lenPoint = 1;
                this.lenFraction = digitCount - w;
            } else {
                // All the digits are whole-part digits.
                this.result += digits;
                // Just occasionally (in r-format) we need more digits than the precision.
                while (digitCount < w) {
                    this.result += '0';
                    digitCount += 1;
                }
                this.lenWhole = digitCount;
            }

            if (noTruncate) {
                // Extend the fraction as BigDecimal will have economised on zeros.
                this.appendPointAndTrailingZeros(precision - digitCount);
            }
        }

        // Finally, ensure we have all and only the fractional digits we should.
        if (!noTruncate) {
            if (this.lenFraction < this.minFracDigits) {
                // Otherwise, it should be at least the stated minimum length.
                this.appendTrailingZeros(this.minFracDigits);
            } else {
                // And no more
                this.removeTrailingZeros(this.minFracDigits);
            }
        }
    }

    /**
     * Common code for g-format, none-format and r-format used when the exponent is such that an
     * exponential presentation is chosen. Normally the method removes trailing digits so as to
     * shorten the presentation without loss of significance. Although no minimum number of
     * fractional digits is enforced in the exponential presentation, when
     * <code>minFracDigits&lt;0</code> this signifies "no truncation" mode, in which trailing zeros
     * generated in the conversion are not removed. This supports "%#g" format.
     *
     * @param digits from converting the value at a given precision.
     * @param exp would be the exponent (in e-format), used to position the decimal point.
     */
    appendExponential(digits, exp) {

        // The whole-part is the first digit.
        this.result += digits.charAt(0);
        this.lenWhole = 1;

        // And the rest of the digits form the fractional part
        let digitCount = digits.length;
        this.result += '.' + digits.substring(1, digitCount);
        this.lenPoint = 1;
        this.lenFraction = digitCount - 1;

        // In no-truncate mode, the fraction is full precision. Otherwise trim it.
        if (this.minFracDigits >= 0) {
            // Note positive minFracDigits only applies to fixed formats.
            this.removeTrailingZeros(0);
        }

        // Finally, append the exponent as e+nn.
        this.appendExponent(exp);
    }

    /**
     * Append the trailing fractional zeros, as required by certain formats, so that the total
     * number of fractional digits is no less than specified. If <code>n&lt;=0</code>, the method
     * leaves the {@link #result} buffer unchanged.
     *
     * @param n smallest number of fractional digits on return
     */
    appendTrailingZeros(n) {

        let f = this.lenFraction;

        if (n > f) {
            if (this.lenPoint === 0) {
                // First need to add a decimal point. (Implies lenFraction=0.)
                this.result += '.';
                this.lenPoint = 1;
            }

            // Now make up the required number of zeros.
            for (; f < n; f++) {
                this.result += '0';
            }
            this.lenFraction = f;
        }
    }

    /**
     * Append the trailing fractional zeros, as required by certain formats, so that the total
     * number of fractional digits is no less than specified. If there is no decimal point
     * originally (and therefore no fractional part), the method will add a decimal point, even if
     * it adds no zeros.
     *
     * @param n smallest number of fractional digits on return
     */
    appendPointAndTrailingZeros(n) {

        if (this.lenPoint === 0) {
            // First need to add a decimal point. (Implies lenFraction=0.)
            this.result += '.';
            this.lenPoint = 1;
        }

        // Now make up the required number of zeros.
        let f;
        for (f = this.lenFraction; f < n; f++) {
            this.result += '0';
        }
        this.lenFraction = f;
    }

    /**
     * Remove trailing zeros from the fractional part, as required by certain formats, leaving at
     * least the number of fractional digits specified. If the resultant number of fractional digits
     * is zero, this method will also remove the trailing decimal point (if there is one).
     *
     * @param n smallest number of fractional digits on return
     */
    removeTrailingZeros(n) {

        if (this.lenPoint > 0) {
            // There's a decimal point at least, and there may be some fractional digits.
            let f = this.lenFraction;
            if (n === 0 || f > n) {

                let fracStart = this.result.length - f;
                for (; f > n; --f) {
                    if (this.result.charAt(fracStart - 1 + f) !== '0') {
                        // Keeping this one as it isn't a zero
                        break;
                    }
                }

                // f is now the number of fractional digits we wish to retain.
                if (f === 0 && this.lenPoint > 0) {
                    // We will be stripping all the fractional digits. Take the decimal point too.
                    this.lenPoint = this.lenFraction = 0;
                    f = -1;
                } else {
                    this.lenFraction = f;
                }

                // Snip the characters we are going to remove (if any).
                if (fracStart + f < this.result.length) {
                    this.result = this.result.substring(0, fracStart + f);
                }
            }
        }
    }

    /**
     * Append the current value of {@code exp} in the format <code>"e{:+02d}"</code> (for example
     * <code>e+05</code>, <code>e-10</code>, <code>e+308</code> , etc.).
     *
     * @param exp exponent value to append
     */
    appendExponent(exp) {

        let marker = this.result.length;
        let e;

        // Deal with sign and leading-zero convention by explicit tests.
        if (exp < 0) {
            e = (exp <= -10) ? "e-" : "e-0";
            exp = -exp;
        } else {
            e = (exp < 10) ? "e+0" : "e+";
        }

        this.result += e + exp;
        this.lenMarker = 1;
        this.lenExponent = this.result.length - marker - 1;
    }

    /**
     * Return the index in {@link #result} of the first letter. This is a helper for
     * {@link #uppercase()} and {@link #getExponent()}
     */
    indexOfMarker() {
        return this.start + this.lenSign + this.lenWhole + this.lenPoint + this.lenFraction;
    }

}

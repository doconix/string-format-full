// Copyright (c) Jython Developers
// Transcoded to Javascript by Conan Albrecht <doconix@gmail.com>

import { InternalFormat } from './InternalFormat.js'
import { FormatError } from './exceptions'

/**
 * A class that provides the implementation of integer formatting. In a limited way, it acts like a
 * StringBuilder to which text and one or more numbers may be appended, formatted according to the
 * format specifier supplied at construction. These are ephemeral objects that are not, on their
 * own, thread safe.
 */
export class IntegerFormatter extends InternalFormat.Formatter {

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
            result = '';
        }
        super(result, spec)
    }

    /**
     * Format a {@link BigInteger}, which is the implementation type of Jython <code>long</code>,
     * according to the specification represented by this <code>IntegerFormatter</code>. The
     * conversion type, and flags for grouping or base prefix are dealt with here. At the point this
     * is used, we know the {@link #spec} is one of the integer types.
     *
     * @param value to convert
     * @return this object
     */
    format(value) {
        // Different process for each format type.
        switch (String(this.spec.type).toLowerCase()) {
            case 'd':
            case InternalFormat.Spec.NONE:
            case 'u':
            case 'i':
                // None format or d-format: decimal
                this.format_d(value);
                break;

            case 'x':
                // hexadecimal.
                this.format_x(value, false);
                break;

            case 'X':
                // HEXADECIMAL!
                this.format_x(value, true);
                break;

            case 'o':
                // Octal.
                this.format_o(value);
                break;

            case 'b':
                // Binary.
                this.format_b(value);
                break;

            case 'c':
                // Binary.
                this.format_c(value);
                break;

            case 'n':
                // Locale-sensitive version of d-format should be here.
                this.format_d(value);
                break;

            default:
                // Should never get here, since this was checked in caller.
                throw FormatError.unknownFormat(this.spec.type, "long")
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
     * Format the value as decimal (into {@link #result}). The option for mandatory sign is dealt
     * with by reference to the format specification.
     *
     * @param value to convert
     */
    format_d(value) {
        let number;
        if (value < 0) {
            // Negative value: deal with sign and base, and convert magnitude.
            this.negativeSign(null);
            number = String(-1 * value);
        } else {
            // Positive value: deal with sign, base and magnitude.
            this.positiveSign(null);
            number = String(value);
        }
        this.appendNumber(number);
    }

    /**
     * Format the value as hexadecimal (into {@link #result}), with the option of using upper-case
     * or lower-case letters. The options for mandatory sign and for the presence of a base-prefix
     * "0x" or "0X" are dealt with by reference to the format specification.
     *
     * @param value to convert
     * @param upper if the hexadecimal should be upper case
     */
    format_x(value, upper) {
        let base = upper ? "0X" : "0x";
        let number;
        if (value < 0) {
            // Negative value: deal with sign and base, and convert magnitude.
            this.negativeSign(base);
            number = this.toHexString(-1 * value);
        } else {
            // Positive value: deal with sign, base and magnitude.
            this.positiveSign(base);
            number = this.toHexString(value);
        }
        // Append to result, case-shifted if necessary.
        if (upper) {
            number = number.toUpperCase();
        }
        this.appendNumber(number);
    }

    /**
     * Format the value as octal (into {@link #result}). The options for mandatory sign and for the
     * presence of a base-prefix "0o" are dealt with by reference to the format specification.
     *
     * @param value to convert
     */
    format_o(value) {
        let base = "0o";
        let number;
        if (value < 0) {
            // Negative value: deal with sign and base, and convert magnitude.
            this.negativeSign(base);
            number = this.toOctalString(-1 * value);
        } else {
            // Positive value: deal with sign, base and magnitude.
            this.positiveSign(base);
            number = this.toOctalString(value);
        }
        // Append to result.
        this.appendNumber(number);
    }

    /**
     * Format the value as binary (into {@link #result}). The options for mandatory sign and for the
     * presence of a base-prefix "0b" are dealt with by reference to the format specification.
     *
     * @param value to convert
     */
    format_b(value) {
        let base = "0b";
        let number;
        if (value < 0) {
            // Negative value: deal with sign and base, and convert magnitude.
            this.negativeSign(base);
            number = this.toBinaryString(-1 * value);
        } else {
            // Positive value: deal with sign, base and magnitude.
            this.positiveSign(base);
            number = this.toBinaryString(value);
        }
        // Append to result.
        this.appendNumber(number);
    }

    /**
     * Format the value as a character (into {@link #result}).
     *
     * @param value to convert
     */
    format_c(value) {
        this.result += String.fromCharCode(value)
    }

    // NOTE: Jython includes two sets of methods (one for BigInteger and one for int).
    //       Removed the second set of methods.

    /**
     * Append to {@link #result} buffer a sign (if one is specified for positive numbers) and, in
     * alternate mode, the base marker provided. The sign and base marker are together considered to
     * be the "sign" of the converted number, spanned by {@link #lenSign}. This is relevant when we
     * come to insert padding.
     *
     * @param base marker "0x" or "0X" for hex, "0o" for octal, "0b" for binary, "" or
     *            <code>null</code> for decimal.
     */
    positiveSign(base) {
        // Does the format specify a sign for positive values?
        let sign = this.spec.sign;
        if (InternalFormat.Spec.specified(sign) && sign !== '-') {
            this.result += sign;
            this.lenSign = 1;
        }
        // Does the format call for a base prefix?
        if (base !== null && this.spec.alternate) {
            this.result += base
            this.lenSign += base.length;
        }
    }

    /**
     * Append to {@link #result} buffer a minus sign and, in alternate mode, the base marker
     * provided. The sign and base marker are together considered to be the "sign" of the converted
     * number, spanned by {@link #lenSign}. This is relevant when we come to insert padding.
     *
     * @param base marker ("0x" or "0X" for hex, "0" for octal, <code>null</code> or "" for decimal.
     */
    negativeSign(base) {
        // Insert a minus sign unconditionally.
        this.result += '-';
        this.lenSign = 1;
        // Does the format call for a base prefix?
        if (base !== null && this.spec.alternate) {
            this.result += base
            this.lenSign += base.length;
        }
    }

    /**
     * Append a string (number) to {@link #result} and set {@link #lenWhole} to its length .
     *
     * @param number to append
     */
    appendNumber(number) {
        // note that number is a String here
        this.lenWhole = number.length;
        this.result += number;
    }

    /**
     * A more efficient algorithm for generating a hexadecimal representation of a byte array.
     * {@link BigInteger#toString(int)} is too slow because it generalizes to any radix and,
     * consequently, is implemented using expensive mathematical operations.
     *
     * @param value the value to generate a hexadecimal string from
     * @return the hexadecimal representation of value, with "-" sign prepended if necessary
     */
    toHexString(value) {
        // Jython does its own implementation, but recoding to simply use JS built-in methods
        if (value) {
            return value.toString(16)
        }
        return value
    }

    /**
     * A more efficient algorithm for generating an octal representation of a byte array.
     * {@link BigInteger#toString(int)} is too slow because it generalizes to any radix and,
     * consequently, is implemented using expensive mathematical operations.
     *
     * @param value the value to generate an octal string from
     * @return the octal representation of value, with "-" sign prepended if necessary
     */
    toOctalString(value) {
        // Jython does its own implementation, but recoding to simply use JS built-in methods
        if (value) {
            return value.toString(8)
        }
        return value
    }

    /**
     * A more efficient algorithm for generating a binary representation of a byte array.
     * {@link BigInteger#toString(int)} is too slow because it generalizes to any radix and,
     * consequently, is implemented using expensive mathematical operations.
     *
     * @param value the value to generate a binary string from
     * @return the binary representation of value, with "-" sign prepended if necessary
     */
    toBinaryString(value) {
        if (value) {
            return value.toString(2);
        }
        return value
    }

    /** Format specification used by bin(). */
    BIN = InternalFormat.fromText("#b");

    /** Format specification used by oct(). */
    OCT = InternalFormat.fromText("#o");

    /** Format specification used by hex(). */
    HEX = InternalFormat.fromText("#x");

    /**
     * Convert the object to binary according to the conventions of Python built-in
     * <code>bin()</code>. The object's __index__ method is called, and is responsible for raising
     * the appropriate error (which the base {@link PyObject#__index__()} does).
     *
     * @param number to convert
     * @return PyString converted result
     */
    // Follow this pattern in Python 3, where objects no longer have __hex__, __oct__ members.
    bin(number) {
        return this.formatNumber(number, this.constructor.BIN);
    }

    /**
     * Convert the object according to the conventions of Python built-in <code>hex()</code>, or
     * <code>oct()</code>. The object's <code>__index__</code> method is called, and is responsible
     * for raising the appropriate error (which the base {@link PyObject#__index__()} does).
     *
     * @param number to convert
     * @return PyString converted result
     */
    formatNumber(number, spec) {
        const f = new this.constructor(spec);
        f.format(parseInt(number));
        return f.getResult();
    }

    // NOTE: removed the Traditional inner class because we're doing the {}-style formatting
}

// Copyright (c) Jython Developers
// Transcoded to Javascript by Conan Albrecht <doconix@gmail.com>
import { InternalFormat } from './InternalFormat.js'


/**
 * A class that provides the implementation of <code>str</code> and <code>unicode</code> formatting.
 * In a limited way, it acts like a StringBuilder to which text, formatted according to the format
 * specifier supplied at construction. These are ephemeral objects that are not, on their own,
 * thread safe.
 */
export class TextFormatter extends InternalFormat.Formatter {

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
     * Format the given <code>String</code> into the <code>result</code> buffer. Largely, this is a
     * matter of copying the value of the argument, but a subtlety arises when the string contains
     * supplementary (non-BMP) Unicode characters, which are represented as surrogate pairs. The
     * precision specified in the format relates to a count of Unicode characters (code points), not
     * Java <code>char</code>s. The method deals with this correctly, essentially by not counting
     * the high-surrogates in the allowance. The final value of {@link #lenWhole} counts the UTF-16
     * units added.
     *
     * @param value to format
     * @return this <code>TextFormatter</code> object
     */
    format(value) {
        // Scratch all instance variables and start = result.length.
        this.setStart();

        let p = this.spec.precision;
        let n = value.length;

        if (InternalFormat.Spec.specified(p) && p < n) {
            /*
             * A precision p was specified less than the length: we may have to truncate. Note we
             * compared p with the UTF-16 length, even though it is the code point length that
             * matters. But the code point length cannot be greater than n.
             */
            let count = 0;
            while (count < p) {
                // count is the number of UTF-16 chars.
                let c = value.charAt(count++);
                this.result += c;
            }
            // Record the UTF-16 count as the length in buffer
            this.lenWhole = count;

        } else {
            // We definitely don't need to truncate. Append the whole string.
            this.lenWhole = n;
            this.result += value;
        }

        return this;
    }

}

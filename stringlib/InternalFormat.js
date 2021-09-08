// Transcoded to Javascript by Conan Albrecht <doconix@gmail.com>
import { IllegalArgumentException } from './exceptions'

export class InternalFormat {

    /**
     * Create a {@link Spec} object by parsing a format specification.
     *
     * @param text to parse
     * @return parsed equivalent to text
     */
    static fromText(text) {
        const parser = new InternalFormat.Parser(text);
        return parser.parse();
    }

    /**
     * A class that provides the base for implementations of type-specific formatting. In a limited
     * way, it acts like a StringBuilder to which text and one or more numbers may be appended,
     * formatted according to the format specifier supplied at construction. These are ephemeral
     * objects that are not, on their own, thread safe.
     */
    static Formatter = class {

        /**
         * Construct the formatter from a client-supplied buffer and a specification. Sets
         * {@link #mark} and {@link #start} to the end of the buffer. The new formatted object will
         * therefore be appended there and, when the time comes, padding will be applied to (just)
         * the new text.
         *
         * @param result destination buffer
         * @param spec parsed conversion specification
         */
        constructor(result, spec) {
            this.spec = spec;
            this.result = result;
            this.start = this.mark = result.length;
        }

        /**
         * Current (possibly final) result of the formatting, as a <code>String</code>.
         *
         * @return formatted result
         */
        getResult() {
            return this.result.toString();
        }

        /*
         * Implement Appendable interface by delegation to the result buffer.
         *
         * @see java.lang.Appendable#append(char)
         */
        append(c, start=undefined, end=undefined) {
            if (start === undefined && end === undefined) {
                this.result += c
            }else{
                this.result += c.substring(start, end)
            }
            return this;
        }

        /**
         * Clear the instance variables describing the latest object in {@link #result}, ready to
         * receive a new one: sets {@link #start} and calls {@link #reset()}. This is necessary when
         * a <code>Formatter</code> is to be re-used. Note that this leaves {@link #mark} where it
         * is. In the core, we need this to support <code>complex</code>: two floats in the same
         * format, but padded as a unit.
         */
        setStart() {
            // The new value will float at the current end of the result buffer.
            this.start = this.result.length;
            // If anything has been added since construction, reset all state.
            if (this.start > this.mark) {
                // Clear the variable describing the latest number in result.
                this.reset();
            }
        }

        /**
         * Clear the instance variables describing the latest object in {@link #result}, ready to
         * receive a new one. This is called from {@link #setStart()}. Subclasses override this
         * method and call {@link #setStart()} at the start of their format method.
         */
        reset() {
            // Clear the variables describing the latest object in result.
            this.lenSign = this.lenWhole = 0;
        }

        /**
         * Insert grouping characters (conventionally commas) into the whole part of the number.
         * {@link #lenWhole} will increase correspondingly.
         *
         * @param groupSize normally 3.
         * @param comma or some other character to use as a separator.
         */
        groupDigits(groupSize, comma) {

            // Work out how many commas (or whatever) it takes to group the whole-number part.
            let commasNeeded = (this.lenWhole - 1) / groupSize;

            if (commasNeeded > 0) {
                // Index *just after* the current last digit of the whole part of the number.
                let from = this.start + this.lenSign + this.lenWhole;
                // Open a space into which the whole part will expand.
                this.makeSpaceAt(from, commasNeeded);
                // Index *just after* the end of that space.
                let to = from + commasNeeded;
                // The whole part will be longer by the number of commas to be inserted.
                this.lenWhole += commasNeeded;

                /*
                 * Now working from high to low, copy all the digits that have to move. Each pass
                 * copies one group and inserts a comma, which makes the to-pointer move one place
                 * extra. The to-pointer descends upon the from-pointer from the right.
                 */
                while (to > from) {
                    // Copy a group
                    for (let i = 0; i < groupSize; i++) {
                        setCharAt(this.result, --to, this.result.charAt(--from));
                    }
                    // Write the comma that precedes it.
                    setCharAt(this.result, --to, comma);
                }
            }
        }

        /**
         * Make a space in {@link #result} of a certain size and position. On return, the segment
         * lengths are likely to be invalid until the caller adjusts them corresponding to the
         * insertion. There is no guarantee what the opened space contains.
         *
         * @param pos at which to make the space
         * @param size of the space
         */
        makeSpaceAt(pos, size) {
                let fill = this.spec.getFill(' ');
                this.result = this.result.substring(0, pos) +
                              new Array(size + 1).join(fill) +
                              this.result.substring(pos);
        }

        /**
         * Convert letters in the representation of the current number (in {@link #result}) to upper
         * case.
         */
        uppercase() {
            this.result = this.result.toUpperCase()
        }

        // switcher to mimic the overloaded Java method
        pad(...args) {
            if (args.length >= 2) {
                return this._pad2(...args)
            }
            return this._pad1(...args)
        }

        /**
         * Pad the result so far (defined as the contents of {@link #result} from {@link #mark} to
         * the end) using the alignment, target width and fill character defined in {@link #spec}.
         * The action of padding will increase the length of this segment to the target width, if
         * that is greater than the current length.
         * <p>
         * When the padding method has decided that that it needs to add n padding characters, it
         * will affect {@link #start} or {@link #lenWhole} as follows.
         * <table border style>
         * <caption>Effect of padding on {@link #start} or {@link #lenWhole}</caption>
         * <tr>
         * <th>align</th>
         * <th>meaning</th>
         * <th>start</th>
         * <th>lenWhole</th>
         * <th>result.length</th>
         * </tr>
         * <tr>
         * <th>{@code <}</th>
         * <td>left-aligned</td>
         * <td>+0</td>
         * <td>+0</td>
         * <td>+n</td>
         * </tr>
         * <tr>
         * <th>{@code >}</th>
         * <td>right-aligned</td>
         * <td>+n</td>
         * <td>+0</td>
         * <td>+n</td>
         * </tr>
         * <tr>
         * <th>{@code ^}</th>
         * <td>centred</td>
         * <td>+(n/2)</td>
         * <td>+0</td>
         * <td>+n</td>
         * </tr>
         * <tr>
         * <th>{@code =}</th>
         * <td>pad after sign</td>
         * <td>+0</td>
         * <td>+n</td>
         * <td>+n</td>
         * </tr>
         * </table>
         * Note that in the "pad after sign" mode, only the last number into the buffer receives the
         * padding. This padding gets incorporated into the whole part of the number. (In other
         * modes, the padding is around <code>result[mark:]</code>.) When this would not be
         * appropriate, it is up to the client to disallow this (which <code>complex</code> does).
         *
         * @return this Formatter object
         */

        _pad1() {
            // We'll need this many pad characters (if>0). Note Spec.UNDEFINED<0.
            let n = this.spec.width - (this.result.length - this.mark);
            if (n > 0) {
                this.pad(this.mark, n);
            }
            return this;
        }

        /**
         * Pad the last result (defined as the contents of {@link #result} from argument
         * <code>leftIndex</code> to the end) using the alignment, by <code>n</code> repetitions of
         * the fill character defined in {@link #spec}, and distributed according to
         * <code>spec.align</code>. The value of <code>leftIndex</code> is only used if the
         * alignment is '&gt;' (left) or '^' (both). The value of the critical lengths (lenWhole,
         * lenSign, etc.) are not affected, because we assume that <code>leftIndex &lt;= </code>
         * {@link #start}.
         *
         * @param leftIndex the index in result at which to insert left-fill characters.
         * @param n number of fill characters to insert.
         */
        _pad2(leftIndex, n) {
            let align = this.spec.getAlign('>'); // Right for numbers (strings will supply '<' align)
            let fill = this.spec.getFill(' ');

            // Start by assuming padding is all leading ('>' case or '=')
            let leading = n;

            // Split the total padding according to the alignment
            if (align === '^') {
                // Half the padding before
                leading = parseInt(n / 2);
            } else if (align === '<') {
                // All the padding after
                leading = 0;
            }

            // All padding that is not leading is trailing
            let trailing = n - leading;

            // Insert the leading space
            if (leading > 0) {
                if (align === '=') {
                    // Incorporate into the (latest) whole part
                    this.leftIndex = this.start + this.lenSign;
                    this.lenWhole += leading;
                } else {
                    // Default is to insert at the stated leftIndex <= start.
                    this.start += leading;
                }
                this.makeSpaceAt(leftIndex, leading);
                for (let i = 0; i < leading; i++) {
                    setCharAt(this.result, this.leftIndex + i, fill);
                }
            }

            // Append the trailing space
            for (let i = 0; i < trailing; i++) {
                this.result += fill;
            }

            // Check for special case
            if (align === '=' && fill === '0' && this.spec.grouping) {
                // We must extend the grouping separator into the padding
                this.zeroPadAfterSignWithGroupingFixup(3, ',');
            }
        }

        /**
         * Fix-up the zero-padding of the last formatted number in {@link #result} in the special
         * case where a sign-aware padding (<code>{@link #spec}.align='='</code>) was requested, the
         * fill character is <code>'0'</code>, and the digits are to be grouped. In these exact
         * circumstances, the grouping, which must already have been applied to the (whole part)
         * number itself, has to be extended into the zero-padding.
         *
         * <pre>
         * &gt;&gt;&gt; format(-12e8, " =30,.3f")
         * '-            1,200,000,000.000'
         * &gt;&gt;&gt; format(-12e8, "*=30,.3f")
         * '-************1,200,000,000.000'
         * &gt;&gt;&gt; format(-12e8, "*&gt;30,.3f")
         * '************-1,200,000,000.000'
         * &gt;&gt;&gt; format(-12e8, "0&gt;30,.3f")
         * '000000000000-1,200,000,000.000'
         * &gt;&gt;&gt; format(-12e8, "0=30,.3f")
         * '-0,000,000,001,200,000,000.000'
         * </pre>
         *
         * The padding has increased the overall length of the result to the target width. About one
         * in three calls to this method adds one to the width, because the whole part cannot start
         * with a comma.
         *
         * <pre>
         * &gt;&gt;&gt; format(-12e8, " =30,.4f")
         * '-           1,200,000,000.0000'
         * &gt;&gt;&gt; format(-12e8, "0=30,.4f")
         * '-<b>0</b>,000,000,001,200,000,000.0000'
         * </pre>
         *
         * @param groupSize normally 3.
         * @param comma or some other character to use as a separator.
         */
        zeroPadAfterSignWithGroupingFixup(groupSize, comma) {
            /*
             * Suppose the format call was format(-12e8, "0=30,.3f"). At this point, we have
             * something like this in result: .. [-|0000000000001,200,000,000|.|000||]
             *
             * All we need do is over-write some of the zeros with the separator comma, in the
             * portion marked as the whole-part: [-|0,000,000,001,200,000,000|.|000||]
             */

            // First digit of the whole-part.
            let firstZero = this.start + this.lenSign;
            // One beyond last digit of the whole-part.
            let p = firstZero + this.lenWhole;
            // Step back down the result array visiting the commas. (Easiest to do all of them.)
            let step = groupSize + 1;
            for (p = p - step; p >= firstZero; p -= step) {
                setCharAt(this.result, p, comma);
            }

            // Sometimes the last write was exactly at the first padding zero.
            if (p + step === firstZero) {
                /*
                 * Suppose the format call was format(-12e8, "0=30,.4f"). At the beginning, we had
                 * something like this in result: . [-|000000000001,200,000,000|.|0000||]
                 *
                 * And now, result looks like this: [-|,000,000,001,200,000,000|.|0000||] in which
                 * the first comma is wrong, but so would be a zero. We have to insert another zero,
                 * even though this makes the result longer than we were asked for.
                 */
                this.result = this.result.substring(0, firstZero) + '0' + this.result.substring(firstZero)
                this.lenWhole += 1;
            }
        }
    }

    /**
     * Parsed PEP-3101 format specification of a single field, encapsulating the format for use by
     * formatting methods. This class holds the several attributes that might be decoded from a
     * format specifier. Each attribute has a reserved value used to indicate "unspecified".
     * <code>Spec</code> objects may be merged such that one <code>Spec</code> provides values,
     * during the construction of a new <code>Spec</code>, for attributes that are unspecified in a
     * primary source.
     * <p>
     * This structure is returned by factory method {@link #fromText(String)}, and having public
     * final members is freely accessed by formatters such as {@link FloatFormatter}, and the
     * __format__ methods of client object types.
     * <p>
     * The fields correspond to the elements of a format specification. The grammar of a format
     * specification is:
     *
     * <pre>
     * [[fill]align][sign][#][0][width][,][.precision][type]
     * </pre>
     *
     * A typical idiom is:
     *
     * <pre>{@literal
     *     private static final InternalFormatSpec FLOAT_DEFAULTS = InternalFormatSpec.from(">");
     *     ...
     *         InternalFormat.Spec spec = InternalFormat.fromText(specString);
     *         spec = spec.withDefaults(FLOAT_DEFAULTS);
     *         ... // Validation of spec.type, and other attributes, for this type.
     *         FloatFormatter f = new FloatFormatter(spec);
     *         String result = f.format(value).getResult();
     * }</pre>
     */
    static Spec = class {

        /** Non-character code point used to represent "no value" in <code>char</code> attributes. */
        static NONE = '\uffff';
        /** Negative value used to represent "no value" in <code>int</code> attributes. */
        static UNSPECIFIED = -1;

        /**
         * Test to see if an attribute has been specified.
         *
         * @param c attribute
         * @return true only if the attribute is not equal to {@link #NONE}
         */
        static specified = c => {
            if (Number.isInteger(c)) {
                return c >= 0;
            }
            return c !== this.NONE;
        }

        /**
         * Constructor to set all the fields in the format specifier.
         *
         * <pre>
         * [[fill]align][sign][#][0][width][,][.precision][type]
         * </pre>
         *
         * @param fill fill character (or {@link #NONE}
         * @param align alignment indicator, one of {'&lt;', '^', '&gt;', '='}
         * @param sign policy, one of <code>'+'</code>, <code>'-'</code>, or <code>' '</code>.
         * @param alternate true to request alternate formatting mode (<code>'#'</code> flag).
         * @param width of field after padding or -1 to default
         * @param grouping true to request comma-separated groups
         * @param precision (e.g. decimal places) or -1 to default
         * @param type indicator character
         */
        constructor(fill, align, sign, alternate, width, grouping, precision, type) {
            this.fill = fill;
            this.align = align;
            this.sign = sign;
            this.alternate = alternate;
            this.width = width;
            this.grouping = grouping;
            this.precision = precision;
            this.type = type || this.constructor.NONE;
        }

        /**
         * Return a format specifier (text) equivalent to the value of this Spec.
         */
        toString() {
            let buf = '';
            if (InternalFormat.Spec.specified(this.fill)) {
                buf += this.fill;
            }
            if (InternalFormat.Spec.specified(this.align)) {
                buf += this.align;
            }
            if (InternalFormat.Spec.specified(this.sign)) {
                buf += this.sign;
            }
            if (this.alternate) {
                buf += '#';
            }
            if (InternalFormat.Spec.specified(this.width)) {
                buf += this.width;
            }
            if (this.grouping) {
                buf += ',';
            }
            if (InternalFormat.Spec.specified(this.precision)) {
                buf += '.' + this.precision;
            }
            if (InternalFormat.Spec.specified(this.type)) {
                buf += this.type;
            }
            return buf.toString();
        }

        /**
         * Return a merged <code>Spec</code> object, in which any attribute of this object that is
         * specified (or <code>true</code>), has the same value in the result, and any attribute of
         * this object that is unspecified (or <code>false</code>), has the value that attribute
         * takes in the other object. Thus the second object supplies default values. (These
         * defaults may also be unspecified.) The use of this method is to allow a <code>Spec</code>
         * constructed from text to record exactly, and only, what was in the textual specification,
         * while the __format__ method of a client object supplies its type-specific defaults. Thus
         * "20" means "&lt;20s" to a <code>str</code>, "&gt;20.12" to a <code>float</code> and
         * "&gt;20.12g" to a <code>complex</code>.
         *
         * @param other defaults to merge where this object does not specify the attribute.
         * @return a new Spec object.
         */
        withDefaults(other) {
            return new InternalFormat.Spec(//
                    this.constructor.specified(this.fill) ? this.fill : other.fill, //
                    this.constructor.specified(this.align) ? this.align : other.align, //
                    this.constructor.specified(this.sign) ? this.sign : other.sign, //
                    this.alternate || other.alternate, //
                    this.constructor.specified(this.width) ? this.width : other.width, //
                    this.grouping || other.grouping, //
                    this.constructor.specified(this.precision) ? this.precision : other.precision, //
                    this.constructor.specified(this.type) ? this.type : other.type //
            );
        }

        // NOTE: .NUMERIC and .STRING moved to bottom of this file

        /** The alignment from the parsed format specification, or default. */
        getFill(defaultFill) {
            return this.constructor.specified(this.fill) ? this.fill : defaultFill;
        }

        /** The alignment from the parsed format specification, or default. */
        getAlign(defaultAlign) {
            return this.constructor.specified(this.align) ? this.align : defaultAlign;
        }

        /** The precision from the parsed format specification, or default. */
        getPrecision(defaultPrecision) {
            return this.constructor.specified(this.precision) ? this.precision : defaultPrecision;
        }

        /** The type code from the parsed format specification, or default supplied. */
        getType(defaultType) {
            return this.constructor.specified(this.type) ? this.type : defaultType;
        }

    }

    /**
     * Parser for PEP-3101 field format specifications. This class provides a {@link #parse()}
     * method that translates the format specification into an <code>Spec</code> object.
     */
    static Parser = class {

        /**
         * Constructor simply holds the specification string ahead of the {@link #parse()}
         * operation.
         *
         * @param spec format specifier to parse (e.g. "&lt;+12.3f")
         */
        constructor(spec) {
            this.spec = spec;
            this.ptr = 0;
        }

        /**
         * Parse the specification with which this object was initialised into an {@link Spec},
         * which is an object encapsulating the format for use by formatting methods. This parser
         * deals only with the format specifiers themselves, as accepted by the
         * <code>__format__</code> method of a type, or the <code>format()</codqe> built-in, not
         * format strings in general as accepted by <code>str.format()</code>.
         *
         * @return the <code>Spec</code> equivalent to the string given.
         */
        /*
         * This method is the equivalent of CPython's parse_internal_render_format_spec() in
         * ~/Objects/stringlib/formatter.h, but we deal with defaults another way.
         */
        parse() {

            let fill = InternalFormat.Spec.NONE;
            let align = InternalFormat.Spec.NONE;
            let sign = InternalFormat.Spec.NONE;
            let type = InternalFormat.Spec.NONE;
            let alternate = false;
            let grouping = false;
            let width = InternalFormat.Spec.UNSPECIFIED;
            let precision = InternalFormat.Spec.UNSPECIFIED;

            // Scan [[fill]align] ...
            if (this.isAlign()) {
                // First is alignment. fill not specified.
                align = this.spec.charAt(this.ptr++);
            } else {
                // Peek ahead
                this.ptr += 1;
                if (this.isAlign()) {
                    // Second character is alignment, so first is fill
                    fill = this.spec.charAt(0);
                    align = this.spec.charAt(this.ptr++);
                } else {
                    // Second character is not alignment. We are still at square zero.
                    this.ptr = 0;
                }
            }

            // Scan [sign] ...
            if (this.isAt("+- ")) {
                sign = this.spec.charAt(this.ptr++);
            }

            // Scan [#] ...
            alternate = this.scanPast('#');

            // Scan [0] ...
            if (this.scanPast('0')) {
                // Accept 0 here as equivalent to zero-fill but only not set already.
                if (!InternalFormat.Spec.specified(fill)) {
                    fill = '0';
                    if (!InternalFormat.Spec.specified(align)) {
                        // Also accept it as equivalent to "=" aligment but only not set already.
                        align = '=';
                    }
                }
            }

            // Scan [width]
            if (this.isDigit()) {
                width = this.scanInteger();
            }

            // Scan [,][.precision][type]
            grouping = this.scanPast(',');

            // Scan [.precision]
            if (this.scanPast('.')) {
                if (this.isDigit()) {
                    precision = this.scanInteger();
                } else {
                    throw new IllegalArgumentException(`Format specifier missing precision: {${this.spec}}`);
                }
            }

            // Scan [type]
            if (this.ptr < this.spec.length) {
                type = this.spec.charAt(this.ptr++);
            }

            // If we haven't reached the end, something is wrong
            if (this.ptr !== this.spec.length) {
                throw new IllegalArgumentException(`Invalid conversion specification: {${this.spec}}`);
            }

            // Create a specification
            return new InternalFormat.Spec(fill, align, sign, alternate, width, grouping, precision, type);
        }

        /** Test that the next character is exactly the one specified, and advance past it if it is. */
        scanPast(c) {
            if (this.ptr < this.spec.length && this.spec.charAt(this.ptr) === c) {
                this.ptr++;
                return true;
            } else {
                return false;
            }
        }

        /** Test that the next character is one of a specified set. */
        isAt(chars) {
            return this.ptr < this.spec.length && (chars.indexOf(this.spec.charAt(this.ptr)) >= 0);
        }

        /** Test that the next character is one of the alignment characters. */
        isAlign() {
            return this.ptr < this.spec.length && ("<^>=".indexOf(this.spec.charAt(this.ptr)) >= 0);
        }

        /** Test that the next character is a digit. */
        isDigit() {
            return this.ptr < this.spec.length && Number.isInteger(parseInt(this.spec.charAt(this.ptr)));
        }

        /** The current character is a digit (maybe a sign). Scan the integer, */
        scanInteger() {
            let p = this.ptr++;
            while (this.isDigit()) {
                this.ptr++;
            }
            return parseInt(this.spec.substring(p, this.ptr));
        }

    }

}


/** Defaults applicable to most numeric types. Equivalent to " &gt;" */
InternalFormat.Spec.NUMERIC = new InternalFormat.Spec(' ', '>', InternalFormat.Spec.NONE, false, InternalFormat.Spec.UNSPECIFIED,
        false, InternalFormat.Spec.UNSPECIFIED, InternalFormat.Spec.NONE);

/** Defaults applicable to string types. Equivalent to " &lt;" */
InternalFormat.Spec.STRING = new InternalFormat.Spec(' ', '<', InternalFormat.Spec.NONE, false, InternalFormat.Spec.UNSPECIFIED,
        false, InternalFormat.Spec.UNSPECIFIED, InternalFormat.Spec.NONE);



//////////////////////////////////////////////////////////////
///  Utility functions added onto the Jython codebase

function setCharAt(st, index, replacement) {
    return st.substr(0, index) + replacement + st.substr(index + replacement.length);
}

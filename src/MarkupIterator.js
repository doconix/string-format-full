// Transcoded to Javascript by Conan Albrecht <doconix@gmail.com>
import { IllegalArgumentException } from './exceptions'

/**
 * Provides an implementation of the object that <code>str._formatter_parser()</code> returns, which
 * is an iterator returning successive 4-tuples, the sequence being equivalent to the original
 * string.
 */
export class MarkupIterator {

    static TYPE = 'MarkupIterator';

    // switcher to emulate overloaded constructor
    constructor(...args) {
        if (args.length >= 2) {
            return this.constructor2(...args)
        }
        return this.constructor1(...args)
    }

    /** Constructor used at top-level to enumerate a format. */
    constructor1(markupObject) {
        this.markup = markupObject.getString();
        this.bytes = false; // .bytes not used in this JS version
        this.numbering = new MarkupIterator.FieldNumbering();
    }

    /** Variant constructor used when formats are nested. */
    constructor2(enclosingIterator, subMarkup) {
        this.markup = subMarkup;
        this.bytes = enclosingIterator.bytes;
        this.numbering = enclosingIterator.numbering;
    }

    /**
     * Return the next {@link Chunk} from the iterator, which is a structure containing parsed
     * elements of the replacement field (if any), and its preceding text. This is the Java
     * equivalent of the tuple returned by {@link #__iternext__()}. This finds use in the
     * implementation of <code>str.format</code> and <code>unicode.format</code>.
     *
     * @return the chunk
     */
    nextChunk() {
        if (this.index === this.markup.length) {
            return null;
        }
        let result = new MarkupIterator.Chunk();

        // pos = index is the index of the first text not already chunked
        let pos = this.index;

        // Advance pos to the first '{' that is not a "{{" (escaped brace), or pos<0 if none such.
        while (true) {
            pos = this.indexOfFirst(this.markup, pos, '{', '}');
            if (pos >= 0 && pos < this.markup.length - 1
                    && this.markup.charAt(pos + 1) === this.markup.charAt(pos)) {
                // skip escaped bracket
                pos += 2;
            } else if (pos >= 0 && this.markup.charAt(pos) === '}') {
                // Un-escaped '}' is a syntax error
                throw new IllegalArgumentException("Single '}' encountered in format string");
            } else {
                // pos is at an un-escaped '{'
                break;
            }
        }

        // markup[index:pos] is the literal part of this chunk.
        if (pos < 0) {
            // ... except pos<0, and there is no further format specifier, only literal text.
            result.literalText = this.unescapeBraces(this.markup.substring(this.index));
            this.index = this.markup.length;

        } else {
            // Grab the literal text, dealing with escaped braces.
            result.literalText = this.unescapeBraces(this.markup.substring(this.index, pos));
            // Scan through the contents of the format spec, between the braces. Skip one '{'.
            pos++;
            let fieldStart = pos;
            let count = 1;
            while (pos < this.markup.length) {
                if (this.markup.charAt(pos) === '{') {
                    // This means the spec we are gathering itself contains nested specifiers.
                    count++;
                    result.formatSpecNeedsExpanding = true;
                } else if (this.markup.charAt(pos) === '}') {
                    // And here is a '}' matching one we already counted.
                    count--;
                    if (count === 0) {
                        // ... matching the one we began with: parse the replacement field.
                        this.parseField(result, this.markup.substring(fieldStart, pos));
                        pos++;
                        break;
                    }
                }
                pos++;
            }
            if (count > 0) {
                // Must be end of string without matching '}'.
                throw new IllegalArgumentException("Single '{' encountered in format string");
            }
            this.index = pos;
        }
        return result;
    }

    /**
     * If originally given a PyString, string elements in the returned tuples must be PyString not
     * PyUnicode.
     *
     * @return true if originally given a PyString
     */
    isBytes() {
        return this.bytes;
    }

    unescapeBraces(substring) {
        return substring.replace("{{", "{").replace("}}", "}");
    }

    /**
     * Parse a "replacement field" consisting of a name, conversion and format specification.
     * According to the Python Standard Library documentation, a replacement field has the
     * structure:
     *
     * <pre>
     * replacement_field ::=  "{" [field_name] ["!" conversion] [":" format_spec] "}"
     * field_name        ::=  arg_name ("." attribute_name | "[" element_index "]")*
     * arg_name          ::=  [identifier | integer]
     * attribute_name    ::=  identifier
     * element_index     ::=  integer | index_string
     * </pre>
     *
     * except at this point, we have already discarded the outer braces.
     *
     * @param result destination chunk
     * @param fieldMarkup specifying a replacement field, possibly with nesting
     */
    parseField(result, fieldMarkup) {
        let pos = this.indexOfFirst(fieldMarkup, 0, '!', ':');
        if (pos >= 0) {
            // There's a '!' or a ':', so what precedes the first of them is a field name.
            result.fieldName = fieldMarkup.substring(0, pos);
            if (fieldMarkup.charAt(pos) === '!') {
                // There's a conversion specifier
                if (pos === fieldMarkup.length - 1) {
                    throw new IllegalArgumentException("end of format while "
                            + "looking for conversion specifier");
                }
                result.conversion = fieldMarkup.substring(pos + 1, pos + 2);
                pos += 2;
                // And if that's not the end, there ought to be a ':' now.
                if (pos < fieldMarkup.length) {
                    if (fieldMarkup.charAt(pos) !== ':') {
                        throw new IllegalArgumentException("expected ':' "
                                + "after conversion specifier");
                    }
                    // So the format specifier is from the ':' to the end.
                    result.formatSpec = fieldMarkup.substring(pos + 1);
                }
            } else {
                // No '!', so the format specifier is from the ':' to the end. Or empty.
                result.formatSpec = fieldMarkup.substring(pos + 1);
            }
        } else {
            // Neither a '!' nor a ':', the whole thing is a name.
            result.fieldName = fieldMarkup;
        }

        if (!result.fieldName) {
            // The field was empty, so generate a number automatically.
            result.fieldName = this.numbering.nextAutomaticFieldNumber();
            return;
        }

        // Automatic numbers must also work when there is an .attribute or [index]
        let c = result.fieldName.charAt(0);
        if (c === '.' || c === '[') {
            result.fieldName = this.numbering.nextAutomaticFieldNumber() + result.fieldName;
            return;
        }

        // Finally, remember the argument number was specified (perhaps complain of mixed use)
        if (Number.isInteger(parseInt(c))) {
            this.numbering.useManualFieldNumbering();
        }
    }

    /** Find the first of two characters, or return -1. */
    indexOfFirst(s, start, c1, c2) {
        let i1 = s.indexOf(c1, start);
        let i2 = s.indexOf(c2, start);
        if (i1 === -1) {
            return i2;
        }
        if (i2 === -1) {
            return i1;
        }
        return Math.min(i1, i2);
    }

    /**
     * Class used locally to assign indexes to the automatically-numbered arguments (see String
     * Formatting section of the Python Standard Library).
     */
    static FieldNumbering = class {

        constructor() {
            this.manualFieldNumberSpecified = false;
            this.automaticFieldNumber = 0;
        }

        /**
         * Generate a numeric argument index automatically, or raise an error if already started
         * numbering manually.
         *
         * @return index as string
         */
        nextAutomaticFieldNumber() {
            if (this.manualFieldNumberSpecified) {
                throw new IllegalArgumentException(
                        "cannot switch from manual field specification to automatic field numbering");
            }
            return String(this.automaticFieldNumber++);
        }

        /**
         * Remember we are numbering manually, and raise an error if already started numbering
         * automatically.
         */
        useManualFieldNumbering() {
            if (this.manualFieldNumberSpecified) {
                return;
            }
            if (this.automaticFieldNumber !== 0) {
                throw new IllegalArgumentException(
                        "cannot switch from automatic field numbering to manual field specification");
            }
            this.manualFieldNumberSpecified = true;
        }
    }

    static Chunk = class {
        constructor() {
            /** The text leading up to the next format field. */
            this.literalText = null;
            /** The field name or number (as a string) for accessing the value. */
            this.fieldName = null;
            /** The format specifier such as <code>"#12x"</code>. */
            this.formatSpec = null;
            /** Conversion to be applied, e.g. <code>'r'</code> for <code>repr()</code>. */
            this.conversion = null;
            /** Signals the <code>formatSpec</code> needs expanding recursively. */
            this.formatSpecNeedsExpanding = null;
        }
    }
}

// Transcoded to Javascript by Conan Albrecht <doconix@gmail.com>
import { IllegalArgumentException } from './exceptions'

/**
 * This class is an implementation of the iterator object returned by
 * <code>str._formatter_field_name_split()</code> and
 * <code>unicode._formatter_field_name_split()</code>. The function
 * <code>_formatter_field_name_split()</code> returns a pair (tuple) consisting of a head element
 * and an instance of this iterator. The constructor of this class effectively implements that
 * function, since as well as "being" the iterator, the object has an extra method {@link #head()}
 * to return the required first member of the pair.
 */

export class FieldNameIterator {

    /**
     * Create an iterator for the parts of this field name (and extract the head name field, which
     * may be an empty string). According to the Python Standard Library documentation, a
     * replacement field name has the structure:
     *
     * <pre>
     * field_name        ::=  arg_name ("." attribute_name | "[" element_index "]")*
     * arg_name          ::=  [identifier | integer]
     * attribute_name    ::=  identifier
     * element_index     ::=  integer | index_string
     * </pre>
     *
     * The object is used from PyUnicode and from PyString, and we have to signal which it is, so
     * that returned values may match in type.
     *
     * @param fieldName the field name as UTF-16
     * @param bytes true if elements returned should be PyString, else PyUnicode
     */
    constructor(fieldName, bytes) {
        this.markup = fieldName;
        this.bytes = false;     // .bytes is not used because JS is always unicode
        this.index = this.nextDotOrBracket(fieldName);
        let headStr = fieldName.substring(0, this.index);
        this.head = +headStr;
        if (isNaN(this.head)) {
            this.head = headStr;
        }
    }

    /**
     * Convenience method to wrap a value as a PyInteger, if it is an Integer, or as
     * <code>PyString</code> or <code>PyUnicode</code> according to the type of the original field
     * name string. These objects are being used as field specifiers in navigating arguments to a
     * format statement.
     *
     * @param value to wrap as a PyObject.
     * @return PyObject equivalent field specifier
     */
    wrap(value) {
        if (Number.isInteger(parseInt(value))) {
            return parseInt(value)
        } else {
            return String(value)
        }
    }

    nextDotOrBracket(markup) {
        let dotPos = markup.indexOf('.', this.index);
        if (dotPos < 0) {
            dotPos = markup.length;
        }
        let bracketPos = markup.indexOf('[', this.index);
        if (bracketPos < 0) {
            bracketPos = markup.length;
        }
        return Math.min(dotPos, bracketPos);
    }

    /** @return the isolated head object from the field name. */
    head() {
        return this.head;
    }

    pyHead() {
        return this.wrap(this.head);
    }

    *[Symbol.iterator]() {
        while (true) {
            let chunk = this.nextChunk();
            if (chunk === null) {
                return;
            }
            yield [chunk.is_attr, this.wrap(chunk.value)];
        }
    }

    /**
     * Return the next "chunk" of the field name (or return null if ended). A chunk is a 2-tuple
     * describing:
     * <ol start=0>
     * <li>whether the chunk is an attribute name,</li>
     * <li>the name or number (as a String or Integer) for accessing the value.</li>
     * </ol>
     *
     * @return next element of the field name
     */
    nextChunk() {
        if (this.index === this.markup.length) {
            return null;
        }
        let chunk = new FieldNameIterator.Chunk();
        if (this.markup.charAt(this.index) === '[') {
            this.parseItemChunk(chunk);
        } else if (this.markup.charAt(this.index) === '.') {
            this.parseAttrChunk(chunk);
        } else {
            throw new IllegalArgumentException(
                    "Only '.' or '[' may follow ']' in format field specifier");
        }
        return chunk;
    }

    parseItemChunk(chunk) {
        chunk.is_attr = false;
        let endBracket = this.markup.indexOf(']', this.index + 1);
        if (endBracket < 0) {
            throw new IllegalArgumentException("Missing ']' in format string");
        }
        let itemValue = this.markup.substring(this.index + 1, endBracket);
        if (itemValue.length === 0) {
            throw new IllegalArgumentException("Empty attribute in format string");
        }
        try {
            chunk.value = parseInt(itemValue);
        } catch (e) {
            chunk.value = itemValue;
        }
        this.index = endBracket + 1;
    }

    parseAttrChunk(chunk) {
        this.index++;   // skip dot
        chunk.is_attr = true;
        let pos = this.nextDotOrBracket(this.markup);
        if (pos === this.index) {
            throw new IllegalArgumentException("Empty attribute in format string");
        }
        chunk.value = this.markup.substring(this.index, pos);
        this.index = pos;
    }

    static Chunk = class {
        constructor() {
            this.is_attr = null;
            this.value = null;
        }
    }

}

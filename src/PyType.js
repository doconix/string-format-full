import { FieldNameIterator } from './FieldNameIterator'
import { MarkupIterator } from './MarkupIterator'
import { ValueError } from './exceptions'


/**
 * Jython implements classes for the various types: PyString, PyInteger, PyLong, PyFloat, etc.
 * Each of these classes handles a different set of formatting spec types.
 *
 * Rather than transcode each class in full, the common code relevant to formatting
 * is lifted from here.
 */
export class PyType {
    static TYPE = 'PyType'
    static REGISTRY = {}

    constructor(st) {
        this.st = st
    }

    getString() {
        return this.st
    }

    /**
     * The primary method that formats this string by interpolating
     * the provided args.
     *
     * See also index.js :: format()
     */
    format(...args) {
        if (this.st === undefined || this.st === null) {
            throw Error('cannot format value: ' + String(this.st))
        }
        const lookups = this.parseArgs(...args)
        return this.buildFormattedString(lookups, null, null)
    }

    /**
     * Parses the given args into a lookups dictionary.
     * This method is a departure from the Jython, but placing in a single JS object
     * rather than separating into args/keywords makes key lookups more clear
     * because they are in a single object rather than two.
     */
    parseArgs(...args) {
        let idx = 0
        const lookups = {}
        for (const arg of args) {
            if (!Array.isArray(arg) && typeof arg === 'object' && arg !== null) {
                // arg is object, so extend into lookups
                Object.assign(lookups, arg)

            }else{
                // arg is some other type, so make it an indexed item
                lookups[String(idx)] = arg
                idx += 1
            }
        }
        return lookups
    }

    /**
     * Implements PEP-3101 {}-formatting methods <code>str.format()</code> and
     * <code>unicode.format()</code>. When called with <code>enclosingIterator === null</code>, this
     * method takes this object as its formatting string. The method is also called (calls itself)
     * to deal with nested formatting specifications. In that case, <code>enclosingIterator</code>
     * is a {@link MarkupIterator} on this object and <code>value</code> is a substring of this
     * object needing recursive translation.
     *
     * @param lookups to be interpolated into the string
     * @param enclosingIterator when used nested, null if subject is this <code>PyString</code>
     * @param value the format string when <code>enclosingIterator</code> is not null
     * @return the formatted string based on the arguments
     */
    buildFormattedString(lookups, enclosingIterator, value) {
        let it;
        if (enclosingIterator === null) {
            // Top-level call acts on this object.
            it = new MarkupIterator(this);
        } else {
            // Nested call acts on the substring and some state from existing iterator.
            it = new MarkupIterator(enclosingIterator, value);
        }

        // Result will be formed here
        let result = '';

        while (true) {
            let chunk = it.nextChunk();
            if (chunk === null) {
                break;
            }
            // A Chunk encapsulates a literal part ...
            result += chunk.literalText;
            // ... and the parsed form of the replacement field that followed it (if any)
            if (chunk.fieldName !== null) {
                // The grammar of the replacement field is:
                // "{" [field_name] ["!" conversion] [":" format_spec] "}"

                // Get the object referred to by the field name (which may be omitted).
                let fieldObj = this.getFieldObject(chunk.fieldName, it.isBytes(), lookups);
                // Python codes None to 'None'
                if (fieldObj === null) {
                    fieldObj = 'null';
                }

                // The format_spec may be simple, or contained nested replacement fields.
                let formatSpec = chunk.formatSpec;
                if (chunk.formatSpecNeedsExpanding) {
                    if (enclosingIterator !== null) {
                        // PEP 3101 says only 2 levels
                        throw new ValueError("Max string recursion exceeded");
                    }
                    // Recursively interpolate further args into chunk.formatSpec
                    formatSpec = this.buildFormattedString(lookups, it, formatSpec);
                }
                result = this.renderField(fieldObj, formatSpec, result);
            }
        }
        return result;
    }

    /**
     * Return the object referenced by a given field name, interpreted in the context of the given
     * argument list, containing positional and keyword arguments.
     *
     * @param fieldName to interpret.
     * @param bytes true if the field name is from a PyString, false for PyUnicode.
     * @param lookups values to be interpolated.
     * @return the object designated or <code>null</code>.
     */
    getFieldObject(fieldName, bytes, lookups) {
        let iterator = new FieldNameIterator(fieldName, bytes);
        let head = iterator.pyHead();
        let obj = null;

        // the value can be undefined/null, so need to use hasOwnProperty to explicitly see if key exists
        if (lookups.hasOwnProperty(String(head))) {
            obj = lookups[String(head)]
        }else{
            if (Number.isInteger(head)) {
                throw new ValueError(`index out of range: ${head}`)
            }else{
                throw new ValueError(`named index not defined: ${head}`)
            }
        }

        // Now deal with the iterated sub-fields
        while (obj !== null) {
            let chunk = iterator.nextChunk();
            if (chunk === null) {
                // End of iterator
                break;
            }
            let key = chunk.value;
            if (chunk.is_attr) {
                // key must be a String
                obj = obj[String(key)]
            } else {
                if (Number.isInteger(parseInt(key))) {
                    // Can this happen?
                    obj = obj[parseInt(key)]
                } else {
                    obj = obj[String(key)]
                }
            }
        }
        return obj;
    }

    /**
     * Append to a formatting result, the presentation of one object, according to a given format
     * specification and the object's <code>__format__</code> method.
     *
     * @param fieldObj to format.
     * @param formatSpec specification to apply.
     * @param result to which the result will be appended.
     */
    renderField(fieldObj, formatSpec, result) {
        result += String(this.renderFieldObj(fieldObj, formatSpec));
        return result
    }

    /**
     * Renders a single field.
     *
     * This is the primary switcher that determines which formatter to use.
     */
    renderFieldObj(fieldObj, formatSpec) {
        let FieldType = null
        if (typeof fieldObj === 'number') {
            if (parseInt(fieldObj) === fieldObj) {
                FieldType = this.constructor.REGISTRY.PyInteger
            }else{
                FieldType = this.constructor.REGISTRY.PyFloat
            }
        }
        if (!FieldType) {
            FieldType = this.constructor.REGISTRY.PyString
        }
        let formatSpecStr = formatSpec === null ? '' : String(formatSpec);

        if (fieldObj?.constructor.TYPE !== FieldType.TYPE) {
            fieldObj = new FieldType(fieldObj)
        }
        return fieldObj.__format__(formatSpecStr);
    }

}

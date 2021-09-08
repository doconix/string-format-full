import { InternalFormat } from './InternalFormat'
import { PyType } from './PyType'
import { TextFormatter } from './TextFormatter'
import { FormatError } from './exceptions'


/**
 * Jython implements classes for the various types: PyString, PyInteger, PyLong, PyFloat, etc.
 * Each of these classes handles a different set of formatting spec types.
 *
 * Rather than transcode each class in full, the common code relevant to formatting
 * is lifted from here.
 */
export class PyString extends PyType {
    static TYPE = 'PyString'
    static FormatterClass = TextFormatter

    __format__(formatSpec) {
        // Parse the specification
        let spec = InternalFormat.fromText(formatSpec);

        // Get a formatter for the specification
        let f = this.constructor.prepareFormatter(spec);
        if (!f) {
            // The type code was not recognised
            throw FormatError.unknownFormat(spec.type, "string");
        }

        // Convert as per specification.
        if (typeof this.st === 'string' || this.st instanceof String) {
            f.format(this.st);
        }else{
            f.format(String(this.st))
        }

        // Return a result that has the same type (str or unicode) as the formatSpec argument.
        return f.pad().getResult();
    }

    /**
     * Common code for {@link PyString} and {@link PyUnicode} to prepare a {@link TextFormatter}
     * from a parsed specification. The object returned has format method
     * {@link TextFormatter#format(String)} that treats its argument as UTF-16 encoded unicode (not
     * just <code>char</code>s). That method will format its argument ( <code>str</code> or
     * <code>unicode</code>) according to the PEP 3101 formatting specification supplied here. This
     * would be used during <code>text.__format__(".5s")</code> or
     * <code>"{:.5s}".format(text)</code> where <code>text</code> is this Python string.
     *
     * @param spec a parsed PEP-3101 format specification.
     * @return a formatter ready to use, or null if the type is not a string format type.
     * @throws PyException {@code ValueError} if the specification is faulty.
     */
    static prepareFormatter(spec) {
        switch (spec.type) {

            case InternalFormat.Spec.NONE:
            case 's':
                // Check for disallowed parts of the specification
                if (spec.grouping) {
                    throw FormatError.notAllowed("Grouping", "string", spec.type);
                } else if (InternalFormat.Spec.specified(spec.sign)) {
                    throw FormatError.signNotAllowed("string", '\0');
                } else if (spec.alternate) {
                    throw FormatError.alternateFormNotAllowed("string");
                } else if (spec.align === '=') {
                    throw FormatError.alignmentNotAllowed('=', "string");
                }
                // spec may be incomplete. The defaults are those commonly used for string formats.
                spec = spec.withDefaults(InternalFormat.Spec.STRING);
                // Get a formatter for the specification
                return new this.FormatterClass(spec);

            default:
                // The type code was not recognised
                return null;
        }
    }
}

// register our type
PyType.REGISTRY.PyString = PyString

// Copyright (c) Corporation for National Research Initiatives
// Copyright (c) Jython Developers
// Transcoded to Javascript by Conan Albrecht <doconix@gmail.com>

import { PyFloat } from './PyFloat'
import { PyType } from './PyType'
import { InternalFormat } from './InternalFormat'
import { IntegerFormatter } from './IntegerFormatter'
import { FormatError } from './exceptions'

/**
 * Specialization for integers.
 */
export class PyInteger extends PyType {
    static TYPE = 'PyInteger'
    static FormatterClass = IntegerFormatter

    __format__(formatSpec) {
        // Parse the specification
        let spec = InternalFormat.fromText(formatSpec);

        // Try to make an integer formatter from the specification
        let f = this.constructor.prepareFormatter(spec);
        if (f) {
            f.format(this.st);

        }else{
            // Try to make a float formatter from the specification
            f = PyFloat.prepareFormatter(spec);
            if (f) {
                // Convert as per specification.
                f.format(this.st);

            } else {
                // The type code was not recognised in either prepareFormatter
                throw FormatError.unknownFormat(spec.type, "integer");
            }
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

            case 'c':
                // Character data: specific prohibitions.
                if (InternalFormat.Spec.specified(spec.sign)) {
                    throw FormatError.signNotAllowed("integer", spec.type);
                } else if (spec.alternate) {
                    throw FormatError.alternateFormNotAllowed("integer", spec.type);
                }
                // Fall through

            case 'x':
            case 'X':
            case 'o':
            case 'b':
            case 'n':
                if (spec.grouping) {
                    throw FormatError.notAllowed("Grouping", "integer", spec.type);
                }
                // Fall through

            case InternalFormat.Spec.NONE:
            case 'd':
                // Check for disallowed parts of the specification
                if (InternalFormat.Spec.specified(spec.precision)) {
                    throw FormatError.precisionNotAllowed("integer");
                }
                // spec may be incomplete. The defaults are those commonly used for numeric formats.
                spec = spec.withDefaults(InternalFormat.Spec.NUMERIC);
                // Get a formatter for the spec.
                return new this.FormatterClass(spec);

            default:
                // The type code was not recognised
                return null

        }
    }
}

// register with PyType
PyType.REGISTRY.PyInteger = PyInteger

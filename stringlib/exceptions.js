/**
 * Base class of errors in the stringlib module.
 */
export class PyError extends Error {
    constructor(name, message, ...args) {
        super(message, ...args)
        this.name = name
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, FormatError)
        }
    }

    toString() {
        return `[${this.name}] ${this.message}`
    }
}

/**
 * Adds convenience methods to match the Jython code.
 */
export class FormatError extends PyError {

    /**
     * Convenience method returning a {@link Py#ValueError} reporting:
     * <p>
     * <code>"Unknown format code '"+code+"' for object of type '"+forType+"'"</code>
     *
     * @param code the presentation type
     * @param forType the type it was found applied to
     * @return exception to throw
     */
    static unknownFormat(code, forType) {
        const msg = "Unknown format code '" + code + "' for object of type '" + forType + "'";
        return new this('UnknownFormat', msg);
    }

    /**
     * Convenience method returning a {@link Py#ValueError} reporting that alternate form is not
     * allowed in a format specifier for the named type and specified typoe code.
     *
     * @param forType the type it was found applied to
     * @param code the formatting code (or '\0' not to mention one)
     * @return exception to throw
     */
    static alternateFormNotAllowed(forType, code='\0') {
        return this.notAllowed("Alternate form (#)", forType, code);
    }

    /**
     * Convenience method returning a {@link Py#ValueError} reporting that the given alignment
     * flag is not allowed in a format specifier for the named type.
     *
     * @param align type of alignment
     * @param forType the type it was found applied to
     * @return exception to throw
     */
    static alignmentNotAllowed(align, forType) {
        return this.notAllowed("'" + align + "' alignment flag", forType, '\0');
    }

    /**
     * Convenience method returning a {@link Py#ValueError} reporting that specifying a sign is
     * not allowed in a format specifier for the named type.
     *
     * @param forType the type it was found applied to
     * @param code the formatting code (or '\0' not to mention one)
     * @return exception to throw
     */
    static signNotAllowed(forType, code) {
        return this.notAllowed("Sign", forType, code);
    }

    /**
     * Convenience method returning a {@link Py#ValueError} reporting that specifying a
     * precision is not allowed in a format specifier for the named type.
     *
     * @param forType the type it was found applied to
     * @return exception to throw
     */
    static precisionNotAllowed(forType) {
        return this.notAllowed("Precision", forType, '\0');
    }

    /**
     * Convenience method returning a {@link Py#ValueError} reporting that zero padding is not
     * allowed in a format specifier for the named type.
     *
     * @param forType the type it was found applied to
     * @return exception to throw
     */
    static zeroPaddingNotAllowed(forType) {
        return this.notAllowed("Zero padding", forType, '\0');
    }

    /**
     * Convenience method returning a {@link Py#ValueError} reporting that some format specifier
     * feature is not allowed for the named format code and data type. Produces a message like:
     * <p>
     * <code>outrage+" not allowed with "+forType+" format specifier '"+code+"'"</code>
     * <p>
     * <code>outrage+" not allowed in "+forType+" format specifier"</code>
     *
     * @param outrage committed in the present case
     * @param forType the data type (e.g. "integer") it where it is an outrage
     * @param code the formatting code for which it is an outrage (or '\0' not to mention one)
     * @return exception to throw
     */
    static notAllowed(outrage, forType, code='\0') {
        // Try really hard to be like CPython
        let codeAsString, withOrIn;
        if (code === '\0') {
            withOrIn = "in ";
            codeAsString = "";
        } else {
            withOrIn = "with ";
            codeAsString = " '" + code + "'";
        }
        let msg =
                outrage + " not allowed " + withOrIn + forType + " format specifier"
                        + codeAsString;
        return new this('NotAllowed', msg);
    }

    /**
     * Convenience method returning a {@link Py#OverflowError} reporting:
     * <p>
     * <code>"formatted "+type+" is too long (precision too large?)"</code>
     *
     * @param type of formatting ("integer", "float")
     * @return exception to throw
     */
    static precisionTooLarge(type) {
        let msg = "formatted " + type + " is too long (precision too large?)";
        return new this('PrecisionTooLarge', msg);
    }
}


/////////////////////////////////////////////
///  Analogs for built-in Python exceptions
///  Using explicit names so minifiers don't munch them.

export class IllegalArgumentException extends PyError {
    constructor(message) {
        super('IllegalArgumentException', message)
    }
}

export class ValueError extends PyError {
    constructor(message) {
        super('ValueError', message)
    }
}

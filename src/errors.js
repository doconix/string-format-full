/**
 * Python's exception types. Each is raised where CPython raises it, with CPython's message.
 *
 * The name is a getter rather than the class name so that it survives minification.
 */
export class PyError extends Error {
    get name() { return 'PyError' }
}

/** A malformed template or format spec, or a spec the value's type does not allow. */
export class ValueError extends PyError {
    get name() { return 'ValueError' }
}

/** Base of the two errors raised when an argument is missing. */
export class LookupError extends PyError {
    get name() { return 'LookupError' }
}

/** A positional argument or sequence index that does not exist. */
export class IndexError extends LookupError {
    get name() { return 'IndexError' }
}

/** A named argument or mapping key that does not exist. */
export class KeyError extends LookupError {
    get name() { return 'KeyError' }
}

/** A `.name` in a field that the object does not have. */
export class AttributeError extends PyError {
    get name() { return 'AttributeError' }
}

/** A number outside the range the presentation type can show. */
export class OverflowError extends PyError {
    get name() { return 'OverflowError' }
}

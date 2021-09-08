// importing these files allows them to register with PyType
import {PyString} from './PyString'
import {PyInteger} from './PyInteger'
import {PyFloat} from './PyFloat'
import {MarkupIterator} from './MarkupIterator'
import {
    PyError,
    FormatError,
    IllegalArgumentException,
    ValueError,
} from './exceptions'


/**
 * Primary exported function to format a string  using Python's .format() mini-language.
 * This is really just a wrapper around PyString.format.
 *
 * If st is undefined or null, it is simply returned. This is different from the TypeError
 * that python throws, but it makes this interface function follow JS culture.
 *
 * See also PyType.js :: format (which this calls).
 * See also enable.js for shimming the global String prototype.
 */
function format(st, ...args) {
    if (st === undefined || st === null) {
        return st
    }
    st = new PyString(st)
    return st.format(...args)
}



/*
 * Adds .format the Javscript's String type, enabling python-style code:
 *     console.log(
 *          '{} is a favorite color'.format('blue')
 *     )
 *
 * This only needs to be called once per page.
 */
function enableGlobalFormat() {
    Object.defineProperty(String.prototype, 'format', {
        value: function (...args) {
            return format(this, ...args)
        },
    })
}


// default export
export default format

// named exports
export {
    format,
    enableGlobalFormat,

    // lower-level items
    PyString,
    PyInteger,
    PyFloat,
    MarkupIterator,
    PyError,
    FormatError,
    IllegalArgumentException,
    ValueError,
}

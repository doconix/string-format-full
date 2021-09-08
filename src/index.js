// importing these files allows them to register with PyType
import {PyString} from './PyString'
import {PyInteger} from './PyInteger'
import {PyFloat} from './PyFloat'

export { PyString, PyInteger, PyFloat }

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
export function format(st, ...args) {
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
 * This is exported from the main library as `format.enableGlobal`
 */
export function enableGlobal() {
    Object.defineProperty(String.prototype, 'format', {
        value: function (...args) {
            return format(this, ...args)
        },
    })
}

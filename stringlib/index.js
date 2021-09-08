// importing these files allows them to register with PyType
import { PyString } from './PyString'
import './PyInteger'
import './PyFloat'


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

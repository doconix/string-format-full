import {OPTIONS} from './options'

// importing these files allows them to register with PyType
import {PyString} from './PyString'
import {PyInteger} from './PyInteger'
import {PyFloat} from './PyFloat'

// see ../index.js, where these are added to the format function
export {
    PyString,
    PyInteger,
    PyFloat,
}
export {
    PyError,
    FormatError,
    IllegalArgumentException,
    IndexError,
    KeyError,
    ValueError,
} from './exceptions'


/**
 * MAIN FUNCTION exported by the library.
 * Formats a string using Python's .format() mini-language.
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


/**
 * Sets global options for the entire library.
 * Example:
 *
 *      format.setOptions({
 *          global: true,
 *          strict: false,
 *      })
 *
 * ../index.js exports this function as format.setOptions.
 */
export function setOptions(options) {
    // update the OPTIONS object
    Object.assign(OPTIONS, options)

    // adjust the global .format function
    const desc = Object.getOwnPropertyDescriptor(String.prototype, 'format')
    if (!OPTIONS.global && desc) {      // need to remove
        try {
            delete String.prototype.format
        }catch(err) {
            console.warn('string-format-full could not remove String.prototype.format')
            throw err
        }
    }else if (OPTIONS.global) {         // need to add
        try {
            Object.defineProperty(String.prototype, 'format', {
                configurable: true,
                writable: true,
                value: function (...args) {
                    return format(this, ...args)
                },
            })
        }catch(err) {
            console.warn('string-format-full failed monkey-patching String.prototype.format')
            throw err
        }
    }
}


////////////////////////////////////////////////
///              DEPRECATED

// instead of enableGlobal: format.setOptions({global: true})
export function enableGlobal() {
    Object.defineProperty(String.prototype, 'format', {
        value: function (...args) {
            return format(this, ...args)
        },
    })
}

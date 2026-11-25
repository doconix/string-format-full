import { OPTIONS } from './options.js'
import { Template } from './template.js'
import { PyString, PyInteger, PyFloat } from './types.js'
import { PyError, ValueError, LookupError, IndexError, KeyError, AttributeError, OverflowError } from './errors.js'

/**
 * Formats a string the way Python's str.format() does.
 *
 *     format('{} is {:.2f}', 'pi', 3.14159)            // positional arguments
 *     format('{name} is {value:.2f}', {name, value})   // named arguments: one plain object
 *
 * A null or undefined template is returned as it is.
 */
export default function format(template, ...args) {
    if (template === undefined || template === null) {
        return template
    }
    const named = args.length === 1 && isPlainObject(args[0])
    return Template.compile(String(template)).render(named ? args[0] : args)
}

/**
 * Sets library-wide options (see options.js):
 *
 *     format.setOptions({global: true, strict: false})
 */
export function setOptions(options) {
    Object.assign(OPTIONS, options)
    if (OPTIONS.global) {
        Object.defineProperty(String.prototype, 'format', {configurable: true, writable: true, value: stringFormat})
    } else if (String.prototype.format === stringFormat) {
        delete String.prototype.format
    }
}

/** String.prototype.format, while the global option is on. */
function stringFormat(...args) {
    return format(this, ...args)
}

/** Thanks to https://github.com/sindresorhus/is-plain-obj for this test. */
function isPlainObject(value) {
    if (typeof value !== 'object' || value === null) {
        return false
    }
    const prototype = Object.getPrototypeOf(value)
    return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null)
        && !(Symbol.toStringTag in value) && !(Symbol.iterator in value)
}

// everything is also reachable from the function, which is all a <script> tag provides
Object.assign(format, {
    setOptions, PyString, PyInteger, PyFloat,
    PyError, ValueError, LookupError, IndexError, KeyError, AttributeError, OverflowError,
})

export {
    format, PyString, PyInteger, PyFloat,
    PyError, ValueError, LookupError, IndexError, KeyError, AttributeError, OverflowError,
}

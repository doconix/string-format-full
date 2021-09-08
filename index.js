import {
    format,
    enableGlobal,
    PyString,
    PyInteger,
    PyFloat
} from './src'

// attach less-used options under the default export
format.enableGlobal = enableGlobal
format.PyString = PyString
format.PyInteger = PyInteger
format.PyFloat = PyFloat

// default export
export default format

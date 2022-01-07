import {
    format,
    setOptions,
    PyString,
    PyInteger,
    PyFloat,
    PyError,
    FormatError,
    IllegalArgumentException,
    IndexError,
    KeyError,
    ValueError,
    enableGlobal,   // deprecated (moved into format.setOptions)
} from './src'

// attach classes that could be useful externally
format.PyString = PyString
format.PyInteger = PyInteger
format.PyFloat = PyFloat
format.PyString = PyString
format.PyInteger = PyInteger
format.PyFloat = PyFloat
format.PyError = PyError
format.FormatError = FormatError
format.IllegalArgumentException = IllegalArgumentException
format.IndexError = IndexError
format.KeyError = KeyError
format.ValueError = ValueError
format.enableGlobal = enableGlobal  // deprecated

// attach functions
format.setOptions = setOptions

// default export
export default format

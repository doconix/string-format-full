import {format, enableGlobal} from './src'

// format.enableGlobal
Object.defineProperty(format, 'enableGlobal', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: enableGlobal,
})

// default export
export default format

import { format } from './index'

/*
 *  As an optional step, you can add .format the Javscript's String type,
 *  enabling python-style code:
 *
 *     console.log(
 *          '{} is a favorite color'.format('blue')
 *     )
 *
 *  This can be enabled in either of the following ways:
 *  Option 1: Import at the top of your project (ES6+):
 *
 *      import '/path/to/stringlib/enable'
 *
 *  Option 2: Require at the top of your project (Pre-ES6):
 *
 *      require('/path/to/stringlib/enable')
 */
Object.defineProperty(String.prototype, 'format', {
	value: function (...args) {
        return format(this, ...args)
    },
});

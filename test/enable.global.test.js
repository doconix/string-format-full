import {enableGlobalFormat} from '../index'
import {assert} from 'chai'

test('String.prototype monkey patch', () => {
    enableGlobalFormat()

    assert.isFunction(String.prototype.format)
    const st = '{:0.2f}'.format(3.141597)
    assert.equal('3.14', st)
})

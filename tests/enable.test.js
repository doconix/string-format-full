import { assert } from 'chai'
import '../enable'


test('String.prototype monkey patch', () => {
    assert.isFunction(String.prototype.format)
    const st = '{:0.2f}'.format(3.141597)
    assert.equal('3.14', st)
})

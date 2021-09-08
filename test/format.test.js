import format from '../index'
import {assert} from 'chai'

// This is the default method of using string-format-full
test('Default export function', () => {
    const st = format('{:0.2f}', 3.141597)
    assert.equal('3.14', st)
})

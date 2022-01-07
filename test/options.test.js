import format from '../index'
import {ValueError} from '../index'
import {assert} from 'chai'


///  OPTIONS.global tests  ///

test('enable String.prototype monkey patch', () => {
    // default is disabled, so we can just enable
    format.setOptions({global: true})
    assert.isFunction(String.prototype.format)
    const st = '{:0.2f}'.format(3.141597)
    assert.equal('3.14', st)

    // disable for other tests
    format.setOptions({global: false})
})

test('enable twice', () => {
    format.setOptions({global: true})
    format.setOptions({global: true})
    assert.isFunction(String.prototype.format)
})

test('disable String.prototype monkey patch', () => {
    // first enable
    format.setOptions({global: true})
    assert.isFunction(String.prototype.format)
    // now disable
    format.setOptions({global: false})
    assert.isNotOk(String.prototype.format)
})

// disabled this one because String.prototype.format remains non-configurable for other tests.
// not sure how to mock it as non-configurable.
// test('enable when conflicting other library', () => {
//     // mock another library controlling .format
//     Object.defineProperty(String.prototype, 'format', {
//         configurable: false,    // don't allow it to change
//         value: null,
//     })
//     assert.throws(() => {
//         format.setOptions({global: true})
//     }, 'redefine')
// })



///  OPTIONS.strict tests  ///

test('strict mode and missing index', () => {
    format.setOptions({strict: true})
    assert.throws(() => {
        format('{} {}', 'Hello') // second param World missing
    }, 'range')
})

test('strict mode and missing number index', () => {
    format.setOptions({strict: true})
    assert.throws(() => {
        format('{} is {:0.2f}', 'Pi') // second param 3.1415 missing
    }, 'range')
})

test('strict mode and missing name', () => {
    format.setOptions({strict: true})
    assert.throws(() => {
        format('{h} {w}', {
            h: 'Hello'
            // w missing
        })
    }, 'name')
})

test('not strict and missing index', () => {
    format.setOptions({strict: false})
    const st = format('{} {}', 'Hello') // second param World missing
    assert.equal(st, 'Hello ')
})

test('not strict and missing number index', () => {
    format.setOptions({strict: false})
    const st = format('{} is {:0.2f}', 'Pi') // second param 3.1415 missing
    assert.equal(st, 'Pi is ')
})

test('not strict and missing name', () => {
    format.setOptions({strict: false})
        const st = format('{h} {w}', {
            h: 'Hello'
            // w missing
    })
    assert.equal(st, 'Hello ')
})

import { test } from 'node:test'
import assert from 'node:assert/strict'
import format, { IndexError, KeyError } from '../src/index.js'


///  OPTIONS.global tests  ///

test('enable String.prototype monkey patch', () => {
    // default is disabled, so we can just enable
    format.setOptions({global: true})
    assert.equal(typeof String.prototype.format, 'function')
    const st = '{:0.2f}'.format(3.141597)
    assert.equal(st, '3.14')

    // disable for other tests
    format.setOptions({global: false})
})

test('enable twice', () => {
    format.setOptions({global: true})
    format.setOptions({global: true})
    assert.equal(typeof String.prototype.format, 'function')
    format.setOptions({global: false})
})

test('disable String.prototype monkey patch', () => {
    // first enable
    format.setOptions({global: true})
    assert.equal(typeof String.prototype.format, 'function')
    // now disable
    format.setOptions({global: false})
    assert.equal(String.prototype.format, undefined)
})

test('the patch is not enumerable', () => {
    format.setOptions({global: true})
    const keys = []
    for (const key in 'abc') {
        keys.push(key)
    }
    assert.deepEqual(keys, ['0', '1', '2'])
    format.setOptions({global: false})
})

test("another library's String.prototype.format is left alone", () => {
    const other = () => 'other'
    String.prototype.format = other
    try {
        format.setOptions({strict: true})
        assert.equal(String.prototype.format, other)
    } finally {
        delete String.prototype.format
    }
})


///  OPTIONS.strict tests  ///

test('strict mode and missing index', () => {
    format.setOptions({strict: true})
    assert.throws(() => {
        format('{} {}', 'Hello') // second param World missing
    }, IndexError)
})

test('strict mode and missing number index', () => {
    format.setOptions({strict: true})
    assert.throws(() => {
        format('{} is {:0.2f}', 'Pi') // second param 3.1415 missing
    }, IndexError)
})

test('strict mode and missing name', () => {
    format.setOptions({strict: true})
    assert.throws(() => {
        format('{h} {w}', {
            h: 'Hello'
            // w missing
        })
    }, KeyError)
})

test('not strict and missing index', () => {
    format.setOptions({strict: false})
    const st = format('{} {}', 'Hello') // second param World missing
    assert.equal(st, 'Hello ')
    format.setOptions({strict: true})
})

test('not strict and missing number index', () => {
    format.setOptions({strict: false})
    const st = format('{} is {:0.2f}', 'Pi') // second param 3.1415 missing
    assert.equal(st, 'Pi is ')
    format.setOptions({strict: true})
})

test('not strict and missing name', () => {
    format.setOptions({strict: false})
    const st = format('{h} {w}', {
        h: 'Hello'
        // w missing
    })
    assert.equal(st, 'Hello ')
    format.setOptions({strict: true})
})

test('not strict and missing nested value', () => {
    format.setOptions({strict: false})
    assert.equal(format('[{a.b.c:>5}] [{0[9]!r}]', {a: {}, 0: [1]}), '[] []')
    format.setOptions({strict: true})
})

test('not strict still reports a bad template or spec', () => {
    format.setOptions({strict: false})
    assert.throws(() => format('{} {', 'a'), {name: 'ValueError'})
    assert.throws(() => format('{:q}', 1), {name: 'ValueError'})
    format.setOptions({strict: true})
})

import { test } from 'node:test'
import assert from 'node:assert/strict'
import format from '../src/index.js'
import * as library from '../src/index.js'

// This is the default method of using string-format-full
test('Default export function', () => {
    const st = format('{:0.2f}', 3.141597)
    assert.equal(st, '3.14')
})

test('Named exports match what hangs off the function', () => {
    for (const name of ['setOptions', 'PyString', 'PyInteger', 'PyFloat', 'PyError', 'ValueError', 'LookupError',
        'IndexError', 'KeyError', 'AttributeError', 'OverflowError']) {
        assert.equal(typeof format[name], 'function', name)
        assert.equal(format[name], name === 'setOptions' ? library.setOptions : library[name], name)
    }
    assert.equal(library.format, format)
})

test('A null or undefined template is returned', () => {
    assert.equal(format(null, 1), null)
    assert.equal(format(undefined), undefined)
})

test('A template that is not a string is converted', () => {
    assert.equal(format(42), '42')
    assert.equal(format(new String('{} b'), 'a'), 'a b')
})

test('A template formats the same every time', () => {
    // templates and specs are cached
    for (let i = 0; i < 3; i++) {
        assert.equal(format('{:>4}|{:<4}|{!r}', i, 'x', 'y'), `   ${i}|x   |'y'`)
    }
})

test('More templates than the cache holds', () => {
    for (let i = 0; i < 2500; i++) {
        assert.equal(format(`${i}: {:${i % 40 + 1}d}`, 7), `${i}: ${'7'.padStart(i % 40 + 1)}`)
    }
})

test('README examples', () => {
    assert.equal(format('abc{}ghi', 'def'), 'abcdefghi')
    assert.equal(format('{:0.2f}', 3.141597), '3.14')
    assert.equal(format('abc{arg1}ghi{arg2}mno{arg3}', {arg1: 'def', arg2: 'jkl', arg3: 42}), 'abcdefghijklmno42')
    assert.equal(format('X: {0[0]};  Y: {0[1]}', [3, 5]), 'X: 3;  Y: 5')
    assert.equal(format('{obj.first} {obj.second}', {obj: {first: 111, second: 222}}), '111 222')
    assert.equal(format('{0[0].first} {0[0].second}', [{first: 111, second: 222}]), '111 222')
    assert.equal(format('{:,.2f}', 1234567.891), '1,234,567.89')
    assert.equal(format('{:>10}|{:^10}|{:<10}|', 'a', 'b', 'c'), '         a|    b     |c         |')
    assert.equal(format('{:#010x}', 255), '0x000000ff')
    assert.equal(format('{:.1%}', 0.256), '25.6%')
    assert.equal(format('{!r}', "it's"), '"it\'s"')
})

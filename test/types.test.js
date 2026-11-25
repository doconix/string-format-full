import { test } from 'node:test'
import assert from 'node:assert/strict'
import format, { PyString, PyInteger, PyFloat } from '../src/index.js'


///  JavaScript values  ///

test('String type', () => {
    const st = format('{}', 'abc')
    assert.equal(st, 'abc')
})

test('Int type', () => {
    const st = format('{}', 42)
    assert.equal(st, '42')
})

test('Float type', () => {
    const st = format('{}', 3.14)
    assert.equal(st, '3.14')
})

test('Null arg', () => {
    assert.equal(format('{}', null), 'null')
    assert.equal(format('{:>6}', null), '  null')
})

test('Undefined arg', () => {
    assert.equal(format('{}', undefined), 'undefined')
    assert.equal(format('{a}', {a: undefined}), 'undefined')
})

test('True arg', () => {
    assert.equal(format('{}', true), 'true')
    assert.equal(format('{:6}|', true), 'true  |')
})

test('False arg', () => {
    const st = format('{}', false)
    assert.equal(st, 'false')
})

test('Arrays and objects use their string value', () => {
    assert.equal(format('{}', [1, 2]), '1,2')
    assert.equal(format('{:>5}', [1, 2]), '  1,2')
    assert.equal(format('{0}', new Date(0)), String(new Date(0)))
    assert.equal(format('{!r}', [1, 2]), '1,2')
})


///  one number type in JavaScript, two in Python  ///

test('A whole number is an int', () => {
    assert.equal(format('{}', 3.0), '3')
    assert.equal(format('{:d}', 3.0), '3')
    assert.equal(format('{}', 1e21), '1000000000000000000000')
    assert.equal(format('{}', -0), '0')
    assert.equal(format('{:.1f}', -0), '0.0')
})

test('A number with a fraction is a float', () => {
    assert.equal(format('{}', 0.1 + 0.2), '0.30000000000000004')
    assert.equal(format('{}', 1e-7), '1e-07')
    assert.equal(format('{}', NaN), 'nan')
    assert.equal(format('{}', -Infinity), '-inf')
    assert.throws(() => format('{:d}', 3.5), {name: 'ValueError', message: "Unknown format code 'd' for object of type 'float'"})
})

test('PyFloat makes a whole number a float', () => {
    assert.equal(format('{}', new PyFloat(3)), '3.0')
    assert.equal(format('{:.3}', new PyFloat(42)), '42.0')
    assert.equal(format('{}', new PyFloat(1e21)), '1e+21')
    assert.equal(format('{}', new PyFloat(-0)), '-0.0')
    assert.equal(format('{:,}', new PyFloat(1234567)), '1,234,567.0')
})

test('PyInteger makes a float an int', () => {
    assert.equal(format('{}', new PyInteger(3.7)), '3')
    assert.equal(format('{:x}', new PyInteger(255.9)), 'ff')
})

test('PyString makes a number a string', () => {
    assert.equal(format('{:>5}', new PyString(42)), '   42')
    assert.equal(format('{:.2}', new PyString(3.14159)), '3.')
    assert.throws(() => format('{:d}', new PyString(42)), {name: 'ValueError'})
})

test('BigInt is an int of any size', () => {
    assert.equal(format('{}', 10n ** 30n), '1000000000000000000000000000000')
    assert.equal(format('{:,}', 2n ** 64n), '18,446,744,073,709,551,616')
    assert.equal(format('{:_x}', -(2n ** 64n)), '-1_0000_0000_0000_0000')
    assert.equal(format('{:.3e}', 10n ** 30n), '1.000e+30')
    assert.throws(() => format('{:e}', 10n ** 400n), {name: 'OverflowError'})
})


///  Python's protocol  ///

test('format(value, spec) through __format__', () => {
    assert.equal(new PyFloat(3.14159).__format__('.2f'), '3.14')
    assert.equal(new PyInteger(255).__format__('#x'), '0xff')
    assert.equal(new PyString('abc').__format__('*^7'), '**abc**')
    assert.equal(new PyFloat(2).__format__(''), '2.0')
    assert.equal(new PyFloat(2).__format__(), '2.0')
})

test('str() and repr()', () => {
    assert.equal(new PyFloat(1e16).__str__(), '1e+16')
    assert.equal(new PyInteger(-5).__str__(), '-5')
    assert.equal(new PyString("it's").__repr__(), '"it\'s"')
    assert.equal(new PyString('é\n').__ascii__(), "'\\xe9\\n'")
})

test('An object with __format__ formats itself', () => {
    class Money {
        constructor(cents) {
            this.cents = cents
        }
        __format__(spec) {
            return '$' + new PyFloat(this.cents / 100).__format__(spec || ',.2f')
        }
    }
    assert.equal(format('{}', new Money(123456)), '$1,234.56')
    assert.equal(format('{:.0f}', new Money(123456)), '$1235')
    assert.equal(format('{total:>12,.2f}', {total: new Money(5)}), '$        0.05')
})

test('__format__ must return a string', () => {
    class Broken {
        __format__() {
            return 5
        }
    }
    assert.throws(() => format('{}', new Broken()), TypeError)
})

test('A type can be subclassed', () => {
    class Percent extends PyFloat {
        __format__(spec) {
            return super.__format__(spec || '.1%')
        }
    }
    assert.equal(format('{} {:.0%}', new Percent(0.256), new Percent(0.256)), '25.6% 26%')
})

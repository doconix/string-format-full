import { format } from '../index'
import { assert } from 'chai'


// basic

test('Basic integer', () => {
    const st = format('{}', 3749)
    assert.equal('3749', st)
})

test('Basic integer plus positive', () => {
    const st = format('{:+d}', 3749)
    assert.equal('+3749', st)
})

test('Basic integer plus negative', () => {
    const st = format('{:+d}', -3749)
    assert.equal('-3749', st)
})

test('Basic integer minus positive', () => {
    const st = format('{:-d}', 3749)
    assert.equal('3749', st)
})

test('Basic integer minus negative', () => {
    const st = format('{:-d}', -3749)
    assert.equal('-3749', st)
})

test('Basic integer space positive', () => {
    const st = format('{: d}', 3749)
    assert.equal(' 3749', st)
})

test('Basic integer space negative', () => {
    const st = format('{: d}', -3749)
    assert.equal('-3749', st)
})


// integer base conversion

test('Hex', () => {
    const st = format('{:x}', 1234)
    assert.equal('4d2', st)
})

test('Uppercase hex', () => {
    const st = format('{:X}', 1234)
    assert.equal('4D2', st)
})

test('Oct', () => {
    const st = format('{:o}', 1234)
    assert.equal('2322', st)
})

test('Bin', () => {
    const st = format('{:b}', 1234)
    assert.equal('10011010010', st)
})

test('Ascii character', () => {
    const st = format('{:c}', 80)
    assert.equal('P', st)
})

test('Unicode character', () => {
    const st = format('{:c}', 3749)
    assert.equal('ລ', st)
})


// exponential formatting

test('Exponential', () => {
    const st = format('{:e}', 3749)
    assert.equal('3.749000e+03', st)
})

test('Exponential negative', () => {
    const st = format('{:e}', -3749)
    assert.equal('-3.749000e+03', st)
})

test('Exponential precision', () => {
    const st = format('{:.2e}', 3749)
    assert.equal('3.75e+03', st)
})

test('Exponential uppercase', () => {
    const st = format('{:E}', 3749)
    assert.equal('3.749000E+03', st)
})

test('Exponential NaN', () => {
    const st = format('{:e}', NaN)
    assert.equal('nan', st)
})


// fixed-point formatting

test('Fixed', () => {
    const st = format('{:f}', 352)
    assert.equal('352.000000', st)
})

test('Fixed negative', () => {
    const st = format('{:f}', -352)
    assert.equal('-352.000000', st)
})

test('Fixed precision', () => {
    const st = format('{:.2f}', 101)
    assert.equal('101.00', st)
})

test('Fixed NaN', () => {
    const st = format('{:f}', NaN)
    assert.equal('nan', st)
})


// generic formatting

test('Generic integer', () => {
    const st = format('{:g}', 101)
    assert.equal('101', st)
})

test('Generic long', () => {
    const st = format('{:g}', 123456789)
    assert.equal('1.23456789e+08', st)
})


// percent formatting

test('Percent integer', () => {
    const st = format('{:%}', 123)
    assert.equal('12300.000000%', st)
})

test('Percent integer precision', () => {
    const st = format('{:.2%}', 123)
    assert.equal('12300.00%', st)
})

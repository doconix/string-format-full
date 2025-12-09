import format from '../index'
import {assert} from 'chai'


// basic

test('Basic float', () => {
    const st = format('{}', 3749.598)
    assert.equal(st, '3749.598')
})

test('Basic negative float', () => {
    const st = format('{}', -3749.598)
    assert.equal(st, '-3749.598')
})

test('Basic single float', () => {
    const st = format('{}', 5.975)
    assert.equal(st, '5.975')
})

test('Basic single negative float', () => {
    const st = format('{}', -5.975)
    assert.equal(st, '-5.975')
})


// zeros

test('Zero ordinary', () => {
    const st = format('{}', 0.975)
    assert.equal(st, '0.975')
})

test('Zero ordinary decimal', () => {
    const st = format('{}', 0.0123)
    assert.equal(st, '0.0123')
})

test('Zero ordinary 2x decimal', () => {
    const st = format('{}', 0.00123)
    assert.equal(st, '0.00123')
})

test('Zero ordinary negative', () => {
    const st = format('{}', -0.975)
    assert.equal(st, '-0.975')
})

test('Zero ordinary decimal negative', () => {
    const st = format('{}', -0.0123)
    assert.equal(st, '-0.0123')
})

test('Zero ordinary 2x decimal negative', () => {
    const st = format('{}', -0.00123)
    assert.equal(st, '-0.00123')
})


// exponential formatting

test('Exponential float', () => {
    const st = format('{:e}', 3749.598)
    assert.equal(st, '3.749598e+03')
})

test('Exponential float zero', () => {
    const st = format('{:E}', 0.598)
    assert.equal(st, '5.980000E-01')
})

test('Exponential float negative zero', () => {
    const st = format('{:E}', -0.598)
    assert.equal(st, '-5.980000E-01')
})

test('Exponential float negative', () => {
    const st = format('{:e}', -3749.598)
    assert.equal(st, '-3.749598e+03')
})

test('Exponential float precision', () => {
    const st = format('{:.2e}', 3749.598)
    assert.equal(st, '3.75e+03')
})

test('Exponential float uppercase', () => {
    const st = format('{:E}', 3749.598)
    assert.equal(st, '3.749598E+03')
})


// fixed-point formatting

test('Fixed float', () => {
    const st = format('{:f}', 3.141597)
    assert.equal(st, '3.141597')
})

test('Fixed float negative', () => {
    const st = format('{:f}', -3.141597)
    assert.equal(st, '-3.141597')
})

test('Fixed float precision', () => {
    const st = format('{:.2f}', 101.4368)
    assert.equal(st, '101.44')
})


// generic formatting

test('Generic float', () => {
    const st = format('{:g}', 101.232)
    assert.equal(st, '101.232')
})

test('Generic big float', () => {
    const st = format('{:g}', 123456789.1234)
    assert.equal(st, '1.234567891234e+08')
})


// percent formatting

test('Percent float', () => {
    const st = format('{:%}', .12367)
    assert.equal(st, '12.367000%')
})

test('Percent float precision', () => {
    const st = format('{:.2%}', .12367)
    assert.equal(st, '12.37%')
})

import {format} from '../index'
import {assert} from 'chai'


// basic

test('Basic float', () => {
    const st = format('{}', 3749.598)
    assert.equal('3749.598', st)
})


// exponential formatting

test('Exponential float', () => {
    const st = format('{:e}', 3749.598)
    assert.equal('3.749598e+03', st)
})

test('Exponential float negative', () => {
    const st = format('{:e}', -3749.598)
    assert.equal('-3.749598e+03', st)
})

test('Exponential float precision', () => {
    const st = format('{:.2e}', 3749.598)
    assert.equal('3.75e+03', st)
})

test('Exponential float uppercase', () => {
    const st = format('{:E}', 3749.598)
    assert.equal('3.749598E+03', st)
})



// fixed-point formatting

test('Fixed float', () => {
    const st = format('{:f}', 3.141597)
    assert.equal('3.141597', st)
})

test('Fixed float negative', () => {
    const st = format('{:f}', -3.141597)
    assert.equal('-3.141597', st)
})

test('Fixed float precision', () => {
    const st = format('{:.2f}', 101.4368)
    assert.equal('101.44', st)
})


// generic formatting

test('Generic float', () => {
    const st = format('{:g}', 101.232)
    assert.equal('101.232', st)
})

test('Generic big float', () => {
    const st = format('{:g}', 123456789.1234)
    assert.equal('1.234567891234e+08', st)
})


// percent formatting

test('Percent float', () => {
    const st = format('{:%}', .12367)
    assert.equal('12.367000%', st)
})

test('Percent float precision', () => {
    const st = format('{:.2%}', .12367)
    assert.equal('12.37%', st)
})

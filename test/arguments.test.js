import { test } from 'node:test'
import assert from 'node:assert/strict'
import format, { IndexError, KeyError, AttributeError, ValueError } from '../src/index.js'


///  direct arguments  ///

test('Single arg', () => {
    const st = format('abc{}ghi', 'def')
    assert.equal(st, 'abcdefghi')
})

test('Multiple args', () => {
    const st = format('abc{}ghi{}mno{}', 'def', 'jkl', 42)
    assert.equal(st, 'abcdefghijklmno42')
})

test('Numbered args', () => {
    const st = format('{1} {0} {1}', 'a', 'b')
    assert.equal(st, 'b a b')
})


///  object arguments  ///

test('Object args', () => {
    const st = format('abc{arg1}ghi{arg2}mno{arg3}', {
        arg1: 'def',
        arg2: 'jkl',
        arg3: 42,
    })
    assert.equal(st, 'abcdefghijklmno42')
})

test('Object indexed args', () => {
    const st = format('abc{0}ghi{1}mno{2}', {
        '0': 'def',
        '1': 'jkl',
        '2': 42,
    })
    assert.equal(st, 'abcdefghijklmno42')
})

test('Object without a prototype', () => {
    const args = Object.create(null)
    args.name = 'x'
    assert.equal(format('{name}', args), 'x')
})

test('Only a single plain object is named args', () => {
    // two objects are two positional args
    assert.equal(format('{0.a} {1.b}', {a: 1}, {b: 2}), '1 2')
    // a class instance is one positional arg
    class Point { x = 3 }
    assert.equal(format('{0.x}', new Point()), '3')
})


///  nested arguments  ///

test('Nested array indices', () => {
    const st = format('X: {0[0]};  Y: {0[1]}', [3, 5])
    assert.equal(st, 'X: 3;  Y: 5')
})

test('Nested object attrs', () => {
    const obj = {
        'first': 111,
        'second': 222,
    }
    const st = format('{obj.first} {obj.second}', {
        'obj': obj,
    })
    assert.equal(st, '111 222')
})

test('Nested array + object attrs', () => {
    const obj = {
        'first': 111,
        'second': 222,
    }
    const st = format('{0[0].first} {0[0].second}', [obj])
    assert.equal(st, '111 222')
})

test('Attribute and index are the same thing on a JS object', () => {
    assert.equal(format('{a[b]} {a.b}', {a: {b: 7}}), '7 7')
    assert.equal(format('{0.length}', 'abc'), '3')
})

test('Width and precision from other args', () => {
    assert.equal(format('{:{}.{}f}|', 3.14159, 8, 2), '    3.14|')
    assert.equal(format('{value:{fill}>{width}}', {value: 'x', fill: '*', width: 4}), '***x')
})


///  errors  ///

test('Too few args', () => {
    assert.throws(() => {
        format('abc{}ghi{}mno{}', 'def', 'jkl')
    }, {name: 'IndexError', message: 'Replacement index 2 out of range for positional args tuple'})
})

test('Too many args', () => {
    // no error - spares are ignored
    const st = format('abc{}ghi{}mno{}', 'def', 'jkl', 42, 'a', 'b', 'c')
    assert.equal(st, 'abcdefghijklmno42')
})

test('Missing name', () => {
    assert.throws(() => {
        format('abc{arg1}ghi{arg2}mno{arg3}', {
            arg1: 'def',
            arg2: 'jkl',
        })
    }, {name: 'KeyError', message: "'arg3'"})
})

test('Invalid index', () => {
    assert.throws(() => {
        format('abc{0}ghi{1}mno{3}', 'def', 'jkl', 42)
    }, IndexError)
})

test('Missing nested values', () => {
    assert.throws(() => format('{0[5]}', [1, 2]), IndexError)
    assert.throws(() => format('{a[x]}', {a: {y: 1}}), KeyError)
    assert.throws(() => format('{a.x}', {a: {y: 1}}), AttributeError)
    assert.throws(() => format('{a.x.y}', {a: {x: null}}), AttributeError)
})

test('Errors are PyErrors with Python names', () => {
    try {
        format('{:q}', 1)
        assert.fail('should have thrown')
    } catch (err) {
        assert.ok(err instanceof ValueError)
        assert.ok(err instanceof format.PyError)
        assert.ok(err instanceof Error)
        assert.equal(err.name, 'ValueError')
        assert.equal(String(err), "ValueError: Unknown format code 'q' for object of type 'int'")
    }
})

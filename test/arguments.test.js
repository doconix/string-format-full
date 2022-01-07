import format from '../index'
import {assert} from 'chai'


///  direct arguments (converted to array internally)  ///

test('Single arg', () => {
    const st = format('abc{}ghi', 'def')
    assert.equal('abcdefghi', st)
})

test('Multiple args', () => {
    const st = format('abc{}ghi{}mno{}', 'def', 'jkl', 42)
    assert.equal('abcdefghijklmno42', st)
})


///  object arguments  ///

test('Object args', () => {
    const st = format('abc{arg1}ghi{arg2}mno{arg3}', {
        arg1: 'def',
        arg2: 'jkl',
        arg3: 42,
    })
    assert.equal('abcdefghijklmno42', st)
})

test('Object indexed args', () => {
    const st = format('abc{0}ghi{1}mno{2}', {
        '0': 'def',
        '1': 'jkl',
        '2': 42,
    })
    assert.equal('abcdefghijklmno42', st)
})


///  nested arguments  ///

test('Nested array indices', () => {
    const st = format('X: {0[0]};  Y: {0[1]}', [3, 5])
    assert.equal('X: 3;  Y: 5', st)
})

test('Nested object attrs', () => {
    const obj = {
        'first': 111,
        'second': 222,
    }
    const st = format('{obj.first} {obj.second}', {
        'obj': obj,
    })
    assert.equal('111 222', st)
})

test('Nested array + object attrs', () => {
    const obj = {
        'first': 111,
        'second': 222,
    }
    const st = format('{0[0].first} {0[0].second}', [obj])
    assert.equal('111 222', st)
})


///  errors  ///

test('Too few args', () => {
    assert.throws(() => {
        format('abc{}ghi{}mno{}', 'def', 'jkl')
    }, 'index out of range: 2')
})

test('Too many args', () => {
    // no error - spares are ignored
    const st = format('abc{}ghi{}mno{}', 'def', 'jkl', 42, 'a', 'b', 'c')
    assert.equal('abcdefghijklmno42', st)
})

test('Missing name', () => {
    assert.throws(() => {
        format('abc{arg1}ghi{arg2}mno{arg3}', {
            arg1: 'def',
            arg2: 'jkl',
        })
    }, 'named index not defined: arg3')
})

test('Invalid index', () => {
    assert.throws(() => {
        const st = format('abc{0}ghi{1}mno{3}', 'def', 'jkl', 42)
        assert.equal('abcdefghijklmno42', st)
    }, 'index out of range: 3')
})

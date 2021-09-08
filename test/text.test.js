import {format} from '../index'
import {assert} from 'chai'


///  basic  ///

test('Basic', () => {
    const st = format('abc{}ghi', 'def')
    assert.equal('abcdefghi', st)
})

test('Basic colon', () => {
    const st = format('abc{:s}ghi', 'def')
    assert.equal('abcdefghi', st)
})

test('Basic exclamation', () => {
    const st = format('abc{!s}ghi', 'def')
    assert.equal('abcdefghi', st)
})


///  alignment  ///

test('Left aligned', () => {
    const st = format('abc{:<10}ghi', 'def')
    assert.equal('abcdef       ghi', st)
})

test('Right aligned', () => {
    const st = format('abc{:>10}ghi', 'def')
    assert.equal('abc       defghi', st)
})

test('Center aligned', () => {
    const st = format('abc{:^10}ghi', 'def')
    assert.equal('abc   def    ghi', st)
})

test('Center aligned, star filled', () => {
    const st = format('abc{:*^10}ghi', 'def')
    assert.equal('abc***def****ghi', st)
})

test('Right aligned integer', () => {
    const st = format('abc{:>10}ghi', 512)
    assert.equal('abc       512ghi', st)
})

test('Right aligned, named integer', () => {
    const st = format('abc{v:>10}ghi', {
        v: 512,
    })
    assert.equal('abc       512ghi', st)
})

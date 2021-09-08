import { format } from '../index'
import { assert } from 'chai'


test('String type', () => {
    const st = format('{}', 'abc')
    assert.equal('abc', st)
})

test('Int type', ()=> {
    const st = format('{}', 42)
    assert.equal('42', st)
})

test('Float type', ()=> {
    const st = format('{}', 3.14)
    assert.equal('3.14', st)
})

test('Null arg', ()=> {
    const st = format('{}', null)
    assert.equal('null', st)
})

test('True arg', ()=> {
    const st = format('{}', true)
    assert.equal('true', st)
})

test('False arg', ()=> {
    const st = format('{}', false)
    assert.equal('false', st)
})

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'

// The built bundles (yarn build), loaded the two ways they are meant to be.
const require = createRequire(import.meta.url)
const corpus = JSON.parse(readFileSync(new URL('./corpus.json', import.meta.url)))

/** Replays a slice of the corpus: enough to show a bundle is whole and current. */
function replay(format) {
    for (const [template, args, expected] of corpus.cases) {
        if (typeof expected === 'string' && Array.isArray(args) && !JSON.stringify(args).includes('__')) {
            assert.equal(format(template, ...args), expected, template)
        }
    }
    assert.equal(format('{:>12,.2f}|{!r}', 1234567.891, 'x'), "1,234,567.89|'x'")
    assert.throws(() => format('{:q}', 1), format.ValueError)
    assert.equal(new format.PyFloat(3).__format__(''), '3.0')
}

test('dist/index.cjs through require()', () => {
    replay(require('../dist/index.cjs'))
})

test('dist/index.min.js as a <script>', () => {
    // a browser global scope: the bundle must define `format` on it
    const scope = vm.createContext({})
    vm.runInContext(readFileSync(new URL('../dist/index.min.js', import.meta.url), 'utf8'), scope)
    assert.equal(typeof scope.format, 'function')
    assert.equal(vm.runInContext("format('{:>12,.2f}|{!r}', 1234567.891, 'x')", scope), "1,234,567.89|'x'")
    assert.equal(vm.runInContext("format.setOptions({global: true}); '{:05.1f}'.format(2.25)", scope), '002.2')
    assert.equal(vm.runInContext("try { format('{', 1) } catch (err) { err.name + ': ' + err.message }", scope),
        "ValueError: Single '{' encountered in format string")
})

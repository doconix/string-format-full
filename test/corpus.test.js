import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import format, { PyFloat, PyInteger } from '../src/index.js'

// corpus.json holds what CPython returned or raised for every case; see corpus.py
const corpus = JSON.parse(readFileSync(new URL('./corpus.json', import.meta.url)))


class Replay {
    static FLOATS = {inf: Infinity, '-inf': -Infinity, nan: NaN}

    constructor() {
        this.failures = []
    }

    /** The JavaScript value for a corpus value: tagged floats and integers become what JSON could not carry. */
    decode(value) {
        if (Array.isArray(value)) {
            return value.map((v) => this.decode(v))
        }
        if (value !== null && typeof value === 'object') {
            if ('__float__' in value) {
                return new PyFloat(Replay.FLOATS[value.__float__] ?? Number(value.__float__))
            }
            if ('__int__' in value) {
                return BigInt(value.__int__)
            }
            return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, this.decode(v)]))
        }
        return value
    }

    /** Formats, and reports the outcome the way the corpus records it. */
    run(template, args) {
        try {
            return Array.isArray(args) ? format(template, ...args) : format(template, args)
        } catch (err) {
            return [err.name, err.message]
        }
    }

    check(template, args, expected, label) {
        let actual = this.run(template, args)
        // where Python raises TypeError the data models differ (a str index must be an int); any error will do
        if (Array.isArray(expected) && expected[0] === 'TypeError' && Array.isArray(actual)) {
            actual = expected
        }
        if (JSON.stringify(actual) !== JSON.stringify(expected)) {
            this.failures.push(`${label}\n      python: ${JSON.stringify(expected)}\n      js:     ${JSON.stringify(actual)}`)
        }
    }

    finish(count) {
        const shown = this.failures.slice(0, 20).join('\n')
        assert.equal(this.failures.length, 0, `${this.failures.length} of ${count} differ from Python ${corpus.python}:\n${shown}`)
    }
}


for (const matrix of corpus.matrices) {
    test(`corpus: ${matrix.name} (${matrix.values.length} values x ${matrix.specs.length} specs)`, () => {
        const replay = new Replay()
        matrix.values.forEach((encoded, row) => {
            // each value also runs in its other JavaScript forms, which must format identically
            const value = replay.decode(encoded)
            const forms = [value]
            if (typeof value === 'number' && matrix.name.startsWith('float')) {
                forms.push(new PyFloat(value))
            } else if (typeof value === 'number') {
                forms.push(BigInt(value), new PyInteger(value))
            }
            matrix.specs.forEach((spec, column) => {
                for (const form of forms) {
                    const label = `'{:${spec}}' with ${JSON.stringify(encoded)} as ${form?.constructor.name}`
                    replay.check(`{:${spec}}`, [form], matrix.results[row][column], label)
                }
            })
        })
        replay.finish(matrix.values.length * matrix.specs.length)
    })
}

test(`corpus: ${corpus.cases.length} templates`, () => {
    const replay = new Replay()
    for (const [template, args, expected] of corpus.cases) {
        replay.check(template, replay.decode(args), expected, `${JSON.stringify(template)} with ${JSON.stringify(args)}`)
    }
    replay.finish(corpus.cases.length)
})

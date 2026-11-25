# string-format-full

Python's `str.format()` in JavaScript: the whole format mini-language, with output that matches CPython output.

```js
import format from 'string-format-full'

format('{:,.2f}', 1234567.891)                  // "1,234,567.89"
format('{name:>8}|{count:05d}', {name: 'x', count: 42})    // "       x|00042"
```

> **About version 2.0**
>
> Version 1 was a transliteration of Jython's formatter from Java to JavaScript. Back then, porting a mature implementation that had been used for years, line by line, was the most reliable way to match CPython.
>
> Version 2 is a full rewrite. It is called the same way and still matches CPython, but it is no longer based on Jython. Now that AI coding assistants are available, a clean-room implementation is the better way to match CPython. It is written from Python's documented format grammar and checked against CPython's own output, not translated from another project's source. See [Upgrading from 1.x](#upgrading-from-1x) for what changed.

The library is checked against Python itself. A script runs about 22,000 format calls through CPython 3.14 and records what each returns or raises, and the tests require the same result from JavaScript, including which error is raised and its message. See [Testing](#testing).

It has no dependencies and is 14K minified (5K gzipped). It needs an ES2022 engine: Node 16.9 or later, or a browser from 2022 on.

# Install

```
npm install string-format-full
```

# Use

```js
import format from 'string-format-full'

// positional arguments: "abcdefghi"
format('abc{}ghi', 'def')

// float formatting: "3.14"
format('{:0.2f}', 3.141597)

// named arguments, as one plain object: "abcdefghijklmno42"
format('abc{arg1}ghi{arg2}mno{arg3}', {
    arg1: 'def',
    arg2: 'jkl',
    arg3: 42,
})

// indexing into an argument: "X: 3;  Y: 5"
format('X: {0[0]};  Y: {0[1]}', [3, 5])

// attributes of an argument: "111 222"
format('{obj.first} {obj.second}', {
    obj: {first: 111, second: 222},
})

// width and precision taken from other arguments: "    3.14"
format('{:{}.{}f}', 3.14159, 8, 2)
```

`require('string-format-full')` returns the same function. In a page, `<script src="dist/index.min.js">` defines it as the global `format`; see `browser.html`.

If you prefer Python style:

```js
format.setOptions({global: true})

"{:0.2f}".format(3.141597)      // "3.14"
```

To render a missing argument as an empty string instead of raising an error:

```js
format.setOptions({strict: false})

format('{} {}', 'Hello')        // "Hello "
```

# What is supported

Everything in Python's [format string syntax](https://docs.python.org/3/library/string.html#format-string-syntax) for strings, integers and floats.

| | |
|---|---|
| Fields | `{}` `{0}` `{name}` `{0.attr}` `{0[index]}` `{{` `}}` |
| Conversions | `{!s}` `{!r}` `{!a}` |
| Fill and alignment | `{:<10}` `{:>10}` `{:^10}` `{:=10}` `{:*^10}` |
| Sign | `{:+}` `{:-}` `{: }` and `{:z}` to drop the sign of a negative zero |
| Width and precision | `{:10}` `{:.3}` `{:010.3f}`, and from arguments: `{:{}.{}f}` |
| Grouping | `{:,}` `{:_}` `{:_x}`, and in the fraction: `{:.6_f}` |
| String type | `s` |
| Integer types | `d` `b` `o` `x` `X` `c` `n`, with `#` for the `0b` `0o` `0x` prefix |
| Float types | `e` `E` `f` `F` `g` `G` `n` `%`, with `#` to keep the decimal point |

Floats are rounded the way Python rounds them, from the exact value of the number and to even on a tie, so `format('{:.0f}', 2.5)` is `"2"` where `(2.5).toFixed(0)` is `"3"`. Precision is not limited to the 100 digits of `toFixed()`.

# JavaScript values

Python has more types than JavaScript does, so each JavaScript value is formatted as the Python type nearest to it.

| JavaScript value | Formats as | Example |
|---|---|---|
| string | `str` | `format('{:>5}', 'ab')` is `"   ab"` |
| whole number, BigInt | `int` | `format('{}', 3.0)` is `"3"` |
| number with a fraction, `NaN`, `Infinity` | `float` | `format('{}', 0.1 + 0.2)` is `"0.30000000000000004"` |
| anything else | `str`, of its `String()` value | `format('{}', null)` is `"null"` |

JavaScript cannot tell `3` from `3.0`. To format a whole number as a float, or to choose a type for any value, wrap it:

```js
format('{}', new format.PyFloat(3))         // "3.0"
format('{}', new format.PyInteger(3.7))     // "3"
format('{:>6}', new format.PyString(42))    // "    42"
```

The wrappers implement Python's protocol, so they also work on their own:

```js
new format.PyFloat(1234.5).__format__(',.2f')   // "1,234.50", Python's format(1234.5, ',.2f')
new format.PyFloat(1e16).__str__()              // "1e+16"
new format.PyString("it's").__repr__()          // "\"it's\""
```

Any object with a `__format__(spec)` method formats itself, as in Python:

```js
class Money {
    constructor(cents) {
        this.cents = cents
    }
    __format__(spec) {
        return '$' + new format.PyFloat(this.cents / 100).__format__(spec || ',.2f')
    }
}

format('{}', new Money(123456))     // "$1,234.56"
```

# Differences from Python

These follow from the language rather than from the formatter.

1. **Arguments.** A single plain object is the named arguments, and anything else is positional. The two cannot be mixed in one call.
2. **Whole numbers are integers.** `format('{}', 3.0)` is `"3"`, and `format('{:.2}', 3.0)` is an error because an integer takes no precision. Use `PyFloat`.
3. **Booleans, `null` and `undefined`** are written the JavaScript way (`true`, not `True`) and format as strings, so `{:d}` does not accept a boolean.
4. **Arrays and objects** format as their `String()` value. `{!r}` adds Python's quotes to strings only.
5. **Attributes and indexes are the same thing.** `{a.b}` and `{a[b]}` both read property `b`. Negative indexes are not supported.
6. **The `n` type** uses no locale, which is also Python's default.
7. **Digits** in a width, precision or index must be ASCII digits.
8. **`{!r}`** decides which characters to escape from the JavaScript engine's Unicode tables, which can be a different Unicode version from Python's.

Not included: `%`-style formatting, `string.Template`, and the format specs of `Decimal`, `complex` and `datetime`.

# Errors

Errors are Python's, with CPython's messages. All extend `format.PyError`, which extends `Error`.

| Error | Raised for |
|---|---|
| `ValueError` | a malformed template or spec, or a spec the value's type does not allow |
| `IndexError` | a positional argument or index that does not exist |
| `KeyError` | a named argument or key that does not exist |
| `AttributeError` | an attribute that does not exist |
| `OverflowError` | a number out of range for its type: `{:c}` with 1114112 |

```js
try {
    format('{:d}', 'abc')
} catch (err) {
    err instanceof format.ValueError    // true
    err.message                         // "Unknown format code 'd' for object of type 'str'"
}
```

`IndexError` and `KeyError` share the base `LookupError`.

# Testing

```
$ yarn test
```

`test/corpus.py` builds `test/corpus.json` by running every case through Python: each value against each spec for floats, integers and strings, plus several hundred whole templates. `test/corpus.test.js` replays it. To add cases or move to a newer Python, edit the lists in `corpus.py` and run:

```
$ yarn corpus
```

The other files in `test/` cover what Python cannot: the JavaScript value rules, the options, and the built bundles.

# Building

`import` uses the files in `src/` directly, so there is nothing to build for it. `yarn build` runs esbuild to write the two bundles in `dist/`: `index.cjs` for `require()` and `index.min.js` for a `<script>` tag. Both hand over the `format` function itself, with everything else attached to it.

# Upgrading from 1.x

`format()` and `format.setOptions()` are called the same way as in version 1. What changed:

- **Output now matches Python** where version 1 did not: `,` grouping, zero padding of negative numbers, `+` and space on floats, `g` precision, ties, `{{`/`}}` appearing more than once, and `!r`.
- **Python 3 rules** replace Jython's Python 2.7 rules, so `{}` shows a float in full: `0.30000000000000004`.
- **Errors** are `ValueError`, `IndexError`, `KeyError`, `AttributeError` and `OverflowError`. `FormatError` and `IllegalArgumentException` are gone, and messages are CPython's.
- **`format.enableGlobal()`** is gone; use `format.setOptions({global: true})`.
- **The IE11 build** is gone. `dist/index.js` is now `dist/index.cjs`.

# Other Modules

- [string-format](https://www.npmjs.com/package/string-format)
- [python-format-js](https://www.npmjs.com/package/python-format-js)

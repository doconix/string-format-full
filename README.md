# Description

A full implementation of the Python formatting mini-language -- built by transcoding the official Jython code with as few changes as possible.

Jython is a 20+ year-old codebase, and this module inherits much of its maturity. The code requires minimal changes to the original Jython because Java -> Javascript is a straightforward conversion. Kudos to the Jython team! https://www.jython.org/

This library is larger than alternatives, so its use case is projects that need formatting to exactly match the results of Python's str.format. Minified size is `22K`.

# Use

```
import format from 'string-format-full'

// basic: "abcdefghi"
format('abc{}ghi', 'def')

// float formatting: "3.14"
format('{:0.2f}', 3.141597)

// named args: "abcdefghijklmno42"
format('abc{arg1}ghi{arg2}mno{arg3}', {
    arg1: 'def',
    arg2: 'jkl',
    arg3: 42,
})

// array indexing: "X: 3;  Y: 5"
format('X: {0[0]};  Y: {0[1]}', [3, 5])

// nested args: "111 222"
format('{obj.first} {obj.second}', {
    'obj': {
        'first': 111,
        'second': 222,
    }
})

// array indexing + nested args:
format('{0[0].first} {0[0].second}', [
    {
        'first': 111,
        'second': 222,
    }
])
```

If you prefer python-style:
```
import format from 'string-format-full'
format.setOptions({global: true})

// "3.14"
"{:0.2f}".format(3.141597)
```

To allow missing values:
```
import format from 'string-format-full'
format.setOptions({strict: false})

// "Hello " with no error thrown for missing "World"
"{} {}".format('Hello')
```



See `test/*` files for more examples.

## Browser-based &lt;script src="..."&gt;

See `browser.html`.


# Benefits of this Approach

1. Implements the full Python mini-language.
2. Python-style JS using the exact Python algorithms.
3. Jython has seen 20+ years of significant use and testing.
4. Unit tests in tests/.
5. No dependencies.

# Drawbacks of this Approach

1. The module has a larger footprint than other, minimal modules on npmjs.org.
2. The module is likely slower than the smaller alternatives, although
   it probably won't matter to most projects.

# Other Modules

- [string-format](https://www.npmjs.com/package/string-format)
- [python-format-js](https://www.npmjs.com/package/string-format-js)

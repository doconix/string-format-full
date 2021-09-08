# Description

This is a full implementation of the Python formatting mini-language,
implemented by transcoding the Jython Java code. By basing this on Jython's
implementation, we get a full-featured, mature, robust codebase.

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
import format, {enableGlobalFormat} from 'string-format-full'

// patch String.prototype (run at start of code)
enableGlobalFormat()

// "3.14"
"{:0.2f}".format(3.141597)
```

[See the tests for more examples](https://github.com/doconix/string-format-full/tree/main/tests)



# Why Jython?

I chose to transcode the Jython implementation rather than others like cython
because Java and Javascript are syntactically similar--making for a very
straighforward translation.

Kudos and thanks to the Jython team! https://www.jython.org/

# Benefits of this Approach

1. Implements the full Python mini-language.
2. Jython has seen 20+ years of significant use and testing.
3. Unit tests in tests/.
4. No dependencies.

# Drawbacks of this Approach

1. The module has a larger footprint than other, minimal modules on npmjs.org.
2. The module is likely slower than the smaller alternatives, although
   it probably won't matter to most projects.

# Alternatives (2021)

- [string-format-full](https://www.npmjs.com/package/string-format-full) (this module): 2900 lines of code
- [string-format](https://www.npmjs.com/package/string-format): 300 lines of code
- [python-format-js](https://www.npmjs.com/package/string-format-js): 163 lines of code

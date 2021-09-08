This is a full implementation of the Python formatting mini-language,
implemented by transcoding the Jython Java code. By basing this on Jython's
implementation, we get a full-featured, mature, robust codebase.

I chose to transcode the Jython implementation rather than others like cython
because Java and Javascript are syntactically similar--making for a very
straighforward translation.

Kudos and thanks to the Jython team! https://www.jython.org/

Benefits:

1. Implements the full Python mini-language.
2. Jython has seen 20+ years of significant use and testing.
3. Unit tests in tests/.

Drawbacks:

1. The module has a larger footprint than other, minimal modules on npmjs.org.
2. The module is likely slower than the smaller alternatives, although
   it probably won't matter to most projects.

Alternatives (as of 2021):

1. This module          2900 lines of code
2. string-format         300 lines of code
3. python-format-js      163 lines of code

Cheers -- Conan Albrecht

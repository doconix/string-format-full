(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["format"] = factory();
	else
		root["format"] = factory();
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ index)
});

;// CONCATENATED MODULE: ./src/exceptions.js
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

/**
 * Base class of errors in the stringlib module.
 */
var PyError = /*#__PURE__*/function (_Error) {
  _inherits(PyError, _Error);

  var _super = _createSuper(PyError);

  function PyError(name, message) {
    var _this;

    _classCallCheck(this, PyError);

    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this, message].concat(args));
    _this.name = name;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(_assertThisInitialized(_this), FormatError);
    }

    return _this;
  }

  _createClass(PyError, [{
    key: "toString",
    value: function toString() {
      return "[".concat(this.name, "] ").concat(this.message);
    }
  }]);

  return PyError;
}( /*#__PURE__*/_wrapNativeSuper(Error));
/**
 * Adds convenience methods to match the Jython code.
 */

var FormatError = /*#__PURE__*/function (_PyError) {
  _inherits(FormatError, _PyError);

  var _super2 = _createSuper(FormatError);

  function FormatError() {
    _classCallCheck(this, FormatError);

    return _super2.apply(this, arguments);
  }

  _createClass(FormatError, null, [{
    key: "unknownFormat",
    value:
    /**
     * Convenience method returning a {@link Py#ValueError} reporting:
     * <p>
     * <code>"Unknown format code '"+code+"' for object of type '"+forType+"'"</code>
     *
     * @param code the presentation type
     * @param forType the type it was found applied to
     * @return exception to throw
     */
    function unknownFormat(code, forType) {
      var msg = "Unknown format code '" + code + "' for object of type '" + forType + "'";
      return new this('UnknownFormat', msg);
    }
    /**
     * Convenience method returning a {@link Py#ValueError} reporting that alternate form is not
     * allowed in a format specifier for the named type and specified typoe code.
     *
     * @param forType the type it was found applied to
     * @param code the formatting code (or '\0' not to mention one)
     * @return exception to throw
     */

  }, {
    key: "alternateFormNotAllowed",
    value: function alternateFormNotAllowed(forType) {
      var code = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '\0';
      return this.notAllowed("Alternate form (#)", forType, code);
    }
    /**
     * Convenience method returning a {@link Py#ValueError} reporting that the given alignment
     * flag is not allowed in a format specifier for the named type.
     *
     * @param align type of alignment
     * @param forType the type it was found applied to
     * @return exception to throw
     */

  }, {
    key: "alignmentNotAllowed",
    value: function alignmentNotAllowed(align, forType) {
      return this.notAllowed("'" + align + "' alignment flag", forType, '\0');
    }
    /**
     * Convenience method returning a {@link Py#ValueError} reporting that specifying a sign is
     * not allowed in a format specifier for the named type.
     *
     * @param forType the type it was found applied to
     * @param code the formatting code (or '\0' not to mention one)
     * @return exception to throw
     */

  }, {
    key: "signNotAllowed",
    value: function signNotAllowed(forType, code) {
      return this.notAllowed("Sign", forType, code);
    }
    /**
     * Convenience method returning a {@link Py#ValueError} reporting that specifying a
     * precision is not allowed in a format specifier for the named type.
     *
     * @param forType the type it was found applied to
     * @return exception to throw
     */

  }, {
    key: "precisionNotAllowed",
    value: function precisionNotAllowed(forType) {
      return this.notAllowed("Precision", forType, '\0');
    }
    /**
     * Convenience method returning a {@link Py#ValueError} reporting that zero padding is not
     * allowed in a format specifier for the named type.
     *
     * @param forType the type it was found applied to
     * @return exception to throw
     */

  }, {
    key: "zeroPaddingNotAllowed",
    value: function zeroPaddingNotAllowed(forType) {
      return this.notAllowed("Zero padding", forType, '\0');
    }
    /**
     * Convenience method returning a {@link Py#ValueError} reporting that some format specifier
     * feature is not allowed for the named format code and data type. Produces a message like:
     * <p>
     * <code>outrage+" not allowed with "+forType+" format specifier '"+code+"'"</code>
     * <p>
     * <code>outrage+" not allowed in "+forType+" format specifier"</code>
     *
     * @param outrage committed in the present case
     * @param forType the data type (e.g. "integer") it where it is an outrage
     * @param code the formatting code for which it is an outrage (or '\0' not to mention one)
     * @return exception to throw
     */

  }, {
    key: "notAllowed",
    value: function notAllowed(outrage, forType) {
      var code = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '\0';
      // Try really hard to be like CPython
      var codeAsString, withOrIn;

      if (code === '\0') {
        withOrIn = "in ";
        codeAsString = "";
      } else {
        withOrIn = "with ";
        codeAsString = " '" + code + "'";
      }

      var msg = outrage + " not allowed " + withOrIn + forType + " format specifier" + codeAsString;
      return new this('NotAllowed', msg);
    }
    /**
     * Convenience method returning a {@link Py#OverflowError} reporting:
     * <p>
     * <code>"formatted "+type+" is too long (precision too large?)"</code>
     *
     * @param type of formatting ("integer", "float")
     * @return exception to throw
     */

  }, {
    key: "precisionTooLarge",
    value: function precisionTooLarge(type) {
      var msg = "formatted " + type + " is too long (precision too large?)";
      return new this('PrecisionTooLarge', msg);
    }
  }]);

  return FormatError;
}(PyError); /////////////////////////////////////////////
///  Analogs for built-in Python exceptions
///  Using explicit names so minifiers don't munch them.

var IllegalArgumentException = /*#__PURE__*/function (_PyError2) {
  _inherits(IllegalArgumentException, _PyError2);

  var _super3 = _createSuper(IllegalArgumentException);

  function IllegalArgumentException(message) {
    _classCallCheck(this, IllegalArgumentException);

    return _super3.call(this, 'IllegalArgumentException', message);
  }

  return IllegalArgumentException;
}(PyError);
var ValueError = /*#__PURE__*/function (_PyError3) {
  _inherits(ValueError, _PyError3);

  var _super4 = _createSuper(ValueError);

  function ValueError(message) {
    _classCallCheck(this, ValueError);

    return _super4.call(this, 'ValueError', message);
  }

  return ValueError;
}(PyError);
;// CONCATENATED MODULE: ./src/InternalFormat.js
var _class2, _temp;

function InternalFormat_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function InternalFormat_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function InternalFormat_createClass(Constructor, protoProps, staticProps) { if (protoProps) InternalFormat_defineProperties(Constructor.prototype, protoProps); if (staticProps) InternalFormat_defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Transcoded to Javascript by Conan Albrecht <doconix@gmail.com>

var InternalFormat = /*#__PURE__*/function () {
  function InternalFormat() {
    InternalFormat_classCallCheck(this, InternalFormat);
  }

  InternalFormat_createClass(InternalFormat, null, [{
    key: "fromText",
    value:
    /**
     * Create a {@link Spec} object by parsing a format specification.
     *
     * @param text to parse
     * @return parsed equivalent to text
     */
    function fromText(text) {
      var parser = new InternalFormat.Parser(text);
      return parser.parse();
    }
    /**
     * A class that provides the base for implementations of type-specific formatting. In a limited
     * way, it acts like a StringBuilder to which text and one or more numbers may be appended,
     * formatted according to the format specifier supplied at construction. These are ephemeral
     * objects that are not, on their own, thread safe.
     */

  }]);

  return InternalFormat;
}();
/** Defaults applicable to most numeric types. Equivalent to " &gt;" */

_defineProperty(InternalFormat, "Formatter", /*#__PURE__*/function () {
  /**
   * Construct the formatter from a client-supplied buffer and a specification. Sets
   * {@link #mark} and {@link #start} to the end of the buffer. The new formatted object will
   * therefore be appended there and, when the time comes, padding will be applied to (just)
   * the new text.
   *
   * @param result destination buffer
   * @param spec parsed conversion specification
   */
  function _class(result, spec) {
    InternalFormat_classCallCheck(this, _class);

    this.spec = spec;
    this.result = result;
    this.start = this.mark = result.length;
  }
  /**
   * Current (possibly final) result of the formatting, as a <code>String</code>.
   *
   * @return formatted result
   */


  InternalFormat_createClass(_class, [{
    key: "getResult",
    value: function getResult() {
      return this.result.toString();
    }
    /*
     * Implement Appendable interface by delegation to the result buffer.
     *
     * @see java.lang.Appendable#append(char)
     */

  }, {
    key: "append",
    value: function append(c) {
      var start = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
      var end = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

      if (start === undefined && end === undefined) {
        this.result += c;
      } else {
        this.result += c.substring(start, end);
      }

      return this;
    }
    /**
     * Clear the instance variables describing the latest object in {@link #result}, ready to
     * receive a new one: sets {@link #start} and calls {@link #reset()}. This is necessary when
     * a <code>Formatter</code> is to be re-used. Note that this leaves {@link #mark} where it
     * is. In the core, we need this to support <code>complex</code>: two floats in the same
     * format, but padded as a unit.
     */

  }, {
    key: "setStart",
    value: function setStart() {
      // The new value will float at the current end of the result buffer.
      this.start = this.result.length; // If anything has been added since construction, reset all state.

      if (this.start > this.mark) {
        // Clear the variable describing the latest number in result.
        this.reset();
      }
    }
    /**
     * Clear the instance variables describing the latest object in {@link #result}, ready to
     * receive a new one. This is called from {@link #setStart()}. Subclasses override this
     * method and call {@link #setStart()} at the start of their format method.
     */

  }, {
    key: "reset",
    value: function reset() {
      // Clear the variables describing the latest object in result.
      this.lenSign = this.lenWhole = 0;
    }
    /**
     * Insert grouping characters (conventionally commas) into the whole part of the number.
     * {@link #lenWhole} will increase correspondingly.
     *
     * @param groupSize normally 3.
     * @param comma or some other character to use as a separator.
     */

  }, {
    key: "groupDigits",
    value: function groupDigits(groupSize, comma) {
      // Work out how many commas (or whatever) it takes to group the whole-number part.
      var commasNeeded = (this.lenWhole - 1) / groupSize;

      if (commasNeeded > 0) {
        // Index *just after* the current last digit of the whole part of the number.
        var from = this.start + this.lenSign + this.lenWhole; // Open a space into which the whole part will expand.

        this.makeSpaceAt(from, commasNeeded); // Index *just after* the end of that space.

        var to = from + commasNeeded; // The whole part will be longer by the number of commas to be inserted.

        this.lenWhole += commasNeeded;
        /*
         * Now working from high to low, copy all the digits that have to move. Each pass
         * copies one group and inserts a comma, which makes the to-pointer move one place
         * extra. The to-pointer descends upon the from-pointer from the right.
         */

        while (to > from) {
          // Copy a group
          for (var i = 0; i < groupSize; i++) {
            setCharAt(this.result, --to, this.result.charAt(--from));
          } // Write the comma that precedes it.


          setCharAt(this.result, --to, comma);
        }
      }
    }
    /**
     * Make a space in {@link #result} of a certain size and position. On return, the segment
     * lengths are likely to be invalid until the caller adjusts them corresponding to the
     * insertion. There is no guarantee what the opened space contains.
     *
     * @param pos at which to make the space
     * @param size of the space
     */

  }, {
    key: "makeSpaceAt",
    value: function makeSpaceAt(pos, size) {
      var fill = this.spec.getFill(' ');
      this.result = this.result.substring(0, pos) + new Array(size + 1).join(fill) + this.result.substring(pos);
    }
    /**
     * Convert letters in the representation of the current number (in {@link #result}) to upper
     * case.
     */

  }, {
    key: "uppercase",
    value: function uppercase() {
      this.result = this.result.toUpperCase();
    } // switcher to mimic the overloaded Java method

  }, {
    key: "pad",
    value: function pad() {
      if (arguments.length >= 2) {
        return this._pad2.apply(this, arguments);
      }

      return this._pad1.apply(this, arguments);
    }
    /**
     * Pad the result so far (defined as the contents of {@link #result} from {@link #mark} to
     * the end) using the alignment, target width and fill character defined in {@link #spec}.
     * The action of padding will increase the length of this segment to the target width, if
     * that is greater than the current length.
     * <p>
     * When the padding method has decided that that it needs to add n padding characters, it
     * will affect {@link #start} or {@link #lenWhole} as follows.
     * <table border style>
     * <caption>Effect of padding on {@link #start} or {@link #lenWhole}</caption>
     * <tr>
     * <th>align</th>
     * <th>meaning</th>
     * <th>start</th>
     * <th>lenWhole</th>
     * <th>result.length</th>
     * </tr>
     * <tr>
     * <th>{@code <}</th>
     * <td>left-aligned</td>
     * <td>+0</td>
     * <td>+0</td>
     * <td>+n</td>
     * </tr>
     * <tr>
     * <th>{@code >}</th>
     * <td>right-aligned</td>
     * <td>+n</td>
     * <td>+0</td>
     * <td>+n</td>
     * </tr>
     * <tr>
     * <th>{@code ^}</th>
     * <td>centred</td>
     * <td>+(n/2)</td>
     * <td>+0</td>
     * <td>+n</td>
     * </tr>
     * <tr>
     * <th>{@code =}</th>
     * <td>pad after sign</td>
     * <td>+0</td>
     * <td>+n</td>
     * <td>+n</td>
     * </tr>
     * </table>
     * Note that in the "pad after sign" mode, only the last number into the buffer receives the
     * padding. This padding gets incorporated into the whole part of the number. (In other
     * modes, the padding is around <code>result[mark:]</code>.) When this would not be
     * appropriate, it is up to the client to disallow this (which <code>complex</code> does).
     *
     * @return this Formatter object
     */

  }, {
    key: "_pad1",
    value: function _pad1() {
      // We'll need this many pad characters (if>0). Note Spec.UNDEFINED<0.
      var n = this.spec.width - (this.result.length - this.mark);

      if (n > 0) {
        this.pad(this.mark, n);
      }

      return this;
    }
    /**
     * Pad the last result (defined as the contents of {@link #result} from argument
     * <code>leftIndex</code> to the end) using the alignment, by <code>n</code> repetitions of
     * the fill character defined in {@link #spec}, and distributed according to
     * <code>spec.align</code>. The value of <code>leftIndex</code> is only used if the
     * alignment is '&gt;' (left) or '^' (both). The value of the critical lengths (lenWhole,
     * lenSign, etc.) are not affected, because we assume that <code>leftIndex &lt;= </code>
     * {@link #start}.
     *
     * @param leftIndex the index in result at which to insert left-fill characters.
     * @param n number of fill characters to insert.
     */

  }, {
    key: "_pad2",
    value: function _pad2(leftIndex, n) {
      var align = this.spec.getAlign('>'); // Right for numbers (strings will supply '<' align)

      var fill = this.spec.getFill(' '); // Start by assuming padding is all leading ('>' case or '=')

      var leading = n; // Split the total padding according to the alignment

      if (align === '^') {
        // Half the padding before
        leading = parseInt(n / 2);
      } else if (align === '<') {
        // All the padding after
        leading = 0;
      } // All padding that is not leading is trailing


      var trailing = n - leading; // Insert the leading space

      if (leading > 0) {
        if (align === '=') {
          // Incorporate into the (latest) whole part
          this.leftIndex = this.start + this.lenSign;
          this.lenWhole += leading;
        } else {
          // Default is to insert at the stated leftIndex <= start.
          this.start += leading;
        }

        this.makeSpaceAt(leftIndex, leading);

        for (var i = 0; i < leading; i++) {
          setCharAt(this.result, this.leftIndex + i, fill);
        }
      } // Append the trailing space


      for (var _i = 0; _i < trailing; _i++) {
        this.result += fill;
      } // Check for special case


      if (align === '=' && fill === '0' && this.spec.grouping) {
        // We must extend the grouping separator into the padding
        this.zeroPadAfterSignWithGroupingFixup(3, ',');
      }
    }
    /**
     * Fix-up the zero-padding of the last formatted number in {@link #result} in the special
     * case where a sign-aware padding (<code>{@link #spec}.align='='</code>) was requested, the
     * fill character is <code>'0'</code>, and the digits are to be grouped. In these exact
     * circumstances, the grouping, which must already have been applied to the (whole part)
     * number itself, has to be extended into the zero-padding.
     *
     * <pre>
     * &gt;&gt;&gt; format(-12e8, " =30,.3f")
     * '-            1,200,000,000.000'
     * &gt;&gt;&gt; format(-12e8, "*=30,.3f")
     * '-************1,200,000,000.000'
     * &gt;&gt;&gt; format(-12e8, "*&gt;30,.3f")
     * '************-1,200,000,000.000'
     * &gt;&gt;&gt; format(-12e8, "0&gt;30,.3f")
     * '000000000000-1,200,000,000.000'
     * &gt;&gt;&gt; format(-12e8, "0=30,.3f")
     * '-0,000,000,001,200,000,000.000'
     * </pre>
     *
     * The padding has increased the overall length of the result to the target width. About one
     * in three calls to this method adds one to the width, because the whole part cannot start
     * with a comma.
     *
     * <pre>
     * &gt;&gt;&gt; format(-12e8, " =30,.4f")
     * '-           1,200,000,000.0000'
     * &gt;&gt;&gt; format(-12e8, "0=30,.4f")
     * '-<b>0</b>,000,000,001,200,000,000.0000'
     * </pre>
     *
     * @param groupSize normally 3.
     * @param comma or some other character to use as a separator.
     */

  }, {
    key: "zeroPadAfterSignWithGroupingFixup",
    value: function zeroPadAfterSignWithGroupingFixup(groupSize, comma) {
      /*
       * Suppose the format call was format(-12e8, "0=30,.3f"). At this point, we have
       * something like this in result: .. [-|0000000000001,200,000,000|.|000||]
       *
       * All we need do is over-write some of the zeros with the separator comma, in the
       * portion marked as the whole-part: [-|0,000,000,001,200,000,000|.|000||]
       */
      // First digit of the whole-part.
      var firstZero = this.start + this.lenSign; // One beyond last digit of the whole-part.

      var p = firstZero + this.lenWhole; // Step back down the result array visiting the commas. (Easiest to do all of them.)

      var step = groupSize + 1;

      for (p = p - step; p >= firstZero; p -= step) {
        setCharAt(this.result, p, comma);
      } // Sometimes the last write was exactly at the first padding zero.


      if (p + step === firstZero) {
        /*
         * Suppose the format call was format(-12e8, "0=30,.4f"). At the beginning, we had
         * something like this in result: . [-|000000000001,200,000,000|.|0000||]
         *
         * And now, result looks like this: [-|,000,000,001,200,000,000|.|0000||] in which
         * the first comma is wrong, but so would be a zero. We have to insert another zero,
         * even though this makes the result longer than we were asked for.
         */
        this.result = this.result.substring(0, firstZero) + '0' + this.result.substring(firstZero);
        this.lenWhole += 1;
      }
    }
  }]);

  return _class;
}());

_defineProperty(InternalFormat, "Spec", (_temp = _class2 = /*#__PURE__*/function () {
  /** Non-character code point used to represent "no value" in <code>char</code> attributes. */

  /** Negative value used to represent "no value" in <code>int</code> attributes. */

  /**
   * Test to see if an attribute has been specified.
   *
   * @param c attribute
   * @return true only if the attribute is not equal to {@link #NONE}
   */

  /**
   * Constructor to set all the fields in the format specifier.
   *
   * <pre>
   * [[fill]align][sign][#][0][width][,][.precision][type]
   * </pre>
   *
   * @param fill fill character (or {@link #NONE}
   * @param align alignment indicator, one of {'&lt;', '^', '&gt;', '='}
   * @param sign policy, one of <code>'+'</code>, <code>'-'</code>, or <code>' '</code>.
   * @param alternate true to request alternate formatting mode (<code>'#'</code> flag).
   * @param width of field after padding or -1 to default
   * @param grouping true to request comma-separated groups
   * @param precision (e.g. decimal places) or -1 to default
   * @param type indicator character
   */
  function _class2(fill, align, sign, alternate, width, grouping, precision, type) {
    InternalFormat_classCallCheck(this, _class2);

    this.fill = fill;
    this.align = align;
    this.sign = sign;
    this.alternate = alternate;
    this.width = width;
    this.grouping = grouping;
    this.precision = precision;
    this.type = type || this.constructor.NONE;
  }
  /**
   * Return a format specifier (text) equivalent to the value of this Spec.
   */


  InternalFormat_createClass(_class2, [{
    key: "toString",
    value: function toString() {
      var buf = '';

      if (InternalFormat.Spec.specified(this.fill)) {
        buf += this.fill;
      }

      if (InternalFormat.Spec.specified(this.align)) {
        buf += this.align;
      }

      if (InternalFormat.Spec.specified(this.sign)) {
        buf += this.sign;
      }

      if (this.alternate) {
        buf += '#';
      }

      if (InternalFormat.Spec.specified(this.width)) {
        buf += this.width;
      }

      if (this.grouping) {
        buf += ',';
      }

      if (InternalFormat.Spec.specified(this.precision)) {
        buf += '.' + this.precision;
      }

      if (InternalFormat.Spec.specified(this.type)) {
        buf += this.type;
      }

      return buf.toString();
    }
    /**
     * Return a merged <code>Spec</code> object, in which any attribute of this object that is
     * specified (or <code>true</code>), has the same value in the result, and any attribute of
     * this object that is unspecified (or <code>false</code>), has the value that attribute
     * takes in the other object. Thus the second object supplies default values. (These
     * defaults may also be unspecified.) The use of this method is to allow a <code>Spec</code>
     * constructed from text to record exactly, and only, what was in the textual specification,
     * while the __format__ method of a client object supplies its type-specific defaults. Thus
     * "20" means "&lt;20s" to a <code>str</code>, "&gt;20.12" to a <code>float</code> and
     * "&gt;20.12g" to a <code>complex</code>.
     *
     * @param other defaults to merge where this object does not specify the attribute.
     * @return a new Spec object.
     */

  }, {
    key: "withDefaults",
    value: function withDefaults(other) {
      return new InternalFormat.Spec( //
      this.constructor.specified(this.fill) ? this.fill : other.fill, //
      this.constructor.specified(this.align) ? this.align : other.align, //
      this.constructor.specified(this.sign) ? this.sign : other.sign, //
      this.alternate || other.alternate, //
      this.constructor.specified(this.width) ? this.width : other.width, //
      this.grouping || other.grouping, //
      this.constructor.specified(this.precision) ? this.precision : other.precision, //
      this.constructor.specified(this.type) ? this.type : other.type //
      );
    } // NOTE: .NUMERIC and .STRING moved to bottom of this file

    /** The alignment from the parsed format specification, or default. */

  }, {
    key: "getFill",
    value: function getFill(defaultFill) {
      return this.constructor.specified(this.fill) ? this.fill : defaultFill;
    }
    /** The alignment from the parsed format specification, or default. */

  }, {
    key: "getAlign",
    value: function getAlign(defaultAlign) {
      return this.constructor.specified(this.align) ? this.align : defaultAlign;
    }
    /** The precision from the parsed format specification, or default. */

  }, {
    key: "getPrecision",
    value: function getPrecision(defaultPrecision) {
      return this.constructor.specified(this.precision) ? this.precision : defaultPrecision;
    }
    /** The type code from the parsed format specification, or default supplied. */

  }, {
    key: "getType",
    value: function getType(defaultType) {
      return this.constructor.specified(this.type) ? this.type : defaultType;
    }
  }]);

  return _class2;
}(), _defineProperty(_class2, "NONE", "\uFFFF"), _defineProperty(_class2, "UNSPECIFIED", -1), _defineProperty(_class2, "specified", function (c) {
  if (Number.isInteger(c)) {
    return c >= 0;
  }

  return c !== _class2.NONE;
}), _temp));

_defineProperty(InternalFormat, "Parser", /*#__PURE__*/function () {
  /**
   * Constructor simply holds the specification string ahead of the {@link #parse()}
   * operation.
   *
   * @param spec format specifier to parse (e.g. "&lt;+12.3f")
   */
  function _class3(spec) {
    InternalFormat_classCallCheck(this, _class3);

    this.spec = spec;
    this.ptr = 0;
  }
  /**
   * Parse the specification with which this object was initialised into an {@link Spec},
   * which is an object encapsulating the format for use by formatting methods. This parser
   * deals only with the format specifiers themselves, as accepted by the
   * <code>__format__</code> method of a type, or the <code>format()</codqe> built-in, not
   * format strings in general as accepted by <code>str.format()</code>.
   *
   * @return the <code>Spec</code> equivalent to the string given.
   */

  /*
   * This method is the equivalent of CPython's parse_internal_render_format_spec() in
   * ~/Objects/stringlib/formatter.h, but we deal with defaults another way.
   */


  InternalFormat_createClass(_class3, [{
    key: "parse",
    value: function parse() {
      var fill = InternalFormat.Spec.NONE;
      var align = InternalFormat.Spec.NONE;
      var sign = InternalFormat.Spec.NONE;
      var type = InternalFormat.Spec.NONE;
      var alternate = false;
      var grouping = false;
      var width = InternalFormat.Spec.UNSPECIFIED;
      var precision = InternalFormat.Spec.UNSPECIFIED; // Scan [[fill]align] ...

      if (this.isAlign()) {
        // First is alignment. fill not specified.
        align = this.spec.charAt(this.ptr++);
      } else {
        // Peek ahead
        this.ptr += 1;

        if (this.isAlign()) {
          // Second character is alignment, so first is fill
          fill = this.spec.charAt(0);
          align = this.spec.charAt(this.ptr++);
        } else {
          // Second character is not alignment. We are still at square zero.
          this.ptr = 0;
        }
      } // Scan [sign] ...


      if (this.isAt("+- ")) {
        sign = this.spec.charAt(this.ptr++);
      } // Scan [#] ...


      alternate = this.scanPast('#'); // Scan [0] ...

      if (this.scanPast('0')) {
        // Accept 0 here as equivalent to zero-fill but only not set already.
        if (!InternalFormat.Spec.specified(fill)) {
          fill = '0';

          if (!InternalFormat.Spec.specified(align)) {
            // Also accept it as equivalent to "=" aligment but only not set already.
            align = '=';
          }
        }
      } // Scan [width]


      if (this.isDigit()) {
        width = this.scanInteger();
      } // Scan [,][.precision][type]


      grouping = this.scanPast(','); // Scan [.precision]

      if (this.scanPast('.')) {
        if (this.isDigit()) {
          precision = this.scanInteger();
        } else {
          throw new IllegalArgumentException("Format specifier missing precision: {".concat(this.spec, "}"));
        }
      } // Scan [type]


      if (this.ptr < this.spec.length) {
        type = this.spec.charAt(this.ptr++);
      } // If we haven't reached the end, something is wrong


      if (this.ptr !== this.spec.length) {
        throw new IllegalArgumentException("Invalid conversion specification: {".concat(this.spec, "}"));
      } // Create a specification


      return new InternalFormat.Spec(fill, align, sign, alternate, width, grouping, precision, type);
    }
    /** Test that the next character is exactly the one specified, and advance past it if it is. */

  }, {
    key: "scanPast",
    value: function scanPast(c) {
      if (this.ptr < this.spec.length && this.spec.charAt(this.ptr) === c) {
        this.ptr++;
        return true;
      } else {
        return false;
      }
    }
    /** Test that the next character is one of a specified set. */

  }, {
    key: "isAt",
    value: function isAt(chars) {
      return this.ptr < this.spec.length && chars.indexOf(this.spec.charAt(this.ptr)) >= 0;
    }
    /** Test that the next character is one of the alignment characters. */

  }, {
    key: "isAlign",
    value: function isAlign() {
      return this.ptr < this.spec.length && "<^>=".indexOf(this.spec.charAt(this.ptr)) >= 0;
    }
    /** Test that the next character is a digit. */

  }, {
    key: "isDigit",
    value: function isDigit() {
      return this.ptr < this.spec.length && Number.isInteger(parseInt(this.spec.charAt(this.ptr)));
    }
    /** The current character is a digit (maybe a sign). Scan the integer, */

  }, {
    key: "scanInteger",
    value: function scanInteger() {
      var p = this.ptr++;

      while (this.isDigit()) {
        this.ptr++;
      }

      return parseInt(this.spec.substring(p, this.ptr));
    }
  }]);

  return _class3;
}());

InternalFormat.Spec.NUMERIC = new InternalFormat.Spec(' ', '>', InternalFormat.Spec.NONE, false, InternalFormat.Spec.UNSPECIFIED, false, InternalFormat.Spec.UNSPECIFIED, InternalFormat.Spec.NONE);
/** Defaults applicable to string types. Equivalent to " &lt;" */

InternalFormat.Spec.STRING = new InternalFormat.Spec(' ', '<', InternalFormat.Spec.NONE, false, InternalFormat.Spec.UNSPECIFIED, false, InternalFormat.Spec.UNSPECIFIED, InternalFormat.Spec.NONE); //////////////////////////////////////////////////////////////
///  Utility functions added onto the Jython codebase

function setCharAt(st, index, replacement) {
  return st.substr(0, index) + replacement + st.substr(index + replacement.length);
}
;// CONCATENATED MODULE: ./src/FieldNameIterator.js
var _Symbol$iterator;

function FieldNameIterator_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function FieldNameIterator_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function FieldNameIterator_createClass(Constructor, protoProps, staticProps) { if (protoProps) FieldNameIterator_defineProperties(Constructor.prototype, protoProps); if (staticProps) FieldNameIterator_defineProperties(Constructor, staticProps); return Constructor; }

function FieldNameIterator_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Transcoded to Javascript by Conan Albrecht <doconix@gmail.com>

/**
 * This class is an implementation of the iterator object returned by
 * <code>str._formatter_field_name_split()</code> and
 * <code>unicode._formatter_field_name_split()</code>. The function
 * <code>_formatter_field_name_split()</code> returns a pair (tuple) consisting of a head element
 * and an instance of this iterator. The constructor of this class effectively implements that
 * function, since as well as "being" the iterator, the object has an extra method {@link #head()}
 * to return the required first member of the pair.
 */

_Symbol$iterator = Symbol.iterator;
var FieldNameIterator = /*#__PURE__*/function (_Symbol$iterator2) {
  /**
   * Create an iterator for the parts of this field name (and extract the head name field, which
   * may be an empty string). According to the Python Standard Library documentation, a
   * replacement field name has the structure:
   *
   * <pre>
   * field_name        ::=  arg_name ("." attribute_name | "[" element_index "]")*
   * arg_name          ::=  [identifier | integer]
   * attribute_name    ::=  identifier
   * element_index     ::=  integer | index_string
   * </pre>
   *
   * The object is used from PyUnicode and from PyString, and we have to signal which it is, so
   * that returned values may match in type.
   *
   * @param fieldName the field name as UTF-16
   * @param bytes true if elements returned should be PyString, else PyUnicode
   */
  function FieldNameIterator(fieldName, bytes) {
    FieldNameIterator_classCallCheck(this, FieldNameIterator);

    this.markup = fieldName;
    this.bytes = false; // .bytes is not used because JS is always unicode

    this.index = this.nextDotOrBracket(fieldName);
    var headStr = fieldName.substring(0, this.index);
    this.head = +headStr;

    if (isNaN(this.head)) {
      this.head = headStr;
    }
  }
  /**
   * Convenience method to wrap a value as a PyInteger, if it is an Integer, or as
   * <code>PyString</code> or <code>PyUnicode</code> according to the type of the original field
   * name string. These objects are being used as field specifiers in navigating arguments to a
   * format statement.
   *
   * @param value to wrap as a PyObject.
   * @return PyObject equivalent field specifier
   */


  FieldNameIterator_createClass(FieldNameIterator, [{
    key: "wrap",
    value: function wrap(value) {
      if (Number.isInteger(parseInt(value))) {
        return parseInt(value);
      } else {
        return String(value);
      }
    }
  }, {
    key: "nextDotOrBracket",
    value: function nextDotOrBracket(markup) {
      var dotPos = markup.indexOf('.', this.index);

      if (dotPos < 0) {
        dotPos = markup.length;
      }

      var bracketPos = markup.indexOf('[', this.index);

      if (bracketPos < 0) {
        bracketPos = markup.length;
      }

      return Math.min(dotPos, bracketPos);
    }
    /** @return the isolated head object from the field name. */

  }, {
    key: "head",
    value: function head() {
      return this.head;
    }
  }, {
    key: "pyHead",
    value: function pyHead() {
      return this.wrap(this.head);
    }
  }, {
    key: _Symbol$iterator2,
    value: /*#__PURE__*/regeneratorRuntime.mark(function value() {
      var chunk;
      return regeneratorRuntime.wrap(function value$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (false) {}

              chunk = this.nextChunk();

              if (!(chunk === null)) {
                _context.next = 4;
                break;
              }

              return _context.abrupt("return");

            case 4:
              _context.next = 6;
              return [chunk.is_attr, this.wrap(chunk.value)];

            case 6:
              _context.next = 0;
              break;

            case 8:
            case "end":
              return _context.stop();
          }
        }
      }, value, this);
    })
    /**
     * Return the next "chunk" of the field name (or return null if ended). A chunk is a 2-tuple
     * describing:
     * <ol start=0>
     * <li>whether the chunk is an attribute name,</li>
     * <li>the name or number (as a String or Integer) for accessing the value.</li>
     * </ol>
     *
     * @return next element of the field name
     */

  }, {
    key: "nextChunk",
    value: function nextChunk() {
      if (this.index === this.markup.length) {
        return null;
      }

      var chunk = new FieldNameIterator.Chunk();

      if (this.markup.charAt(this.index) === '[') {
        this.parseItemChunk(chunk);
      } else if (this.markup.charAt(this.index) === '.') {
        this.parseAttrChunk(chunk);
      } else {
        throw new IllegalArgumentException("Only '.' or '[' may follow ']' in format field specifier");
      }

      return chunk;
    }
  }, {
    key: "parseItemChunk",
    value: function parseItemChunk(chunk) {
      chunk.is_attr = false;
      var endBracket = this.markup.indexOf(']', this.index + 1);

      if (endBracket < 0) {
        throw new IllegalArgumentException("Missing ']' in format string");
      }

      var itemValue = this.markup.substring(this.index + 1, endBracket);

      if (itemValue.length === 0) {
        throw new IllegalArgumentException("Empty attribute in format string");
      }

      try {
        chunk.value = parseInt(itemValue);
      } catch (e) {
        chunk.value = itemValue;
      }

      this.index = endBracket + 1;
    }
  }, {
    key: "parseAttrChunk",
    value: function parseAttrChunk(chunk) {
      this.index++; // skip dot

      chunk.is_attr = true;
      var pos = this.nextDotOrBracket(this.markup);

      if (pos === this.index) {
        throw new IllegalArgumentException("Empty attribute in format string");
      }

      chunk.value = this.markup.substring(this.index, pos);
      this.index = pos;
    }
  }]);

  return FieldNameIterator;
}(_Symbol$iterator);

FieldNameIterator_defineProperty(FieldNameIterator, "Chunk", /*#__PURE__*/function () {
  function _class() {
    FieldNameIterator_classCallCheck(this, _class);

    this.is_attr = null;
    this.value = null;
  }

  return _class;
}());
;// CONCATENATED MODULE: ./src/MarkupIterator.js
function MarkupIterator_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function MarkupIterator_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function MarkupIterator_createClass(Constructor, protoProps, staticProps) { if (protoProps) MarkupIterator_defineProperties(Constructor.prototype, protoProps); if (staticProps) MarkupIterator_defineProperties(Constructor, staticProps); return Constructor; }

function MarkupIterator_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Transcoded to Javascript by Conan Albrecht <doconix@gmail.com>

/**
 * Provides an implementation of the object that <code>str._formatter_parser()</code> returns, which
 * is an iterator returning successive 4-tuples, the sequence being equivalent to the original
 * string.
 */

var MarkupIterator = /*#__PURE__*/function () {
  // switcher to emulate overloaded constructor
  function MarkupIterator() {
    MarkupIterator_classCallCheck(this, MarkupIterator);

    if (arguments.length >= 2) {
      return this.constructor2.apply(this, arguments);
    }

    return this.constructor1.apply(this, arguments);
  }
  /** Constructor used at top-level to enumerate a format. */


  MarkupIterator_createClass(MarkupIterator, [{
    key: "constructor1",
    value: function constructor1(markupObject) {
      this.markup = markupObject.getString();
      this.bytes = false; // .bytes not used in this JS version

      this.numbering = new MarkupIterator.FieldNumbering();
    }
    /** Variant constructor used when formats are nested. */

  }, {
    key: "constructor2",
    value: function constructor2(enclosingIterator, subMarkup) {
      this.markup = subMarkup;
      this.bytes = enclosingIterator.bytes;
      this.numbering = enclosingIterator.numbering;
    }
    /**
     * Return the next {@link Chunk} from the iterator, which is a structure containing parsed
     * elements of the replacement field (if any), and its preceding text. This is the Java
     * equivalent of the tuple returned by {@link #__iternext__()}. This finds use in the
     * implementation of <code>str.format</code> and <code>unicode.format</code>.
     *
     * @return the chunk
     */

  }, {
    key: "nextChunk",
    value: function nextChunk() {
      if (this.index === this.markup.length) {
        return null;
      }

      var result = new MarkupIterator.Chunk(); // pos = index is the index of the first text not already chunked

      var pos = this.index; // Advance pos to the first '{' that is not a "{{" (escaped brace), or pos<0 if none such.

      while (true) {
        pos = this.indexOfFirst(this.markup, pos, '{', '}');

        if (pos >= 0 && pos < this.markup.length - 1 && this.markup.charAt(pos + 1) === this.markup.charAt(pos)) {
          // skip escaped bracket
          pos += 2;
        } else if (pos >= 0 && this.markup.charAt(pos) === '}') {
          // Un-escaped '}' is a syntax error
          throw new IllegalArgumentException("Single '}' encountered in format string");
        } else {
          // pos is at an un-escaped '{'
          break;
        }
      } // markup[index:pos] is the literal part of this chunk.


      if (pos < 0) {
        // ... except pos<0, and there is no further format specifier, only literal text.
        result.literalText = this.unescapeBraces(this.markup.substring(this.index));
        this.index = this.markup.length;
      } else {
        // Grab the literal text, dealing with escaped braces.
        result.literalText = this.unescapeBraces(this.markup.substring(this.index, pos)); // Scan through the contents of the format spec, between the braces. Skip one '{'.

        pos++;
        var fieldStart = pos;
        var count = 1;

        while (pos < this.markup.length) {
          if (this.markup.charAt(pos) === '{') {
            // This means the spec we are gathering itself contains nested specifiers.
            count++;
            result.formatSpecNeedsExpanding = true;
          } else if (this.markup.charAt(pos) === '}') {
            // And here is a '}' matching one we already counted.
            count--;

            if (count === 0) {
              // ... matching the one we began with: parse the replacement field.
              this.parseField(result, this.markup.substring(fieldStart, pos));
              pos++;
              break;
            }
          }

          pos++;
        }

        if (count > 0) {
          // Must be end of string without matching '}'.
          throw new IllegalArgumentException("Single '{' encountered in format string");
        }

        this.index = pos;
      }

      return result;
    }
    /**
     * If originally given a PyString, string elements in the returned tuples must be PyString not
     * PyUnicode.
     *
     * @return true if originally given a PyString
     */

  }, {
    key: "isBytes",
    value: function isBytes() {
      return this.bytes;
    }
  }, {
    key: "unescapeBraces",
    value: function unescapeBraces(substring) {
      return substring.replace("{{", "{").replace("}}", "}");
    }
    /**
     * Parse a "replacement field" consisting of a name, conversion and format specification.
     * According to the Python Standard Library documentation, a replacement field has the
     * structure:
     *
     * <pre>
     * replacement_field ::=  "{" [field_name] ["!" conversion] [":" format_spec] "}"
     * field_name        ::=  arg_name ("." attribute_name | "[" element_index "]")*
     * arg_name          ::=  [identifier | integer]
     * attribute_name    ::=  identifier
     * element_index     ::=  integer | index_string
     * </pre>
     *
     * except at this point, we have already discarded the outer braces.
     *
     * @param result destination chunk
     * @param fieldMarkup specifying a replacement field, possibly with nesting
     */

  }, {
    key: "parseField",
    value: function parseField(result, fieldMarkup) {
      var pos = this.indexOfFirst(fieldMarkup, 0, '!', ':');

      if (pos >= 0) {
        // There's a '!' or a ':', so what precedes the first of them is a field name.
        result.fieldName = fieldMarkup.substring(0, pos);

        if (fieldMarkup.charAt(pos) === '!') {
          // There's a conversion specifier
          if (pos === fieldMarkup.length - 1) {
            throw new IllegalArgumentException("end of format while " + "looking for conversion specifier");
          }

          result.conversion = fieldMarkup.substring(pos + 1, pos + 2);
          pos += 2; // And if that's not the end, there ought to be a ':' now.

          if (pos < fieldMarkup.length) {
            if (fieldMarkup.charAt(pos) !== ':') {
              throw new IllegalArgumentException("expected ':' " + "after conversion specifier");
            } // So the format specifier is from the ':' to the end.


            result.formatSpec = fieldMarkup.substring(pos + 1);
          }
        } else {
          // No '!', so the format specifier is from the ':' to the end. Or empty.
          result.formatSpec = fieldMarkup.substring(pos + 1);
        }
      } else {
        // Neither a '!' nor a ':', the whole thing is a name.
        result.fieldName = fieldMarkup;
      }

      if (!result.fieldName) {
        // The field was empty, so generate a number automatically.
        result.fieldName = this.numbering.nextAutomaticFieldNumber();
        return;
      } // Automatic numbers must also work when there is an .attribute or [index]


      var c = result.fieldName.charAt(0);

      if (c === '.' || c === '[') {
        result.fieldName = this.numbering.nextAutomaticFieldNumber() + result.fieldName;
        return;
      } // Finally, remember the argument number was specified (perhaps complain of mixed use)


      if (Number.isInteger(parseInt(c))) {
        this.numbering.useManualFieldNumbering();
      }
    }
    /** Find the first of two characters, or return -1. */

  }, {
    key: "indexOfFirst",
    value: function indexOfFirst(s, start, c1, c2) {
      var i1 = s.indexOf(c1, start);
      var i2 = s.indexOf(c2, start);

      if (i1 === -1) {
        return i2;
      }

      if (i2 === -1) {
        return i1;
      }

      return Math.min(i1, i2);
    }
    /**
     * Class used locally to assign indexes to the automatically-numbered arguments (see String
     * Formatting section of the Python Standard Library).
     */

  }]);

  return MarkupIterator;
}();

MarkupIterator_defineProperty(MarkupIterator, "TYPE", 'MarkupIterator');

MarkupIterator_defineProperty(MarkupIterator, "FieldNumbering", /*#__PURE__*/function () {
  function _class() {
    MarkupIterator_classCallCheck(this, _class);

    this.manualFieldNumberSpecified = false;
    this.automaticFieldNumber = 0;
  }
  /**
   * Generate a numeric argument index automatically, or raise an error if already started
   * numbering manually.
   *
   * @return index as string
   */


  MarkupIterator_createClass(_class, [{
    key: "nextAutomaticFieldNumber",
    value: function nextAutomaticFieldNumber() {
      if (this.manualFieldNumberSpecified) {
        throw new IllegalArgumentException("cannot switch from manual field specification to automatic field numbering");
      }

      return String(this.automaticFieldNumber++);
    }
    /**
     * Remember we are numbering manually, and raise an error if already started numbering
     * automatically.
     */

  }, {
    key: "useManualFieldNumbering",
    value: function useManualFieldNumbering() {
      if (this.manualFieldNumberSpecified) {
        return;
      }

      if (this.automaticFieldNumber !== 0) {
        throw new IllegalArgumentException("cannot switch from automatic field numbering to manual field specification");
      }

      this.manualFieldNumberSpecified = true;
    }
  }]);

  return _class;
}());

MarkupIterator_defineProperty(MarkupIterator, "Chunk", /*#__PURE__*/function () {
  function _class2() {
    MarkupIterator_classCallCheck(this, _class2);

    /** The text leading up to the next format field. */
    this.literalText = null;
    /** The field name or number (as a string) for accessing the value. */

    this.fieldName = null;
    /** The format specifier such as <code>"#12x"</code>. */

    this.formatSpec = null;
    /** Conversion to be applied, e.g. <code>'r'</code> for <code>repr()</code>. */

    this.conversion = null;
    /** Signals the <code>formatSpec</code> needs expanding recursively. */

    this.formatSpecNeedsExpanding = null;
  }

  return _class2;
}());
;// CONCATENATED MODULE: ./src/PyType.js
function PyType_typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { PyType_typeof = function _typeof(obj) { return typeof obj; }; } else { PyType_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return PyType_typeof(obj); }

function PyType_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function PyType_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function PyType_createClass(Constructor, protoProps, staticProps) { if (protoProps) PyType_defineProperties(Constructor.prototype, protoProps); if (staticProps) PyType_defineProperties(Constructor, staticProps); return Constructor; }

function PyType_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




/**
 * Jython implements classes for the various types: PyString, PyInteger, PyLong, PyFloat, etc.
 * Each of these classes handles a different set of formatting spec types.
 *
 * Rather than transcode each class in full, the common code relevant to formatting
 * is lifted from here.
 */

var PyType = /*#__PURE__*/function () {
  function PyType(st) {
    PyType_classCallCheck(this, PyType);

    this.st = st;
  }

  PyType_createClass(PyType, [{
    key: "getString",
    value: function getString() {
      return this.st;
    }
    /**
     * The primary method that formats this string by interpolating
     * the provided args.
     *
     * See also index.js :: format()
     */

  }, {
    key: "format",
    value: function format() {
      if (this.st === undefined || this.st === null) {
        throw Error('cannot format value: ' + String(this.st));
      }

      var lookups = this.parseArgs.apply(this, arguments);
      return this.buildFormattedString(lookups, null, null);
    }
    /**
     * Parses the given args into a lookups dictionary.
     * This method is a departure from the Jython, but placing in a single JS object
     * rather than separating into args/keywords makes key lookups more clear
     * because they are in a single object rather than two.
     */

  }, {
    key: "parseArgs",
    value: function parseArgs() {
      var idx = 0;
      var lookups = {};

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      for (var _i = 0, _args = args; _i < _args.length; _i++) {
        var arg = _args[_i];

        if (!Array.isArray(arg) && PyType_typeof(arg) === 'object' && arg !== null) {
          // arg is object, so extend into lookups
          Object.assign(lookups, arg);
        } else {
          // arg is some other type, so make it an indexed item
          lookups[String(idx)] = arg;
          idx += 1;
        }
      }

      return lookups;
    }
    /**
     * Implements PEP-3101 {}-formatting methods <code>str.format()</code> and
     * <code>unicode.format()</code>. When called with <code>enclosingIterator === null</code>, this
     * method takes this object as its formatting string. The method is also called (calls itself)
     * to deal with nested formatting specifications. In that case, <code>enclosingIterator</code>
     * is a {@link MarkupIterator} on this object and <code>value</code> is a substring of this
     * object needing recursive translation.
     *
     * @param lookups to be interpolated into the string
     * @param enclosingIterator when used nested, null if subject is this <code>PyString</code>
     * @param value the format string when <code>enclosingIterator</code> is not null
     * @return the formatted string based on the arguments
     */

  }, {
    key: "buildFormattedString",
    value: function buildFormattedString(lookups, enclosingIterator, value) {
      var it;

      if (enclosingIterator === null) {
        // Top-level call acts on this object.
        it = new MarkupIterator(this);
      } else {
        // Nested call acts on the substring and some state from existing iterator.
        it = new MarkupIterator(enclosingIterator, value);
      } // Result will be formed here


      var result = '';

      while (true) {
        var chunk = it.nextChunk();

        if (chunk === null) {
          break;
        } // A Chunk encapsulates a literal part ...


        result += chunk.literalText; // ... and the parsed form of the replacement field that followed it (if any)

        if (chunk.fieldName !== null) {
          // The grammar of the replacement field is:
          // "{" [field_name] ["!" conversion] [":" format_spec] "}"
          // Get the object referred to by the field name (which may be omitted).
          var fieldObj = this.getFieldObject(chunk.fieldName, it.isBytes(), lookups); // Python codes None to 'None'

          if (fieldObj === null) {
            fieldObj = 'null';
          } // The format_spec may be simple, or contained nested replacement fields.


          var formatSpec = chunk.formatSpec;

          if (chunk.formatSpecNeedsExpanding) {
            if (enclosingIterator !== null) {
              // PEP 3101 says only 2 levels
              throw new ValueError("Max string recursion exceeded");
            } // Recursively interpolate further args into chunk.formatSpec


            formatSpec = this.buildFormattedString(lookups, it, formatSpec);
          }

          result = this.renderField(fieldObj, formatSpec, result);
        }
      }

      return result;
    }
    /**
     * Return the object referenced by a given field name, interpreted in the context of the given
     * argument list, containing positional and keyword arguments.
     *
     * @param fieldName to interpret.
     * @param bytes true if the field name is from a PyString, false for PyUnicode.
     * @param lookups values to be interpolated.
     * @return the object designated or <code>null</code>.
     */

  }, {
    key: "getFieldObject",
    value: function getFieldObject(fieldName, bytes, lookups) {
      var iterator = new FieldNameIterator(fieldName, bytes);
      var head = iterator.pyHead();
      var obj = null; // the value can be undefined/null, so need to use hasOwnProperty to explicitly see if key exists

      if (lookups.hasOwnProperty(String(head))) {
        obj = lookups[String(head)];
      } else {
        if (Number.isInteger(head)) {
          throw new ValueError("index out of range: ".concat(head));
        } else {
          throw new ValueError("named index not defined: ".concat(head));
        }
      } // Now deal with the iterated sub-fields


      while (obj !== null) {
        var chunk = iterator.nextChunk();

        if (chunk === null) {
          // End of iterator
          break;
        }

        var key = chunk.value;

        if (chunk.is_attr) {
          // key must be a String
          obj = obj[String(key)];
        } else {
          if (Number.isInteger(parseInt(key))) {
            // Can this happen?
            obj = obj[parseInt(key)];
          } else {
            obj = obj[String(key)];
          }
        }
      }

      return obj;
    }
    /**
     * Append to a formatting result, the presentation of one object, according to a given format
     * specification and the object's <code>__format__</code> method.
     *
     * @param fieldObj to format.
     * @param formatSpec specification to apply.
     * @param result to which the result will be appended.
     */

  }, {
    key: "renderField",
    value: function renderField(fieldObj, formatSpec, result) {
      result += String(this.renderFieldObj(fieldObj, formatSpec));
      return result;
    }
    /**
     * Renders a single field.
     *
     * This is the primary switcher that determines which formatter to use.
     */

  }, {
    key: "renderFieldObj",
    value: function renderFieldObj(fieldObj, formatSpec) {
      var _fieldObj;

      var FieldType = null;

      if (typeof fieldObj === 'number') {
        if (parseInt(fieldObj) === fieldObj) {
          FieldType = this.constructor.REGISTRY.PyInteger;
        } else {
          FieldType = this.constructor.REGISTRY.PyFloat;
        }
      }

      if (!FieldType) {
        FieldType = this.constructor.REGISTRY.PyString;
      }

      var formatSpecStr = formatSpec === null ? '' : String(formatSpec);

      if (((_fieldObj = fieldObj) === null || _fieldObj === void 0 ? void 0 : _fieldObj.constructor.TYPE) !== FieldType.TYPE) {
        fieldObj = new FieldType(fieldObj);
      }

      return fieldObj.__format__(formatSpecStr);
    }
  }]);

  return PyType;
}();

PyType_defineProperty(PyType, "TYPE", 'PyType');

PyType_defineProperty(PyType, "REGISTRY", {});
;// CONCATENATED MODULE: ./src/TextFormatter.js
function TextFormatter_typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { TextFormatter_typeof = function _typeof(obj) { return typeof obj; }; } else { TextFormatter_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return TextFormatter_typeof(obj); }

function TextFormatter_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function TextFormatter_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function TextFormatter_createClass(Constructor, protoProps, staticProps) { if (protoProps) TextFormatter_defineProperties(Constructor.prototype, protoProps); if (staticProps) TextFormatter_defineProperties(Constructor, staticProps); return Constructor; }

function TextFormatter_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) TextFormatter_setPrototypeOf(subClass, superClass); }

function TextFormatter_setPrototypeOf(o, p) { TextFormatter_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return TextFormatter_setPrototypeOf(o, p); }

function TextFormatter_createSuper(Derived) { var hasNativeReflectConstruct = TextFormatter_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = TextFormatter_getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = TextFormatter_getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return TextFormatter_possibleConstructorReturn(this, result); }; }

function TextFormatter_possibleConstructorReturn(self, call) { if (call && (TextFormatter_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return TextFormatter_assertThisInitialized(self); }

function TextFormatter_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function TextFormatter_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function TextFormatter_getPrototypeOf(o) { TextFormatter_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return TextFormatter_getPrototypeOf(o); }

// Copyright (c) Jython Developers
// Transcoded to Javascript by Conan Albrecht <doconix@gmail.com>

/**
 * A class that provides the implementation of <code>str</code> and <code>unicode</code> formatting.
 * In a limited way, it acts like a StringBuilder to which text, formatted according to the format
 * specifier supplied at construction. These are ephemeral objects that are not, on their own,
 * thread safe.
 */

var TextFormatter = /*#__PURE__*/function (_InternalFormat$Forma) {
  TextFormatter_inherits(TextFormatter, _InternalFormat$Forma);

  var _super = TextFormatter_createSuper(TextFormatter);

  /**
   * Construct the formatter from a client-supplied buffer, to which the result will be appended,
   * and a specification. Sets {@link #mark} to the end of the buffer.
   *
   * @param result destination buffer
   * @param spec parsed conversion specification
   */
  function TextFormatter(result, spec) {
    TextFormatter_classCallCheck(this, TextFormatter);

    // mimic the overloaded Java constructors
    if (spec === undefined) {
      spec = result;
      result = '';
    }

    return _super.call(this, result, spec);
  }
  /**
   * Format the given <code>String</code> into the <code>result</code> buffer. Largely, this is a
   * matter of copying the value of the argument, but a subtlety arises when the string contains
   * supplementary (non-BMP) Unicode characters, which are represented as surrogate pairs. The
   * precision specified in the format relates to a count of Unicode characters (code points), not
   * Java <code>char</code>s. The method deals with this correctly, essentially by not counting
   * the high-surrogates in the allowance. The final value of {@link #lenWhole} counts the UTF-16
   * units added.
   *
   * @param value to format
   * @return this <code>TextFormatter</code> object
   */


  TextFormatter_createClass(TextFormatter, [{
    key: "format",
    value: function format(value) {
      // Scratch all instance variables and start = result.length.
      this.setStart();
      var p = this.spec.precision;
      var n = value.length;

      if (InternalFormat.Spec.specified(p) && p < n) {
        /*
         * A precision p was specified less than the length: we may have to truncate. Note we
         * compared p with the UTF-16 length, even though it is the code point length that
         * matters. But the code point length cannot be greater than n.
         */
        var count = 0;

        while (count < p) {
          // count is the number of UTF-16 chars.
          var c = value.charAt(count++);
          this.result += c;
        } // Record the UTF-16 count as the length in buffer


        this.lenWhole = count;
      } else {
        // We definitely don't need to truncate. Append the whole string.
        this.lenWhole = n;
        this.result += value;
      }

      return this;
    }
  }]);

  return TextFormatter;
}(InternalFormat.Formatter);
;// CONCATENATED MODULE: ./src/PyString.js
function PyString_typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { PyString_typeof = function _typeof(obj) { return typeof obj; }; } else { PyString_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return PyString_typeof(obj); }

function PyString_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function PyString_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function PyString_createClass(Constructor, protoProps, staticProps) { if (protoProps) PyString_defineProperties(Constructor.prototype, protoProps); if (staticProps) PyString_defineProperties(Constructor, staticProps); return Constructor; }

function PyString_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) PyString_setPrototypeOf(subClass, superClass); }

function PyString_setPrototypeOf(o, p) { PyString_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return PyString_setPrototypeOf(o, p); }

function PyString_createSuper(Derived) { var hasNativeReflectConstruct = PyString_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = PyString_getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = PyString_getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return PyString_possibleConstructorReturn(this, result); }; }

function PyString_possibleConstructorReturn(self, call) { if (call && (PyString_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return PyString_assertThisInitialized(self); }

function PyString_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function PyString_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function PyString_getPrototypeOf(o) { PyString_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return PyString_getPrototypeOf(o); }

function PyString_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }





/**
 * Jython implements classes for the various types: PyString, PyInteger, PyLong, PyFloat, etc.
 * Each of these classes handles a different set of formatting spec types.
 *
 * Rather than transcode each class in full, the common code relevant to formatting
 * is lifted from here.
 */

var PyString = /*#__PURE__*/function (_PyType) {
  PyString_inherits(PyString, _PyType);

  var _super = PyString_createSuper(PyString);

  function PyString() {
    PyString_classCallCheck(this, PyString);

    return _super.apply(this, arguments);
  }

  PyString_createClass(PyString, [{
    key: "__format__",
    value: function __format__(formatSpec) {
      // Parse the specification
      var spec = InternalFormat.fromText(formatSpec); // Get a formatter for the specification

      var f = this.constructor.prepareFormatter(spec);

      if (!f) {
        // The type code was not recognised
        throw FormatError.unknownFormat(spec.type, "string");
      } // Convert as per specification.


      if (typeof this.st === 'string' || this.st instanceof String) {
        f.format(this.st);
      } else {
        f.format(String(this.st));
      } // Return a result that has the same type (str or unicode) as the formatSpec argument.


      return f.pad().getResult();
    }
    /**
     * Common code for {@link PyString} and {@link PyUnicode} to prepare a {@link TextFormatter}
     * from a parsed specification. The object returned has format method
     * {@link TextFormatter#format(String)} that treats its argument as UTF-16 encoded unicode (not
     * just <code>char</code>s). That method will format its argument ( <code>str</code> or
     * <code>unicode</code>) according to the PEP 3101 formatting specification supplied here. This
     * would be used during <code>text.__format__(".5s")</code> or
     * <code>"{:.5s}".format(text)</code> where <code>text</code> is this Python string.
     *
     * @param spec a parsed PEP-3101 format specification.
     * @return a formatter ready to use, or null if the type is not a string format type.
     * @throws PyException {@code ValueError} if the specification is faulty.
     */

  }], [{
    key: "prepareFormatter",
    value: function prepareFormatter(spec) {
      switch (spec.type) {
        case InternalFormat.Spec.NONE:
        case 's':
          // Check for disallowed parts of the specification
          if (spec.grouping) {
            throw FormatError.notAllowed("Grouping", "string", spec.type);
          } else if (InternalFormat.Spec.specified(spec.sign)) {
            throw FormatError.signNotAllowed("string", '\0');
          } else if (spec.alternate) {
            throw FormatError.alternateFormNotAllowed("string");
          } else if (spec.align === '=') {
            throw FormatError.alignmentNotAllowed('=', "string");
          } // spec may be incomplete. The defaults are those commonly used for string formats.


          spec = spec.withDefaults(InternalFormat.Spec.STRING); // Get a formatter for the specification

          return new this.FormatterClass(spec);

        default:
          // The type code was not recognised
          return null;
      }
    }
  }]);

  return PyString;
}(PyType); // register our type

PyString_defineProperty(PyString, "TYPE", 'PyString');

PyString_defineProperty(PyString, "FormatterClass", TextFormatter);

PyType.REGISTRY.PyString = PyString;
;// CONCATENATED MODULE: ./src/FloatFormatter.js
function FloatFormatter_typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { FloatFormatter_typeof = function _typeof(obj) { return typeof obj; }; } else { FloatFormatter_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return FloatFormatter_typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function FloatFormatter_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function FloatFormatter_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function FloatFormatter_createClass(Constructor, protoProps, staticProps) { if (protoProps) FloatFormatter_defineProperties(Constructor.prototype, protoProps); if (staticProps) FloatFormatter_defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = FloatFormatter_getPrototypeOf(object); if (object === null) break; } return object; }

function FloatFormatter_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) FloatFormatter_setPrototypeOf(subClass, superClass); }

function FloatFormatter_setPrototypeOf(o, p) { FloatFormatter_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return FloatFormatter_setPrototypeOf(o, p); }

function FloatFormatter_createSuper(Derived) { var hasNativeReflectConstruct = FloatFormatter_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = FloatFormatter_getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = FloatFormatter_getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return FloatFormatter_possibleConstructorReturn(this, result); }; }

function FloatFormatter_possibleConstructorReturn(self, call) { if (call && (FloatFormatter_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return FloatFormatter_assertThisInitialized(self); }

function FloatFormatter_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function FloatFormatter_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function FloatFormatter_getPrototypeOf(o) { FloatFormatter_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return FloatFormatter_getPrototypeOf(o); }

function FloatFormatter_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Copyright (c) Jython Developers
// Transcoded to Javascript by Conan Albrecht <doconix@gmail.com>

/* eslint-disable no-fallthrough */


/**
 * A class that provides the implementation of floating-point formatting. In a limited way, it acts
 * like a StringBuilder to which text and one or more numbers may be appended, formatted according
 * to the format specifier supplied at construction. These are ephemeral objects that are not, on
 * their own, thread safe.
 */

var FloatFormatter = /*#__PURE__*/function (_InternalFormat$Forma) {
  FloatFormatter_inherits(FloatFormatter, _InternalFormat$Forma);

  var _super = FloatFormatter_createSuper(FloatFormatter);

  /** Limit the size of results. */
  // No-one needs more than log(Double.MAX_VALUE) - log2(Double.MIN_VALUE) = 1383 digits.

  /** If it contains no decimal point, this length is zero, and 1 otherwise. */

  /** The length of the fractional part, right of the decimal point. */

  /** The length of the exponent marker ("e"), "inf" or "nan", or zero if there isn't one. */

  /** The length of the exponent sign and digits or zero if there isn't one. */

  /** if &ge;0, minimum digits to follow decimal point (where consulted) */

  /**
   * Construct the formatter from a client-supplied buffer, to which the result will be appended,
   * and a specification. Sets {@link #mark} to the end of the buffer.
   *
   * @param result destination buffer
   * @param spec parsed conversion specification
   */
  function FloatFormatter(result, spec) {
    var _this;

    FloatFormatter_classCallCheck(this, FloatFormatter);

    // mimic the overloaded Java constructors
    if (spec === undefined) {
      spec = result;
      result = '';
    }

    _this = _super.call(this, result, spec);

    FloatFormatter_defineProperty(FloatFormatter_assertThisInitialized(_this), "lenPoint", 0);

    FloatFormatter_defineProperty(FloatFormatter_assertThisInitialized(_this), "lenFraction", 0);

    FloatFormatter_defineProperty(FloatFormatter_assertThisInitialized(_this), "lenMarker", 0);

    FloatFormatter_defineProperty(FloatFormatter_assertThisInitialized(_this), "lenExponent", 0);

    FloatFormatter_defineProperty(FloatFormatter_assertThisInitialized(_this), "minFracDigits", 0);

    if (_this.spec.alternate) {
      // Alternate form means do not trim the zero fractional digits.
      _this.minFracDigits = -1;
    } else if (_this.spec.type === 'r' || _this.spec.type === InternalFormat.Spec.NONE) {
      // These formats by default show at least one fractional digit.
      _this.minFracDigits = 1;
    } else {
      /*
       * Every other format (if it does not ignore the setting) will by default trim off all
       * the trailing zero fractional digits.
       */
      _this.minFracDigits = 0;
    }

    return _this;
  }
  /**
   * Override the default truncation behaviour for the specification originally supplied. Some
   * formats remove trailing zero digits, trimming to zero or one. Set member
   * <code>minFracDigits</code>, to modify this behaviour.
   *
   * @param minFracDigits if &lt;0 prevent truncation; if &ge;0 the minimum number of fractional
   *            digits; when this is zero, and all fractional digits are zero, the decimal point
   *            will also be removed.
   */


  FloatFormatter_createClass(FloatFormatter, [{
    key: "setMinFracDigits",
    value: function setMinFracDigits(minFracDigits) {
      this.minFracDigits = minFracDigits;
    }
  }, {
    key: "reset",
    value: function reset() {
      // Clear the variables describing the latest number in result.
      _get(FloatFormatter_getPrototypeOf(FloatFormatter.prototype), "reset", this).call(this);

      this.lenPoint = this.lenFraction = this.lenMarker = this.lenExponent = 0;
    }
  }, {
    key: "sectionLengths",
    value: function sectionLengths() {
      return [this.lenSign, this.lenWhole, this.lenPoint, this.lenFraction, this.lenMarker, this.lenExponent];
    }
    /**
     * Format a floating-point number according to the specification represented by this
     * <code>FloatFormatter</code>. The conversion type, precision, and flags for grouping or
     * percentage are dealt with here. At the point this is used, we know the {@link #spec} is one
     * of the floating-point types. This entry point allows explicit control of the prefix of
     * positive numbers, overriding defaults for the format type.
     *
     * @param value to convert
     * @param positivePrefix to use before positive values (e.g. "+") or null to default to ""
     * @return this object
     */

  }, {
    key: "format",
    value: function format(value) {
      var positivePrefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
      // Puts all instance variables back to their starting defaults, and start = result.length.
      this.setStart(); // Precision defaults to 6 (or 12 for none-format)

      var precision = this.spec.getPrecision(InternalFormat.Spec.specified(this.spec.type) ? 6 : 12); // Guard against excessive result precision
      // XXX Possibly better raised before result is allocated/sized.

      if (precision > this.constructor.MAX_PRECISION) {
        throw FormatError.precisionTooLarge('float');
      }
      /*
       * By default, the prefix of a positive number is "", but the format specifier may override
       * it, and the built-in type complex needs to override the format.
       */


      var sign = this.spec.sign;

      if (positivePrefix === null && InternalFormat.Spec.specified(sign) && sign !== '-') {
        positivePrefix = String(sign);
      } // Different process for each format type, ignoring case for now.


      switch (String(this.spec.type).toLowerCase()) {
        case 'e':
          // Exponential case: 1.23e-45
          this.format_e(value, positivePrefix, precision);
          break;

        case 'f':
          // Fixed case: 123.45
          this.format_f(value, positivePrefix, precision);
          break;

        case 'n': // Locale-sensitive version of g-format should be here. (Désolé de vous decevoir.)
        // XXX Set a variable here to signal localisation in/after groupDigits?

        case 'g':
          // General format: fixed or exponential according to value.
          this.format_g(value, positivePrefix, precision, 0);
          break;

        case InternalFormat.Spec.NONE:
          // None format like g-format but goes exponential at precision-1
          this.format_g(value, positivePrefix, precision, -1);
          break;

        case 'r':
          // For float.__repr__, very special case, breaks all the rules.
          this.format_r(value, positivePrefix);
          break;

        case '%':
          // Multiplies by 100 and displays in f-format, followed by a percent sign.
          this.format_f(100.0 * value, positivePrefix, precision);
          this.result += '%';
          break;

        default:
          // Should never get here, since this was checked in PyFloat.
          throw FormatError.unknownFormat(this.spec.type, "float");
      } // If the format type is an upper-case letter, convert the result to upper case.


      if (this.spec.type === String(this.spec.type).toUpperCase()) {
        this.uppercase();
      } // If required to, group the whole-part digits.


      if (this.spec.grouping) {
        this.groupDigits(3, ',');
      }

      return this;
    }
    /**
     * Convert just the letters in the representation of the current number (in {@link #result}) to
     * upper case. (That's the exponent marker or the "inf" or "nan".)
     */

  }, {
    key: "uppercase",
    value: function uppercase() {
      this.result = this.result.toUpperCase();
    }
    /**
     * Common code to deal with the sign, and the special cases "0", "-0", "nan, "inf", or "-inf".
     * If the method returns <code>false</code>, we have started a non-zero number and the sign is
     * already in {@link #result}. The client need then only encode <i>abs(value)</i>. If the method
     * returns <code>true</code>, and {@link #lenMarker}==0, the value was "0" or "-0": the caller
     * may have to zero-extend this, and/or add an exponent, to match the requested format. If the
     * method returns <code>true</code>, and {@link #lenMarker}>0, the method has placed "nan, "inf"
     * in the {@link #result} buffer (preceded by a sign if necessary).
     *
     * @param value to convert
     * @return true if the value was one of "0", "-0", "nan, "inf", or "-inf".
     * @param positivePrefix to use before positive values (e.g. "+") or null to default to ""
     */

  }, {
    key: "signAndSpecialNumber",
    value: function signAndSpecialNumber(value, positivePrefix) {
      if (isNaN(value)) {
        if (positivePrefix) {
          this.result += '+nan';
          this.lenSign = positivePrefix.length;
        } else {
          this.result += 'nan';
        }

        this.lenMarker = 3;
        return true;
      } else if (value === Number.NEGATIVE_INFINITY) {
        this.result += '-inf';
        this.lenSign = 1;
        this.lenMarker = 3;
        return true;
      } else if (value === Number.NEGATIVE_INFINITY) {
        if (positivePrefix) {
          this.result += '+inf';
          this.lenSign = positivePrefix.length;
        } else {
          this.result += 'inf';
        }

        this.lenMarker = 3;
        return true;
      } else if (value === 0) {
        this.result += '0';
        this.lenWhole = 1;
        return true;
      } else if (value < 0) {
        this.result += '-';
        this.lenSign = 1; // continues
      }

      return false;
    }
    /**
     * The e-format helper function of {@link #format(double, String)} that uses Java's
     * {@link BigDecimal} to provide conversion and rounding. The converted number is appended to
     * the {@link #result} buffer, and {@link #start} will be set to the index of its first
     * character.
     *
     * @param value to convert
     * @param positivePrefix to use before positive values (e.g. "+") or null to default to ""
     * @param precision precision (maximum number of fractional digits)
     */

  }, {
    key: "format_e",
    value: function format_e(value, positivePrefix, precision) {
      // Exponent (default value is for 0.0 and -0.0)
      var exp = 0;

      if (!this.signAndSpecialNumber(value, positivePrefix)) {
        value = Math.abs(Number(value));
        var scinum = value.toExponential();
        var coef;

        var _scinum$split = scinum.split('e+');

        var _scinum$split2 = _slicedToArray(_scinum$split, 2);

        coef = _scinum$split2[0];
        exp = _scinum$split2[1];
        // abs value, so we know it's +
        coef = Number(coef).toFixed(precision);
        exp = Number(exp);

        var _$split = "".concat(coef, ".").split('.', 2),
            _$split2 = _slicedToArray(_$split, 2),
            coefInt = _$split2[0],
            coefDec = _$split2[1]; // Take explicit control in order to get exponential notation out of BigDecimal.


        var digits = coefInt + coefDec;
        var digitCount = digits.length;
        this.result += digits.charAt(0);
        this.lenWhole = 1;

        if (digitCount > 1) {
          // There is a fractional part
          this.result += '.' + digits.substring(1);
          this.lenPoint = 1;
          this.lenFraction = digitCount - 1;
        }
      } // If the result is not already complete, add point and zeros as necessary, and exponent.


      if (this.lenMarker === 0) {
        this.ensurePointAndTrailingZeros(precision);
        this.appendExponent(exp);
      }
    }
    /**
     * The f-format inner helper function of {@link #format(double, String)} that uses Java's
     * {@link BigDecimal} to provide conversion and rounding. The converted number is appended to
     * the {@link #result} buffer, and {@link #start} will be set to the index of its first
     * character.
     *
     * @param value to convert
     * @param positivePrefix to use before positive values (e.g. "+") or null to default to ""
     * @param precision precision (maximum number of fractional digits)
     */

  }, {
    key: "format_f",
    value: function format_f(value, positivePrefix, precision) {
      if (!this.signAndSpecialNumber(value, positivePrefix)) {
        value = Math.abs(Number(value)); // Truncate to the defined number of places to the right of the decimal point).

        value = value.toFixed(precision); // When converted to text, the number of fractional digits is exactly the scale we set.

        this.result += value;

        var _$split3 = "".concat(value, ".").split('.', 2),
            _$split4 = _slicedToArray(_$split3, 2),
            coefDec = _$split4[1];

        if ((this.lenFraction = coefDec.length) > 0) {
          // There is a decimal point and some digits following
          this.lenWhole = this.result.length - (this.start + this.lenSign + (this.lenPoint = 1) + this.lenFraction);
        } else {
          // There are no fractional digits and so no decimal point
          this.lenWhole = this.result.length - (this.start + this.lenSign);
        }
      } // Finally, ensure we have all the fractional digits we should.


      if (this.lenMarker === 0) {
        this.ensurePointAndTrailingZeros(precision);
      }
    }
    /**
     * Append a decimal point and trailing fractional zeros if necessary for 'e' and 'f' format.
     * This should not be called if the result is not numeric ("inf" for example). This method deals
     * with the following complexities: on return there will be at least the number of fractional
     * digits specified in the argument <code>n</code>, and at least {@link #minFracDigits};
     * further, if <code>minFracDigits&lt;0</code>, signifying the "alternate mode" of certain
     * formats, the method will ensure there is a decimal point, even if there are no fractional
     * digits to follow.
     *
     * @param n smallest number of fractional digits on return
     */

  }, {
    key: "ensurePointAndTrailingZeros",
    value: function ensurePointAndTrailingZeros(n) {
      // Set n to the number of fractional digits we should have.
      if (n < this.minFracDigits) {
        n = this.minFracDigits;
      } // Do we have a decimal point already?


      if (this.lenPoint === 0) {
        // No decimal point: add one if there will be any fractional digits or
        if (n > 0 || this.minFracDigits < 0) {
          // First need to add a decimal point.
          this.result += '.';
          this.lenPoint = 1;
        }
      } // Do we have enough fractional digits already?


      var f = this.lenFraction;

      if (n > f) {
        // Make up the required number of zeros.
        for (; f < n; f++) {
          this.result += '0';
        }

        this.lenFraction = f;
      }
    }
    /**
     * Implementation of the variants of g-format, that uses Java's {@link BigDecimal} to provide
     * conversion and rounding. These variants are g-format proper, alternate g-format (available
     * for "%#g" formatting), n-format (as g but subsequently "internationalised"), and none-format
     * (type code Spec.NONE).
     * <p>
     * None-format is the basis of <code>float.__str__</code>.
     * <p>
     * According to the Python documentation for g-format, the precise rules are as follows: suppose
     * that the result formatted with presentation type <code>'e'</code> and precision <i>p-1</i>
     * would have exponent exp. Then if <i>-4 &lt;= exp < p</i>, the number is formatted with
     * presentation type <code>'f'</code> and precision <i>p-1-exp</i>. Otherwise, the number is
     * formatted with presentation type <code>'e'</code> and precision <i>p-1</i>. In both cases
     * insignificant trailing zeros are removed from the significand, and the decimal point is also
     * removed if there are no remaining digits following it.
     * <p>
     * The Python documentation says none-format is the same as g-format, but the observed behaviour
     * differs from this, in that f-format is only used if <i>-4 &lt;= exp < p-1</i> (i.e. one
     * less), and at least one digit to the right of the decimal point is preserved in the f-format
     * (but not the e-format). That behaviour is controlled through the following arguments, with
     * these recommended values:
     *
     * <table>
     * <caption>Recommended values for formatting arguments</caption>
     * <tr>
     * <th>type</th>
     * <th>precision</th>
     * <th>minFracDigits</th>
     * <th>expThresholdAdj</th>
     * <td>expThreshold</td>
     * </tr>
     * <tr>
     * <th>g</th>
     * <td>p</td>
     * <td>0</td>
     * <td>0</td>
     * <td>p</td>
     * </tr>
     * <tr>
     * <th>#g</th>
     * <td>p</td>
     * <td>-</td>
     * <td>0</td>
     * <td>p</td>
     * </tr>
     * <tr>
     * <th>\0</th>
     * <td>p</td>
     * <td>1</td>
     * <td>-1</td>
     * <td>p-1</td>
     * </tr>
     * <tr>
     * <th>__str__</th>
     * <td>12</td>
     * <td>1</td>
     * <td>-1</td>
     * <td>11</td>
     * </tr>
     * </table>
     *
     * @param value to convert
     * @param positivePrefix to use before positive values (e.g. "+") or null to default to ""
     * @param precision total number of significant digits (precision 0 behaves as 1)
     * @param expThresholdAdj <code>+precision =</code> the exponent at which to resume using
     *            exponential notation
     */

  }, {
    key: "format_g",
    value: function format_g(value, positivePrefix, precision, expThresholdAdj) {
      // Precision 0 behaves as 1
      precision = Math.max(1, precision); // Use exponential notation if exponent would be bigger thatn:

      var expThreshold = precision + expThresholdAdj;

      if (this.signAndSpecialNumber(value, positivePrefix)) {
        // Finish formatting if zero result. (This is a no-op for nan or inf.)
        this.zeroHelper(precision, expThreshold);
      } else {
        // Convert abs(value) to decimal with p digits of accuracy.
        value = Math.abs(Number(value)); // This gives us the digits we need for either fixed or exponential format.

        var _$split5 = "".concat(value, ".").split('.', 2),
            _$split6 = _slicedToArray(_$split5, 2),
            coefInt = _$split6[0],
            coefDec = _$split6[1];

        var pointlessDigits = coefInt + coefDec;
        var scinum = value.toExponential();

        var _scinum$split3 = scinum.split('e+'),
            _scinum$split4 = _slicedToArray(_scinum$split3, 2),
            exp = _scinum$split4[1];

        exp = parseInt(exp);

        if (-4 <= exp && exp < expThreshold) {
          // Finish the job as f-format with variable-precision p-(exp+1).
          this.appendFixed(pointlessDigits, exp, precision);
        } else {
          // Finish the job as e-format.
          this.appendExponential(pointlessDigits, exp);
        }
      }
    }
    /**
     * Implementation of r-format (<code>float.__repr__</code>) that uses Java's
     * {@link Double#toString(double)} to provide conversion and rounding. That method gives us
     * almost what we need, but not quite (sometimes it yields 18 digits): here we always round to
     * 17 significant digits. Much of the formatting after conversion is shared with
     * {@link #format_g(double, String, int, int, int)}. <code>minFracDigits</code> is consulted
     * since while <code>float.__repr__</code> truncates to one digit, within
     * <code>complex.__repr__</code> we truncate fully.
     *
     * @param value to convert
     * @param positivePrefix to use before positive values (e.g. "+") or null to default to ""
     */

  }, {
    key: "format_r",
    value: function format_r(value, positivePrefix) {
      // Characteristics of repr (precision = 17 and go exponential at 16).
      return this.format_g(value, positivePrefix, 17, 16);
    }
    /**
     * Common code for g-format, none-format and r-format called when the conversion yields "inf",
     * "nan" or zero. The method completes formatting of the zero, with the appropriate number of
     * decimal places or (in particular circumstances) exponential; notation.
     *
     * @param precision of conversion (number of significant digits).
     * @param expThreshold if zero, causes choice of exponential notation for zero.
     */

  }, {
    key: "zeroHelper",
    value: function zeroHelper(precision, expThreshold) {
      if (this.lenMarker === 0) {
        // May be 0 or -0 so we still need to ...
        if (this.minFracDigits < 0) {
          // In "alternate format", we won't economise trailing zeros.
          this.appendPointAndTrailingZeros(precision - 1);
        } else if (this.lenFraction < this.minFracDigits) {
          // Otherwise, it should be at least the stated minimum length.
          this.appendTrailingZeros(this.minFracDigits);
        } // And just occasionally (in none-format) we go exponential even when exp = 0...


        if (0 >= expThreshold) {
          this.appendExponent(0);
        }
      }
    }
    /**
     * Common code for g-format, none-format and r-format used when the exponent is such that a
     * fixed-point presentation is chosen. Normally the method removes trailing digits so as to
     * shorten the presentation without loss of significance. This method respects the minimum
     * number of fractional digits (digits after the decimal point), in member
     * <code>minFracDigits</code>, which is 0 for g-format and 1 for none-format and r-format. When
     * <code>minFracDigits&lt;0</code> this signifies "no truncation" mode, in which trailing zeros
     * generated in the conversion are not removed. This supports "%#g" format.
     *
     * @param digits from converting the value at a given precision.
     * @param exp would be the exponent (in e-format), used to position the decimal point.
     * @param precision of conversion (number of significant digits).
     */

  }, {
    key: "appendFixed",
    value: function appendFixed(digits, exp, precision) {
      // Check for "alternate format", where we won't economise trailing zeros.
      var noTruncate = this.minFracDigits < 0;
      var digitCount = digits.length;

      if (exp < 0) {
        // For a negative exponent, we must insert leading zeros 0.000 ...
        this.result += "0.";
        this.lenWhole = this.lenPoint = 1;

        for (var i = -1; i > exp; --i) {
          this.result += '0';
        } // Then the generated digits (always enough to satisfy no-truncate mode).


        this.result += digits;
        this.lenFraction = digitCount - exp - 1;
      } else {
        // For a non-negative exponent, it's a question of placing the decimal point.
        var w = exp + 1;

        if (w < digitCount) {
          // There are w whole-part digits
          this.result += digits.substring(0, w);
          this.lenWhole = w;
          this.result += '.' + digits.substring(w, digitCount);
          this.lenPoint = 1;
          this.lenFraction = digitCount - w;
        } else {
          // All the digits are whole-part digits.
          this.result += digits; // Just occasionally (in r-format) we need more digits than the precision.

          while (digitCount < w) {
            this.result += '0';
            digitCount += 1;
          }

          this.lenWhole = digitCount;
        }

        if (noTruncate) {
          // Extend the fraction as BigDecimal will have economised on zeros.
          this.appendPointAndTrailingZeros(precision - digitCount);
        }
      } // Finally, ensure we have all and only the fractional digits we should.


      if (!noTruncate) {
        if (this.lenFraction < this.minFracDigits) {
          // Otherwise, it should be at least the stated minimum length.
          this.appendTrailingZeros(this.minFracDigits);
        } else {
          // And no more
          this.removeTrailingZeros(this.minFracDigits);
        }
      }
    }
    /**
     * Common code for g-format, none-format and r-format used when the exponent is such that an
     * exponential presentation is chosen. Normally the method removes trailing digits so as to
     * shorten the presentation without loss of significance. Although no minimum number of
     * fractional digits is enforced in the exponential presentation, when
     * <code>minFracDigits&lt;0</code> this signifies "no truncation" mode, in which trailing zeros
     * generated in the conversion are not removed. This supports "%#g" format.
     *
     * @param digits from converting the value at a given precision.
     * @param exp would be the exponent (in e-format), used to position the decimal point.
     */

  }, {
    key: "appendExponential",
    value: function appendExponential(digits, exp) {
      // The whole-part is the first digit.
      this.result += digits.charAt(0);
      this.lenWhole = 1; // And the rest of the digits form the fractional part

      var digitCount = digits.length;
      this.result += '.' + digits.substring(1, digitCount);
      this.lenPoint = 1;
      this.lenFraction = digitCount - 1; // In no-truncate mode, the fraction is full precision. Otherwise trim it.

      if (this.minFracDigits >= 0) {
        // Note positive minFracDigits only applies to fixed formats.
        this.removeTrailingZeros(0);
      } // Finally, append the exponent as e+nn.


      this.appendExponent(exp);
    }
    /**
     * Append the trailing fractional zeros, as required by certain formats, so that the total
     * number of fractional digits is no less than specified. If <code>n&lt;=0</code>, the method
     * leaves the {@link #result} buffer unchanged.
     *
     * @param n smallest number of fractional digits on return
     */

  }, {
    key: "appendTrailingZeros",
    value: function appendTrailingZeros(n) {
      var f = this.lenFraction;

      if (n > f) {
        if (this.lenPoint === 0) {
          // First need to add a decimal point. (Implies lenFraction=0.)
          this.result += '.';
          this.lenPoint = 1;
        } // Now make up the required number of zeros.


        for (; f < n; f++) {
          this.result += '0';
        }

        this.lenFraction = f;
      }
    }
    /**
     * Append the trailing fractional zeros, as required by certain formats, so that the total
     * number of fractional digits is no less than specified. If there is no decimal point
     * originally (and therefore no fractional part), the method will add a decimal point, even if
     * it adds no zeros.
     *
     * @param n smallest number of fractional digits on return
     */

  }, {
    key: "appendPointAndTrailingZeros",
    value: function appendPointAndTrailingZeros(n) {
      if (this.lenPoint === 0) {
        // First need to add a decimal point. (Implies lenFraction=0.)
        this.result += '.';
        this.lenPoint = 1;
      } // Now make up the required number of zeros.


      var f;

      for (f = this.lenFraction; f < n; f++) {
        this.result += '0';
      }

      this.lenFraction = f;
    }
    /**
     * Remove trailing zeros from the fractional part, as required by certain formats, leaving at
     * least the number of fractional digits specified. If the resultant number of fractional digits
     * is zero, this method will also remove the trailing decimal point (if there is one).
     *
     * @param n smallest number of fractional digits on return
     */

  }, {
    key: "removeTrailingZeros",
    value: function removeTrailingZeros(n) {
      if (this.lenPoint > 0) {
        // There's a decimal point at least, and there may be some fractional digits.
        var f = this.lenFraction;

        if (n === 0 || f > n) {
          var fracStart = this.result.length - f;

          for (; f > n; --f) {
            if (this.result.charAt(fracStart - 1 + f) !== '0') {
              // Keeping this one as it isn't a zero
              break;
            }
          } // f is now the number of fractional digits we wish to retain.


          if (f === 0 && this.lenPoint > 0) {
            // We will be stripping all the fractional digits. Take the decimal point too.
            this.lenPoint = this.lenFraction = 0;
            f = -1;
          } else {
            this.lenFraction = f;
          } // Snip the characters we are going to remove (if any).


          if (fracStart + f < this.result.length) {
            this.result = this.result.substring(0, fracStart + f);
          }
        }
      }
    }
    /**
     * Append the current value of {@code exp} in the format <code>"e{:+02d}"</code> (for example
     * <code>e+05</code>, <code>e-10</code>, <code>e+308</code> , etc.).
     *
     * @param exp exponent value to append
     */

  }, {
    key: "appendExponent",
    value: function appendExponent(exp) {
      var marker = this.result.length;
      var e; // Deal with sign and leading-zero convention by explicit tests.

      if (exp < 0) {
        e = exp <= -10 ? "e-" : "e-0";
        exp = -exp;
      } else {
        e = exp < 10 ? "e+0" : "e+";
      }

      this.result += e + exp;
      this.lenMarker = 1;
      this.lenExponent = this.result.length - marker - 1;
    }
    /**
     * Return the index in {@link #result} of the first letter. This is a helper for
     * {@link #uppercase()} and {@link #getExponent()}
     */

  }, {
    key: "indexOfMarker",
    value: function indexOfMarker() {
      return this.start + this.lenSign + this.lenWhole + this.lenPoint + this.lenFraction;
    }
  }]);

  return FloatFormatter;
}(InternalFormat.Formatter);

FloatFormatter_defineProperty(FloatFormatter, "MAX_PRECISION", 1400);
;// CONCATENATED MODULE: ./src/PyFloat.js
function PyFloat_typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { PyFloat_typeof = function _typeof(obj) { return typeof obj; }; } else { PyFloat_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return PyFloat_typeof(obj); }

function PyFloat_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function PyFloat_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function PyFloat_createClass(Constructor, protoProps, staticProps) { if (protoProps) PyFloat_defineProperties(Constructor.prototype, protoProps); if (staticProps) PyFloat_defineProperties(Constructor, staticProps); return Constructor; }

function PyFloat_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) PyFloat_setPrototypeOf(subClass, superClass); }

function PyFloat_setPrototypeOf(o, p) { PyFloat_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return PyFloat_setPrototypeOf(o, p); }

function PyFloat_createSuper(Derived) { var hasNativeReflectConstruct = PyFloat_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = PyFloat_getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = PyFloat_getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return PyFloat_possibleConstructorReturn(this, result); }; }

function PyFloat_possibleConstructorReturn(self, call) { if (call && (PyFloat_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return PyFloat_assertThisInitialized(self); }

function PyFloat_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function PyFloat_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function PyFloat_getPrototypeOf(o) { PyFloat_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return PyFloat_getPrototypeOf(o); }

function PyFloat_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Copyright (c) Corporation for National Research Initiatives
// Copyright (c) Jython Developers
// Transcoded to Javascript by Conan Albrecht <doconix@gmail.com>




/**
 * Specialization for floats.
 */

var PyFloat = /*#__PURE__*/function (_PyType) {
  PyFloat_inherits(PyFloat, _PyType);

  var _super = PyFloat_createSuper(PyFloat);

  function PyFloat() {
    PyFloat_classCallCheck(this, PyFloat);

    return _super.apply(this, arguments);
  }

  PyFloat_createClass(PyFloat, [{
    key: "__format__",
    value: function __format__(formatSpec) {
      // Parse the specification
      var spec = InternalFormat.fromText(formatSpec); // Get a formatter for the specification

      var f = this.constructor.prepareFormatter(spec);

      if (!f) {
        // The type code was not recognised
        throw FormatError.unknownFormat(spec.type, "float");
      } // Convert as per specification.


      f.format(this.st); // Return a result that has the same type (str or unicode) as the formatSpec argument.

      return f.pad().getResult();
    }
    /**
     * Common code for {@link PyString} and {@link PyUnicode} to prepare a {@link TextFormatter}
     * from a parsed specification. The object returned has format method
     * {@link TextFormatter#format(String)} that treats its argument as UTF-16 encoded unicode (not
     * just <code>char</code>s). That method will format its argument ( <code>str</code> or
     * <code>unicode</code>) according to the PEP 3101 formatting specification supplied here. This
     * would be used during <code>text.__format__(".5s")</code> or
     * <code>"{:.5s}".format(text)</code> where <code>text</code> is this Python string.
     *
     * @param spec a parsed PEP-3101 format specification.
     * @return a formatter ready to use, or null if the type is not a string format type.
     * @throws PyException {@code ValueError} if the specification is faulty.
     */

  }], [{
    key: "prepareFormatter",
    value: function prepareFormatter(spec) {
      switch (spec.type) {
        case 'n':
          if (spec.grouping) {
            throw FormatError.notAllowed("Grouping", "float", spec.type);
          }

        // Fall through

        case InternalFormat.Spec.NONE:
        case 'e':
        case 'f':
        case 'g':
        case 'E':
        case 'F':
        case 'G':
        case '%':
          // Check for disallowed parts of the specification
          if (spec.alternate) {
            throw FormatError.alternateFormNotAllowed("float");
          } // spec may be incomplete. The defaults are those commonly used for numeric formats.


          spec = spec.withDefaults(InternalFormat.Spec.NUMERIC);
          return new this.FormatterClass(spec);

        default:
          // The type code was not recognised
          return null;
      }
    }
  }]);

  return PyFloat;
}(PyType); // register with PyType

PyFloat_defineProperty(PyFloat, "TYPE", 'PyFloat');

PyFloat_defineProperty(PyFloat, "FormatterClass", FloatFormatter);

PyType.REGISTRY.PyFloat = PyFloat;
;// CONCATENATED MODULE: ./src/IntegerFormatter.js
function IntegerFormatter_typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { IntegerFormatter_typeof = function _typeof(obj) { return typeof obj; }; } else { IntegerFormatter_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return IntegerFormatter_typeof(obj); }

function IntegerFormatter_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function IntegerFormatter_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function IntegerFormatter_createClass(Constructor, protoProps, staticProps) { if (protoProps) IntegerFormatter_defineProperties(Constructor.prototype, protoProps); if (staticProps) IntegerFormatter_defineProperties(Constructor, staticProps); return Constructor; }

function IntegerFormatter_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) IntegerFormatter_setPrototypeOf(subClass, superClass); }

function IntegerFormatter_setPrototypeOf(o, p) { IntegerFormatter_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return IntegerFormatter_setPrototypeOf(o, p); }

function IntegerFormatter_createSuper(Derived) { var hasNativeReflectConstruct = IntegerFormatter_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = IntegerFormatter_getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = IntegerFormatter_getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return IntegerFormatter_possibleConstructorReturn(this, result); }; }

function IntegerFormatter_possibleConstructorReturn(self, call) { if (call && (IntegerFormatter_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return IntegerFormatter_assertThisInitialized(self); }

function IntegerFormatter_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function IntegerFormatter_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function IntegerFormatter_getPrototypeOf(o) { IntegerFormatter_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return IntegerFormatter_getPrototypeOf(o); }

function IntegerFormatter_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Copyright (c) Jython Developers
// Transcoded to Javascript by Conan Albrecht <doconix@gmail.com>


/**
 * A class that provides the implementation of integer formatting. In a limited way, it acts like a
 * StringBuilder to which text and one or more numbers may be appended, formatted according to the
 * format specifier supplied at construction. These are ephemeral objects that are not, on their
 * own, thread safe.
 */

var IntegerFormatter = /*#__PURE__*/function (_InternalFormat$Forma) {
  IntegerFormatter_inherits(IntegerFormatter, _InternalFormat$Forma);

  var _super = IntegerFormatter_createSuper(IntegerFormatter);

  /**
   * Construct the formatter from a client-supplied buffer, to which the result will be appended,
   * and a specification. Sets {@link #mark} to the end of the buffer.
   *
   * @param result destination buffer
   * @param spec parsed conversion specification
   */
  function IntegerFormatter(result, spec) {
    var _this;

    IntegerFormatter_classCallCheck(this, IntegerFormatter);

    // mimic the overloaded Java constructors
    if (spec === undefined) {
      spec = result;
      result = '';
    }

    _this = _super.call(this, result, spec);

    IntegerFormatter_defineProperty(IntegerFormatter_assertThisInitialized(_this), "BIN", InternalFormat.fromText("#b"));

    IntegerFormatter_defineProperty(IntegerFormatter_assertThisInitialized(_this), "OCT", InternalFormat.fromText("#o"));

    IntegerFormatter_defineProperty(IntegerFormatter_assertThisInitialized(_this), "HEX", InternalFormat.fromText("#x"));

    return _this;
  }
  /**
   * Format a {@link BigInteger}, which is the implementation type of Jython <code>long</code>,
   * according to the specification represented by this <code>IntegerFormatter</code>. The
   * conversion type, and flags for grouping or base prefix are dealt with here. At the point this
   * is used, we know the {@link #spec} is one of the integer types.
   *
   * @param value to convert
   * @return this object
   */


  IntegerFormatter_createClass(IntegerFormatter, [{
    key: "format",
    value: function format(value) {
      // Different process for each format type.
      switch (String(this.spec.type).toLowerCase()) {
        case 'd':
        case InternalFormat.Spec.NONE:
        case 'u':
        case 'i':
          // None format or d-format: decimal
          this.format_d(value);
          break;

        case 'x':
          // hexadecimal.
          this.format_x(value, false);
          break;

        case 'X':
          // HEXADECIMAL!
          this.format_x(value, true);
          break;

        case 'o':
          // Octal.
          this.format_o(value);
          break;

        case 'b':
          // Binary.
          this.format_b(value);
          break;

        case 'c':
          // Binary.
          this.format_c(value);
          break;

        case 'n':
          // Locale-sensitive version of d-format should be here.
          this.format_d(value);
          break;

        default:
          // Should never get here, since this was checked in caller.
          throw FormatError.unknownFormat(this.spec.type, "long");
      } // If the format type is an upper-case letter, convert the result to upper case.


      if (this.spec.type === String(this.spec.type).toUpperCase()) {
        this.uppercase();
      } // If required to, group the whole-part digits.


      if (this.spec.grouping) {
        this.groupDigits(3, ',');
      }

      return this;
    }
    /**
     * Format the value as decimal (into {@link #result}). The option for mandatory sign is dealt
     * with by reference to the format specification.
     *
     * @param value to convert
     */

  }, {
    key: "format_d",
    value: function format_d(value) {
      var number;

      if (value < 0) {
        // Negative value: deal with sign and base, and convert magnitude.
        this.negativeSign(null);
        number = String(-1 * value);
      } else {
        // Positive value: deal with sign, base and magnitude.
        this.positiveSign(null);
        number = String(value);
      }

      this.appendNumber(number);
    }
    /**
     * Format the value as hexadecimal (into {@link #result}), with the option of using upper-case
     * or lower-case letters. The options for mandatory sign and for the presence of a base-prefix
     * "0x" or "0X" are dealt with by reference to the format specification.
     *
     * @param value to convert
     * @param upper if the hexadecimal should be upper case
     */

  }, {
    key: "format_x",
    value: function format_x(value, upper) {
      var base = upper ? "0X" : "0x";
      var number;

      if (value < 0) {
        // Negative value: deal with sign and base, and convert magnitude.
        this.negativeSign(base);
        number = this.toHexString(-1 * value);
      } else {
        // Positive value: deal with sign, base and magnitude.
        this.positiveSign(base);
        number = this.toHexString(value);
      } // Append to result, case-shifted if necessary.


      if (upper) {
        number = number.toUpperCase();
      }

      this.appendNumber(number);
    }
    /**
     * Format the value as octal (into {@link #result}). The options for mandatory sign and for the
     * presence of a base-prefix "0o" are dealt with by reference to the format specification.
     *
     * @param value to convert
     */

  }, {
    key: "format_o",
    value: function format_o(value) {
      var base = "0o";
      var number;

      if (value < 0) {
        // Negative value: deal with sign and base, and convert magnitude.
        this.negativeSign(base);
        number = this.toOctalString(-1 * value);
      } else {
        // Positive value: deal with sign, base and magnitude.
        this.positiveSign(base);
        number = this.toOctalString(value);
      } // Append to result.


      this.appendNumber(number);
    }
    /**
     * Format the value as binary (into {@link #result}). The options for mandatory sign and for the
     * presence of a base-prefix "0b" are dealt with by reference to the format specification.
     *
     * @param value to convert
     */

  }, {
    key: "format_b",
    value: function format_b(value) {
      var base = "0b";
      var number;

      if (value < 0) {
        // Negative value: deal with sign and base, and convert magnitude.
        this.negativeSign(base);
        number = this.toBinaryString(-1 * value);
      } else {
        // Positive value: deal with sign, base and magnitude.
        this.positiveSign(base);
        number = this.toBinaryString(value);
      } // Append to result.


      this.appendNumber(number);
    }
    /**
     * Format the value as a character (into {@link #result}).
     *
     * @param value to convert
     */

  }, {
    key: "format_c",
    value: function format_c(value) {
      this.result += String.fromCharCode(value);
    } // NOTE: Jython includes two sets of methods (one for BigInteger and one for int).
    //       Removed the second set of methods.

    /**
     * Append to {@link #result} buffer a sign (if one is specified for positive numbers) and, in
     * alternate mode, the base marker provided. The sign and base marker are together considered to
     * be the "sign" of the converted number, spanned by {@link #lenSign}. This is relevant when we
     * come to insert padding.
     *
     * @param base marker "0x" or "0X" for hex, "0o" for octal, "0b" for binary, "" or
     *            <code>null</code> for decimal.
     */

  }, {
    key: "positiveSign",
    value: function positiveSign(base) {
      // Does the format specify a sign for positive values?
      var sign = this.spec.sign;

      if (InternalFormat.Spec.specified(sign) && sign !== '-') {
        this.result += sign;
        this.lenSign = 1;
      } // Does the format call for a base prefix?


      if (base !== null && this.spec.alternate) {
        this.result += base;
        this.lenSign += base.length;
      }
    }
    /**
     * Append to {@link #result} buffer a minus sign and, in alternate mode, the base marker
     * provided. The sign and base marker are together considered to be the "sign" of the converted
     * number, spanned by {@link #lenSign}. This is relevant when we come to insert padding.
     *
     * @param base marker ("0x" or "0X" for hex, "0" for octal, <code>null</code> or "" for decimal.
     */

  }, {
    key: "negativeSign",
    value: function negativeSign(base) {
      // Insert a minus sign unconditionally.
      this.result += '-';
      this.lenSign = 1; // Does the format call for a base prefix?

      if (base !== null && this.spec.alternate) {
        this.result += base;
        this.lenSign += base.length;
      }
    }
    /**
     * Append a string (number) to {@link #result} and set {@link #lenWhole} to its length .
     *
     * @param number to append
     */

  }, {
    key: "appendNumber",
    value: function appendNumber(number) {
      // note that number is a String here
      this.lenWhole = number.length;
      this.result += number;
    }
    /**
     * A more efficient algorithm for generating a hexadecimal representation of a byte array.
     * {@link BigInteger#toString(int)} is too slow because it generalizes to any radix and,
     * consequently, is implemented using expensive mathematical operations.
     *
     * @param value the value to generate a hexadecimal string from
     * @return the hexadecimal representation of value, with "-" sign prepended if necessary
     */

  }, {
    key: "toHexString",
    value: function toHexString(value) {
      // Jython does its own implementation, but recoding to simply use JS built-in methods
      if (value) {
        return value.toString(16);
      }

      return value;
    }
    /**
     * A more efficient algorithm for generating an octal representation of a byte array.
     * {@link BigInteger#toString(int)} is too slow because it generalizes to any radix and,
     * consequently, is implemented using expensive mathematical operations.
     *
     * @param value the value to generate an octal string from
     * @return the octal representation of value, with "-" sign prepended if necessary
     */

  }, {
    key: "toOctalString",
    value: function toOctalString(value) {
      // Jython does its own implementation, but recoding to simply use JS built-in methods
      if (value) {
        return value.toString(8);
      }

      return value;
    }
    /**
     * A more efficient algorithm for generating a binary representation of a byte array.
     * {@link BigInteger#toString(int)} is too slow because it generalizes to any radix and,
     * consequently, is implemented using expensive mathematical operations.
     *
     * @param value the value to generate a binary string from
     * @return the binary representation of value, with "-" sign prepended if necessary
     */

  }, {
    key: "toBinaryString",
    value: function toBinaryString(value) {
      if (value) {
        return value.toString(2);
      }

      return value;
    }
    /** Format specification used by bin(). */

  }, {
    key: "bin",
    value:
    /**
     * Convert the object to binary according to the conventions of Python built-in
     * <code>bin()</code>. The object's __index__ method is called, and is responsible for raising
     * the appropriate error (which the base {@link PyObject#__index__()} does).
     *
     * @param number to convert
     * @return PyString converted result
     */
    // Follow this pattern in Python 3, where objects no longer have __hex__, __oct__ members.
    function bin(number) {
      return this.formatNumber(number, this.constructor.BIN);
    }
    /**
     * Convert the object according to the conventions of Python built-in <code>hex()</code>, or
     * <code>oct()</code>. The object's <code>__index__</code> method is called, and is responsible
     * for raising the appropriate error (which the base {@link PyObject#__index__()} does).
     *
     * @param number to convert
     * @return PyString converted result
     */

  }, {
    key: "formatNumber",
    value: function formatNumber(number, spec) {
      var f = new this.constructor(spec);
      f.format(parseInt(number));
      return f.getResult();
    } // NOTE: removed the Traditional inner class because we're doing the {}-style formatting

  }]);

  return IntegerFormatter;
}(InternalFormat.Formatter);
;// CONCATENATED MODULE: ./src/PyInteger.js
function PyInteger_typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { PyInteger_typeof = function _typeof(obj) { return typeof obj; }; } else { PyInteger_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return PyInteger_typeof(obj); }

function PyInteger_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function PyInteger_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function PyInteger_createClass(Constructor, protoProps, staticProps) { if (protoProps) PyInteger_defineProperties(Constructor.prototype, protoProps); if (staticProps) PyInteger_defineProperties(Constructor, staticProps); return Constructor; }

function PyInteger_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) PyInteger_setPrototypeOf(subClass, superClass); }

function PyInteger_setPrototypeOf(o, p) { PyInteger_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return PyInteger_setPrototypeOf(o, p); }

function PyInteger_createSuper(Derived) { var hasNativeReflectConstruct = PyInteger_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = PyInteger_getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = PyInteger_getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return PyInteger_possibleConstructorReturn(this, result); }; }

function PyInteger_possibleConstructorReturn(self, call) { if (call && (PyInteger_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return PyInteger_assertThisInitialized(self); }

function PyInteger_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function PyInteger_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function PyInteger_getPrototypeOf(o) { PyInteger_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return PyInteger_getPrototypeOf(o); }

function PyInteger_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Copyright (c) Corporation for National Research Initiatives
// Copyright (c) Jython Developers
// Transcoded to Javascript by Conan Albrecht <doconix@gmail.com>





/**
 * Specialization for integers.
 */

var PyInteger = /*#__PURE__*/function (_PyType) {
  PyInteger_inherits(PyInteger, _PyType);

  var _super = PyInteger_createSuper(PyInteger);

  function PyInteger() {
    PyInteger_classCallCheck(this, PyInteger);

    return _super.apply(this, arguments);
  }

  PyInteger_createClass(PyInteger, [{
    key: "__format__",
    value: function __format__(formatSpec) {
      // Parse the specification
      var spec = InternalFormat.fromText(formatSpec); // Try to make an integer formatter from the specification

      var f = this.constructor.prepareFormatter(spec);

      if (f) {
        f.format(this.st);
      } else {
        // Try to make a float formatter from the specification
        f = PyFloat.prepareFormatter(spec);

        if (f) {
          // Convert as per specification.
          f.format(this.st);
        } else {
          // The type code was not recognised in either prepareFormatter
          throw FormatError.unknownFormat(spec.type, "integer");
        }
      } // Return a result that has the same type (str or unicode) as the formatSpec argument.


      return f.pad().getResult();
    }
    /**
     * Common code for {@link PyString} and {@link PyUnicode} to prepare a {@link TextFormatter}
     * from a parsed specification. The object returned has format method
     * {@link TextFormatter#format(String)} that treats its argument as UTF-16 encoded unicode (not
     * just <code>char</code>s). That method will format its argument ( <code>str</code> or
     * <code>unicode</code>) according to the PEP 3101 formatting specification supplied here. This
     * would be used during <code>text.__format__(".5s")</code> or
     * <code>"{:.5s}".format(text)</code> where <code>text</code> is this Python string.
     *
     * @param spec a parsed PEP-3101 format specification.
     * @return a formatter ready to use, or null if the type is not a string format type.
     * @throws PyException {@code ValueError} if the specification is faulty.
     */

  }], [{
    key: "prepareFormatter",
    value: function prepareFormatter(spec) {
      switch (spec.type) {
        case 'c':
          // Character data: specific prohibitions.
          if (InternalFormat.Spec.specified(spec.sign)) {
            throw FormatError.signNotAllowed("integer", spec.type);
          } else if (spec.alternate) {
            throw FormatError.alternateFormNotAllowed("integer", spec.type);
          }

        // Fall through

        case 'x':
        case 'X':
        case 'o':
        case 'b':
        case 'n':
          if (spec.grouping) {
            throw FormatError.notAllowed("Grouping", "integer", spec.type);
          }

        // Fall through

        case InternalFormat.Spec.NONE:
        case 'd':
          // Check for disallowed parts of the specification
          if (InternalFormat.Spec.specified(spec.precision)) {
            throw FormatError.precisionNotAllowed("integer");
          } // spec may be incomplete. The defaults are those commonly used for numeric formats.


          spec = spec.withDefaults(InternalFormat.Spec.NUMERIC); // Get a formatter for the spec.

          return new this.FormatterClass(spec);

        default:
          // The type code was not recognised
          return null;
      }
    }
  }]);

  return PyInteger;
}(PyType); // register with PyType

PyInteger_defineProperty(PyInteger, "TYPE", 'PyInteger');

PyInteger_defineProperty(PyInteger, "FormatterClass", IntegerFormatter);

PyType.REGISTRY.PyInteger = PyInteger;
;// CONCATENATED MODULE: ./src/index.js
// importing these files allows them to register with PyType




/**
 * Primary exported function to format a string  using Python's .format() mini-language.
 * This is really just a wrapper around PyString.format.
 *
 * If st is undefined or null, it is simply returned. This is different from the TypeError
 * that python throws, but it makes this interface function follow JS culture.
 *
 * See also PyType.js :: format (which this calls).
 * See also enable.js for shimming the global String prototype.
 */

function format(st) {
  var _st;

  if (st === undefined || st === null) {
    return st;
  }

  st = new PyString(st);

  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return (_st = st).format.apply(_st, args);
}
/*
 * Adds .format the Javscript's String type, enabling python-style code:
 *     console.log(
 *          '{} is a favorite color'.format('blue')
 *     )
 *
 * This only needs to be called once per page.
 * This is exported from the main library as `format.enableGlobal`
 */

function enableGlobal() {
  Object.defineProperty(String.prototype, 'format', {
    value: function value() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return format.apply(void 0, [this].concat(args));
    }
  });
}
;// CONCATENATED MODULE: ./index.js
 // attach less-used options under the default export

format.enableGlobal = enableGlobal;
format.PyString = PyString;
format.PyInteger = PyInteger;
format.PyFloat = PyFloat; // default export

/* harmony default export */ const index = (format);
__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});
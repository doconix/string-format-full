var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.js
var index_exports = {};
__export(index_exports, {
  AttributeError: () => AttributeError,
  IndexError: () => IndexError,
  KeyError: () => KeyError,
  LookupError: () => LookupError,
  OverflowError: () => OverflowError,
  PyError: () => PyError,
  PyFloat: () => PyFloat,
  PyInteger: () => PyInteger,
  PyString: () => PyString,
  ValueError: () => ValueError,
  default: () => format,
  format: () => format,
  setOptions: () => setOptions
});
module.exports = __toCommonJS(index_exports);

// src/options.js
var OPTIONS = {
  // true adds a format method to every string: "{} is a color".format('blue')
  global: false,
  // false renders a missing argument as an empty string rather than raising, as Python does,
  // IndexError or KeyError: "{} is a {}".format('blue') gives "blue is a "
  strict: true
};

// src/errors.js
var PyError = class extends Error {
  get name() {
    return "PyError";
  }
};
var ValueError = class extends PyError {
  get name() {
    return "ValueError";
  }
};
var LookupError = class extends PyError {
  get name() {
    return "LookupError";
  }
};
var IndexError = class extends LookupError {
  get name() {
    return "IndexError";
  }
};
var KeyError = class extends LookupError {
  get name() {
    return "KeyError";
  }
};
var AttributeError = class extends PyError {
  get name() {
    return "AttributeError";
  }
};
var OverflowError = class extends PyError {
  get name() {
    return "OverflowError";
  }
};

// src/spec.js
var SURROGATE = /[\ud800-\udfff]/;
var Spec = class _Spec {
  static ALIGNS = "<>=^";
  static CACHED = 1e3;
  static parse(text, owner) {
    const specs = owner.specs;
    let spec = specs.get(text);
    if (!spec) {
      spec = new this(text, owner);
      if (specs.size >= this.CACHED) {
        specs.clear();
      }
      specs.set(text, spec);
    }
    return spec;
  }
  // The steps and their order are CPython's, so that the same spec raises the same error.
  constructor(text, owner) {
    const chars = Array.from(text);
    let pos = 0, fill, align;
    if (_Spec.ALIGNS.includes(chars[1])) {
      [fill, align] = chars;
      pos = 2;
    } else if (_Spec.ALIGNS.includes(chars[0])) {
      align = chars[0];
      pos = 1;
    }
    this.sign = "+- ".includes(chars[pos]) ? chars[pos++] : "";
    this.z = chars[pos] === "z";
    if (this.z) pos++;
    this.alt = chars[pos] === "#";
    if (this.alt) pos++;
    if (fill === void 0 && chars[pos] === "0") {
      fill = "0";
      if (align === void 0 && owner.ALIGN === ">") {
        align = "=";
      }
      pos++;
    }
    this.fill = fill ?? " ";
    this.align = align ?? owner.ALIGN;
    let stop = _Spec.digits(chars, pos);
    this.width = _Spec.integer(chars.slice(pos, stop).join(""));
    pos = stop;
    this.sep = "";
    if (chars[pos] === ",") {
      this.sep = chars[pos++];
    }
    if (chars[pos] === "_") {
      if (this.sep) throw _Spec.both();
      this.sep = chars[pos++];
    }
    if (chars[pos] === "," && this.sep === "_") throw _Spec.both();
    this.precision = void 0;
    this.fracSep = "";
    if (chars[pos] === ".") {
      stop = _Spec.digits(chars, ++pos);
      let given = stop - pos;
      if (given) {
        this.precision = _Spec.integer(chars.slice(pos, stop).join(""));
      }
      pos = stop;
      if (chars[pos] === ",") {
        this.fracSep = chars[pos++];
        given++;
      }
      if (chars[pos] === "_") {
        if (this.fracSep) throw _Spec.both();
        this.fracSep = chars[pos++];
        given++;
      }
      if (chars[pos] === "," && this.fracSep === "_") throw _Spec.both();
      if (!given) throw new ValueError("Format specifier missing precision");
    }
    if (chars.length - pos > 1) {
      throw new ValueError(`Invalid format specifier '${text}' for object of type '${owner.NAME}'`);
    }
    const type = this.type = pos < chars.length ? chars[pos] : owner.CODE;
    this.method = "format_" + type;
    this.size = 3;
    if (this.sep && type) {
      if ("boxX".includes(type)) {
        if (this.sep === ",") throw _Spec.cannot(this.sep, type);
        this.size = 4;
      } else if (!"deEfFgG%".includes(type)) {
        throw _Spec.cannot(this.sep, type);
      }
    }
    if (this.fracSep && type === "n") throw _Spec.cannot(this.fracSep, type);
  }
  ///  Layout  ///
  /** The sign character for a number: always for a negative, on request for the rest. */
  signFor(negative) {
    return negative ? "-" : this.sign === "-" ? "" : this.sign;
  }
  /** Pads text to the width. */
  pad(text) {
    const count = this.width - _Spec.length(text);
    if (count <= 0) {
      return text;
    }
    switch (this.align) {
      case "<":
        return text + this.fill.repeat(count);
      case "^": {
        const left = count >> 1;
        return this.fill.repeat(left) + text + this.fill.repeat(count - left);
      }
    }
    return this.fill.repeat(count) + text;
  }
  /**
   * Lays out a number from its parts: the sign and base prefix, the whole digits, and
   * whatever follows them (fraction, exponent, percent sign).
   */
  number(sign, prefix, digits, rest) {
    const head = sign + prefix;
    if (digits) {
      const zeros = this.fill === "0" && this.align === "=";
      digits = this.group(digits, zeros ? this.width - head.length - rest.length : 0);
    }
    if (this.align !== "=") {
      return this.pad(head + digits + rest);
    }
    const count = this.width - head.length - digits.length - _Spec.length(rest);
    return head + (count > 0 ? this.fill.repeat(count) : "") + digits + rest;
  }
  /**
   * Separates digits into groups, zero-filling on the left to at least the minimum length.
   * A result never starts with a separator, so it can be one longer than asked for.
   */
  group(digits, minimum) {
    if (!this.sep) {
      return digits.padStart(minimum, "0");
    }
    const groups = [];
    let remaining = digits.length;
    for (; ; ) {
      const length = Math.min(this.size, Math.max(remaining, minimum, 1));
      const taken = Math.min(remaining, length);
      groups.unshift("0".repeat(length - taken) + digits.slice(remaining - taken, remaining));
      remaining -= taken;
      minimum -= length;
      if (remaining <= 0 && minimum <= 0) {
        return groups.join(this.sep);
      }
      minimum -= 1;
    }
  }
  ///  Helpers  ///
  /** Length in code points, which is how Python counts. */
  static length(text) {
    return SURROGATE.test(text) ? Array.from(text).length : text.length;
  }
  /** The first `count` code points. */
  static clip(text, count) {
    return SURROGATE.test(text) ? Array.from(text).slice(0, count).join("") : text.slice(0, count);
  }
  /** The position after the run of decimal digits that starts at pos. */
  static digits(chars, pos) {
    while (chars[pos] >= "0" && chars[pos] <= "9") {
      pos++;
    }
    return pos;
  }
  /** The value of a string of decimal digits, within the range CPython accepts. */
  static integer(text) {
    const value = Number(text);
    if (value >= 2 ** 63) throw new ValueError("Too many decimal digits in format string");
    return value;
  }
  /** A character as CPython prints it in an error message. */
  static show(char) {
    const code = char.codePointAt(0);
    return code > 32 && code < 127 ? char : "\\x" + code.toString(16);
  }
  static both() {
    return new ValueError("Cannot specify both ',' and '_'.");
  }
  static cannot(sep, type) {
    return new ValueError(`Cannot specify '${sep}' with '${_Spec.show(type)}'.`);
  }
};

// src/digits.js
var Digits = class _Digits {
  static NATIVE = 100;
  // the most fraction digits toFixed() and toExponential() accept
  constructor(value, code, precision) {
    this.code = code;
    if (code === "e") {
      precision += 1;
    } else if (code === "g" && precision === 0) {
      precision = 1;
    }
    this.precision = precision;
    if (value === 0) {
      this.digits = "0";
      this.point = 1;
      return;
    }
    if (code === "r") {
      this.shortest(value);
    } else if (code === "f") {
      this.fixed(value, precision);
    } else {
      this.significant(value, precision);
    }
    if (code === "g") {
      let end = this.digits.length;
      while (this.digits[end - 1] === "0") {
        end--;
      }
      this.digits = this.digits.slice(0, end);
    }
  }
  /** True when the number rounded to nothing but zeros. */
  get zero() {
    return this.digits === "" || this.digits === "0";
  }
  shortest(value) {
    const [mantissa, exponent] = value.toExponential().split("e");
    this.digits = mantissa.replace(".", "");
    this.point = Number(exponent) + 1;
  }
  /** Rounds to `count` significant digits. */
  significant(value, count) {
    if (count > _Digits.NATIVE + 1) {
      return this.exact(value, count, false);
    }
    const [mantissa, exponent] = value.toExponential(count - 1).split("e");
    const digits = mantissa.replace(".", "");
    this.point = Number(exponent) + 1;
    this.digits = _Digits.tie(value, this.point - 1 - count) ? _Digits.even(digits) : digits;
  }
  /** Rounds to `count` digits after the decimal point. */
  fixed(value, count) {
    if (count > _Digits.NATIVE || value >= 1e21) {
      return this.exact(value, count, true);
    }
    let text = value.toFixed(count);
    if (_Digits.tie(value, -count - 1)) {
      text = _Digits.even(text);
    }
    const whole = count ? text.length - count - 1 : text.length;
    const digits = count ? text.slice(0, whole) + text.slice(whole + 1) : text;
    let zeros = 0;
    while (digits[zeros] === "0") {
      zeros++;
    }
    this.digits = digits.slice(zeros);
    this.point = whole - zeros;
  }
  /**
   * True when the value lies exactly half way between the two candidates for its last kept
   * digit: when its decimal expansion ends with a 5 in the place 10^exponent, the first one
   * dropped. A double is a whole multiple of a power of two, which makes the test exact.
   */
  static tie(value, exponent) {
    if (exponent < 0) {
      return _Digits.odd(value * 2 ** -exponent);
    }
    const scaled = value / 2 ** exponent;
    return _Digits.odd(scaled) && scaled % 5 ** (exponent + 1) === 0;
  }
  /** True for an odd integer. (Much faster than the % operator, which matters to tie.) */
  static odd(value) {
    return Math.floor(value) === value && Math.floor(value / 2) !== value / 2;
  }
  /**
   * Corrects digits that toFixed() or toExponential() rounded up from a tie, which belongs
   * to its even neighbour. When the digits end odd, that neighbour is the one just below.
   */
  static even(digits) {
    const last = digits.at(-1);
    return last % 2 ? digits.slice(0, -1) + (last - 1) : digits;
  }
  /**
   * Rounds from the exact decimal expansion, which every double has: its value is an
   * integer times a power of two. `count` is digits after the point when `fixed`, and
   * significant digits otherwise.
   */
  exact(value, count, fixed) {
    const view = new DataView(new ArrayBuffer(8));
    view.setFloat64(0, value);
    const bits = view.getBigUint64(0);
    const biased = Number(bits >> 52n);
    const mantissa = bits & 0xfffffffffffffn | (biased ? 1n << 52n : 0n);
    const exponent = Math.max(biased, 1) - 1075;
    const whole = exponent < 0 ? mantissa * 5n ** BigInt(-exponent) : mantissa << BigInt(exponent);
    let digits = whole.toString();
    let point = digits.length + Math.min(exponent, 0);
    const keep = fixed ? point + count : count;
    if (keep < digits.length) {
      let head = keep > 0 ? digits.slice(0, keep) : "";
      const tail = keep >= 0 ? digits.slice(keep) : "0";
      const up = tail[0] >= "5" && (tail[0] > "5" || /[1-9]/.test(tail.slice(1)) || head.at(-1) % 2 === 1);
      if (up) {
        const next = String(BigInt(head || 0) + 1n);
        if (next.length > head.length) {
          point++;
        }
        head = next;
      } else if (!head) {
        point = -count;
      }
      digits = head;
    }
    this.digits = digits;
    this.point = point;
  }
  /**
   * The digits arranged as text, in two parts: the whole digits and everything after them.
   * `alt` is the spec's # flag, which keeps the decimal point and trailing zeros; `dot0`
   * keeps at least one fraction digit, as repr does.
   */
  layout(alt, dot0) {
    const digits = this.digits, precision = this.precision;
    let point = this.point, end = digits.length, scientific = false;
    switch (this.code) {
      case "e":
        scientific = true;
        end = precision;
        break;
      case "f":
        end = point + precision;
        break;
      case "g":
        scientific = point <= -4 || point > (dot0 ? precision - 1 : precision);
        if (alt) {
          end = precision;
        }
        break;
      case "r":
        scientific = point <= -4 || point > 16;
    }
    let exponent = "";
    if (scientific) {
      const power = point - 1;
      exponent = (power < 0 ? "e-" : "e+") + String(Math.abs(power)).padStart(2, "0");
      point = 1;
    }
    const start = point <= 0 ? point - 1 : 0;
    end = Math.max(end, !scientific && dot0 ? point + 1 : point);
    const all = "0".repeat(-start) + digits + "0".repeat(Math.max(end - digits.length, 0));
    const fraction = all.slice(point - start);
    return [all.slice(0, point - start), (fraction || alt ? "." : "") + fraction + exponent];
  }
};

// src/types.js
var PyType = class _PyType {
  constructor(value) {
    this.value = value;
  }
  static wrap(value) {
    if (value instanceof _PyType) {
      return value;
    }
    switch (typeof value) {
      case "bigint":
        return new PyInteger(value);
      case "number":
        return Number.isInteger(value) ? new PyInteger(value) : new PyFloat(value);
    }
    return new PyString(value);
  }
  /** Python's format(value, spec). */
  __format__(text = "") {
    text = String(text);
    return text ? this.format(Spec.parse(text, this.constructor)) : this.__str__();
  }
  format(spec) {
    const method = this[spec.method];
    if (!method) {
      const name = this.constructor.NAME;
      throw new ValueError(`Unknown format code '${Spec.show(spec.type)}' for object of type '${name}'`);
    }
    return method.call(this, spec);
  }
  __str__() {
    return String(this.value);
  }
  __repr__() {
    return this.__str__();
  }
  /** Python's ascii(): the repr with everything outside ASCII escaped. */
  __ascii__() {
    return this.__repr__().replace(/[^\x00-\x7f]/gu, _PyType.escape);
  }
  static escape(char) {
    const code = char.codePointAt(0);
    if (code < 256) {
      return "\\x" + code.toString(16).padStart(2, "0");
    }
    if (code < 65536) {
      return "\\u" + code.toString(16).padStart(4, "0");
    }
    return "\\U" + code.toString(16).padStart(8, "0");
  }
};
var PyString = class _PyString extends PyType {
  static NAME = "str";
  static CODE = "s";
  // the presentation type when a spec names none
  static ALIGN = "<";
  static specs = /* @__PURE__ */ new Map();
  static ESCAPES = { "\\": "\\\\", "	": "\\t", "\n": "\\n", "\r": "\\r" };
  static QUOTED = /[\\'"]|[^\x20-\x7e]/gu;
  // characters repr may have to escape
  static UNPRINTABLE = /[\p{C}\p{Z}]/u;
  // Python escapes the Other and Separator categories
  /** Quotes a string as Python does; other values have no quotes to add. */
  __repr__() {
    const text = this.value;
    if (typeof text !== "string") {
      return this.__str__();
    }
    const quote = text.includes("'") && !text.includes('"') ? '"' : "'";
    const escaped = text.replace(_PyString.QUOTED, (char) => {
      if (char === quote) {
        return "\\" + char;
      }
      return _PyString.ESCAPES[char] ?? (_PyString.UNPRINTABLE.test(char) ? PyType.escape(char) : char);
    });
    return quote + escaped + quote;
  }
  format_s(spec) {
    if (spec.sign) {
      throw new ValueError(`${spec.sign === " " ? "Space" : "Sign"} not allowed in string format specifier`);
    }
    if (spec.z) throw new ValueError("Negative zero coercion (z) not allowed in string format specifier");
    if (spec.alt) throw new ValueError("Alternate form (#) not allowed in string format specifier");
    if (spec.align === "=") throw new ValueError("'=' alignment not allowed in string format specifier");
    const text = this.__str__();
    return spec.pad(spec.precision === void 0 ? text : Spec.clip(text, spec.precision));
  }
};
var PyInteger = class extends PyType {
  static NAME = "int";
  static CODE = "d";
  static ALIGN = ">";
  static specs = /* @__PURE__ */ new Map();
  constructor(value) {
    super(typeof value === "bigint" ? value : Math.trunc(value));
  }
  __str__() {
    return (this.value < 0 ? "-" : "") + this.digits(10);
  }
  /** The float presentation types convert the integer first, as Python does. */
  format(spec) {
    return "eEfFgG%".includes(spec.type) ? this.float().format(spec) : super.format(spec);
  }
  float() {
    const value = Number(this.value);
    if (!Number.isFinite(value)) throw new OverflowError("int too large to convert to float");
    return new PyFloat(value + 0);
  }
  /** The digits of the absolute value. */
  digits(base) {
    let value = this.value;
    if (typeof value === "number" && !Number.isSafeInteger(value)) {
      value = BigInt(value);
    }
    return (value < 0 ? -value : value).toString(base);
  }
  check(spec) {
    if (spec.precision !== void 0) throw new ValueError("Precision not allowed in integer format specifier");
    if (spec.z) throw new ValueError("Negative zero coercion (z) not allowed in integer format specifier");
  }
  integer(spec, base, prefix) {
    this.check(spec);
    return spec.number(spec.signFor(this.value < 0), spec.alt ? prefix : "", this.digits(base), "");
  }
  format_d(spec) {
    return this.integer(spec, 10, "");
  }
  /** Python's locale-aware type; this is the C locale, which has no separators. */
  format_n(spec) {
    return this.integer(spec, 10, "");
  }
  format_b(spec) {
    return this.integer(spec, 2, "0b");
  }
  format_o(spec) {
    return this.integer(spec, 8, "0o");
  }
  format_x(spec) {
    return this.integer(spec, 16, "0x");
  }
  format_X(spec) {
    this.check(spec);
    const digits = this.digits(16).toUpperCase();
    return spec.number(spec.signFor(this.value < 0), spec.alt ? "0X" : "", digits, "");
  }
  /** The character with this code point. */
  format_c(spec) {
    this.check(spec);
    if (spec.sign) throw new ValueError("Sign not allowed with integer format specifier 'c'");
    if (spec.alt) throw new ValueError("Alternate form (#) not allowed with integer format specifier 'c'");
    const code = this.value;
    if (code >= 2n ** 63n || code < -(2n ** 63n)) throw new OverflowError("Python int too large to convert to C long");
    if (code < 0 || code > 1114111) throw new OverflowError("%c arg not in range(0x110000)");
    return spec.number("", "", "", String.fromCodePoint(Number(code)));
  }
};
var PyFloat = class extends PyType {
  static NAME = "float";
  static CODE = "";
  static ALIGN = ">";
  static specs = /* @__PURE__ */ new Map();
  constructor(value) {
    super(Number(value));
  }
  __str__() {
    return this.format(Spec.parse("", this.constructor));
  }
  /** No presentation type: repr, or 'g' when a precision is given, keeping a fraction digit. */
  ["format_"](spec) {
    return spec.precision === void 0 ? this.decimal(spec, "r", 0) : this.decimal(spec, "g");
  }
  format_e(spec) {
    return this.decimal(spec, "e");
  }
  format_E(spec) {
    return this.decimal(spec, "e");
  }
  format_f(spec) {
    return this.decimal(spec, "f");
  }
  format_F(spec) {
    return this.decimal(spec, "f");
  }
  format_g(spec) {
    return this.decimal(spec, "g");
  }
  format_G(spec) {
    return this.decimal(spec, "g");
  }
  /** Python's locale-aware type; this is the C locale, which has no separators. */
  format_n(spec) {
    return this.decimal(spec, "g");
  }
  ["format_%"](spec) {
    return this.decimal(spec, "f");
  }
  /** Formats with one of the layouts Digits knows; the spec's type adds the variations. */
  decimal(spec, code, precision = spec.precision ?? 6) {
    if (precision > 2147483647) throw new ValueError("precision too big");
    const type = spec.type;
    const value = type === "%" ? this.value * 100 : this.value;
    let negative = value < 0 || Object.is(value, -0);
    let whole = "", rest = Number.isNaN(value) ? "nan" : "inf";
    if (Number.isFinite(value)) {
      const digits = new Digits(Math.abs(value), code, precision);
      if (spec.z && digits.zero) {
        negative = false;
      }
      [whole, rest] = digits.layout(spec.alt, type === "");
    }
    if (type === "%") {
      rest += "%";
    }
    if (type >= "E" && type <= "G") {
      rest = rest.toUpperCase();
    }
    if (spec.fracSep) {
      rest = rest.replace(/\d{3}(?=\d)/g, "$&" + spec.fracSep);
    }
    return spec.number(spec.signFor(negative), "", whole, rest);
  }
};

// src/template.js
var BRACE = /[{}]/g;
var STEP = /\.([^.[]*)|\[([^\]]*)\]/y;
var Template = class {
  static CACHED = 1e3;
  static cache = /* @__PURE__ */ new Map();
  static compile(text) {
    const cache = this.cache;
    let template = cache.get(text);
    if (!template) {
      template = new this(text);
      if (cache.size >= this.CACHED) {
        cache.clear();
      }
      cache.set(text, template);
    }
    return template;
  }
  /** `outer` is the template whose field holds this one as a nested format spec. */
  constructor(text, outer) {
    this.outer = outer;
    this.parts = [];
    this.manual = void 0;
    this.count = 0;
    this.error = void 0;
    if (outer?.outer) {
      this.error = "Max string recursion exceeded";
      return;
    }
    try {
      this.parse(text);
    } catch (err) {
      if (!(err instanceof ValueError)) throw err;
      this.error = err.message;
    }
  }
  parse(text) {
    let pos = 0, literal = "";
    for (; ; ) {
      BRACE.lastIndex = pos;
      const at = BRACE.exec(text)?.index ?? text.length;
      literal += text.slice(pos, at);
      if (at >= text.length) {
        break;
      }
      const brace = text[at];
      if (text[at + 1] === brace) {
        literal += brace;
        pos = at + 2;
        continue;
      }
      if (brace === "}") throw new ValueError("Single '}' encountered in format string");
      if (at + 1 >= text.length) throw new ValueError("Single '{' encountered in format string");
      if (literal) {
        this.parts.push(literal);
        literal = "";
      }
      const field = new Field(this);
      pos = field.parse(text, at + 1);
      this.parts.push(field);
    }
    if (literal) {
      this.parts.push(literal);
    }
  }
  /** `args` is an array of positional arguments or an object of named ones. */
  render(args) {
    let result = "";
    for (const part of this.parts) {
      result += typeof part === "string" ? part : part.render(args);
    }
    if (this.error) throw new ValueError(this.error);
    return result;
  }
};
var Field = class _Field {
  static CONVERSIONS = { s: "__str__", r: "__repr__", a: "__ascii__" };
  constructor(template) {
    this.template = template;
    this.key = void 0;
    this.path = [];
    this.pathError = void 0;
    this.conversion = void 0;
    this.spec = "";
    this.nested = void 0;
  }
  /** Parses the field that starts after the brace at pos; returns the position after it. */
  parse(text, pos) {
    const start = pos;
    let char;
    for (; pos < text.length; pos++) {
      char = text[pos];
      if (char === "{") throw new ValueError("unexpected '{' in field name");
      if (char === "[") {
        pos = text.indexOf("]", pos);
        if (pos < 0) {
          break;
        }
      } else if (char === "}" || char === ":" || char === "!") {
        break;
      }
    }
    if (pos < 0 || pos >= text.length) throw new ValueError("expected '}' before end of string");
    const name = text.slice(start, pos++);
    let spec = "";
    if (char === "!") {
      if (pos >= text.length) throw new ValueError("end of string while looking for conversion specifier");
      this.conversion = String.fromCodePoint(text.codePointAt(pos));
      pos += this.conversion.length;
      if (pos < text.length) {
        char = text[pos++];
        if (char !== "}" && char !== ":") throw new ValueError("expected ':' after conversion specifier");
      }
    }
    if (char !== "}") {
      const from = pos;
      for (let depth = 1; depth; pos++) {
        if (pos >= text.length) throw new ValueError("unmatched '{' in format spec");
        if (text[pos] === "{") {
          depth++;
        } else if (text[pos] === "}") {
          depth--;
        }
      }
      spec = text.slice(from, pos - 1);
    }
    this.name(name);
    if (spec.includes("{")) {
      this.nested = new Template(spec, this.template);
    } else {
      this.spec = spec;
    }
    return pos;
  }
  name(text) {
    const root = this.template.outer ?? this.template;
    const head = /^[^.[]*/.exec(text)[0];
    if (head === "" || /^\d+$/.test(head)) {
      const manual = head !== "";
      if (root.manual === !manual) {
        throw new ValueError(manual ? "cannot switch from automatic field numbering to manual field specification" : "cannot switch from manual field specification to automatic field numbering");
      }
      root.manual = manual;
      this.key = manual ? Spec.integer(head) : root.count++;
    } else {
      this.key = head;
    }
    try {
      this.steps(text, head.length);
    } catch (err) {
      if (!(err instanceof ValueError)) throw err;
      this.pathError = err.message;
    }
  }
  steps(text, pos) {
    while (pos < text.length) {
      STEP.lastIndex = pos;
      const match = STEP.exec(text);
      if (!match) throw new ValueError("Only '.' or '[' may follow ']' in format field specifier");
      const [all, attribute, index] = match;
      const name = attribute ?? index;
      if (!name) throw new ValueError("Empty attribute in format string");
      this.path.push([attribute !== void 0, /^\d+$/.test(index) ? Spec.integer(index) : name]);
      pos += all.length;
    }
  }
  render(args) {
    let value;
    try {
      value = this.lookup(args);
    } catch (err) {
      if (OPTIONS.strict || !(err instanceof LookupError || err instanceof AttributeError)) throw err;
      return "";
    }
    if (this.conversion) {
      const method = _Field.CONVERSIONS[this.conversion];
      if (!method) throw new ValueError(`Unknown conversion specifier ${Spec.show(this.conversion)}`);
      value = PyType.wrap(value)[method]();
    }
    const spec = this.nested ? this.nested.render(args) : this.spec;
    if (typeof value?.__format__ !== "function") {
      value = PyType.wrap(value);
    }
    const result = value.__format__(spec);
    if (typeof result !== "string") throw new TypeError(`__format__ must return a str, not ${typeof result}`);
    return result;
  }
  /** The argument this field names, followed down its path. */
  lookup(args) {
    const key = this.key, numbered = typeof key === "number";
    if (!(Array.isArray(args) ? numbered && key < args.length : Object.hasOwn(args, key))) {
      throw numbered ? new IndexError(`Replacement index ${key} out of range for positional args tuple`) : new KeyError(new PyString(key).__repr__());
    }
    let value = args[key];
    for (const [attribute, name] of this.path) {
      if (value == null || !(name in Object(value))) throw this.missing(value, attribute, name);
      value = value[name];
    }
    if (this.pathError) throw new ValueError(this.pathError);
    return value;
  }
  missing(value, attribute, name) {
    if (attribute) {
      return new AttributeError(`object has no attribute '${name}'`);
    }
    if (typeof name === "number" && typeof value === "string") {
      return new IndexError("string index out of range");
    }
    if (typeof name === "number" && Array.isArray(value)) {
      return new IndexError("list index out of range");
    }
    return new KeyError(new PyString(name).__repr__());
  }
};

// src/index.js
function format(template, ...args) {
  if (template === void 0 || template === null) {
    return template;
  }
  const named = args.length === 1 && isPlainObject(args[0]);
  return Template.compile(String(template)).render(named ? args[0] : args);
}
function setOptions(options) {
  Object.assign(OPTIONS, options);
  if (OPTIONS.global) {
    Object.defineProperty(String.prototype, "format", { configurable: true, writable: true, value: stringFormat });
  } else if (String.prototype.format === stringFormat) {
    delete String.prototype.format;
  }
}
function stringFormat(...args) {
  return format(this, ...args);
}
function isPlainObject(value) {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in value) && !(Symbol.iterator in value);
}
Object.assign(format, {
  setOptions,
  PyString,
  PyInteger,
  PyFloat,
  PyError,
  ValueError,
  LookupError,
  IndexError,
  KeyError,
  AttributeError,
  OverflowError
});
module.exports = module.exports.default

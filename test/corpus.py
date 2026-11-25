"""
Generates corpus.json: what CPython's str.format() returns (or raises) for a broad set of
templates and values. The JavaScript tests replay the corpus and must match it exactly.

    python3 test/corpus.py

Rerun after adding cases, or to move the corpus to a newer Python.
"""
import json
import math
import random
import sys
from pathlib import Path


class Corpus:
    SAFE = 2 ** 53  # integers past this cannot be a JavaScript Number

    FLOAT_CORE_SPECS = [
        '', 'f', 'e', 'g', '%', 'n', 'F', 'E', 'G',
        '.0f', '.1f', '.2f', '.3f', '.10f', '.0e', '.2e', '.5e', '.0g', '.1g', '.3g', '.10g', '.17g',
        '.0', '.1', '.3', '.12', '.0%', '.1%',
        '+.2f', ' .3e', ',.2f', '_.1f', ',', '012.3f', '<12.2f', '^12g', '015,.2f', 'z.1f', '#.0f', '#.3g',
    ]
    FLOAT_EXTRA_SPECS = [
        '.6f', '.1e', '.10e', '.2g', '.6g', '.6', '.17', '.2%', '#f', '#e', '#.0e', '#g', '#', '#.3', '#.0g',
        '+', '+f', '-.2f', ' ', '+e', ' g', '+%', 'z', 'z.0f', '+z.2f', 'zg', 'z.0e', 'z%', ' z.1f',
        ',f', '_', '_.3f', ',g', ',e', ',%', ',.0f', '_e', ',.10g', ',.3',
        '10', '10.2f', '>10.2f', '=10.2f', '=+12.3e', '010.2f', '+010.2f', '-010.2f', ' 010.2f', '012,.2f',
        '*^15,.2f', '020', '020,', '020_', '08.3e', 'x>12g', '0>12,.1f', '0<12.1f', '0^12.1f', '0=12,.1f',
        'é<12.2f', '\U0001f600^9.1f', '1', '2.0f', '030,.4f', '016,.3e', '014,g', '011,%',
        '._', '.,', '.6_f', ',.6_f', '_.6,f', '.8_e', '.4_%', '020,.6_f', '.20_', '.12_g', '#.0_f', '020.6_f', '.7_E',
    ]
    FLOAT_ERROR_SPECS = [
        'd', 'x', 's', 'c', 'b', 'o', 'X', 'N', '.', '10.', ',n', '_n', '.,n', '1.2.3', ',_', '_,', ',,', '.,_f',
        '.__f', 'ff', '=', 'q', 'é', '+ ', '#z', '00', '.2147483648f', '99999999999999999999',
    ]
    FLOAT_SPECIAL_VALUES = [
        0.0, -0.0, 1.0, -1.0, 0.5, 1.5, 2.5, 3.5, -2.5, 0.125, 0.375, 0.25, 0.35, 0.45, 1.005, 2.675, 0.1, 0.2,
        0.30000000000000004, 1 / 3, 2 / 3, 3.14159, -3.14159, 123.456, 1234.5678, 1234567.891, 123456789.1234,
        0.000123456, 0.0001, 0.00001, 1e-7, 1.5e-10, 9.995, 9.5, 99.5, 999.5, 0.95, 0.995, 0.9995, 99999.5,
        999999.5, 9999995.0, 0.05, 0.005, 0.0005, -0.04, -0.06, -0.0004, 1e15, 1e16, 1.5e16, 9999999999999998.0,
        1e21, 1e22, 1.2345e25, 1e100, 1e-100, 5e-324, 2.2250738585072014e-308, 1.7976931348623157e308,
        9007199254740992.0, 9007199254740994.0, 12345.0, 100.0, 1e5, 1e6, 123456.0, 1234567.0, 25.0, 35.0,
        250.0, 0.0625, 1.25, 1.35, 12.5, 0.015625, 1e23, 8.5e-5, 4.35, 0.285, 1.45,
        math.inf, -math.inf, math.nan,
    ]
    FLOAT_LONG_SPECS = ['.101f', '.150f', '.120e', '.110g', '.330f', '.400e', '.800e', '.1100f', '.200', '.101%']
    FLOAT_LONG_VALUES = [0.1, 1 / 3, 2.5e-105, 5e-324, 1e21, 1e300, 123.456, 2.2250738585072014e-308, 0.5, 7.0]

    INT_SPECS = [
        '', 'd', 'n', 'b', 'o', 'x', 'X', 'c', '#b', '#o', '#x', '#X', '#d', '#', '#n',
        '+', '+d', ' d', '-d', '+x', ' #x', '+#b', ' ', '+n',
        ',', ',d', '_', '_d', '_b', '_o', '_x', '_X', '#_x', '#_b', '#_o', '+_d', ' ,',
        '10', '<10', '^10', '>10', '=10', '010', '+010', '=+10', '*^10', '^11', '0>10', '0<10', '0^10', 'x=10',
        '010,', '015,d', '012_d', '020_x', '#020_b', '#010x', '#010X', '08b', 'x<8o', '^#12x', '=#12b', '+#012x',
        '06,', '07,', '08,', '09,', '011_x', '010_b', '5n', '05n', 'é>8', '\U0001f600^7d', '1', '0',
        'e', 'E', 'f', 'F', 'g', 'G', '%', '.2f', '.3e', '.3g', ',.2f', '010.1f', '+.1%', '.0f', '#.0f', 'z.1f',
        '._', '._d', '.,x', '.6_f',
    ]
    INT_ERROR_SPECS = [
        'z', 'zd', '.3', '.3d', '.3x', ',x', ',b', ',o', ',n', '_n', ',c', '_c', '+c', ' c', '#c', '.2c', 'zc',
        's', 'q', 'r', 'N', 'D', '.', ',_', '_,', ',,', '__', '1.2.3', 'é', '\x01', ',é', '.,n', '=',
    ]
    CHAR_SPECS = ['c', '5c', '05c', '<5c', '^5c', '=5c', '*>4c', '0<4c']
    INT_VALUES = [
        0, 1, -1, 5, -5, 9, 10, 42, -42, 65, 97, 100, 127, 128, 255, -255, 256, 999, 1000, 1234, -1234, 12345,
        123456, 1234567, -1234567, 65535, 65536, 0x1F600, 0x10FFFF, 0x110000, 2 ** 31 - 1, -2 ** 31, 2 ** 32,
        2 ** 53 - 1, 2 ** 53, 2 ** 53 + 1, -2 ** 53 - 1, 2 ** 63 - 1, 2 ** 63, -2 ** 63, -2 ** 63 - 1, 2 ** 64,
        10 ** 15, 10 ** 16, 10 ** 18, 10 ** 21, 10 ** 25, 10 ** 30, -10 ** 30, 2 ** 100, 123456789012345678901234567890,
    ]

    STR_SPECS = [
        '', 's', '10', '<10', '>10', '^10', '^11', '*^10', '\U0001f600^7', 'é<6', '.0', '.1', '.2', '.5', '10.2',
        '>10.3s', '^9.4', '05', '<05', '>05', '^05', '0', '1', '}^7', '=<7', '<<7', '\t>4', '._', '.,', '.3_', '.2,s',
    ]
    STR_ERROR_SPECS = [
        '=10', '+', ' ', '-', '#', 'z', ',', '_', 'd', 'f', 'x', 'c', 'n', 'S', 'é', '.', '5.', '1.2.3', ',s',
        '+s', '0=5', 'ss', '.,n', '.,_',
    ]
    STR_VALUES = [
        '', 'a', 'abc', 'hello world', 'é', '日本語', '\U0001f600', '\U0001f600x\U0001f600',
        'a\tb', "it's", 'x' * 12, '{}', ' ',
    ]
    REPR_VALUES = STR_VALUES + [
        'say "hi"', 'both \' and "', 'nl\n', 'cr\r', 'back\\slash', '\x00\x1f\x7f', '\x80\xa0\xad',
        '\u2028\u200b', '\ud800', '\udfff!', 'e\u0301', '\ufeff', '\u3000', '\ue000', '\U000e0001', '\xff\u0100',
    ]
    CONVERSION_TEMPLATES = ['{!r}', '{!s}', '{!a}', '{!r:>12}', '{!a:^14}', '{!s:.2}', '{!r:.3}', '{0!r:*<9}']

    def __init__(self):
        self.random = random.Random(20261125)
        self.matrices = []
        self.cases = []

    def build(self):
        self.matrix('float core', self.float_values(), self.FLOAT_CORE_SPECS)
        self.matrix('float extra', self.FLOAT_SPECIAL_VALUES, self.FLOAT_EXTRA_SPECS)
        self.matrix('float long', self.FLOAT_LONG_VALUES, self.FLOAT_LONG_SPECS)
        self.matrix('float errors', [1.5, -0.0, 1e21, math.inf, math.nan], self.FLOAT_ERROR_SPECS)
        self.matrix('int', self.int_values(), self.INT_SPECS)
        self.matrix('int char', [65, 0x1F600, 0, 0xE9, 0xD800], self.CHAR_SPECS)
        self.matrix('int errors', [0, 65, -42, 2 ** 63 - 1, 2 ** 63, -2 ** 63, -2 ** 63 - 1], self.INT_ERROR_SPECS)
        self.matrix('str', self.STR_VALUES, self.STR_SPECS)
        self.matrix('str errors', ['', 'abc'], self.STR_ERROR_SPECS)
        self.conversions()
        self.templates()
        self.arguments()
        self.nested()
        return self

    # values

    def float_values(self):
        values = list(self.FLOAT_SPECIAL_VALUES)
        uniform = self.random.uniform
        values += [uniform(-1000, 1000) for i in range(20)]
        values += [uniform(1, 10) * 10 ** self.random.randint(-30, 30) for i in range(25)]
        values += [round(uniform(0, 100), 3) for i in range(15)]
        # exact binary fractions, where half-way rounding cases live
        values += [self.random.randint(1, 4000) / 2 ** self.random.randint(1, 6) for i in range(40)]
        values += [self.random.randint(1, 10 ** 6) * 5.0 * 10 ** self.random.randint(0, 12) for i in range(10)]
        return values

    def int_values(self):
        values = list(self.INT_VALUES)
        values += [self.random.randint(-10 ** 6, 10 ** 6) for i in range(8)]
        values += [self.random.randint(-10 ** 24, 10 ** 24) for i in range(4)]
        return values

    # cases

    def conversions(self):
        for template in self.CONVERSION_TEMPLATES:
            for value in self.REPR_VALUES:
                self.case(template, value)
        for value in [1.5, 10, 1e-7, 1e16, 3.14159, 1.0, -0.0, 10 ** 30, math.inf, math.nan]:
            for template in ['{!r}', '{!s}', '{!a}', '{!r:>8}', '{!s:.2}', '{!s:d}']:
                self.case(template, value)

    def templates(self):
        for template in [
            # literal text and escaped braces
            '', 'plain', '{{', '}}', '{{}}', '{{{}}}', 'a{{b}}c{{d}}e', '{{{{}}}}', '{{ {{ }} }}', '{{{0}}}', '}}{{',
            '{}{}{}', '{0}{1}{2}', '{2}{1}{0}', '{0}{0}{0}', '{}-{}', 'x{}y{}z', '{0:}', '{:}', '{!s}', '{0!s:}',
            '{01}', '{0:>3}{1:>4}{2:>5}', '\U0001f600{}\U0001f600', '{}\n{}',
            # malformed
            '{', '}', 'a{', 'a}', '{0', '{0:', '{0!', '{0!r', '{0!rx}', '{0!}', '{0!z}', '{!}', '{a{b}}', '{0[}',
            '{0[]}', '{0[1}', '{0.}', '{0..a}', '{.}', '{0:{', '{0:{}', '{0:{1:{2}}}', '{:{:{}}}', '{} {0}',
            '{0} {}', '{0:{}}', '{:{0}}', '{[}', '{0!s!r}', '{:}}', '{:{{}}}', '{0}}', '{{}', '{0!r }', '{0!é}',
            '{0!\U0001f600}', '{0!\x01}', '{0!R}', '{0!ss}', '{0:{9}}', '{0:{x}}', '{:{}{}{}}',
            '{99999999999999999999}', '{0[99999999999999999999]}', '{-1}', '{ 0}', '{0 }', '{a b}', '{0x1}',
            # the first error in field order is the one reported
            '{9} {', '{} {} {} {} }', '{0!z} {9}', '{9!z}', '{0:q} {', '{9:{', '{9.}', '{9[}', '{0.} {9}',
            '{0[1]x}', '{2.}',
        ]:
            self.case(template, 'A', 5, 3.5)

    def arguments(self):
        self.case('{} {}', 'A')
        self.case('{}')
        self.case('{2}', 'A')
        self.case('{a}')
        self.case('{a}', 'A', 'B')
        self.case('{a} {b} {a}', a=1, b='two')
        self.case('{name:>8}|{count:05d}|{ratio:.1%}', name='x', count=42, ratio=0.256)
        self.case('{a}', b=1)
        self.case('{a.}', a=1)
        self.case('{a[}', a=1)
        self.case('{a-b}', **{'a-b': 1})
        self.case('{é}', **{'é': 'accent'})
        # indexing into containers (a second argument keeps a lone dict from being read as keywords)
        self.case('{0[0]} {0[1]}', [3, 5], 0)
        self.case('{0[0][1]}', [[1, 2]], 0)
        self.case('{0[5]}', [1, 2], 0)
        self.case('{[1]}', [3, 5], 0)
        self.case('{0[a]}', {'a': 1}, 0)
        self.case('{0[a b]}', {'a b': 1}, 0)
        self.case('{0[a][b]}', {'a': {'b': 'deep'}}, 0)
        self.case('{0[x]}', {'y': 1}, 0)
        self.case('{0[a:b]} {0[a!b]} {0[a}b]}', {'a:b': 1, 'a!b': 2, 'a}b': 3}, 0)
        self.case('{0[ 1]}', {' 1': 'x'}, 0)
        self.case('{0[0]}{0[1]}', 'xy')
        self.case('{0[2]}', 'xy')
        self.case('{a[0]}{a[1]}', a='xy')
        self.case('{a[k]:>5}', a={'k': 1.5})
        self.case('{a[k]!r:>5}', a={'k': 'v'})
        self.case('{0[0]:.1f}/{0[1]:x}', [2.25, 255], 0)

    def nested(self):
        self.case('{:{}}', 'abc', 10)
        self.case('{:{}}', 1.5, '.3f')
        self.case('{:{}.{}f}', 3.14159, 10, 2)
        self.case('{0:{1}}', 'abc', 10)
        self.case('{0:{1}{2}}', 'x', '>', 5)
        self.case('{:{}{}}', 'x', '>', 5)
        self.case('{0:{0}}', 5)
        self.case('{0!r:{1}}', 'x', '>6')
        self.case('{:{}}', 5, 'q')
        self.case('{:{}}', 5, '{}')
        self.case('{:{}}', 5)
        self.case('{v:{w}.{p}f}', v=3.14159, w=10, p=2)
        self.case('{v:{f}^{w}}', v='a', f='}', w=5)
        self.case('{v:{f}^{w}}', v='a', f='{', w=5)
        self.case('{v:{f}{a}{w},}', v=1234567, f='0', a='=', w=14)
        self.case('{a[b]!s:{c}}', a={'b': 1.5}, c='>6')
        self.case('{v:{missing}}', v=1)
        self.case('{v:{w!r}}', v=1, w=5)
        self.case('{v:{w:>3}}', v=1, w=5)

    # recording

    def matrix(self, name, values, specs):
        """Every value formatted with every spec, as '{:spec}'.format(value)."""
        rows = [[self.result('{:' + spec + '}', [value], {}) for spec in specs] for value in values]
        self.matrices.append({'name': name, 'specs': specs, 'values': [self.encode(v) for v in values], 'results': rows})

    def case(self, template, *args, **kwargs):
        if args and kwargs or len(args) == 1 and isinstance(args[0], dict):
            raise ValueError(f'not expressible in the JavaScript call convention: {template!r}')
        self.cases.append([template, self.encode(kwargs or list(args)), self.result(template, args, kwargs)])

    def result(self, template, args, kwargs):
        """The formatted string, or [exception type, message]."""
        try:
            return template.format(*args, **kwargs)
        except Exception as error:
            return [type(error).__name__, str(error)]

    def encode(self, value):
        """JSON for a value; floats and integers JSON would blur are tagged for the JavaScript side."""
        if isinstance(value, float):
            if not math.isfinite(value) or value == int(value):
                return {'__float__': repr(value)}
        elif isinstance(value, int):
            if abs(value) >= self.SAFE:
                return {'__int__': str(value)}
        elif isinstance(value, list):
            return [self.encode(v) for v in value]
        elif isinstance(value, dict):
            return {k: self.encode(v) for k, v in value.items()}
        return value

    def write(self, path):
        dump = lambda value: json.dumps(value, separators=(',', ':'))
        lines = ['{', f'"python":{dump(sys.version.split()[0])},', '"matrices":[']
        for m, matrix in enumerate(self.matrices):
            lines += ['{' + f'"name":{dump(matrix["name"])},', f'"specs":{dump(matrix["specs"])},', f'"values":{dump(matrix["values"])},', '"results":[']
            lines += [dump(row) + (',' if r < len(matrix['results']) - 1 else '') for r, row in enumerate(matrix['results'])]
            lines += [']}' + (',' if m < len(self.matrices) - 1 else '')]
        lines += ['],', '"cases":[']
        lines += [dump(case) + (',' if c < len(self.cases) - 1 else '') for c, case in enumerate(self.cases)]
        lines += [']', '}']
        path.write_text('\n'.join(lines) + '\n')
        count = sum(len(m['values']) * len(m['specs']) for m in self.matrices) + len(self.cases)
        print(f'{path.name}: {count} results from Python {sys.version.split()[0]}, {path.stat().st_size // 1024}K')


if __name__ == '__main__':
    Corpus().build().write(Path(__file__).with_name('corpus.json'))

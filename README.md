<!--

SPDX-FileCopyrightText: 2025 Cas Dijkman

SPDX-License-Identifier: GPL-3.0-only

-->

# expect

`expect` is a simple javascript expect library designed to be minimal but effective.
This library enables you to write simple assertions with the following syntax:

```javascript
import { describe, expect } from '@casd/expect';

describe('0 is a number').expect(0).to.be.a('number');         // => true
describe('0 is not an object').expect(0).not.to.be.an(Object); // => true
```

## API

### `expect(value, options?)`

Creates an assertion for `value`. The optional `options` object accepts a `description` string that is included in the console output.

```javascript
expect(42, { description: 'the answer' }).to.be.a('number');
```

The returned object is chainable. `to` and `be` are simply aliases back to the assertion, so the following are equivalent:

```javascript
expect(0).be.a('number');
expect(0).to.be.a('number');
expect(0).to.be.typeOf('number');
```

### `describe(description)`

A convenience wrapper that returns an object with an `expect` function, pre-filling the `description` option:

```javascript
describe('my assertion').expect(0).to.be.a('number');
// equivalent to:
expect(0, { description: 'my assertion' }).to.be.a('number');
```

### `.not`

Inverts the following assertion. It can be placed anywhere in the chain:

```javascript
expect('hello').not.to.be.a('number');   // => true
expect(null).to.not.be.an(Object);       // => true
```

## Assertions

### `.equal(expected)`

Checks strict equality (`===`). If either side is a `Symbol`, a note is added to the description because symbols are always unique.

```javascript
expect(1).to.equal(1);       // => true
expect(1).to.equal('1');     // => false
```

### `.be.a(expected)` / `.be.an(expected)`

A shorthand that dispatches based on the argument:

- If `expected` is a **string**, it behaves like `.be.typeOf(expected)`.
- Otherwise it behaves like `.be.an.instanceOf(expected)`.

```javascript
expect(0).to.be.a('number');       // => true
expect([]).to.be.an(Array);        // => true
expect({}).to.be.an(Object);       // => true
```

### `.be.typeOf(expected)`

Checks `typeof value === expected`. Valid `expected` values are the standard `typeof` results: `'undefined'`, `'object'`, `'boolean'`, `'number'`, `'bigint'`, `'string'`, `'symbol'`, `'function'`. Passing anything else logs a warning via `console.assert`.

```javascript
expect('hi').to.be.typeOf('string'); // => true
expect(() => {}).to.be.typeOf('function'); // => true
```

### `.be.instanceOf(expected)`

Checks `value instanceof expected`. The expected class name (or the value itself, if unnamed) is used in the description.

```javascript
expect(new Date()).to.be.an.instanceOf(Date); // => true
expect([]).to.be.an.instanceOf(Array);        // => true
```

### `.be.true` / `.be.truthy`

- `.be.true` checks `value === true`.
- `.be.truthy` checks `Boolean(value)`.

```javascript
expect(true).to.be.true;    // => true
expect(1).to.be.truthy;     // => true
```

### `.be.false` / `.be.falsy`

- `.be.false` checks `value === false`.
- `.be.falsy` checks `!value`.

```javascript
expect(false).to.be.false;  // => true
expect(0).to.be.falsy;      // => true
```

## Return values & output

Every assertion returns a boolean and reports the outcome with `console.assert`. On failure, the message includes the accumulated description (including any `describe` / `options.description` text) plus details about what was expected and what was actually received:

```
Assertion failed: my assertion. Expected typeof number, got string.
```

## Notes

- Assertions are evaluated immediately when the chain is completed (e.g. `.a('number')`), not when `expect` is called.
- `.not` toggles inversion for the next assertion only; each call to `expect` starts with a fresh assertion.
- This library is intentionally small — it does not throw on failure, it logs via `console.assert`.

## License

This project is licensed under the **GNU General Public License v3.0 only** (GPL-3.0-only).

See the [`LICENSE`](LICENSE) file for the full license text, or read it online at <https://www.gnu.org/licenses/gpl-3.0.html>.

*This software is provided **"as is"**, without any warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose, title, and non-infringement. The authors and copyright holders make no guarantee that the software will be error-free, uninterrupted, or suitable for any particular purpose, and accept no liability for any damages arising from its use.*

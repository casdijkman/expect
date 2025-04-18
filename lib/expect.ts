/*
 * SPDX-FileCopyrightText: 2025 Cas Dijkman
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import type { AssertionType } from '../index.d.js';

const validTypeOfs = [
  'undefined',
  'object',
  'boolean',
  'number',
  'bigint',
  'string',
  'symbol',
  'function'
];

class Assertion implements AssertionType {
  value;
  descriptions;
  invert = false;
  to;
  be;

  constructor ({ value, description }: { value: any, description?: string }) {
    this.value = value;
    this.descriptions = [
      ...(typeof description === 'string' ? [description] : [])
    ];

    this.to = this;
    this.be = {
      a: this._expectToBeA.bind(this),
      an: this._expectToBeA.bind(this),
      typeOf: this._expectToBeATypeOf.bind(this),
      instanceOf: this._expectToBeAnInstanceOf.bind(this),
      truthy: this._expectToBeTruthy.bind(this),
      falsy: this._expectToBeFalsy.bind(this),
    };
  }

  not () {
    this.invert = true;
    return this;
  }

  equal (expected: any) {
    this._addDescription({ expected });
    if ([expected, this.value].some((x) => typeof x === 'symbol')) {
      this.descriptions.push('Symbols are always unique');
    }
    return this.execute(() => this.value === expected);
  }

  _addDescription (
    {
      type,
      expected,
      got = this.value
    }: {
      type?: string;
      expected: any;
      got?: any;
    }) {
    this.descriptions.push(
      'Expected'
        .concat(this.invert ? ' not' : '')
        .concat(type ? ` ${type}` : '')
        .concat(` ${valueToStringSafe(expected)},`)
        .concat(` got ${valueToStringSafe(got)}`)
    );
  }

  _expectToBeA (expected: any) {
    if (typeof expected === 'string') {
      return this._expectToBeATypeOf(expected);
    } else {
      return this._expectToBeAnInstanceOf(expected);
    }
  }

  _expectToBeAnInstanceOf (expected: any) {
    return this.execute(() => {
      this._addDescription({ type: 'instanceof', expected: expected?.name || expected });
      return this.value instanceof (expected);
    });
  }

  _expectToBeATypeOf (expected: any) {
    return this.execute(() => {
      this._addDescription({ type: 'typeof', expected });

      console.assert(validTypeOfs.includes(expected), 'unknown typeof value');
      // eslint-disable-next-line valid-typeof
      return typeof this.value === expected;
    });
  }

  _expectToBeTruthy () {
    return this.execute(() => {
      this._addDescription({ expected: 'truthy value' });
      return !!this.value;
    });
  }

  _expectToBeFalsy () {
    return this.execute(() => {
      this._addDescription({ expected: 'falsy value' });
      return !this.value;
    });
   }

  execute (predicate: () => any) {
    const result = this.invert ? !predicate() : predicate();
    const description = this.descriptions.length > 0
      ? this.descriptions.join('. ').concat('.')
      : 'No description';
    console.assert(result, description);
    return Boolean(result);
  }
}

function valueToStringSafe (value: any) {
  const stringValue = String(value);
  if (stringValue === '') {
    return '<empty string>';
  }
  console.assert(Boolean(stringValue), 'could not convert value to string', value);
  return stringValue || 'unknown';
}

export function describe (description: string) {
  return { expect: expect.bind({ description }) };
}

export function expect (this: { description?: string }, value: any) {
  const assertionInstance = new Assertion({
    value,
    description: this?.description
  });

  const proxyHandler = {
    get (target: any, prop: string, receiver: any) {
      const assertionValue = Reflect.get(target, prop, receiver);
      if (prop === 'not') {
        return target.not();
      } else {
        return assertionValue;
      }
    }
  };

  return new Proxy(assertionInstance, proxyHandler);
}

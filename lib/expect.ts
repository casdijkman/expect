/*
 * SPDX-FileCopyrightText: 2025 Cas Dijkman
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

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

export class Assertion {
  #value;
  #descriptions;
  #invert = false;
  to;
  be;

  constructor ({ value, description }: { value: any, description?: string }) {
    this.#value = value;
    this.#descriptions = [
      ...(typeof description === 'string' ? [description] : [])
    ];

    this.to = this;
    this.be = {
      a: this.#expectToBeA.bind(this),
      an: this.#expectToBeA.bind(this),
      typeOf: this.#expectToBeATypeOf.bind(this),
      instanceOf: this.#expectToBeAnInstanceOf.bind(this),
      truthy: this.#expectToBeTruthy.bind(this),
      falsy: this.#expectToBeFalsy.bind(this),
    };
  }

  invertPredicate () {
    this.#invert = true;
    return this;
  }

  equal (expected: any) {
    this.#addDescription({ expected });
    if ([expected, this.#value].some((x) => typeof x === 'symbol')) {
      this.#descriptions.push('Symbols are always unique');
    }
    return this.#execute(() => this.#value === expected);
  }

  #addDescription (
    {
      type,
      expected,
      got = this.#value
    }: {
      type?: string;
      expected: any;
      got?: any;
    }) {
    this.#descriptions.push(
      'Expected'
        .concat(this.#invert ? ' not' : '')
        .concat(type ? ` ${type}` : '')
        .concat(` ${valueToStringSafe(expected)},`)
        .concat(` got ${valueToStringSafe(got)}`)
    );
  }

  #expectToBeA (expected: any) {
    if (typeof expected === 'string') {
      return this.#expectToBeATypeOf(expected);
    } else {
      return this.#expectToBeAnInstanceOf(expected);
    }
  }

  #expectToBeAnInstanceOf (expected: any) {
    return this.#execute(() => {
      this.#addDescription({ type: 'instanceof', expected: expected?.name || expected });
      return this.#value instanceof (expected);
    });
  }

  #expectToBeATypeOf (expected: any) {
    return this.#execute(() => {
      this.#addDescription({ type: 'typeof', expected });

      console.assert(validTypeOfs.includes(expected), 'unknown typeof value');
      // eslint-disable-next-line valid-typeof
      return typeof this.#value === expected;
    });
  }

  #expectToBeTruthy () {
    return this.#execute(() => {
      this.#addDescription({ expected: 'truthy value' });
      return !!this.#value;
    });
  }

  #expectToBeFalsy () {
    return this.#execute(() => {
      this.#addDescription({ expected: 'falsy value' });
      return !this.#value;
    });
   }

  #execute (predicate: () => any) {
    const result = this.#invert ? !predicate() : predicate();
    const description = this.#descriptions.length > 0
      ? this.#descriptions.join('. ').concat('.')
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

interface AssertionProxy extends Assertion {
  not: Assertion;
};

export function expect (this: { description?: string }, value: any): AssertionProxy {
  const assertionInstance = new Assertion({
    value,
    description: this?.description
  });

  const proxyHandler = {
    get (target: any, prop: string, receiver: any) {
      const assertionValue = Reflect.get(target, prop, receiver);
      if (prop === 'not') {
        return target.invertPredicate();
      } else {
        return assertionValue;
      }
    }
  };

  return new Proxy(assertionInstance, proxyHandler);
}

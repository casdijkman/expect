/*
 * SPDX-FileCopyrightText: 2025 Cas Dijkman
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

const validTypeOfs = new Set([
  'undefined',
  'object',
  'boolean',
  'number',
  'bigint',
  'string',
  'symbol',
  'function',
]);

export class Assertion {
  to;
  be;
  readonly #value;
  readonly #descriptions;
  #invert = false;

  constructor({ value, description }: { value: any; description?: string }) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.#value = value;
    this.#descriptions = [
      ...(typeof description === 'string' ? [description] : []),
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

  invertPredicate() {
    this.#invert = true;
    return this;
  }

  equal(expected: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.#addDescription({ expected });
    if ([expected, this.#value].some((x) => typeof x === 'symbol')) {
      this.#descriptions.push('Symbols are always unique');
    }

    return this.#execute(() => this.#value === expected);
  }

  #addDescription(
    {
      type,
      expected,
      got,
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
        .concat(` got ${valueToStringSafe(got ?? this.#value)}`),
    );
  }

  #expectToBeA(expected: any) {
    return typeof expected === 'string'
      ? this.#expectToBeATypeOf(expected)
      : this.#expectToBeAnInstanceOf(expected);
  }

  #expectToBeAnInstanceOf(expected: any) {
    return this.#execute(() => {
      this.#addDescription({
        type: 'instanceof',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        expected: expected?.name || expected,
      });
      return this.#value instanceof (expected);
    });
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  #expectToBeATypeOf(expected: string) {
    return this.#execute(() => {
      this.#addDescription({ type: 'typeof', expected });

      console.assert(validTypeOfs.has(expected), 'unknown typeof value');

      return typeof this.#value === expected;
    });
  }

  #expectToBeTruthy() {
    return this.#execute(() => {
      this.#addDescription({ expected: 'truthy value' });
      return Boolean(this.#value);
    });
  }

  #expectToBeFalsy() {
    return this.#execute(() => {
      this.#addDescription({ expected: 'falsy value' });
      return !this.#value;
    });
  }

  #execute(predicate: () => any) {
    const result = Boolean(this.#invert ? !predicate() : predicate());
    const description = this.#descriptions.length > 0
      ? this.#descriptions.join('. ').concat('.')
      : 'No description';
    console.assert(result, description);
    return result;
  }
}

function valueToStringSafe(value: any) {
  const stringValue = String(value);
  if (stringValue === '') {
    return '<empty string>';
  }

  console.assert(Boolean(stringValue), 'could not convert value to string', value);
  return stringValue || 'unknown';
}

export function describe(description: string) {
  return {
    expect: (value: any) => expect(value, { description }),
  };
}

type AssertionProxy = {
  not: Assertion;
} & Assertion;

export function expect(
  value: any,
  options?: {
    description?: string;
  },
): AssertionProxy {
  const assertionInstance = new Assertion({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    value,
    description: options?.description,
  });

  const proxyHandler = {
    get(target: Assertion, property: string, receiver: any) {
      const assertionValue = Reflect.get(target, property, receiver) as Assertion;
      if (property === 'not') {
        return target.invertPredicate();
      }

      return assertionValue;
    },
  };

  return new Proxy(assertionInstance, proxyHandler) as AssertionProxy;
}

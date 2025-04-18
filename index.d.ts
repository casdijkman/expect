// Type definitions for @casd/expect
// Definitions by: Cas Dijkman <info@cdijkman.nl>

interface DescribeType {
  expect: (value: any) => AssertionType;
};

type AssertionLeafType = (value: any) => boolean;

export interface AssertionType {
  value: any;
  descriptions: string[];
  invert: boolean;
  to: AssertionType;
  not: () => AssertionType;
  be: {
    a: AssertionLeafType;
    an: AssertionLeafType;
    typeOf: AssertionLeafType;
    instanceOf: AssertionLeafType;
    truthy: AssertionLeafType;
    falsy: AssertionLeafType;
  }
  equal: AssertionLeafType;
};

interface ExpectType extends AssertionType {
  not: AssertionType
}

export function describe(string: string): DescribeType;
export function expect(value: any): ExpectType;

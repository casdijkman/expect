export declare class Assertion {
    #private;
    to: this;
    be: {
        a: (expected: any) => boolean;
        an: (expected: any) => boolean;
        typeOf: (expected: string) => boolean;
        instanceOf: (expected: any) => boolean;
        true: () => boolean;
        truthy: () => boolean;
        false: () => boolean;
        falsy: () => boolean;
    };
    constructor({ value, description }: {
        value: any;
        description?: string;
    });
    invertPredicate(): this;
    equal(expected: any): boolean;
}
export declare function describe(description: string): {
    expect: (value: any) => AssertionProxy;
};
type AssertionProxy = {
    not: Assertion;
} & Assertion;
export declare function expect(value: any, options?: {
    description?: string;
}): AssertionProxy;
export {};

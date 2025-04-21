"use strict";
/*
 * SPDX-FileCopyrightText: 2025 Cas Dijkman
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Assertion_instances, _Assertion_value, _Assertion_descriptions, _Assertion_invert, _Assertion_addDescription, _Assertion_expectToBeA, _Assertion_expectToBeAnInstanceOf, _Assertion_expectToBeATypeOf, _Assertion_expectToBeTrue, _Assertion_expectToBeTruthy, _Assertion_expectToBeFalse, _Assertion_expectToBeFalsy, _Assertion_execute;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Assertion = void 0;
exports.describe = describe;
exports.expect = expect;
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
class Assertion {
    constructor({ value, description }) {
        _Assertion_instances.add(this);
        _Assertion_value.set(this, void 0);
        _Assertion_descriptions.set(this, void 0);
        _Assertion_invert.set(this, false);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        __classPrivateFieldSet(this, _Assertion_value, value, "f");
        __classPrivateFieldSet(this, _Assertion_descriptions, [
            ...(typeof description === 'string' ? [description] : []),
        ], "f");
        this.to = this;
        this.be = {
            a: __classPrivateFieldGet(this, _Assertion_instances, "m", _Assertion_expectToBeA).bind(this),
            an: __classPrivateFieldGet(this, _Assertion_instances, "m", _Assertion_expectToBeA).bind(this),
            typeOf: __classPrivateFieldGet(this, _Assertion_instances, "m", _Assertion_expectToBeATypeOf).bind(this),
            instanceOf: __classPrivateFieldGet(this, _Assertion_instances, "m", _Assertion_expectToBeAnInstanceOf).bind(this),
            true: __classPrivateFieldGet(this, _Assertion_instances, "m", _Assertion_expectToBeTrue).bind(this),
            truthy: __classPrivateFieldGet(this, _Assertion_instances, "m", _Assertion_expectToBeTruthy).bind(this),
            false: __classPrivateFieldGet(this, _Assertion_instances, "m", _Assertion_expectToBeFalse).bind(this),
            falsy: __classPrivateFieldGet(this, _Assertion_instances, "m", _Assertion_expectToBeFalsy).bind(this),
        };
    }
    invertPredicate() {
        __classPrivateFieldSet(this, _Assertion_invert, true, "f");
        return this;
    }
    equal(expected) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        __classPrivateFieldGet(this, _Assertion_instances, "m", _Assertion_addDescription).call(this, { expected });
        if ([expected, __classPrivateFieldGet(this, _Assertion_value, "f")].some((x) => typeof x === 'symbol')) {
            __classPrivateFieldGet(this, _Assertion_descriptions, "f").push('Symbols are always unique');
        }
        return __classPrivateFieldGet(this, _Assertion_instances, "m", _Assertion_execute).call(this, () => __classPrivateFieldGet(this, _Assertion_value, "f") === expected);
    }
}
exports.Assertion = Assertion;
_Assertion_value = new WeakMap(), _Assertion_descriptions = new WeakMap(), _Assertion_invert = new WeakMap(), _Assertion_instances = new WeakSet(), _Assertion_addDescription = function _Assertion_addDescription({ type, expected, got, }) {
    __classPrivateFieldGet(this, _Assertion_descriptions, "f").push('Expected'
        .concat(__classPrivateFieldGet(this, _Assertion_invert, "f") ? ' not' : '')
        .concat(type ? ` ${type}` : '')
        .concat(` ${valueToStringSafe(expected)},`)
        .concat(` got ${valueToStringSafe(got !== null && got !== void 0 ? got : __classPrivateFieldGet(this, _Assertion_value, "f"))}`));
}, _Assertion_expectToBeA = function _Assertion_expectToBeA(expected) {
    return typeof expected === 'string'
        ? __classPrivateFieldGet(this, _Assertion_instances, "m", _Assertion_expectToBeATypeOf).call(this, expected)
        : __classPrivateFieldGet(this, _Assertion_instances, "m", _Assertion_expectToBeAnInstanceOf).call(this, expected);
}, _Assertion_expectToBeAnInstanceOf = function _Assertion_expectToBeAnInstanceOf(expected) {
    return __classPrivateFieldGet(this, _Assertion_instances, "m", _Assertion_execute).call(this, () => {
        __classPrivateFieldGet(this, _Assertion_instances, "m", _Assertion_addDescription).call(this, {
            type: 'instanceof',
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            expected: (expected === null || expected === void 0 ? void 0 : expected.name) || expected,
        });
        return __classPrivateFieldGet(this, _Assertion_value, "f") instanceof (expected);
    });
}, _Assertion_expectToBeATypeOf = function _Assertion_expectToBeATypeOf(expected) {
    return __classPrivateFieldGet(this, _Assertion_instances, "m", _Assertion_execute).call(this, () => {
        __classPrivateFieldGet(this, _Assertion_instances, "m", _Assertion_addDescription).call(this, { type: 'typeof', expected });
        console.assert(validTypeOfs.has(expected), 'unknown typeof value');
        return typeof __classPrivateFieldGet(this, _Assertion_value, "f") === expected;
    });
}, _Assertion_expectToBeTrue = function _Assertion_expectToBeTrue() {
    return __classPrivateFieldGet(this, _Assertion_instances, "m", _Assertion_execute).call(this, () => {
        __classPrivateFieldGet(this, _Assertion_instances, "m", _Assertion_addDescription).call(this, { expected: 'true' });
        return __classPrivateFieldGet(this, _Assertion_value, "f") === true;
    });
}, _Assertion_expectToBeTruthy = function _Assertion_expectToBeTruthy() {
    return __classPrivateFieldGet(this, _Assertion_instances, "m", _Assertion_execute).call(this, () => {
        __classPrivateFieldGet(this, _Assertion_instances, "m", _Assertion_addDescription).call(this, { expected: 'truthy value' });
        return Boolean(__classPrivateFieldGet(this, _Assertion_value, "f"));
    });
}, _Assertion_expectToBeFalse = function _Assertion_expectToBeFalse() {
    return __classPrivateFieldGet(this, _Assertion_instances, "m", _Assertion_execute).call(this, () => {
        __classPrivateFieldGet(this, _Assertion_instances, "m", _Assertion_addDescription).call(this, { expected: 'false' });
        return __classPrivateFieldGet(this, _Assertion_value, "f") === false;
    });
}, _Assertion_expectToBeFalsy = function _Assertion_expectToBeFalsy() {
    return __classPrivateFieldGet(this, _Assertion_instances, "m", _Assertion_execute).call(this, () => {
        __classPrivateFieldGet(this, _Assertion_instances, "m", _Assertion_addDescription).call(this, { expected: 'falsy value' });
        return !__classPrivateFieldGet(this, _Assertion_value, "f");
    });
}, _Assertion_execute = function _Assertion_execute(predicate) {
    const result = Boolean(__classPrivateFieldGet(this, _Assertion_invert, "f") ? !predicate() : predicate());
    const description = __classPrivateFieldGet(this, _Assertion_descriptions, "f").length > 0
        ? __classPrivateFieldGet(this, _Assertion_descriptions, "f").join('. ').concat('.')
        : 'No description';
    console.assert(result, description);
    return result;
};
function valueToStringSafe(value) {
    const stringValue = String(value);
    if (stringValue === '') {
        return '<empty string>';
    }
    console.assert(Boolean(stringValue), 'could not convert value to string', value);
    return stringValue || 'unknown';
}
function describe(description) {
    return {
        expect: (value) => expect(value, { description }),
    };
}
function expect(value, options) {
    const assertionInstance = new Assertion({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        value,
        description: options === null || options === void 0 ? void 0 : options.description,
    });
    const proxyHandler = {
        get(target, property, receiver) {
            const assertionValue = Reflect.get(target, property, receiver);
            if (property === 'not') {
                return target.invertPredicate();
            }
            return assertionValue;
        },
    };
    return new Proxy(assertionInstance, proxyHandler);
}

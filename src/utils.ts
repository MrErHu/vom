import { isNumber, isString, isArray, indexOf, isObject } from 'lodash';

export {
    isEqual,
    difference,
    each,
    some,
    filter,
    map,
    isNil,
    findIndex,
    flatten
} from 'lodash';

export {
    isNumber,
    isString,
    isArray
};

export const isNotEmptyString = function (str: any): boolean {
    return isString(str) && str !== '';
};

export const isNotEmptyArray = function (array: any) {
    return isArray(array) && array.length > 0;
};

export const isEmptyArray = function (array: any): boolean {
    return isArray(array) && array.length <= 0;
};

export const contains = function (array: any, val: any) {
    return indexOf(array, val) >= 0;
};

export const isKey = function (key: any): boolean {
    return isNotEmptyString(key) || isNumber(key);
};

export const isNotNull = function (val: any): boolean {
    return !(typeof val === 'undefined' || val === null);
};

export const transformStyleToString = function (style) {
    // 若是文本类型则直接返回
    if (isString(style)) {
        return style;
    }
    // 若是对象类型则转为字符串
    if (isObject(style)) {
        return Object.keys(style).reduce((acc, key) => {
            let cssKey = key.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);
            return acc + `${cssKey}: ${style[key]};`;
        }, '');
    }
    return '';
};

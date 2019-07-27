import VNode, { isVNode } from './VNode';
import Patch from './Patch';
import { OPERATOR_TYPE, PROP_TYPE } from './enums';
import { VNodeChildType, PropsType } from '../typings';
import {
    contains,
    difference,
    each,
    findIndex,
    isEmptyArray,
    isEqual,
    isKey,
    isNotNull,
    isNotEmptyArray,
    isString,
    map
} from './utils';

function getChildrenKeyMap(children: VNodeChildType[]) {
    let map = new Map();
    each(children, child => {
        if (isVNode(child) && isKey(child.key)) {
            map.set(child.key, child);
        }
    });
    return map;
}

function getChildIndexByKey(children: VNodeChildType[], key) {
    return findIndex(children, child => (isVNode(child) && child.key === key));
}

function diffProps(preProps: PropsType, nextProps: PropsType) {
    let prePropKeys = Object.keys(preProps);
    let nextPropKeys = Object.keys(nextProps);
    let addPropKeys = difference(nextPropKeys, prePropKeys);
    let deletePropsKey = difference(prePropKeys, nextPropKeys);
    let modifyPropsKey = prePropKeys.filter(key => {
        if (contains(deletePropsKey, key)) {
            return false;
        }
        return !isEqual(preProps[key], nextProps[key]);
    });

    const addPropResult = addPropKeys.map(key => ({
        type: PROP_TYPE.ADD,
        key: key,
        value: nextProps[key]
    }));

    const deletePropResult = deletePropsKey.map(key => ({
        type: PROP_TYPE.DELETE,
        key: key
    }));

    const modifyPropResult = modifyPropsKey.map(key => ({
        type: PROP_TYPE.MODIFY,
        key: key,
        value: nextProps[key]
    }));

    return [...addPropResult, ...deletePropResult, ...modifyPropResult];
}

function diff(preNode: VNode, nextNode: VNode | null) {

    const patch = new Patch();

    // 若节点类型不一致或者之前的元素为空，则直接重新创建该节点及其子节点
    if (nextNode === null || preNode.tagName !== nextNode.tagName) {
        patch.addType(OPERATOR_TYPE.INSERT_MARKUP);
        patch.node = nextNode;
        return patch;
    }

    // 前后两个虚拟节点类型一致，则需要比较属性是否一致
    const propsCompareResult = diffProps(preNode.props, nextNode.props);

    if (isNotEmptyArray(propsCompareResult)) {
        patch.addType(OPERATOR_TYPE.PROPS_CHANGE);
        patch.addModifyProps(propsCompareResult);
    }

    // 如果上一个子元素不为空，且下一个子元素全为空，则需要清除所有子元素
    if (isEmptyArray(nextNode.children) && isNotEmptyArray(preNode.children)) {
        patch.addChildPatch(map(preNode.children, () => (new Patch(OPERATOR_TYPE.REMOVE_NODE))));
        return patch;
    }

    const preChildrenKeyMap = getChildrenKeyMap(preNode.children);

    // 遍历处理子元素
    each(nextNode.children, (child, index) => {
        const nextChild = child;
        const preChild = isNotNull(preNode.children[index]) ? preNode.children[index] : null;

        // 如果当前子节点是字符串类型
        if (isString(nextChild)) {
            if (isString(preChild)) {
                if (nextChild === preChild) {
                    return patch.addChildPatch(new Patch());
                } else {
                    return patch.addChildPatch((new Patch(OPERATOR_TYPE.TEXT_CHANGE).setModifyString(nextChild)));
                }
            } else {
                return patch.addChildPatch((new Patch(OPERATOR_TYPE.INSERT_MARKUP)).setNode(nextChild));
            }
        }

        // 若当前的子节点中存在key属性
        if (isVNode(nextChild) && isKey(nextChild.key)) {
            if (preChildrenKeyMap.has(nextChild.key)) {
                // 如果上一个同层虚拟DOM节点中存在步骤存在key
                const preSameKeyChild = preChildrenKeyMap.get(nextChild.key);
                // 如果前后两个元素的key值和元素类型不相等，则直接创建新的元素
                if (preSameKeyChild.tagName !== nextChild.tagName) {
                    return patch.addChildPatch((new Patch(OPERATOR_TYPE.INSERT_MARKUP).setNode(nextChild)));
                } else {
                    // 如果前后两个元素的key值和元素类型相等
                    const sameKeyIndex = getChildIndexByKey(preNode.children, nextChild.key);
                    const childPatch = diff(preSameKeyChild, nextChild);
                    if (sameKeyIndex !== index) {
                        childPatch.addType(OPERATOR_TYPE.MOVE_EXISTING);
                        childPatch.removeIndex = sameKeyIndex;
                    }
                    return patch.addChildPatch(childPatch);
                }
            }
        }

        // 若当前的子节点中不存在key属性
        if (isVNode(nextChild) && !isKey(nextChild.key)) {
            // 若前后相同位置的节点是 非VNode(字符串) 或者 存在key值( nextChild不含有key) 或者是 节点类型不同
            // 则直接创建新节点
            if (!isVNode(preChild) || isKey(preChild.key) || preChild.tagName !== nextChild.tagName) {
                return patch.addChildPatch((new Patch(OPERATOR_TYPE.INSERT_MARKUP)).setNode(nextChild));
            } else {
                return patch.addChildPatch(diff(preChild, nextChild));
            }
        }

        // 若直到当前步骤仍未处理，则直接创建
        return patch.addChildPatch((new Patch(OPERATOR_TYPE.INSERT_MARKUP)).setNode(nextChild));
    });

    // 如果存在nextChildren个数少于preChildren，则需要补充删除节点
    if (preNode.children.length > nextNode.children.length) {
        patch.addChildPatch(Array.from({ length: preNode.children.length - nextNode.children.length }, () => new Patch(OPERATOR_TYPE.REMOVE_NODE)));
    }

    return patch;
}

export default diff;

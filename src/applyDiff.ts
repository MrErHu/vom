import Patch from './Patch';
import { each, transformStyleToString, map, contains } from './utils';
import { renderDOM } from './render';
import { OPERATOR_TYPE, PROP_TYPE } from './enums';

function isHTMLElement(dom): dom is HTMLElement {
    return dom instanceof HTMLElement;
}

function isText(dom): dom is Text {
    return dom instanceof Text;
}

function applyChildDiff(actualDOM: HTMLElement, patch: Patch) {

    const childrenDOM = map(actualDOM.childNodes, child => child);
    const childrenPatch = patch.children;

    for (let index = 0; index < actualDOM.childNodes.length; index++) {
        const childPatch = childrenPatch[index];
        let childDOM = childrenDOM[index];
        if (contains(childPatch.types, OPERATOR_TYPE.MOVE_EXISTING)) {
            const insertDOM = childrenDOM[childPatch.removeIndex];
            actualDOM.insertBefore(insertDOM, childDOM);
            childDOM = insertDOM;
        }
        applyDiff(childDOM, childPatch, actualDOM);
    }
}

function applyDiff(actualDOM: HTMLElement | Text, patch: Patch, parentDOM: HTMLElement) {

    if (contains(patch.types, OPERATOR_TYPE.INSERT_MARKUP)) {
        const replaceDOM = renderDOM(patch.node!);
        parentDOM.replaceChild(replaceDOM, actualDOM);
        return replaceDOM;
    }

    if (contains(patch.types, OPERATOR_TYPE.REMOVE_NODE)) {
        parentDOM.removeChild(actualDOM);
        return null;
    }

    if (contains(patch.types, OPERATOR_TYPE.TEXT_CHANGE)) {
        if (!isText(actualDOM)) {
            // 理论上Patch不应该出现这个情况
            const textDOM = document.createTextNode(patch.modifyString);
            parentDOM.replaceChild(textDOM, actualDOM);
            return textDOM;
        } else {
            actualDOM.nodeValue = patch.modifyString;
            return actualDOM;
        }
    }

    if (contains(patch.types, OPERATOR_TYPE.TEXT_CHANGE)) {
        each(patch.modifyProps, function (modifyProp) {
            if (!isHTMLElement(actualDOM)) {
                // 理论上Patch不应该出现这个情况
                return null;
            }
            let key = modifyProp.key;
            let value = modifyProp.value;
            switch (modifyProp.type) {
                case PROP_TYPE.ADD:
                case PROP_TYPE.MODIFY:
                    if (key === 'style') {
                        value = transformStyleToString(value);
                    }
                    actualDOM.setAttribute(key, value);
                    break;
                case PROP_TYPE.DELETE:
                    actualDOM.removeAttribute(key);
                    break;
            }
        });
    }

    if (isHTMLElement(actualDOM)) {
        applyChildDiff(actualDOM, patch);
    }

    return actualDOM;
}

export default function (actualDOM: HTMLElement | Text, patch: Patch) {

    if (!(actualDOM.parentNode instanceof HTMLElement)) {
        throw Error('DOM元素未渲染');
    }

    return applyDiff(actualDOM, patch, actualDOM.parentNode);
}

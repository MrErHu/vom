import { transformStyleToString } from './utils';
import { VNodeChildType } from '../typings';
import VNode, { isVNode } from './VNode';

/**
 * 将virtual-dom渲染成真实dom
 */
function render(vnode: VNode, root: HTMLElement) {
    const dom = renderDOM(vnode);
    root.appendChild(dom);
    return dom;
}

export const renderDOM = function (vnode: VNodeChildType) {

    if (isVNode(vnode)) {
        let node = document.createElement(vnode.tagName);
        // 设置元素属性
        for (const prop of Object.keys(vnode.props)) {
            let value = vnode.props[prop];
            if (prop === 'style') {
                value = transformStyleToString(value);
            }
            node.setAttribute(prop, value);
        }

        for (const child of vnode.children) {
            node.appendChild(renderDOM(child));
        }

        return node;
    }

    if (typeof vnode === 'number') {
        return document.createTextNode(String(vnode));
    }
    return document.createTextNode(vnode);

};

export default render;

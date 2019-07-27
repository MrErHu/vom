import { TagNameType , PropsType } from './typings';
import VNode from './src/VNode';

export declare module Vom {
    export function createElement(tagName: TagNameType, props: PropsType, ...children: any[]);
    export function render(vnode: VNode, root: HTMLElement): void;
    export function diff();
    export function applyDiff();
}

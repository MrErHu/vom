import { TagNameType, PropsType, KeyType } from '../typings';

class VNode {

    public tagName: TagNameType;

    public props: PropsType;

    public key? : KeyType;

    public children: (VNode | string)[];

    public constructor(tagName: TagNameType) {
        this.tagName = tagName;
        this.key = null;
        this.children = [];
        this.props = {};
    }
}

export function isVNode(node: any): node is VNode {
    return node instanceof VNode;
}

export default VNode;

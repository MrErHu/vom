import { OPERATOR_TYPE } from './enums';
import VNode from './VNode';
import { ModifyProps } from '../typings';

class Patch {
    // 节点变化类型
    public types: OPERATOR_TYPE[];
    // 子元素
    public children: Patch[];
    // 存储新的节点
    public node: VNode | string | null;
    // 属性改变
    public modifyProps: ModifyProps[];
    // 文本改变
    public modifyString: string;
    // 节点移动
    public removeIndex: number;

    public constructor(types?: (OPERATOR_TYPE | OPERATOR_TYPE[])) {
        this.types = [];
        this.children = [];
        this.node = null;
        this.modifyProps = [];
        this.modifyString = '';
        this.removeIndex = 0;

        if (types) {
            types instanceof Array ? this.types.push(...types) : this.types.push(types);
        }
    }

    public addType(type) {
        this.types.push(type);
        return this;
    }

    public addModifyProps(modifyProps: ModifyProps[] | ModifyProps) {
        if (modifyProps instanceof Array) {
            this.modifyProps.push(...modifyProps);
        } else {
            this.modifyProps.push(modifyProps);
        }
        return this;
    }

    public addChildPatch(patch: Patch | Patch[]) {
        if (isPatch(patch)) {
            this.children.push(patch);
        } else {
            this.children.push(...patch);
        }
        return this;
    }

    public setNode(node: VNode) {
        this.node = node;
        return this;
    }

    public setModifyString(modifyString: string) {
        this.modifyString = modifyString;
        return this;
    }

    public setRemoveIndex(removeIndex: number) {
        this.removeIndex = removeIndex;
        return this;
    }
}

export function isPatch(patch: any): patch is Patch {
    return patch instanceof Patch;
}

export default Patch;

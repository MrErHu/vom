import VNode from '../src/VNode';
import { PROP_TYPE } from '../src/enums';

export declare type KeyType = string | number | null;

export declare type TagNameType = string;

export declare interface PropsType {
    key?: string | number;
    [prop: string]: any;
}

export declare interface ModifyProps {
    type: PROP_TYPE;
    key?: string;
    value?: any;
}

// VNode子节点类型
export declare type VNodeChildType = VNode | string | number;

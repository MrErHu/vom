import VNode from './VNode';
import { TagNameType, PropsType, KeyType } from '../typings';
import { flatten, isKey, isNotNull } from './utils';

/**
 * 用来将jsx转化成v-dom
 */
export default function createElement(tagName: TagNameType, props: PropsType, ...children: any[]) {

    let key: KeyType = null;

    if (isNotNull(props)) {

        if (isKey(props.key)) {
            key = props.key!;
            delete props.key;
        }

        if (isNotNull(props.children)) {
            children.push(props.children);
            delete props.children;
        }
    }

    const node = new VNode(tagName);
    node.children = flatten(children);
    node.key = key;
    node.props = isNotNull(props) ? props : {};
    return node;
}

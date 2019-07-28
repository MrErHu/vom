import Vom from '../index';

import VNode from '../src/VNode';

describe('createElement', () => {

    test('普通情况', () => {
        let dom = (<div id="box">Hello World!</div>);
        let vnode = new VNode('div');
        vnode.key = null;
        vnode.props = {
            id: 'box'
        };
        vnode.children = ['Hello World!'];
        expect(dom).toEqual(vnode);
    });

    test('多个子元素', () => {
        const dom = (
            <ul>
                <li></li>
                <li></li>
            </ul>
        );
        const vnode = new VNode('ul');
        vnode.children = [new VNode('li'), new VNode('li')];
        expect(dom).toEqual(vnode);
    });

    test('多个子元素-数组形式', () => {
        const dom = (
            <ul>
                {
                    Array.from({ length: 2 }).map((val, index) => {
                        return <li key={index}></li>;
                    })
                }
            </ul>
        );
        const ul = new VNode('ul');
        ul.children = Array.from({ length: 2 }).map((val, index) => {
            const li = new VNode('li');
            li.key = index;
            return li;
        });
        expect(dom).toEqual(ul);
    });
});

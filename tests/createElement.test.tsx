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
                {[
                    <li key={1}></li>,
                    <li key={2}></li>
                ]}
            </ul>
        );
        const ul = new VNode('ul');
        const li1 = new VNode('li');
        li1.key = 1;
        let li2 = new VNode('li');
        li2.key = 2;
        ul.children = [li1, li2];
        expect(dom).toEqual(ul);
    });
});

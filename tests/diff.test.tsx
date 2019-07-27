import Vom from '../index';
import Patch from '../src/Patch';
import { OPERATOR_TYPE, PROP_TYPE } from '../src/enums';


describe('diff', () => {

    test('root节点类型不一致', () => {
        const preDOM = (<div id="box">Hello World!</div>);
        const nextDOM = (<span id="box">Hello World!</span>);

        const patch = new Patch(OPERATOR_TYPE.INSERT_MARKUP);
        patch.node = nextDOM;
        expect(Vom.diff(preDOM, nextDOM)).toEqual(patch);
    });

    test('root属性不一致', () => {
        const preDOM = (<div id="box" name="test">Hello World!</div>);
        const nextDOM = (<div id="box1" class="button">Hello World!</div>);
        const patch = Vom.diff(preDOM, nextDOM);


        expect(patch.types).toEqual([OPERATOR_TYPE.PROPS_CHANGE]);
        expect(patch.modifyProps.length).toBe(3);
        expect(patch.modifyProps).toContainEqual({
            type: PROP_TYPE.DELETE,
            key: 'name'
        });
        expect(patch.modifyProps).toContainEqual({
            type: PROP_TYPE.ADD,
            key: 'class',
            value: 'button'
        });
        expect(patch.modifyProps).toContainEqual({
            type: PROP_TYPE.MODIFY,
            key: 'id',
            value: 'box1'
        });
    });

    test('不存在key子节点全部删除', () => {
        const preDOM = (
            <ul>
                <li>li1</li>
                <li>li2</li>
                <li>li3</li>
            </ul>
        );

        const nextDOM = (
            <ul></ul>
        );

        const patch = new Patch();
        patch.addChildPatch([
            new Patch(OPERATOR_TYPE.REMOVE_NODE),
            new Patch(OPERATOR_TYPE.REMOVE_NODE),
            new Patch(OPERATOR_TYPE.REMOVE_NODE)
        ]);

        expect(Vom.diff(preDOM, nextDOM)).toEqual(patch);
    });

    test('存在key子节点全部删除', () => {
        const preDOM = (
            <ul>
                <li key={1}>li1</li>
                <li key={2}>li2</li>
                <li key={3}>li3</li>
            </ul>
        );

        const nextDOM = (
            <ul></ul>
        );

        const patch = new Patch();
        patch.addChildPatch([
            new Patch(OPERATOR_TYPE.REMOVE_NODE),
            new Patch(OPERATOR_TYPE.REMOVE_NODE),
            new Patch(OPERATOR_TYPE.REMOVE_NODE)
        ]);

        expect(Vom.diff(preDOM, nextDOM)).toEqual(patch);
    });

    test('深层次存在key子节点全部删除', () => {
        const preDOM = (
            <div>
                <ul>
                    <li key={1}>li1</li>
                    <li key={2}>li2</li>
                    <li key={3}>li3</li>
                </ul>
            </div>
        );

        const nextDOM = (
            <div>
                <ul></ul>
            </div>
        );

        const ulPatch = new Patch();
        ulPatch.addChildPatch([
            new Patch(OPERATOR_TYPE.REMOVE_NODE),
            new Patch(OPERATOR_TYPE.REMOVE_NODE),
            new Patch(OPERATOR_TYPE.REMOVE_NODE)
        ]);

        const divPatch = new Patch();
        divPatch.addChildPatch(ulPatch);

        expect(Vom.diff(preDOM, nextDOM)).toEqual(divPatch);
    });
});

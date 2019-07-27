import Vom from '../index';
import Patch from '../src/Patch';
import { OPERATOR_TYPE } from '../src/enums';


describe('diff-key值相关', () => {

    test('不存在key新增子节点-顺序变化', () => {
        const preDOM = (
            <ul>
                <li key={1}></li>
                <li key={2}></li>
                <li key={3}></li>
            </ul>
        );

        const nextDOM = (
            <ul>
                <li key={3}></li>
                <li key={1}></li>
                <li key={2}></li>
            </ul>
        );

        const patch = new Patch();

        const li1Patch = new Patch(OPERATOR_TYPE.MOVE_EXISTING);
        li1Patch.removeIndex = 2;

        const li2Patch = new Patch(OPERATOR_TYPE.MOVE_EXISTING);
        li2Patch.removeIndex = 0;

        const li3Patch = new Patch(OPERATOR_TYPE.MOVE_EXISTING);
        li3Patch.removeIndex = 1;

        patch.addChildPatch([li1Patch, li2Patch, li3Patch]);

        expect(Vom.diff(preDOM, nextDOM)).toEqual(patch);
    });

    test('存在key新增子节点-顺序变化', () => {
        const preDOM = (
            <ul>
                <li key={1}></li>
                <li key={2}></li>
                <li key={3}></li>
            </ul>
        );

        const nextDOM = (
            <ul>
                <li key={4}></li>
                <li key={3}></li>
                <li key={1}></li>
                <li key={2}></li>
            </ul>
        );

        const patch = new Patch();

        const li4Patch = new Patch(OPERATOR_TYPE.INSERT_MARKUP);
        li4Patch.node = (<li key={4}></li>);

        const li1Patch = new Patch(OPERATOR_TYPE.MOVE_EXISTING);
        li1Patch.removeIndex = 2;

        const li2Patch = new Patch(OPERATOR_TYPE.MOVE_EXISTING);
        li2Patch.removeIndex = 0;

        const li3Patch = new Patch(OPERATOR_TYPE.MOVE_EXISTING);
        li3Patch.removeIndex = 1;

        patch.addChildPatch([li4Patch, li1Patch, li2Patch, li3Patch]);

        expect(Vom.diff(preDOM, nextDOM)).toEqual(patch);
    });

    test('存在key新增子删除-顺序变化', () => {
        const preDOM = (
            <ul>
                <li key={1}></li>
                <li key={2}></li>
                <li key={3}></li>
            </ul>
        );

        const nextDOM = (
            <ul>
                <li key={2}></li>
                <li key={1}></li>
            </ul>
        );

        const patch = new Patch();

        const li2Patch = new Patch(OPERATOR_TYPE.MOVE_EXISTING);
        li2Patch.removeIndex = 1;

        const li1Patch = new Patch(OPERATOR_TYPE.MOVE_EXISTING);
        li1Patch.removeIndex = 0;

        patch.addChildPatch([li2Patch, li1Patch, new Patch(OPERATOR_TYPE.REMOVE_NODE)]);

        expect(Vom.diff(preDOM, nextDOM)).toEqual(patch);
    });
});

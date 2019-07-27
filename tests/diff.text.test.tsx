import Vom from '../index';
import Patch from '../src/Patch';
import { OPERATOR_TYPE } from '../src/enums';

describe('diff-text', () => {

    test('span文本发生改变', () => {
        const preDOM = (<span>Hello!</span>);
        const nextDOM = (<span>Hello World!</span>);

        const patch = new Patch(OPERATOR_TYPE.TEXT_CHANGE);
        patch.modifyString = 'Hello World!';
        const spanPatch = new Patch();
        spanPatch.addChildPatch(patch);
        expect(Vom.diff(preDOM, nextDOM)).toEqual(spanPatch);
    });

    test('span文本从无到有', () => {
        const preDOM = (<span></span>);
        const nextDOM = (<span>Hello World!</span>);

        const patch = new Patch(OPERATOR_TYPE.INSERT_MARKUP);
        patch.node = 'Hello World!';
        const spanPatch = new Patch();
        spanPatch.addChildPatch(patch);
        expect(Vom.diff(preDOM, nextDOM)).toEqual(spanPatch);
    });

    test('span文本从有到无', () => {
        const preDOM = (<span>Hello World!</span>);
        const nextDOM = (<span></span>);

        const patch = new Patch(OPERATOR_TYPE.REMOVE_NODE);
        const spanPatch = new Patch();
        spanPatch.addChildPatch(patch);
        expect(Vom.diff(preDOM, nextDOM)).toEqual(spanPatch);
    });
});

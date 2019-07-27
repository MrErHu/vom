import Vom from '../index';

function getRandomArray(length) {
    return Array.from(new Array(length).keys()).sort(() => Math.random() - 0.5);
}

function getJSX() {
    return (
        <div>
            <p>这是一个由Vom渲染的界面</p>
            <p>
                <span style={{ color: 'blue' }}>现在时间: { Date().toString() }</span>
            </p>
            <p>下面是一个顺序动态变化的有序列表：</p>
            <ul>
                {
                    getRandomArray(100).map((key) => {
                        return <li key={key}>列表序号: {key} </li>;
                    })
                }
            </ul>
        </div>
    );
}


let preNode = getJSX();
let actualDom = Vom.render(preNode, document.body);

setInterval(() => {
    const nextNode = getJSX();
    const patch = Vom.diff(preNode, nextNode);
    actualDom = Vom.applyDiff(actualDom, patch)!;
}, 1000);


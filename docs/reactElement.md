### [ReactElement 对象](https://github.com/facebook/react/blob/v17.0.2/packages/react/src/ReactElement.js#L126-L146)

> 其 type 定义在[`shared`包中](https://github.com/facebook/react/blob/v17.0.2/packages/shared/ReactElementType.js#L15).
所有采用`jsx`语法书写的节点, 都会被编译器转换, 最终会以`React.createElement(...)`的方式, 创建出来一个与之对应的`ReactElement`对象.

`ReactElement`对象的数据结构如下:

```ts
export type ReactElement = {|
  // 用于辨别ReactElement对象
  $$typeof: any,
  // 内部属性
  type: any, // 表明其种类
  key: any,
  ref: any,
  props: any,
  // ReactFiber 记录创建本对象的Fiber节点, 还未与Fiber树关联之前, 该属性为null
  _owner: any,
  // __DEV__ dev环境下的一些额外信息, 如文件路径, 文件名, 行列信息等
  _store: {validated: boolean, ...},
  _self: React$Element<any>,
  _shadowChildren: any,
  _source: Source,
|};
```

需要特别注意 2 个属性:

1. `key`属性在`reconciler`阶段会用到, 目前只需要知道所有的`ReactElement`对象都有 key 属性(且[其默认值是 null](https://github.com/facebook/react/blob/v17.0.2/packages/react/src/ReactElement.js#L348-L357), 这点十分重要, 在 diff 算法中会使用到).

2. `type`属性决定了节点的种类:

- 它的值可以是字符串(代表`div,span`等 dom 节点), 函数(代表`function, class`等节点), 或者 react 内部定义的节点类型(`portal,context,fragment`等)
- 在`reconciler`阶段, 会根据 type 执行不同的逻辑(在 fiber 构建阶段详细解读).
  - 如 type 是一个字符串类型, 则直接使用.
  - 如 type 是一个`ReactComponent`类型, 则会调用其 render 方法获取子节点.
  - 如 type 是一个`function`类型,则会调用该方法获取子节点
  - ...

在`v17.0.2`中, [定义了 20 种](https://github.com/facebook/react/blob/v17.0.2/packages/shared/ReactSymbols.js#L16-L37)内部节点类型. 根据运行时环境不同, 分别采用 16 进制的字面量和`Symbol`进行表示.

### [ReactComponent](https://github.com/facebook/react/blob/v17.0.2/packages/react/src/ReactBaseClasses.js#L20-L30)对象

对于`ReactElement`来讲, `ReactComponent`仅仅是诸多`type`类型中的一种.

对于开发者来讲, `ReactComponent`使用非常高频(在状态组件章节中详细解读), 在本节只是先证明它只是一种特殊的`ReactElement`.

这里用一个简单的示例, 通过查看编译后的代码来说明

```js
class App extends React.Component {
  render() {
    return (
      <div className="app">
        <header>header</header>
        <Content />
        <footer>footer</footer>
      </div>
    );
  }
}
class Content extends React.Component {
  render() {
    return (
      <React.Fragment>
        <p>1</p>
        <p>2</p>
        <p>3</p>
      </React.Fragment>
    );
  }
}
export default App;
```

编译之后的代码(此处只编译了 jsx 语法, 并没有将 class 语法编译成 es5 中的 function), 可以更直观的看出调用逻辑.

`createElement`函数的第一个参数将作为创建`ReactElement`的`type`. 可以看到`Content`这个变量被编译器命名为`App_Content`, 并作为第一个参数(引用传递), 传入了`createElement`.

```js
class App_App extends react_default.a.Component {
  render() {
    return /*#__PURE__*/ react_default.a.createElement(
      'div',
      {
        className: 'app',
      } /*#__PURE__*/,
      react_default.a.createElement('header', null, 'header') /*#__PURE__*/,
      // 此处直接将Content传入, 是一个指针传递
      react_default.a.createElement(App_Content, null) /*#__PURE__*/,
      react_default.a.createElement('footer', null, 'footer'),
    );
  }
}
class App_Content extends react_default.a.Component {
  render() {
    return /*#__PURE__*/ react_default.a.createElement(
      react_default.a.Fragment,
      null /*#__PURE__*/,
      react_default.a.createElement('p', null, '1'),
      /*#__PURE__*/
      react_default.a.createElement('p', null, '2'),
      /*#__PURE__*/
      react_default.a.createElement('p', null, '3'),
    );
  }
}
```

上述示例演示了`ReactComponent`是诸多`ReactElement`种类中的一种情况, 但是由于`ReactComponent`是 class 类型, 自有它的特殊性(可[对照源码](https://github.com/facebook/react/blob/v17.0.2/packages/react/src/ReactBaseClasses.js), 更容易理解).

1. `ReactComponent`是 class 类型, 继承父类`Component`, 拥有特殊的方法(`setState`,`forceUpdate`)和特殊的属性(`context`,`updater`等).
2. 在`reconciler`阶段, 会依据`ReactElement`对象的特征, 生成对应的 fiber 节点. 当识别到`ReactElement`对象是 class 类型的时候, 会触发`ReactComponent`对象的生命周期, 并调用其 `render`方法, 生成`ReactElement`子节点.

### 其他`ReactElement`

上文介绍了第一种特殊的`ReactElement`(`class`类型的组件), 除此之外`function`类型的组件也需要深入了解, 因为`Hook`只能在`function`类型的组件中使用.

如果在`function`类型的组件中没有使用`Hook`(如: `useState`, `useEffect`等), 在`reconciler`阶段所有有关`Hook`的处理都会略过, 最后调用该`function`拿到子节点`ReactElement`.

如果使用了`Hook`, 逻辑就相对复杂, 涉及到`Hook`创建和状态保存(有关 Hook 的原理部分, 在 Hook 原理章节中详细解读). 此处只需要了解`function`类型的组件和`class`类型的组件一样, 是诸多`ReactElement`形式中的一种.

### `ReactElement`内存结构

通过前文对`ReactElement`的介绍, 可以比较容易的画出`<App/>`这个`ReactElement`对象在内存中的结构(`reconciler`阶段完成之后才会形成完整的结构).

<img src="./img/reactelement-tree.png" width="600">

注意:

- `class`和`function`类型的组件,其子节点是在 render 之后(`reconciler`阶段)才生成的. 此处只是单独表示`ReactElement`的数据结构.
- 父级对象和子级对象之间是通过`props.children`属性进行关联的(与 fiber 树不同).
- `ReactElement`虽然不能算是一个严格的树, 也不能算是一个严格的链表. 它的生成过程是自顶向下的, 是所有组件节点的总和.
- `ReactElement`树(暂且用树来表述)和`fiber`树是以`props.children`为单位`先后交替`生成的(在 fiber 树构建章节详细解读), 当`ReactElement`树构造完毕, fiber 树也随后构造完毕.
- `reconciler`阶段会根据`ReactElement`的类型生成对应的`fiber`节点(不是一一对应, 比如`Fragment`类型的组件在生成`fiber`节点的时候会略过).
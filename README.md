<!--
 * @Author: cc
 * @LastEditTime: 2023-07-27 16:37:40
-->

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


### Fiber对象

```javaScript
  // 一个Fiber对象代表一个即将渲染或者已经渲染的组件(ReactElement), 一个组件可能对应两个fiber(current和WorkInProgress)
  // 单个属性的解释在后文(在注释中无法添加超链接)
  export type Fiber = {|
    tag: WorkTag,
    key: null | string,
    elementType: any,
    type: any,
    stateNode: any,
    return: Fiber | null,
    child: Fiber | null,
    sibling: Fiber | null,
    index: number,
    ref:
      | null
      | (((handle: mixed) => void) & { _stringRef: ?string, ... })
      | RefObject,
    pendingProps: any, // 从`ReactElement`对象传入的 props. 用于和`fiber.memoizedProps`比较可以得出属性是否变动
    memoizedProps: any, // 上一次生成子节点时用到的属性, 生成子节点之后保持在内存中
    updateQueue: mixed, // 存储state更新的队列, 当前节点的state改动之后, 都会创建一个update对象添加到这个队列中.
    memoizedState: any, // 用于输出的state, 最终渲染所使用的state
    dependencies: Dependencies | null, // 该fiber节点所依赖的(contexts, events)等
    mode: TypeOfMode, // 二进制位Bitfield,继承至父节点,影响本fiber节点及其子树中所有节点. 与react应用的运行模式有关(有ConcurrentMode, BlockingMode, NoMode等选项).

    // Effect 副作用相关
    flags: Flags, // 标志位
    subtreeFlags: Flags, //替代16.x版本中的 firstEffect, nextEffect. 当设置了 enableNewReconciler=true才会启用
    deletions: Array<Fiber> | null, // 存储将要被删除的子节点. 当设置了 enableNewReconciler=true才会启用

    nextEffect: Fiber | null, // 单向链表, 指向下一个有副作用的fiber节点
    firstEffect: Fiber | null, // 指向副作用链表中的第一个fiber节点
    lastEffect: Fiber | null, // 指向副作用链表中的最后一个fiber节点

    // 优先级相关
    lanes: Lanes, // 本fiber节点的优先级
    childLanes: Lanes, // 子节点的优先级
    alternate: Fiber | null, // 指向内存中的另一个fiber, 每个被更新过fiber节点在内存中都是成对出现(current和workInProgress)

    // 性能统计相关(开启enableProfilerTimer后才会统计)
    // react-dev-tool会根据这些时间统计来评估性能
    actualDuration?: number, // 本次更新过程, 本节点以及子树所消耗的总时间
    actualStartTime?: number, // 标记本fiber节点开始构建的时间
    selfBaseDuration?: number, // 用于最近一次生成本fiber节点所消耗的时间
    treeBaseDuration?: number, // 生成子树所消耗的时间的总和
  |};
```

属性解释:

- `fiber.tag`: 表示 fiber 类型, 根据`ReactElement`组件的 type 进行生成, 在 react 内部共定义了[25 种 tag](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactWorkTags.js#L10-L35).
- `fiber.key`: 和`ReactElement`组件的 key 一致.
- `fiber.elementType`: 一般来讲和`ReactElement`组件的 type 一致
- `fiber.type`: 一般来讲和`fiber.elementType`一致. 一些特殊情形下, 比如在开发环境下为了兼容热更新(`HotReloading`), 会对`function, class, ForwardRef`类型的`ReactElement`做一定的处理, 这种情况会区别于`fiber.elementType`, 具体赋值关系可以查看[源文件](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactFiber.old.js#L571-L574).
- `fiber.stateNode`: 与`fiber`关联的局部状态节点(比如: `HostComponent`类型指向与`fiber`节点对应的 dom 节点; 根节点`fiber.stateNode`指向的是`FiberRoot`; class 类型节点其`stateNode`指向的是 class 实例).
- `fiber.return`: 指向父节点.
- `fiber.child`: 指向第一个子节点.
- `fiber.sibling`: 指向下一个兄弟节点.
- `fiber.index`: fiber 在兄弟节点中的索引, 如果是单节点默认为 0.
- `fiber.ref`: 指向在`ReactElement`组件上设置的 ref(`string`类型的`ref`除外, 这种类型的`ref`已经不推荐使用, `reconciler`阶段会`将string`类型的`ref`转换成一个`function`类型).
- `fiber.pendingProps`: 输入属性, 从`ReactElement`对象传入的 props. 用于和`fiber.memoizedProps`比较可以得出属性是否变动.
- `fiber.memoizedProps`: 上一次生成子节点时用到的属性, 生成子节点之后保持在内存中. 向下生成子节点之前叫做`pendingProps`, 生成子节点之后会把`pendingProps`赋值给`memoizedProps`用于下一次比较.`pendingProps`和`memoizedProps`比较可以得出属性是否变动.
- `fiber.updateQueue`: 存储`update更新对象`的队列, 每一次发起更新, 都需要在该队列上创建一个`update对象`.
- `fiber.memoizedState`: 上一次生成子节点之后保持在内存中的局部状态.
- `fiber.dependencies`: 该 fiber 节点所依赖的(contexts, events)等, 在`context`机制章节详细说明.
- `fiber.mode`: 二进制位 Bitfield,继承至父节点,影响本 fiber 节点及其子树中所有节点. 与 react 应用的运行模式有关(有 ConcurrentMode, BlockingMode, NoMode 等选项).
- `fiber.flags`: 标志位, 副作用标记(在 16.x 版本中叫做`effectTag`, 相应[pr](https://github.com/facebook/react/pull/19755)), 在[`ReactFiberFlags.js`](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactFiberFlags.js#L10-L41)中定义了所有的标志位. `reconciler`阶段会将所有拥有`flags`标记的节点添加到副作用链表中, 等待 commit 阶段的处理.
- `fiber.subtreeFlags`: 替代 16.x 版本中的 firstEffect, nextEffect. 默认未开启, 当设置了[enableNewReconciler=true](https://github.com/facebook/react/blob/v17.0.2/packages/shared/ReactFeatureFlags.js#L93) 才会启用, 本系列只跟踪稳定版的代码, 未来版本不会深入解读, [使用示例见源码](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactFiberCompleteWork.new.js#L690-L714).
- `fiber.deletions`: 存储将要被删除的子节点. 默认未开启, 当设置了[enableNewReconciler=true](https://github.com/facebook/react/blob/v17.0.2/packages/shared/ReactFeatureFlags.js#L93) 才会启用, 本系列只跟踪稳定版的代码, 未来版本不会深入解读, [使用示例见源码](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactChildFiber.new.js#L275-L287).
- `fiber.nextEffect`: 单向链表, 指向下一个有副作用的 fiber 节点.
- `fiber.firstEffect`: 指向副作用链表中的第一个 fiber 节点.
- `fiber.lastEffect`: 指向副作用链表中的最后一个 fiber 节点.
- `fiber.lanes`: 本 fiber 节点所属的优先级, 创建 fiber 的时候设置.
- `fiber.childLanes`: 子节点所属的优先级.
- `fiber.alternate`: 指向内存中的另一个 fiber, 每个被更新过 fiber 节点在内存中都是成对出现(current 和 workInProgress)

<br/>

### Fiber双缓存树

1.react根据双缓冲机制维护了两个fiber树，因为更新时依赖于老状态的

`current Fiber树`：用于渲染页面

`workinProgress Fiber树`：用于在内存构建中，方便在构建完成后直接替换current Fiber树

2.Fiber双缓存

`首次渲染时`：
render阶段会根据jsx对象生成新的Fiber节点，然后这些Fiber节点会被标记成带有‘Placement’的副作用，说明他们是新增节点，需要被插入到真实节点中，在commitWork阶段就会操作成真实节点，将它们插入到dom树中。

`页面触发更新时`:
render阶段会根据最新的jsx生成的虚拟dom和current Fiber树进行对比，比较之后生成workinProgress Fiber(workinProgress Fiber树的alternate指向Current Fiber树的对应节点，这些Fiber会带有各种副作用，比如‘Deletion’、‘Update’、'Placement’等)这一对比过程就是diff算法

当workinProgress Fiber树构建完成，workInprogress 则成为了curent Fiber渲染到页面上

diff ⽐较的是什么？ ⽐较的是 current fiber 和 vdom，⽐较之后⽣成 workInprogress Fiber

## ![avatar](./img/renderRootFiber.jpg)

<br/>

### Update 与 UpdateQueue 对象

在`fiber`对象中有一个属性`fiber.updateQueue`, 是一个链式队列(即使用链表实现的队列存储结构), 后文会根据场景表述成链表或队列.

首先观察`Update`对象的数据结构([对照源码](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactUpdateQueue.old.js#L106-L129)):

```js
export type Update<State> = {|
  eventTime: number, // 发起update事件的时间(17.0.2中作为临时字段, 即将移出)
  lane: Lane, // update所属的优先级
  tag: 0 | 1 | 2 | 3, //
  payload: any, // 载荷, 根据场景可以设置成一个回调函数或者对象
  callback: (() => mixed) | null, // 回调函数
  next: Update<State> | null, // 指向链表中的下一个, 由于UpdateQueue是一个环形链表, 最后一个update.next指向第一个update对象
|};
// =============== UpdateQueue ==============
type SharedQueue<State> = {|
  pending: Update<State> | null,
|};
export type UpdateQueue<State> = {|
  baseState: State,
  firstBaseUpdate: Update<State> | null,
  lastBaseUpdate: Update<State> | null,
  shared: SharedQueue<State>,
  effects: Array<Update<State>> | null,
|};
```

属性解释:

1. `UpdateQueue`

   - `baseState`: 表示此队列的基础 state
   - `firstBaseUpdate`: 指向基础队列的队首
   - `lastBaseUpdate`: 指向基础队列的队尾
   - `shared`: 共享队列
   - `effects`: 用于保存有`callback`回调函数的 update 对象, 在`commit`之后, 会依次调用这里的回调函数.

2. `SharedQueue`

   - `pending`: 指向即将输入的`update`队列. 在`class`组件中调用`setState()`之后, 会将新的 update 对象添加到这个队列中来.

3. `Update`
   - `eventTime`: 发起`update`事件的时间(17.0.2 中作为临时字段, 即将移出)
   - `lane`: `update`所属的优先级
   - `tag`: 表示`update`种类, 共 4 种. [`UpdateState,ReplaceState,ForceUpdate,CaptureUpdate`](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactUpdateQueue.old.js#L131-L134)
   - `payload`: 载荷, `update`对象真正需要更新的数据, 可以设置成一个回调函数或者对象.
   - `callback`: 回调函数. `commit`完成之后会调用.
   - `next`: 指向链表中的下一个, 由于`UpdateQueue`是一个环形链表, 最后一个`update.next`指向第一个`update`对象.

`updateQueue`是`fiber`对象的一个属性, 所以不能脱离`fiber`存在. 它们之间数据结构和引用关系如下:

![](./img/updatequeue.png)


### Hook 对象

`Hook`用于`function`组件中, 能够保持`function`组件的状态(与`class`组件中的`state`在性质上是相同的, 都是为了保持组件的状态).在`react@16.8`以后, 官方开始推荐使用`Hook`语法, 常用的 api 有`useState`,`useEffect`,`useCallback`等, 官方一共定义了[14 种`Hook`类型](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactFiberHooks.old.js#L111-L125).

这些 api 背后都会创建一个`Hook`对象, 先观察[`Hook`对象的数据结构](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactFiberHooks.old.js#L134-L140):

```js
export type Hook = {|
  memoizedState: any,
  baseState: any,
  baseQueue: Update<any, any> | null,
  queue: UpdateQueue<any, any> | null,
  next: Hook | null,
|};
type Update<S, A> = {|
  lane: Lane,
  action: A,
  eagerReducer: ((S, A) => S) | null,
  eagerState: S | null,
  next: Update<S, A>,
  priority?: ReactPriorityLevel,
|};
type UpdateQueue<S, A> = {|
  pending: Update<S, A> | null,
  dispatch: (A => mixed) | null,
  lastRenderedReducer: ((S, A) => S) | null,
  lastRenderedState: S | null,
|};
```

属性解释:

1. `Hook`

- `memoizedState`: 内存状态, 用于输出成最终的`fiber`树
- `baseState`: 基础状态, 当`Hook.queue`更新过后, `baseState`也会更新.
- `baseQueue`: 基础状态队列, 在`reconciler`阶段会辅助状态合并.
- `queue`: 指向一个`Update`队列
- `next`: 指向该`function`组件的下一个`Hook`对象, 使得多个`Hook`之间也构成了一个链表.

2. `Hook.queue`和 `Hook.baseQueue`(即`UpdateQueue`和`Update`）是为了保证`Hook`对象能够顺利更新, 与上文`fiber.updateQueue`中的`UpdateQueue和Update`是不一样的(且它们在不同的文件), 其逻辑会在状态组件(class 与 function)章节中详细解读.

`Hook`与`fiber`的关系:

在`fiber`对象中有一个属性`fiber.memoizedState`指向`fiber`节点的内存状态. 在`function`类型的组件中, `fiber.memoizedState`就指向`Hook`队列(`Hook`队列保存了`function`类型的组件状态).

所以`Hook`也不能脱离`fiber`而存在, 它们之间的引用关系如下:

![](./img/fiber-hook.png)


### reconciler

![avatar](./img/reactfiberworkloop.png)

此处先归纳一下`react-reconciler`包的主要作用, 将主要功能分为 4 个方面:

1. 输入: 暴露`api`函数(如: `scheduleUpdateOnFiber`), 供给其他包(如`react`包)调用.
2. 注册调度任务: 与调度中心(`scheduler`包)交互, 注册调度任务`task`, 等待任务回调.
3. 执行任务回调: 在内存中构造出`fiber树`, 同时与与渲染器(`react-dom`)交互, 在内存中创建出与`fiber`对应的`DOM`节点.
4. 输出: 与渲染器(`react-dom`)交互, 渲染`DOM`节点.


在`ReactFiberWorkLoop.js`中, 承接输入的函数只有`scheduleUpdateOnFiber`[源码地址](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactFiberWorkLoop.old.js#L517-L619). 在`react-reconciler`对外暴露的 api 函数中, 只要涉及到需要改变 fiber 的操作(无论是`首次渲染`或`后续更新`操作), 最后都会间接调用`scheduleUpdateOnFiber`, 所以`scheduleUpdateOnFiber`函数是输入链路中的`必经之路`.

```js
// 唯一接收输入信号的函数
export function scheduleUpdateOnFiber(
  fiber: Fiber,
  lane: Lane,
  eventTime: number,
) {
  // ... 省略部分无关代码
  const root = markUpdateLaneFromFiberToRoot(fiber, lane);
  if (lane === SyncLane) {
    if (
      (executionContext & LegacyUnbatchedContext) !== NoContext &&
      (executionContext & (RenderContext | CommitContext)) === NoContext
    ) {
      // 直接进行`fiber构造`
      performSyncWorkOnRoot(root);
    } else {
      // 注册调度任务, 经过`Scheduler`包的调度, 间接进行`fiber构造`
      ensureRootIsScheduled(root, eventTime);
    }
  } else {
    // 注册调度任务, 经过`Scheduler`包的调度, 间接进行`fiber构造`
    ensureRootIsScheduled(root, eventTime);
  }
}
```

逻辑进入到`scheduleUpdateOnFiber`之后, 后面有 2 种可能:

1. 不经过调度, 直接进行`fiber构造`.
2. 注册调度任务, 经过`Scheduler`包的调度, 间接进行`fiber构造`.

### 注册调度任务

与`输入`环节紧密相连, `scheduleUpdateOnFiber`函数之后, 立即进入`ensureRootIsScheduled`函数([源码地址](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactFiberWorkLoop.old.js#L674-L736)):

```js
/**
 * 用这个函数去调度一个任务，对于一个Root同时只能存在一个task,如果在调度一个任务时
 * 发现已经存在了一个任务我们会检查他的优先级，确保他的优先级是小于等于当前调度的任务的
 * @param root FiberRoot
 * @param currentTime 当前任务创建时的时间
 * @returns
 */
// ... 省略部分无关代码
function ensureRootIsScheduled(root: FiberRoot, currentTime: number) {
  // 前半部分: 是否已有任务节点存在，该节点为上次调度时Scheduler返回的任务节点,如果没有则为null
  const existingCallbackNode = root.callbackNode;
  // 获得该次任务的优先级
  const nextLanes = getNextLanes(
    root,
    root === workInProgressRoot ? workInProgressRootRenderLanes : NoLanes,
  );
  const newCallbackPriority = returnNextLanesPriority();
  if (nextLanes === NoLanes) {
    return;
  }
  if (existingCallbackNode !== null) {
    const existingCallbackPriority = root.callbackPriority;
    /**
      * 检查是是否已经存在任务，如果存在且优先级相同就可以复用他
      * 这就是一个click事件内的多次setState
      * 导致多次scheduleUpdateOnFiber但也只会渲染一次的原因
      * 同一优先级的update只会被调度一次，后续的update会直接返回
      * 只需要把他们挂在pending queue上的就行，待会beginWork阶段中拥有相同优先级的
      * update会被一同reduce了
    */
    if (existingCallbackPriority === newCallbackPriority) {
      return;
    }
     //能走到着说明该次更新的的优先级一定大于现存任务的优先级
    //如果有现存任务就可以直接取消他，让他待会在被重新调度执行
    cancelCallback(existingCallbackNode);
  }
  // 后半部分: 注册调度任务
  let newCallbackNode;
  if (newCallbackPriority === SyncLanePriority) {
    // 将同步任务全都放到一个队列中，然后注册一个微任务待会把他们全部一同执行了
    newCallbackNode = scheduleSyncCallback(
      performSyncWorkOnRoot.bind(null, root),
    );
  } else if (newCallbackPriority === SyncBatchedLanePriority) {
    newCallbackNode = scheduleCallback(
      ImmediateSchedulerPriority,
      performSyncWorkOnRoot.bind(null, root),
    );
  } else {
    const schedulerPriorityLevel = lanePriorityToSchedulerPriority(
      newCallbackPriority,
    );
    // 调度performConcurrentWorkOnRoot
    newCallbackNode = scheduleCallback(
      schedulerPriorityLevel,
      performConcurrentWorkOnRoot.bind(null, root),
    );
  }
  root.callbackPriority = newCallbackPriority;
  root.callbackNode = newCallbackNode;
}
```

`ensureRootIsScheduled`的逻辑很清晰, 分为 2 部分:

1.  前半部分: 判断是否需要注册新的调度(如果无需新的调度, 会退出函数)
2.  后半部分: 注册调度任务
    - `performSyncWorkOnRoot`或`performConcurrentWorkOnRoot`被封装到了任务回调(`scheduleCallback`)中
    - 等待调度中心执行任务, 任务运行其实就是执行`performSyncWorkOnRoot`或`performConcurrentWorkOnRoot`

### 执行任务回调

任务回调, 实际上就是执行`performSyncWorkOnRoot`或`performConcurrentWorkOnRoot`. 简单看一下它们的源码(在`fiber树构造`章节再深入分析), 将主要逻辑剥离出来, 单个函数的代码量并不多.

[performSyncWorkOnRoot](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactFiberWorkLoop.old.js#L965-L1045):

```js
// ... 省略部分无关代码
function performSyncWorkOnRoot(root) {
  let lanes;
  let exitStatus;
  lanes = getNextLanes(root, NoLanes);
  // 1. fiber树构造
  exitStatus = renderRootSync(root, lanes);
  // 2. 异常处理: 有可能fiber构造过程中出现异常
  if (root.tag !== LegacyRoot && exitStatus === RootErrored) {
    // ...
  }
  // 3. 输出: 渲染fiber树
  const finishedWork: Fiber = (root.current.alternate: any);
  root.finishedWork = finishedWork;
  root.finishedLanes = lanes;
  commitRoot(root);
  // 退出前再次检测, 是否还有其他更新, 是否需要发起新调度
  ensureRootIsScheduled(root, now());
  return null;
}
```

`performSyncWorkOnRoot`的逻辑很清晰, 分为 3 部分:

1. fiber 树构造
2. 异常处理: 有可能 fiber 构造过程中出现异常
3. 调用输出

[performConcurrentWorkOnRoot](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactFiberWorkLoop.old.js#L740-L839)

```js
// ... 省略部分无关代码
function performConcurrentWorkOnRoot(root) {
  const originalCallbackNode = root.callbackNode;
  // 1. 刷新pending状态的effects, 有可能某些effect会取消本次任务
  const didFlushPassiveEffects = flushPassiveEffects();
  if (didFlushPassiveEffects) {
    if (root.callbackNode !== originalCallbackNode) {
      // 任务被取消, 退出调用
      return null;
    } else {
      // Current task was not canceled. Continue.
    }
  }
  // 2. 获取本次渲染的优先级
  let lanes = getNextLanes(
    root,
    root === workInProgressRoot ? workInProgressRootRenderLanes : NoLanes,
  );
  // 3. 构造fiber树
  let exitStatus = renderRootConcurrent(root, lanes);
  if (
    includesSomeLane(
      workInProgressRootIncludedLanes,
      workInProgressRootUpdatedLanes,
    )
  ) {
    // 如果在render过程中产生了新的update, 且新update的优先级与最初render的优先级有交集
    // 那么最初render无效, 丢弃最初render的结果, 等待下一次调度
    prepareFreshStack(root, NoLanes);
  } else if (exitStatus !== RootIncomplete) {
    // 4. 异常处理: 有可能fiber构造过程中出现异常
    if (exitStatus === RootErrored) {
      // ...
    }.
    const finishedWork: Fiber = (root.current.alternate: any);
    root.finishedWork = finishedWork;
    root.finishedLanes = lanes;
    // 5. 输出: 渲染fiber树
    finishConcurrentRender(root, exitStatus, lanes);
  }
  // 退出前再次检测, 是否还有其他更新, 是否需要发起新调度
  ensureRootIsScheduled(root, now());
  if (root.callbackNode === originalCallbackNode) {
    // 渲染被阻断, 返回一个新的performConcurrentWorkOnRoot函数, 等待下一次调用
    return performConcurrentWorkOnRoot.bind(null, root);
  }
  return null;
}
```

`performConcurrentWorkOnRoot`的逻辑与`performSyncWorkOnRoot`的不同之处在于, 对于`可中断渲染`的支持:

1. 调用`performConcurrentWorkOnRoot`函数时, 首先检查是否处于`render`过程中, 是否需要恢复上一次渲染.
2. 如果本次渲染被中断, 最后返回一个新的 performConcurrentWorkOnRoot 函数, 等待下一次调用.

### 输出

[`commitRoot`](https://github.com/facebook/react/blob/v17.0.2/packages/react-reconciler/src/ReactFiberWorkLoop.old.js#L1879-L2254):

```js
// ... 省略部分无关代码
function commitRootImpl(root, renderPriorityLevel) {
  // 设置局部变量
  const finishedWork = root.finishedWork;
  const lanes = root.finishedLanes;
  // 清空FiberRoot对象上的属性
  root.finishedWork = null;
  root.finishedLanes = NoLanes;
  root.callbackNode = null;
  // 提交阶段
  let firstEffect = finishedWork.firstEffect;
  if (firstEffect !== null) {
    const prevExecutionContext = executionContext;
    executionContext |= CommitContext;
    // 阶段1: dom突变之前
    nextEffect = firstEffect;
    do {
      commitBeforeMutationEffects();
    } while (nextEffect !== null);
    // 阶段2: dom突变, 界面发生改变
    nextEffect = firstEffect;
    do {
      commitMutationEffects(root, renderPriorityLevel);
    } while (nextEffect !== null);
    root.current = finishedWork;
    // 阶段3: layout阶段, 调用生命周期componentDidUpdate和回调函数等
    nextEffect = firstEffect;
    do {
      commitLayoutEffects(root, lanes);
    } while (nextEffect !== null);
    nextEffect = null;
    executionContext = prevExecutionContext;
  }
  ensureRootIsScheduled(root, now());
  return null;
}
```

在输出阶段,`commitRoot`的实现逻辑是在`commitRootImpl`函数中, 其主要逻辑是处理副作用队列, 将最新的 fiber 树结构反映到 DOM 上.

核心逻辑分为 3 个步骤:

1. `commitBeforeMutationEffects`
   - dom 变更之前, 主要处理副作用队列中带有`Snapshot`,`Passive`标记的`fiber`节点.
2. `commitMutationEffects`
   - dom 变更, 界面得到更新. 主要处理副作用队列中带有`Placement`, `Update`, `Deletion`, `Hydrating`标记的`fiber`节点.
3. `commitLayoutEffects`
   - dom 变更后, 主要处理副作用队列中带有`Update | Callback`标记的`fiber`节点.

<br/>

### collectEffectList

作为DOM操作的依据，commit阶段需要找到所有有effectTag的Fiber节点并依次执行effectTag对应操作。难道需要在commit阶段再遍历一次Fiber树寻找effectTag !== null的Fiber节点么？

这显然是很低效的。

为了解决这个问题，在completeWork的上层函数completeUnitOfWork中，每个执行完completeWork且存在effectTag的Fiber节点会被保存在一条被称为effectList的单向链表中。

effectList中第一个Fiber节点保存在fiber.firstEffect，最后一个元素保存在fiber.lastEffect。

类似appendAllChildren，在“归”阶段，所有有effectTag的Fiber节点都会被追加在effectList中，最终形成一条以rootFiber.firstEffect为起点的单向链表。

这样，在commit阶段只需要遍历effectList就能执行所有effect了。

![avatar](./img/collectEffectList.jpg)

```javaScript

  function collectEffectList(returnFiber, completedWork) {
    if (returnFiber) {
      //如果父亲 没有effectList,那就让父亲 的firstEffect链表头指向自己的头
      if (!returnFiber.firstEffect) {
        returnFiber.firstEffect = completedWork.firstEffect;
      } 
      //如果自己有链表尾
      if (completedWork.lastEffect) {
        //并且父亲也有链表尾
        if (returnFiber.lastEffect) {
          //把自己身上的effectlist挂接到父亲的链表尾部
          returnFiber.lastEffect.nextEffect = completedWork.firstEffect;
        }
        returnFiber.lastEffect = completedWork.lastEffect;
      }
      var flags = completedWork.flags; //如果此完成的fiber有副使用，那么就需要添加到effectList里
      if (flags) {
        //如果父fiber有lastEffect的话，说明父fiber已经有effect链表
        if (returnFiber.lastEffect) {
          returnFiber.lastEffect.nextEffect = completedWork;
        } else {
          returnFiber.firstEffect = completedWork;
        }

        returnFiber.lastEffect = completedWork;
      }
    }
  }
  let rootFiber = { key: 'rootFiber' };
  let fiberA = { key: 'A', flags: Placement };
  let fiberB = { key: 'B', flags: Placement };
  let fiberC = { key: 'C', flags: Placement };
  //B把自己的fiber给A
  collectEffectList(fiberA, fiberB);
  collectEffectList(fiberA, fiberC);
  collectEffectList(rootFiber, fiberA);  //rootFiber->A-B->C 
  
```
<br/>

### DomDiff

DomDiff 的过程其实就是老的 Fiber 树 和 新的 jsx 对比生成新的 Fiber 树 的过程，分为单节点和多节点两种分别对应**reconcileSingleElement**和**reconcileChildrenArray**

**只对同级元素进行比较**

**不同的类型对应不同的元素**

**可以通过key来标识同一个节点**

### 单节点

  1.新旧节点 type 和 key 都不一样，标记为删除

  2.如果对比后发现新老节点一样的，那么会复用老节点，复用老节点的 DOM 元素和 Fiber 对象
  再看属性有无变更 ，如果有变化，则会把此 Fiber 节点标准为更新

  3.如果 key 相同，但是 type 不同，则不再进行后续对比了，
  直接把老的节点全部删除

![avatar](./img/singleDomDiff.jpg)

```javaScript

  function reconcileSingleElement(
    returnFiber: Fiber,
    currentFirstChild: Fiber | null,
    element: ReactElement
  ): Fiber {
    const key = element.key;
    let child = currentFirstChild;
    // 首先判断是否存在对应DOM节点
    while (child !== null) {
      // 上一次更新存在DOM节点，接下来判断是否可复用
      // 首先比较key是否相同
      if (child.key === key) {
        // key相同，接下来比较type是否相同
        switch (child.tag) {
          // ...省略case
          default: {
            if (child.elementType === element.type) {
              // type相同则表示可以复用
              // 删除剩下的兄弟节点
               deleteRemainingChildren(returnFiber, child.sibling)
               // 复用fiber，更新props
               const existing = useFiber(child, element.props)
               existing.return = returnFiber
               return existing
            }
            //key相同但是type变了，直接停止遍历，把后面的节点都删了
            deleteRemainingChildren(returnFiber, child)
            break
          }
        }
        // 代码执行到这里代表：key相同但是type不同
        // 将该fiber及其兄弟fiber标记为删除
        deleteRemainingChildren(returnFiber, child);
        break;
      } else {
        // key不同，将该fiber标记为删除
        deleteChild(returnFiber, child);
      }
      child = child.sibling;
    }
    //一个都不能复用，直接重新创建一个，根据jsx创建fiber节点
    const created = createFiberFromElement(element, returnFiber.mode, lanes)
    // 建立与父级的关系
    created.return = returnFiber
    return created
  }
  
```

### 多节点

```javaScript

  // 之前
  abcd
  // 之后
  acdb
  
  ===第一轮遍历开始===
  a（之后）vs a（之前）  
  key不变，可复用
  此时 a 对应的oldFiber（之前的a）在之前的数组（abcd）中索引为0
  所以 lastPlacedIndex = 0;

  继续第一轮遍历...

  c（之后）vs b（之前）  
  key改变，不能复用，跳出第一轮遍历
  此时 lastPlacedIndex === 0;
  ===第一轮遍历结束===

  ===第二轮遍历开始===
  newChildren === cdb，没用完，不需要执行删除旧节点
  oldFiber === bcd，没用完，不需要执行插入新节点

  将剩余oldFiber（bcd）保存为map

  // 当前oldFiber：bcd
  // 当前newChildren：cdb

  继续遍历剩余newChildren

  key === c 在 oldFiber中存在
  const oldIndex = c（之前）.index;
  此时 oldIndex === 2;  // 之前节点为 abcd，所以c.index === 2
  比较 oldIndex 与 lastPlacedIndex;

  如果 oldIndex >= lastPlacedIndex 代表该可复用节点不需要移动
  并将 lastPlacedIndex = oldIndex;
  如果 oldIndex < lastplacedIndex 该可复用节点之前插入的位置索引小于这次更新需要插入的位置索引，代表该节点需要向右移动

  在例子中，oldIndex 2 > lastPlacedIndex 0，
  则 lastPlacedIndex = 2;
  c节点位置不变

  继续遍历剩余newChildren

  // 当前oldFiber：bd
  // 当前newChildren：db

  key === d 在 oldFiber中存在
  const oldIndex = d（之前）.index;
  oldIndex 3 > lastPlacedIndex 2 // 之前节点为 abcd，所以d.index === 3
  则 lastPlacedIndex = 3;
  d节点位置不变

  继续遍历剩余newChildren

  // 当前oldFiber：b
  // 当前newChildren：b

  key === b 在 oldFiber中存在
  const oldIndex = b（之前）.index;
  oldIndex 1 < lastPlacedIndex 3 // 之前节点为 abcd，所以b.index === 1
  则 b节点需要向右移动
  ===第二轮遍历结束===

  最终acd 3个节点都没有移动，b节点被标记为移动
  
```

![avatar](./img/domDiff_move.jpg)

```javaScript

      function reconcileChildrenArray(returnFiber, currentFirstChild, newChildren) {
        //将要返回的第一个新fiber，也就是workInProgress
        let resultingFirstChild = null;
        //上一个新fiber
        let previousNewFiber = null;
        //当前的老fiber
        let oldFiber = currentFirstChild;
        //下一个老fiber
        let nextOldFiber = null;
        //新的虚拟DOM的索引
        let newIdx = 0;
        // 新的Fiber节点在老的Fiber节点中的索引位置，用来处理Fiber节点位置的变化，也就是oldFiber index
        let lastPlacedIndex = 0;
        //处理更新的情况 老fiber和新fiber都存在
        for (; oldFiber && newIdx < newChildren.length; newIdx++) {
            //先缓存下一个老fiber
            nextOldFiber = oldFiber.sibling;
            //  判断该对应位置的fiber是否可以复用
            //  只有type相同且key也相同的情况下才会复用
            //  diff函数会根据该函数的返回值进行相关的操作
            //  如果key不相同直接返回null代表可能节点的位置发生了变更，
            //  简单的循环是行不通的所以待会会进入updateFromMap逻辑，
            //  如果是key相同但是type变了就选择不复用，而是选择重新创建一个元素返回
            //  就会将以前同key的元素标记为删除
            const newFiber = updateSlot(returnFiber, oldFiber, newChildren[newIdx]);
            //如果key 不一样，直接跳出第一轮循环
            if (!newFiber)
                break;
            //老fiber存在，但是新节点没有alternate，说明是新创建的节点，将老Fiber标记为删除，继续遍历
            if (oldFiber && !newFiber.alternate) {
                deleteChild(returnFiber, oldFiber);
            }
              //  如果是首次mount则 lastPlacedIndex没有意义，该值主要用来判断该节点在这次更新后
              //  是不是原来在他后面的节点，现在跑到他前面了如果是他就是需要重新插入dom树的
              //  那么怎么判断他后面的节点是不是跑到他前面了呢，考虑以下情况
              //  更新前: 1 -> 2 -> 3 -> 4
              //  更新后: 1 -> 3 -> 2 -> 4
              //  在处理该次更新时，当遍历到2时，此时lastPlacedIndex为2，而2的oldIndex为1
              //  所以可以判断到newFiber.oldIndex<lastPlacedIndex，老的Fiber对应的真实dom需要移动了
              //  但是现在跑到他前面了，所以newFiber也就是2是需要重新插入dom树的
              //  在commit阶段时，对2相应的dom进行重新插入时，
              //  会寻找他后面第一个不需要进行插入操作的dom元素作为insertBefore
              //  的第二个参数，所以2对应的dom会被插入到4前面

            lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
            if (previousNewFiber === null) {
                resultingFirstChild = newFiber;
            } else {
                previousNewFiber.sibling = newFiber;
            }
            previousNewFiber = newFiber;
            oldFiber = nextOldFiber;
        }
        // 老Fiber和新Fiber同时遍历完成，删除剩下的oldFiber就行
        if (newIdx === newChildren.length) {
            deleteRemainingChildren(returnFiber, oldFiber);
            return resultingFirstChild;
        }
        //如果老Fiber是遍历完的，但是新的Fiber还没遍历完，第一次挂载其实也是在这里的逻辑，因为没有oldFiber
        if (oldFiber === null) {
            //循环虚拟DOM数组， 为每个虚拟DOM创建一个新的fiber
            for (; newIdx < newChildren.length; newIdx++) {
                const newFiber = createChild(returnFiber, newChildren[newIdx]);
                lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
                if (!previousNewFiber) {
                    resultingFirstChild = newFiber;
                } else {
                    previousNewFiber.sibling = newFiber;
                }
                previousNewFiber = newFiber;
            }
            return resultingFirstChild;
        }
        //将剩下的老fiber放入map中 {key:key,value:Fiber}
        const existingChildren = mapRemainingChildren(returnFiber, oldFiber);
        for (; newIdx < newChildren.length; newIdx++) {
            //去map中找找有没key相同并且类型相同可以复用的老fiber 老真实DOM
            const newFiber = updateFromMap(existingChildren, returnFiber, newIdx, newChildren[newIdx]);
            if (newFiber !== null) {
                //说明是复用的老fiber
                if (newFiber.alternate) {
                    existingChildren.delete(newFiber.key || newIdx);
                }
                lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
                if (previousNewFiber === null) {
                    resultingFirstChild = newFiber;
                } else {
                    previousNewFiber.sibling = newFiber;
                }
                previousNewFiber = newFiber;
            }
        }
        //map中剩下是没有被 复用的，全部删除
        existingChildren.forEach(child => deleteChild(returnFiber, child));
        return resultingFirstChild;
    }
    
```

<br/>


## 事件绑定

从`v17.0.0`开始, React 不会再将事件处理添加到 `document` 上, 而是将事件处理添加到渲染 React 树的根 DOM 容器中.

注意: `react`的事件体系, 不是全部都通过`事件委托`来实现的. 有一些[特殊情况](https://github.com/facebook/react/blob/v17.0.2/packages/react-dom/src/client/ReactDOMComponent.js#L530-L616), 是直接绑定到对应 DOM 元素上的(如:`scroll`, `load`), 它们都通过[listenToNonDelegatedEvent](https://github.com/facebook/react/blob/v17.0.2/packages/react-dom/src/events/DOMPluginEventSystem.js#L295-L314)函数进行绑定.

上述特殊事件最大的不同是监听的 DOM 元素不同, 除此之外, 其他地方的实现与正常事件大体一致.


```js
function createRootImpl(
  container: Container,
  tag: RootTag,
  options: void | RootOptions,
) {
  // ... 省略无关代码
  if (enableEagerRootListeners) {
    const rootContainerElement =
      container.nodeType === COMMENT_NODE ? container.parentNode : container;
    listenToAllSupportedEvents(rootContainerElement);
  }
  // ... 省略无关代码
}
```

[listenToAllSupportedEvents](https://github.com/facebook/react/blob/v17.0.2/packages/react-dom/src/events/DOMPluginEventSystem.js#L316-L349)函数, 实际上完成了事件代理:

```js
// ... 省略无关代码
export function listenToAllSupportedEvents(rootContainerElement: EventTarget) {
  if (enableEagerRootListeners) {
    // 1. 节流优化, 保证全局注册只被调用一次
    if ((rootContainerElement: any)[listeningMarker]) {
      return;
    }
    (rootContainerElement: any)[listeningMarker] = true;
    // 2. 遍历allNativeEvents 监听冒泡和捕获阶段的事件
    allNativeEvents.forEach(domEventName => {
      if (!nonDelegatedEvents.has(domEventName)) {
        listenToNativeEvent(
          domEventName,
          false, // 冒泡阶段监听
          ((rootContainerElement: any): Element),
          null,
        );
      }
      listenToNativeEvent(
        domEventName,
        true, // 捕获阶段监听
        ((rootContainerElement: any): Element),
        null,
      );
    });
  }
}
```

核心逻辑:

1. 节流优化, 保证全局注册只被调用一次.
2. 遍历`allNativeEvents`, 调用`listenToNativeEvent`监听冒泡和捕获阶段的事件.
   - `allNativeEvents`包括了大量的原生事件名称, 它是在`DOMPluginEventSystem.js`中[被初始化](https://github.com/facebook/react/blob/v17.0.2/packages/react-dom/src/events/DOMPluginEventSystem.js#L89-L93)

[listenToNativeEvent](https://github.com/facebook/react/blob/v17.0.2/packages/react-dom/src/events/DOMPluginEventSystem.js#L351-L412):

```js
// ... 省略无关代码
export function listenToNativeEvent(
  domEventName: DOMEventName,
  isCapturePhaseListener: boolean,
  rootContainerElement: EventTarget,
  targetElement: Element | null,
  eventSystemFlags?: EventSystemFlags = 0,
): void {
  let target = rootContainerElement;
  const listenerSet = getEventListenerSet(target);
  const listenerSetKey = getListenerSetKey(
    domEventName,
    isCapturePhaseListener,
  );
  // 利用set数据结构, 保证相同的事件类型只会被注册一次.
  if (!listenerSet.has(listenerSetKey)) {
    if (isCapturePhaseListener) {
      eventSystemFlags |= IS_CAPTURE_PHASE;
    }
    // 注册事件监听
    addTrappedEventListener(
      target,
      domEventName,
      eventSystemFlags,
      isCapturePhaseListener,
    );
    listenerSet.add(listenerSetKey);
  }
}
```

[addTrappedEventListener](https://github.com/facebook/react/blob/v17.0.2/packages/react-dom/src/events/DOMPluginEventSystem.js#L468-L560):

```js
// ... 省略无关代码
function addTrappedEventListener(
  targetContainer: EventTarget,
  domEventName: DOMEventName,
  eventSystemFlags: EventSystemFlags,
  isCapturePhaseListener: boolean,
  isDeferredListenerForLegacyFBSupport?: boolean,
) {
  // 1. 构造listener
  let listener = createEventListenerWrapperWithPriority(
    targetContainer,
    domEventName,
    eventSystemFlags,
  );
  let unsubscribeListener;
  // 2. 注册事件监听
  if (isCapturePhaseListener) {
    unsubscribeListener = addEventCaptureListener(
      targetContainer,
      domEventName,
      listener,
    );
  } else {
    unsubscribeListener = addEventBubbleListener(
      targetContainer,
      domEventName,
      listener,
    );
  }
}
// 注册原生事件 冒泡
export function addEventBubbleListener(
  target: EventTarget,
  eventType: string,
  listener: Function,
): Function {
  target.addEventListener(eventType, listener, false);
  return listener;
}
// 注册原生事件 捕获
export function addEventCaptureListener(
  target: EventTarget,
  eventType: string,
  listener: Function,
): Function {
  target.addEventListener(eventType, listener, true);
  return listener;
}
```

从`listenToAllSupportedEvents`开始, 调用链路比较长, 最后调用`addEventBubbleListener`和`addEventCaptureListener`监听了原生事件.

### 原生 listener

在注册原生事件的过程中, 需要重点关注一下监听函数, 即`listener`函数. 它实现了把原生事件派发到`react`体系之内, 非常关键.

> 比如点击 DOM 触发原生事件, 原生事件最后会被派发到`react`内部的`onClick`函数. `listener`函数就是这个`由外至内`的关键环节.
`listener`是通过`createEventListenerWrapperWithPriority`函数产生:

```js
export function createEventListenerWrapperWithPriority(
  targetContainer: EventTarget,
  domEventName: DOMEventName,
  eventSystemFlags: EventSystemFlags,
): Function {
  // 1. 根据优先级设置 listenerWrapper
  const eventPriority = getEventPriorityForPluginSystem(domEventName);
  let listenerWrapper;
  switch (eventPriority) {
    case DiscreteEvent:
      listenerWrapper = dispatchDiscreteEvent;
      break;
    case UserBlockingEvent:
      listenerWrapper = dispatchUserBlockingUpdate;
      break;
    case ContinuousEvent:
    default:
      listenerWrapper = dispatchEvent;
      break;
  }
  // 2. 返回 listenerWrapper
  return listenerWrapper.bind(
    null,
    domEventName,
    eventSystemFlags,
    targetContainer,
  );
}
```

可以看到, 不同的`domEventName`调用`getEventPriorityForPluginSystem`后返回不同的优先级, 最终会有 3 种情况:

1. `DiscreteEvent`: 优先级最高, 包括`click, keyDown, input`等事件, [源码](https://github.com/facebook/react/blob/v17.0.2/packages/react-dom/src/events/DOMEventProperties.js#L45-L80)
   - 对应的`listener`是[dispatchDiscreteEvent](https://github.com/facebook/react/blob/v17.0.2/packages/react-dom/src/events/ReactDOMEventListener.js#L121-L142)
2. `UserBlockingEvent`: 优先级适中, 包括`drag, scroll`等事件, [源码](https://github.com/facebook/react/blob/v17.0.2/packages/react-dom/src/events/DOMEventProperties.js#L100-L116)
   - 对应的`listener`是[dispatchUserBlockingUpdate](https://github.com/facebook/react/blob/v17.0.2/packages/react-dom/src/events/ReactDOMEventListener.js#L144-L180)
3. `ContinuousEvent`: 优先级最低,包括`animation, load`等事件, [源码](https://github.com/facebook/react/blob/v17.0.2/packages/react-dom/src/events/DOMEventProperties.js#L119-L145)
   - 对应的`listener`是[dispatchEvent](https://github.com/facebook/react/blob/v17.0.2/packages/react-dom/src/events/ReactDOMEventListener.js#L182-L271)

这 3 种`listener`实际上都是对[dispatchEvent](https://github.com/facebook/react/blob/v17.0.2/packages/react-dom/src/events/ReactDOMEventListener.js#L182-L271)的包装:

```js
// ...省略无关代码
export function dispatchEvent(
  domEventName: DOMEventName,
  eventSystemFlags: EventSystemFlags,
  targetContainer: EventTarget,
  nativeEvent: AnyNativeEvent,
): void {
  if (!_enabled) {
    return;
  }
  const blockedOn = attemptToDispatchEvent(
    domEventName,
    eventSystemFlags,
    targetContainer,
    nativeEvent,
  );
}
```

## 事件触发

当原生事件触发之后, 首先会进入到`dispatchEvent`这个回调函数. 而`dispatchEvent`函数是`react`事件体系中最关键的函数, 其调用链路较长, 核心步骤如图所示:

![](./img/dispatch-event.png)

重点关注其中 3 个核心环节:

1. `attemptToDispatchEvent`
2. `SimpleEventPlugin.extractEvents`
3. `processDispatchQueue`

### 关联 fiber

[attemptToDispatchEvent](https://github.com/facebook/react/blob/v17.0.2/packages/react-dom/src/events/ReactDOMEventListener.js#L274-L331)把原生事件和`fiber树`关联起来.

```js
export function attemptToDispatchEvent(
  domEventName: DOMEventName,
  eventSystemFlags: EventSystemFlags,
  targetContainer: EventTarget,
  nativeEvent: AnyNativeEvent,
): null | Container | SuspenseInstance {
  // ...省略无关代码
  // 1. 定位原生DOM节点
  const nativeEventTarget = getEventTarget(nativeEvent);
  // 2. 获取与DOM节点对应的fiber节点
  let targetInst = getClosestInstanceFromNode(nativeEventTarget);
  // 3. 通过插件系统, 派发事件
  dispatchEventForPluginEventSystem(
    domEventName,
    eventSystemFlags,
    nativeEvent,
    targetInst,
    targetContainer,
  );
  return null;
}
```

核心逻辑:

1. 定位原生 DOM 节点: 调用`getEventTarget`
2. 获取与 DOM 节点对应的 fiber 节点: 调用`getClosestInstanceFromNode`
3. 通过插件系统, 派发事件: 调用 `dispatchEventForPluginEventSystem`

### 收集 fiber 上的 listener

`dispatchEvent`函数的调用链路中, 通过不同的插件, 处理不同的事件. 其中最常见的事件都会由`SimpleEventPlugin.extractEvents`进行处理:

```js
function extractEvents(
  dispatchQueue: DispatchQueue,
  domEventName: DOMEventName,
  targetInst: null | Fiber,
  nativeEvent: AnyNativeEvent,
  nativeEventTarget: null | EventTarget,
  eventSystemFlags: EventSystemFlags,
  targetContainer: EventTarget,
): void {
  const reactName = topLevelEventsToReactNames.get(domEventName);
  if (reactName === undefined) {
    return;
  }
  let SyntheticEventCtor = SyntheticEvent;
  let reactEventType: string = domEventName;
  const inCapturePhase = (eventSystemFlags & IS_CAPTURE_PHASE) !== 0;
  const accumulateTargetOnly = !inCapturePhase && domEventName === 'scroll';
  // 1. 收集所有监听该事件的函数.
  const listeners = accumulateSinglePhaseListeners(
    targetInst,
    reactName,
    nativeEvent.type,
    inCapturePhase,
    accumulateTargetOnly,
  );
  if (listeners.length > 0) {
    // 2. 构造合成事件, 添加到派发队列
    const event = new SyntheticEventCtor(
      reactName,
      reactEventType,
      null,
      nativeEvent,
      nativeEventTarget,
    );
    dispatchQueue.push({ event, listeners });
  }
}
```

核心逻辑:

1. 收集所有`listener`回调

   - 这里的是`fiber.memoizedProps.onClick/onClickCapture`等绑定在`fiber`节点上的回调函数
   - 具体逻辑在[accumulateSinglePhaseListeners](https://github.com/facebook/react/blob/v17.0.2/packages/react-dom/src/events/DOMPluginEventSystem.js#L712-L803):

     ```js
     export function accumulateSinglePhaseListeners(
       targetFiber: Fiber | null,
       reactName: string | null,
       nativeEventType: string,
       inCapturePhase: boolean,
       accumulateTargetOnly: boolean,
     ): Array<DispatchListener> {
       const captureName = reactName !== null ? reactName + 'Capture' : null;
       const reactEventName = inCapturePhase ? captureName : reactName;
       const listeners: Array<DispatchListener> = [];
       let instance = targetFiber;
       let lastHostComponent = null;
       // 从targetFiber开始, 向上遍历, 直到 root 为止
       while (instance !== null) {
         const { stateNode, tag } = instance;
         // 当节点类型是HostComponent时(如: div, span, button等类型)
         if (tag === HostComponent && stateNode !== null) {
           lastHostComponent = stateNode;
           if (reactEventName !== null) {
             // 获取标准的监听函数 (如onClick , onClickCapture等)
             const listener = getListener(instance, reactEventName);
             if (listener != null) {
               listeners.push(
                 createDispatchListener(instance, listener, lastHostComponent),
               );
             }
           }
         }
         // 如果只收集目标节点, 则不用向上遍历, 直接退出
         if (accumulateTargetOnly) {
           break;
         }
         instance = instance.return;
       }
       return listeners;
     }
     ```

2. 构造合成事件(`SyntheticEvent`), 添加到派发队列(`dispatchQueue`)

### 构造合成事件

[SyntheticEvent](https://github.com/facebook/react/blob/v17.0.2/packages/react-dom/src/events/SyntheticEvent.js#L152), 是`react`内部创建的一个对象, 是原生事件的跨浏览器包装器, 拥有和浏览器原生事件相同的接口(`stopPropagation`,`preventDefault`), 抹平不同浏览器 api 的差异, 兼容性好.

具体的构造过程并不复杂, 可以直接[查看源码](https://github.com/facebook/react/blob/v17.0.2/packages/react-dom/src/events/SyntheticEvent.js#L28-L136).

此处我们需要知道, 在`Plugin.extractEvents`过程中, 遍历`fiber树`找到`listener`之后, 就会创建`SyntheticEvent`, 加入到`dispatchQueue`中, 等待派发.

### 执行派发

`extractEvents`完成之后, 逻辑来到[processDispatchQueue](https://github.com/facebook/react/blob/v17.0.2/packages/react-dom/src/events/DOMPluginEventSystem.js#L260-L272), 终于要真正执行派发了.

```js
export function processDispatchQueue(
  dispatchQueue: DispatchQueue,
  eventSystemFlags: EventSystemFlags,
): void {
  const inCapturePhase = (eventSystemFlags & IS_CAPTURE_PHASE) !== 0;
  for (let i = 0; i < dispatchQueue.length; i++) {
    const { event, listeners } = dispatchQueue[i];
    processDispatchQueueItemsInOrder(event, listeners, inCapturePhase);
  }
  // ...省略无关代码
}
function processDispatchQueueItemsInOrder(
  event: ReactSyntheticEvent,
  dispatchListeners: Array<DispatchListener>,
  inCapturePhase: boolean,
): void {
  let previousInstance;
  if (inCapturePhase) {
    // 1. capture事件: 倒序遍历listeners
    for (let i = dispatchListeners.length - 1; i >= 0; i--) {
      const { instance, currentTarget, listener } = dispatchListeners[i];
      if (instance !== previousInstance && event.isPropagationStopped()) {
        return;
      }
      executeDispatch(event, listener, currentTarget);
      previousInstance = instance;
    }
  } else {
    // 2. bubble事件: 顺序遍历listeners
    for (let i = 0; i < dispatchListeners.length; i++) {
      const { instance, currentTarget, listener } = dispatchListeners[i];
      if (instance !== previousInstance && event.isPropagationStopped()) {
        return;
      }
      executeDispatch(event, listener, currentTarget);
      previousInstance = instance;
    }
  }
}
```

在[processDispatchQueueItemsInOrder](https://github.com/facebook/react/blob/v17.0.2/packages/react-dom/src/events/DOMPluginEventSystem.js#L233-L258)遍历`dispatchListeners`数组, 执行[executeDispatch](https://github.com/facebook/react/blob/v17.0.2/packages/react-dom/src/events/DOMPluginEventSystem.js#L222-L231)派发事件, 在`fiber`节点上绑定的`listener`函数被执行.

在`processDispatchQueueItemsInOrder`函数中, 根据`捕获(capture)`或`冒泡(bubble)`的不同, 采取了不同的遍历方式:

1. `capture`事件: `从上至下`调用`fiber树`中绑定的回调函数, 所以`倒序`遍历`dispatchListeners`.
2. `bubble`事件: `从下至上`调用`fiber树`中绑定的回调函数, 所以`顺序`遍历`dispatchListeners`.
<br/>

### 优先级

```javaScript 

  // 优先级
  export const NoPriority = 0;           // 没有任何优先级
  export const ImmediatePriority = 1;    // 立即执行的优先级，级别最高
  export const UserBlockingPriority = 2; // 用户阻塞级别的优先级
  export const NormalPriority = 3;       // 正常的优先级
  export const LowPriority = 4;          // 较低的优先级
  export const IdlePriority = 5;         // 优先级最低，表示任务可以闲置

  // 不同的优先级对应不同的过期时间
  let maxSigned31BitInt = 1073741823;
  let IMMEDIATE_PRIORITY_TIMEOUT = -1; //立即执行的优先级，级别最高
  let USER_BLOCKING_PRIORITY_TIMEOUT = 250; //用户阻塞级别的优先级
  let NORMAL_PRIORITY_TIMEOUT = 5000; //正常的优先级
  let LOW_PRIORITY_TIMEOUT = 10000; //较低的优先级
  let IDLE_PRIORITY_TIMEOUT = maxSigned31BitInt; //优先级最低，表示任务可以闲置
```

优先级的核心是使用数组模拟最小优先队列，核心文件是 SchedulerMinHeap.ts

```javaScript

    function push(){}  // 添加一个元素并调整最小堆
    function peek(){} // 查看一下堆顶的元素
    function pop(){}  // 取出并删除堆顶的元素，并调整最小堆

```

模拟React中的时间切片，单个任务，React当中是多任务，用的数组模拟的最小堆(taskQueue)

```javaScript
    let result = 0;
    let i = 0;
    //截止时间
    let deadline = 0;
    //当前正在调度执行的工作
    let scheduledHostCallback = null;
    //每帧的时间片5ms
    let yieldInterval = 5;
    // 新建MessageChannel
    const { port1, port2 } = new MessageChannel();
    // port2调用postMessage这里执行port1的onMessage的回调
    port1.onmessage = performWorkUntilDeadline;
    function scheduleCallback(callback) {
        scheduledHostCallback = callback;
        port2.postMessage(null);
    }
    /*总任务*/
    function calculate() {
        for (; i < 10000000 && (!shouldYield()); i++) {//7个0
            result += 1;
        }
        // 任务没有完成，返回任务本身
        if (result < 10000000) {
            return calculate;
        } else {
          // 任务完成，返回null进行终止操作
            return null;
        }

    }
    scheduleCallback(calculate);
    /**
     * 执行工作直到截止时间
     */
    function performWorkUntilDeadline() {
        // 获取当前的执行时间，相比Date.now更加精准
        const currentTime = performance.now();
        // 计算截止时间
        deadline = currentTime + yieldInterval;
        // 执行工作
        const hasMoreWork = scheduledHostCallback();
        // 如果此工作还没有执行完，则再次调度
        if (hasMoreWork) {
        // 触发port1的onMessage
            port2.postMessage(null);
        }
    }
    /**
     * 判断是否到达了本帧的截止时间
     * @returns 是否需要暂停执行
     */
    function shouldYield() {
        const currentTime = performance.now();
        return currentTime >= deadline;
    };
```

任务队列，多个任务的情况

![avatar](./img/taskQueue.jpeg)


### 时间切片

时间分片的异步渲染是优先级调度实现的前提，本质是模拟requestIdleCallback

```javaScript
  一个task(宏任务) -- 队列中全部job(微任务) -- requestAnimationFrame -- 浏览器重排/重绘 -- requestIdleCallback
```

requestIdleCallback是在“浏览器重排/重绘”后如果当前帧还有空余时间时被调用的。

浏览器并没有提供其他API能够在同样的时机（浏览器重排/重绘后）调用以模拟其实现。

唯一能精准控制调用时机的API是requestAnimationFrame，他能让我们在“浏览器重排/重绘”之前执行JS。

这也是为什么我们通常用这个API实现JS动画 —— 这是浏览器渲染前的最后时机，所以动画能快速被渲染。

所以，退而求其次，Scheduler的时间切片功能是通过task（宏任务）实现的。

最常见的task当属setTimeout了。但是有个task比setTimeout执行时机更靠前，那就是MessageChannel (opens new window)。

所以Scheduler将需要被执行的回调函数作为MessageChannel的回调执行。如果当前宿主环境不支持MessageChannel，则使用setTimeout


![avatar](./img/scheduleCallback.jpg)

### 位运算相关

```javaScript
 // 一般来说n比特的的信息量可以表示出2的n次方选择
 // 4个bit 2的3次方选择 从后往前到1，Math.pow(2,0) Math.pow(2,1) Math.pow(2,2) Math.pow(2,3)
 // 表示范围就是0-7
 let a = 0b1000; // 2*2*2 == 8 == Math.pow(2,3)
 let a = 0b10000; // 16
 let a = 0b100000; // 32
```

### 原码反码补码

计算器中其实只用了补码

原码：符号: 用0、1表示正负号,放在数值的最高位,0表示正数，1表示负数

3个bit能表示8个数 +0 +1 +2 +3 -0 -1 -2 -3

![avatar](./img/yuanma.gif)

反码：正数不变,负数的除符号位外取反，加法可以实现减法

![avatar](./img/fanma.gif)

补码

补码:正数不变,负数在反码的基础上加1

补码解决了,可以带符号位进行运算,不需要单独标识

补码解决了自然码正负0的表示方法

补码实现了减法变加法

![avatar](./img/buma.png)

### 位运算

|  运算   | 使用  | 说明 |
|  ----  | ----  | ----    |
|按位与(&)	|x & y |	每一个比特位都为1时，结果为1，否则为0|
|按位或()	|x  y |	每一个比特位都为0时，结果为0，否则为1|
|按位异或(^)|	x ^ y	|每一个比特位相同结果为0，否则为1|
|按位非(~)	|~ x|	对每一个比特位取反，0变为1，1变为0|
|左移(<<)	|x << y|	将x的每一个比特位左移y位，右侧补充0|
|有符号右移(>>)	|x >> y|	将x的每一个比特位向右移y个位，右侧移除位丢弃，左侧填充为最高位|
|无符号右移(>>>)	|x >>> y|	将x的每一个比特位向右移y个位，右侧移除位丢弃，左侧填充为0|


### 完全二叉树

叶子结点只能出现在最下层和次下层,且最下层的叶子结点集中在树的左部

![avatar](./img/completely_twoTree.jpeg)


### 最小堆

最小堆是一种经过排序的完全二叉树，在React源码中使用数组进行的模拟。

其中任一非终端节点的数据值均不大于其左子节点和右子节点的值，根结点值是所有堆结点值中最小者

根据子节点下标推算父节点下标：parentIndex = (childIndex - 1) >>> 1 (位运算)

根据父节点下标推算子节点下标：leftIndex = (index +1 )2 - 1,rightIndex = leftIndex + 1



![avatar](./img/min_heap.jpg)


### SchedulerMinHeap.js 

peek() 查看堆的顶点

pop() 弹出堆的定点后需要调用siftDown函数向下调整堆

push() 添加新节点后需要调用siftUp函数向上调整堆

siftDown() 向下调整堆结构, 保证最小堆

siftUp() 需要向上调整堆结构, 保证最小堆


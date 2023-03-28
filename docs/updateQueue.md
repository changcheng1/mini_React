<!--
 * @Author: changcheng
 * @LastEditTime: 2023-03-24 14:57:03
-->
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

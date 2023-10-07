<!--
 * @Author: changcheng
 * @LastEditTime: 2023-10-04 21:59:45
-->
### useState

+ mount阶段

`useState`和`useReducer`区别不大，其中`useReducer`的`lastRenderedReducer`为传入的reducer参数，`useState`的`lastRenderedReducer`为`basicStateReducer`

```javaScript
/**
 * hook的属性
 * hook.memoizedState 当前 hook真正显示出来的状态
 * hook.baseState 第一个跳过的更新之前的老状态
 * hook.queue.lastRenderedState 上一个计算的状态
 */
function mountState(initialState) {
  const hook = mountWorkInProgressHook();
  hook.memoizedState = hook.baseState = initialState;
  const queue = {
    pending: null,
    dispatch: null,
    lastRenderedReducer: baseStateReducer, //上一个reducer
    lastRenderedState: initialState, //上一个state
  };
  hook.queue = queue;
  const dispatch = (queue.dispatch = dispatchSetState.bind(
    null,
    currentlyRenderingFiber,
    queue
  ));
  return [hook.memoizedState, dispatch];
}
```
`dispatchSetState`用来更新`useState`状态

```javaScript
function dispatchSetState(fiber, queue, action) {
  // 获取当前的更新赛道 1
  const lane = requestUpdateLane();
  const update = {
    lane,//本次更新优先级就是1
    action,
    hasEagerState: false,//是否有急切的更新
    eagerState: null,//急切的更新状态
    next: null
  }
  const alternate = fiber.alternate;

  //当你派发动作后，我立刻用上一次的状态和上一次的reducer计算新状态
  //只要第一个更新都能进行此项优化
  if (fiber.lanes === NoLanes && (alternate === null || alternate.lanes == NoLanes)) {
    //先获取队列上的老的状态和老的reducer
    const { lastRenderedReducer, lastRenderedState } = queue;
    //使用上次的状态和上次的reducer结合本次action进行计算新状态
    const eagerState = lastRenderedReducer(lastRenderedState, action);
    update.hasEagerState = true;
    update.eagerState = eagerState;
    if (Object.is(eagerState, lastRenderedState)) {
      return;
    }
  }
  //下面是真正的入队更新，并调度更新逻辑
  const root = enqueueConcurrentHookUpdate(fiber, queue, update, lane);
  const eventTime = requestEventTime();
  scheduleUpdateOnFiber(root, fiber, lane, eventTime);
}
```

+ update阶段

在mount阶段，这两者还有区别，但是在update的时候，useState和useReducer调用的同一个函数`updateReducer`


```javaScript
//useState其实就是一个内置了reducer的useReducer
function baseStateReducer(state, action) {
  return typeof action === 'function' ? action(state) : action;
}
function updateState(initialState) {
  return updateReducer(baseStateReducer, initialState);
}
```

<!--
 * @Author: changcheng
 * @LastEditTime: 2023-10-04 15:00:20
-->
### useState

+ mount阶段

`useState`和`useReducer`区别不大，其中`useReducer`的`lastRenderedReducer`为传入的reducer参数，`useState`的`lastRenderedReducer`为`basicStateReducer`

```javaScript
// useState
function basicStateReducer(state, action) {
  return typeof action === 'function' ? action(state) : action;
}
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

+ update阶段

在mount阶段，这两者还有区别，但是在update的时候，useState和useReducer调用的同一个函数`updateReducer`

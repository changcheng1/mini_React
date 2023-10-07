### mountReducer

![avatar](../img/mountReducer_1678679227351.png)

在函数执行之前，也就是`renderWithHooks`函数里，根据`current`和`current.memoizedState`判断是挂载还是更新赋值不同的 dispatch

```javaScript
/**
 * 渲染函数组件
 * @param {*} current 老fiber
 * @param {*} workInProgress 新fiber
 * @param {*} Component 组件定义
 * @param {*} props 组件属性
 * @returns 虚拟DOM或者说React元素
 */
export function renderWithHooks(current, workInProgress, Component, props, nextRenderLanes) {
  //当前正在渲染的车道
  renderLanes = nextRenderLanes
  // 正在渲染的Fiber
  currentlyRenderingFiber = workInProgress;
  //函数组件更新队列里存的effect
  workInProgress.updateQueue = null;
  //函数组件状态存的hooks的链表
  workInProgress.memoizedState = null;
  //如果有老的fiber,并且有老的hook链表，当current类型不同，memoizedState值并不是相同的类型的
  if (current !== null && current.memoizedState !== null) {
    ReactCurrentDispatcher.current = HooksDispatcherOnUpdate;
  } else {
    ReactCurrentDispatcher.current = HooksDispatcherOnMount;
  }
  //需要要函数组件执行前给ReactCurrentDispatcher.current赋值
  const children = Component(props);
  currentlyRenderingFiber = null;
  workInProgressHook = null;
  currentHook = null;
  renderLanes = NoLanes;
  return children;
}
```

`useReduce`初次挂载时，会调用`mountWorkInProgressHook`方法构建挂载中的 Hook，全局的`currentlyRenderingFiber.memoizedState`指向第一个 hook，
`workInProgressHook`保存当前的 hook，`workInProgressHook.next`等于最新的 hook，构建一个单向链表，`currentlyRenderingFiber.memoizedState`，指向第一个，方便从头查找

```javaScript
const HooksDispatcherOnMount = {
  useReducer: mountReducer,
  useState: mountState,
  useEffect: mountEffect,
  useLayoutEffect: mountLayoutEffect,
  useRef: mountRef,
};
function mountReducer(reducer, initialArg) {
  const hook = mountWorkInProgressHook();
  hook.memoizedState = initialArg;
  const queue = {
    pending: null,
    dispatch: null,
    lastRenderedReducer: reducer,
    lastRenderedState: initialArg,
  };
  hook.queue = queue;
  // 构建派发动作，传入当前的fiber和更新队列
  const dispatch = (queue.dispatch = dispatchReducerAction.bind(
    null,
    currentlyRenderingFiber,
    queue
  ));
  return [hook.memoizedState, dispatch];
}

/**
 * 挂载构建中的hook
 * */
function mountWorkInProgressHook() {
  const hook = {
    memoizedState: null, //hook的状态 0
    queue: null, //存放本hook的更新队列 queue.pending=update的循环链表
    next: null, //指向下一个hook,一个函数里可以会有多个hook,它们会组成一个单向链表
    baseState: null, //第一跳过的更新前的状态
    baseQueue: null, //跳过的更新的链表
  };
  if (workInProgressHook === null) {
    //当前函数对应的fiber的状态等于第一个hook对象
    currentlyRenderingFiber.memoizedState = workInProgressHook = hook;
  } else {
    workInProgressHook = workInProgressHook.next = hook;
  }
  return workInProgressHook;
}
```

### updateReducer

![avatar](../img/hookUpdate.jpg)

reducer 更新逻辑：调用`renderWithHooks`以后，判断是否有老的 fiber，还有 fiber 的 memoizedState 状态，（**fiber和hook上都有memoizedState属性，fiber.memoizedState对应的是hook链表，hook.memoizedState对应的是state**），调用`HooksDispatcherOnUpdate`，走更新逻辑,调用`updateWorkInProgressHook`函数，通过当前 Fiber 的 alternate 获取老 Fiber，通过老 Fiber 上的 memoizedState 获取 hook，通过老 hook，创建新 hook，然后赋值 workInProgressHook，创建单向链表，执行 useReducer 方法的派发,此流程`useState`和`useReducer`方法通用

![avatar](../img/memoizedStateQueue.png)

`currentlyRenderingFiber`就是`workInProgress`，`workInProgress`存在就代表当前是`render`阶段，触发更新的时候，通过`bind`绑定的`fiber`与`workInProgress`全等

```javaScript
/**
 * 构建新的hooks
 */
function updateWorkInProgressHook() {
  //获取将要构建的新的hook的老hook
  if (currentHook === null) {
    const current = currentlyRenderingFiber.alternate;
    currentHook = current.memoizedState;
  } else {
    currentHook = currentHook.next;
  }
  //根据老hook创建新hook
  const newHook = {
    memoizedState: currentHook.memoizedState,
    queue: currentHook.queue,
    next: null,
    baseState: currentHook.baseState,
    baseQueue: currentHook.baseQueue,
  };
  if (workInProgressHook === null) {
    currentlyRenderingFiber.memoizedState = workInProgressHook = newHook;
  } else {
    workInProgressHook = workInProgressHook.next = newHook;
  }
  return workInProgressHook;
}
```
`updateReducer`方法，概括一句话就是**找到对应的hook，根据update计算该hook的新state返回**

```javaScript
function updateReducer(reducer) {
  // 获取新的hook
  const hook = updateWorkInProgressHook();
  // 获取hook 的更新队列
  const queue = hook.queue;
  queue.lastRenderedReducer = reducer;
  // 获取老的hook
  const current = currentHook;
  let baseQueue = current.baseQueue;
  // 获取更新队列，第一个都是指向最新的
  const pendingQueue = queue.pending;
  //把新旧更新链表合并
  if (pendingQueue !== null) {
    if (baseQueue !== null) {
      const baseFirst = baseQueue.next;
      // 拿到第一个更新
      const pendingFirst = pendingQueue.next;
      baseQueue.next = pendingFirst;
      pendingQueue.next = baseFirst;
    }
    current.baseQueue = baseQueue = pendingQueue;
    // 队列清空
    queue.pending = null;
  }
  if (baseQueue !== null) {
    printQueue(baseQueue);
    const first = baseQueue.next;
    let newState = current.baseState;
    let newBaseState = null;
    let newBaseQueueFirst = null;
    let newBaseQueueLast = null;
    let update = first;
    do {
      const updateLane = update.lane;
      const shouldSkipUpdate = !isSubsetOfLanes(renderLanes, updateLane);
      if (shouldSkipUpdate) {
        const clone = {
          lane: updateLane,
          action: update.action,
          hasEagerState: update.hasEagerState,
          eagerState: update.eagerState,
          next: null,
        };
        if (newBaseQueueLast === null) {
          newBaseQueueFirst = newBaseQueueLast = clone;
          newBaseState = newState;
        } else {
          newBaseQueueLast = newBaseQueueLast.next = clone;
        }
        currentlyRenderingFiber.lanes = mergeLanes(
          currentlyRenderingFiber.lanes,
          updateLane
        );
      } else {
        if (newBaseQueueLast !== null) {
          const clone = {
            lane: NoLane,
            action: update.action,
            hasEagerState: update.hasEagerState,
            eagerState: update.eagerState,
            next: null,
          };
          newBaseQueueLast = newBaseQueueLast.next = clone;
        }
        if (update.hasEagerState) {
          newState = update.eagerState;
        } else {
          // 派发的动作
          const action = update.action;
          // 计算新状态
          newState = reducer(newState, action);
        }
      }
      update = update.next;
    // 从头循环到尾
    } while (update !== null && update !== first);
    if (newBaseQueueLast === null) {
      newBaseState = newState;
    } else {
      newBaseQueueLast.next = newBaseQueueFirst;
    }
    // 设置新状态
    hook.memoizedState = newState;
    hook.baseState = newBaseState;
    hook.baseQueue = newBaseQueueLast;
    queue.lastRenderedState = newState;
  }
  if (baseQueue === null) {
    queue.lanes = NoLanes;
  }
  const dispatch = queue.dispatch;
  return [hook.memoizedState, dispatch];
}
```
以官网的reducer举例

```javaScript
function reducer(state:any, action:any) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}

export default () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      <button onClick={() =>
        {
          dispatch({type: 'increment'})
          dispatch({type: 'decrement'})
        }}>{state.count}</button>
    </>
  );
}
```
`updateQueue`第一个永远指向最新的状态

```javaScript
{
  baseQueue:null,
  baseState:{
    count:0
  },
  memoizedState:{
    count:0
  },
  next:null,
  queue:{
    dispatch:()=>{},
    lastRenderedReducer:(state,action)=>();
    lastRenderedState:{
      count:0
    },
    pending:{
      action:{
        type:"decrement",
        eagerState:null,
        hasEagerState:false,
        lane:1,
        next:{
          type:"increment",
          eagerState:null,
          hasEagerState:false,
          lane:1,
          next:{
            // 环形链表
            ...
          }
        }
      }
    }
  }
}
```

### dispatchAction

执行派发更新逻辑


```javaScript
/**
 * 执行派发动作的方法，它要更新状态，并且让界面重新更新
 * @param {*} fiber function对应的fiber
 * @param {*} queue 当前hook对应的更新队列
 * @param {*} action 派发的函数
 */
function dispatchReducerAction(fiber, queue, action) {
  //在每个hook里会存放一个更新队列，更新队列是一个更新对象的循环链表update1.next=update2.next=update1
  const update = {
    action, //{ type: 'add', payload: 1 } 派发的动作
    next: null, //指向下一个更新对象
  };
  //把当前的最新的更添的添加更新队列中，并且返回当前的根fiber
  const root = enqueueConcurrentHookUpdate(fiber, queue, update);
  const eventTime = requestEventTime();
  // 从root开始更新
  scheduleUpdateOnFiber(root, fiber, lane, eventTime);
}

/**
 * 把更新队列添加到更新队列中
 * @param {*} fiber 函数组件对应的fiber
 * @param {*} queue 要更新的hook对应的更新队列
 * @param {*} update 更新对象
 */
export function enqueueConcurrentHookUpdate(fiber, queue, update, lane) {
  enqueueUpdate(fiber, queue, update, lane);
  return getRootForUpdatedFiber(fiber);
}
```

```javaScript
/**
 * @param {*} fiber
 * @param {*} queue
 * @param {*} update
 */
function enqueueUpdate(updateQueue, update, fiber, lane) {
const pending = updateQueue.shared.pending;
	if (pending === null) {
		// pending = a -> a
		update.next = update;
	} else {
		// pending = b -> a -> b
		// pending = c -> a -> b -> c
		update.next = pending.next;
		pending.next = update;
	}
	updateQueue.shared.pending = update;

	fiber.lanes = mergeLanes(fiber.lanes, lane);
	const alternate = fiber.alternate;
	if (alternate !== null) {
		alternate.lanes = mergeLanes(alternate.lanes, lane);
	}
}
```

调用 `getRootForUpdatedFiber`，从当前的 fiber 找到 hostRoot，也就是根节点（FiberRootNode）, div #root，进行调度更新

```javaScript
function getRootForUpdatedFiber(sourceFiber) {
  let node = sourceFiber;
  let parent = node.return;
  while (parent !== null) {
    node = parent;
    parent = node.return;
  }
  return node.tag === HostRoot ? node.stateNode : null;  //FiberRootNode div#root
}
```
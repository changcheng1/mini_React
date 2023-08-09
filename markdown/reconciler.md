### reconciler

![avatar](../img/reactfiberworkloop.png)

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
  eventTime: number
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
    root === workInProgressRoot ? workInProgressRootRenderLanes : NoLanes
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
      performSyncWorkOnRoot.bind(null, root)
    );
  } else if (newCallbackPriority === SyncBatchedLanePriority) {
    newCallbackNode = scheduleCallback(
      ImmediateSchedulerPriority,
      performSyncWorkOnRoot.bind(null, root)
    );
  } else {
    const schedulerPriorityLevel =
      lanePriorityToSchedulerPriority(newCallbackPriority);
    // 调度performConcurrentWorkOnRoot
    newCallbackNode = scheduleCallback(
      schedulerPriorityLevel,
      performConcurrentWorkOnRoot.bind(null, root)
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

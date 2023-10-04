<!--
 * @Author: changcheng
 * @LastEditTime: 2023-10-04 16:08:47
-->
### createRoot

![avatar](../img/di_gui_gou_jian_fiber_shu.jpeg)

确定渲染的根节点，同时调用`createFiberRoot`，创建 Fiber 的根节点，FiberRootNode = containerInfo,它的本质就是一个真实的 DOM 节点，div#root，其实就是一个真实的 DOM 节点

+ 返回根`FiberRootNode`

+ 返回`render`函数进行渲染

```javaScript
// div#root
function ReactDOMRoot(internalRoot) {
  this._internalRoot = internalRoot;
}
// 创建根节点
export function createRoot(container) {// div#root
  // 创建Fiber的根节点
  const root = createContainer(container);
  // 增加事件监听
  listenToAllSupportedEvents(container);
  return new ReactDOMRoot(root);
}
// render方法，调用updateContainer把虚拟dom element变成真实DOM插入到container容器中
ReactDOMRoot.prototype.render = function (children) {
  const root = this._internalRoot;
  root.containerInfo.innerHTML = '';
  updateContainer(children, root);
}
export function createContainer(containerInfo) {
   // 创建Fiber的根节点
  return createFiberRoot(containerInfo);
}
// 创建根Fiber
export function createFiberRoot(containerInfo) {
  const root = new FiberRootNode(containerInfo);
  //HostRoot指的就是根节点div#root
  const uninitializedFiber = createHostRootFiber();
  //根容器的current指向当前的根fiber
  root.current = uninitializedFiber;
  //根fiber的stateNode,也就是真实DOM节点指向FiberRootNode
  uninitializedFiber.stateNode = root;
  // 初始化更新队列
  initialUpdateQueue(uninitializedFiber);
  return root;
}
function FiberRootNode(containerInfo) {
  this.containerInfo = containerInfo;//div#root
  //表示此根上有哪些赛道等待被处理
  this.pendingLanes = NoLanes;
  this.callbackNode = null;
  this.callbackPriority = NoLane;
  //过期时间 存放每个赛道过期时间
  this.expirationTimes = createLaneMap(NoTimestamp);
  //过期的赛道
  this.expiredLanes = NoLanes;
}

```
### initialUpdateQueue 

函数进行初始更新队列

Fiber 的`updateQueue`链表会在`processUpdateQueue`函数中根据老状态和更新队列中的更新计算最新的状态。

```javaScript

export function createFiberRoot(containerInfo) {
  const root = new FiberRootNode(containerInfo);
  //HostRoot指的就是根节点div#root
  const uninitializedFiber = createHostRootFiber();
  //根容器的current指向当前的根fiber
  root.current = uninitializedFiber;
  //根fiber的stateNode,也就是真实DOM节点指向FiberRootNode
  uninitializedFiber.stateNode = root;
  initialUpdateQueue(uninitializedFiber);
  return root;
}

export function initialUpdateQueue(fiber) {
  //创建一个新的更新队列
  //pending其实是一个循环链接
  const queue = {
    baseState: fiber.memoizedState,//本次更新前当前的fiber的状态,更新会其于它进行计算状态
    firstBaseUpdate: null,//本次更新前该fiber上保存的上次跳过的更新链表头
    lastBaseUpdate: null,//本次更新前该fiber上保存的上次跳过的更新链尾部
    shared: {
      pending: null,
    },
  };
  fiber.updateQueue = queue;
}
```

### updateContainer 

更新容器，把虚拟 `dom element` 变成真实 DOM 插入到 container 容器中

+ 创建一个更新事件

+ 把更新事件推进队列

+ 调度更新

```javaScript
/**
 * 更新容器，把虚拟dom element变成真实DOM插入到container容器中
 * @param {*} element 虚拟DOM
 * @param {*} container DOM容器 FiberRootNode containerInfo div#root
 */
export function updateContainer(element, container) {
  //获取当前的根fiber
  const current = container.current;
  const eventTime = requestEventTime();
  //请求一个更新车道
  const lane = requestUpdateLane(current);
  //创建更新
  const update = createUpdate(lane);
  //要更新的虚拟DOM
  update.payload = { element }; //h1
  //把此更新对象添加到current这个根Fiber的更新队列上,返回根节点
  const root = enqueueUpdate(current, update, lane);
  // 进行调度
  scheduleUpdateOnFiber(root, current, lane, eventTime);
}

```


### wookLoop

React 渲染可以概括为：两大阶段，五小阶段

**render 阶段**

- beginWork:根据当前的`FiberRoot Node`构建`子Fiber Node`，以及在`update`时，标记`Placement`和`ChildDeletion`

- completeWork:完成一个 Fiber 节点，构建DOM，查找兄弟节点以及向上递归

**commit 阶段**

- commitRoot:提交渲染完的根节点。

- commitMutationEffectsOnFiber:通过`recursivelyTraverseMutationEffects`遍历子节点，处理子节点上的副作用。

- commitReconciliationEffects:往真实 DOM 树中插入 DOM 节点。

### beginWork

`beginWork` 函数自身就是一个简单的基于 `fiber.tag` 的 switch 语句，这个阶段的逻辑主要在各个分支函数中。`beginWork` 最主要的工作：

协调。根据 beginWork 函数中 传入的 `current` 和 `workinProgress` 构建新的 Fiber 链表，即 DOM DIFF。

标记副作用。在协调子元素的过程中，会根据子元素是否增删改，从而将新的 newFiber 子节点的 flags 更新为对应的值。

返回新的子 fiber 节点作为下一个工作的 fiber 节点

模拟 React 中 `processUpdateQueue`函数，根据老状态和更新队列中的更新计算最新的状态，与 hook 中的更新队列一样，都是循环链表

![avatar](../img/createUpdateQueue.png)

```javaScript
/**
 * 建立排队更新
 */
function enqueueUpdate(fiber, update) {
  const updateQueue = fiber.updateQueue;
  const shared = updateQueue.shared;
  const pending = shared.pending;
  // 如果是空的，next指向自己
  if (pending === null) {
    update.next = update;
  } else {
    //如果更新队列不为空的话，取出第一个更新
    update.next = pending.next;
    //然后让原来队列的最后一个的next指向新的next，
    pending.next = update;
  }
  // pending永远指向最后一个更新,最后一个更新next指向第一个更新
  updateQueue.shared.pending = update;
}
/**
 * 更新最终的队列
 */
function processUpdateQueue(fiber) {
  const queue = fiber.updateQueue;
  const pending = queue.shared.pending;
  if (pending !== null) {
    queue.shared.pending = null;
    //最后一个更新
    const lastPendingUpdate = pending;
    const firstPendingUpdate = lastPendingUpdate.next;
    //把环状链接剪开,这里就成了单向链表
    lastPendingUpdate.next = null;
    let newState = fiber.memoizedState;
    let update = firstPendingUpdate;
    // 如果有next就继续循环
    while (update) {
      newState = getStateFromUpdate(update, newState);
      // 指向下一个链表节点
      update = update.next;
    }
    fiber.memoizedState = newState;
  }
}
/**
 * 模拟queue根据老状态计算新状态
 */
function getStateFromUpdate(update, prevState) {
  return Object.assign({}, update.payload, prevState);
}
let fiber = { memoizedState: { sex: "男" } };
initialUpdateQueue(fiber);

let update1 = createUpdate();
update1.payload = { age: 18 };
enqueueUpdate(fiber, update1);

let update2 = createUpdate();
update2.payload = { name: "cc" };
enqueueUpdate(fiber, update2);

// fiber的udpateQueue也就是环形链表
// const fiberRsult = {
//   memoizedState: { sex: "男" },
//   updateQueue: {
//     shared: {
//       pending: {
//         payload: { age: 18 },
//         next: {
//           payload: { name: "cc" },
//           next: [Circular * 1],
//         },
//       },
//     },
//   },
// };

//基于老状态，计算新状态
processUpdateQueue(fiber);
console.log(fiber.memoizedState); // { name: 'cc', age: 18, sex: '男' }

```

### scheduleUpdateOnFiber 计划更新 Root,同步或者异步

```javaScript
/**
 * 计划更新root
 * 源码中此处有一个任务的功能
 * @param {*} root
 */
export function scheduleUpdateOnFiber(root, fiber, lane, eventTime) {
  markRootUpdated(root, lane);
  //确保调度执行root上的更新
  ensureRootIsScheduled(root, eventTime);
}
function ensureRootIsScheduled(root, currentTime) {
  //先获取当前根上执行任务
  const existingCallbackNode = root.callbackNode;
  //把所有饿死的赛道标记为过期
  markStarvedLanesAsExpired(root, currentTime);
  //获取当前优先级最高的车道
  const nextLanes = getNextLanes(root, workInProgressRootRenderLanes); //16
  //如果没有要执行的任务
  if (nextLanes === NoLanes) {
    return;
  }
  //获取新的调度优先级
  let newCallbackPriority = getHighestPriorityLane(nextLanes); //16
  //获取现在根上正在运行的优先级
  const existingCallbackPriority = root.callbackPriority;
  //如果新的优先级和老的优先级一样，则可以进行批量更新
  if (existingCallbackPriority === newCallbackPriority) {
    return;
  }
  if (existingCallbackNode !== null) {
    console.log("cancelCallback");
    Scheduler_cancelCallback(existingCallbackNode);
  }
  //新的回调任务
  let newCallbackNode = null;
  //如果新的优先级是同步的话
  if (newCallbackPriority === SyncLane) {
    //先把performSyncWorkOnRoot添回到同步队列中
    scheduleSyncCallback(performSyncWorkOnRoot.bind(null, root));
    //再把flushSyncCallbacks放入微任务
    queueMicrotask(flushSyncCallbacks);
    //如果是同步执行的话
    newCallbackNode = null;
  } else {
    //如果不是同步，就需要调度一个新的任务
    let schedulerPriorityLevel;
    switch (lanesToEventPriority(nextLanes)) {
      case DiscreteEventPriority:
        schedulerPriorityLevel = ImmediateSchedulerPriority;
        break;
      case ContinuousEventPriority:
        schedulerPriorityLevel = UserBlockingSchedulerPriority;
        break;
      case DefaultEventPriority:
        schedulerPriorityLevel = NormalSchedulerPriority;
        break;
      case IdleEventPriority:
        schedulerPriorityLevel = IdleSchedulerPriority;
        break;
      default:
        schedulerPriorityLevel = NormalSchedulerPriority;
        break;
    }
    newCallbackNode = Scheduler_scheduleCallback(
      schedulerPriorityLevel,
      performConcurrentWorkOnRoot.bind(null, root)
    );
  }
  //在根节点的执行的任务是newCallbackNode
  root.callbackNode = newCallbackNode;
  root.callbackPriority = newCallbackPriority;
   if (workInProgressRoot) return;
   workInProgressRoot = root;
   //告诉 浏览器要执行performConcurrentWorkOnRoot 在此触发更新
   Scheduler_scheduleCallback(NormalSchedulerPriority, performConcurrentWorkOnRoot.bind(null, root));
}

```

### performSyncWorkOnRoot 同步执行

`prepareFreshStack`函数非常重要，这里构建了`workInProgress`树

```javaScript
/**
 * 在根上执行同步工作
 */
function performSyncWorkOnRoot(root) {
  //获得最高优的lane
  const lanes = getNextLanes(root);
  //渲染新的fiber树
  renderRootSync(root, lanes);
  //获取新渲染完成的fiber根节点
  const finishedWork = root.current.alternate;
  root.finishedWork = finishedWork;
  // 提交最终的Root
  commitRoot(root);
  return null;
}
function renderRootSync(root, renderLanes) {
  //如果新的根和老的根不一样，或者新的渲染优先级和老的渲染优先级不一样
  if (
    root !== workInProgressRoot ||
    workInProgressRootRenderLanes !== renderLanes
  ) {
    // 创建Fiber树的替身
    prepareFreshStack(root, renderLanes);
  }
  // 执行工作单元
  workLoopSync();
  return RootCompleted;
}
// 构建双Fiber树
function prepareFreshStack(root, renderLanes) {
  workInProgress = createWorkInProgress(root.current, null);
  workInProgressRootRenderLanes = renderLanes;
  workInProgressRoot = root;
  finishQueueingConcurrentUpdates();
}
/**
 * 基于老的fiber和新的属性创建新的fiber
 * 1.current和workInProgress不是一个对象
 * 2.workInProgress
 *   2.1有两种情况，一种是没有，创建一个新，互相通过alternate指向
 *   2.2 存在alternate,直接复用老的alternate就可以了
 * 复用有两层含义
 * 1.复用老的fiber对象
 * 2.复用老的真实DOM
 * @param {*} current 老fiber
 * @param {*} pendingProps 新属性
 */
export function createWorkInProgress(current, pendingProps) {
  let workInProgress = current.alternate;
  // 如果alternate为null说明是第一次渲染，直接创建新的
  if (workInProgress === null) {
    workInProgress = createFiber(current.tag, pendingProps, current.key);
    workInProgress.type = current.type;
    workInProgress.stateNode = current.stateNode;
    workInProgress.alternate = current;
    current.alternate = workInProgress;
  } else {
  // alternate存在，直接复用老的Fiber上的属性
    workInProgress.pendingProps = pendingProps;
    workInProgress.type = current.type;
    workInProgress.flags = NoFlags;
    workInProgress.subtreeFlags = NoFlags;
    workInProgress.deletions = null;
  }
  workInProgress.child = current.child;
  workInProgress.memoizedProps = current.memoizedProps;
  workInProgress.memoizedState = current.memoizedState;
  workInProgress.updateQueue = current.updateQueue;
  workInProgress.sibling = current.sibling;
  workInProgress.index = current.index;
  workInProgress.ref = current.ref;
  workInProgress.flags = current.flags;
  workInProgress.lanes = current.lanes;
  workInProgress.childLanes = current.childLanes;
  return workInProgress;
}
```
### completeWork

当一个 fiber 节点没有子节点，或者子节点仅仅是单一的字符串或者数字时，说明这个 fiber 节点当前的 `beginWork` 已经完成，可以进入`completeUnitOfWork` 完成工作。

`completeUnitOfWork` 主要工作如下：

- 调用 `completeWork` 创建真实的 DOM 节点，属性赋值等

- 通过调用 `bubbleProperties` 合并 `subtreeFlags`与 `flags`合并副作用

- 如果有兄弟节点，则返回兄弟节点，兄弟节点执行 beginWork。否则继续完成父节点的工作

```javaScript
/**
 * 完成一个fiber节点
 * @param {*} current 老fiber
 * @param {*} workInProgress 新的构建的fiber
 */
export function completeWork(current, workInProgress) {
  const newProps = workInProgress.pendingProps;
  switch (workInProgress.tag) {
    case HostRoot:
      bubbleProperties(workInProgress);
      break;
    //如果完成的是原生节点的话
    case HostComponent:
      ///现在只是在处理创建或者说挂载新节点的逻辑，后面此处分进行区分是初次挂载还是更新
      //创建真实的DOM节点
      const { type } = workInProgress;
      //如果老fiber存在，并且老fiber上真实DOM节点，要走节点更新的逻辑
      if (current !== null && workInProgress.stateNode !== null) {
        updateHostComponent(current, workInProgress, type, newProps);
        if (current.ref !== workInProgress.ref !== null) {
          markRef(workInProgress);
        }
      } else {
        const instance = createInstance(type, newProps, workInProgress);
        //把自己所有的儿子都添加到自己的身上
        appendAllChildren(instance, workInProgress);
        workInProgress.stateNode = instance;
        finalizeInitialChildren(instance, type, newProps);
        if (workInProgress.ref !== null) {
          markRef(workInProgress);
        }
      }
      bubbleProperties(workInProgress);
      break;
    case FunctionComponent:
      bubbleProperties(workInProgress);
      break;
    case HostText:
      //如果完成的fiber是文本节点，那就创建真实的文本节点
      const newText = newProps;
      //创建真实的DOM节点并传入stateNode
      workInProgress.stateNode = createTextInstance(newText);
      //向上冒泡属性
      bubbleProperties(workInProgress);
      break;
  }
}
```
调用`updateHostComponent`，拿到current的老属性和新的newProps，收集属性差异

```javaScript
/**
 * 在fiber(button)的完成阶段准备更新DOM
 * @param {*} current button老fiber
 * @param {*} workInProgress button的新fiber
 * @param {*} type 类型
 * @param {*} newProps 新属性
 */
function updateHostComponent(current, workInProgress, type, newProps) {
  const oldProps = current.memoizedProps;//老的属性
  const instance = workInProgress.stateNode;//老的DOM节点
  //比较新老属性，收集属性的差异
  const updatePayload = prepareUpdate(instance, type, oldProps, newProps);
  //让原生组件的新fiber更新队列等于[]
  workInProgress.updateQueue = updatePayload;
  if (updatePayload) {
    markUpdate(workInProgress);
  }
}
```

```javaScript
export function prepareUpdate(domElement, type, oldProps, newProps) {
  return diffProperties(domElement, type, oldProps, newProps);
}
```

调用`diffProperties`，将差异收集到`updatePayload`数组当中，然后将 workInProgress.updateQueue = updatePayload，然后将副作用标记为更新

```javaScript
export function diffProperties(domElement, tag, lastProps, nextProps) {
  let updatePayload = null;
  let propKey;
  let styleName;
  let styleUpdates = null;
  //处理属性的删除 如果说一个属性在老对象里有，新对象没有的话，那就意味着删除
  for (propKey in lastProps) {
    //如果新属性对象里有此属性，或者老的没有此属性，或者老的是个null
    if (nextProps.hasOwnProperty(propKey) || !lastProps.hasOwnProperty(propKey) || lastProps[propKey] === null) {
      continue;
    }
    if (propKey === STYLE) {
      const lastStyle = lastProps[propKey];
      for (styleName in lastStyle) {
        if (lastStyle.hasOwnProperty(styleName)) {
          if (!styleUpdates) {
            styleUpdates = {};
          }
          styleUpdates[styleName] = '';
        }
      }
    } else {
      (updatePayload = updatePayload || []).push(propKey, null);
    }
  }
  //遍历新的属性对象
  for (propKey in nextProps) {
    const nextProp = nextProps[propKey];//新属性中的值
    const lastProp = lastProps !== null ? lastProps[propKey] : undefined;//老属性中的值
    if (!nextProps.hasOwnProperty(propKey) || nextProp === lastProp || (nextProp === null && lastProp === null)) {
      continue;
    }
    if (propKey === STYLE) {
      if (lastProp) {
        //计算要删除的行内样式
        for (styleName in lastProp) {
          //如果此样式对象里在的某个属性老的style里有，新的style里没有
          if (lastProp.hasOwnProperty(styleName) && (!nextProp || !nextProp.hasOwnProperty(styleName))) {
            if (!styleUpdates)
              styleUpdates = {};
            styleUpdates[styleName] = '';
          }
        }
        //遍历新的样式对象
        for (styleName in nextProp) {
          //如果说新的属性有，并且新属性的值和老属性不一样
          if (nextProp.hasOwnProperty(styleName) && lastProp[styleName] !== nextProp[styleName]) {
            if (!styleUpdates)
              styleUpdates = {};
            styleUpdates[styleName] = nextProp[styleName];
          }
        }
      } else {
        styleUpdates = nextProp;
      }
    } else if (propKey === CHILDREN) {
      if (typeof nextProp === 'string' || typeof nextProp === 'number') {
        (updatePayload = updatePayload || []).push(propKey, nextProp);
      }
    } else {
      (updatePayload = updatePayload || []).push(propKey, nextProp);
    }
  }
  if (styleUpdates) {
    (updatePayload = updatePayload || []).push(STYLE, styleUpdates);
  }
  return updatePayload;//[key1,value1,key2,value2]
}
```


当完成一个节点之后，调用`bubbleProperties`，遍历当前 fiber 的所有子节点，把所有的子节的副作用，以及子节点的子节点的副作用全部合并

```javaScript

function bubbleProperties(completedWork) {
  let newChildLanes = NoLanes;
  let subtreeFlags = NoFlags;
  //遍历当前fiber的所有子节点，把所有的子节的副作用，以及子节点的子节点的副作用全部合并
  let child = completedWork.child;
  while (child !== null) {
    newChildLanes = mergeLanes(newChildLanes, mergeLanes(child.lanes, child.childLanes));
    subtreeFlags |= child.subtreeFlags;
    subtreeFlags |= child.flags;
    child = child.sibling;
  }
  completedWork.childLanes = newChildLanes;
  completedWork.subtreeFlags = subtreeFlags;
}


```

### commitEffects

React中的commit分为三个阶段

+ beforeMutation阶段

+ mutation阶段

+ layout阶段


`renderRootSync`执行完毕，执行`commitRoot`,调用`commitRootImpl`，运行`commitMutationEffectsOnFiber`，进行副作用变更


### commitMutationEffects

commitMutationEffects执行的主要作用就是找到对应flags的fiberNode, 并执行相应的Dom操作。

1. 我们需要向下遍历找到最底部的`subtreeFlags`不为0的fiberNode的子`fiberNode`节点

2. 由于父节点的`subtreeFlags`存在，不代表`child`对应的`flags`存在，可能是`child`对应的`sibling`节点的`flags`存在

3. 所以在找到对应的`subtreeFlags`的`child`的`fiberNode`后，需要在向上遍历，查找对应的`sibling`节点。

4. 就这样一直往上，最终就会把`div fiberNode`对应的`dom`元素，`append`到`root`中

```javaScript
/**
 * 遍历fiber树，执行fiber上的副作用
 * @param {*} finishedWork fiber节点
 * @param {*} root 根节点
 */
export function commitMutationEffectsOnFiber(finishedWork, root) {
  const current = finishedWork.alternate;
  const flags = finishedWork.flags;
  switch (finishedWork.tag) {
    case FunctionComponent:
      {
        //先遍历它们的子节点，处理它们的子节点上的副作用
        recursivelyTraverseMutationEffects(root, finishedWork);
        //再处理自己身上的副作用
        commitReconciliationEffects(finishedWork);
        if (flags & Update) {
          commitHookEffectListUnmount(HookHasEffect | HookLayout, finishedWork);
        }
        break;
      }
    case HostRoot:
    case HostText: {
      //先遍历它们的子节点，处理它们的子节点上的副作用
      recursivelyTraverseMutationEffects(root, finishedWork);
      //再处理自己身上的副作用
      commitReconciliationEffects(finishedWork);
      break;
    }
    case HostComponent: {
      //先遍历它们的子节点，处理它们的子节点上的副作用
      recursivelyTraverseMutationEffects(root, finishedWork);
      //再处理自己身上的副作用
      commitReconciliationEffects(finishedWork);
      if (flags & Ref) {
        commitAttachRef(finishedWork);
      }
      //处理DOM更新
      if (flags & Update) {
        //获取真实DOM
        const instance = finishedWork.stateNode;
        //更新真实DOM
        if (instance !== null) {
          const newProps = finishedWork.memoizedProps;
          const oldProps = current !== null ? current.memoizedProps : newProps;
          const type = finishedWork.type;
          const updatePayload = finishedWork.updateQueue;
          finishedWork.updateQueue = null;
          if (updatePayload) {
            commitUpdate(instance, updatePayload, type, oldProps, newProps, finishedWork);
          }

        }
      }
      break;
    }
    default:
      break;
  }
}
```

```javaScript
/**
 * 递归遍历处理变更的作用
 * @param {*} root 根节点
 * @param {*} parentFiber 父fiber
 */
function recursivelyTraverseMutationEffects(root, parentFiber) {
  //先把父fiber上该删除的节点都删除
  const deletions = parentFiber.deletions;
  if (deletions !== null) {
    for (let i = 0; i < deletions.length; i++) {
      const childToDelete = deletions[i];
      commitDeletionEffects(root, parentFiber, childToDelete);
    }
  }
  //再去处理剩下的子节点
  if (parentFiber.subtreeFlags & MutationMask) {
    let { child } = parentFiber;
    while (child !== null) {
      commitMutationEffectsOnFiber(child, root);
      child = child.sibling;
    }
  }
}
```

### commitReconciliationEffects

`getHostParentFiber`就是获取到对应父`stateNode`，如果是根节点，对应的是`containerInfo`,对应浏览器环境就是`Dom`

```javaScript
/**
 * 把此fiber的真实DOM插入到父DOM里
 * @param {*} finishedWork 
 */
function commitPlacement(finishedWork) {
  const parentFiber = getHostParentFiber(finishedWork);
  switch (parentFiber.tag) {
    case HostRoot: {
      const parent = parentFiber.stateNode.containerInfo;
      const before = getHostSibling(finishedWork);//获取最近的弟弟真实DOM节点
      insertOrAppendPlacementNode(finishedWork, before, parent);
      break;
    }
    case HostComponent: {
      const parent = parentFiber.stateNode;
      const before = getHostSibling(finishedWork);
      insertOrAppendPlacementNode(finishedWork, before, parent);
      break;
    }
    default:
      break;
  }
}
```
### insertOrAppendPlacementNode

把子节点对应的真实DOM插入到父节点DOM中

```javaScript
/**
 * 把子节点对应的真实DOM插入到父节点DOM中
 * @param {*} node 将要插入的fiber节点
 * @param {*} parent 父真实DOM节点
 */
function insertOrAppendPlacementNode(node, before, parent) {
  const { tag } = node;
  //判断此fiber对应的节点是不是真实DOM节点
  const isHost = tag === HostComponent || tag === HostText;
  //如果是的话直接插入
  if (isHost) {
    const { stateNode } = node;
    if (before) {
      insertBefore(parent, stateNode, before);
    } else {
      appendChild(parent, stateNode);
    }
  } else {
    //如果node不是真实的DOM节点，获取它的大儿子
    const { child } = node;
    if (child !== null) {
      //把大儿子添加到父亲DOM节点里面去
      insertOrAppendPlacementNode(child, before, parent)
      let { sibling } = child;
      while (sibling !== null) {
        insertOrAppendPlacementNode(sibling, before, parent)
        sibling = sibling.sibling;
      }
    }
  }
}
```

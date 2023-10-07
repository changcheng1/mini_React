<!--
 * @Author: changcheng
 * @LastEditTime: 2023-10-07 14:37:21
-->
### useLayoutEffect

1. 其函数签名与 useEffect 相同，但它会在所有的 DOM 变更之后同步调用 effect

2. useEffect不会阻塞浏览器渲染，而 useLayoutEffect 会浏览器渲染

3. useEffect会在浏览器渲染结束后执行,useLayoutEffect 则是在 DOM 更新完成后,浏览器绘制之前执行

`mountLayoutEffect`函数与`mountEffect`相比，这里的区别是一个传入了`UpdateEffect`标识一个传入了`PassiveEffect`标识

```javaScript
function mountLayoutEffect(create, deps) {
  return mountEffectImpl(UpdateEffect, HookLayout, create, deps);
}
```
在执行完`commitMutationEffectsOnFiber`函数，DOM进行变更，但是还没有渲染之前，执行`commitLayoutEffects`

```javaScript
function commitRootImpl(root) {
  //先获取新的构建好的fiber树的根fiber tag=3
  const { finishedWork } = root;
  workInProgressRoot = null;
  workInProgressRootRenderLanes = NoLanes;
  root.callbackNode = null;
  root.callbackPriority = NoLane;
  //合并统计当前新的根上剩下的车道
  const remainingLanes = mergeLanes(
    finishedWork.lanes,
    finishedWork.childLanes
  );
  markRootFinished(root, remainingLanes);
  if (
    (finishedWork.subtreeFlags & Passive) !== NoFlags ||
    (finishedWork.flags & Passive) !== NoFlags
  ) {
    if (!rootDoesHavePassiveEffect) {
      rootDoesHavePassiveEffect = true;
      Scheduler_scheduleCallback(NormalSchedulerPriority, flushPassiveEffect);
    }
  }
  //判断子树有没有副作用
  const subtreeHasEffects =
    (finishedWork.subtreeFlags & MutationMask) !== NoFlags;
  const rootHasEffect = (finishedWork.flags & MutationMask) !== NoFlags;
  //如果自己的副作用或者子节点有副作用就进行提交DOM操作
  if (subtreeHasEffects || rootHasEffect) {
    //当DOM执行变更之后
    commitMutationEffectsOnFiber(finishedWork, root);
    //执行layout Effect
    commitLayoutEffects(finishedWork, root);
    if (rootDoesHavePassiveEffect) {
      rootDoesHavePassiveEffect = false;
      rootWithPendingPassiveEffects = root;
    }
  }
  //等DOM变更后，就可以把让root的current指向新的fiber树
  root.current = finishedWork;
  //在提交之后，因为根上可能会有跳过的更新，所以需要重新再次调度
  ensureRootIsScheduled(root, now());
}
```

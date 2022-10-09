/*
 * @Author: changcheng
 * @LastEditTime: 2022-10-08 21:11:35
 */
import { createHostRootFiber } from './ReactFiber'
import { createLaneMap, NoLane, NoLanes, NoTimestamp } from './ReactFiberLane'
import { FiberRoot } from './ReactInternalTypes'
import { RootTag } from './ReactRootTags'
import { initializeUpdateQueue } from './ReactUpdateQueue'

class FiberRootNode {
  callbackNode = null
  pendingLanes = NoLanes
  expiredLanes = NoLanes
  finishedWork = null
  current = null as any
  eventTimes = createLaneMap(NoLanes)
  expirationTimes = createLaneMap(NoTimestamp)
  callbackPriority = NoLane
  constructor(public containerInfo: any, public tag: RootTag) {}
}

/**
 *
 * @param containerInfo 当前创建fiber树所在的dom节点由createRoot方法传入
 * @param tag 决定fiber树是以什么模式创建的(concurrent,blocking)
 * @returns 返回FiberRoot（整个应用的根节点，其中current保存有当前页面所对应的fiber树）
 */
export const createFiberRoot = (
  containerInfo: any,
  tag: RootTag
): FiberRoot => {
  // 创建真实根节点,containerInfo包含真实dom
  const fiberRoot: FiberRoot = new FiberRootNode(containerInfo, tag)
  // 创建fiber树的根节点
  const hostRootFiber = createHostRootFiber(tag)
  // 当前fiberRoot的current指向根fiber
  fiberRoot.current = hostRootFiber
  // 让fiber根的真实dom节点指向fiberRoot的div
  hostRootFiber.stateNode = fiberRoot

  initializeUpdateQueue(hostRootFiber)

  return fiberRoot
}

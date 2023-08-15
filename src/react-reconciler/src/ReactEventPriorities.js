import {
  NoLane, SyncLane, InputContinuousLane, DefaultLane, IdleLane,
  getHighestPriorityLane, includesNonIdleWork
} from './ReactFiberLane';

//离散事件优先级 click onchange
export const DiscreteEventPriority = SyncLane;//1
//连续事件的优先级 mousemove 
export const ContinuousEventPriority = InputContinuousLane;//4
//默认事件车道
export const DefaultEventPriority = DefaultLane;//16 
//空闲事件优先级 
export const IdleEventPriority = IdleLane;//

let currentUpdatePriority = NoLane;

export function getCurrentUpdatePriority() {
  return currentUpdatePriority;
}
export function setCurrentUpdatePriority(newPriority) {
  currentUpdatePriority = newPriority;
}

/**
 * 判断eventPriority是不是比lane要小，更小意味着优先级更高
 * @param {*} a 
 * @param {*} b 
 * @returns 
 */
export function isHigherEventPriority(eventPriority, lane) {
  return (eventPriority !== 0) && eventPriority < lane;
}
/**
 * 把lane转成事件优先级
 * lane 31
 * 事件优先级是4
 * 调度优先级5
 * @param {*} lanes 
 * @returns 
 */
export function lanesToEventPriority(lanes) {
  //获取最高优先级的lane
  let lane = getHighestPriorityLane(lanes);
  //如果
  if (!isHigherEventPriority(DiscreteEventPriority, lane)) {
    return DiscreteEventPriority;//1
  }
  if (!isHigherEventPriority(ContinuousEventPriority, lane)) {
    return ContinuousEventPriority;//4
  }
  if (includesNonIdleWork(lane)) {
    return DefaultEventPriority;//16
  }
  return IdleEventPriority;//
}
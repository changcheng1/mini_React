/*
 * @Author: changcheng
 * @LastEditTime: 2023-03-27 17:26:45
 */
import { Fiber } from '../../../react-reconciler/ReactInternalTypes'
import { DOMEventName } from '../DOMEventNames'
import {
  registerSimpleEvents,
  topLevelEventsToReactNames,
} from '../DOMEventProperties'
import {
  accumulateSinglePhaseListeners,
  DispatchQueue,
} from '../DOMPluginEventSystem'
import { EventSystemFlags, IS_CAPTURE_PHASE } from '../EventSystemFlags'
import { AnyNativeEvent } from '../PluginModuleType'
import { SyntheticEvent, SyntheticKeyboardEvent, SyntheticMouseEvent } from '../SyntheticEvent'

const extractEvents = (
  dispatchQueue: DispatchQueue,
  domEventName: DOMEventName,
  targetInst: null | Fiber,
  nativeEvent: AnyNativeEvent,
  nativeEventTarget: null | EventTarget,
  eventSystemFlags: EventSystemFlags,
  targetContainer: EventTarget
): void => {
  let SyntheticEventCtor = SyntheticEvent
  // 不同的事件合成事件是不同的，不同事件对应不同的构造函数
  switch (domEventName) {
    case 'keydown':
    case 'keyup':
      // 合成键盘事件
      SyntheticEventCtor = SyntheticKeyboardEvent
      break
    case 'click':
      // 合成鼠标事件
      SyntheticEventCtor = SyntheticMouseEvent
    default:
      break
  }
  // 类似于通过click找到onClick
  const reactName = topLevelEventsToReactNames.get(domEventName) ?? null
  // 是否是捕获事件
  const inCapturePhase = (eventSystemFlags & IS_CAPTURE_PHASE) !== 0
  const accumulateTargetOnly = !inCapturePhase && domEventName === 'scroll'
  // 从Fiber上提取监听函数
  const listeners = accumulateSinglePhaseListeners(
    targetInst,
    reactName,
    inCapturePhase,
    accumulateTargetOnly
  )

  if (listeners.length) {
    // 如果有监听就创建一个新的监听对象
    const event = new SyntheticEventCtor(
      reactName,
      '',
      null as any,
      nativeEvent as any,
      nativeEventTarget
    )
    // 保存dispatchQueue
    dispatchQueue.push({ event, listeners })
  }
}

export { registerSimpleEvents as registerEvents, extractEvents }

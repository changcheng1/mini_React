import {
  ContinuousEventPriority,
  DefaultEventPriority,
  DiscreteEventPriority,
  getCurrentUpdatePriority,
  setCurrentUpdatePriority,
} from '../../react-reconciler/ReactEventPriorities'
import { Lane } from '../../react-reconciler/ReactFiberLane'
import { discreteUpdates } from '../../react-reconciler/ReactFiberReconciler'
import { Container } from '../ReactDomRoot'
import { DOMEventName } from './DOMEventNames'
import { dispatchEventForPluginEventSystem } from './DOMPluginEventSystem'
import { EventSystemFlags } from './EventSystemFlags'
import { getEventTarget } from './getEventTarget'
import { AnyNativeEvent } from './PluginModuleType'
import { getClosestInstanceFromNode } from './ReactDOMComponentTree'

const dispatchDiscreteEvent = (
  domEventName: DOMEventName,
  eventSymtemFlags: EventSystemFlags,
  container: EventTarget,
  nativeEvent: Event
) => {
  discreteUpdates(
    dispatchEvent,
    domEventName,
    eventSymtemFlags,
    container,
    nativeEvent
  )
}

const attemptToDispatchEvent = (
  domEventName: DOMEventName,
  eventSystemFlags: EventSystemFlags,
  targetContainer: EventTarget,
  nativeEvent: AnyNativeEvent
): null | Container => {
  const nativeEventTarget = getEventTarget(nativeEvent)
  // 从Dom找到Fiber实例
  const targetInst = getClosestInstanceFromNode(nativeEventTarget!)
  // 派发事件
  dispatchEventForPluginEventSystem(
    domEventName,
    eventSystemFlags,
    nativeEvent,
    targetInst,
    targetContainer
  )

  return null
}
/**
 * 
 * @param domEventName 事件名
 * @param eventSystemFlags 事件系统标识 0|4
 * @param targetContainer 目标容器
 * @param nativeEvent 事件真正出发的时候传递过来的原生浏览器事件对象
 */
export const dispatchEvent = (
  domEventName: DOMEventName,
  eventSystemFlags: EventSystemFlags,
  targetContainer: EventTarget,
  nativeEvent: AnyNativeEvent
): void => {
  debugger;
  attemptToDispatchEvent(
    domEventName,
    eventSystemFlags,
    targetContainer,
    nativeEvent
  )
}

const dispatchContinuousEvent = (
  domEventName: DOMEventName,
  eventSystemFlags: EventSystemFlags,
  targetContainer: EventTarget,
  nativeEvent: AnyNativeEvent
) => {
  const previousPriority = getCurrentUpdatePriority()

  try {
    setCurrentUpdatePriority(ContinuousEventPriority)
    dispatchEvent(domEventName, eventSystemFlags, targetContainer, nativeEvent)
  } finally {
    setCurrentUpdatePriority(previousPriority)
  }
}

export const createEventListenerWrapperWithPriority = (
  targetContainer: EventTarget,
  domEventName: DOMEventName,
  eventSymtemFlags: EventSystemFlags 
): Function => {
  const eventPriority = getEventPriority(domEventName)

  let listenerWrapper

  switch (eventPriority) {
    case DiscreteEventPriority:
      listenerWrapper = dispatchDiscreteEvent
      break

    case DefaultEventPriority:
      listenerWrapper = dispatchEvent
      break
    case ContinuousEventPriority:
      listenerWrapper = dispatchContinuousEvent
      break
    default:
      throw new Error('Not Implement')
  }

  return listenerWrapper.bind(
    null,
    domEventName,
    eventSymtemFlags,
    targetContainer
  )
}

export const getEventPriority = (domEventName: DOMEventName): Lane => {
  switch (domEventName) {
    case 'cancel':
    case 'click':
    case 'close':
    case 'contextmenu':
    case 'copy':
    case 'cut':
    case 'auxclick':
    case 'dblclick':
    case 'dragend':
    case 'dragstart':
    case 'drop':
    case 'focusin':
    case 'focusout':
    case 'input':
    case 'invalid':
    case 'keydown':
    case 'keypress':
    case 'keyup':
    case 'mousedown':
    case 'mouseup':
    case 'paste':
    case 'pause':
    case 'play':
    case 'pointercancel':
    case 'pointerdown':
    case 'pointerup':
    case 'ratechange':
    case 'reset':
    case 'seeked':
    case 'submit':
    case 'touchcancel':
    case 'touchend':
    case 'touchstart':
    case 'volumechange':
    // Used by polyfills:
    // eslint-disable-next-line no-fallthrough
    case 'change':
    case 'selectionchange':
    case 'textInput':
    case 'compositionstart':
    case 'compositionend':
    case 'compositionupdate':
    // Only enableCreateEventHandleAPI:
    // eslint-disable-next-line no-fallthrough
    case 'beforeblur':
    case 'afterblur':
    // Not used by React but could be by user code:
    // eslint-disable-next-line no-fallthrough
    case 'beforeinput':
    case 'blur':
    case 'fullscreenchange':
    case 'focus':
    case 'hashchange':
    case 'popstate':
    case 'select':
    case 'selectstart':
      return DiscreteEventPriority
    case 'drag':
    case 'dragenter':
    case 'dragexit':
    case 'dragleave':
    case 'dragover':
    case 'mousemove':
    case 'mouseout':
    case 'mouseover':
    case 'pointermove':
    case 'pointerout':
    case 'pointerover':
    case 'scroll':
    case 'toggle':
    case 'touchmove':
    case 'wheel':
    // Not used by React but could be by user code:
    // eslint-disable-next-line no-fallthrough
    case 'mouseenter':
    case 'mouseleave':
    case 'pointerenter':
    case 'pointerleave':
      return ContinuousEventPriority
    case 'message':
      throw new Error('Not Implement')
    default:
      return DefaultEventPriority
  }
}

/*
 * @Author: changcheng
 * @LastEditTime: 2023-03-28 18:34:01
 */
export const addEventCaptureListenerWithPassiveFlag = (
  target: EventTarget,
  eventType: string,
  listener: Function,
  passive: boolean
) => {
  target.addEventListener(eventType, listener as EventListener, {
    capture: true,
    passive,
  })

  return listener
}

export const addEventCaptureListener = (
  target: EventTarget,
  eventType: string,
  listener: Function
) => {
  target.addEventListener(eventType, listener as EventListener, true)
  return listener
}

export const addEventBubbleListenerWithPassiveFlag = (
  target: EventTarget,
  eventType: string,
  listener: Function,
  passive: boolean
) => {
  target.addEventListener(eventType, listener as EventListener, {
    passive,
  })

  return listener
}

export const addEventBubbleListener = (
  target: EventTarget,
  eventType: string,
  listener: Function
) => {
  target.addEventListener(eventType, listener as EventListener, false)

  return listener
}

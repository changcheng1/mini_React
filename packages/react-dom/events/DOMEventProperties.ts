/*
 * @Author: changcheng
 * @LastEditTime: 2023-03-27 21:24:09
 */
import { DOMEventName } from './DOMEventNames'
import { registerTwoPhaseEvent } from './EventRegistry'
//简化只剩click
const simpleEventPluginEvents = [
  'click',
]
// 映射表
export const topLevelEventsToReactNames: Map<DOMEventName, string> = new Map()

// 注册简单事件
const registerSimpleEvent = (
  domEventName: DOMEventName,
  reactName: string
): void => {
  topLevelEventsToReactNames.set(domEventName, reactName)
  registerTwoPhaseEvent(reactName, [domEventName])
}

export const registerSimpleEvents = () => {
  for (let i = 0; i < simpleEventPluginEvents.length; ++i) {
    const eventName = simpleEventPluginEvents[i]
    const domEventName = eventName.toLowerCase() as DOMEventName
    // 转大写
    const capitalizedEvent = eventName[0].toUpperCase() + eventName.slice(1)
    // 建立映射关系
    registerSimpleEvent(domEventName, 'on' + capitalizedEvent)
  }
}

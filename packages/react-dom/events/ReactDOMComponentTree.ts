/*
 * @Author: changcheng
 * @LastEditTime: 2022-10-25 20:27:08
 */
import { Fiber } from '../../react-reconciler/ReactInternalTypes'
import { Props } from '../ReactDOMHostConfig'

const randomKey = Math.random().toString(36).slice(2)

const internalPropsKey = '__reactProps$' + randomKey
const internalInstanceKey = '__reactFiber$' + randomKey
/**
 * 从真实DOM找到属性对象
 * @param targetNode 
 * @returns 
 */
export const getFiberCurrentPropsFromNode = (node: Element): Props => {
  return (node as any)[internalPropsKey]
}
/**
 * 从真实DOM找到fiber实例
 * @param targetNode 
 * @returns 
 */
export const getClosestInstanceFromNode = (targetNode: Node): Fiber | null => {
  const targetInst = (targetNode as any)[internalInstanceKey]
  return targetInst ?? null
}

export const precacheFiberNode = (hostInst: Fiber, node: Element) => {
  ;(node as any)[internalInstanceKey] = hostInst
}

/**
 * 将jsx的props挂载到对应的dom节点上，待会该dom触发事件时
 * ReactDOM就能从event.target中获取到事件的handlers
 * @param node 要挂再属性的dom节点
 * @param props 要挂载的属性比如 {onClick: () => {}}
 */
export const updateFiberProps = (node: Element, props: Props): void => {
  ;(node as any)[internalPropsKey] = props
}

import { setInitialProperties, diffProperties, updateProperties } from './ReactDOMComponent';
import { precacheFiberNode, updateFiberProps } from './ReactDOMComponentTree';
import { DefaultEventPriority } from 'react-reconciler/src/ReactEventPriorities';
import { getEventPriority } from '../events/ReactDOMEventListener';

export function shouldSetTextContent(type, props) {
  return typeof props.children === "string" || typeof props.children === "number";
}

export function createTextInstance(content) {
  return document.createTextNode(content);
}
/**
 * 在原生组件初次挂载的时候，会通过此方法创建真实DOM
 * @param {*} type 类型 span
 * @param {*} props 属性
 * @param {*} internalInstanceHandle 它对应的fiber
 * @returns 
 */
export function createInstance(type, props, internalInstanceHandle) {
  const domElement = document.createElement(type);
  //预先缓存fiber节点到DOM元素上
  precacheFiberNode(internalInstanceHandle, domElement);
  //把属性直接保存在domElement的属性上
  updateFiberProps(domElement, props);
  return domElement;
}

export function appendInitialChild(parent, child) {
  parent.appendChild(child);
}
export function finalizeInitialChildren(domElement, type, props) {
  setInitialProperties(domElement, type, props);
}
export function appendChild(parentInstance, child) {
  parentInstance.appendChild(child);
}
/**
 * 
 * @param {*} parentInstance 父DOM节点
 * @param {*} child 子DOM节点
 * @param {*} beforeChild 插入到谁的前面，它也是一个DOM节点
 */
export function insertBefore(parentInstance, child, beforeChild) {
  parentInstance.insertBefore(child, beforeChild);
}
export function prepareUpdate(domElement, type, oldProps, newProps) {
  return diffProperties(domElement, type, oldProps, newProps);
}
export function commitUpdate(domElement, updatePayload, type, oldProps, newProps) {
  updateProperties(domElement, updatePayload, type, oldProps, newProps);
  updateFiberProps(domElement, newProps);
}
export function removeChild(parentInstance, child) {
  parentInstance.removeChild(child);
}

export function getCurrentEventPriority() {
  const currentEvent = window.event;
  if (currentEvent === undefined) {
    return DefaultEventPriority;
  }
  return getEventPriority(currentEvent.type);
}
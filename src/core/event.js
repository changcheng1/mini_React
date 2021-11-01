/*
 * @Author: changcheng
 * @LastEditTime: 2021-11-01 19:20:41
 */
// 合成事件
import { updateQueue } from "./component";
/**
 * 给真实Dom添加事件处理函数
 * 1.做兼容性处理，兼容不同的浏览器，不同浏览器的event是不一样的，处理浏览器的兼容性
 * 2.可以在写的事件处理函数之前和之后修改isBatchingUpdate状态，类似于装饰器
 * @param {*} dom  真实dom节点
 * @param {*} eventType 事件类型
 * @param {*} listener 兼容函数
 */
export function addEvent(dom, eventType, listener) {
  // 给dom添加store属性
  let store = dom.store || (dom.store = {});
  console.log(eventType);
  // 存储事件函数
  store[eventType] = listener; // eventType === onclick||onchange||onkeyUp...
  if (!document[eventType]) {
    // 事件委托，不管给哪个DOM上绑事件，最后都代理到ocument上，dispatchEvent，触发事件
    document[eventType] = dispatchEvent;
  }
}
/**
 *
 * @param {*} event 原生event对象
 */
// React中事件函数中event用的是syntheticEvent，也就是经过处理的
// synthetic:合成
let syntheticEvent = {};
// 这里是原生对象event
function dispatchEvent(event) {
  // 队列设置成批量更新
  updateQueue.isBatchingUpdate = true;
  let { target, type } = event; // target == 触发事件的dom type == click||keyUp...
  // 获取事件类型
  let eventType = `$on${type}`; // onClick
  // 劫持所有的事件到syntheticEvent对象上
  createSyntheticEvent(event);
  // 最后一直冒泡到document，把所有的相同类型事件处理函数执行一遍，最后冒泡到document
  while (target) {
    let { store } = target;
    // 获取事件处理函数
    let listener = store && store[eventType];
    // 执行事件函数
    listener && listener.call(target, syntheticEvent);
    // 不停冒泡到父级
    target = target.parentNode;
  }
  // 批量更新一下，同时设置为flase，等待下一次setState
  updateQueue.batchUpdate();
  // 清空合成事件
  for (let key in syntheticEvent) {
    syntheticEvent[key] = {};
  }
}
/**
 *  劫持所有的事件到合成事件对象上
 * @param {*} nativeEvent 原生对象
 */
function createSyntheticEvent(nativeEvent) {
  for (let key in nativeEvent) {
    syntheticEvent[key] = nativeEvent[key];
  }
}

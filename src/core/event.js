/*
 * @Author: changcheng
 * @LastEditTime: 2022-02-19 21:16:42
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
// 这里是原生对象event
function dispatchEvent(event) {
  let { target, type } = event; // target == 触发事件的dom type == click||keyUp...
  // 获取事件类型
  let eventType = `$on${type}`; // onClick
  updateQueue.isBatchingUpdate = true; //把队列设置为批量更新模式
  // 劫持所有的事件到syntheticEvent对象上
  // createSyntheticEvent(event);
  // 最后一直冒泡到document，把所有的相同类型事件处理函数执行一遍，最后冒泡到document
  while (target) {
    // 第一次是获取当前点击的dom
    let { store } = target;
    // 获取事件处理函数
    let listener = store && store[eventType];
    // 执行当前的dom的事件处理函数，传入合成的时间对象
    listener && listener.call(target, syntheticEvent);
    // 不停冒泡到父级
    target = target.parentNode;
  }
  updateQueue.isBatchingUpdate = false; //批量更新设置为false
  // 批量更新一下，同时设置为flase，等待下一次setState
  updateQueue.batchUpdate();
  // 清空合成事件
  // for (let key in syntheticEvent) {
  //   syntheticEvent[key] = {};
  // }
}
/**
 * React中事件函数中event用的是syntheticEvent，也就是经过处理的,React处理了浏览器的兼容性
 * 事件合成对象可以用来兼容主流浏览器的Dom事件
 * 事件池机制，需要时去取，不需要的时候将事件池清空，将所有的事件置为null
 * 劫持所有的事件到合成事件对象上
 * @param {*} nativeEvent 原生对象
 */
let syntheticEvent = {};
// 创建SyntheticEvent对象
function createSyntheticEvent(nativeEvent) {
  for (let key in nativeEvent) {
    syntheticEvent[key] = nativeEvent[key];
  }
  Object.assign(syntheticEvent, syntheticEvent.prototype, {
    // React 兼容了事件冒泡，调用stopPropagation可以兼容IE和W3c
    stopPropagation: function () {
      // 源码在这里获取了原生的event事件
      const event = this.nativeEvent;
      if (!event) {
        return;
      }
      if (event.stopPropagation) {
        event.stopPropagation();
      } else if (typeof event.cancelBubble !== "undefined") {
        event.cancelBubble = true;
      }
    },
  });
}

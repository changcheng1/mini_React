/*
 * @Author: changcheng
 * @LastEditTime: 2021-11-15 21:46:59
 */
import { createDom, compareTwoVdom } from "./react-dom";
export let updateQueue = {
  // 是否是处于批量更新模式
  isBatchingUpdate: false,
  // 避免多次add重复的Updater
  updaters: new Set(),
  // batch:批量
  batchUpdate: function () {
    //更新当前的组件
    for (let updater of this.updaters) {
      updater.updateComponent();
    }
    // 更新完成，设置成false
    this.isBatchingUpdate = false;
    this.updaters.length = 0;
  },
};
class Updater {
  constructor(classInstance) {
    // 类组件的实例
    this.classInstance = classInstance;
    // 第二个参数的回调参数
    this.callBacks = [];
    // 等待生效的状态，可能是一个对象，也可能是一个函数
    this.pendingStates = [];
  }
  addState(partialState, callBack) {
    this.pendingStates.push(partialState);
    // 回调函数判断
    if (typeof callBack === "function") {
      this.callBacks.push(callBack);
    }
    this.emitUpdate();
  }
  //属性和状态改变都要更新组件
  emitUpdate() {
    // 如果是批量更新，缓存Updater
    if (updateQueue.isBatchingUpdate) {
      this.updateComponent();
    } else {
      updateQueue.updaters.add(this);
    }
  }
  updateComponent() {
    let { pendingStates, classInstance } = this;
    // 当前有更新内容的时候
    if (pendingStates.length > 0) {
      this.shouldUpdate(classInstance, this.getState());
    }
  }
  /**
   * 判断组件是否需要更新
   * @param {*} classInstance  组件实例
   * @param {*} nextState 最新的状态
   */
  shouldUpdate(classInstance, nextState) {
    // 不管组件要不要刷新，其组件的state的属性一定会改变
    classInstance.state = nextState;
    // 判断是否需要更新
    if (
      classInstance.shouldComponentUpdate &&
      !classInstance.shouldComponentUpdate(
        classInstance.props,
        classInstance.state
      )
    ) {
      return;
    }
    classInstance.forceUpdate();
  }
  getState() {
    let { classInstance, pendingStates, callBacks } = this;
    let { state } = classInstance;
    // state合并
    pendingStates.forEach((newState) => {
      if (typeof newState === "function") {
        newState = newState(state);
      }
      state = { ...state, ...newState };
    });
    // 清空暂存状态
    pendingStates.length = 0;
    // 清空回调函数
    callBacks.length = 0;
    // 返回新状态
    return state;
  }
}
class Component {
  // 用来区分是类组件还是函数组件
  static isReactComponent = true;
  constructor(props) {
    this.props = props;
    this.state = {};
    this.updater = new Updater(this);
  }
  // partialState:部分状态
  setState(partialState, callBack) {
    this.updater.addState(partialState, callBack);
  }
  forceUpdate() {
    if (this.componentWillUpdate) {
      this.componentWillUpdate();
    }
    // 获取最新的虚拟Dom
    let newRenderVdom = this.render();
    // let oldRenderVdom = this.oldRenderDom;
    // let oldDom = oldRenderVdom.dom;
    // console.log("newRenderVdom", newRenderVdom);
    // console.log("oldRenderVdom", oldRenderVdom);
    // console.log("oldDom", oldDom);
    // 比较虚拟新老两个Dom的差异,domDiff
    // compareTwoVdom(oldDom.parentNode, oldRenderVdom, newRenderVdom);
    // 更新组件实例
    updateClassComponent(this, newRenderVdom);
    if (this.componentDidUpdate) {
      this.componentDidUpdate();
    }
  }
  render() {
    throw new Error("此方法为抽象方法，需要子类实现");
  }
}

/**
 * 更新类组件实例
 * @param {*} classInstance
 * @param {*} Vom
 */
function updateClassComponent(classInstance, newVdom) {
  // 取出这个类组件上次渲染出的真实Dom
  let oldDom = classInstance.dom;
  // 获取新的dom元素
  let newDom = createDom(newVdom);
  // 节点替换
  oldDom.parentNode.replaceChild(newDom, oldDom);
  classInstance.dom = newDom;
}
export default Component;

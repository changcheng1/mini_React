/*
 * @Author: changcheng
 * @LastEditTime: 2022-02-10 15:21:11
 */
import ReactDOM, { compareTwoVdom } from "./react-dom";
// updateQueue和updates是单例的，整个应用只有一份
export let updateQueue = {
  // 是否是处于批量更新模式
  isBatchingUpdate: false,
  // 存放的是组件的实例
  updaters: [],
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
    this.classInstance = classInstance; // 类组件的实例
    this.callBacks = []; // 第二个参数的回调参数
    this.pendingStates = []; // 等待生效的状态，可能是一个对象，也可能是一个函数
  }
  addState(partialState, callBack) {
    this.pendingStates.push(partialState);
    if (typeof callBack === "function") this.callBacks.push(callBack); // 状态更新之后的回调
    this.emitUpdate();
  }
  //属性和状态改变都要更新组件
  emitUpdate(nextProps) {
    this.nextProps = nextProps;
    // 把状态缓存起来，等待下一次更新
    if (!updateQueue.isBatchingUpdate) {
      updateQueue.updaters.push(this);
    } else {
      this.updateComponent();
    }
  }
  updateComponent() {
    let { pendingStates, classInstance, nextProps } = this;
    // 当前有更新内容的时候
    if (nextProps || pendingStates.length > 0) {
      this.shouldUpdate(classInstance, nextProps, this.getState(nextProps));
    }
  }
  /**
   * 判断组件是否需要更新
   * @param {*} classInstance  组件实例
   * @param {*} nextState 最新的状态
   */
  shouldUpdate(classInstance, nextProps, nextState) {
    // 判断是否需要更新
    let willUpdate = true;
    if (
      classInstance.shouldComponentUpdate &&
      !classInstance.shouldComponentUpdate(nextProps, nextState)
    ) {
      willUpdate = false;
    }
    // 判断是否有componentWillUpdate生命周期
    if (willUpdate && classInstance.componentWillUpdate) {
      classInstance.componentWillUpdate();
    }
    // 不管组件要不要刷新，其组件的state和props一定会改变
    if (nextProps) {
      classInstance.props = nextProps;
    }
    // 静态方法getDerivedStateFromProps在类的实例上是没有的
    if (classInstance.constructor.getDerivedStateFromProps) {
      let paritialState = classInstance.constructor.getDerivedStateFromProps(
        nextProps,
        classInstance.state
      );
      if (paritialState) {
        nextState = { nextState, ...paritialState };
      }
    }
    classInstance.state = nextState;
    if (willUpdate) classInstance.forceUpdate();
  }
  getState() {
    //如何计算最新的状态
    let { classInstance, pendingStates } = this;
    let { state } = classInstance;
    pendingStates.forEach((nextState) => {
      //如果pendingState是一个函数的话，传入老状态，返回新状态，再进行合并
      if (typeof nextState === "function") {
        console.log(state);
        nextState = nextState(state);
        console.log(nextState);
      }
      state = { ...state, ...nextState };
    });
    pendingStates.length = 0; //清空数组
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
    // 获取最新的虚拟Dom
    let newRenderVdom = this.render();
    let oldRenderVdom = this.oldRenderDom;
    let oldDom = oldRenderVdom.dom;
    // 深度比较新旧两个虚拟DOM
    let currentRenderVdom = compareTwoVdom(
      oldDom.parentNode, // 父节点
      oldRenderVdom, // 老的虚拟dom
      newRenderVdom // 新的虚拟dom
    );
    this.oldRenderDom = currentRenderVdom;
    if (this.componentDidUpdate) {
      this.componentDidUpdate();
    }
  }
  render() {
    throw new Error("此方法为抽象方法，需要子类实现");
  }
}
export default Component;

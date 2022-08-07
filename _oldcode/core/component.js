import { compareTwoVdom, findDOM } from "./react-dom";
//更新队列
export let updateQueue = {
  isBatchingUpdate: false, //当前是否处于批量更新模式,默认值是false
  updaters: [],
  batchUpdate() {
    //批量更新
    for (let updater of updateQueue.updaters) {
      updater.updateComponent();
    }
    updateQueue.isBatchingUpdate = false;
    updateQueue.updaters.length = 0;
  },
};
class Updater {
  constructor(classInstance) {
    this.classInstance = classInstance; //类组件的实例
    this.pendingStates = []; //等待生效的状态,可能是一个对象，也可能是一个函数
    this.callbacks = [];
  }
  addState(partialState, callback) {
    this.pendingStates.push(partialState); ///等待更新的或者说等待生效的状态
    if (typeof callback === "function") this.callbacks.push(callback); //状态更新后的回调
    this.emitUpdate();
  }
  //一个组件不管属性变了，还是状态变了，都会更新。
  emitUpdate(nextProps) {
    this.nextProps = nextProps;
    if (updateQueue.isBatchingUpdate) {
      //如果当前的批量模式。先缓存updater
      updateQueue.updaters.push(this); //本次setState调用结束
    } else {
      this.updateComponent(); //直接更新组件
    }
  }
  updateComponent() {
    let { classInstance, pendingStates, nextProps } = this;
    // 如果有等待更新的状态对象的话
    if (nextProps || pendingStates.length > 0) {
      shouldUpdate(classInstance, nextProps, this.getState(nextProps));
    }
  }
  getState(nextProps) {
    //如何计算最新的状态
    let { classInstance, pendingStates } = this;
    let { state } = classInstance;
    pendingStates.forEach((nextState) => {
      //如果pendingState是一个函数的话，传入老状态，返回新状态，再进行合并
      if (typeof nextState === "function") {
        nextState = nextState(state);
      }
      state = { ...state, ...nextState };
    });
    pendingStates.length = 0; //清空数组
    // 执行getDerivedStateFromProps方法
    if (classInstance.constructor.getDerivedStateFromProps) {
      let partialState = classInstance.constructor.getDerivedStateFromProps(
        nextProps,
        classInstance.state
      );
      if (partialState) {
        state = { ...state, ...partialState };
      }
    }
    return state;
  }
}
/**
 * 判断组件是否需要更新
 * @param {*} classInstance 组件实例
 * @param {*} nextState  新的状态
 */
function shouldUpdate(classInstance, nextProps, nextState) {
  let willUpdate = true; //是否要更新
  //如果有shouldComponentUpdate方法，并且它的返回值为false的话，那就不更新
  if (
    classInstance.shouldComponentUpdate &&
    !classInstance.shouldComponentUpdate(nextProps, nextState)
  ) {
    willUpdate = false;
  }
  if (willUpdate && classInstance.componentWillUpdate) {
    classInstance.componentWillUpdate();
  }
  //不管要不要更新，新的属性和状态对象都得改了
  if (nextProps) {
    classInstance.props = nextProps;
  }
  // 获取provider的私有value属性
  if (classInstance.constructor.contextType) {
    classInstance.context =
      classInstance.constructor.contextType.Provider._value;
  }
  classInstance.state = nextState; //如果要更新走，组件的更新逻辑
  if (willUpdate) classInstance.updateComponent();
}
export default class Component {
  static isReactComponent = true;
  constructor(props) {
    this.props = props;
    this.state = {};
    this.updater = new Updater(this);
  }
  /**
   *
   * @param {*} partialState 第一个参数可以是函数也可以是对象
   * @param {*} callback 回调函数，用来setState合并并重新渲染后执行
   */
  setState(partialState, callback) {
    this.updater.addState(partialState, callback);
  }
  //一般来说组件的属性和状态变化了才会更新组件
  //如果属性和状态没变，我们也想更新怎么办呢？就可以调用forceUpdate，强制更新
  forceUpdate() {
    let nextState = this.state;
    let nextProps = this.props;
    if (this.constructor.getDerivedStateFromProps) {
      let partialState = this.constructor.getDerivedStateFromProps(
        nextProps,
        nextState
      );
      if (partialState) {
        nextState = { ...nextState, ...partialState };
      }
    }
    this.state = nextState;
    this.updateComponent();
  }
  updateComponent() {
    let newRenderVdom = this.render(); //重新调用render方法，得到新的虚拟DOM
    let oldRenderVdom = this.oldRenderVdom;
    let oldDOM = findDOM(oldRenderVdom);
    let extraArgs =
      this.getSnapshotBeforeUpdate &&
      this.getSnapshotBeforeUpdate(this.props, this.state);
    //深度比较新旧两个虚拟DOM
    compareTwoVdom(oldDOM.parentNode, oldRenderVdom, newRenderVdom);
    this.oldRenderVdom = newRenderVdom;
    if (this.componentDidUpdate) {
      this.componentDidUpdate(this.props, this.state, extraArgs);
    }
  }
}
export class PureComponent extends Component {
  //重写了此方法,只有状态或者 属性变化了才会进行更新，否则 不更新
  shouldComponentUpdate(nextProps, nextState) {
    return (
      !shallowEqual(this.props, nextProps) ||
      !shallowEqual(this.state, nextState)
    );
  }
}
/**
 * 用浅比较 obj1和obj2是否相等，***有问题***，只要引用地址相同，默认就是更新
 * 只要内存地址一样，就认为是相等的，不一样就不相等
 * 插件 Immutable.js 不可变数据
 * @param {} obj1
 * @param {*} obj2
 */
function shallowEqual(obj1, obj2) {
  if (obj1 === obj2)
    //如果引用地址是一样的，就相等.不关心属性变没变
    return true;
  //任何一方不是对象或者 不是null也不相等  null null  NaN!==NaN
  if (
    typeof obj1 !== "object" ||
    obj1 === null ||
    typeof obj2 !== "object" ||
    obj2 === null
  ) {
    return false;
  }
  let keys1 = Object.keys(obj1);
  let keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) {
    return false; //属性的数量不一样，不相等
  }
  for (let key of keys1) {
    if (!obj2.hasOwnProperty(key) || obj1[key] !== obj2[key]) {
      return false;
    }
  }
  return true;
}

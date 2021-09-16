/*
 * @Author: cc
 * @LastEditTime: 2021-09-16 17:36:23
 */
import { updateComponent } from "./react-dom";
// 因为js没有类的改变，所以要区分是类组件还是函数组件

// 旧版的组件的生命周期
// 1. constructor state和props初始化
// 2. UNSAFE_componentWillMount 组件将要挂载
// 3. render 组件渲染
// 4. componentDidMount 组件挂载完成
// 5. shouldComponentUpdate 询问组件是否要更新
// 6. UNSAFE_componentWillUpdate 组件将要更新
// 7. render 组件渲染
// 8. componentDidUpdate 组件将要更新完成

// 旧版的生命周期之所以被废除，因为如果在UNSAFE_componentWillUpdate之类的调用会引起死循环
// 新版的生命周期去除了 UNSAFE_componentWillMount UNSAFE_componetWillUpdate UNSAFE_componentWillReceiveProps
// 新增加了 getDerivedStateFromProps和getSnapShotBeforeUpdate
// getDerivedStateFromProps(nextProps,prevState):将传入的props映射到state nextProps:新属性对象 prevState:老的状态对象
// getSnapshotBeforeUpdate():获取组件更新前的dom，此函数返回的值将传给componentDidUpdate(prevProps,prevState,snopResult)
class Component {
  // 因为函数组件和类组件都是函数组件，所以加字段用来区分
  static isReactComponent = true;
  constructor(props) {
    this.props = props;
    // 更新队列
    this.stateQueue = [];
    // 当是是否处于批量更新的模式
    this.isBatchingUpdate = false;
    // setState支持回调函数
    this.callBacksFn = [];
    // dom的实例
    this.refs = {};
  }
  // setState包含了刷新界面的操作，就是让真实的dom和最新的虚拟Dom保持一致
  // setState三种更新方式
  // 1.this.setState({number:1})
  // 2.this.setState({ number: this.state.number + 1 }, () => console.log(this.state.number)});
  // 3.this.setState(prevState=>({number:pervState.number+1}),()=>{console.log(this.state.number)})
  setState(state, callBackFn) {
    // state存入stateQueue
    this.stateQueue.push(state);
    // 回调函数传入callBacksFn
    if (callBackFn) this.callBacksFn.push(callBackFn);
    // 如果当前不是批量更新就暴力更新
    if (!this.isBatchingUpdate) {
      this.forceUpdate();
    }
  }
  // 暴力更新
  forceUpdate() {
    // 如果没有setState则试图不需要更新，例如通过refs直接修改demo，所以类组件中只有通过setState触发视图更新
    if (this.stateQueue.length === 0) return;
    this.state = this.stateQueue.reduce((prevState, current) => {
      // 因为setState第一个可能是函数，所以进行区分
      let mergeData =
        typeof current === "function" ? current(prevState) : current;
      // state合并
      return {
        ...mergeData,
        ...current,
      };
    }, this.state);
    // 清空队列
    this.stateQueue = [];
    this.callBacksFn.forEach((fn) => fn());
    this.callBacksFn = [];
    // 判断是否要更新组件
    if (
      this.shouldComponentUpdate &&
      !this.shouldComponentUpdate(this.props, this.state)
    ) {
      return;
    }
    // 组件将要更新
    if (this.componentWillUpdate) this.componentWillUpdate();
    // 更新组件
    updateComponent(this);
    // 组件更新完成
    if (this.componentDidUpdate) this.componentDidUpdate();
  }
}
// ref函数
export function createRef() {
  return {
    current: null,
  };
}
// 创建元素
function createElement(type, config, ...children) {
  let props = { ...config, children };
  return {
    type,
    props,
  };
}
// createContext方法
function createContext() {
  function Provider(props) {
    // 共享value值
    Provider.value = props.value;
    return props.children; //直接渲染儿子
  }
  function Consumer(props) {
    // 因为可能会有多个组件的情况
    let children = Array.isArray(props.children) ? props.children[0] : props.children;
    // 执行函数方法，传递Props
    return children(Provider.value);
  }
  // 返回提供者和消费者
  return {
    Provider,
    Consumer,
  };
}
// forWardRef 代理转发，其实就是ref参数传递
// const FocusInput = forwardRef((props, ref) => (
//   <input type="text" ref={ref} />
// ));
function forWardRef(functionComponent) {
  // 实际上是返回一个类组件，类组件传入props和ref，然后执行函数组件，返回类组件
  return class extends Component {
    render() {
      // 这里的this指向生成的forWardRef
      return functionComponent(this.props, this.props.refs);
    }
  };
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  createElement,
  Component,
  createRef,
  forWardRef,
  createContext,
};

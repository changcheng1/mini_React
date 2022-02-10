/*
 * @Author: cc
 * @LastEditTime: 2022-02-10 14:57:30
 */
import React from "./core/react";
import ReactDOM from "./core/react-dom"; //核心库
// ReactDom会保证浏览器的Dom和React元素一致
class ChildCounter extends React.Component {
  state = {
    number: this.props.count,
  };
  // 组件将要接受的参数
  componentWillReceiveProps(nextProps) {
    console.log("子组件componentWillReceiveProps", nextProps);
  }
  // 新版本中可以使用 static getDerivedStateFromProps(nextProps,prevState):从组件的新属性中映射到state
  // 静态方法中的类指向类而不是类的实例，静态方法可以被子类继承
  static getDerivedStateFromProps(nextProps, prevState) {
    console.log("nextProps", nextProps);
    return {
      number: nextProps.count * 2,
    };
  }
  componentDidMount() {
    console.log("子组件componentDidMount 组件挂载完成");
  }
  // shouldComponentUpdate(nextProps, nextState) {
  //   console.log("子组件更新shouldComponentUpdate", nextProps);
  //   return nextProps.count % 2 === 0;
  // }
  render() {
    console.log("子组件render");
    return <span>{this.state.number}</span>;
  }
}
class FunctionClass extends React.Component {
  constructor(props) {
    console.log("constructor 初始化属性和状态对象");
    super(props);
    this.state = {
      count: 1,
    };
  }
  setCount = () => {
    // this.setState(
    //   (lastState) => {
    //     return {
    //       count: lastState.count + 1,
    //     };
    //   },
    //   () => {
    //     console.log(this.state.count);
    //   }
    // );
    this.setState({ count: this.state.count + 1 });
  };
  componentWillMount() {
    console.log("父组件componentWillMount 组件将要挂载");
  }
  componentDidMount() {
    console.log("父组件componentDidMount 组件挂载完成");
  }
  componentWillUpdate() {
    console.log("父组件componentWillUpdate 组件将要更新");
  }
  componentDidUpdate() {
    console.log("父组件componentDidUpdate 组件更新完成");
  }
  componentWillUnmount() {
    console.log("父组件componentWillUnmount 组件将要卸载");
  }
  shouldComponentUpdate(nextPorps, nextState) {
    return this.state.count % 2;
  }
  render() {
    console.log("父组件render");
    return (
      <div className={`counter-${this.state.count} container`}>
        <p>{this.state.count}</p>
        <ChildCounter count={this.state.count} />
        <button
          onClick={() => {
            this.setCount();
          }}
        >
          点击
        </button>
      </div>
    );
  }
}
// 核心渲染方法
ReactDOM.render(<FunctionClass />, document.getElementById("root"));

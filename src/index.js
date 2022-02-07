/*
 * @Author: cc
 * @LastEditTime: 2022-01-29 15:08:18
 */
import React from "./core/react";
import ReactDOM from "./core/react-dom"; //核心库
// ReactDom会保证浏览器的Dom和React元素一致
class ChildCounter extends React.Component {
  componentWillReceiveProps(nextProps) {
    console.log("nextProps", nextProps);
  }
  render() {
    return <span>{this.props.count}</span>;
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
    this.setState({ count: this.state.count + 1 });
  };
  componentWillMount() {
    console.log("componentWillMount 组件将要挂载");
  }
  componentDidMount() {
    console.log("componentDidMount 组件挂载完成");
  }
  componentWillUpdate() {
    console.log("componentWillUpdate 组件将要更新");
  }
  componentDidUpdate() {
    console.log("componentDidUpdate 组件更新完成");
  }
  componentWillReceiveProps(nextProps, nextState) {
    console.log(nextProps, nextState);
  }
  componentWillUnmount() {
    console.log("componentWillUnmount 组件将要卸载");
  }
  shouldComponentUpdate() {
    return this.state.count % 2 === 0;
  }
  render() {
    console.log("render 重新计算新的虚拟DOM");
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

/*
 * @Author: cc
 * @LastEditTime: 2021-11-01 15:47:47
 */
import { render } from "./core/react-dom"; //核心库
import { Component } from "./core/react";
// ReactDom会保证浏览器的Dom和React元素一致
class FunctionClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 1,
    };
  }
  setCount = () => {
    console.log(this.state.count);
    this.setState({ count: this.state.count + 1 });
    console.log(this.state.count);
    this.setState({ count: this.state.count + 1 });
    console.log(this.state.count);
  };
  render() {
    return (
      <div>
        <button
          onClick={() => {
            this.setCount();
          }}
        >
          触发setState
        </button>
        <div>{this.state.count}</div>
      </div>
    );
  }
}
// 核心渲染方法
render(<FunctionClass />, document.getElementById("root"));

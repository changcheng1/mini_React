/*
 * @Author: cc
 * @LastEditTime: 2021-11-15 18:59:30
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
    this.setState({ count: this.state.count + 1 });
    this.setState({ count: this.state.count + 1 });
  };
  render() {
    return (
      <div
        onClick={() => {
          this.setCount();
        }}
      >
        {this.state.count}
      </div>
    );
  }
}
// 核心渲染方法
render(<FunctionClass />, document.getElementById("root"));

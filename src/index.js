/*
 * @Author: cc
 * @LastEditTime: 2022-01-25 14:32:17
 */
import React from "./core/react";
import ReactDOM from "./core/react-dom"; //核心库
// ReactDom会保证浏览器的Dom和React元素一致
class FunctionClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 1,
    };
  }
  setCount = () => {
    this.setState({ count: this.state.count + 1 });
  };
  render() {
    return (
      <div className={`counter-${this.state.count}`}>
        <p>{this.state.count}</p>
        <button
          onClick={() => {
            this.setCount();
          }}
        >
          点击
        </button>
        <p>1</p>
      </div>
    );
  }
}
// 核心渲染方法
ReactDOM.render(<FunctionClass />, document.getElementById("root"));

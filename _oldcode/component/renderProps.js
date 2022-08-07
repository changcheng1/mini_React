/*
 * @Author: changcheng
 * @LastEditTime: 2022-02-23 18:43:19
 */
import React from "react";
import ReactDOM from "../core/react-dom";
// renderProps:组件之间使用一个值为函数的prop共享代码的简单技术
// render组件，取children，传props
// 官网示例
class Mouse extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY,
    });
  }

  render() {
    return (
      <div style={{ height: "100vh" }} onMouseMove={this.handleMouseMove}>
        {this.props.render(this.state)}
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>移动鼠标!</h1>
        <Mouse
          render={(mouse) => (
            <img
              src="/cat.jpg"
              style={{ position: "absolute", left: mouse.x, top: mouse.y }}
            />
          )}
        />
      </div>
    );
  }
}

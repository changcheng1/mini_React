/*
 * @Author: changcheng
 * @LastEditTime: 2022-02-22 19:31:35
 */
import React from "react";
// 高阶组件：一个函数，传入一个组件，返回一个组件，只能类组件了来用
// 1.属性与方法代理：可以用来代理公共属性和方法
let withLoading = (loadingMessag) => (oladComponent) => {
  return class extends React.Component {
    show = () => {
      console.log(`show${loadingMessag}`);
    };
    hide = () => {
      console.log(`hide${loadingMessag}`);
    };
    render() {
      let extraProps = { show: this.show, hide: this.hide };
      return <oladComponent {...extraProps} />;
    }
  };
};
// 装饰器默认传入Hello，作为HOC的参数
@withLoading("加载中")
class Hello extends React.Component {
  render() {
    return (
      <div>
        <button onClick={this.props.show}>显示</button>
        <button onClick={this.props.hide}>隐藏</button>
      </div>
    );
  }
}

// 2.反向继承：可以对老组件进行扩展
class Button extends React.Component {
  state = {
    name: "张三",
  };
  componentDidMount() {
    console.log("Button componentDidMount");
  }
  render() {
    console.log("Button render");
    return <button name={this.state.name} title={this.props.title}></button>;
  }
}
// 给父组件的button增加点击事件和props.children
const wrap = (oldComponent) => {
  return class WrapButton extends oldComponent {
    state = {
      number: 0,
    };
    componentDidMount() {
      super.componentDidMount();
    }
    render() {
      let superElement = super.render(); // 获取父组件元素render结果
      let renderElement = React.cloneElement(
        // 1.克隆元素 2.新属性 3.添加的元素
        // 这里给父组件增加了点击方法
        superElement,
        {
          onClick: this.add,
        },
        this.state.number
      );
      return renderElement;
    }
  };
};
export default Hello;

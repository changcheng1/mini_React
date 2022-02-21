/*
 * @Author: changcheng
 * @LastEditTime: 2022-02-20 20:46:02
 */
import React from "react";
// 高阶组件：一个函数，传入一个组件，返回一个组件，只能类组件了来用
// 1.属性与方法代理
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
export default Hello;

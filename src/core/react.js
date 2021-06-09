/*
 * @Author: cc
 * @LastEditTime: 2021-06-05 19:10:49
 */
// 因为js没有类的改变，所以要区分是类组件还是函数组件
class Component{
  static isReactComponents = true;
  constructor(props){
    this.props = props
  }
}

function createElement(type,config,...children){
  let props = {...config,children}
  return {
    type,
    props
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {createElement,Component}
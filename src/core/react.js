/*
 * @Author: cc
 * @LastEditTime: 2021-06-12 19:14:34
 */
import {updateComponent} from './react-dom'
// 因为js没有类的改变，所以要区分是类组件还是函数组件
class Component{
  // 因为函数组件和类组件都是函数组件，所以加字段用来区分
  static isReactComponent = true;
  
  constructor(props){
    this.props = props
    // 更新队列
    this.stateQueue = [];
    // 当是是否处于批量更新的模式
    this.isBatchingUpdate = false;
  }
  // setState包含了刷新界面的操作，就是让真实的dom和最新的虚拟Dom保持一致
  setState(state){
    this.stateQueue.push(state);
    if(!this.isBatchingUpdate){
      this.forceUpdate()
    }
  }
  // 暴力更新
  forceUpdate(){
    this.state = this.stateQueue.reduce((prevState,current)=>{
      let mergeData = typeof current === 'function' ? current(this.state) : current;
      return {
        ...mergeData,
        ...current
      }
    },this.state)
    // 清空队列
    this.stateQueue = [];
    console.log(this.state)
    // 更新组件
    updateComponent(this)
  }
}
// 创建元素
function createElement(type,config,...children){
  let props = {...config,children}
  return {
    type,
    props
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {createElement,Component}
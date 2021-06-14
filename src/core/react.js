/*
 * @Author: cc
 * @LastEditTime: 2021-06-14 20:23:57
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
    // setState支持回调函数
    this.callBacksFn = []
    // dom的实例
    this.refs = {}
  }
  // setState包含了刷新界面的操作，就是让真实的dom和最新的虚拟Dom保持一致
  setState(state,callBackFn){
    this.stateQueue.push(state);
    if(callBackFn)this.callBacksFn.push(callBackFn);
    if(!this.isBatchingUpdate){
      this.forceUpdate()
    }
  }
  // 暴力更新
  forceUpdate(){
    // 如果没有setState则试图不需要更新，例如通过refs直接修改demo，所以类组件中只有通过setState触发视图更新
    if(this.stateQueue.length === 0 ) return;
    this.state = this.stateQueue.reduce((prevState,current)=>{
      // 因为setState可能会包含函数，所以进行区分
      let mergeData = typeof current === 'function' ? current(prevState) : current;
      // state合并
      return {
        ...mergeData,
        ...current
      }
    },this.state)
    // 清空队列
    this.stateQueue = [];
    // 更新组件
    updateComponent(this)
    this.callBacksFn.forEach(fn=>fn())
    this.callBacksFn = []
  }
}
// ref函数
export function createRef (){
  return {
    current:null
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
export default {createElement,Component,createRef}
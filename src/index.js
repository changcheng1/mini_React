/*
 * @Author: cc
 * @LastEditTime: 2021-09-17 10:45:44
 */
import React from "react"; //核心库
import ReactDOM from "react-dom"; //Dom渲染库
import Context from './component/context'
import {NameComponent,AgeComponent} from './component/HightComponent'
// babel会把jsx语法解析为dom进行渲染，jsx实际上更像js语法
// 什么叫React元素
// 是React应用的最小单位，它描述了屏幕看到的内容
// React元素本质是一个普通的js对象
// ReactDom会保证浏览器的Dom和React元素一致

// function CreateElement(type, config = {}, ...children) {
//   return {
//     type,
//     props: {
//       ...config,
//       children,
//     },
//   };
// }
// 创建元素
// let element = React.createElement("div",{
//   className:"title",
//   style:{
//     color:"red"
//   }
// },"hello",React.createElement("span",null,"world"),React.createElement("h3",{
//   style:{
//     color:"orange"
//   }
// },"111"))
// // 函数组件
// function Welcome(props){
//   return React.createElement("div",{
//     className:"title",
//     style:{
//       color:"red"
//     }
//   },"hello",React.createElement("span",null,"world"))
// }
// // createElement可能是一个函数， 不一定是字符串，原生Dom是字符串，类组件和函数组件是function
// let element1 = React.createElement(Welcome,{})

// 类组件
// class Welcome1 extends React.Component{
//  render(){
//   return React.createElement("div",{
//     className:"title",
//     style:{
//       color:"red"
//     }
//   },"hello",React.createElement("span",null,"world"))
//  }
// }
// let element2 = React.createElement(Welcome1,{})
class SubCounter extends React.Component{
  constructor(props){
    super(props)
    this.container = React.createRef()
    this.state = {
      count:1,
      messages:[]
    }
  }
  componentDidMount(){
    this.timer = setInterval(()=>{
      this.setState({
        messages:[`${this.state.messages.length}`,...this.state.messages]
      })
    },1000)
  }
  // 将props映射到state上
  static getDerivedStateFromProps(nextProps,prevState){
    const {count} = nextProps
    return {
      count:count*2
    }
  }
  // 获取Dom快照 getSnapshotBeforeUpdate
  getSnapshotBeforeUpdate(){
    return this.container.current.scrollHeight
  }
  componentDidUpdate(prevPrpos,prevState,prevScrollHeight){
    // 新的向上的高度
    let nextScrollTop = this.container.current.scrollTop;
    // 内容的高度
    this.container.current.scrollTop = nextScrollTop+(this.container.current.scrollHeight-prevScrollHeight)
  }
  render(){
    let styleObj = {
      width:'100px',
      height:'100px',
      border:'1px solid red',
      overflowY:'scroll'
    }
  return <div refs={this.container} style={styleObj}>
    {/* {this.state.count} */}
      {
        this.state.messages.map((item,index)=>
        <div key={index}>{item}</div>  
        )
      }
  </div>
  }
}
class Counter extends React.Component {
  constructor() {
    super();
    this.state = { number: 1 };
    console.log('constructor 初始化state和props')
  }
  UNSAFE_componentWillMount(){
    console.log('UNSAFE_componentWillMount 组件将要挂载')
  }
  UNSAFE_componentWillUpdate(){
    console.log('UNSAFE_componentWillUpdate 组件将要更新')
  }
  componentDidMount(){
    console.log('componentDidMount 组件挂载完成')
  }
  componentDidUpdate(){
    console.log('componentDidUpdate 组件更新完成')
  }
  shouldComponentUpdate(nextProps,nextState){
    console.log('shouldComponentUpdate 组件是否要更新')
    return true
  }
  add = ()=>{
    this.setState({number:this.state.number+1})
  }
  render() {
    console.log('render 组件渲染')
    return (
      <div>
        {/* {this.state.number} */}
        {/* <SubCounter count={this.state.number}/> */}
        {/* <button onClick={this.add}>
          点击我
        </button> */}
        {/* <Context/> */}
        <NameComponent/>
        <AgeComponent/>
      </div>
    );
  }
}
// 核心渲染方法
ReactDOM.render(<Counter />, document.getElementById("root"));

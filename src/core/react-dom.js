/*
 * @Author: cc
 * @LastEditTime: 2021-12-13 15:02:57
 */
import { addEvent } from "./event";
// 1.把Vdom虚拟dom变成真实Dom
// 2.把虚拟Dom上的属性更新或者同步到Dom上
// 3.把此虚拟Dom的儿子变成真实的Dom挂载到自己的dom上，dom.appendChild
// 4.把自己挂载到容器上
/**
 * render方法才是真的挂载
 * @param {*} vdom  虚拟Dom
 * @param {*} container 要把虚拟Dom转成真实dom并插入到那个容器里面去
 */
function render(vdom, container) {
  let dom = createDom(vdom);
  container.appendChild(dom);
  // 执行挂载完成函数，因为在挂载组件的时候添加了此属性
  dom.componentDidMount && dom.componentDidMount();
}
/**
 * 根据虚拟dom创建真实Dom
 * @param {*} vdom 虚拟Dom
 */
export function createDom(vdom) {
  // 如果是字符串或者数字类型，返回真实文本节点
  if (typeof vdom === "string" || typeof vdom === "number") {
    return document.createTextNode(vdom);
  }
  // 否则就是一个虚拟Dom对象，也就是一个React元素
  let { type, props } = vdom;
  let dom;
  // dom可能是函数组件
  if (typeof type === "function") {
    if (type.isReactComponent) {
      return mountClassComponent(vdom);
    } else {
      return mountFunctionComponent(vdom);
    }
  } else {
    dom = document.createElement(type);
  }
  // 使用虚拟Dom的属性更新刚创建出来的真实Dom的属性
  updateProps(dom, {},props);
  // 如果children是字符串或者数字
  if (
    typeof props.children === "string" ||
    typeof props.children === "number"
  ) {
    dom.textContent = props.children;
  } else if (typeof props.children === "object" && props.children.type) {
    // 当前的元素和当前元素的父级传入
    render(props.children, dom);
    // 如果是个数组，说明儿子不止一个
  } else if (Array.isArray(props.children)) {
    // reconcileChildren:使和谐一致
    reconcileChildren(props.children, dom);
  } else {
    document.textContent = props.children ? props.children.toString() : "";
  }
  // 把真实dom放在vdom的dom属性上，为以后更新做准备
  // 当根据一个vdom创建出一个真实dom以后，真实dom挂载到vdom.dom的属性上
  vdom.dom = dom;
  return dom;
}
/**
 * 使用虚拟Dom属性更新刚创建出来的真实Dom属性
 * @param {*} dom 真实Dom
 * @param {*} newProps 新属性对象
 */
function updateProps(dom, oldProps,newProps) {
  debugger
  for (let key in newProps) {
    if (key === "children") continue;
    if (key === "style") {
      for (let attr in newProps[key]) {
        dom.style[attr] = newProps[key][attr];
      }
      // 处理onClick,onChange之类的事件处理函数
    } else if (key.startsWith("on")) {
      const evenType = key.toLocaleLowerCase();
      dom[evenType] = newProps[key];
      addEvent(dom, evenType, newProps[key]);
    } else if (key === "className") {
      dom.className = newProps[key];
    }
  }
}
/**
 *
 * @param {*} childrenVdom  儿子们的虚拟Dom
 * @param {*} parentDom 父亲的真实Dom
 */
function reconcileChildren(childrenVdom, parentDom) {
  for (let i = 0; i < childrenVdom.length; i++) {
    let childDom = childrenVdom[i];
    render(childDom, parentDom);
  }
}
/**
 * 把一个函数组件虚拟Dom转换成真实Dom
 * @param {*} vdom 虚拟Dom
 */
function mountFunctionComponent(vdom) {
  // 使用对象别名，执行函数，传入pros，拿到函数执行返回的值
  let { type: functionComponent, props } = vdom;
  // 执行函数组件获取虚拟Dom
  let oldRenderVdom = functionComponent(props);
  vdom.oldRenderVdom = oldRenderVdom;
  // 获取函数组件真实的dom
  return createDom(renderVdom);
}
/**
 * 把一个类组件转换成真实Dom
 * 创建类组件实例，调用render方法，将虚拟Dom转换成真实Dom
 * @param {*} vdom
 */
function mountClassComponent(vdom) {
  // 结构类的定义和类的属性对象
  let { type, props } = vdom;
  // 创建类的实例
  const classInstance = new type(props);
  vdom.classInstance = classInstance;
  // 如果有就执行UNSAFE_componentWillMount函数
  if (classInstance.UNSAFE_componentWillMount) {
    classInstance.UNSAFE_componentWillMount();
  }
  // 调用render方法，获取组件的虚拟dom对象
  let oldRenderVdom = classInstance.render();
  classInstance.oldRenderDom = oldRenderVdom;
  // 将老的vdom挂载在类的实例上
  vdom.oldRenderDom = oldRenderVdom;
  // 渲染真实的dom
  let dom = createDom(oldRenderVdom);
  // 判断是否有挂载完成的方法
  if (classInstance.componentDidMount) {
    dom.componentDidMount = classInstance.componentDidMount.bind(classInstance);
  }
  // 为了类组件更新，把真实的dom挂载在类的实例上
  // classInstance.dom = dom;
  return dom;
}
/**
 *
 * @param {*} oldVdomParent 父真实dom
 * @param {*} oldVdom 老的虚拟dom
 * @param {*} newVdom 新的虚拟dom
 */
export function compareTwoVdom(oldVdomParent, oldVdom, newVdom,nextDom) {
   // 老的虚拟Dom和新的虚拟dom都是null
  if(!oldVdom && !newVdom){
  // 如果老的虚拟Dom有，新的虚拟Dom没有
  }else if(oldVdom && !newVdom){
    // 先找到此虚拟dom对应的真实dom
    let currentDom = findDOM(oldVdom)
    if(currentDom){
      parentDom.removeChild(currentDom);
    }
    // 判断是类，并且有卸载方法
    if(oldVdom.classInstance&&oldVdom.componentWillUnmount){
      oldVdom.componentWillUnmount()
    }
  // 如果老的是个null，新的有值，新建DOM节点并且插入
  }else if(!oldVdom && newVdom){
    let newDom = createDom(newVdom);
    if(nextDom){
      parentDom.insertBefore(newDom,nextDom);
    }else{
      parentDom.appendChild(newDom)
    }
  // 老的有，新的也有，但是类型不一样
  }else if(oldVdom && newVdom  &&(oldVdom.type !== newVdom.type)){
    let oldDom = findDOM(oldVdom); // 老的真实dom
    let newDom = findDOM(newVdom); // 新的真实dom
    parentDom.replaceChild(newDom,oldDom)
    /// 判断是类，并且有卸载方法
    if(oldVdom.classInstance && oldVdom.classInstance.componentWillUnmount){
      oldVdom.classInstance.componentWillUnmount();
    }
  // 新的有，老的有，并且类型一样，可以复用老的dom节点，不需要进行重建，进行深入的domDiff
  // 更新自己的属性，另外还要深度比较儿子们
  }else{
    updateElement(oldVdom,newVdom)
  }
}
/**
 * 深度比较两个虚拟dom
 * @param {*} oldVdom 老的VDOM
 * @param {*} newVdom 新的VDOM
 */
function updateElement(oldVdom,newVdom){
  // 先更新属性
  if(typeof oldVdom.type === 'string'){ // 说明是个原生组件
    let currentDom = newVdom.dom = oldVdom.dom;
    debugger;
    updateProps(currentDom,oldVdom.props,newVdom.props)// 更新自己的属性
    // 更新儿子们
    // updateChildren(currentDom,oldVdom.props.children,newVdom.props.children)
  }
}
/**
 * 查找此虚拟dom对应的真实dom
 * @param {*} vdom 
 */
function findDOM(vdom){
 let {type} = vdom;
 let dom;
 if(typeof type === 'function'){
   if(type.isReactComponent){
     dom = findDOM(vdom.classInstance.oldRenderDom);
   }
 }
}
// eslint-disable-next-line import/no-anonymous-default-export
const ReactDOM = {
  render,
  compareTwoVdom
};

export default ReactDOM;

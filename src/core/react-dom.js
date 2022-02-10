/*
 * @Author: cc
 * @LastEditTime: 2022-02-10 15:09:51
 */
import { REACT_TEXT } from "../constants";
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
  // 否则就是一个虚拟Dom对象，也就是一个React元素
  let { type, props } = vdom;
  let dom;
  if (type === REACT_TEXT) {
    // 如果是文本类型
    dom = document.createTextNode(props.content);
  } else if (typeof type === "function") {
    // 如果是函数组件
    if (type.isReactComponent) {
      return mountClassComponent(vdom);
    } else {
      return mountFunctionComponent(vdom);
    }
  } else {
    // 否则就是原生组件
    dom = document.createElement(type);
  }
  updateProps(dom, {}, props); // 使用虚拟Dom的属性更新刚创建出来的真实Dom的属性
  if (typeof props.children === "object" && props.children.type) {
    render(props.children, dom); // 当前的元素和当前元素的父级传入
    // 如果是个数组，说明儿子不止一个
  } else if (Array.isArray(props.children)) {
    reconcileChildren(props.children, dom); // reconcileChildren:融合
  } else {
    document.textContent = props.children ? props.children.toString() : "";
  }
  vdom.dom = dom; // 当根据一个vdom创建出一个真实dom以后，真实dom挂载到vdom.dom的属性上
  return dom;
}
/**
 * 使用虚拟Dom属性更新刚创建出来的真实Dom属性
 * @param {*} dom 真实Dom
 * @param {*} newProps 新属性对象
 */
function updateProps(dom, oldProps, newProps) {
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
  let { type, props } = vdom;
  let oldRenderVdom = type(props);
  vdom.oldRenderVdom = oldRenderVdom;
  return createDom(oldRenderVdom);
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
  if (classInstance.componentWillMount) {
    classInstance.componentWillMount(); // 如果有就执行componentWillMount函数
  }
  let oldRenderVdom = classInstance.render(); // 调用render方法，获取组件的虚拟dom对象
  classInstance.oldRenderDom = oldRenderVdom; // 实例的oldRenderDom身上挂载
  vdom.oldRenderDom = oldRenderVdom; // 将老的vdom挂载在类的实例上
  let dom = createDom(oldRenderVdom); // 渲染真实的dom

  // 判断是否有挂载完成的方法
  if (classInstance.componentDidMount) {
    dom.componentDidMount = classInstance.componentDidMount.bind(classInstance);
  }
  return dom;
}
/**
 *
 * @param {*} oldVdomParent 父真实dom
 * @param {*} oldVdom 老的虚拟dom
 * @param {*} newVdom 新的虚拟dom
 */
export function compareTwoVdom(parentDom, oldVdom, newVdom, nextDom) {
  // 老的虚拟Dom和新的虚拟dom都是null
  if (!oldVdom && !newVdom) {
    return null;
    // 如果老的虚拟Dom有，新的虚拟Dom没有
  } else if (oldVdom && !newVdom) {
    // 先找到此虚拟dom对应的真实dom
    let currentDom = findDOM(oldVdom);
    if (currentDom) {
      parentDom.removeChild(currentDom);
    }
    // 判断是类，并且有卸载方法
    if (oldVdom.classInstance && oldVdom.componentWillUnmount) {
      oldVdom.componentWillUnmount();
    }
    return null;
    // 如果老的是个null，新的有值，新建DOM节点并且插入
  } else if (!oldVdom && newVdom) {
    let newDom = createDom(newVdom);
    if (nextDom) {
      parentDom.insertBefore(newDom, nextDom);
    } else {
      parentDom.appendChild(newDom);
    }
    return newVdom;
    // 老的有，新的也有，但是类型不一样
  } else if (oldVdom && newVdom && oldVdom.type !== newVdom.type) {
    let oldDom = findDOM(oldVdom); // 老的真实dom
    let newDom = findDOM(newVdom); // 新的真实dom
    parentDom.replaceChild(newDom, oldDom);
    /// 判断是类，如果有卸载方法就执行一下
    if (oldVdom.classInstance && oldVdom.classInstance.componentWillUnmount) {
      oldVdom.classInstance.componentWillUnmount();
    }
    // 新的有，老的有，并且类型一样，可以复用老的dom节点，不需要进行重建，进行深入的domDiff
    // 更新自己的属性，另外还要深度比较儿子们
  } else {
    updateElement(oldVdom, newVdom);
    return newVdom;
  }
}
/**
 * 深度比较两个虚拟dom
 * @param {*} oldVdom 老的VDOM
 * @param {*} newVdom 新的VDOM
 */
function updateElement(oldVdom, newVdom) {
  if (oldVdom.type === REACT_TEXT) {
    //文件节点
    let currentDOM = (newVdom.dom = oldVdom.dom); //复用老的真实DOM节点
    if (currentDOM.textContent === newVdom.props.content) return; // 新老内容相同跳过更新
    currentDOM.textContent = newVdom.props.content; //直接修改老的DOM节点的文件就可以了
  } else if (typeof oldVdom.type === "string") {
    //说明是个原生组件 div
    let currentDOM = (newVdom.dom = oldVdom.dom); //复用老的DIV的真实DOM
    updateProps(currentDOM, oldVdom.props, newVdom.props); //更新自己的属性
    //更新儿子们 只有原生的组件 div span之类的才会去深度对比
    updateChildren(currentDOM, oldVdom.props.children, newVdom.props.children);
    // 老的dom是个组件
  } else if (typeof oldVdom.type === "function") {
    if (oldVdom.type.isReactComponent) {
      updateClassComponent(oldVdom, newVdom); //老的和新的都是类组件，进行类组件更新
    } else {
      updateFunctionComponent(oldVdom, newVdom); //老的和新的都是函数组件，进行函数数组更新
    }
  }
}
/**
 * 如果老的虚拟DOM节点和新的虚拟DOM节点都是类组件的
 * @param {*} oldVdom 老的虚拟DOM节点
 * @param {*} newVdom 新的虚拟DOM节点
 */
function updateClassComponent(oldVdom, newVdom) {
  let classInstance = (newVdom.classInstance = oldVdom.classInstance); //类的实例需要复用。类的实例不管更新多少只有一个
  newVdom.oldRenderVdom = oldVdom.oldRenderVdom; //上一次的这个类组件的渲染出来的虚拟DOM
  // 组件将要接受新的属性
  if (classInstance.componentWillReceiveProps) {
    classInstance.componentWillReceiveProps(classInstance.props);
  }
  //触发组件的更新，要把新的属性传过来
  classInstance.updater.emitUpdate(newVdom.props);
}
/**
 * 更新函数组件
 */
function updateFunctionComponent(oldVdom, newVdom) {
  let parentDOM = findDOM(oldVdom).parentNode;
  let { type, props } = newVdom;
  let oldRenderVdom = oldVdom.oldRenderVdom;
  let newRenderVdom = type(props);
  compareTwoVdom(parentDOM, oldRenderVdom, newRenderVdom);
  newVdom.oldRenderVdom = newRenderVdom;
}
/**
 * 深度比较它的儿子们
 * @param {*} parentDOM 父DOM点
 * @param {*} oldVChildren 老的儿子们
 * @param {*} newVChildren 新的儿子们
 */
function updateChildren(parentDOM, oldVChildren, newVChildren) {
  //因为children可能是对象，也可能是数组,为了方便遍历，全部格式化为数组
  oldVChildren = Array.isArray(oldVChildren) ? oldVChildren : [oldVChildren];
  newVChildren = Array.isArray(newVChildren) ? newVChildren : [newVChildren];
  // 找出最长的vdom数组进行遍历
  let maxLength = Math.max(oldVChildren.length, newVChildren.length);
  // 遍历虚拟vdom，找出老的有，新的没有的节点
  for (let i = 0; i < maxLength; i++) {
    let nextDOM = oldVChildren.find(
      (item, index) => index > i && item && item.dom
    );
    compareTwoVdom(
      parentDOM,
      oldVChildren[i],
      newVChildren[i],
      nextDOM && nextDOM.dom
    );
  }
}
/**
 * 查找此虚拟dom对应的真实dom
 * @param {*} vdom
 */
function findDOM(vdom) {
  let { type } = vdom;
  let dom;
  if (typeof type === "function") {
    //如果是组件的话
    dom = findDOM(vdom.oldRenderVdom);
  } else {
    ///普通的字符串，那说明它是一个原生组件。dom指向真实DOM
    dom = vdom.dom;
  }
  return dom;
}
// eslint-disable-next-line import/no-anonymous-default-export
const ReactDOM = {
  render,
};
export default ReactDOM;

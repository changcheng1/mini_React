/*
 * @Author: cc
 * @LastEditTime: 2022-05-19 17:01:49
 */
import { REACT_TEXT } from "../constants";
import { addEvent } from "./event";
// 存放useState
let hookStates = [];
// 当前第几个useState
let hookIndex = 0;
let scheduleUpdate;
/**
 * 根容器挂载的时候，执行render方法
 * @param {*} vdom  虚拟Dom
 * @param {*} container 要把虚拟Dom转成真实dom并插入到那个容器里面去
 */
function render(vdom, container) {
  mount(vdom, container);
  scheduleUpdate = () => {
    hookIndex = 0; //恢复0，因为函数组件调用初始不是0
    //然后再进行虚拟DOM的比较更新，初次更新两个dom一样的
    compareTwoVdom(container, vdom, vdom);
  };
}
export function mount(vdom, container) {
  let dom = createDom(vdom);
  container.appendChild(dom);
}
/**
 * 根据虚拟dom创建真实Dom
 * @param {*} vdom 虚拟Dom
 */
export function createDom(vdom) {
  // 否则就是一个虚拟Dom对象，也就是一个React元素
  let { type, props, ref } = vdom;
  console.log("vdom", vdom);
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
  if (props) {
    updateProps(dom, {}, props); // 使用虚拟Dom的属性更新刚创建出来的真实Dom的属性
    if (typeof props.children === "object" && props.children.type) {
      mount(props.children, dom); // 当前的元素和当前元素的父级传入
      // 如果是个数组，说明儿子不止一个
    } else if (Array.isArray(props.children)) {
      reconcileChildren(props.children, dom); // reconcileChildren:融合
    } else {
      document.textContent = props.children ? props.children.toString() : "";
    }
  }
  vdom.dom = dom; // 当根据一个vdom创建出一个真实dom以后，真实dom挂载到vdom.dom的属性上
  if (ref) {
    ref.current = dom;
  }
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
 * @param {*} childVdom  儿子们的虚拟Dom
 * @param {*} parentDOM 父亲的真实Dom
 */
function reconcileChildren(childrenVdom, parentDOM) {
  for (let i = 0; i < childrenVdom.length; i++) {
    let childVdom = childrenVdom[i];
    mount(childVdom, parentDOM);
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
  // 获取provider中的value属性，给类的context赋值
  if (type.contextType) {
    classInstance.context = type.contextType.Provider._value;
  }
  vdom.classInstance = classInstance;
  if (classInstance.componentWillMount) {
    classInstance.componentWillMount(); // 如果有就执行componentWillMount函数
  }
  // 组件挂载的时候默认执行一次getDerivedStateFromProps
  if (type.getDerivedStateFromProps) {
    let partialState = type.getDerivedStateFromProps(
      classInstance.props,
      classInstance.state
    );
    if (partialState) {
      classInstance.state = { ...classInstance.state, ...partialState };
    }
  }
  let oldRenderVdom = classInstance.render(); // 调用render方法，获取组件的虚拟dom对象
  classInstance.oldRenderVdom = vdom.oldRenderVdom = oldRenderVdom;
  let dom = createDom(oldRenderVdom); // 渲染真实的dom
  // 判断是否有挂载完成的方法
  if (classInstance.componentDidMount) {
    classInstance.componentDidMount();
    // dom.componentDidMount = classInstance.componentDidMount.bind(classInstance);
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
    //在这里执行新的虚拟DOM节点的DidMount事件
    if (newVdom.classInstance && newVdom.classInstance.componentDidMount) {
      newVdom.classInstance.componentDidMount();
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
    //在这里执行新的虚拟DOM节点的DidMount事件
    if (newVdom.classInstance && newVdom.classInstance.componentDidMount) {
      newVdom.classInstance.componentDidMount();
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
export function findDOM(vdom) {
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
/**
 * 为了保证此回调函数不是同步执行，而是在页面渲染完毕执行，包装到宏任务里
 * @param {*} callBack 回调函数
 * @param {*} dependencies 依赖
 */
export function useEffect(callBack, dependencies) {
  if (hookStates[hookIndex]) {
    let [destoryFunction, lastDependencies] = hookStates[hookIndex]; // 取出上一次的依赖进行比较
    let allTheSame = dependencies.every(
      (item, index) => item === lastDependencies[index]
    ); // 每一项进行比较，确定是否有变化决定是否更新
    if (allTheSame) {
      // 如果都一样就不更新
      hookIndex++;
    } else {
      destoryFunction && destoryFunction(); // 执行销毁副作用的函数
      setTimeout(() => {
        // 宏任务等待下一次更新
        let destoryFunction = callBack();
        hookStates[hookIndex++] = [destoryFunction, dependencies];
      });
    }
  } else {
    // 说明是第一次渲染，加上setTimeout，加入宏任务，在渲染之后再执行，宏任务
    setTimeout(() => {
      let destoryFunction = callBack();
      hookStates[hookIndex++] = [destoryFunction, dependencies];
    });
  }
}
/**
 * 几乎和useEffect一样，唯一区别是宏任务执行和微任务执行，堵塞不堵塞的区别,一般用来做拖拽之类的，快速更新
 * useEffect不会阻塞浏览器渲染，而useLayoutEffect会阻塞浏览器渲染
 * useEffect会在浏览器渲染结束后执行，而useLayoutEffect则在dom更新完成，浏览器回执执行执行
 */
export function useLayoutEffect(callBack, dependencies) {
  if (hookStates[hookIndex]) {
    let [destoryFunction, lastDependencies] = hookStates[hookIndex]; // 取出上一次的依赖进行比较
    let allTheSame = dependencies.every(
      (item, index) => item === lastDependencies[index]
    );
    if (allTheSame) {
      hookIndex++;
    } else {
      destoryFunction && destoryFunction(); // 执行销毁副作用的函数
      queueMicrotask(() => {
        let destoryFunction = callBack();
        hookStates[hookIndex++] = [destoryFunction, dependencies];
      });
    }
  } else {
    queueMicrotask(() => {
      let destoryFunction = callBack();
      hookStates[hookIndex++] = [destoryFunction, dependencies];
    });
  }
}
// useState 不支持在if语句中使用，数组是有序的，这样会导致hoookIndex错乱
// 同步才是hook的思维方式，每一次渲染都是一个独立的闭包，所以如果有setTimeout这种情况，以setTimeout最后一次执行为准
// setTimeout(setNumber(number=>number+1))可以获取最近的数据
// **目前版本的useState如果组件卸载会导致index错位，原版当中每一个组件都放在Fiber里，每个组件都有自己的hookStates和hookIndex，所以不会出问题
// fiber的核心就是diff暂停，因为从根节点会整个遍历一遍
// 缓存对象
export function useMemo(factory, deps) {
  if (hookStates[hookIndex]) {
    let [lastMemo, lastDeps] = hookStates[hookIndex];
    let allTheSame = deps.every((item, index) => item === lastDeps[index]);
    if (allTheSame) {
      //每一个hook都要占用一个索引
      hookIndex++;
      return lastMemo;
    } else {
      let newMemo = factory();
      hookStates[hookIndex++] = [newMemo, deps];
      return newMemo;
    }
  } else {
    let newMemo = factory();
    hookStates[hookIndex++] = [newMemo, deps];
    return newMemo;
  }
}
// 缓存函数
export function useCallback(callback, deps) {
  if (hookStates[hookIndex]) {
    let [lastCallback, lastDeps] = hookStates[hookIndex];
    let allTheSame = deps.every((item, index) => item === lastDeps[index]);
    if (allTheSame) {
      //每一个hook都要占用一个索引
      hookIndex++;
      return lastCallback;
    } else {
      hookStates[hookIndex++] = [callback, deps];
      return callback;
    }
  } else {
    hookStates[hookIndex++] = [callback, deps];
    return callback;
  }
}
/**
 *
 * @param {*} initState 可能是值有可能是函数，函数结果指定也是值
 * @returns [state,setState]
 */
export function useState(initState) {
  return useReducer(null, initState);
}
export function useReducer(reducer, initialState) {
  //把老的值取出来，如果没有，就使用默认值
  hookStates[hookIndex] =
    hookStates[hookIndex] ||
    (typeof initialState === "function" ? initialState() : initialState);
  let currentIndex = hookIndex; //闭包，用来确定当前是哪个
  function dispatch(action) {
    let lastState = hookStates[currentIndex]; //获取老状态
    let nextState;
    if (typeof action === "function") {
      // useState可以传入函数 setState(state=>{num:state.num+1})
      nextState = action(lastState);
    } else {
      nextState = action; // 直接赋值
    }
    if (reducer) {
      nextState = reducer(lastState, action); // 说明是useReducer方法
    }
    hookStates[currentIndex] = nextState;
    scheduleUpdate(); //当状态改变后要重新更新应用
  }
  return [hookStates[hookIndex++], dispatch];
}
/**
 *  获取dom真实的dom节点
 * @param {*} initState
 * @returns
 */
export function useRef(initState) {
  hookStates[hookIndex] = hookStates[hookIndex] || { current: initState };
  return hookStates[hookIndex++];
}
// eslint-disable-next-line import/no-anonymous-default-export
const ReactDOM = {
  render,
};
export default ReactDOM;

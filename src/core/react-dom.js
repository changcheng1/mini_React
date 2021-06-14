/*
 * @Author: cc
 * @LastEditTime: 2021-06-14 20:27:10
 */
export function updateComponent(componentInstance) {
  // 根据新的属性和状态得到新的element元素
  let element = componentInstance.render();  // 根据新的element得到新的dom元素
  let {type,props} = element;
  let newDom = createElement(type,props,componentInstance); // 根据新的element得到新的dom元素
  // 新老节点替换，这里进行dom替换视图更新
  componentInstance.dom.parentNode.replaceChild(newDom,componentInstance.dom)
  componentInstance.dom  = newDom
}
function render(element,container,componentInstance){
  if(typeof element === 'string' || typeof element === 'number'){
    return container.appendChild(document.createTextNode(element))
  }
  let type,props;
  type = element.type;
  props = element.props;
  // 判断是否是类组件
  let isReactComponent = type.isReactComponent;
  // 如果是类组件
  if(isReactComponent){
     componentInstance = new type(props); //函数组件执行后会返回一个React元素
     if(componentInstance.componentWillMount) componentInstance.componentWillMount();
    element = componentInstance.render()
    type = element.type; // 重新获得React元素的类型
    props = element.props;// 和属性对象
  }else if(typeof type === 'function'){
    // 取出函数
    element = type(props); //函数组件执行后会返回一个React元素
    type = element.type;
    props = element.props;
  }
  let dom = createElement(type,props,componentInstance)
  if(isReactComponent && componentInstance){
    //componentInstance通过JSX编译之后默认有个dom属性，就是return里面的元素
    // 如果当前渲染的是一个类组件，我们就让这个类组件实例的dom属性指向这个类组件创建出来的真实dom
    // 这里的dom就是createElement返回的dom
    console.log('componentInstance',componentInstance)
    componentInstance.dom = dom
  }
  container.appendChild(dom)
  if(isReactComponent && componentInstance && componentInstance.componentWillUnmount){
    componentInstance.componentWillUnmount()
  }
}
// 合成事件
// 在事件处理函数执行前要把批量更新模式设为true
// 这样的话在函数执行过程中会不会直接更新视图和状态了，只会缓存新的状态在updateQueue里
// 等事件处理函数结束后才会进行实际更新
function addEvent(dom,eventType,listener,componentInstance){
  // 将onClick => onclick
  eventType = eventType.toLocaleLowerCase();
  // 添加 {}，用于存储点击事件和类组件实例，用来更改批量更新标识
  let eventStore= dom.eventStore || (dom.eventStore = {})
  eventStore[eventType] = {listener,componentInstance}
  document.addEventListener(eventType.slice(2),dispatchEvent,false)
}
function dispatchEvent(event){
  let {target} = event;
  while(target){
    // 一直冒泡往上遍历触发点击事件，模拟浏览器的冒泡
    const {eventStore} = target;
    if(eventStore){
      const {listener,componentInstance} = eventStore[`on${event.type}`]
      if(listener){
          // 不触发视图更新
        componentInstance.isBatchingUpdate = true;
        // 触发函数，比如点击事件之类的
        listener.call(componentInstance,event)
        // 改变状态，清空事件队列
        componentInstance.isBatchingUpdate = false;
        // 强制更新视图
        componentInstance.forceUpdate()
      }
    }
    target = target.parentNode;
  }
}
// 抽离创建元素的方法
function createElement(type,props,componentInstance){
  // 创建Dom
  let dom = document.createElement(type);
  for(let propName in props){
    if(propName === 'children'){
      // 如果接下来有多个children，进行递归，传入当前的元素，和他的父元素  
      if(Array.isArray(props.children)){
        props.children.forEach(children=>render(children,dom,componentInstance))
      }else{
        render(props.children,dom,componentInstance)
      }
    }else if(propName === 'className'){
      // 设置className
      dom.className = props[propName]
    }else if (propName === 'style'){
      // 设置style，因为js的属性名就是驼峰所以不需要转
      for(let key in props[propName]){
        dom.style[key] = props[propName][key]
      }
    }else if(propName.startsWith('on')){
      // dom[propName.toLocaleLowerCase()] = props[propName]
      // dom == 点击节点 propName == 点击时间名称 props[propName] == 点击事件函数 componentInstance == 类组件
      addEvent(dom,propName,props[propName],componentInstance)
    }else{
      // 设置属性
      dom.setAttribute(propName,props[propName])
    }
  }
  // 如果Dom上有refs属性的话
  // refs的三种写法 1.字符串 2.函数 3.createRef
  // 1,2只支持类组件，3既支持函数组件也支持类组件
  if(props.refs){
   if(typeof props.refs === 'string'){
      componentInstance.refs[props.refs] = dom
   }else if(typeof props.refs === 'function'){
     props.refs.call(componentInstance,dom)
   }else if(typeof props.refs === 'object'){
     props.refs.current = dom
   }
  }
  return dom
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {render}
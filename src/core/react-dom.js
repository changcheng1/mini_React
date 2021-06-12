/*
 * @Author: cc
 * @LastEditTime: 2021-06-12 19:31:24
 */
export function updateComponent(componentInstance) {
  // 根据新的属性和状态得到新的element元素
  let element = componentInstance.render();
  let {type,props} = element;
  // 根据新的element得到新的dom元素
  let newDom = createElement(type,props);
  // 新老节点替换
  componentInstance.dom.parentNode.replaceChild(newDom,componentInstance.dom)
  componentInstance.dom  = newDom
}
function render(element,container){
  if(typeof element === 'string' || typeof element === 'number'){
    return container.appendChild(document.createTextNode(element))
  }
  let type,props;
  type = element.type;
  props = element.props;
  // 判断是否是类组件
  let isReactComponent = type.isReactComponent;
  let componentInstance;
  // 如果是类组件
  if(isReactComponent){
     componentInstance = new type(props); //函数组件执行后会返回一个React元素
    element = componentInstance.render()
    type = element.type; // 重新获得React元素的类型
    props = element.props;// 和属性对象
  }else if(typeof type === 'function'){
    // 取出函数
    element = type(props); //函数组件执行后会返回一个React元素
    type = element.type;
    props = element.props;
  }
  let dom = createElement(type,props)
  if(isReactComponent && componentInstance){
    componentInstance.dom = dom
  }
  container.appendChild(dom)
}
// 抽离创建元素的方法
function createElement(type,props){
  // 创建Dom
  let dom = document.createElement(type);
  for(let propName in props){
    if(propName === 'children'){
      // 如果接下来有多个children，进行递归，传入当前的元素，和他的父元素  
      if(Array.isArray(props.children)){
        props.children.forEach(children=>render(children,dom))
      }else{
        render(props.children,dom)
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
      dom[propName.toLocaleLowerCase()] = props[propName]
    }else{
      // 设置属性
      dom.setAttribute(propName,props[propName])
    }
  }
  return dom
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {render}
/*
 * @Author: cc
 * @LastEditTime: 2021-06-06 13:04:48
 */
function render(element,root){
  if(typeof element === 'string' || typeof element === 'number'){
    return root.appendChild(document.createTextNode(element))
  }
  let type,props,dom;
  type = element.type;
  props = element.props;
  let isReactComponents = type.isReactComponents;
  // 如果是类组件
  if(isReactComponents){
    let componentInstance = new type(props).render(); //函数组件执行后会返回一个React元素
    type = componentInstance.type;
    props = componentInstance.props;
    //得到最终的demo
    dom = createElement(type,props)
  }else if(typeof type === 'function'){
    // 取出函数
    element = type(props); //函数组件执行后会返回一个React元素
    type = element.type;
    props = element.props;
    //得到最终的demo
    dom = createElement(type,props)
  }else{
    dom = createElement(type,props)
  }
  
  root.appendChild(dom)
}
// 抽离创建元素的方法
function createElement(type,props){
  // 创建Dom
  let dom = document.createElement(type);
  for(let propName in props){
    if(propName === 'children'){
      // 如果接下来有多个children，进行递归，传入当前的元素，和他的父元素  
      props.children.forEach(children=>render(children,dom))
    }else if(propName === 'className'){
      // 设置className
      dom.className = props[propName]
    }else if (propName === 'style'){
      // 设置style，因为js的属性名就是驼峰所以不需要转
      for(let key in props[propName]){
        dom.style[key] = props[propName][key]
      }
    }else{
      // 设置属性
      dom.setAttribute(propName,props[propName])
    }
  }
  return dom
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {render}
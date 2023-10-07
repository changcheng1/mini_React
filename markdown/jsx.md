### 什么是JSX

React主要将页面的结构通过JSX进行描述，每一个`React Element`对象的子节点都会形成对应的`Fiber`,jsx就是通过类似于html的形式进行书写，然后通过`babel`进行转译，在新版本React18中，不再需要手动引入React了，因为`plugin-syntax-jsx`已提前向文件中注入了`_jsxRuntime`api。

### JSX转换

react/jsx-runtime 和 react/jsx-dev-runtime 中的函数只能由编译器转换使用，如果你需要在代码中手动创建元素，你可以继续使用 React.createElement

```javaScript
  const sourceCode =  `<h1>
    hello<span style={{color:'red'}}>world</span>
  </h1>`
  const result = babel.transform(sourceCode,{
      // 现在的runTime类型是automatic batching，更新以优先级进行合并，之前是classic,
      plugins:[["@babel/plugin-transform-react-jsx",{runtime:'automatic'}]]
  });

  // 所以18版本不用引入React了，现在不需要手动引入React这个变量了
  import { jsx } from "react/jsx-runtime";

    jsx("h1", {
      children:["hello",jsx("span",{
        style:{
            color:"red"
        },
        children:"world"
      })]
      children: "hello"
    });
    // 和之前老版本17之前的其实是一个东西
    React.createElement = jsx
```

```javaScript
import ReactCurrentOwner from './ReactCurrentOwner';
import { REACT_ELEMENT_TYPE } from '../shared/ReactSymbols';
function hasValidRef(config) {
    return config.ref !== undefined;
}
function hasValidKey(config) {
    return config.key !== undefined;
}
const RESERVED_PROPS = {
    key: true,
    ref: true,
    __self: true,
    __source: true
}
//是react-babel 将<span>A<span><span>A<span>变成数组了吗？
//createElement(type,config,spanA, );
export function jsxDEV(type, config, children) {
    let propName;//定义一个变量叫属性名
    const props = {};//定义一个元素的props对象
    let key = null;//在兄弟节点中唯一标识自己的唯一性的，在同一个的不同兄弟之间key要求不同
    let ref = null;//ref=React.createRef() "username" this.refs.username {input=>this.username = input} 从而得到真实的DOM元素
    let self = null;//用来获取真实的this指针
    let source = null;//用来定位创建此虚拟DOM元素在源码的位置 哪个文件 哪一行 哪一列
    if (config !== null) {
        if (hasValidRef(config)) {
            ref = config.ref;
        }
        if (hasValidKey(config)) { //校验key是否合法
            key = config.key;
        }
        self = config.__self === undefined ? null : config.__self;
        source = config.__source === undefined ? null : config.__source;
        for (propName in config) {
            if (!RESERVED_PROPS.hasOwnProperty(propName)) { // 排除原型上的属性
                props[propName] = config[propName]
            }
        }
    }
    const childrenLength = arguments.length - 2;
    if (childrenLength === 1) {
        props.children = children;//如果说是独生子的话children是一个对象
    } else if (childrenLength > 1) {
        const childArray = Array(childrenLength);
        for (let i = 0; i < childrenLength; i++) {
            childArray[i] = arguments[i + 2];
        }
        props.children = childArray;//如果说是有多个儿子的话，props.children就是一个数组了
    }
    if (type && type.defaultProps) {
        const defaultProps = type.defaultProps;
        //只有当属性对象没有此属性对应的值的时候，默认属性才会生效，否则直接忽略
        for (propName in defaultProps) {
            if (props[propName] === undefined) {
                props[propName] = defaultProps[propName]
            }
        }
    }
    //ReactCurrentOwner此元素的拥有者
    return ReactElement(
        type, key, ref, self, source, ReactCurrentOwner.current, props
    )
}
function ReactElement(type, key, ref, _self, _source, _owner, props) {
    const element = {
        $$typeof: REACT_ELEMENT_TYPE,
        type, // 类型
        key, // 唯一标识
        ref,  // 用来获取真实Dom元素
        props, // 属性 children style className等
        _owner, // 此元素的拥有者
        _self, //真实的this指针
        _source // 定位打包之后的具体哪一行
    }
    return element;
}
```

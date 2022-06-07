/*
 * @Author: cc
 * @LastEditTime: 2022-06-06 16:24:56
 */
import React from "./core/react";
import ReactDOM from "./core/react-dom"; //核心库
import { PureComponent } from "./core/component";
import { ContextTypeClass } from "./component/ReactContext";
const { Provider, Consumer } = React.createContext();
// ReactDom会保证浏览器的Dom和React元素一致
class ChildCounter extends React.Component {
  constructor(props) {
    super(props);
    this.clientX = 0;
  }
  state = {
    number: this.props.count,
  };
  // 组件将要接受的参数
  // componentWillReceiveProps(nextProps) {
  //   console.log("子组件componentWillReceiveProps", nextProps);
  // }
  // 新版本中可以使用 static getDerivedStateFromProps(nextProps,prevState):从组件的新属性中映射到state
  // 静态方法中的this指向类而不是类的实例，静态方法可以被子类继承
  static getDerivedStateFromProps(nextProps, prevState) {
    console.log("子组件更新getDerivedStateFromProps", nextProps);
    return {
      number: nextProps.count * 3,
    };
  }
  componentDidMount() {
    // forceUpdate 强制更新视图
    // window.addEventListener("mousemove", (event) => {
    //   this.clientX = event.clientX;
    //   this.forceUpdate();
    // });
  }
  shouldComponentUpdate(nextProps, nextState) {
    console.log("子组件更新shouldComponentUpdate", nextProps);
    return nextProps.count % 2 === 0;
  }
  render() {
    console.log("子组件render");
    return (
      <div>
        <span>坐标{this.clientX} </span>
        <span> {this.state.number}</span>
      </div>
    );
  }
}
class FunctionClass extends React.Component {
  constructor(props) {
    console.log("constructor 初始化属性和状态对象");
    super(props);
    this.state = {
      count: 1,
    };
    this.ref = React.createRef();
  }
  setCount = () => {
    // this.setState(
    //   (lastState) => {
    //     return {
    //       count: lastState.count + 1,
    //     };
    //   },
    //   () => {
    //     console.log(this.state.count);
    //   }
    // );
    this.setState({ count: this.state.count + 1 });
  };
  // 用来获取更新前的dom信息，返回值传给componentDidUpdate第三个参数
  getSnapshotBeforeUpdate(prevProps, prevState) {
    return this.ref.current.scrollHeight;
  }
  componentWillMount() {
    console.log("父组件componentWillMount 组件将要挂载");
  }
  componentDidMount() {
    console.log("父组件componentDidMount 组件挂载完成");
  }
  componentWillUpdate() {
    console.log("父组件componentWillUpdate 组件将要更新");
  }
  // 第三个参数是getSnapshotBeforeUpdate返回的值
  componentDidUpdate(state, props, scrollHeight) {
    console.log("父组件componentDidUpdate 组件更新完成", scrollHeight);
  }
  componentWillUnmount() {
    console.log("父组件componentWillUnmount 组件将要卸载");
  }
  // shouldComponentUpdate(nextPorps, nextState) {
  //   return this.state.count % 2;
  // }
  render() {
    console.log("父组件render");
    return (
      <div className={`counter-${this.state.count} container`}>
        <p ref={this.ref}>{this.state.count}</p>
        {/* <ChildCounter count={this.state.count} /> */}
        <button
          onClick={() => {
            this.setCount();
          }}
        >
          点击
        </button>
      </div>
    );
  }
}
function ChildrenFn(props) {
  console.log("子组件渲染");
  return <p>{props.status}</p>;
}
const ChildMemo = React.memo(ChildrenFn);

function reducer(state, action) {
  switch (action.type) {
    case "add":
      return { number: state.number + 1 };
      break;
    case "minus":
      return { number: state.number - 1 };
      break;
    default:
      return state;
      break;
  }
}
function Counter(props) {
  React.useEffect(() => {
    console.log("组件挂载或者更新");
    return () => {
      console.log("组件卸载");
    };
  }, [props.number]);
  return (
    <div>
      <p>{props.number}</p>
    </div>
  );
}
function TestHook() {
  const ref = React.useRef();
  const [count, setCount] = React.useState(1);
  return (
    <div>
      <input ref={ref} />
      <button
        onClick={() => {
          dispatch({ type: "add" });
        }}
      >
        触发子组件
      </button>
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        增加number
      </button>
      <Counter number={count} />
    </div>
  );
}
function ChildRef(props, childRef) {
  let inputRef = React.createRef();
  React.useImperativeHandle(childRef, () => ({
    alertFn() {
      console.log("1");
    },
  }));
  return <input ref={inputRef} />;
}
let ChildComponent = React.forwardRef(ChildRef);
function Parent() {
  const childRef = React.useRef();
  const getFocus = () => {
    childRef.current.alertFn();
  };
  return (
    <div>
      <ChildComponent ref={childRef} />
      <button onClick={getFocus}>点击</button>
    </div>
  );
}

// 核心渲染方法
ReactDOM.render(<TestHook />, document.getElementById("root"));

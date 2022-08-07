import React from "../core/react";
let colorContext = React.createContext({}); // {provider,consumer}
function ChildFn() {
  return (
    <div>
      <colorContext.Consumer>
        {(contextValue) => (
          <p
            style={{
              color: contextValue.color,
            }}
          >
            测试context文字
          </p>
        )}
      </colorContext.Consumer>
    </div>
  );
}
export class ContextTypeClass extends React.Component {
  state = {
    color: "red",
  };
  render() {
    return (
      <div>
        <button
          onClick={() => {
            this.setState({
              color: this.state.color === "red" ? "green" : "red",
            });
          }}
        >
          切换颜色
        </button>
        <colorContext.Provider value={{ color: this.state.color }}>
          <ChildFn></ChildFn>
        </colorContext.Provider>
      </div>
    );
  }
}
class Child extends React.Component {
  static contextType = colorContext;
  render() {
    return (
      <div>
        <p style={{ color: this.context.color }}>测试context文字</p>
      </div>
    );
  }
}

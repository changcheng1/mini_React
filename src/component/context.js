/*
 * @Author: changcheng
 * @LastEditTime: 2021-08-10 18:04:14
 */
import React from "react";
const ThemeContext = React.createContext();
class Panel extends React.Component {
 // 给类属性添加一个contextType，指向ThemeContext，然后这个组件实例上就会多一个this.context
  static contextType = ThemeContext;
  render() {
    return (
      <div
        style={{
          border: `1px solid ${this.context.color}`,
        }}
      >
        Main
      </div>
    );
  }
}
function ContextFn(props){
  return (
    // 如果是函数组件的话返回一个Consumer children ，参数是Provider的value属性
    <ThemeContext.Consumer>
      {
        value=> (
        <div style={{
          color:value.color
        }}>333</div>
        )
      }
    </ThemeContext.Consumer>
  )
}
export default class Content extends React.Component {
  render() {
    return (
      <ThemeContext.Provider value={{
          color:'red'
      }}>
        <div>
          content
          <Panel />
          <ContextFn/>
        </div>
      </ThemeContext.Provider>
    );
  }
}

/*
 * @Author: changcheng
 * @LastEditTime: 2021-09-16 17:29:51
 */
import React from "../core/react";
const ThemeContext = React.createContext();
 class ContextFn1 extends React.Component {
  static contextType = ThemeContext;
  render() {
  // 如果是函数组件的话返回一个Consumer children ，参数是Provider的value属性
  return <div style={{color:this.context.color}}>ContextFn1</div>
  }
}
function ContextFn(props){
   // 如果是函数组件的话返回一个Consumer children ，参数是Provider的value属性
  return <ThemeContext.Consumer>
      {
        value=> (
        <div style={{
          color:value.color
        }}>ContextFn</div>
        )
      }
    </ThemeContext.Consumer>
}

export default class Content extends React.Component {
  render() {
    return (
      <ThemeContext.Provider value={{
          color:'red'
      }}>
        <div>
              page
            <ContextFn/>
            <ContextFn1/>
          </div>
      </ThemeContext.Provider>
    );
  }
}

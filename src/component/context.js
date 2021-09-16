/*
 * @Author: changcheng
 * @LastEditTime: 2021-09-16 15:04:43
 */
import React from "../core/react";
const ThemeContext = React.createContext();
function ContextFn1(props){
  // 如果是函数组件的话返回一个Consumer children ，参数是Provider的value属性
 return <ThemeContext.Consumer>
     {
       value=> (
       <div style={{
         color:value.color
       }}>444</div>
       )
     }
     
   </ThemeContext.Consumer>
}
function ContextFn(props){
   // 如果是函数组件的话返回一个Consumer children ，参数是Provider的value属性
  return <ThemeContext.Consumer>
      {
        value=> (
        <div style={{
          color:value.color
        }}>333</div>
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

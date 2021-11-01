/*
 * @Author: changcheng
 * @LastEditTime: 2021-09-30 17:44:40
 */
import React from 'react'
// 高阶组件：传入一个组件，返回一个组件
// 受控组件就是value值受onChange方法控制 <input value={this.props.id}  onChange={change}/>
// 非受控组件就是defaultValue不受控 <input defaultValue={this.props.id} />

const Name = (props)=>{
    const {value,onChange} = props
    return <input value={value} onChange={onChange}/>
}
const Age = (props)=>{
    const {value,onChange} = props
    return <input value={value} onChange={onChange}/>
}
const FormLocalStorage = (PropsComponent,name)=>{
    return class extends React.Component{
        state = {value:''}
        UNSAFE_componentWillMount(){ 
            let value = localStorage.getItem(name)
            this.setState({value})
        }
        // 绑定当前的this指向
        onChange=(event)=>{
            localStorage.setItem(name,event.target.value)
            this.setState({value:event.target.value})
        }
        render(){
            return <PropsComponent value={this.state.value} onChange={this.onChange}/>
        }
    }
}
export const NameComponent = FormLocalStorage(Name,'name')
export const AgeComponent = FormLocalStorage(Age,'age')
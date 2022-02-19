/*
 * @Author: cc
 * @LastEditTime: 2022-02-19 23:00:02
 */
import Component from "./component";
import { wrapToVdom } from "../utils";
/**
 *
 * @param {*} type  当前元素的类型
 * @param {*} config  配置
 * @param {*} children 儿子或者儿子们
 */
// 抽离创建元素的方法，其实是个递归函数
const React = {
  createElement: function (type, config, children) {
    let ref;
    let key;
    if (config) {
      delete config.__source;
      delete config.__self;
      ref = config.ref;
      delete config.ref;
      key = config.key;
      delete config.key;
    }
    //获取当前所有的属性
    let props = { ...config };
    // 当前参数长度大于3，儿子不止一个，截取config后面所有的children
    if (arguments.length > 3) {
      // 针对文本节点进行处理
      props.children = Array.prototype.slice.call(arguments, 2).map(wrapToVdom);
    } else {
      props.children = wrapToVdom(children);
    }
    return {
      type,
      props,
      key,
      ref,
    };
  },
  Component,
  createRef: () => {
    return { current: null };
  },
  createContext: (initValue) => {
    Provider._value = initValue;
    function Provider(props) {
      if (Provider._value) {
        Object.assign(Provider._value, props.value);
      } else {
        Provider._value = props.value;
      }
      return props.children;
    }
    function Consumer(props) {
      return props.children(Provider._value);
    }
    return { Provider, Consumer };
  },
};
export default React;

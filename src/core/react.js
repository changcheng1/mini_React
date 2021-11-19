/*
 * @Author: cc
 * @LastEditTime: 2021-11-19 17:40:46
 */
import Component from "./component";
/**
 *
 * @param {*} type  当前元素的类型
 * @param {*} config  配置
 * @param {*} children 儿子或者儿子们
 */
// 抽离创建元素的方法，其实是个递归函数
const React = {
  createElement: function (type, config, children) {
    if (config) {
      delete config.__source;
      delete config.__self;
    }
    //获取当前所有的属性
    let props = { ...config };
    // 当前参数长度大于3，儿子不止一个，截取config后面所有的children
    if (arguments.length > 3) {
      children = Array.prototype.slice.call(arguments, 2);
    }
    props.children = children;
    return {
      type,
      props,
    };
  },
  Component,
};

export default React;

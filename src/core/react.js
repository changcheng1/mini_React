/*
 * @Author: cc
 * @LastEditTime: 2022-01-25 14:11:26
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
    if (config) {
      delete config.__source;
      delete config.__self;
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
    };
  },
  Component,
};

export default React;

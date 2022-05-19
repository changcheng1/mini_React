/*
 * @Author: cc
 * @LastEditTime: 2022-05-19 16:53:56
 */
import Component, { PureComponent } from "./component";
import { wrapToVdom } from "../utils";
import {
  useState,
  useMemo,
  useCallback,
  useReducer,
  useEffect,
  useRef,
} from "./react-dom";
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
  createContext: (initialValue = {}) => {
    let context = { Provider, Consumer };
    function Provider(props) {
      // babel会将value值传到私有属性_currentValue上
      context._currentValue = context._currentValue || initialValue;
      Object.assign(context._currentValue, props.value);
      return props.children;
    }
    function Consumer(props) {
      return props.children(context._currentValue);
    }
    return context;
  },
  cloneElement: (oldElement, newProps, ...newChildren) => {
    let children = oldElement.props.children;
    //有可能是一个undefined,一个对象，是一个数组
    if (children) {
      if (!Array.isArray(children)) {
        //如果一个儿子，独生子
        children = [children];
      }
    } else {
      children = [];
    }
    children.push(...newChildren);
    children = children.map(wrapToVdom);
    if (children.length === 0) {
      children = undefined;
    } else if (children.length === 1) {
      children = children[0];
    }
    newProps.children = children;
    let props = { ...oldElement.props, ...newProps };
    return { ...oldElement, props };
  },
  memo: (FunctionComponent) => {
    return class extends PureComponent {
      render() {
        return FunctionComponent(this.props);
      }
    };
  },
  useMemo,
  useCallback,
  useReducer,
  useEffect,
  useRef,
  useState,
};
export default React;

/*
 * @Author: changcheng
 * @LastEditTime: 2022-01-26 10:12:15
 */
import { REACT_TEXT } from "./constants";
/**
 * 为了后续dom diff，对文本节点进行处理
 * @param {*} element 可能是一个React元素，也可以是一个字符串或者数字
 */
export function wrapToVdom(element) {
  return typeof element === "string" || typeof element === "number"
    ? { type: REACT_TEXT, props: { content: element } }
    : element;
}

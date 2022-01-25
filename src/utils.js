import { REACT_TEXT } from "./constants";
/**
 * 为了后面的DOM-DIFF，我把文本节点进行单独的封装或者说标识
 * 不管你原来是什么，都全部包装成React元素的形式。
 * @param {*} element 可能是一个React元素，也可以是一个字符串或者数字
 */
export function wrapToVdom(element) {
  return typeof element === "string" || typeof element === "number"
    ? { type: REACT_TEXT, props: { content: element } }
    : element;
}

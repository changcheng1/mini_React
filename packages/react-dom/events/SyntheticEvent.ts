import { Fiber } from "../../react-reconciler/ReactInternalTypes";
function functionThatReturnsTrue() {
  return true;
}
function functionThatReturnsFalse() {
  return false;
}
export const createSyntheticEvent = (Interface: any) => {
  class SyntheticBaseEvent {
    _reactName: string | null = null;
    _targetInst: Fiber;
    type: string;
    nativeEvent: { [key: string]: unknown };
    target: null | EventTarget;

    constructor(
      reactName: string | null,
      reactEventType: string,
      targetInst: Fiber,
      nativeEvent: { [key: string]: unknown },
      nativeEventTarget: null | EventTarget
    ) {
      this._reactName = reactName;
      this._targetInst = targetInst;
      this.type = reactEventType;
      this.nativeEvent = nativeEvent;
      this.target = nativeEventTarget;
      //选择性的把原生事件对象上的属性，拷贝到合成事件对象实例
      //   for(const propName in Interface){
      //     this[propName]=nativeEvent[propName];
      //   }
      //  this.isDefaultPrevented = functionThatReturnsFalse;//是否阻止了默认事件
      //  this.isPropagationStopped = functionThatReturnsFalse;//是否阻止冒泡了
    }
  }
  // 源码这里做polyfill兼容处理，
  // Object.assign(SyntheticBaseEvent.prototype, {
  //   preventDefault() {},
  //   stopPropagation() {},
  // });
  return SyntheticBaseEvent;
};
/**
 * 合成默认事件
 */
export const SyntheticEvent = createSyntheticEvent({});
/**
 * 合成鼠标事件
 */
export const SyntheticMouseEvent = createSyntheticEvent({
  clientX:0,
  clienY:0
});
/**
 * 合成键盘事件
 */
export const SyntheticKeyboardEvent = createSyntheticEvent({
  ctrlKey: 0,
  shiftKey: 0,
  altKey: 0,
  metaKey: 0,
  repeat: 0,
  locale: 0,
});

/*
 * @Author: changcheng
 * @LastEditTime: 2022-08-10 10:54:08
 */
// @ts-nocheck
// import ReactNoopUpdateQueue from "./ReactNoopUpdateQueue";
function Component(props, context, updater) {
  this.props = props;
  this.context = context;
  this.updater = updater || ReactNoopUpdateQueue;
}

Component.prototype.isReactComponent = {};

Component.prototype.setState = function (partialState, callback) {
  this.updater.enqueueSetState(this, partialState, callback, "setState");
};

Component.prototype.forceUpdate = function (callback) {
  this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
};

export { Component };

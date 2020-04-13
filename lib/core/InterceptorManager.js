'use strict';

var utils = require('./../utils');

// 实例属性handlers
function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 * 原型方法use
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  // handlers数组中推入一个包含fulfilled和rejected方法的对象，这个对象就是拦截器
  // 这2个方法是promise完成和拒绝的2个回调函数
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  // 返回值是最新推入的这个对象在数组中的下标
  return this.handlers.length - 1;
};

/**
 * 原型方法eject，将指定下标的拦截器从handles中删除，内容置为null，下标的位置还是保留的
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 * 原型方法forEach
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  // 对handlers的每一个拦截器，应用forEachHandler方法。
  // 调用fn()方法，拦截器作为参数传入
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;

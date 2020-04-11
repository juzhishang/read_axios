'use strict';


/**
 * 自定义bind函数
 * @param {*} fn 要绑定this的函数
 * @param {*} thisArg 上下文参数
 * @returns 包装函数wrap
 */
module.exports = function bind(fn, thisArg) {
  return function wrap() {
    // 创建类数组arguments的数组副本
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    // this绑定
    return fn.apply(thisArg, args);
  };
};

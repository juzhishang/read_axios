'use strict';

var Cancel = require('./Cancel');

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 * CancelToken构造器
 * @class
 * @param {Function} executor 执行器，必须是一个函数
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  // 创建一个promise实例，把它的resolve方法暂存到变量resolvePromise
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  // 调用执行器，它接收cancel函数作为参数
  // 下面的代码CancelToken.source方法中，创建实例后，cancel方法就会被暴露出来给变量cancel
  executor(function cancel(message) {
    // 如果实例上存在reason，说明已经执行过了
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }
    // 实例化Cancel构造器，暂存为token.reason,作为取消的原因
    token.reason = new Cancel(message);
    // 完成这个promise
    // 把promise的控制权放在executor函数里面
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 * 抛出异常
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 * 添加静态方法
 */
CancelToken.source = function source() {
  var cancel;
  // 又创建一个新的CancelToken实例
  var token = new CancelToken(function executor(c) {
    // 用cancel将executor方法的变量c的控制权拿出来了
    // 这个c就是上面的`function cancel(message) {}`
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;

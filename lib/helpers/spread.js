'use strict';

/**
 * 它是一个高阶函数，接收回调作为参数，返回了一个包装函数wrap
 * wrap函数接收一个数组作为参数，返回回调函数的调用结果，数组作为参数被传入。
 * 因为回调函数是通过fn.apply()方式调用的，所以它实际上是把数组的每一项展开作为回调函数的实参了
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};

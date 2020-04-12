'use strict';

/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 * Cancel构造器
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  // 设置实例属性message
  this.message = message;
}

// 原型上增加toString方法
Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

// 原型属性__CANCEL__为true
Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;

'use strict';
// 通过实例的__CANCEL__属性判断是否已取消
module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};

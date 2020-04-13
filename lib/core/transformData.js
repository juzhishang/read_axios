'use strict';

var utils = require('./../utils');

/**
 * 转换请求或响应的数据data
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns fns可以是一个函数，也可以是函数数组
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  // 遍历应用fns
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};

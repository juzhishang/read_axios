'use strict';

var enhanceError = require('./enhanceError');

/**
 * Create an Error with the specified message, config, error code, request and response.
 * 其实就返回了enhanceError的调用结果，只不过第一个参数传的是err对象
 *
 * @param {string} message 错误信息
 * @param {Object} config The config.
 * @param {string} [code] 错误码 (for example, 'ECONNABORTED').
 * @param {Object} [request] 请求
 * @param {Object} [response] 响应
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};

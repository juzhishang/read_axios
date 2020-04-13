'use strict';

var createError = require('./createError');

/**
 * 根据validateStatus(response.status)决定到底是resolve还是reject
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  // 获取响应的validateStatus方法，它用于定义什么状态码表示成功
  var validateStatus = response.config.validateStatus;
  // response.status或者validateStatus就直接resolve
  // 如果都存在，判断validateStatus(response.status)的结果，再resolve
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    // reject传入的参数是createError的调用结果
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};

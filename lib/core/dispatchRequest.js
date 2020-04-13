'use strict';

var utils = require('./../utils');
var transformData = require('./transformData');
var isCancel = require('../cancel/isCancel');
var defaults = require('../defaults');

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  // 如果配置项中有cancelToken参数，说明cancel已经执行过了，抛出异常。
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  // config.headers如果不存在设默认值{}
  config.headers = config.headers || {};

  // Transform request data
  // 转换请求数据
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  // 合并请求头配置，对于指定的方法的请求头，把它展开后合并
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  // 遍历删除各个特定方法的header配置项，因为上面一段代码已经把该合并的合并了
  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  // 获取适配器，优先使用配置里的，如果没有，使用默认的
  var adapter = config.adapter || defaults.adapter;

  // 返回适配器的调用结果，是个promise。config作为参数传入。
  // then的两个参数是resolve和reject回调。
  return adapter(config).then(function onAdapterResolution(response) {
    // 如果已经取消就抛出异常
    throwIfCancellationRequested(config);

    // 转换响应数据
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    // 如果已取消，抛出异常
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // 转换响应数据
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};

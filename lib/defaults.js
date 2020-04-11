'use strict';

var utils = require('./utils');
// 用于格式化请求头名称的
var normalizeHeaderName = require('./helpers/normalizeHeaderName');

// 默认请求头类型，在xhr中如果是post请求，这个请求头是必需的
var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

// 设置请求头ContentType，如果没有设的话
function setContentTypeIfUnset(headers, value) {
  // headers对象存在，但是headers['Content-Type']不存在的话，设置该值
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

// 获取默认的适配器，浏览器使用xhr适配器，node环境使用http适配器
function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = require('./adapters/xhr');
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = require('./adapters/http');
  }
  return adapter;
}

// 设置defaults对象
var defaults = {
  // 适配器属性adapter
  adapter: getDefaultAdapter(),
  // transformRequest值的每一个fn都会被调用且接收两个参数（data, headers）
  // 这里这个默认函数的功能是：1、格式化请求头名称 2、根据不同的data类型做一些对应的处理
  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],
  // transformResponse的值的每一个函数都会被调用
  // 这里默认的函数它的功能是如果data是字符串，尝试转成json
  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * 超时时间
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,
  // 要用作 xsrf 令牌的值的cookie的名称
  xsrfCookieName: 'XSRF-TOKEN',
  // 携带xsrf令牌值的http头的名称
  xsrfHeaderName: 'X-XSRF-TOKEN',

  // 允许的http响应内容的最大值
  maxContentLength: -1,
  // 正文最大值
  maxBodyLength: -1,

  // 请求成功的状态码默认是>=200且小于300，如果需要修改，可以配置这个validateStatus属性
  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};


defaults.headers = {
  // 通用的请求头是Accept
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

// 这三种类型的请求，它们对应的默认请求头是{}
utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

// 而'post', 'put', 'patch'这三种的默认请求头中需
// 包含'Content-Type': 'application/x-www-form-urlencoded'
utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});
module.exports = defaults;

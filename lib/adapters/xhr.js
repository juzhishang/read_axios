'use strict';

var utils = require('./../utils');
var settle = require('./../core/settle');
var buildURL = require('./../helpers/buildURL');
var buildFullPath = require('../core/buildFullPath');
var parseHeaders = require('./../helpers/parseHeaders');
var isURLSameOrigin = require('./../helpers/isURLSameOrigin');
var createError = require('../core/createError');

module.exports = function xhrAdapter(config) {
  // 方法返回一个promise实例
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    // 从config中获取请求传入的data和请求头
    var requestData = config.data;
    var requestHeaders = config.headers;

    // 如果data是formdata类型，删除请求头Content-Type
    // 因为这种情况浏览器会自己设置
    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    // 创建一个xhr实例
    var request = new XMLHttpRequest();

    // HTTP basic authentication
    // 如果有auth配置项，设置请求头Authorization
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      // btoa用于创建一个 base-64 编码的 ASCII 字符串，其中字符串中的每个字符都被视为一个二进制数据字节。（ie10及以上才开始支持）
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    // 根据基础路径和请求路径，得到完整路径
    var fullPath = buildFullPath(config.baseURL, config.url);
    // 打开请求
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // 设置请求超时时间（单位是毫秒）
    request.timeout = config.timeout;

    // Listen for ready state
    // readyState为4表示已完成
    request.onreadystatechange = function handleLoad() {
      if (!request || request.readyState !== 4) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      // 如果请求报错没有获取到响应，就会触发onerror处理
      // 有一个例外，请求使用了文件协议，大多数浏览器会返回状态0即使请求成功了
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        // 如果响应的状态码为0，并且响应的最终url是file协议就return
        return;
      }

      // Prepare the response
      // 如果xhr支持getAllResponseHeaders方法，就调用该方法获取到请求头字符串，然后将它转为对象赋值给responseHeaders
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      // 如果responseType不存在，responseData值为true
      // 如果responseType存在，判断它的值是否是text，如果是，responseData值为equest.responseText，否则值为request.response
      // 也就是说根据responseType，来决定responseData的值
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      // 设置response对象
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };
      // 调用这个方法来决定resolve或者reject
      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle browser request cancellation (as opposed to a manual cancellation)
    // 监听中止
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }
      // 失败
      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    // 监听出错
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    // 超时处理
    request.ontimeout = function handleTimeout() {
      // 设置默认超时信息提示，但如果有相关配置项的话优先使用配置项的
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(timeoutErrorMessage, config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    // 如果是标准浏览器环境
    if (utils.isStandardBrowserEnv()) {
      var cookies = require('./../helpers/cookies');

      // Add xsrf header
      // 如果是设置了跨域或者是同源的，并且配置项中存在xsrfCookieName，从cookie中获取xsrfCookieName的值，否则返回undefined
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;
      // 设置xsrf请求头
      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    // 如果xhr支持setRequestHeader方法
    // 遍历设置请求头
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        // 如果data没有传，删除content-type请求头
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    // 设置withCredentials
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    // 设置请求类型
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // 不兼容XMLHttpRequest Level 2 浏览器会抛出错误，
        // 但是如果是json类型那么可以被默认transformResponse解析，否则就抛出错误
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    // 为请求添加progress监听，如果设置了config.onDownloadProgress函数的话
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    // 如果配置项的onUploadProgress是一个方法且xhr支持upload方法，添加progress监听
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    // 如果配置了cancelToken
    if (config.cancelToken) {
      // Handle cancellation
      // 调用config.cancelToken.promise.then()方法
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }
        // 如果外部调用了那个cancelToken暴露出来的cancel方法，就会中止请求
        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};

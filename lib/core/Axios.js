'use strict';

var utils = require('./../utils');
// 构建URL？
var buildURL = require('../helpers/buildURL');
// 拦截器管理器？
var InterceptorManager = require('./InterceptorManager');
// 派发请求？
var dispatchRequest = require('./dispatchRequest');
var mergeConfig = require('./mergeConfig');

/**
 * Axios构造器，它只有defaults和interceptors这两个对象属性
 *
 * @param {Object} instanceConfig 实例的默认配置
 */
function Axios(instanceConfig) {
  // 默认配置暂存到defaults
  this.defaults = instanceConfig;
  // 拦截器对象，分为request和response
  // InterceptorManager ？？？
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * 添加原型方法request
 *
 * @param {Object} config 参数为请求配置项，它之后会和默认配置合并
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  // 考虑到第一个参数是url的情况，判断如果第一个参数是字符串，那就取第二个参数为config
  // 如果第二个参数没有，就默认config为{}
  if (typeof config === 'string') {
    config = arguments[1] || {};
    // 把url的属性值补上
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  // 与默认配置合并（对于配置项的各个属性，它有不同的合并规则，需要看mergeConfig）
  config = mergeConfig(this.defaults, config);

  // 设置config.method属性，如果有，统一转为小写
  // 如果没有，使用默认配置中的值，也要转为小写
  // 如果默认配置中也没有，就使用get作为默认值
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  // Hook up interceptors middleware
  // 初始的连接拦截器中间件
  var chain = [dispatchRequest, undefined];
  // 如果config是thenable对象，它会转为已完成的promise实例，并立即执行thenable的then方法
  // 如果config是一个promise，直接穿过
  // 如果是一个普通的参数，它会变成一个已完成的promise，参数config会传给then
  // 那这里config到底是什么，需要看看默认配置项
  var promise = Promise.resolve(config);

  // 遍历请求拦截器，它的每一项似乎是一个包含了fulfilled和rejected的对象
  // （需要回头看看InterceptorManager构造器是什么）
  // 将拦截器每一项的fulfilled和rejected都从头部加到chain数组中
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  // 同上面类似，这是将响应拦截器每一项的fulfilled和rejected都从尾部加到chain数组中
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  // 从chain的头部取出2项，作为promise.then()的参数
  // 只要存在chain，这段代码就会一直执行
  // 似乎这个promise是已经resolve的，所以才能马上执行？？
  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

// 获取uri
Axios.prototype.getUri = function getUri(config) {
  // 首先合并配置项
  config = mergeConfig(this.defaults, config);
  // 要先看buildURL方法
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// 遍历添加这4个快捷方法，它们的参数是url和配置项，而method是预先指定好的
// 用到了utils.merge方法，用于合并配置项
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

// 遍历添加3个方法，它们接收url, data, config3个参数
utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;

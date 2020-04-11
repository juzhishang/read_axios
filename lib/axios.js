'use strict';

// 工具方法
var utils = require('./utils');
// 辅助方法bind，就是自定义bind方法
var bind = require('./helpers/bind');
// 核心代码
var Axios = require('./core/Axios');
// 一个用于合并配置项的方法
var mergeConfig = require('./core/mergeConfig');
// 实例默认配置
var defaults = require('./defaults');

/**
 * 用于创建Axios实例
 * 这个实例的核心是Axios.prototype.request方法，经过修正，它的this指向了Axios的实例context
 * 通过两次复制继承，这个实例继承了Axios.prototype上的属性和方法，也继承了context上的属性
 *
 * @param {Object} defaultConfig 实例的默认配置
 * @return {Axios} Axios实例
 */
function createInstance(defaultConfig) {
  // 创建上下文this
  var context = new Axios(defaultConfig);
  // Axios.prototype.request的this强制绑定到context
  var instance = bind(Axios.prototype.request, context);

  // 遍历axios.prototype上的属性一一继承给instanceinstance，同时如果属性是方法的话，要修正this指向
  utils.extend(instance, Axios.prototype, context);

  // 遍历上下文上的属性一一继承给实例instance
  utils.extend(instance, context);

  return instance;
}

// 根据默认配置创建要被导出的axios实例
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
// 为实例添加Axios属性，它是Axios构造器的引用
axios.Axios = Axios;

// Factory for creating new instances
// 为实例添加create方法，它根据配置项生成一个新的实例
axios.create = function create(instanceConfig) {
  // mergeConfig是合并后的配置项
  // 返回根据新配置生成的axios实例
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
// 为实例添加取消相关的属性或方法
axios.Cancel = require('./cancel/Cancel');
axios.CancelToken = require('./cancel/CancelToken');
axios.isCancel = require('./cancel/isCancel');

// Expose all/spread
// 为实例添加all和spread方法
axios.all = function all(promises) {
  // 直接使用了Promise.all
  return Promise.all(promises);
};
// 一个高阶函数，入参回调函数，返回参数为数组的包装函数，这个函数使用apply方式调用该回调函数，
// 同时把数组作为参数传入。所以数组会被展开作为实参传给回调函数
axios.spread = require('./helpers/spread');


module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;

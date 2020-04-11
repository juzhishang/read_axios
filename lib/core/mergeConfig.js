'use strict';

var utils = require('../utils');

/**
 * 合并了config1和config2到一个新的对象。它把键分为了4种类型，对它们应用不同的合并规则。
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  // 结果对象
  var config = {};

  // 值来自config2的键
  var valueFromConfig2Keys = ['url', 'method', 'data'];
  // 合并深属性的键
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
  // 对config2而言默认的键
  var defaultToConfig2Keys = [
    'baseURL', 'url', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress',
    'maxContentLength', 'maxBodyLength', 'validateStatus', 'maxRedirects', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
  ];
  // 上面是把键类型分成了3类，分别放到3个数组里，然后对这三个数组遍历，应用不同的方法，因为合并方式不一样。

  // 这部分采用config2中的属性值，只要值不为undefined就使用，不关config1什么事
  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    }
  });

  // 这部分的属性值可能是对象，需要深拷贝。如果config2中该属性值是对象，
  // 使用config1和config2的该属性值对象合并的深拷贝结果。
  // 如果config2有值且不为undefined，使用config2的值
  // 最后使用config1中该属性的值，如果是对象也是要深拷贝。
  utils.forEach(mergeDeepPropertiesKeys, function mergeDeepProperties(prop) {
    // 如果config2中该属性值是对象，结果是config1和config2同名属性深拷贝的合并
    if (utils.isObject(config2[prop])) {
      config[prop] = utils.deepMerge(config1[prop], config2[prop]);
    // 如果config2中该属性值不为undefined，就使用config2的该属性值
    } else if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    // if else执行到这里说明config2中该属性值是undefined
    // 如果config1中该属性值是对象，结果是config1中该属性值的深拷贝
    } else if (utils.isObject(config1[prop])) {
      config[prop] = utils.deepMerge(config1[prop]);
    // 如果config1中该属性值存在，就使用该值
    } else if (typeof config1[prop] !== 'undefined') {
      config[prop] = config1[prop];
    }
  });

  // 这部分的属性值，如果config2中该属性值不为undefined，就使用config2的
  // 否则，如果config1中该属性值不为undefined，就使用config1的。
  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    } else if (typeof config1[prop] !== 'undefined') {
      config[prop] = config1[prop];
    }
  });

  // 又把这些键数组合并起来
  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys);

  // 找到config2中不属于axiosKeys的键，归类到otherKeys数组
  var otherKeys = Object
    .keys(config2)
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  // 这部分也是优先采用config2的属性值，其次是config1的属性值
  utils.forEach(otherKeys, function otherKeysDefaultToConfig2(prop) {
    if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    } else if (typeof config1[prop] !== 'undefined') {
      config[prop] = config1[prop];
    }
  });

  return config;
};

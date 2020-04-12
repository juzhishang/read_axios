'use strict';

var utils = require('./../utils');

function encode(val) {
  // 字符转码
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+'). // 空格变+
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  // 参数不存在，直接返回url
  if (!params) {
    return url;
  }

  var serializedParams;
  // 如果存在参数序列化器
  if (paramsSerializer) {
    // 序列化器调用结果作为序列化后的参数
    serializedParams = paramsSerializer(params);
    // 如果参数是URLSearchParams的实例
  } else if (utils.isURLSearchParams(params)) {
    // 调用URLSearchParams的实例的toString()方法可以重新转为字符串
    // 比如`a=1&b=2&c=3`
    serializedParams = params.toString();
  } else {
    // 空数组，用于存放查询参数片段，每一项的格式是：`a=1`这样
    var parts = [];

    // 对params对象对每一个属性，遍历调用serialize方法
    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }
      // 如果值是数组，键名后面跟`[]`
      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        // 否则的话，用`[]`把value包裹起来
        // 这样就确保了所有的值都是数组，方便下面代码遍历
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        // 如果是日期对象，将它转为iso标准的日期字符串
        if (utils.isDate(v)) {
          v = v.toISOString();
          // 如果是对象，调用JSON.stringify
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        // 最后对键名调用字符转码方法，然后拼接参数后推到parts数组中
        parts.push(encode(key) + '=' + encode(v));
      });
    });
    // 获得序列化后的参数字符串，是这种格式：`a=1&b=2&c=3`
    serializedParams = parts.join('&');
  }

  // 如果有序列化参数
  if (serializedParams) {
    // 如果有hash标志#，截取#前面的内容作为url
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }
    // 把序列化参数和url拼接在一起
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};

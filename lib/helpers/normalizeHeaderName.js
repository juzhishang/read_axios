'use strict';

var utils = require('../utils');

// 参数有2个，headers是数组，normalizedName是字符串
// 遍历数组的每一项，对它们应用processHeader方法
module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    // 如果name不等于normalizedName，但它们小写后的结果又是相等的
    // 就把headers[name]改成headers[normalizedName]
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};

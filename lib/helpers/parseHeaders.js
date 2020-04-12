'use strict';

var utils = require('./../utils');

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
// 在node中下面这些请求头的副本会被忽略
// 定义了一个数组来存放这些请求头名称
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * 把请求头字符串转为数组
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  // 结果对象
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  // 请求头字符串通过`\n`分隔转为数组，遍历每一项，`:`前面对转为小写作为key,后面的作为val
  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    // 如果结果对象中key已经存在，判断它是不是属于重复的要被忽略的
    // 如果是set-cookie，值是需要与原来的值合并的，cookie的值是要以`;`结尾的
    // 最后一种情况，如果值存在，与原值通过`,`相连，如果不存在添加属性及值到结果对象中
    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};

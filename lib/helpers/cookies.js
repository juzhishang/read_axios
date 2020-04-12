'use strict';

var utils = require('./../utils');

module.exports = (
  // 判断是否是标准浏览器环境
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
  // 如果是标准浏览器环境返回一个对象，包含write、read、remove方法
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          // cookie的每一个值都是键值对组合，类似这样`键=值`
          // 先推到数组暂存
          cookie.push(name + '=' + encodeURIComponent(value));
          // 接收时间戳作为expires，再转化成GMT时间，拼接成`expires=GMT时间`推到数组
          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }
          // 设置path
          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }
          // 设置domain
          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }
          // 最后通过join连接成字符串，每一个值要用`; `分隔。
          document.cookie = cookie.join('; ');
        },
        // 获取cookie
        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },
        // 删除cookie
        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
  // 非标准浏览器环境不支持cookie
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);

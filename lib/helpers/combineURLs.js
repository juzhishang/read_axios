'use strict';

/**
 * 连接指定的url创建出新的url
 * 如果传递了相对url，先将baseUrl结尾的斜杠后的所有字符删除，然后连接一个斜杠，然后再连接删除了开头斜杠的相对url
 * 如果没有相对url参数，就直接返回baseUrl
 * combineURLs('www.baidu.com/a/b', '/c/d')
 * // "www.baidu.com/a/b/c/d"
 * combineURLs('www.baidu.com/a/b/', '/c/d')
 * // "www.baidu.com/a/b/c/d"
 * combineURLs('www.baidu.com/a/b/', 'c/d')
 * // "www.baidu.com/a/b/c/d"
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};

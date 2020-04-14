'use strict';

var utils = require('./../utils');
var settle = require('./../core/settle');
var buildFullPath = require('../core/buildFullPath');
var buildURL = require('./../helpers/buildURL');
var http = require('http');
var https = require('https');
// 请求自动跟随重定向
var httpFollow = require('follow-redirects').http;
var httpsFollow = require('follow-redirects').https;
var url = require('url');
// 通用压缩库
var zlib = require('zlib');
var pkg = require('./../../package.json');
var createError = require('../core/createError');
var enhanceError = require('../core/enhanceError');

// 是否是https请求
var isHttps = /https:?/;

/*eslint consistent-return:0*/
module.exports = function httpAdapter(config) {
  return new Promise(function dispatchHttpRequest(resolvePromise, rejectPromise) {
    var resolve = function resolve(value) {
      resolvePromise(value);
    };
    var reject = function reject(value) {
      rejectPromise(value);
    };
    var data = config.data;
    var headers = config.headers;

    // Set User-Agent (required by some servers)
    // Only set header if it hasn't been set in config
    // See https://github.com/axios/axios/issues/69
    // 当请求头中没有'User-Agent'时设置，值为'axios/'+ 版本号
    if (!headers['User-Agent'] && !headers['user-agent']) {
      headers['User-Agent'] = 'axios/' + pkg.version;
    }

    // 根据data的不同类型设置data（data存在且不是流）
    if (data && !utils.isStream(data)) {
      // 如果数据是buffer,什么都不做
      if (Buffer.isBuffer(data)) {
        // Nothing to do...
      } else if (utils.isArrayBuffer(data)) {
        // 如果数据是arraybuffer,创建8位的无符号整数值的类型化数组，使用Buffer.from()创建副本重新赋值给data
        data = Buffer.from(new Uint8Array(data));
      } else if (utils.isString(data)) {
        // 创建一个包含data的，编码为uft-8的buffer，重新赋值给data
        data = Buffer.from(data, 'utf-8');
      } else {
        // reject
        return reject(createError(
          'Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream',
          config
        ));
      }

      // Add Content-Length header if data exists
      // 如果data存在，设置Content-Length
      headers['Content-Length'] = data.length;
    }

    // HTTP basic authentication
    // 设置auth
    var auth = undefined;
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      auth = username + ':' + password;
    }

    // Parse url
    // 完整路径
    var fullPath = buildFullPath(config.baseURL, config.url);
    // 解析路径为对象
    var parsed = url.parse(fullPath);
    // 获取协议
    var protocol = parsed.protocol || 'http:';

    // 如果auth不存在，但是parsed.auth存在（url中有auth相关的）解析之后赋值给auth
    if (!auth && parsed.auth) {
      var urlAuth = parsed.auth.split(':');
      var urlUsername = urlAuth[0] || '';
      var urlPassword = urlAuth[1] || '';
      auth = urlUsername + ':' + urlPassword;
    }

    // 如果存在auth,删除Authorization请求头
    if (auth) {
      delete headers.Authorization;
    }

    // 是否是https请求
    var isHttpsRequest = isHttps.test(protocol);
    // 获取相应请求的代理
    var agent = isHttpsRequest ? config.httpsAgent : config.httpAgent;

    // 定义options对象，这个要在之后作为参数传给request
    // 为它设置各种参数：路径、方法、请求头、代理、授权
    var options = {
      path: buildURL(parsed.path, config.params, config.paramsSerializer).replace(/^\?/, ''),
      method: config.method.toUpperCase(),
      headers: headers,
      agent: agent,
      agents: { http: config.httpAgent, https: config.httpsAgent },
      auth: auth
    };

    // 如果配置项中有socketPath，设置options的socketPath属性，否则设置hostname和port属性
    if (config.socketPath) {
      options.socketPath = config.socketPath;
    } else {
      options.hostname = parsed.hostname;
      options.port = parsed.port;
    }

    // 获取代理值，如果为假值且不等于false
    var proxy = config.proxy;
    if (!proxy && proxy !== false) {
      // 代理环境
      var proxyEnv = protocol.slice(0, -1) + '_proxy';
      // 获取代理Url
      var proxyUrl = process.env[proxyEnv] || process.env[proxyEnv.toUpperCase()];
      // 如果代理url存在
      if (proxyUrl) {
        // 获取解析后的对象
        var parsedProxyUrl = url.parse(proxyUrl);
        // 非代理环境
        var noProxyEnv = process.env.no_proxy || process.env.NO_PROXY;
        // 是否需要代理
        var shouldProxy = true;
        // 如果非代理环境值为true
        if (noProxyEnv) {
          // 获取noProxy数组
          var noProxy = noProxyEnv.split(',').map(function trim(s) {
            return s.trim();
          });

          // 只要noProxy.some的结果为真，shouldProxy值就为假
          // 那noProxy.some什么时候为真呢
          shouldProxy = !noProxy.some(function proxyMatch(proxyElement) {
            if (!proxyElement) {
              return false;
            }
            // 1.通配符*
            if (proxyElement === '*') {
              return true;
            }
            // 2.判断proxyElement与请求url的域名是否相等
            if (proxyElement[0] === '.' &&
                parsed.hostname.substr(parsed.hostname.length - proxyElement.length) === proxyElement) {
              return true;
            }
            // 3.也是判断proxyElement与请求url的域名是否相等
            return parsed.hostname === proxyElement;
          });
        }

        // 如果需要代理，设置代理配置项
        if (shouldProxy) {
          proxy = {
            host: parsedProxyUrl.hostname,
            port: parsedProxyUrl.port
          };
          // 如果代理url的auth属性存在，设置proxy的auth属性
          if (parsedProxyUrl.auth) {
            var proxyUrlAuth = parsedProxyUrl.auth.split(':');
            proxy.auth = {
              username: proxyUrlAuth[0],
              password: proxyUrlAuth[1]
            };
          }
        }
      }
    }

    // 如果存在代理，添加options的一些属性
    if (proxy) {
      options.hostname = proxy.host;
      options.host = proxy.host;
      options.headers.host = parsed.hostname + (parsed.port ? ':' + parsed.port : '');
      options.port = proxy.port;
      options.path = protocol + '//' + parsed.hostname + (parsed.port ? ':' + parsed.port : '') + options.path;

      // Basic proxy authorization
      // 添加Proxy-Authorization请求头
      if (proxy.auth) {
        var base64 = Buffer.from(proxy.auth.username + ':' + proxy.auth.password, 'utf8').toString('base64');
        options.headers['Proxy-Authorization'] = 'Basic ' + base64;
      }
    }

    // 传输协议
    var transport;
    // 是否https代理
    var isHttpsProxy = isHttpsRequest && (proxy ? isHttps.test(proxy.protocol) : true);
    if (config.transport) {
      transport = config.transport;
    } else if (config.maxRedirects === 0) {
      // 设置传输协议为https或者http
      transport = isHttpsProxy ? https : http;
    } else {
      if (config.maxRedirects) {
        // 最大重定向次数
        options.maxRedirects = config.maxRedirects;
      }
      transport = isHttpsProxy ? httpsFollow : httpFollow;
    }
    // 请求体最大长度
    if (config.maxBodyLength > -1) {
      options.maxBodyLength = config.maxBodyLength;
    }

    // Create the request
    // 调用请求
    var req = transport.request(options, function handleResponse(res) {
      // 如果请求已中止，返回
      if (req.aborted) return;

      // uncompress the response body transparently if required
      var stream = res;

      // return the last request in case of redirects
      // 暂存最后一次请求
      var lastRequest = res.req || req;


      // if no content, is HEAD request or decompress disabled we should not decompress
      // 如果状态码不是204，且最后一个请求方法不是head，且配置不压缩
      if (res.statusCode !== 204 && lastRequest.method !== 'HEAD' && config.decompress !== false) {
        switch (res.headers['content-encoding']) {
        /*eslint default-case:0*/
        case 'gzip':
        case 'compress':
        case 'deflate':
        // add the unzipper to the body stream processing pipeline
        // 响应头的content-encoding值，如果是上面这三种（都是压缩算法）就解压然后赋值给steam变量
          stream = stream.pipe(zlib.createUnzip());

          // remove the content-encoding in order to not confuse downstream operations
          // 然后删除这个响应头
          delete res.headers['content-encoding'];
          break;
        }
      }
      // 设置响应对象
      var response = {
        status: res.statusCode,
        statusText: res.statusMessage,
        headers: res.headers,
        config: config,
        request: lastRequest
      };

      // 如果响应类型是stream，设置response.data值为stream变量
      // 同时解决promise
      if (config.responseType === 'stream') {
        response.data = stream;
        settle(resolve, reject, response);
      } else {
        // 如果是buffer，监听onData事件，然后把数剧存储到responseBuffer
        var responseBuffer = [];
        stream.on('data', function handleStreamData(chunk) {
          responseBuffer.push(chunk);

          // make sure the content length is not over the maxContentLength if specified
          // 要确保接收的数据不能超过配置的最大长度，否则调用stream.destroy()方法，然后拒绝promise
          if (config.maxContentLength > -1 && Buffer.concat(responseBuffer).length > config.maxContentLength) {
            stream.destroy();
            reject(createError('maxContentLength size of ' + config.maxContentLength + ' exceeded',
              config, null, lastRequest));
          }
        });
        // 监听stream错误
        stream.on('error', function handleStreamError(err) {
          if (req.aborted) return;
          reject(enhanceError(err, config, null, lastRequest));
        });
        // 流结束的时候，合并buffer，判断responseType看要不要转成字符串
        stream.on('end', function handleStreamEnd() {
          var responseData = Buffer.concat(responseBuffer);
          if (config.responseType !== 'arraybuffer') {
            responseData = responseData.toString(config.responseEncoding);
          }

          response.data = responseData;
          settle(resolve, reject, response);
        });
      }
    });

    // Handle errors
    // 请求错误
    req.on('error', function handleRequestError(err) {
      if (req.aborted && err.code !== 'ERR_FR_TOO_MANY_REDIRECTS') return;
      reject(enhanceError(err, config, null, req));
    });

    // Handle request timeout
    // 处理超时
    if (config.timeout) {
      // Sometime, the response will be very slow, and does not respond, the connect event will be block by event loop system.
      // And timer callback will be fired, and abort() will be invoked before connection, then get "socket hang up" and code ECONNRESET.
      // At this time, if we have a large number of request, nodejs will hang up some socket on background. and the number will up and up.
      // And then these socket which be hang up will devoring CPU little by little.
      // ClientRequest.setTimeout will be fired on the specify milliseconds, and can make sure that abort() will be fired after connect.
      req.setTimeout(config.timeout, function handleRequestTimeout() {
        req.abort();
        reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED', req));
      });
    }

    if (config.cancelToken) {
      // Handle cancellation
      // 处理取消请求
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (req.aborted) return;

        req.abort();
        reject(cancel);
      });
    }

    // Send the request
    // 发送请求
    if (utils.isStream(data)) {
      data.on('error', function handleStreamError(err) {
        reject(enhanceError(err, config, null, req));
      }).pipe(req);
    } else {
      req.end(data);
    }
  });
};

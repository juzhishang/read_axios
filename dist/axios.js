(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["axios"] = factory();
	else
		root["axios"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	// 工具方法
	var utils = __webpack_require__(2);
	// 辅助方法bind，就是自定义bind方法
	var bind = __webpack_require__(3);
	// 核心代码
	var Axios = __webpack_require__(4);
	// 一个用于合并配置项的方法
	var mergeConfig = __webpack_require__(22);
	// 实例默认配置
	var defaults = __webpack_require__(10);
	
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
	axios.Cancel = __webpack_require__(23);
	axios.CancelToken = __webpack_require__(24);
	axios.isCancel = __webpack_require__(9);
	
	// Expose all/spread
	// 为实例添加all和spread方法
	axios.all = function all(promises) {
	  // 直接使用了Promise.all
	  return Promise.all(promises);
	};
	// 一个高阶函数，入参回调函数，返回参数为数组的包装函数，这个函数使用apply方式调用该回调函数，
	// 同时把数组作为参数传入。所以数组会被展开作为实参传给回调函数
	axios.spread = __webpack_require__(25);
	
	
	module.exports = axios;
	
	// Allow use of default import syntax in TypeScript
	module.exports.default = axios;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var bind = __webpack_require__(3);
	
	/*global toString:true*/
	
	// utils is a library of generic helper functions non-specific to axios
	
	var toString = Object.prototype.toString;
	
	/**
	 * 判断是否是一个数组
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an Array, otherwise false
	 */
	function isArray(val) {
	  return toString.call(val) === '[object Array]';
	}
	
	/**
	 * 判断值是否为undefined
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if the value is undefined, otherwise false
	 */
	function isUndefined(val) {
	  return typeof val === 'undefined';
	}
	
	/**
	 * 判断是否是一个buffer，通过调用值的构造器上的isBuffer函数判断
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Buffer, otherwise false
	 */
	function isBuffer(val) {
	  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
	    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
	}
	
	/**
	 * 判断是否是ArrayBuffer
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
	 */
	function isArrayBuffer(val) {
	  return toString.call(val) === '[object ArrayBuffer]';
	}
	
	/**
	 * 判断值是否是一个FormData
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an FormData, otherwise false
	 */
	function isFormData(val) {
	  return (typeof FormData !== 'undefined') && (val instanceof FormData);
	}
	
	/**
	 * 判断是否是ArrayBuffer View
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
	 */
	function isArrayBufferView(val) {
	  var result;
	  // 优先使用ArrayBuffer.isView判断
	  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
	    result = ArrayBuffer.isView(val);
	  } else {
	    // 如果不符合第一个判断条件，判断val.buffer是否是ArrayBuffer的实例
	    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
	  }
	  return result;
	}
	
	/**
	 * Determine if a value is a String
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a String, otherwise false
	 */
	function isString(val) {
	  return typeof val === 'string';
	}
	
	/**
	 * Determine if a value is a Number
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Number, otherwise false
	 */
	function isNumber(val) {
	  return typeof val === 'number';
	}
	
	/**
	 * 判断是否是一个对象，需要排除null
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an Object, otherwise false
	 */
	function isObject(val) {
	  return val !== null && typeof val === 'object';
	}
	
	/**
	 * 判断是否是日期对象
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Date, otherwise false
	 */
	function isDate(val) {
	  return toString.call(val) === '[object Date]';
	}
	
	/**
	 * 判断是否是文件
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a File, otherwise false
	 */
	function isFile(val) {
	  return toString.call(val) === '[object File]';
	}
	
	/**
	 * 判断是否是一个Blob
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Blob, otherwise false
	 */
	function isBlob(val) {
	  return toString.call(val) === '[object Blob]';
	}
	
	/**
	 * 判断是否是一个函数
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Function, otherwise false
	 */
	function isFunction(val) {
	  return toString.call(val) === '[object Function]';
	}
	
	/**
	 * 判断是否是一个Stream
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Stream, otherwise false
	 */
	function isStream(val) {
	  return isObject(val) && isFunction(val.pipe);
	}
	
	/**
	 * 判断是否是一个URLSearchParams实例，URLSearchParams实例提供了一些查询参数相关的方法
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
	 */
	function isURLSearchParams(val) {
	  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
	}
	
	/**
	 * 去两端空格
	 *
	 * @param {String} str The String to trim
	 * @returns {String} The String freed of excess whitespace
	 */
	function trim(str) {
	  return str.replace(/^\s*/, '').replace(/\s*$/, '');
	}
	
	/**
	 * 判断是否是标准浏览器环境
	 *
	 * This allows axios to run in a web worker, and react-native.
	 * Both environments support XMLHttpRequest, but not fully standard globals.
	 *
	 * web workers:
	 *  typeof window -> undefined
	 *  typeof document -> undefined
	 *
	 * react-native:
	 *  navigator.product -> 'ReactNative'
	 * nativescript
	 *  navigator.product -> 'NativeScript' or 'NS'
	 */
	function isStandardBrowserEnv() {
	  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
	                                           navigator.product === 'NativeScript' ||
	                                           navigator.product === 'NS')) {
	    return false;
	  }
	  return (
	    typeof window !== 'undefined' &&
	    typeof document !== 'undefined'
	  );
	}
	
	/**
	 * 对数组上的每一个元素，或者对象上的每一个自有属性，遍历调用fn
	 * 给fn传三个参数：值、下标（健）、数组（对象）本身
	 *
	 * @param {Object|Array} obj 对象或数组
	 * @param {Function} fn 要调用的函数
	 */
	function forEach(obj, fn) {
	  // obj不能为null或者undefined
	  if (obj === null || typeof obj === 'undefined') {
	    return;
	  }
	
	  // 如果不是对象或者数组，转为数组（用[]包裹）
	  if (typeof obj !== 'object') {
	    /*eslint no-param-reassign:0*/
	    obj = [obj];
	  }
	
	  // 迭代数组
	  if (isArray(obj)) {
	    // 遍历调用fn,参数为数组的值、下标以及数组本身
	    for (var i = 0, l = obj.length; i < l; i++) {
	      fn.call(null, obj[i], i, obj);
	    }
	  } else {
	    // 迭代对象
	    for (var key in obj) {
	      // 对对象上的每一个自有属性，分别调用fn,传入的参数为值、健、对象本身
	      if (Object.prototype.hasOwnProperty.call(obj, key)) {
	        fn.call(null, obj[key], key, obj);
	      }
	    }
	  }
	}
	
	/**
	 * Accepts varargs expecting each argument to be an object, then
	 * immutably merges the properties of each object and returns result.
	 *
	 * When multiple objects contain the same key the later object in
	 * the arguments list will take precedence.
	 *
	 * Example:
	 *
	 * ```js
	 * var result = merge({foo: 123}, {foo: 456});
	 * console.log(result.foo); // outputs 456
	 * ```
	 *
	 * @param {Object} obj1 ... 它接收不限数个对象
	 * @returns {Object} 返回多个对象合并的结果
	 */
	function merge(/* obj1, obj2, obj3, ... */) {
	  var result = {};
	  function assignValue(val, key) {
	    if (typeof result[key] === 'object' && typeof val === 'object') {
	      result[key] = merge(result[key], val);
	    } else {
	      result[key] = val;
	    }
	  }
	
	  // 遍历每一个参数，调用assignValue
	  for (var i = 0, l = arguments.length; i < l; i++) {
	    forEach(arguments[i], assignValue);
	  }
	  return result;
	}
	
	/**
	 * Function equal to merge with the difference being that no reference
	 * to original objects is kept.
	 * 深度合并，它的优势是不会保持原对象的属性的引用
	 *
	 * @see merge
	 * @param {Object} obj1 Object to merge
	 * @returns {Object} Result of all merge properties
	 */
	function deepMerge(/* obj1, obj2, obj3, ... */) {
	  var result = {};
	  function assignValue(val, key) {
	    if (typeof result[key] === 'object' && typeof val === 'object') {
	      result[key] = deepMerge(result[key], val);
	    } else if (typeof val === 'object') {
	      result[key] = deepMerge({}, val);
	    } else {
	      result[key] = val;
	    }
	  }
	
	  for (var i = 0, l = arguments.length; i < l; i++) {
	    forEach(arguments[i], assignValue);
	  }
	  return result;
	}
	
	/**
	 * 通过遍历的方式把b上的属性继承给a,如果属性是函数的话，要修改this指向。
	 *
	 * @param {Object} a The object to be extended
	 * @param {Object} b The object to copy properties from
	 * @param {Object} thisArg The object to bind function to
	 * @return {Object} The resulting value of object a
	 */
	function extend(a, b, thisArg) {
	  // 对b对象的每一个自有属性（或者b数组的每个元素）分别应用assignValue
	  // 传入的参数就是值和健名（或者下标）
	  forEach(b, function assignValue(val, key) {
	    // 如果值是函数，先把函数this指向绑定到指定的上下文thisArg后再复制。
	    if (thisArg && typeof val === 'function') {
	      a[key] = bind(val, thisArg);
	    } else {
	      a[key] = val;
	    }
	  });
	  return a;
	}
	
	module.exports = {
	  isArray: isArray,
	  isArrayBuffer: isArrayBuffer,
	  isBuffer: isBuffer,
	  isFormData: isFormData,
	  isArrayBufferView: isArrayBufferView,
	  isString: isString,
	  isNumber: isNumber,
	  isObject: isObject,
	  isUndefined: isUndefined,
	  isDate: isDate,
	  isFile: isFile,
	  isBlob: isBlob,
	  isFunction: isFunction,
	  isStream: isStream,
	  isURLSearchParams: isURLSearchParams,
	  isStandardBrowserEnv: isStandardBrowserEnv,
	  forEach: forEach,
	  merge: merge,
	  deepMerge: deepMerge,
	  extend: extend,
	  trim: trim
	};


/***/ }),
/* 3 */
/***/ (function(module, exports) {

	'use strict';
	
	
	/**
	 * 自定义bind函数
	 * @param {*} fn 要绑定this的函数
	 * @param {*} thisArg 上下文参数
	 * @returns 包装函数wrap
	 */
	module.exports = function bind(fn, thisArg) {
	  return function wrap() {
	    // 创建类数组arguments的数组副本
	    var args = new Array(arguments.length);
	    for (var i = 0; i < args.length; i++) {
	      args[i] = arguments[i];
	    }
	    // this绑定
	    return fn.apply(thisArg, args);
	  };
	};


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(2);
	// 构建URL
	var buildURL = __webpack_require__(5);
	// 拦截器管理器
	var InterceptorManager = __webpack_require__(6);
	// 派发请求
	var dispatchRequest = __webpack_require__(7);
	var mergeConfig = __webpack_require__(22);
	
	/**
	 * Axios构造器，它只有defaults和interceptors这两个对象属性
	 *
	 * @param {Object} instanceConfig 实例的默认配置
	 */
	function Axios(instanceConfig) {
	  // 默认配置暂存到defaults
	  this.defaults = instanceConfig;
	  // 拦截器对象，分为request和response，值都是InterceptorManager实例
	  // InterceptorManager实例上有实例属性handlers，以及use、eject、forEach三个原型方法
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
	  // dispatchRequest是一个派发请求的函数
	  var chain = [dispatchRequest, undefined];
	  // 对于Promise.resolve()传入的参数，如果参数是thenable对象，它会转为已完成的promise实例，并立即执行thenable的then方法
	  // 如果参数是一个promise，直接穿过
	  // 如果是一个普通的参数，它会变成一个已完成的promise，参数config会传给then
	  // 那这里config它是一个普通对象，所以返回一个已完成的promise
	  var promise = Promise.resolve(config);
	
	  // 对请求拦截器的handles遍历，应用unshiftRequestInterceptors方法
	  // handles的每一项都包含了fulfilled和rejected属性，它们是promise成功和失败的回调函数
	  // 将这两个属性从头部加到chain数组中
	  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
	    chain.unshift(interceptor.fulfilled, interceptor.rejected);
	  });
	
	  // 同上面类似，这是将响应拦截器的handles的每一项的fulfilled和rejected方法都从尾部加到chain数组中
	  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
	    chain.push(interceptor.fulfilled, interceptor.rejected);
	  });
	
	  // 从chain的头部取出2项，作为promise.then()的参数
	  // 只要存在chain，这段代码就会一直执行
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


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(2);
	
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


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(2);
	
	// 实例属性handlers
	function InterceptorManager() {
	  this.handlers = [];
	}
	
	/**
	 * Add a new interceptor to the stack
	 * 原型方法use
	 *
	 * @param {Function} fulfilled The function to handle `then` for a `Promise`
	 * @param {Function} rejected The function to handle `reject` for a `Promise`
	 *
	 * @return {Number} An ID used to remove interceptor later
	 */
	InterceptorManager.prototype.use = function use(fulfilled, rejected) {
	  // handlers数组中推入一个包含fulfilled和rejected方法的对象，这个对象就是拦截器
	  // 这2个方法是promise完成和拒绝的2个回调函数
	  this.handlers.push({
	    fulfilled: fulfilled,
	    rejected: rejected
	  });
	  // 返回值是最新推入的这个对象在数组中的下标
	  return this.handlers.length - 1;
	};
	
	/**
	 * 原型方法eject，将指定下标的拦截器从handles中删除，内容置为null，下标的位置还是保留的
	 * Remove an interceptor from the stack
	 *
	 * @param {Number} id The ID that was returned by `use`
	 */
	InterceptorManager.prototype.eject = function eject(id) {
	  if (this.handlers[id]) {
	    this.handlers[id] = null;
	  }
	};
	
	/**
	 * Iterate over all the registered interceptors
	 * 原型方法forEach
	 *
	 * This method is particularly useful for skipping over any
	 * interceptors that may have become `null` calling `eject`.
	 *
	 * @param {Function} fn The function to call for each interceptor
	 */
	InterceptorManager.prototype.forEach = function forEach(fn) {
	  // 对handlers的每一个拦截器，应用forEachHandler方法。
	  // 调用fn()方法，拦截器作为参数传入
	  utils.forEach(this.handlers, function forEachHandler(h) {
	    if (h !== null) {
	      fn(h);
	    }
	  });
	};
	
	module.exports = InterceptorManager;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(2);
	var transformData = __webpack_require__(8);
	var isCancel = __webpack_require__(9);
	var defaults = __webpack_require__(10);
	
	/**
	 * Throws a `Cancel` if cancellation has been requested.
	 */
	function throwIfCancellationRequested(config) {
	  // 如果配置项中有cancelToken参数，说明cancel已经执行过了，抛出异常。
	  if (config.cancelToken) {
	    config.cancelToken.throwIfRequested();
	  }
	}
	
	/**
	 * Dispatch a request to the server using the configured adapter.
	 *
	 * @param {object} config The config that is to be used for the request
	 * @returns {Promise} The Promise to be fulfilled
	 */
	module.exports = function dispatchRequest(config) {
	  throwIfCancellationRequested(config);
	
	  // Ensure headers exist
	  // config.headers如果不存在设默认值{}
	  config.headers = config.headers || {};
	
	  // Transform request data
	  // 转换请求数据
	  config.data = transformData(
	    config.data,
	    config.headers,
	    config.transformRequest
	  );
	
	  // Flatten headers
	  // 合并请求头配置，对于指定的方法的请求头，把它展开后合并
	  config.headers = utils.merge(
	    config.headers.common || {},
	    config.headers[config.method] || {},
	    config.headers
	  );
	
	  // 遍历删除各个特定方法的header配置项，因为上面一段代码已经把该合并的合并了
	  utils.forEach(
	    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
	    function cleanHeaderConfig(method) {
	      delete config.headers[method];
	    }
	  );
	
	  // 获取适配器，优先使用配置里的，如果没有，使用默认的
	  var adapter = config.adapter || defaults.adapter;
	
	  // 返回适配器的调用结果，是个promise。config作为参数传入。
	  // then的两个参数是resolve和reject回调。
	  return adapter(config).then(function onAdapterResolution(response) {
	    // 如果已经取消就抛出异常
	    throwIfCancellationRequested(config);
	
	    // 转换响应数据
	    response.data = transformData(
	      response.data,
	      response.headers,
	      config.transformResponse
	    );
	
	    return response;
	  }, function onAdapterRejection(reason) {
	    // 如果已取消，抛出异常
	    if (!isCancel(reason)) {
	      throwIfCancellationRequested(config);
	
	      // 转换响应数据
	      if (reason && reason.response) {
	        reason.response.data = transformData(
	          reason.response.data,
	          reason.response.headers,
	          config.transformResponse
	        );
	      }
	    }
	
	    return Promise.reject(reason);
	  });
	};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(2);
	
	/**
	 * 转换请求或响应的数据data
	 *
	 * @param {Object|String} data The data to be transformed
	 * @param {Array} headers The headers for the request or response
	 * @param {Array|Function} fns fns可以是一个函数，也可以是函数数组
	 * @returns {*} The resulting transformed data
	 */
	module.exports = function transformData(data, headers, fns) {
	  /*eslint no-param-reassign:0*/
	  // 遍历应用fns
	  utils.forEach(fns, function transform(fn) {
	    data = fn(data, headers);
	  });
	
	  return data;
	};


/***/ }),
/* 9 */
/***/ (function(module, exports) {

	'use strict';
	// 通过实例的__CANCEL__属性判断是否已取消
	module.exports = function isCancel(value) {
	  return !!(value && value.__CANCEL__);
	};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(2);
	// 用于格式化请求头名称的
	var normalizeHeaderName = __webpack_require__(11);
	
	// 默认请求头类型，在xhr中如果是post请求，这个请求头是必需的
	var DEFAULT_CONTENT_TYPE = {
	  'Content-Type': 'application/x-www-form-urlencoded'
	};
	
	// 设置请求头ContentType，如果没有设的话
	function setContentTypeIfUnset(headers, value) {
	  // headers对象存在，但是headers['Content-Type']不存在的话，设置该值
	  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
	    headers['Content-Type'] = value;
	  }
	}
	
	// 获取默认的适配器，浏览器使用xhr适配器，node环境使用http适配器
	function getDefaultAdapter() {
	  var adapter;
	  if (typeof XMLHttpRequest !== 'undefined') {
	    // For browsers use XHR adapter
	    adapter = __webpack_require__(12);
	  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
	    // For node use HTTP adapter
	    adapter = __webpack_require__(12);
	  }
	  return adapter;
	}
	
	// 设置defaults对象
	var defaults = {
	  // 适配器属性adapter
	  adapter: getDefaultAdapter(),
	  // transformRequest值的每一个fn都会被调用且接收两个参数（data, headers）
	  // 这里这个默认函数的功能是：1、格式化请求头名称 2、根据不同的data类型做一些对应的处理
	  transformRequest: [function transformRequest(data, headers) {
	    normalizeHeaderName(headers, 'Accept');
	    normalizeHeaderName(headers, 'Content-Type');
	    if (utils.isFormData(data) ||
	      utils.isArrayBuffer(data) ||
	      utils.isBuffer(data) ||
	      utils.isStream(data) ||
	      utils.isFile(data) ||
	      utils.isBlob(data)
	    ) {
	      return data;
	    }
	    if (utils.isArrayBufferView(data)) {
	      return data.buffer;
	    }
	    if (utils.isURLSearchParams(data)) {
	      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
	      return data.toString();
	    }
	    if (utils.isObject(data)) {
	      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
	      return JSON.stringify(data);
	    }
	    return data;
	  }],
	  // transformResponse的值的每一个函数都会被调用
	  // 这里默认的函数它的功能是如果data是字符串，尝试转成json
	  transformResponse: [function transformResponse(data) {
	    /*eslint no-param-reassign:0*/
	    if (typeof data === 'string') {
	      try {
	        data = JSON.parse(data);
	      } catch (e) { /* Ignore */ }
	    }
	    return data;
	  }],
	
	  /**
	   * 超时时间
	   * A timeout in milliseconds to abort a request. If set to 0 (default) a
	   * timeout is not created.
	   */
	  timeout: 0,
	  // 要用作 xsrf 令牌的值的cookie的名称
	  xsrfCookieName: 'XSRF-TOKEN',
	  // 携带xsrf令牌值的http头的名称
	  xsrfHeaderName: 'X-XSRF-TOKEN',
	
	  // 允许的http响应内容的最大值
	  maxContentLength: -1,
	  // 正文最大值
	  maxBodyLength: -1,
	
	  // 请求成功的状态码默认是>=200且小于300，如果需要修改，可以配置这个validateStatus属性
	  validateStatus: function validateStatus(status) {
	    return status >= 200 && status < 300;
	  }
	};
	
	
	defaults.headers = {
	  // 通用的请求头是Accept
	  common: {
	    'Accept': 'application/json, text/plain, */*'
	  }
	};
	
	// 这三种类型的请求，它们对应的默认请求头是{}
	utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
	  defaults.headers[method] = {};
	});
	
	// 而'post', 'put', 'patch'这三种的默认请求头中需
	// 包含'Content-Type': 'application/x-www-form-urlencoded'
	utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
	  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
	});
	module.exports = defaults;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(2);
	
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


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(2);
	var settle = __webpack_require__(13);
	var buildURL = __webpack_require__(5);
	var buildFullPath = __webpack_require__(16);
	var parseHeaders = __webpack_require__(19);
	var isURLSameOrigin = __webpack_require__(20);
	var createError = __webpack_require__(14);
	
	module.exports = function xhrAdapter(config) {
	  return new Promise(function dispatchXhrRequest(resolve, reject) {
	    var requestData = config.data;
	    var requestHeaders = config.headers;
	
	    if (utils.isFormData(requestData)) {
	      delete requestHeaders['Content-Type']; // Let the browser set it
	    }
	
	    var request = new XMLHttpRequest();
	
	    // HTTP basic authentication
	    if (config.auth) {
	      var username = config.auth.username || '';
	      var password = config.auth.password || '';
	      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
	    }
	
	    var fullPath = buildFullPath(config.baseURL, config.url);
	    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);
	
	    // Set the request timeout in MS
	    request.timeout = config.timeout;
	
	    // Listen for ready state
	    request.onreadystatechange = function handleLoad() {
	      if (!request || request.readyState !== 4) {
	        return;
	      }
	
	      // The request errored out and we didn't get a response, this will be
	      // handled by onerror instead
	      // With one exception: request that using file: protocol, most browsers
	      // will return status as 0 even though it's a successful request
	      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
	        return;
	      }
	
	      // Prepare the response
	      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
	      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
	      var response = {
	        data: responseData,
	        status: request.status,
	        statusText: request.statusText,
	        headers: responseHeaders,
	        config: config,
	        request: request
	      };
	
	      settle(resolve, reject, response);
	
	      // Clean up request
	      request = null;
	    };
	
	    // Handle browser request cancellation (as opposed to a manual cancellation)
	    request.onabort = function handleAbort() {
	      if (!request) {
	        return;
	      }
	
	      reject(createError('Request aborted', config, 'ECONNABORTED', request));
	
	      // Clean up request
	      request = null;
	    };
	
	    // Handle low level network errors
	    request.onerror = function handleError() {
	      // Real errors are hidden from us by the browser
	      // onerror should only fire if it's a network error
	      reject(createError('Network Error', config, null, request));
	
	      // Clean up request
	      request = null;
	    };
	
	    // Handle timeout
	    request.ontimeout = function handleTimeout() {
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
	    if (utils.isStandardBrowserEnv()) {
	      var cookies = __webpack_require__(21);
	
	      // Add xsrf header
	      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
	        cookies.read(config.xsrfCookieName) :
	        undefined;
	
	      if (xsrfValue) {
	        requestHeaders[config.xsrfHeaderName] = xsrfValue;
	      }
	    }
	
	    // Add headers to the request
	    if ('setRequestHeader' in request) {
	      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
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
	    if (!utils.isUndefined(config.withCredentials)) {
	      request.withCredentials = !!config.withCredentials;
	    }
	
	    // Add responseType to request if needed
	    if (config.responseType) {
	      try {
	        request.responseType = config.responseType;
	      } catch (e) {
	        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
	        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
	        if (config.responseType !== 'json') {
	          throw e;
	        }
	      }
	    }
	
	    // Handle progress if needed
	    if (typeof config.onDownloadProgress === 'function') {
	      request.addEventListener('progress', config.onDownloadProgress);
	    }
	
	    // Not all browsers support upload events
	    if (typeof config.onUploadProgress === 'function' && request.upload) {
	      request.upload.addEventListener('progress', config.onUploadProgress);
	    }
	
	    if (config.cancelToken) {
	      // Handle cancellation
	      config.cancelToken.promise.then(function onCanceled(cancel) {
	        if (!request) {
	          return;
	        }
	
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


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var createError = __webpack_require__(14);
	
	/**
	 * 根据validateStatus(response.status)决定到底是resolve还是reject
	 *
	 * @param {Function} resolve A function that resolves the promise.
	 * @param {Function} reject A function that rejects the promise.
	 * @param {object} response The response.
	 */
	module.exports = function settle(resolve, reject, response) {
	  // 获取响应的validateStatus方法，它用于定义什么状态码表示成功
	  var validateStatus = response.config.validateStatus;
	  // response.status或者validateStatus就直接resolve
	  // 如果都存在，判断validateStatus(response.status)的结果，再resolve
	  if (!response.status || !validateStatus || validateStatus(response.status)) {
	    resolve(response);
	  } else {
	    // reject传入的参数是createError的调用结果
	    reject(createError(
	      'Request failed with status code ' + response.status,
	      response.config,
	      null,
	      response.request,
	      response
	    ));
	  }
	};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var enhanceError = __webpack_require__(15);
	
	/**
	 * Create an Error with the specified message, config, error code, request and response.
	 * 其实就返回了enhanceError的调用结果，只不过第一个参数传的是err对象
	 *
	 * @param {string} message 错误信息
	 * @param {Object} config The config.
	 * @param {string} [code] 错误码 (for example, 'ECONNABORTED').
	 * @param {Object} [request] 请求
	 * @param {Object} [response] 响应
	 * @returns {Error} The created error.
	 */
	module.exports = function createError(message, config, code, request, response) {
	  var error = new Error(message);
	  return enhanceError(error, config, code, request, response);
	};


/***/ }),
/* 15 */
/***/ (function(module, exports) {

	'use strict';
	
	/**
	 * Update an Error with the specified config, error code, and response.
	 *
	 * @param {Error} error The error to update.
	 * @param {Object} config The config.
	 * @param {string} [code] The error code (for example, 'ECONNABORTED').
	 * @param {Object} [request] The request.
	 * @param {Object} [response] The response.
	 * @returns {Error} The error.
	 */
	module.exports = function enhanceError(error, config, code, request, response) {
	  // error对象上添加config、code、request、response属性
	  error.config = config;
	  if (code) {
	    error.code = code;
	  }
	
	  error.request = request;
	  error.response = response;
	  // 设置isAxiosError标志
	  error.isAxiosError = true;
	
	  // 添加toJson方法
	  error.toJSON = function toJSON() {
	    return {
	      // 这两个是Error实例的标准属性
	      message: this.message,
	      name: this.name,
	      // Microsoft
	      description: this.description,
	      number: this.number,
	      // Mozilla
	      fileName: this.fileName,
	      lineNumber: this.lineNumber,
	      columnNumber: this.columnNumber,
	      stack: this.stack,
	      // Axios
	      config: this.config,
	      code: this.code
	    };
	  };
	  return error;
	};


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var isAbsoluteURL = __webpack_require__(17);
	var combineURLs = __webpack_require__(18);
	
	/**
	 * Creates a new URL by combining the baseURL with the requestedURL,
	 * only when the requestedURL is not already an absolute URL.
	 * If the requestURL is absolute, this function returns the requestedURL untouched.
	 *
	 * @param {string} baseURL The base URL
	 * @param {string} requestedURL Absolute or relative URL to combine
	 * @returns {string} The combined full path
	 */
	module.exports = function buildFullPath(baseURL, requestedURL) {
	  // 如果基本url存在或者requestedURL是相对路径，返回合并后的路径
	  // 否则返回requestedURL
	  if (baseURL && !isAbsoluteURL(requestedURL)) {
	    return combineURLs(baseURL, requestedURL);
	  }
	  return requestedURL;
	};


/***/ }),
/* 17 */
/***/ (function(module, exports) {

	'use strict';
	
	/**
	 * 判断是否是绝对地址
	 * `协议://`开头或者`//`开头
	 *
	 * @param {string} url The URL to test
	 * @returns {boolean} True if the specified URL is absolute, otherwise false
	 */
	module.exports = function isAbsoluteURL(url) {
	  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
	  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
	  // by any combination of letters, digits, plus, period, or hyphen.
	  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
	};


/***/ }),
/* 18 */
/***/ (function(module, exports) {

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


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(2);
	
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


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(2);
	
	module.exports = (
	  utils.isStandardBrowserEnv() ?
	
	  // Standard browser envs have full support of the APIs needed to test
	  // whether the request URL is of the same origin as current location.
	  // 标准浏览器环境，这个功能才是真正支持的
	    (function standardBrowserEnv() {
	      var msie = /(msie|trident)/i.test(navigator.userAgent);
	      // 利用a标签来解析URL
	      var urlParsingNode = document.createElement('a');
	      var originURL;
	
	      /**
	    * Parse a URL to discover it's components
	    *
	    * @param {String} url The URL to be parsed
	    * @returns {Object}
	    */
	      function resolveURL(url) {
	        var href = url;
	
	        if (msie) {
	        // ie需要同时设置属性和特性
	        // IE needs attribute set twice to normalize properties
	          urlParsingNode.setAttribute('href', href);
	          href = urlParsingNode.href;
	        }
	
	        urlParsingNode.setAttribute('href', href);
	
	        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
	        return {
	          href: urlParsingNode.href,
	          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
	          host: urlParsingNode.host,
	          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
	          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
	          hostname: urlParsingNode.hostname,
	          port: urlParsingNode.port,
	          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
	            urlParsingNode.pathname :
	            '/' + urlParsingNode.pathname
	        };
	      }
	
	      originURL = resolveURL(window.location.href);
	
	      /**
	    * Determine if a URL shares the same origin as the current location
	    * 判断协议和host都相同的就算它们属于同域
	    *
	    * @param {String} requestURL The URL to test
	    * @returns {boolean} True if URL shares the same origin, otherwise false
	    */
	      return function isURLSameOrigin(requestURL) {
	        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
	        return (parsed.protocol === originURL.protocol &&
	            parsed.host === originURL.host);
	      };
	    })() :
	
	  // Non standard browser envs (web workers, react-native) lack needed support.
	    // 如果是非标准浏览器环境，该方法直接返回true
	    (function nonStandardBrowserEnv() {
	      return function isURLSameOrigin() {
	        return true;
	      };
	    })()
	);


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(2);
	
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


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(2);
	
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


/***/ }),
/* 23 */
/***/ (function(module, exports) {

	'use strict';
	
	/**
	 * A `Cancel` is an object that is thrown when an operation is canceled.
	 * Cancel构造器
	 * @class
	 * @param {string=} message The message.
	 */
	function Cancel(message) {
	  // 设置实例属性message
	  this.message = message;
	}
	
	// 原型上增加toString方法
	Cancel.prototype.toString = function toString() {
	  return 'Cancel' + (this.message ? ': ' + this.message : '');
	};
	
	// 原型属性__CANCEL__为true
	Cancel.prototype.__CANCEL__ = true;
	
	module.exports = Cancel;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var Cancel = __webpack_require__(23);
	
	/**
	 * A `CancelToken` is an object that can be used to request cancellation of an operation.
	 * CancelToken构造器
	 * @class
	 * @param {Function} executor 执行器，必须是一个函数
	 */
	function CancelToken(executor) {
	  if (typeof executor !== 'function') {
	    throw new TypeError('executor must be a function.');
	  }
	
	  var resolvePromise;
	  // 创建一个promise实例，把它的resolve方法暂存到变量resolvePromise
	  this.promise = new Promise(function promiseExecutor(resolve) {
	    resolvePromise = resolve;
	  });
	
	  var token = this;
	  // 调用执行器，它接收cancel函数作为参数
	  // 下面的代码CancelToken.source方法中，创建实例后，cancel方法就会被暴露出来给变量cancel
	  executor(function cancel(message) {
	    // 如果实例上存在reason，说明已经执行过了
	    if (token.reason) {
	      // Cancellation has already been requested
	      return;
	    }
	    // 实例化Cancel构造器，暂存为token.reason,作为取消的原因
	    token.reason = new Cancel(message);
	    // 完成这个promise
	    // 把promise的控制权放在executor函数里面
	    resolvePromise(token.reason);
	  });
	}
	
	/**
	 * Throws a `Cancel` if cancellation has been requested.
	 * 如果取消已经被执行过了,直接抛出异常
	 */
	CancelToken.prototype.throwIfRequested = function throwIfRequested() {
	  if (this.reason) {
	    throw this.reason;
	  }
	};
	
	/**
	 * Returns an object that contains a new `CancelToken` and a function that, when called,
	 * cancels the `CancelToken`.
	 * 添加静态方法
	 */
	CancelToken.source = function source() {
	  var cancel;
	  // 又创建一个新的CancelToken实例
	  var token = new CancelToken(function executor(c) {
	    // 用cancel将executor方法的变量c的控制权拿出来了
	    // 这个c就是上面的`function cancel(message) {}`
	    cancel = c;
	  });
	  return {
	    token: token,
	    cancel: cancel
	  };
	};
	
	module.exports = CancelToken;


/***/ }),
/* 25 */
/***/ (function(module, exports) {

	'use strict';
	
	/**
	 * 它是一个高阶函数，接收回调作为参数，返回了一个包装函数wrap
	 * wrap函数接收一个数组作为参数，返回回调函数的调用结果，数组作为参数被传入。
	 * 因为回调函数是通过fn.apply()方式调用的，所以它实际上是把数组的每一项展开作为回调函数的实参了
	 * Syntactic sugar for invoking a function and expanding an array for arguments.
	 *
	 * Common use case would be to use `Function.prototype.apply`.
	 *
	 *  ```js
	 *  function f(x, y, z) {}
	 *  var args = [1, 2, 3];
	 *  f.apply(null, args);
	 *  ```
	 *
	 * With `spread` this example can be re-written.
	 *
	 *  ```js
	 *  spread(function(x, y, z) {})([1, 2, 3]);
	 *  ```
	 *
	 * @param {Function} callback
	 * @returns {Function}
	 */
	module.exports = function spread(callback) {
	  return function wrap(arr) {
	    return callback.apply(null, arr);
	  };
	};


/***/ })
/******/ ])
});
;
//# sourceMappingURL=axios.map
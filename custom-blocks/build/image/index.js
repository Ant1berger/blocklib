/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@monaco-editor/loader/lib/es/_virtual/_rollupPluginBabelHelpers.js":
/*!*****************************************************************************************!*\
  !*** ./node_modules/@monaco-editor/loader/lib/es/_virtual/_rollupPluginBabelHelpers.js ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   arrayLikeToArray: () => (/* binding */ _arrayLikeToArray),
/* harmony export */   arrayWithHoles: () => (/* binding */ _arrayWithHoles),
/* harmony export */   defineProperty: () => (/* binding */ _defineProperty),
/* harmony export */   iterableToArrayLimit: () => (/* binding */ _iterableToArrayLimit),
/* harmony export */   nonIterableRest: () => (/* binding */ _nonIterableRest),
/* harmony export */   objectSpread2: () => (/* binding */ _objectSpread2),
/* harmony export */   objectWithoutProperties: () => (/* binding */ _objectWithoutProperties),
/* harmony export */   objectWithoutPropertiesLoose: () => (/* binding */ _objectWithoutPropertiesLoose),
/* harmony export */   slicedToArray: () => (/* binding */ _slicedToArray),
/* harmony export */   unsupportedIterableToArray: () => (/* binding */ _unsupportedIterableToArray)
/* harmony export */ });
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}




/***/ }),

/***/ "./node_modules/@monaco-editor/loader/lib/es/config/index.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@monaco-editor/loader/lib/es/config/index.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var config = {
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.43.0/min/vs'
  }
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (config);


/***/ }),

/***/ "./node_modules/@monaco-editor/loader/lib/es/index.js":
/*!************************************************************!*\
  !*** ./node_modules/@monaco-editor/loader/lib/es/index.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _loader_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _loader_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./loader/index.js */ "./node_modules/@monaco-editor/loader/lib/es/loader/index.js");




/***/ }),

/***/ "./node_modules/@monaco-editor/loader/lib/es/loader/index.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@monaco-editor/loader/lib/es/loader/index.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _virtual_rollupPluginBabelHelpers_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_virtual/_rollupPluginBabelHelpers.js */ "./node_modules/@monaco-editor/loader/lib/es/_virtual/_rollupPluginBabelHelpers.js");
/* harmony import */ var state_local__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! state-local */ "./node_modules/state-local/lib/es/state-local.js");
/* harmony import */ var _config_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../config/index.js */ "./node_modules/@monaco-editor/loader/lib/es/config/index.js");
/* harmony import */ var _validators_index_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../validators/index.js */ "./node_modules/@monaco-editor/loader/lib/es/validators/index.js");
/* harmony import */ var _utils_compose_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/compose.js */ "./node_modules/@monaco-editor/loader/lib/es/utils/compose.js");
/* harmony import */ var _utils_deepMerge_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/deepMerge.js */ "./node_modules/@monaco-editor/loader/lib/es/utils/deepMerge.js");
/* harmony import */ var _utils_makeCancelable_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/makeCancelable.js */ "./node_modules/@monaco-editor/loader/lib/es/utils/makeCancelable.js");








/** the local state of the module */

var _state$create = state_local__WEBPACK_IMPORTED_MODULE_1__["default"].create({
  config: _config_index_js__WEBPACK_IMPORTED_MODULE_2__["default"],
  isInitialized: false,
  resolve: null,
  reject: null,
  monaco: null
}),
    _state$create2 = (0,_virtual_rollupPluginBabelHelpers_js__WEBPACK_IMPORTED_MODULE_0__.slicedToArray)(_state$create, 2),
    getState = _state$create2[0],
    setState = _state$create2[1];
/**
 * set the loader configuration
 * @param {Object} config - the configuration object
 */


function config(globalConfig) {
  var _validators$config = _validators_index_js__WEBPACK_IMPORTED_MODULE_3__["default"].config(globalConfig),
      monaco = _validators$config.monaco,
      config = (0,_virtual_rollupPluginBabelHelpers_js__WEBPACK_IMPORTED_MODULE_0__.objectWithoutProperties)(_validators$config, ["monaco"]);

  setState(function (state) {
    return {
      config: (0,_utils_deepMerge_js__WEBPACK_IMPORTED_MODULE_5__["default"])(state.config, config),
      monaco: monaco
    };
  });
}
/**
 * handles the initialization of the monaco-editor
 * @return {Promise} - returns an instance of monaco (with a cancelable promise)
 */


function init() {
  var state = getState(function (_ref) {
    var monaco = _ref.monaco,
        isInitialized = _ref.isInitialized,
        resolve = _ref.resolve;
    return {
      monaco: monaco,
      isInitialized: isInitialized,
      resolve: resolve
    };
  });

  if (!state.isInitialized) {
    setState({
      isInitialized: true
    });

    if (state.monaco) {
      state.resolve(state.monaco);
      return (0,_utils_makeCancelable_js__WEBPACK_IMPORTED_MODULE_6__["default"])(wrapperPromise);
    }

    if (window.monaco && window.monaco.editor) {
      storeMonacoInstance(window.monaco);
      state.resolve(window.monaco);
      return (0,_utils_makeCancelable_js__WEBPACK_IMPORTED_MODULE_6__["default"])(wrapperPromise);
    }

    (0,_utils_compose_js__WEBPACK_IMPORTED_MODULE_4__["default"])(injectScripts, getMonacoLoaderScript)(configureLoader);
  }

  return (0,_utils_makeCancelable_js__WEBPACK_IMPORTED_MODULE_6__["default"])(wrapperPromise);
}
/**
 * injects provided scripts into the document.body
 * @param {Object} script - an HTML script element
 * @return {Object} - the injected HTML script element
 */


function injectScripts(script) {
  return document.body.appendChild(script);
}
/**
 * creates an HTML script element with/without provided src
 * @param {string} [src] - the source path of the script
 * @return {Object} - the created HTML script element
 */


function createScript(src) {
  var script = document.createElement('script');
  return src && (script.src = src), script;
}
/**
 * creates an HTML script element with the monaco loader src
 * @return {Object} - the created HTML script element
 */


function getMonacoLoaderScript(configureLoader) {
  var state = getState(function (_ref2) {
    var config = _ref2.config,
        reject = _ref2.reject;
    return {
      config: config,
      reject: reject
    };
  });
  var loaderScript = createScript("".concat(state.config.paths.vs, "/loader.js"));

  loaderScript.onload = function () {
    return configureLoader();
  };

  loaderScript.onerror = state.reject;
  return loaderScript;
}
/**
 * configures the monaco loader
 */


function configureLoader() {
  var state = getState(function (_ref3) {
    var config = _ref3.config,
        resolve = _ref3.resolve,
        reject = _ref3.reject;
    return {
      config: config,
      resolve: resolve,
      reject: reject
    };
  });
  var require = window.require;

  require.config(state.config);

  require(['vs/editor/editor.main'], function (monaco) {
    storeMonacoInstance(monaco);
    state.resolve(monaco);
  }, function (error) {
    state.reject(error);
  });
}
/**
 * store monaco instance in local state
 */


function storeMonacoInstance(monaco) {
  if (!getState().monaco) {
    setState({
      monaco: monaco
    });
  }
}
/**
 * internal helper function
 * extracts stored monaco instance
 * @return {Object|null} - the monaco instance
 */


function __getMonacoInstance() {
  return getState(function (_ref4) {
    var monaco = _ref4.monaco;
    return monaco;
  });
}

var wrapperPromise = new Promise(function (resolve, reject) {
  return setState({
    resolve: resolve,
    reject: reject
  });
});
var loader = {
  config: config,
  init: init,
  __getMonacoInstance: __getMonacoInstance
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (loader);


/***/ }),

/***/ "./node_modules/@monaco-editor/loader/lib/es/utils/compose.js":
/*!********************************************************************!*\
  !*** ./node_modules/@monaco-editor/loader/lib/es/utils/compose.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var compose = function compose() {
  for (var _len = arguments.length, fns = new Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  return function (x) {
    return fns.reduceRight(function (y, f) {
      return f(y);
    }, x);
  };
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (compose);


/***/ }),

/***/ "./node_modules/@monaco-editor/loader/lib/es/utils/curry.js":
/*!******************************************************************!*\
  !*** ./node_modules/@monaco-editor/loader/lib/es/utils/curry.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function curry(fn) {
  return function curried() {
    var _this = this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return args.length >= fn.length ? fn.apply(this, args) : function () {
      for (var _len2 = arguments.length, nextArgs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        nextArgs[_key2] = arguments[_key2];
      }

      return curried.apply(_this, [].concat(args, nextArgs));
    };
  };
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (curry);


/***/ }),

/***/ "./node_modules/@monaco-editor/loader/lib/es/utils/deepMerge.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@monaco-editor/loader/lib/es/utils/deepMerge.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _virtual_rollupPluginBabelHelpers_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_virtual/_rollupPluginBabelHelpers.js */ "./node_modules/@monaco-editor/loader/lib/es/_virtual/_rollupPluginBabelHelpers.js");


function merge(target, source) {
  Object.keys(source).forEach(function (key) {
    if (source[key] instanceof Object) {
      if (target[key]) {
        Object.assign(source[key], merge(target[key], source[key]));
      }
    }
  });
  return (0,_virtual_rollupPluginBabelHelpers_js__WEBPACK_IMPORTED_MODULE_0__.objectSpread2)((0,_virtual_rollupPluginBabelHelpers_js__WEBPACK_IMPORTED_MODULE_0__.objectSpread2)({}, target), source);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (merge);


/***/ }),

/***/ "./node_modules/@monaco-editor/loader/lib/es/utils/isObject.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@monaco-editor/loader/lib/es/utils/isObject.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function isObject(value) {
  return {}.toString.call(value).includes('Object');
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isObject);


/***/ }),

/***/ "./node_modules/@monaco-editor/loader/lib/es/utils/makeCancelable.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@monaco-editor/loader/lib/es/utils/makeCancelable.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CANCELATION_MESSAGE: () => (/* binding */ CANCELATION_MESSAGE),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// The source (has been changed) is https://github.com/facebook/react/issues/5465#issuecomment-157888325
var CANCELATION_MESSAGE = {
  type: 'cancelation',
  msg: 'operation is manually canceled'
};

function makeCancelable(promise) {
  var hasCanceled_ = false;
  var wrappedPromise = new Promise(function (resolve, reject) {
    promise.then(function (val) {
      return hasCanceled_ ? reject(CANCELATION_MESSAGE) : resolve(val);
    });
    promise["catch"](reject);
  });
  return wrappedPromise.cancel = function () {
    return hasCanceled_ = true;
  }, wrappedPromise;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (makeCancelable);



/***/ }),

/***/ "./node_modules/@monaco-editor/loader/lib/es/validators/index.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@monaco-editor/loader/lib/es/validators/index.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   errorHandler: () => (/* binding */ errorHandler),
/* harmony export */   errorMessages: () => (/* binding */ errorMessages)
/* harmony export */ });
/* harmony import */ var _utils_curry_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/curry.js */ "./node_modules/@monaco-editor/loader/lib/es/utils/curry.js");
/* harmony import */ var _utils_isObject_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/isObject.js */ "./node_modules/@monaco-editor/loader/lib/es/utils/isObject.js");



/**
 * validates the configuration object and informs about deprecation
 * @param {Object} config - the configuration object 
 * @return {Object} config - the validated configuration object
 */

function validateConfig(config) {
  if (!config) errorHandler('configIsRequired');
  if (!(0,_utils_isObject_js__WEBPACK_IMPORTED_MODULE_1__["default"])(config)) errorHandler('configType');

  if (config.urls) {
    informAboutDeprecation();
    return {
      paths: {
        vs: config.urls.monacoBase
      }
    };
  }

  return config;
}
/**
 * logs deprecation message
 */


function informAboutDeprecation() {
  console.warn(errorMessages.deprecation);
}

function throwError(errorMessages, type) {
  throw new Error(errorMessages[type] || errorMessages["default"]);
}

var errorMessages = {
  configIsRequired: 'the configuration object is required',
  configType: 'the configuration object should be an object',
  "default": 'an unknown error accured in `@monaco-editor/loader` package',
  deprecation: "Deprecation warning!\n    You are using deprecated way of configuration.\n\n    Instead of using\n      monaco.config({ urls: { monacoBase: '...' } })\n    use\n      monaco.config({ paths: { vs: '...' } })\n\n    For more please check the link https://github.com/suren-atoyan/monaco-loader#config\n  "
};
var errorHandler = (0,_utils_curry_js__WEBPACK_IMPORTED_MODULE_0__["default"])(throwError)(errorMessages);
var validators = {
  config: validateConfig
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (validators);



/***/ }),

/***/ "./src/blocks.js":
/*!***********************!*\
  !*** ./src/blocks.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MyMonacoEditor: () => (/* binding */ MyMonacoEditor),
/* harmony export */   addMediaQuery: () => (/* binding */ addMediaQuery),
/* harmony export */   handleThemeOptionsForSelects: () => (/* binding */ handleThemeOptionsForSelects),
/* harmony export */   parseSVG: () => (/* binding */ parseSVG),
/* harmony export */   persistentIDs: () => (/* binding */ persistentIDs),
/* harmony export */   removeMediaQuery: () => (/* binding */ removeMediaQuery),
/* harmony export */   updateMediaQuery: () => (/* binding */ updateMediaQuery),
/* harmony export */   updatePersistentIDs: () => (/* binding */ updatePersistentIDs),
/* harmony export */   updateTagName: () => (/* binding */ updateTagName)
/* harmony export */ });
/* harmony import */ var _monaco_editor_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @monaco-editor/react */ "./node_modules/@monaco-editor/react/dist/index.mjs");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);
// The file for all shared stuff among blocks.



// Initialize Monaco editor

const MyMonacoEditor = ({
  defaultValue,
  value,
  onChange
}) => {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_monaco_editor_react__WEBPACK_IMPORTED_MODULE_0__["default"], {
    height: "100%",
    language: "css",
    theme: "vs-dark",
    defaultValue: defaultValue,
    value: value,
    onChange: newValue => onChange(newValue),
    options: {
      minimap: {
        enabled: false
      },
      automaticLayout: true,
      lineNumbers: false
    }
  });
};

// Initialize unique IDs array
const persistentIDs = [];

// Create a unique and persistent ID for useBlockProps.
const updatePersistentIDs = function (setAttributes, persistentID, blockName, clientId) {
  if (null === persistentID || '' === persistentID || persistentIDs.includes(persistentID)) {
    const newpersistentID = 'blb-' + blockName + '-' + clientId.substr(2, 9).replace('-', '');
    setAttributes({
      persistentID: newpersistentID
    });
    persistentIDs.push(newpersistentID);
  } else {
    persistentIDs.push(persistentID);
  }
};

// Transform an SVG string into a React element.
const parseSVG = svgString => {
  if (!svgString) return null;
  // Create a temporary element
  const div = document.createElement('div');
  div.innerHTML = svgString.trim();

  // Retrieve the first SVG element.
  const svg = div.firstChild;

  // Extract SVG attributes.
  const attrs = {};
  for (let i = 0; i < svg.attributes.length; i++) {
    const attr = svg.attributes[i];
    attrs[attr.name] = attr.value;
  }

  // Return a React element with the SVG content and attributes.
  return React.createElement('svg', {
    ...attrs,
    dangerouslySetInnerHTML: {
      __html: svg.innerHTML
    }
  });
};

// Generates the choices for <select>s from the theme options.
const handleThemeOptionsForSelects = (optionId, emptyOptionText) => {
  let optionsArray = [{
    label: emptyOptionText,
    value: ''
  }];
  for (const property in optionId) {
    if (optionId[property]) {
      optionsArray.push({
        label: property,
        value: 'var(--' + property + ')'
      });
    }
  }
  ;
  return optionsArray;
};

// Avoid empty tagName for the rendered component.
const updateTagName = (setAttributes, setTagName, newTag, defaultTag) => {
  if (newTag.trim() === '') {
    newTag = defaultTag;
  }
  setTagName(newTag);
  setAttributes({
    tag: newTag
  });
};

// Add, remove, update and render the instances CSS, organized by media queries.
const addMediaQuery = (setAttributes, mediaQueries) => {
  const newQuery = {
    minWidth: '',
    predefinedColor: '',
    predefinedBGColor: '',
    predefinedFont: '',
    css: ''
  };
  setAttributes({
    mediaQueries: [...mediaQueries, newQuery]
  });
};
const removeMediaQuery = (setAttributes, index, mediaQueries) => {
  const updatedQueries = mediaQueries.filter((_, i) => i !== index);
  setAttributes({
    mediaQueries: updatedQueries
  });
};
const updateMediaQuery = (setAttributes, index, field, value, mediaQueries) => {
  const updatedQueries = mediaQueries.map((query, i) => i === index ? {
    ...query,
    [field]: value
  } : query);
  setAttributes({
    mediaQueries: updatedQueries
  });
};

/***/ }),

/***/ "./src/image/edit.js":
/*!***************************!*\
  !*** ./src/image/edit.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Edit)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _blocks__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../blocks */ "./src/blocks.js");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./block.json */ "./src/image/block.json");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @wordpress/core-data */ "@wordpress/core-data");
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__);










function Edit(props) {
  const {
    attributes,
    setAttributes,
    clientId
  } = props;
  const {
    persistentID,
    blockName,
    otherAttributes,
    pictureID,
    pictureURL,
    pictureMime,
    pictureAlt,
    pictureSizes,
    pictureSrcset,
    pictureSizesAttribute,
    pictureLoading,
    pictureFetchPriority,
    manualClasses,
    mediaQueries = [],
    renderedMediaQueries,
    anchor
  } = attributes;
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)();
  const {
    selectBlock
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_7__.useDispatch)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.store);
  const handleImageClick = e => {
    e.preventDefault();
    e.stopPropagation();
    selectBlock(clientId);
  };

  // Set the block name attribute from json "name" path for automatic reuse.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    setAttributes({
      blockName: _block_json__WEBPACK_IMPORTED_MODULE_6__.name.slice(14)
    });
  }, []);

  // Create a unique and persistent ID for useBlockProps.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    (0,_blocks__WEBPACK_IMPORTED_MODULE_3__.updatePersistentIDs)(setAttributes, persistentID, blockName, clientId);
  }, [blockName]);

  // Write media queries. This function stays in this file otherwise copy/paste of blocks don't work properly.
  const renderMediaQueries = () => {
    if (mediaQueries.length > 0) {
      return `[data-persistentid="${persistentID}"] {
${mediaQueries.map(query => {
        if (!query.css) {
          return null;
        } else {
          return `${query.minWidth ? `@media (min-width: ${query.minWidth}px) {
${query.css ? `${query.css}` : ''}
}` : `${query.css ? `${query.css}` : ''}`}`;
        }
      }).join('\n')}
}`;
    } else {
      return null;
    }
  };
  // Put the returned value in a renderedMediaQueries attribute.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    setAttributes({
      renderedMediaQueries: renderMediaQueries()
    });
  }, [persistentID, renderMediaQueries()]);

  // Add and remove images
  const onSelectImage = picture => {
    setAttributes({
      pictureID: picture.id,
      pictureURL: picture.url,
      pictureMime: picture.mime,
      pictureAlt: picture.alt,
      pictureSizes: picture.sizes
    });
  };
  const onRemoveImage = () => {
    setAttributes({
      pictureID: null,
      pictureURL: null,
      pictureMime: null,
      pictureAlt: null,
      pictureSizes: null,
      pictureSrcset: null
    });
  };

  // Set srcset from pictureSizes
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    let srcset = '';
    if (pictureSizes) {
      Object.keys(pictureSizes).forEach(size => {
        if (pictureSizes[size].width != '150') {
          srcset += `${pictureSizes[size].url} ${pictureSizes[size].width}w, `;
        }
      });
      setAttributes({
        pictureSrcset: srcset.slice(0, -2)
      });
    }
  }, [pictureSizes]);

  // Manage LCP
  const postType = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_7__.useSelect)(select => select('core/editor').getCurrentPostType(), []);
  const [meta, setMeta] = (0,_wordpress_core_data__WEBPACK_IMPORTED_MODULE_8__.useEntityProp)('postType', postType, 'meta');
  const setAsLCP = () => {
    const newMeta = {
      ...meta,
      lcp_preload: {
        url: pictureURL,
        srcset: pictureSrcset,
        sizes: pictureSizesAttribute,
        as: pictureMime?.split('/')[0] || 'image',
        mime: pictureMime
      }
    };
    setMeta(newMeta);
  };
  const disableLCP = () => {
    const newMeta = {
      ...meta,
      lcp_preload: {
        url: '',
        srcset: '',
        sizes: '',
        as: '',
        mime: ''
      }
    };
    setMeta(newMeta);
  };
  const lcpData = meta?.lcp_preload || {};
  const hasLCP = !!lcpData.url;
  const isThisImageLCP = hasLCP && lcpData.url === pictureURL;
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    if (isThisImageLCP) {
      setAttributes({
        pictureLoading: '',
        pictureFetchPriority: 'high'
      });
    }
  }, [isThisImageLCP]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Base settings', 'bloclklib'),
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.BaseControl, {
          __nextHasNoMarginBottom: true,
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Image', 'bloclklib'),
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUploadCheck, {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.MediaUpload, {
              onSelect: onSelectImage,
              allowedTypes: ['image'],
              value: pictureID,
              render: ({
                open
              }) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
                children: [!pictureID && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Button, {
                  variant: "secondary",
                  onClick: open,
                  children: [" ", (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Select an image', 'bloclklib')]
                }), !!pictureID && pictureID && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Button, {
                  variant: "link",
                  onClick: open,
                  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("img", {
                    src: pictureURL,
                    alt: pictureAlt
                  })
                })]
              })
            })
          }), !!pictureID && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Button, {
            onClick: onRemoveImage,
            isDestructive: true,
            variant: "secondary",
            size: "small",
            icon: "trash",
            className: "delete-image"
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.BaseControl, {
          __nextHasNoMarginBottom: true,
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('(min-width: 60rem) 80vw, (min-width: 40rem) 90vw, 100vw', 'bloclklib'),
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.TextControl, {
            __nextHasNoMarginBottom: true,
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Sizes', 'bloclklib'),
            value: pictureSizesAttribute || '',
            onChange: value => setAttributes({
              pictureSizesAttribute: value
            }),
            placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Add Sizes attribute', 'blocklib')
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("hr", {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.TextControl, {
          __nextHasNoMarginBottom: true,
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Classes', 'bloclklib'),
          value: manualClasses || '',
          onChange: value => setAttributes({
            manualClasses: value
          }),
          placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Add HTML classes if needed', 'blocklib')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.BaseControl, {
          __nextHasNoMarginBottom: true,
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Avoid using style attribute, it\'s already in use and might be ignored.', 'bloclklib'),
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.TextControl, {
            __nextHasNoMarginBottom: true,
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Other attributes', 'bloclklib'),
            value: otherAttributes || '',
            onChange: value => setAttributes({
              otherAttributes: value
            }),
            placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Add HTML attributes if needed', 'blocklib')
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.TextControl, {
          __nextHasNoMarginBottom: true,
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Anchor', 'bloclklib'),
          value: anchor || '',
          onChange: value => setAttributes({
            anchor: value
          }),
          placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Add HTML ID if needed (no spaces)', 'blocklib')
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Spacing, sizing, moving...', 'bloclklib'),
        initialOpen: true,
        children: [mediaQueries.map((query, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
          className: "media-query",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.TextControl, {
            __nextHasNoMarginBottom: true,
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('@media (min-width: ', 'bloclklib'),
            value: query.minWidth,
            onChange: value => (0,_blocks__WEBPACK_IMPORTED_MODULE_3__.updateMediaQuery)(setAttributes, index, 'minWidth', value, mediaQueries)
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.PanelRow, {
            className: "monaco-editor",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_blocks__WEBPACK_IMPORTED_MODULE_3__.MyMonacoEditor, {
              defaultValue: `& {\n}`,
              value: query.css,
              onChange: value => (0,_blocks__WEBPACK_IMPORTED_MODULE_3__.updateMediaQuery)(setAttributes, index, 'css', value, mediaQueries)
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Button, {
            isDestructive: true,
            variant: "secondary",
            size: "small",
            icon: "trash",
            className: "delete",
            onClick: () => (0,_blocks__WEBPACK_IMPORTED_MODULE_3__.removeMediaQuery)(setAttributes, index, mediaQueries)
          })]
        }, index)), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Button, {
          variant: "primary",
          onClick: () => (0,_blocks__WEBPACK_IMPORTED_MODULE_3__.addMediaQuery)(setAttributes, mediaQueries),
          className: "add-media-query",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Add a media query', 'bloclklib')
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.PanelBody, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Image performance settings', 'bloclklib'),
        initialOpen: true,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.__experimentalText, {
          children: hasLCP && !isThisImageLCP ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Warning: Another image is currently set as LCP. Clicking those buttons will override the previous setting.', 'blocklib') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Manage LCP for this post.', 'blocklib')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.BaseControl, {
          __nextHasNoMarginBottom: true,
          help: hasLCP ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)(`Current LCP: ${lcpData.url}}`, 'blocklib') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('No current LCP'),
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
            className: "lcp-controls",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Button, {
              variant: isThisImageLCP ? "secondary" : "primary",
              onClick: setAsLCP,
              disabled: !pictureURL,
              className: "set-lcp-button",
              children: isThisImageLCP ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('This image is the current LCP', 'blocklib') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Set this image as LCP', 'blocklib')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Button, {
              variant: "secondary",
              onClick: disableLCP,
              isDestructive: true,
              className: "disable-lcp-button",
              disabled: !hasLCP,
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Disable LCP preload for this post', 'blocklib')
            })]
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.BaseControl, {
          __nextHasNoMarginBottom: true,
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Don\'t lazy load images above the fold, but all the others.', 'bloclklib'),
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.SelectControl, {
            __nextHasNoMarginBottom: true,
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Loading', 'bloclklib'),
            options: [{
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Not set', 'bloclklib'),
              value: ''
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Lazy', 'bloclklib'),
              value: 'lazy'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Eager', 'bloclklib'),
              value: 'eager'
            }],
            value: pictureLoading,
            onChange: newValue => setAttributes({
              pictureLoading: newValue
            }),
            disabled: isThisImageLCP
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.BaseControl, {
          __nextHasNoMarginBottom: true,
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Don\'t overuse fetch priority, but use it when one image has to be loaded first among others, even below the fold.', 'bloclklib'),
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.SelectControl, {
            __nextHasNoMarginBottom: true,
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Fetch priority', 'bloclklib'),
            options: [{
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Not set', 'bloclklib'),
              value: ''
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('High', 'bloclklib'),
              value: 'high'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Low', 'bloclklib'),
              value: 'low'
            }],
            value: pictureFetchPriority,
            onChange: newValue => setAttributes({
              pictureFetchPriority: newValue
            }),
            disabled: isThisImageLCP
          })
        })]
      })]
    }), renderedMediaQueries && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("style", {
      children: renderedMediaQueries
    }), !!pictureID && pictureID ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("img", {
      ...blockProps,
      onClick: handleImageClick,
      src: pictureURL,
      alt: pictureAlt,
      "data-persistentid": persistentID,
      className: [blockName, manualClasses || ''].filter(Boolean).join(' ')
    }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("svg", {
      id: "Layer_1",
      "data-name": "Layer 1",
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 512 512",
      width: "300",
      height: "300",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("title", {
        children: "no-image"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("path", {
        class: "cls-1",
        d: "M292,256.36a5.13,5.13,0,0,1-5.14,5.14H225.14a5.13,5.13,0,0,1-5.14-5.14V204.93a5.13,5.13,0,0,1,5.14-5.14h61.71a5.13,5.13,0,0,1,5.14,5.14v51.43Zm-5.14-41.14V204.93H253.59L251,210.08H225.14v5.14h61.71Zm0,41.14v-5.14H225.14v5.14h61.71Zm-41.14-48.85v-5.14H230.29v5.14h15.43ZM256,217.87a15.43,15.43,0,1,0,15.43,15.43A15.43,15.43,0,0,0,256,217.87Zm0,25.71a10.29,10.29,0,1,1,10.28-10.29A10.31,10.31,0,0,1,256,243.58Zm0-16.79a6.45,6.45,0,0,0-6.43,6.43,1.29,1.29,0,0,0,2.57,0,3.86,3.86,0,0,1,3.86-3.86A1.29,1.29,0,0,0,256,226.79Z"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("path", {
        class: "cls-1",
        d: "M162.67,298.14h2.45l0.25,2.52h0.11c1.66-1.66,3.46-3,5.87-3,3.67,0,5.33,2.38,5.33,6.84v11.09h-3V304.94c0-3.28-1-4.68-3.31-4.68-1.8,0-3,.94-4.79,2.7v12.67h-3V298.14Z"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("path", {
        class: "cls-1",
        d: "M189.17,297.71c4.28,0,8.1,3.35,8.1,9.21s-3.82,9.14-8.1,9.14-8.1-3.35-8.1-9.14S184.88,297.71,189.17,297.71Zm0,15.91c3,0,5-2.7,5-6.7s-2-6.77-5-6.77-5,2.74-5,6.77S186.18,313.62,189.17,313.62Z"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("path", {
        class: "cls-1",
        d: "M208.61,292.63a2.06,2.06,0,0,1,4.1,0A2.06,2.06,0,0,1,208.61,292.63Zm0.54,5.51h3v17.49h-3V298.14Z"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("path", {
        class: "cls-1",
        d: "M218,298.14h2.45l0.25,2.52h0.11c1.51-1.66,3.35-3,5.44-3a4.59,4.59,0,0,1,4.82,3.35c1.84-2,3.64-3.35,5.76-3.35,3.6,0,5.33,2.38,5.33,6.84v11.09h-3V304.94c0-3.28-1-4.68-3.24-4.68-1.37,0-2.77.9-4.39,2.7v12.67h-3V304.94c0-3.28-1-4.68-3.28-4.68-1.3,0-2.77.9-4.39,2.7v12.67h-3V298.14Z"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("path", {
        class: "cls-1",
        d: "M257.74,304.54c0-2.23-.76-4.39-3.6-4.39a9.41,9.41,0,0,0-5.22,1.87L247.74,300a13,13,0,0,1,6.88-2.27c4.28,0,6.08,2.84,6.08,7.2v10.73h-2.45L258,313.54h-0.07a9.51,9.51,0,0,1-5.8,2.52c-3,0-5.15-1.84-5.15-5C247,307.28,250.29,305.37,257.74,304.54ZM253,313.69c1.69,0,3.1-.83,4.79-2.34v-4.86c-5.87.72-7.85,2.16-7.85,4.39C249.9,312.86,251.23,313.69,253,313.69Z"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("path", {
        class: "cls-1",
        d: "M267.5,315v-0.14A3.23,3.23,0,0,1,266,312a4.1,4.1,0,0,1,1.91-3.24v-0.14a6.19,6.19,0,0,1-2.27-4.71c0-3.82,3-6.23,6.59-6.23a7,7,0,0,1,2.48.43h6.08v2.27h-3.6a5.07,5.07,0,0,1,1.44,3.6c0,3.74-2.84,6.08-6.41,6.08a6.1,6.1,0,0,1-2.63-.61,2.65,2.65,0,0,0-1.12,2.09c0,1.12.72,1.91,3.1,1.91h3.38c4.07,0,6.12,1.26,6.12,4.18,0,3.24-3.42,6-8.86,6-4.28,0-7.23-1.69-7.23-4.72A5.05,5.05,0,0,1,267.5,315Zm5.11,6.62c3.35,0,5.54-1.73,5.54-3.56,0-1.62-1.26-2.16-3.53-2.16h-3a8.52,8.52,0,0,1-2.27-.29,3.68,3.68,0,0,0-1.8,3C267.54,320.46,269.45,321.64,272.61,321.64Zm3.28-17.71c0-2.56-1.66-4.07-3.71-4.07s-3.71,1.51-3.71,4.07,1.69,4.17,3.71,4.17S275.89,306.49,275.89,303.93Z"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("path", {
        class: "cls-1",
        d: "M290.47,297.71c4.46,0,7,3.2,7,8.21a10.4,10.4,0,0,1-.11,1.62H285.54c0.22,3.78,2.48,6.16,5.83,6.16a7.9,7.9,0,0,0,4.36-1.37l1,1.94a10.41,10.41,0,0,1-5.76,1.8c-4.68,0-8.39-3.42-8.39-9.14S286.47,297.71,290.47,297.71Zm4.39,7.88c0-3.56-1.58-5.54-4.32-5.54-2.45,0-4.68,2-5,5.54h9.36Z"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("path", {
        class: "cls-1",
        d: "M309.19,320.71c2,0,3.24-1.58,4-3.74l0.4-1.3-7-17.53h3.06l3.56,9.68c0.54,1.51,1.15,3.31,1.69,4.93H315c0.5-1.58,1-3.38,1.48-4.93l3.13-9.68h2.88l-6.59,18.93c-1.22,3.46-3,6.08-6.55,6.08a5.81,5.81,0,0,1-2.05-.36l0.58-2.34A5.13,5.13,0,0,0,309.19,320.71Z"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("path", {
        class: "cls-1",
        d: "M332.26,297.71c4.46,0,7,3.2,7,8.21a10.4,10.4,0,0,1-.11,1.62H327.33c0.22,3.78,2.48,6.16,5.83,6.16a7.9,7.9,0,0,0,4.36-1.37l1,1.94a10.41,10.41,0,0,1-5.76,1.8c-4.68,0-8.39-3.42-8.39-9.14S328.27,297.71,332.26,297.71Zm4.39,7.88c0-3.56-1.58-5.54-4.32-5.54-2.45,0-4.68,2-5,5.54h9.36Z"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("path", {
        class: "cls-1",
        d: "M343.57,300.55H341v-2.23l2.74-.18,0.36-4.9h2.48v4.9h4.71v2.41h-4.71v9.72c0,2.16.68,3.38,2.7,3.38a6.36,6.36,0,0,0,2-.47l0.58,2.23a10.79,10.79,0,0,1-3.24.65c-3.74,0-5-2.37-5-5.83v-9.68Z"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("polygon", {
        class: "cls-1",
        points: "0 40 2 40 2 2 40 2 40 0 0 0 0 40"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("polygon", {
        class: "cls-1",
        points: "472 0 472 2 510 2 510 40 512 40 512 0 472 0"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("polygon", {
        class: "cls-1",
        points: "510 510 472 510 472 512 512 512 512 472 510 472 510 510"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("polygon", {
        class: "cls-1",
        points: "2 472 0 472 0 512 40 512 40 510 2 510 2 472"
      })]
    })]
  });
}

/***/ }),

/***/ "./src/image/save.js":
/*!***************************!*\
  !*** ./src/image/save.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ save)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);

// This file is mainly here to allow Gutenberg to record the HTML in the database,
// in order to allow tools like Yoast SEO to crawl the content.

function save(props) {
  const {
    attributes
  } = props;
  const {
    pictureURL,
    pictureAlt,
    persistentID
  } = attributes;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("img", {
    src: pictureURL,
    alt: pictureAlt,
    "data-persistentid": persistentID
  });
}

/***/ }),

/***/ "./src/image/index.css":
/*!*****************************!*\
  !*** ./src/image/index.css ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/state-local/lib/es/state-local.js":
/*!********************************************************!*\
  !*** ./node_modules/state-local/lib/es/state-local.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function compose() {
  for (var _len = arguments.length, fns = new Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  return function (x) {
    return fns.reduceRight(function (y, f) {
      return f(y);
    }, x);
  };
}

function curry(fn) {
  return function curried() {
    var _this = this;

    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return args.length >= fn.length ? fn.apply(this, args) : function () {
      for (var _len3 = arguments.length, nextArgs = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        nextArgs[_key3] = arguments[_key3];
      }

      return curried.apply(_this, [].concat(args, nextArgs));
    };
  };
}

function isObject(value) {
  return {}.toString.call(value).includes('Object');
}

function isEmpty(obj) {
  return !Object.keys(obj).length;
}

function isFunction(value) {
  return typeof value === 'function';
}

function hasOwnProperty(object, property) {
  return Object.prototype.hasOwnProperty.call(object, property);
}

function validateChanges(initial, changes) {
  if (!isObject(changes)) errorHandler('changeType');
  if (Object.keys(changes).some(function (field) {
    return !hasOwnProperty(initial, field);
  })) errorHandler('changeField');
  return changes;
}

function validateSelector(selector) {
  if (!isFunction(selector)) errorHandler('selectorType');
}

function validateHandler(handler) {
  if (!(isFunction(handler) || isObject(handler))) errorHandler('handlerType');
  if (isObject(handler) && Object.values(handler).some(function (_handler) {
    return !isFunction(_handler);
  })) errorHandler('handlersType');
}

function validateInitial(initial) {
  if (!initial) errorHandler('initialIsRequired');
  if (!isObject(initial)) errorHandler('initialType');
  if (isEmpty(initial)) errorHandler('initialContent');
}

function throwError(errorMessages, type) {
  throw new Error(errorMessages[type] || errorMessages["default"]);
}

var errorMessages = {
  initialIsRequired: 'initial state is required',
  initialType: 'initial state should be an object',
  initialContent: 'initial state shouldn\'t be an empty object',
  handlerType: 'handler should be an object or a function',
  handlersType: 'all handlers should be a functions',
  selectorType: 'selector should be a function',
  changeType: 'provided value of changes should be an object',
  changeField: 'it seams you want to change a field in the state which is not specified in the "initial" state',
  "default": 'an unknown error accured in `state-local` package'
};
var errorHandler = curry(throwError)(errorMessages);
var validators = {
  changes: validateChanges,
  selector: validateSelector,
  handler: validateHandler,
  initial: validateInitial
};

function create(initial) {
  var handler = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  validators.initial(initial);
  validators.handler(handler);
  var state = {
    current: initial
  };
  var didUpdate = curry(didStateUpdate)(state, handler);
  var update = curry(updateState)(state);
  var validate = curry(validators.changes)(initial);
  var getChanges = curry(extractChanges)(state);

  function getState() {
    var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (state) {
      return state;
    };
    validators.selector(selector);
    return selector(state.current);
  }

  function setState(causedChanges) {
    compose(didUpdate, update, validate, getChanges)(causedChanges);
  }

  return [getState, setState];
}

function extractChanges(state, causedChanges) {
  return isFunction(causedChanges) ? causedChanges(state.current) : causedChanges;
}

function updateState(state, changes) {
  state.current = _objectSpread2(_objectSpread2({}, state.current), changes);
  return changes;
}

function didStateUpdate(state, handler, changes) {
  isFunction(handler) ? handler(state.current) : Object.keys(changes).forEach(function (field) {
    var _handler$field;

    return (_handler$field = handler[field]) === null || _handler$field === void 0 ? void 0 : _handler$field.call(handler, state.current[field]);
  });
  return changes;
}

var index = {
  create: create
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (index);


/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

module.exports = window["React"];

/***/ }),

/***/ "react/jsx-runtime":
/*!**********************************!*\
  !*** external "ReactJSXRuntime" ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["ReactJSXRuntime"];

/***/ }),

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ ((module) => {

module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/blocks":
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
/***/ ((module) => {

module.exports = window["wp"]["blocks"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ ((module) => {

module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/core-data":
/*!**********************************!*\
  !*** external ["wp","coreData"] ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["wp"]["coreData"];

/***/ }),

/***/ "@wordpress/data":
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["data"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["element"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "./node_modules/@monaco-editor/react/dist/index.mjs":
/*!**********************************************************!*\
  !*** ./node_modules/@monaco-editor/react/dist/index.mjs ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DiffEditor: () => (/* binding */ we),
/* harmony export */   Editor: () => (/* binding */ de),
/* harmony export */   "default": () => (/* binding */ Ft),
/* harmony export */   loader: () => (/* reexport safe */ _monaco_editor_loader__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   useMonaco: () => (/* binding */ Le)
/* harmony export */ });
/* harmony import */ var _monaco_editor_loader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @monaco-editor/loader */ "./node_modules/@monaco-editor/loader/lib/es/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
var le={wrapper:{display:"flex",position:"relative",textAlign:"initial"},fullWidth:{width:"100%"},hide:{display:"none"}},v=le;var ae={container:{display:"flex",height:"100%",width:"100%",justifyContent:"center",alignItems:"center"}},Y=ae;function Me({children:e}){return react__WEBPACK_IMPORTED_MODULE_1__.createElement("div",{style:Y.container},e)}var Z=Me;var $=Z;function Ee({width:e,height:r,isEditorReady:n,loading:t,_ref:a,className:m,wrapperProps:E}){return react__WEBPACK_IMPORTED_MODULE_1__.createElement("section",{style:{...v.wrapper,width:e,height:r},...E},!n&&react__WEBPACK_IMPORTED_MODULE_1__.createElement($,null,t),react__WEBPACK_IMPORTED_MODULE_1__.createElement("div",{ref:a,style:{...v.fullWidth,...!n&&v.hide},className:m}))}var ee=Ee;var H=(0,react__WEBPACK_IMPORTED_MODULE_1__.memo)(ee);function Ce(e){(0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(e,[])}var k=Ce;function he(e,r,n=!0){let t=(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(!0);(0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(t.current||!n?()=>{t.current=!1}:e,r)}var l=he;function D(){}function h(e,r,n,t){return De(e,t)||be(e,r,n,t)}function De(e,r){return e.editor.getModel(te(e,r))}function be(e,r,n,t){return e.editor.createModel(r,n,t?te(e,t):void 0)}function te(e,r){return e.Uri.parse(r)}function Oe({original:e,modified:r,language:n,originalLanguage:t,modifiedLanguage:a,originalModelPath:m,modifiedModelPath:E,keepCurrentOriginalModel:g=!1,keepCurrentModifiedModel:N=!1,theme:x="light",loading:P="Loading...",options:y={},height:V="100%",width:z="100%",className:F,wrapperProps:j={},beforeMount:A=D,onMount:q=D}){let[M,O]=(0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(!1),[T,s]=(0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(!0),u=(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null),c=(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null),w=(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null),d=(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(q),o=(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(A),b=(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(!1);k(()=>{let i=_monaco_editor_loader__WEBPACK_IMPORTED_MODULE_0__["default"].init();return i.then(f=>(c.current=f)&&s(!1)).catch(f=>f?.type!=="cancelation"&&console.error("Monaco initialization: error:",f)),()=>u.current?I():i.cancel()}),l(()=>{if(u.current&&c.current){let i=u.current.getOriginalEditor(),f=h(c.current,e||"",t||n||"text",m||"");f!==i.getModel()&&i.setModel(f)}},[m],M),l(()=>{if(u.current&&c.current){let i=u.current.getModifiedEditor(),f=h(c.current,r||"",a||n||"text",E||"");f!==i.getModel()&&i.setModel(f)}},[E],M),l(()=>{let i=u.current.getModifiedEditor();i.getOption(c.current.editor.EditorOption.readOnly)?i.setValue(r||""):r!==i.getValue()&&(i.executeEdits("",[{range:i.getModel().getFullModelRange(),text:r||"",forceMoveMarkers:!0}]),i.pushUndoStop())},[r],M),l(()=>{u.current?.getModel()?.original.setValue(e||"")},[e],M),l(()=>{let{original:i,modified:f}=u.current.getModel();c.current.editor.setModelLanguage(i,t||n||"text"),c.current.editor.setModelLanguage(f,a||n||"text")},[n,t,a],M),l(()=>{c.current?.editor.setTheme(x)},[x],M),l(()=>{u.current?.updateOptions(y)},[y],M);let L=(0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(()=>{if(!c.current)return;o.current(c.current);let i=h(c.current,e||"",t||n||"text",m||""),f=h(c.current,r||"",a||n||"text",E||"");u.current?.setModel({original:i,modified:f})},[n,r,a,e,t,m,E]),U=(0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(()=>{!b.current&&w.current&&(u.current=c.current.editor.createDiffEditor(w.current,{automaticLayout:!0,...y}),L(),c.current?.editor.setTheme(x),O(!0),b.current=!0)},[y,x,L]);(0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{M&&d.current(u.current,c.current)},[M]),(0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{!T&&!M&&U()},[T,M,U]);function I(){let i=u.current?.getModel();g||i?.original?.dispose(),N||i?.modified?.dispose(),u.current?.dispose()}return react__WEBPACK_IMPORTED_MODULE_1__.createElement(H,{width:z,height:V,isEditorReady:M,loading:P,_ref:w,className:F,wrapperProps:j})}var ie=Oe;var we=(0,react__WEBPACK_IMPORTED_MODULE_1__.memo)(ie);function Pe(){let[e,r]=(0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(_monaco_editor_loader__WEBPACK_IMPORTED_MODULE_0__["default"].__getMonacoInstance());return k(()=>{let n;return e||(n=_monaco_editor_loader__WEBPACK_IMPORTED_MODULE_0__["default"].init(),n.then(t=>{r(t)})),()=>n?.cancel()}),e}var Le=Pe;function He(e){let r=(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)();return (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{r.current=e},[e]),r.current}var se=He;var _=new Map;function Ve({defaultValue:e,defaultLanguage:r,defaultPath:n,value:t,language:a,path:m,theme:E="light",line:g,loading:N="Loading...",options:x={},overrideServices:P={},saveViewState:y=!0,keepCurrentModel:V=!1,width:z="100%",height:F="100%",className:j,wrapperProps:A={},beforeMount:q=D,onMount:M=D,onChange:O,onValidate:T=D}){let[s,u]=(0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(!1),[c,w]=(0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(!0),d=(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null),o=(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null),b=(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null),L=(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(M),U=(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(q),I=(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(),i=(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(t),f=se(m),Q=(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(!1),B=(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(!1);k(()=>{let p=_monaco_editor_loader__WEBPACK_IMPORTED_MODULE_0__["default"].init();return p.then(R=>(d.current=R)&&w(!1)).catch(R=>R?.type!=="cancelation"&&console.error("Monaco initialization: error:",R)),()=>o.current?pe():p.cancel()}),l(()=>{let p=h(d.current,e||t||"",r||a||"",m||n||"");p!==o.current?.getModel()&&(y&&_.set(f,o.current?.saveViewState()),o.current?.setModel(p),y&&o.current?.restoreViewState(_.get(m)))},[m],s),l(()=>{o.current?.updateOptions(x)},[x],s),l(()=>{!o.current||t===void 0||(o.current.getOption(d.current.editor.EditorOption.readOnly)?o.current.setValue(t):t!==o.current.getValue()&&(B.current=!0,o.current.executeEdits("",[{range:o.current.getModel().getFullModelRange(),text:t,forceMoveMarkers:!0}]),o.current.pushUndoStop(),B.current=!1))},[t],s),l(()=>{let p=o.current?.getModel();p&&a&&d.current?.editor.setModelLanguage(p,a)},[a],s),l(()=>{g!==void 0&&o.current?.revealLine(g)},[g],s),l(()=>{d.current?.editor.setTheme(E)},[E],s);let X=(0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(()=>{if(!(!b.current||!d.current)&&!Q.current){U.current(d.current);let p=m||n,R=h(d.current,t||e||"",r||a||"",p||"");o.current=d.current?.editor.create(b.current,{model:R,automaticLayout:!0,...x},P),y&&o.current.restoreViewState(_.get(p)),d.current.editor.setTheme(E),g!==void 0&&o.current.revealLine(g),u(!0),Q.current=!0}},[e,r,n,t,a,m,x,P,y,E,g]);(0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{s&&L.current(o.current,d.current)},[s]),(0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{!c&&!s&&X()},[c,s,X]),i.current=t,(0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{s&&O&&(I.current?.dispose(),I.current=o.current?.onDidChangeModelContent(p=>{B.current||O(o.current.getValue(),p)}))},[s,O]),(0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{if(s){let p=d.current.editor.onDidChangeMarkers(R=>{let G=o.current.getModel()?.uri;if(G&&R.find(J=>J.path===G.path)){let J=d.current.editor.getModelMarkers({resource:G});T?.(J)}});return()=>{p?.dispose()}}return()=>{}},[s,T]);function pe(){I.current?.dispose(),V?y&&_.set(m,o.current.saveViewState()):o.current.getModel()?.dispose(),o.current.dispose()}return react__WEBPACK_IMPORTED_MODULE_1__.createElement(H,{width:z,height:F,isEditorReady:s,loading:N,_ref:b,className:j,wrapperProps:A})}var fe=Ve;var de=(0,react__WEBPACK_IMPORTED_MODULE_1__.memo)(fe);var Ft=de;
//# sourceMappingURL=index.mjs.map

/***/ }),

/***/ "./src/image/block.json":
/*!******************************!*\
  !*** ./src/image/block.json ***!
  \******************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"custom-blocks/image","version":"0.1.0","title":"Image","category":"media","keywords":["blocklib","image","media"],"description":"A responsive image.","example":{},"supports":{"html":false,"className":false,"customClassName":false},"attributes":{"anchor":{"type":"string","default":""},"persistentID":{"type":"string","default":""},"pictureID":{"type":"number","default":null},"pictureURL":{"type":"string","default":""},"pictureMime":{"type":"string","default":""},"pictureAlt":{"type":"string","default":""},"pictureSizes":{"type":"object","default":{}},"pictureSrcset":{"type":"string","default":""},"pictureSizesAttribute":{"type":"string","default":""},"pictureLoading":{"type":"string","default":"lazy"},"pictureFetchPriority":{"type":"string","default":"auto"},"manualClasses":{"type":"string","default":""},"blockName":{"type":"string","default":""},"otherAttributes":{"type":"string","default":""},"mediaQueries":{"type":"array","default":[]},"renderedMediaQueries":{"type":"string","default":""}},"textdomain":"custom-blocks","render":"file:./render.php","editorScript":"file:./index.js","editorStyle":"file:./index.css"}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!****************************!*\
  !*** ./src/image/index.js ***!
  \****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./edit */ "./src/image/edit.js");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./save */ "./src/image/save.js");
/* harmony import */ var _index_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./index.css */ "./src/image/index.css");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./block.json */ "./src/image/block.json");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);
/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */


/**
 * Internal dependencies
 */





const blockIcon = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  height: "48px",
  viewBox: "0 -960 960 960",
  width: "48px",
  fill: "#000000",
  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("path", {
    d: "M180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Zm56-97h489L578-473 446-302l-93-127-117 152Zm-56 97v-600 600Z"
  })
});

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_4__.name, {
  icon: blockIcon,
  /**
   * @see ./edit.js
   */
  edit: _edit__WEBPACK_IMPORTED_MODULE_1__["default"],
  /**
   * @see ./save.js
   */
  save: _save__WEBPACK_IMPORTED_MODULE_2__["default"]
});
})();

/******/ })()
;
//# sourceMappingURL=index.js.map
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "build/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__React_js__ = __webpack_require__(1);
//import App from "./Tree.js";
//import save_images from "./upload.js";


//console.log(__webpack_require__.c)
//console.log(__webpack_require__.m);

var list = ['макароны', 'картошка', 'чипсы', 'курица'];
var Item = __WEBPACK_IMPORTED_MODULE_0__React_js__["a" /* Component */]({
    data: {

        colors: ['black', "red", 'green', 'blue', 'cyan', 'magenta', "yellow", 'white'],
        index: 0,
        get style() {
            return {
                backgroundColor: this.colors[this.index],
                color: this.colors[7 - this.index]
                // display : 'inline'
            };
        },
        front() {
            console.log(this);
            this.index++;
            if (this.index >= this.colors.length) this.index = 0;
        }

    },
    render(props) {
		console.log(this);
        return __WEBPACK_IMPORTED_MODULE_0__React_js__["b" /* createElement */](
            'div',
            { onclick: this.front, style: this.style },
            'text = ',
            this.index
        );
    }
});

//console.log(<Model/>)
__WEBPACK_IMPORTED_MODULE_0__React_js__["c" /* render */](__WEBPACK_IMPORTED_MODULE_0__React_js__["b" /* createElement */](
    'div',
    null,
    Array(12).fill(null).map((text, index) => __WEBPACK_IMPORTED_MODULE_0__React_js__["b" /* createElement */](Item, null))
), document.querySelector("#app"));
//console.log(model.render.toString())
//model.show();

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = createElement;
/* harmony export (immutable) */ __webpack_exports__["c"] = render;
/* harmony export (immutable) */ __webpack_exports__["a"] = Component;
//import { moveCursor } from "readline";

function createElement(tag, attrs, ...children) {
	console.log({ tag, attrs, children });
	var e,
	    self = tag instanceof Component;
	//console.log(self);
	if (typeof tag == "function") {
		console.log(attrs);
		e = tag(attrs);
		console.log(e);
	} else if (typeof tag == "object") {
		e = tag.element;
	} else {
		e = document.createElement(tag);

		if (attrs) for (var name in attrs) {

			if (name == 'style') Object.assign(e.style, attrs.style);else e[name] = attrs[name];
		}
	}
	var append = child => {
		if (Array.isArray(child)) child.forEach(append);else if (child instanceof HTMLElement) e.appendChild(child);else if (child instanceof Component) {
			console.log(e);
			e.appendChild(child._mvc.element);
		} else {
			e.textContent += child;
		}
	};
	children.forEach(append);

	return self ? Object.create(tag) : e;
}
function render(component, where) {
	where.innerHTML = "";
	if (component instanceof Component) {
		//component._mvc.parent = where;
		where.appendChild(component._mvc.element);
		console.log(component);
	} else {
		where.appendChild(component);
	}
}

var mvc = (model, render) => {
	model.render = function (props) {
		this.props = props || this.props;
		if (this.mutation && props) this.mutation.call(this.data, props);

		var will = render.call(this.data, this.props);
		console.log(this.element);
		if (this.element) {
			this.element.parentNode.replaceChild(will, this.element);
		}
		this.element = will;
	};
	return model;
};

function Component(options) {

	var { render } = options;
	delete options.render;
	var _mvc = mvc(options, render);

	var getter = function (key) {

		var result = _mvc.data[key];
		//var result;
		if (typeof result == "function") {
			result = function () {
				result.apply(_mvc.data, arguments);
				_mvc.render();
			};
		}
		return function () {
			return result;
		};
	};
	var setter = function (key) {

		return function (value) {
			_mvc.data[key] = value;
			_mvc.render();
		};
	};

	Object.keys(_mvc.data).forEach(function (key) {
		Object.defineProperty(_mvc, key, {
			get: getter(key),
			set: setter(key)
		});
	});
	return _mvc;
}

/***/ })
/******/ ]);
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
/// <reference path="../typings/tsd.d.ts"/>
/// <reference path="./i18n.d.ts"/>
/** Requires */
var merge = require('merge');
/**
 * @class I18n
 */
var I18n = (function () {
    /**
     * @param  {Object} [options]
     * @param  {String} [options.default]   - язык по умолчанию
     *
     * @return {I18n}
     *
     * @constructor I18n
     */
    function I18n(options) {
        this.options = merge({
            default: 'en'
        }, options);
        this.currentLanguage = this.options.default;
        this.languages = {};
    }
    /**
     * Добавление нового файла с переводами
     * @param {String} filename         - путь до файла
     * @param {String} [lang=default]   - имя языка. Если не установлено,
     *                                    использутся язык заданный в конструкторе
     *
     * @return {I18n}
     *
     * @member I18n#add
     */
    I18n.prototype.add = function (translations, lang) {
        if (lang === undefined) {
            lang = this.options.default;
        }
        // Проверка является ли первый аргумент именем файла
        if (Array.isArray(translations)) {
            var data = translations;
            // Если первый аргумент массив
            this.languages[lang] = merge(this.languages[lang], this._transform(data));
        }
        else {
            var data = translations;
            // Если первый аргумент объект
            this.languages[lang] = merge(this.languages[lang], data);
        }
        return this;
    };
    /**
     * Загрузка переводов из JSON файла
     * @param  {string} str
     * @param  {string} [lang] - если установлен, будет считать, что передан
     *                           только один язык.
     *
     * @return {I18n}
     */
    I18n.prototype.addJSON = function (str, lang) {
        var _this = this;
        var translations = JSON.parse(str);
        if (lang) {
            this.add(translations, lang);
        }
        else {
            var keys = Object.keys(translations);
            keys.forEach(function (key) {
                _this.add(translations[key], key);
            });
        }
        return this;
    };
    /**
     * Перевод текста
     * @param  {String} text
     * @param  {String} [lang=default]   - имя языка. Если не установлено,
     *                                    использутся язык заданный в конструкторе
     *
     * @return {String}
     *
     * @member I18n#get
     */
    I18n.prototype.get = function (text, lang) {
        if (lang === undefined) {
            lang = this.currentLanguage;
        }
        // Такого языка нет
        if (this.languages[lang] === undefined) {
            return text;
        }
        var translatedText = this.languages[lang][text];
        if (translatedText !== undefined) {
            return translatedText;
        }
        else {
            return text;
        }
    };
    /**
     * Установка локали
     * @param {String} lang
     *
     * @return {I18n}
     *
     * @member I18n#setLocale
     */
    I18n.prototype.setLocale = function (lang) {
        if (this.languages[lang]) {
            this.currentLanguage = lang;
        }
        else {
            this.resetLocale();
        }
        return this;
    };
    /**
     * Возвращает текущий локаль
     * @return {String}
     *
     * @member I18n#getLocale
     */
    I18n.prototype.getLocale = function () {
        return this.currentLanguage;
    };
    /**
     * Установка локали по умолчанию
     * @return {I18n}
     *
     * @member I18n#resetLocale
     */
    I18n.prototype.resetLocale = function () {
        this.currentLanguage = this.options.default;
        return this;
    };
    /**
     * Создает обертку над объектом, для использования как __
     *
     * @return {Function}
     *
     * @member I18n#toUnderscore
     */
    I18n.prototype.toUnderscore = function (defaultLang) {
        if (defaultLang) {
            throw new Error("Sorry, #toUnderscore with specified default language is deprecated. Please use #setLocale");
        }
        return (function (_this) {
            function __(text, lang) {
                if (lang) {
                    return _this.get.bind(_this)(text, lang);
                }
                else {
                    return _this.get.bind(_this)(text);
                }
            }
            /* @todo заменить на нормальную реализацию */
            __.add = _this.add.bind(_this);
            __.addJSON = _this.addJSON.bind(_this);
            __.get = _this.get.bind(_this);
            __.setLocale = _this.setLocale.bind(_this);
            __.getLocale = _this.getLocale.bind(_this);
            __.resetLocale = _this.resetLocale.bind(_this);
            __.toUnderscore = _this.toUnderscore.bind(_this);
            __.toJSON = _this.toJSON.bind(_this);
            return __;
        })(this);
    };
    /**
     * Преобразует хранящиеся переводы в JSON
     * @param  {string} lang
     *
     * @return {string}
     */
    I18n.prototype.toJSON = function (lang) {
        if (lang) {
            if (this.languages[lang]) {
                return JSON.stringify(this.languages[lang]);
            }
            else {
                return JSON.stringify({});
            }
        }
        else {
            return JSON.stringify(this.languages);
        }
    };
    /**
     * Преобразование массива в таблицу ключ -> значение
     * @param  {Array|Object} data
     *
     * @return {Object}
     *
     * @member I18n#_transform
     * @private
     */
    I18n.prototype._transform = function (data) {
        if (Array.isArray(data)) {
            return data.reduce(function (res, item) {
                res[item.from] = item.to;
                return res;
            }, {});
        }
        else {
            return data;
        }
    };
    return I18n;
})();
module.exports = I18n;

},{"merge":2}],2:[function(require,module,exports){
/*!
 * @name JavaScript/NodeJS Merge v1.2.0
 * @author yeikos
 * @repository https://github.com/yeikos/js.merge

 * Copyright 2014 yeikos - MIT license
 * https://raw.github.com/yeikos/js.merge/master/LICENSE
 */

;(function(isNode) {

	/**
	 * Merge one or more objects 
	 * @param bool? clone
	 * @param mixed,... arguments
	 * @return object
	 */

	var Public = function(clone) {

		return merge(clone === true, false, arguments);

	}, publicName = 'merge';

	/**
	 * Merge two or more objects recursively 
	 * @param bool? clone
	 * @param mixed,... arguments
	 * @return object
	 */

	Public.recursive = function(clone) {

		return merge(clone === true, true, arguments);

	};

	/**
	 * Clone the input removing any reference
	 * @param mixed input
	 * @return mixed
	 */

	Public.clone = function(input) {

		var output = input,
			type = typeOf(input),
			index, size;

		if (type === 'array') {

			output = [];
			size = input.length;

			for (index=0;index<size;++index)

				output[index] = Public.clone(input[index]);

		} else if (type === 'object') {

			output = {};

			for (index in input)

				output[index] = Public.clone(input[index]);

		}

		return output;

	};

	/**
	 * Merge two objects recursively
	 * @param mixed input
	 * @param mixed extend
	 * @return mixed
	 */

	function merge_recursive(base, extend) {

		if (typeOf(base) !== 'object')

			return extend;

		for (var key in extend) {

			if (typeOf(base[key]) === 'object' && typeOf(extend[key]) === 'object') {

				base[key] = merge_recursive(base[key], extend[key]);

			} else {

				base[key] = extend[key];

			}

		}

		return base;

	}

	/**
	 * Merge two or more objects
	 * @param bool clone
	 * @param bool recursive
	 * @param array argv
	 * @return object
	 */

	function merge(clone, recursive, argv) {

		var result = argv[0],
			size = argv.length;

		if (clone || typeOf(result) !== 'object')

			result = {};

		for (var index=0;index<size;++index) {

			var item = argv[index],

				type = typeOf(item);

			if (type !== 'object') continue;

			for (var key in item) {

				var sitem = clone ? Public.clone(item[key]) : item[key];

				if (recursive) {

					result[key] = merge_recursive(result[key], sitem);

				} else {

					result[key] = sitem;

				}

			}

		}

		return result;

	}

	/**
	 * Get type of variable
	 * @param mixed input
	 * @return string
	 *
	 * @see http://jsperf.com/typeofvar
	 */

	function typeOf(input) {

		return ({}).toString.call(input).slice(8, -1).toLowerCase();

	}

	if (isNode) {

		module.exports = Public;

	} else {

		window[publicName] = Public;

	}

})(typeof module === 'object' && module && typeof module.exports === 'object' && module.exports);
},{}]},{},[1])
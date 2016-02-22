'use strict';
/// <reference path="../../typings/tsd.d.ts"/>
/// <reference path="./i18n.d.ts"/>
/** Requires */
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var yaml = require('js-yaml');
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
        this.options = _.merge({
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
    I18n.prototype.add = function (filename, lang) {
        if (lang === undefined) {
            lang = this.options.default;
        }
        // Проверка является ли первый аргумент именем файла
        if (_.isString(filename)) {
            var pathInfo = path.parse(filename);
            var ext = pathInfo.ext.slice(1).toLowerCase();
            var data;
            switch (ext) {
                case 'yml':
                    data = yaml.load(fs.readFileSync(path.resolve(filename)).toString());
                    break;
                case 'json':
                default:
                    data = JSON.parse(fs.readFileSync(path.resolve(filename)).toString());
                    break;
            }
            data = this._transform(data);
            this.languages[lang] = _.merge(this.languages[lang], data);
        }
        else if (_.isArray(filename)) {
            var data = filename;
            // Если первый аргумент массив
            this.languages[lang] = _.merge(this.languages[lang], this._transform(data));
        }
        else if (_.isObject(filename)) {
            var data = filename;
            // Если первый аргумент объект
            this.languages[lang] = _.merge(this.languages[lang], data);
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
        if (_.isArray(data)) {
            return _.reduce(data, function (res, item) {
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

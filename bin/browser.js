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
     * Создает независимую функцию get
     * @param  {string}   [defaultLang]
     *
     * @return {Function}
     *
     * @member I18n#toUnderscore
     */
    I18n.prototype.toUnderscore = function (defaultLang) {
        // Устанавливаем дефолтный язык
        if (!defaultLang) {
            defaultLang = this.options.default;
        }
        return (function (_this, defaultLang) {
            return function __(text, lang) {
                if (lang) {
                    return _this.get.bind(_this)(text, lang);
                }
                else {
                    return _this.get.bind(_this)(text, defaultLang);
                }
            };
        })(this, defaultLang);
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

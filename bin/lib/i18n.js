'use strict';
/// <reference path="../../typings/tds.d.ts"/>
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
     * @constructs I18n
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

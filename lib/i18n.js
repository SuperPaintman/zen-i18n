'use strict';
/** Requires */
const fs            = require('fs');
const path          = require('path');

const _             = require('lodash');
const yaml          = require('js-yaml');

class I18n {
  /**
   * @param  {Object} [options]
   * @param  {String} [options.default]   - язык по умолчанию
   * 
   * @return {I18n}
   */
  constructor(options) {
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
   */
  add(filename, lang) {
    if (lang === undefined) {
      lang = this.options.default;
    }

    // Проверка является ли первый аргумент именем файла
    if (_.isString(filename)) {
      const pathInfo = path.parse(filename);
      const ext = pathInfo.ext.slice(1).toLowerCase();

      let data;
      switch (ext) {
        case 'yml':
          data = yaml.load(fs.readFileSync(
            path.resolve(filename)).toString());
          break;

        case 'json':
        default:
          data = JSON.parse(fs.readFileSync(
            path.resolve(filename)).toString());
          break;
      }

      data = this._transform(data);

      this.languages[lang] = _.merge(this.languages[lang], data);
    } else if (_.isArray(filename)) {
      const data = filename;
      // Если первый аргумент массив
      this.languages[lang] = _.merge(this.languages[lang]
        , this._transform(data));
    } else if (_.isObject(filename)) {
      const data = filename;
      // Если первый аргумент объект
      this.languages[lang] = _.merge(this.languages[lang], data);
    }

    return this;
  }

  /**
   * Перевод текста
   * @param  {String} text
   * @param  {String} [lang=default]   - имя языка. Если не установлено,
   *                                    использутся язык заданный в конструкторе
   *
   * @return {String}
   */
  get(text, lang) {
    if (lang === undefined) {
      lang = this.currentLanguage;
    }

    // Такого языка нет
    if (this.languages[lang] === undefined) {
      return text;
    }

    const translatedText = this.languages[lang][text];
    if (translatedText !== undefined) {
      return translatedText;
    } else {
      return text;
    }
  }

  /**
   * Установка локали
   * @param {String} lang
   *
   * @return {I18n}
   */
  setLocale(lang) {
    if (this.languages[lang]) {
      this.currentLanguage = lang;
    } else {
      this.resetLocale();
    }

    return this;
  }

  /**
   * Возвращает текущий локаль
   * @return {String}
   */
  getLocale() {
    return this.currentLanguage;
  }

  /**
   * Установка локали по умолчанию
   * @return {I18n}
   */
  resetLocale() {
    this.currentLanguage = this.options.default;
    return this;
  }

  /**
   * Преобразование массива в таблицу ключ -> значение
   * @param  {Array|Object} data
   * 
   * @return {Object}
   * 
   * @private
   */
  _transform(data) {
    if (_.isArray(data)) {
      return _.reduce(data, (res, item) => {
        res[item.from] = item.to;
        return res;
      }, {});
    } else {
      return data;
    }
  }
}

module.exports = I18n;

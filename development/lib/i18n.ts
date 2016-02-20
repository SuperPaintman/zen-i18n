'use strict';
/// <reference path="../../typings/tds.d.ts"/>

/** Requires */
import * as fs         from 'fs';
import * as path       from 'path';
import * as _          from 'lodash';
import * as yaml       from 'js-yaml';

interface I18nOptions {
  default: string;
}

interface I18nLangObj {
  [from: string]: string
}

interface I18nArrItem {
  from: string;
  to: string;
}

interface I18nLanguages {
  [lang: string]: I18nLangObj;
}

interface PathParseObj {
  ext: string;
}

/**
 * @class I18n
 */
class I18n {
  private options: I18nOptions;

  private currentLanguage: string;

  private languages: I18nLanguages;

  /**
   * @param  {Object} [options]
   * @param  {String} [options.default]   - язык по умолчанию
   * 
   * @return {I18n}
   * 
   * @constructor I18n
   */
  constructor(options: I18nOptions) {
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
  add(filename: (string|I18nArrItem[]|I18nLangObj), lang?: string): I18n {
    if (lang === undefined) {
      lang = this.options.default;
    }

    // Проверка является ли первый аргумент именем файла
    if (_.isString(filename)) {
      const pathInfo: PathParseObj = path.parse(filename);
      const ext: string = pathInfo.ext.slice(1).toLowerCase();

      let data: any;
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
      const data: I18nArrItem[] = filename;
      // Если первый аргумент массив
      this.languages[lang] = _.merge(this.languages[lang]
        , this._transform(data));
    } else if (_.isObject(filename)) {
      const data: I18nLangObj = filename;
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
   *
   * @member I18n#get
   */
  get(text: string, lang?: string): string {
    if (lang === undefined) {
      lang = this.currentLanguage;
    }

    // Такого языка нет
    if (this.languages[lang] === undefined) {
      return text;
    }

    const translatedText: string = this.languages[lang][text];
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
   *
   * @member I18n#setLocale
   */
  setLocale(lang: string): I18n {
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
   *
   * @member I18n#getLocale
   */
  getLocale(): string {
    return this.currentLanguage;
  }

  /**
   * Установка локали по умолчанию
   * @return {I18n}
   *
   * @member I18n#resetLocale
   */
  resetLocale(): I18n {
    this.currentLanguage = this.options.default;
    return this;
  }

  /**
   * Создает независимую функцию get
   * @param  {string}   [defaultLang]
   * 
   * @return {Function}
   *
   * @member I18n#toUnderscore
   */
  toUnderscore(defaultLang?: string): Function {
    // Устанавливаем дефолтный язык
    if (!defaultLang) {
      defaultLang = this.options.default;
    }

    return (function (_this, defaultLang) {
      return function __(text: string, lang?: string): string {
        if (lang) {
          return _this.get.bind(_this)(text, lang);
        } else {
          return _this.get.bind(_this)(text, defaultLang);
        }
      };
    })(this, defaultLang);
  }

  /**
   * Преобразует хранящиеся переводы в JSON
   * @param  {string} lang
   * 
   * @return {string}
   */
  toJSON(lang?: string): string {
    if (lang) {
      if (this.languages[lang]) {
        return JSON.stringify(this.languages[lang]);
      } else {
        return JSON.stringify({});
      }
    } else {
      return JSON.stringify(this.languages);
    }
  }

  /**
   * Преобразование массива в таблицу ключ -> значение
   * @param  {Array|Object} data
   * 
   * @return {Object}
   *
   * @member I18n#_transform
   * @private
   */
  private _transform(data: (I18nArrItem[]|I18nLangObj)): I18nLangObj {
    if (_.isArray(data)) {
      return _.reduce(data, (res, item: I18nArrItem) => {
        res[item.from] = item.to;
        return res;
      }, {});
    } else {
      return data;
    }
  }
}

module.exports = I18n;

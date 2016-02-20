'use strict';
/// <reference path="../typings/tsd.d.ts"/>
/// <reference path="./i18n.d.ts"/>

/** Requires */
import * as merge         from 'merge';

interface I18nOptions {
  default: string;
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
  constructor(options?: I18nOptions) {
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
  add(translations: (I18nArrItem[]|I18nLangObj), lang?: string): I18n {
    if (lang === undefined) {
      lang = this.options.default;
    }

    // Проверка является ли первый аргумент именем файла
    if (Array.isArray(translations)) {
      const data: I18nArrItem[] = translations;
      // Если первый аргумент массив
      this.languages[lang] = merge(this.languages[lang]
        , this._transform(data));
    } else {
      const data: I18nLangObj = translations;
      // Если первый аргумент объект
      this.languages[lang] = merge(this.languages[lang], data);
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
    if (Array.isArray(data)) {
      return data.reduce((res, item: I18nArrItem) => {
        res[item.from] = item.to;
        return res;
      }, {});
    } else {
      return data;
    }
  }
}

module.exports = I18n;

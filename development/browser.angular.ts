'use strict';
/// <reference path="../typings/tsd.d.ts"/>
/// <reference path="./i18n.d.ts"/>

/** Requires */
import * as angular from 'angular';
const I18n = require('./browser');

const MODULE_NAME       = 'ZenI18n';
module.exports          = MODULE_NAME;

angular.module(MODULE_NAME, [])
.provider('zenI18n', i18n);

i18n.$inject = [];
function i18n() {
  const i18n = new I18n();

  return {
    add: (translations: (I18nArrItem[]|I18nLangObj), lang?: string) => {
      return i18n.add(translations, lang);
    },

    addJSON: (str: string, lang?: string) => {
      return i18n.addJSON(str, lang);
    },

    setLocale: (lang: string) => {
      return i18n.setLocale(lang);
    },

    getLocale: () => {
      return i18n.getLocale();
    },

    resetLocale: () => {
      return i18n.resetLocale();
    },

    toUnderscore: (defaultLang?: string): Function => {
      return i18n.toUnderscore(defaultLang);
    },

    toJSON: (lang?: string): string => {
      return i18n.toJSON(lang);
    },

    get: (text: string, lang?: string): string => {
      return i18n.get(text, lang);
    },

    $get: [
      () => {
        return function __(text: string, lang?: string): string {
          return i18n.get(text, lang);
        }
      }
    ]
  };
}

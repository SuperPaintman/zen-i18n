'use strict';
/// <reference path="../typings/tsd.d.ts"/>
/// <reference path="./i18n.d.ts"/>
/** Requires */
var angular = require('angular');
var I18n = require('./browser');
var MODULE_NAME = 'ZenI18n';
module.exports = MODULE_NAME;
angular.module(MODULE_NAME, [])
    .provider('zenI18n', i18n);
i18n.$inject = [];
function i18n() {
    var i18n = new I18n();
    return {
        add: function (translations, lang) {
            return i18n.add(translations, lang);
        },
        addJSON: function (str, lang) {
            return i18n.addJSON(str, lang);
        },
        setLocale: function (lang) {
            return i18n.setLocale(lang);
        },
        getLocale: function () {
            return i18n.getLocale();
        },
        resetLocale: function () {
            return i18n.resetLocale();
        },
        toUnderscore: function (defaultLang) {
            return i18n.toUnderscore(defaultLang);
        },
        toJSON: function (lang) {
            return i18n.toJSON(lang);
        },
        get: function (text, lang) {
            return i18n.get(text, lang);
        },
        $get: function (text, lang) {
            return i18n.get(text, lang);
        }
    };
}

'use strict';
/* global it, describe */
/** Requires */
const path      = require('path');

const assert    = require('assert');

const I18n      = require('../bin/lib/i18n');

describe("I18n lib", () => {
  /** Add */
  describe("#add(filename|obj|arr, lang?)", () => {
    /** Object */
    it("should add words from object", function () {
      const i18n = new I18n({
        default: 'en'
      });

      i18n
        .add({
          "hello": "привет",
          "your name": "ваше имя"
        }, 'ru')
        .add({"bye": "пока"}, 'ru')
        .add({"bye": "tschüss"}, 'de');

      assert.deepEqual(i18n.languages, {
        ru: {
          "hello": "привет",
          "your name": "ваше имя",
          "bye": "пока"
        },
        de: {
          "bye": "tschüss"
        }
      });
    });

    /** Array */
    it("should add words from array", function () {
      const i18n = new I18n({
        default: 'en'
      });

      i18n
        .add([{
          from: "hello",
          to: "привет"
        }, {
          from: "your name",
          to: "ваше имя"
        }], 'ru')
        .add([{
          from: "bye",
          to: "пока"
        }], 'ru')
        .add([{
          from: "bye",
          to: "tschüss"
        }], 'de');

      assert.deepEqual(i18n.languages, {
        ru: {
          "hello": "привет",
          "your name": "ваше имя",
          "bye": "пока"
        },
        de: {
          "bye": "tschüss"
        }
      });
    });

    /** Object YAML file */
    it("should add words from object YAML file", function () {
      const i18n = new I18n({
        default: 'en'
      });

      i18n
        .add(path.join(__dirname, "./asset/ru_1.object.yml"), 'ru')
        .add(path.join(__dirname, "./asset/ru_2.object.yml"), 'ru')
        .add(path.join(__dirname, "./asset/de_1.object.yml"), 'de');

      assert.deepEqual(i18n.languages, {
        ru: {
          "hello": "привет",
          "your name": "ваше имя",
          "bye": "пока"
        },
        de: {
          "bye": "tschüss"
        }
      });
    });

    /** Array YAML file */
    it("should add words from array YAML file", function () {
      const i18n = new I18n({
        default: 'en'
      });

      i18n
        .add(path.join(__dirname, "./asset/ru_1.array.yml"), 'ru')
        .add(path.join(__dirname, "./asset/ru_2.array.yml"), 'ru')
        .add(path.join(__dirname, "./asset/de_1.array.yml"), 'de');

      assert.deepEqual(i18n.languages, {
        ru: {
          "hello": "привет",
          "your name": "ваше имя",
          "bye": "пока"
        },
        de: {
          "bye": "tschüss"
        }
      });
    });

    /** Object JSON file */
    it("should add words from object JSON file", function () {
      const i18n = new I18n({
        default: 'en'
      });

      i18n
        .add(path.join(__dirname, "./asset/ru_1.object.json"), 'ru')
        .add(path.join(__dirname, "./asset/ru_2.object.json"), 'ru')
        .add(path.join(__dirname, "./asset/de_1.object.json"), 'de');

      assert.deepEqual(i18n.languages, {
        ru: {
          "hello": "привет",
          "your name": "ваше имя",
          "bye": "пока"
        },
        de: {
          "bye": "tschüss"
        }
      });
    });

    /** Array JSON file */
    it("should add words from array JSON file", function () {
      const i18n = new I18n({
        default: 'en'
      });

      i18n
        .add(path.join(__dirname, "./asset/ru_1.array.json"), 'ru')
        .add(path.join(__dirname, "./asset/ru_2.array.json"), 'ru')
        .add(path.join(__dirname, "./asset/de_1.array.json"), 'de');

      assert.deepEqual(i18n.languages, {
        ru: {
          "hello": "привет",
          "your name": "ваше имя",
          "bye": "пока"
        },
        de: {
          "bye": "tschüss"
        }
      });
    });

    /** Mixed */
    it("should add words from mixed", function () {
      const i18n = new I18n({
        default: 'en'
      });

      i18n
        .add(path.join(__dirname, "./asset/ru_1.array.json"), 'ru')
        .add(path.join(__dirname, "./asset/ru_2.object.yml"), 'ru')
        .add({"bye": "tschüss"}, 'de');

      assert.deepEqual(i18n.languages, {
        ru: {
          "hello": "привет",
          "your name": "ваше имя",
          "bye": "пока"
        },
        de: {
          "bye": "tschüss"
        }
      });
    });
  });

  /** Get */
  describe("#get(text, lang?)", () => {
    it("should return valid translation", function () {
      const i18n = new I18n({
        default: 'en'
      });

      i18n
        .add({
          "hello": "привет",
          "your name": "ваше имя"
        }, 'ru')
        .add({"bye": "пока"}, 'ru')
        .add({"bye": "tschüss"}, 'de');

      /* en */
      assert.equal(i18n.get("hello"), "hello");
      assert.equal(i18n.get("bye"), "bye");
      assert.equal(i18n.get("your name"), "your name");

      assert.equal(i18n.get("hello", 'en'), "hello");
      assert.equal(i18n.get("bye", 'en'), "bye");
      assert.equal(i18n.get("your name", 'en'), "your name");

      /* de */
      assert.equal(i18n.get("bye", 'de'), "tschüss");
      // such word is undefined
      assert.equal(i18n.get("hello", 'de'), "hello");
      assert.equal(i18n.get("your name", 'de'), "your name");

      /* ru */
      assert.equal(i18n.get("hello", 'ru'), "привет");
      assert.equal(i18n.get("bye", 'ru'), "пока");
      assert.equal(i18n.get("your name", 'ru'), "ваше имя");
    });

    it("should return valid translation with other default lang", function () {
      const i18n = new I18n({
        default: 'ru'
      });

      i18n
        .add({
          "hello": "привет",
          "your name": "ваше имя"
        }, 'ru')
        .add({"bye": "пока"}, 'ru')
        .add({"bye": "tschüss"}, 'de');

      /* en */
      assert.equal(i18n.get("hello", 'en'), "hello");
      assert.equal(i18n.get("bye", 'en'), "bye");
      assert.equal(i18n.get("your name", 'en'), "your name");

      /* de */
      assert.equal(i18n.get("bye", 'de'), "tschüss");
      // such word is undefined
      assert.equal(i18n.get("hello", 'de'), "hello");
      assert.equal(i18n.get("your name", 'de'), "your name");

      /* ru */
      assert.equal(i18n.get("hello"), "привет");
      assert.equal(i18n.get("bye"), "пока");
      assert.equal(i18n.get("your name"), "ваше имя");

      assert.equal(i18n.get("hello", 'ru'), "привет");
      assert.equal(i18n.get("bye", 'ru'), "пока");
      assert.equal(i18n.get("your name", 'ru'), "ваше имя");
    });
  });

  /* setLocale */
  describe("#setLocale(lang)", () => {
    it("should return valid translation", function () {
      const i18n = new I18n({
        default: 'en'
      });

      i18n
        .add({
          "hello": "привет",
          "your name": "ваше имя"
        }, 'ru')
        .add({"bye": "пока"}, 'ru')
        .add({"bye": "tschüss"}, 'de');

      /* en */
      i18n.setLocale('en');
      assert.equal(i18n.get("hello"), "hello");
      assert.equal(i18n.get("bye"), "bye");
      assert.equal(i18n.get("your name"), "your name");

      /* de */
      i18n.setLocale('de');
      assert.equal(i18n.get("bye"), "tschüss");
      // such word is undefined
      assert.equal(i18n.get("hello"), "hello");
      assert.equal(i18n.get("your name"), "your name");

      /* fi */
      i18n.setLocale('fi');
      // such language is undefined
      assert.equal(i18n.get("hello"), "hello");
      assert.equal(i18n.get("bye"), "bye");
      assert.equal(i18n.get("your name"), "your name");

      /* ru */
      i18n.setLocale('ru');
      assert.equal(i18n.get("hello"), "привет");
      assert.equal(i18n.get("bye"), "пока");
      assert.equal(i18n.get("your name"), "ваше имя");
    });
  });

  /* getLocale */
  describe("#getLocale()", () => {
    it("should return valid result", function () {
      const i18n = new I18n({
        default: 'en'
      });

      i18n
        .add({
          "hello": "привет",
          "your name": "ваше имя"
        }, 'ru')
        .add({"bye": "пока"}, 'ru')
        .add({"bye": "tschüss"}, 'de');

      assert.equal(i18n.getLocale(), "en");

      /* en */
      i18n.setLocale('en');
      assert.equal(i18n.getLocale(), "en");

      /* de */
      i18n.setLocale('de');
      assert.equal(i18n.getLocale(), "de");

      /* fi */
      i18n.setLocale('fi');
      assert.equal(i18n.getLocale(), "en");

      /* ru */
      i18n.setLocale('ru');
      assert.equal(i18n.getLocale(), "ru");

      /* reset */
      i18n.setLocale('ru');
      i18n.resetLocale();
      assert.equal(i18n.getLocale(), "en");
    });
  });

  /* resetLocale */
  describe("#resetLocale()", () => {
    it("should return valid translation", function () {
      const i18n = new I18n({
        default: 'en'
      });

      i18n
        .add({
          "hello": "привет",
          "your name": "ваше имя"
        }, 'ru')
        .add({"bye": "пока"}, 'ru')
        .add({"bye": "tschüss"}, 'de');

      /* en */
      i18n.setLocale('en');
      i18n.resetLocale();
      assert.equal(i18n.get("hello"), "hello");
      assert.equal(i18n.get("bye"), "bye");
      assert.equal(i18n.get("your name"), "your name");

      /* de */
      i18n.setLocale('de');
      i18n.resetLocale();
      assert.equal(i18n.get("hello"), "hello");
      assert.equal(i18n.get("bye"), "bye");
      assert.equal(i18n.get("your name"), "your name");

      /* ru */
      i18n.setLocale('ru');
      i18n.resetLocale();
      assert.equal(i18n.get("hello"), "hello");
      assert.equal(i18n.get("bye"), "bye");
      assert.equal(i18n.get("your name"), "your name");
    });
  });

  /* toUnderscore */
  describe("#toUnderscore()", () => {
    it("should return valid translation", function () {
      const i18n = new I18n({
        default: 'en'
      });

      i18n
        .add({
          "hello": "привет",
          "your name": "ваше имя"
        }, 'ru')
        .add({"bye": "пока"}, 'ru')
        .add({"bye": "tschüss"}, 'de');

      const __ = i18n.toUnderscore();

      // Equivalent to the original function
      /* en */
      assert.equal(__("hello"), i18n.get("hello"));
      assert.equal(__("bye"), i18n.get("bye"));
      assert.equal(__("your name"), i18n.get("your name"));

      assert.equal(__("hello", 'en'), i18n.get("hello", 'en'));
      assert.equal(__("bye", 'en'), i18n.get("bye", 'en'));
      assert.equal(__("your name", 'en'), i18n.get("your name", 'en'));

      /* de */
      assert.equal(__("bye", 'de'), i18n.get("bye", 'de'));
      // such word is undefined
      assert.equal(__("hello", 'de'), i18n.get("hello", 'de'));
      assert.equal(__("your name", 'de'), i18n.get("your name", 'de'));

      /* ru */
      assert.equal(__("hello", 'ru'), i18n.get("hello", 'ru'));
      assert.equal(__("bye", 'ru'), i18n.get("bye", 'ru'));
      assert.equal(__("your name", 'ru'), i18n.get("your name", 'ru'));

      // Equivalent to the valid translation
      /* en */
      assert.equal(__("hello"), "hello");
      assert.equal(__("bye"), "bye");
      assert.equal(__("your name"), "your name");

      assert.equal(__("hello", 'en'), "hello");
      assert.equal(__("bye", 'en'), "bye");
      assert.equal(__("your name", 'en'), "your name");

      /* de */
      assert.equal(__("bye", 'de'), "tschüss");
      // such word is undefined
      assert.equal(__("hello", 'de'), "hello");
      assert.equal(__("your name", 'de'), "your name");

      /* ru */
      assert.equal(__("hello", 'ru'), "привет");
      assert.equal(__("bye", 'ru'), "пока");
      assert.equal(__("your name", 'ru'), "ваше имя");
    });
  });
});

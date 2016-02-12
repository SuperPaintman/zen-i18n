'use strict';
/* global it, describe */
/** Requires */
const path      = require('path');

const assert    = require('assert');

const I18n      = require('../lib/i18n');

describe("I18n lib", () => {
  /** Add */
  describe("#add(filename|obj, lang?)", () => {
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
  });
});

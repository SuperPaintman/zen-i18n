# zen-i18n

[![Linux Build][travis-image]][travis-url]
[![Windows Build][appveyor-image]][appveyor-url]
[![NPM version][npm-v-image]][npm-url]
[![NPM Downloads][npm-dm-image]][npm-url]
[![Test Coverage][coveralls-image]][coveralls-url]

[![Logo](/README/logo.png)][npm-url]

Flexible [**i18n**][wikipedia-link] internationalization for **node.js**


## Installation
```sh
npm install zen-i18n --save
```

--------------------------------------------------------------------------------

## Usage
```js
'use strict';
const I18n = require('zen-i18n');

const i18n = new I18n();

i18n
  .add(`${__dirname}/locals/ru.yml`, 'ru')
  .add(`${__dirname}/locals/de.json`, 'de')
  .add({
    "hello": 'hei'
  }, 'fi')
  .add([{
    from: `very long,
           multiline text....`,
    to:   `очень длинный,
           многострочный текст....`,
  }], 'ru');

const __ = i18n.toUnderscore(); // or use like: i18n.get("hello")

console.log(__('hello', 'fi')); // -> hei
// or
i18n.setLocale('fi');
console.log(__('hello')); // -> hei

i18n.resetLocale();
console.log(__('hello')); // -> hello
```

### File examples
The file content type and its extension detected automatically.

**Array-like**:

```yaml
# ru.yml
- form: hello
  to: привет
```

```json
// ru.json
[{
  "form": "hello",
  "to": "привет"
}]
```

**Object-like**:

```yaml
# ru.yml
hello: привет
```

```json
// ru.json
{
  "hello": "привет"
}
```

--------------------------------------------------------------------------------

## API

--------------------------------------------------------------------------------

## Changelog
### 0.2.0 [`Stable`]
* **Added**: `#toUnderscore()` returns independent function `#get()`

### 0.1.0 [`Stable`]
* **Added**: first release

--------------------------------------------------------------------------------

## License
Copyright (c)  2016 [Alexander Krivoshhekov][github-author-link]

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[github-author-link]: http://github.com/SuperPaintman
[wikipedia-link]: https://en.wikipedia.org/wiki/Internationalization_and_localization
[npm-url]: https://www.npmjs.com/package/zen-i18n
[npm-v-image]: https://img.shields.io/npm/v/zen-i18n.svg
[npm-dm-image]: https://img.shields.io/npm/dm/zen-i18n.svg
[travis-image]: https://img.shields.io/travis/SuperPaintman/zen-i18n/master.svg?label=linux
[travis-url]: https://travis-ci.org/SuperPaintman/zen-i18n
[appveyor-image]: https://img.shields.io/appveyor/ci/SuperPaintman/zen-i18n/master.svg?label=windows
[appveyor-url]: https://ci.appveyor.com/project/SuperPaintman/zen-i18n
[coveralls-image]: https://img.shields.io/coveralls/SuperPaintman/zen-i18n/master.svg
[coveralls-url]: https://coveralls.io/r/SuperPaintman/zen-i18n?branch=master

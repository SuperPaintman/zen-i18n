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

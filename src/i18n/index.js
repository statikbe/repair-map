import messages from './messages';

const detectedLocale = document.documentElement.lang;
const defaultLocale = messages[detectedLocale] ? detectedLocale : 'en';

export default {
  locale: defaultLocale,

  setLocale(locale) {
    if (messages[locale]) {
      this.locale = locale;
    } else {
      console.error(`No translations found for locale: "${locale}"`);
    }
  },

  t(key, params = {}) {
    let translation = messages[this.locale][key];

    Object.keys(params).forEach((param) => {
      translation = translation.split(`:${param}`).join(params[param]);
    });

    return translation;
  },

  localizeField(field) {
    return field[this.locale] || field.default || field.nl;
  },
};

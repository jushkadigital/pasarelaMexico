import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';
import HttpBackend from 'i18next-http-backend';

import { getOptions, LocaleType } from './settings';

// Initialize the i18n instance
const initI18next = async (lang: LocaleType, ns: string) => {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(HttpBackend)
    .use(initReactI18next)
    .init(getOptions(lang, ns));

  return i18nInstance;
};

// It will accept the locale and namespace for i18next to know what file to load
export async function createTranslation(lang: LocaleType, ns: string) {
  console.log("GAAA")
  const i18nextInstance = await initI18next(lang, ns);
  console.log("GEEE")
  console.log(lang+ns)
  return {
    // This is the translation function we'll use in our components
    // e.g. t('greeting')
    t: i18nextInstance.getFixedT(lang, Array.isArray(ns) ? ns[0] : ns),
  };
}

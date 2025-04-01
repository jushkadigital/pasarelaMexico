export const defaultLanguage = 'es';
export const availableLocales = [defaultLanguage, 'en'];
export const defaultNS = 'inicio';
export type LocaleType = (typeof availableLocales)[number];
export const cookieName = 'language';

export function getOptions(lng = defaultLanguage, ns = defaultNS) {
  return {
    // debug: true,
    supportedLngs: availableLocales,
    preload: availableLocales,
    backend: {
    loadPath: 'https://paymentserver.pdsviajes.com/api/v2/snippets/dataGeneral/?fields=*',
    parse: (data)=>{
        const parseData = JSON.parse(data)
        return parseData
      },
      requestOptions: {
        cache: 'no-store', // Desactiva la caché del fetch
      }
    },
         defaultLanguage,
    react: {
      useSuspense:false,
    },
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  };
}
export function getOptionsCli(lng = defaultLanguage, ns = defaultNS) {
  return {
// debug: true,
    supportedLngs: availableLocales,
    // preload: availableLocales,
    defaultLanguage,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  };
}

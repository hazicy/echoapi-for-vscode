import { initReactI18next } from 'react-i18next';

import i18n from 'i18next';
import { language } from './language';

import en from './en_US.json';
import cn from './zh_CN.json';

const resources = {
  'zh-cn': {
    translation: cn,
  },
  en: {
    translation: en,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    initImmediate: false,
    lowerCaseLng: true,
    fallbackLng: 'en',
    lng: language,
    interpolation: {
      escapeValue: false, // Prevent escaping
    },
  });

export const initI18n =async ()=>{
  await i18n
  .use(initReactI18next)
  .init({
    resources,
    initImmediate: false,
    lowerCaseLng: true,
    fallbackLng: 'en',
    lng: language,
    interpolation: {
      escapeValue: false, // Prevent escaping
    },
  });
};

export default i18n;

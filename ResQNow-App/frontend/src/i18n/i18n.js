// src/i18n/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en';
import tl from './locales/tl';
import ilo from './locales/ilo';
import ibg from './locales/ibg';

// ============ SUPPORTED LANGUAGES ============
// Languages available in Resident Settings
const supportedLanguages = [
  {
    code: 'en',
    labelKey: 'settings.languages.en',
  },
  {
    code: 'tl',
    labelKey: 'settings.languages.tl',
  },
  {
    code: 'ilo',
    labelKey: 'settings.languages.ilo',
  },
  {
    code: 'ibg',
    labelKey: 'settings.languages.ibg',
  },
];

const supportedCodes = supportedLanguages.map(
  (language) => language.code
);

// ============ SAVED LANGUAGE ============
// Use the resident's last selected language
let savedLanguage =
  localStorage.getItem('resqnow_language') || 'en';

if (!supportedCodes.includes(savedLanguage)) {
  savedLanguage = 'en';
}

// ============ I18N SETUP ============
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en,
      },

      tl: {
        translation: tl,
      },

      ilo: {
        translation: ilo,
      },

      ibg: {
        translation: ibg,
      },
    },

    lng: savedLanguage,
    fallbackLng: 'en',
    supportedLngs: supportedCodes,

    interpolation: {
      escapeValue: false,
    },

    returnNull: false,
    returnEmptyString: false,

    debug: import.meta.env.DEV,
  });

// ============ LANGUAGE SYNC ============
// Save the selected language whenever it changes
function syncLanguage(language) {
  const languageCode =
    language?.split('-')[0] || 'en';

  if (!supportedCodes.includes(languageCode)) {
    return;
  }

  localStorage.setItem(
    'resqnow_language',
    languageCode
  );

  document.documentElement.lang =
    languageCode;
}

// Sync when the app first opens
syncLanguage(
  i18n.resolvedLanguage ||
  i18n.language ||
  savedLanguage
);

// Sync whenever language changes
i18n.on(
  'languageChanged',
  syncLanguage
);

export {
  supportedLanguages,
};

export default i18n;
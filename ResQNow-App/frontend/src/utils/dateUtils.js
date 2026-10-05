// src/utils/dateUtils.js

// ============ DATE LOCALES ============
// Locale used for displaying dates
const dateLocales = {
  en: 'en-PH',
  tl: 'fil-PH',
  ilo: 'ilo-PH',

  // Safe fallback because browser support
  // for Ibanag Intl formatting is limited
  ibg: 'en-PH',
};

// ============ DATE FORMATTER ============
// Format date using the selected language
function formatDate(
  dateString,
  language = 'en'
) {
  if (!dateString) return '';

  const date =
    new Date(dateString);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return dateString;
  }

  const languageCode =
    language?.split('-')[0] || 'en';

  const locale =
    dateLocales[languageCode] ||
    dateLocales.en;

  try {
    return date.toLocaleString(
      locale,
      {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }
    );
  } catch {
    return date.toLocaleString(
      dateLocales.en,
      {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }
    );
  }
}

export {
  formatDate,
};
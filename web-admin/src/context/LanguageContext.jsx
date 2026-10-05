import { useMemo } from "react";

import LanguageContext from "./LanguageContextValue";
import translations from "./translations";

export function LanguageProvider({
  language = "English",
  children,
}) {
  const value = useMemo(() => {
    const currentLanguage = translations[language]
      ? language
      : "English";

    return {
      language: currentLanguage,
      t: (key) => translations[currentLanguage][key] || key,
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export default LanguageProvider;
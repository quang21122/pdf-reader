"use client";

import { useState } from "react";

export interface Language {
  code: string;
  name: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: "eng", name: "English" },
  { code: "vie", name: "Vietnamese" },
  { code: "fra", name: "French" },
  { code: "deu", name: "German" },
  { code: "spa", name: "Spanish" },
  { code: "chi_sim", name: "Chinese (Simplified)" },
  { code: "jpn", name: "Japanese" },
  { code: "kor", name: "Korean" },
];

/**
 * Custom hook for managing language selection in OCR processing
 */
export function useLanguageSelection(defaultLanguage: string = "eng") {
  const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguage);

  const handleLanguageChange = (languageCode: string) => {
    if (SUPPORTED_LANGUAGES.some((lang) => lang.code === languageCode)) {
      setSelectedLanguage(languageCode);
    } else {
      console.warn(`Unsupported language code: ${languageCode}`);
    }
  };

  const getLanguageName = (languageCode: string): string => {
    const language = SUPPORTED_LANGUAGES.find(
      (lang) => lang.code === languageCode
    );
    return language?.name || languageCode;
  };

  const getCurrentLanguage = (): Language | undefined => {
    return SUPPORTED_LANGUAGES.find((lang) => lang.code === selectedLanguage);
  };

  const resetToDefault = () => {
    setSelectedLanguage(defaultLanguage);
  };

  return {
    selectedLanguage,
    setSelectedLanguage: handleLanguageChange,
    supportedLanguages: SUPPORTED_LANGUAGES,
    getLanguageName,
    getCurrentLanguage,
    resetToDefault,
  };
}

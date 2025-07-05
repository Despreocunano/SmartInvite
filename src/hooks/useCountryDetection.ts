import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { detectCountryFromURL, detectLanguageFromCountry, getCountryAndLanguage, CountryInfo } from '../lib/countryDetection';

/**
 * Custom hook for country and language detection
 * Automatically updates i18n language based on detected country
 */
export function useCountryDetection() {
  const { i18n } = useTranslation();
  const [countryInfo, setCountryInfo] = useState<CountryInfo>({
    country: '',
    language: 'es',
    detected: false
  });

  useEffect(() => {
    const info = getCountryAndLanguage();
    setCountryInfo(info);
    
    // Update i18n language if different from current
    if (i18n.language.substring(0, 2) !== info.language) {
      i18n.changeLanguage(info.language);
    }
  }, [i18n]);

  const refreshDetection = () => {
    const info = getCountryAndLanguage();
    setCountryInfo(info);
    i18n.changeLanguage(info.language);
    return info;
  };

  return {
    country: countryInfo.country,
    language: countryInfo.language,
    detected: countryInfo.detected,
    refreshDetection
  };
}

/**
 * Hook for getting current country without automatic language updates
 */
export function useCurrentCountry() {
  const [country, setCountry] = useState('');

  useEffect(() => {
    setCountry(detectCountryFromURL());
  }, []);

  return country;
} 
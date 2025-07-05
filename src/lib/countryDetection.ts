/**
 * Utility functions for detecting country and language based on domain and URL patterns
 */

export interface CountryInfo {
  country: string;
  language: string;
  detected: boolean;
}

/**
 * Detects country from URL patterns, considering the main domain smartinvite.me
 * even when running on the app subdomain app.smartinvite.me
 */
export function detectCountryFromURL(): string {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;
  
  console.log('Detecting country from URL:', { hostname, pathname });
  
  // If we're on the app subdomain, we need to check the main domain
  if (hostname === 'app.smartinvite.me') {
    // Try to get the referrer or check if we can access the main domain
    const referrer = document.referrer;
    console.log('App subdomain detected, referrer:', referrer);
    
    // Check if referrer is from main domain
    if (referrer.includes('smartinvite.me') && !referrer.includes('app.smartinvite.me')) {
      const referrerUrl = new URL(referrer);
      const referrerPath = referrerUrl.pathname;
      
      if (referrerPath.startsWith('/mx')) {
        console.log('Detected MX from referrer pathname');
        return 'MX';
      }
      if (referrerPath.startsWith('/pa')) {
        console.log('Detected PA from referrer pathname');
        return 'PA';
      }
      if (referrerPath.startsWith('/us')) {
        console.log('Detected US from referrer pathname');
        return 'US';
      }
      if (referrerPath === '/') {
        console.log('Detected US from referrer root domain');
        return 'US';
      }
    }
    
    // If no referrer or referrer is not from main domain, try to detect from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const countryParam = urlParams.get('country');
    if (countryParam) {
      console.log('Detected country from URL parameter:', countryParam);
      return countryParam.toUpperCase();
    }
    
    // Check if there's a path segment that might indicate country
    const pathSegments = pathname.split('/').filter(segment => segment);
    if (pathSegments.length > 0) {
      const firstSegment = pathSegments[0].toLowerCase();
      if (['mx', 'pa', 'us'].includes(firstSegment)) {
        console.log('Detected country from path segment:', firstSegment);
        return firstSegment.toUpperCase();
      }
    }
  }
  
  // For direct access to main domain
  if (hostname === 'smartinvite.me') {
    if (pathname.startsWith('/mx')) {
      console.log('Detected MX from main domain pathname');
      return 'MX';
    }
    if (pathname.startsWith('/pa')) {
      console.log('Detected PA from main domain pathname');
      return 'PA';
    }
    if (pathname.startsWith('/us')) {
      console.log('Detected US from main domain pathname');
      return 'US';
    }
    if (pathname === '/') {
      console.log('Detected US from main domain root');
      return 'US';
    }
  }
  
  console.log('No country detected, defaulting to empty');
  return '';
}

/**
 * Detects language based on country or browser preferences
 */
export function detectLanguageFromCountry(country: string): string {
  if (country === 'US') {
    return 'en';
  } else if (country === 'MX' || country === 'PA') {
    return 'es';
  } else {
    // If no country detected, try to detect from browser language
    const browserLang = navigator.language || navigator.languages?.[0] || 'es';
    const shortLang = browserLang.substring(0, 2);
    
    if (shortLang === 'en') {
      return 'en';
    } else {
      return 'es'; // Default to Spanish
    }
  }
}

/**
 * Gets complete country and language information
 */
export function getCountryAndLanguage(): CountryInfo {
  const country = detectCountryFromURL();
  const language = detectLanguageFromCountry(country);
  
  return {
    country,
    language,
    detected: country !== ''
  };
}

/**
 * Updates i18n language based on detected country
 */
export function updateLanguageFromCountry(i18n: any, country: string): void {
  const language = detectLanguageFromCountry(country);
  i18n.changeLanguage(language);
  console.log(`Language updated to ${language} based on country ${country}`);
} 
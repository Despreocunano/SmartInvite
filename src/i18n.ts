import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import dashboard_en from './locales/en-US/dashboard.json';
import dashboard_pa from './locales/es-PA/dashboard.json';
import dashboard_mx from './locales/es-MX/dashboard.json';
import landingHero_en from './locales/en-US/landing-hero.json';
import landingHero_pa from './locales/es-PA/landing-hero.json';
import landingHero_mx from './locales/es-MX/landing-hero.json';
import landingEvents_en from './locales/en-US/landing-events.json';
import landingEvents_pa from './locales/es-PA/landing-events.json';
import landingEvents_mx from './locales/es-MX/landing-events.json';
import landingWelcome_en from './locales/en-US/landing-welcome.json';
import landingWelcome_pa from './locales/es-PA/landing-welcome.json';
import landingWelcome_mx from './locales/es-MX/landing-welcome.json';

const resources = {
  'en-US': {
    dashboard: dashboard_en,
    'landing-hero': landingHero_en,
    'landing-events': landingEvents_en,
    'landing-welcome': landingWelcome_en,
  },
  'es-PA': {
    dashboard: dashboard_pa,
    'landing-hero': landingHero_pa,
    'landing-events': landingEvents_pa,
    'landing-welcome': landingWelcome_pa,
  },
  'es-MX': {
    dashboard: dashboard_mx,
    'landing-hero': landingHero_mx,
    'landing-events': landingEvents_mx,
    'landing-welcome': landingWelcome_mx,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en-US', // default
    fallbackLng: 'en-US',
    ns: ['dashboard', 'landing-hero', 'landing-events', 'landing-welcome'],
    defaultNS: 'dashboard',
    interpolation: { escapeValue: false },
  });

export default i18n; 
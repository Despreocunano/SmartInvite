import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  es: {
    translation: {
      'register.title': 'Crea tu cuenta',
      'register.subtitle': 'Comienza a crear tu invitación digital',
      'register.groom': 'Novio',
      'register.bride': 'Novia',
      'register.email': 'Correo electrónico',
      'register.password': 'Contraseña',
      'register.confirm': 'Confirmar',
      'register.country': 'País',
      'register.select_country': 'Selecciona un país',
      'register.us': 'Estados Unidos',
      'register.mx': 'México',
      'register.create': 'Crear cuenta',
      'register.already_account': '¿Ya tienes cuenta?',
      'register.login': 'Inicia sesión',
      'register.min_password': 'Mínimo 6 caracteres',
    }
  },
  en: {
    translation: {
      'register.title': 'Create your account',
      'register.subtitle': 'Start creating your digital invitation',
      'register.groom': 'Groom',
      'register.bride': 'Bride',
      'register.email': 'Email',
      'register.password': 'Password',
      'register.confirm': 'Confirm',
      'register.country': 'Country',
      'register.select_country': 'Select a country',
      'register.us': 'United States',
      'register.mx': 'Mexico',
      'register.create': 'Create account',
      'register.already_account': 'Already have an account?',
      'register.login': 'Log in',
      'register.min_password': 'Minimum 6 characters',
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n; 
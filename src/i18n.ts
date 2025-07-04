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
      'menu.dashboard': 'Panel principal',
      'menu.landing': 'Parte Digital',
      'menu.landing_alt': 'Invitación Digital',
      'menu.attendees': 'Gestión de invitados',
      'menu.rsvps': 'Confirmaciones',
      'menu.tables': 'Gestión de mesas',
      'menu.wishlist': 'Lista de deseos',
      'menu.songs': 'Música',
      'menu.reminders': 'Recordatorios',
      'menu.settings': 'Configuración',
      'menu.contact': 'Contacto',
      'menu.logout': 'Cerrar sesión',
      'menu.invite_badge': 'invitación',
      'menu.more': 'Más',
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
      'menu.dashboard': 'Dashboard',
      'menu.landing': 'Digital Invite',
      'menu.landing_alt': 'Digital Invitation',
      'menu.attendees': 'Guest Management',
      'menu.rsvps': 'RSVPs',
      'menu.tables': 'Table Management',
      'menu.wishlist': 'Wishlist',
      'menu.songs': 'Music',
      'menu.reminders': 'Reminders',
      'menu.settings': 'Settings',
      'menu.contact': 'Contact',
      'menu.logout': 'Log out',
      'menu.invite_badge': 'invite',
      'menu.more': 'More',
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
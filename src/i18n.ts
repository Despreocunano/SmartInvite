import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import esAuth from './i18n/locales/es/auth.json';
import enAuth from './i18n/locales/en/auth.json';
import esMenu from './i18n/locales/es/menu.json';
import enMenu from './i18n/locales/en/menu.json';
import esContact from './i18n/locales/es/contact.json';
import enContact from './i18n/locales/en/contact.json';
import esSettings from './i18n/locales/es/settings.json';
import enSettings from './i18n/locales/en/settings.json';
import esLanding from './i18n/locales/es/landing.json';
import enLanding from './i18n/locales/en/landing.json';
import esDashboard from './i18n/locales/es/dashboard.json';
import enDashboard from './i18n/locales/en/dashboard.json';
import esAttendees from './i18n/locales/es/attendees.json';
import enAttendees from './i18n/locales/en/attendees.json';
import esRsvps from './i18n/locales/es/rsvps.json';
import enRsvps from './i18n/locales/en/rsvps.json';
import esTables from './i18n/locales/es/tables.json';
import enTables from './i18n/locales/en/tables.json';
import esFeatures from './i18n/locales/es/features.json';
import enFeatures from './i18n/locales/en/features.json';
import esTemplates from './i18n/locales/es/templates.json';
import enTemplates from './i18n/locales/en/templates.json';

const resources = {
  es: {
    translation: {
      'register.title': 'Crea tu cuenta',
      'register.subtitle': 'Comienza a crear tu invitación digital',
      'register.groom': 'Novio',
      'register.bride': 'Novia',
      'register.email': 'Correo electrónico',
      'register.password': 'Contraseña',
      'register.confirm': 'Confirmar contraseña',
      'register.country': 'País',
      'register.select_country': 'Selecciona un país',
      'register.us': 'Estados Unidos',
      'register.mx': 'México',
      'register.pa': 'Panamá',
      'register.create': 'Crear cuenta',
      'register.already_account': '¿Ya tienes cuenta?',
      'register.login': 'Inicia sesión',
      'register.min_password': 'Mínimo 6 caracteres',
      'login.title': 'Bienvenido de vuelta',
      'login.subtitle': 'Accede a tu panel de administración',
      'login.email': 'Correo electrónico',
      'login.password': 'Contraseña',
      'login.forgot_password': '¿Olvidaste tu contraseña?',
      'login.sign_in': 'Iniciar sesión',
      'login.no_account': '¿No tienes cuenta?',
      'login.register': 'Regístrate',
      'forgot.title': 'Recuperar contraseña',
      'forgot.subtitle': 'Ingresa tu correo electrónico para recibir instrucciones',
      'forgot.email': 'Correo electrónico',
      'forgot.send_instructions': 'Enviar instrucciones',
      'forgot.remembered_password': '¿Recordaste tu contraseña?',
      'forgot.back_to_login': 'Volver al inicio de sesión',
      'forgot.success_message': 'Se han enviado las instrucciones a tu correo electrónico',
      'reset.title': 'Nueva Contraseña',
      'reset.subtitle': 'Ingresa tu nueva contraseña',
      'reset.new_password': 'Nueva contraseña',
      'reset.confirm_password': 'Confirmar contraseña',
      'reset.update_password': 'Actualizar Contraseña',
      'reset.success_message': 'Contraseña actualizada correctamente',
      'auth.back_to_home': '← Volver al inicio',
      'validation.required': 'Requerido',
      'validation.invalid_email': 'Correo inválido',
      'validation.min_password': 'Mínimo 6 caracteres',
      'validation.password_required': 'La contraseña es requerida',
      'validation.password_min_length': 'La contraseña debe tener al menos 6 caracteres',
      'validation.confirm_password_required': 'Por favor confirma tu contraseña',
      'validation.passwords_not_match': 'Las contraseñas no coinciden',
      'validation.email_required': 'El correo electrónico es requerido',
      'validation.email_invalid': 'Correo electrónico inválido',
      'error.unexpected': 'Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.',
      'error.update_password': 'Error al actualizar la contraseña:',
      'success.registration': '¡Registro exitoso! Ahora puedes iniciar sesión.',
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
    },
    auth: esAuth,
    menu: esMenu,
    contact: esContact,
    settings: esSettings,
    landing: esLanding,
    dashboard: esDashboard,
    attendees: esAttendees,
    rsvps: esRsvps,
    tables: esTables,
    features: esFeatures,
    templates: esTemplates
  },
  en: {
    translation: {
      'register.title': 'Create your account',
      'register.subtitle': 'Start creating your digital invitation',
      'register.groom': 'Groom',
      'register.bride': 'Bride',
      'register.email': 'Email',
      'register.password': 'Password',
      'register.confirm': 'Confirm password',
      'register.country': 'Country',
      'register.select_country': 'Select a country',
      'register.us': 'United States',
      'register.mx': 'Mexico',
      'register.pa': 'Panama',
      'register.create': 'Create account',
      'register.already_account': 'Already have an account?',
      'register.login': 'Log in',
      'register.min_password': 'Minimum 6 characters',
      'login.title': 'Welcome back',
      'login.subtitle': 'Access your admin panel',
      'login.email': 'Email',
      'login.password': 'Password',
      'login.forgot_password': 'Forgot your password?',
      'login.sign_in': 'Sign in',
      'login.no_account': "Don't have an account?",
      'login.register': 'Sign up',
      'forgot.title': 'Recover password',
      'forgot.subtitle': 'Enter your email to receive instructions',
      'forgot.email': 'Email',
      'forgot.send_instructions': 'Send instructions',
      'forgot.remembered_password': 'Remembered your password?',
      'forgot.back_to_login': 'Back to login',
      'forgot.success_message': 'Instructions have been sent to your email',
      'reset.title': 'New Password',
      'reset.subtitle': 'Enter your new password',
      'reset.new_password': 'New password',
      'reset.confirm_password': 'Confirm password',
      'reset.update_password': 'Update Password',
      'reset.success_message': 'Password updated successfully',
      'auth.back_to_home': '← Back to home',
      'validation.required': 'Required',
      'validation.invalid_email': 'Invalid email',
      'validation.min_password': 'Minimum 6 characters',
      'validation.password_required': 'Password is required',
      'validation.password_min_length': 'Password must be at least 6 characters',
      'validation.confirm_password_required': 'Please confirm your password',
      'validation.passwords_not_match': 'Passwords do not match',
      'validation.email_required': 'Email is required',
      'validation.email_invalid': 'Invalid email',
      'error.unexpected': 'An unexpected error occurred. Please try again.',
      'error.update_password': 'Error updating password:',
      'success.registration': 'Registration successful! You can now sign in.',
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
    },
    auth: enAuth,
    menu: enMenu,
    contact: enContact,
    settings: enSettings,
    landing: enLanding,
    dashboard: enDashboard,
    attendees: enAttendees,
    rsvps: enRsvps,
    tables: enTables,
    features: enFeatures,
    templates: enTemplates
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es',
    ns: ['auth', 'menu', 'contact', 'settings', 'landing', 'dashboard', 'attendees', 'rsvps', 'tables', 'features', 'templates'],
    defaultNS: 'auth',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n; 
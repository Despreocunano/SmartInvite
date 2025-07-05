import { Link, useLocation } from 'react-router-dom';
import { Heart, UserPlus, ListChecks, Grid, Settings, LogOut, Globe, Music, Send, MessageCircle, Gift, MoreHorizontal, Menu, X, ChevronDown } from 'lucide-react';
import logoDark from '../../assets/images/logo-dark.svg';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { useState, useRef, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const mainNavItems = [
  { nameKey: 'menu.dashboard', href: '/', icon: Heart },
  { nameKey: 'menu.landing', href: '/landing', icon: Globe },
  { nameKey: 'menu.attendees', href: '/attendees', icon: UserPlus },
  { nameKey: 'menu.rsvps', href: '/rsvps', icon: ListChecks },
  { nameKey: 'menu.tables', href: '/tables', icon: Grid },
];

const moreNavItems = [
  { nameKey: 'menu.wishlist', href: '/wishlist-admin', icon: Gift },
  { nameKey: 'menu.songs', href: '/songs', icon: Music },
  { nameKey: 'menu.reminders', href: '/reminders', icon: Send },
];

// Configuración y Contacto siempre a la derecha
const profileNavItems = [
  { nameKey: 'menu.settings', href: '/settings', icon: Settings },
  { nameKey: 'menu.contact', href: '/contact', icon: MessageCircle },
];

// Configuración de idiomas disponibles
const languages = [
  { code: 'es', name: 'Español', flag: 'https://flagicons.lipis.dev/flags/4x3/es.svg' },
  { code: 'en', name: 'English', flag: 'https://flagicons.lipis.dev/flags/4x3/us.svg' },
];

export function AppNavbar() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const languageMenuRef = useRef<HTMLDivElement>(null);

  // Cerrar el menú mobile al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileOpen(false);
      }
    }
    if (mobileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileOpen]);

  // Cerrar el menú "Más" al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setMoreMenuOpen(false);
      }
    }
    if (moreMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [moreMenuOpen]);

  // Cerrar el menú de idiomas al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target as Node)) {
        setLanguageMenuOpen(false);
      }
    }
    if (languageMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [languageMenuOpen]);

  // Obtener el idioma del usuario desde la base de datos
  const [userLanguage, setUserLanguage] = useState(i18n.language.substring(0, 2));
  
  // Cargar el idioma del usuario al montar el componente
  useEffect(() => {
    const loadUserLanguage = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: userProfile } = await supabase
            .from('users')
            .select('language')
            .eq('id', user.id)
            .single();
          
          if (userProfile?.language) {
            setUserLanguage(userProfile.language);
            // También actualizar i18n si es diferente
            if (i18n.language !== userProfile.language) {
              i18n.changeLanguage(userProfile.language);
            }
          }
        }
      } catch (error) {
        console.error('Error loading user language:', error);
      }
    };
    
    loadUserLanguage();
  }, []);
  
  // Obtener el idioma actual
  const currentLanguage = languages.find(lang => lang.code === userLanguage) || languages[0];

  return (
    <header className="w-full bg-white shadow flex items-center px-2 md:px-8 py-2 z-30 sticky top-0">
      {/* Logo y hamburguesa en mobile */}
      <div className="flex items-center flex-1 md:flex-none">
        <Link to="/" className="flex items-center mr-4">
          <img src={logoDark} alt="Logo" className="h-14 w-auto" />
        </Link>
        <button
          className="md:hidden ml-auto text-gray-600 hover:text-rose-600 focus:outline-none"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Abrir menú"
        >
          {mobileOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>
      {/* Navegación desktop */}
      <nav className="hidden md:flex flex-1 justify-center">
        <ul className="flex gap-2 md:gap-4 items-center whitespace-nowrap">
          {mainNavItems.map(({ nameKey, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <li key={nameKey}>
                <Link
                  to={href}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-rose-50 text-rose-600' : 'text-gray-700 hover:bg-gray-100 hover:text-rose-600'}`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{t(`menu:${nameKey.split('.')[1]}`)}</span>
                </Link>
              </li>
            );
          })}
          {/* Botón Más */}
          <div className="relative" ref={moreMenuRef}>
            <button
              onClick={() => setMoreMenuOpen((v) => !v)}
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium transition-colors text-gray-700 hover:bg-gray-100 hover:text-rose-600 ${moreMenuOpen ? 'bg-rose-50 text-rose-600' : ''}`}
              aria-haspopup="true"
              aria-expanded={moreMenuOpen}
            >
              <MoreHorizontal className="w-5 h-5" />
              <span>{t('menu:more') || 'Más'}</span>
            </button>
            {moreMenuOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <ul className="py-1">
                  {moreNavItems.map(({ nameKey, href, icon: Icon }) => {
                    const isActive = pathname === href;
                    return (
                      <li key={nameKey}>
                        <Link
                          to={href}
                          className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors ${isActive ? 'bg-rose-50 text-rose-600' : 'text-gray-700 hover:bg-gray-100 hover:text-rose-600'}`}
                          onClick={() => setMoreMenuOpen(false)}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{t(`menu:${nameKey.split('.')[1]}`)}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </ul>
      </nav>
      {/* Accesos rápidos tipo perfil (desktop) */}
      <div className="hidden md:flex items-center gap-2 ml-4">
        {profileNavItems.map(({ nameKey, href, icon: Icon }) => (
          <Link
            key={nameKey}
            to={href}
            className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${pathname === href ? 'bg-rose-50 text-rose-600' : 'text-gray-500 hover:text-rose-600'}`}
            title={t(`menu:${nameKey.split('.')[1]}`)}
          >
            <Icon className="w-5 h-5" />
          </Link>
        ))}
        <button
          onClick={() => signOut()}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-rose-600"
          title={t('menu:logout')}
        >
          <LogOut className="w-5 h-5" />
        </button>
        {/* Selector de idioma con desplegable */}
        <div className="relative ml-2" ref={languageMenuRef}>
          <button
            onClick={() => setLanguageMenuOpen((v) => !v)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
            aria-haspopup="true"
            aria-expanded={languageMenuOpen}
          >
            <img 
              src={currentLanguage.flag} 
              alt={currentLanguage.name} 
              className="rounded-sm object-cover border border-white shadow-sm w-6 h-auto" 
            />
            <span className="text-sm font-medium text-gray-700">{currentLanguage.name}</span>
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${languageMenuOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {languageMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-sm shadow-lg z-50">
              <div className="py-1">
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={async () => {
                      i18n.changeLanguage(language.code);
                      setLanguageMenuOpen(false);
                      
                      // Update user's language preference in database
                      try {
                        const { data: { user } } = await supabase.auth.getUser();
                        if (user) {
                          await supabase
                            .from('users')
                            .update({ language: language.code })
                            .eq('id', user.id);
                          // Update local state
                          setUserLanguage(language.code);
                        }
                      } catch (error) {
                        console.error('Error updating user language:', error);
                      }
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                      userLanguage === language.code 
                        ? 'bg-rose-50 text-rose-600' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-rose-600'
                    }`}
                  >
                    <img 
                      src={language.flag} 
                      alt={language.name} 
                      className="rounded-sm object-cover border border-white shadow-sm w-6 h-auto" 
                    />
                    <span className="font-medium">{language.name}</span>
                    {userLanguage === language.code && (
                      <div className="ml-auto w-2 h-2 bg-rose-500 rounded-full"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Menú mobile desplegable */}
      {mobileOpen && (
        <div ref={mobileMenuRef} className="absolute top-full left-0 w-full bg-white border-t border-gray-200 shadow-lg z-50 md:hidden animate-fade-in">
          <nav className="py-2 flex flex-col">
            {mainNavItems.map(({ nameKey, href, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={nameKey}
                  to={href}
                  className={`flex items-center gap-2 px-6 py-3 text-base transition-colors ${isActive ? 'bg-rose-50 text-rose-600' : 'text-gray-700 hover:bg-gray-100 hover:text-rose-600'}`}
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span>{t(`menu:${nameKey.split('.')[1]}`)}</span>
                </Link>
              );
            })}
            {/* Sección Más en mobile */}
            <hr className="my-2 border-gray-200" />
            <div className="px-6 pb-2 text-xs text-gray-400 uppercase tracking-wider">{t('menu:more') || 'Más'}</div>
            {moreNavItems.map(({ nameKey, href, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={nameKey}
                  to={href}
                  className={`flex items-center gap-2 px-6 py-3 text-base transition-colors ${isActive ? 'bg-rose-50 text-rose-600' : 'text-gray-700 hover:bg-gray-100 hover:text-rose-600'}`}
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span>{t(`menu:${nameKey.split('.')[1]}`)}</span>
                </Link>
              );
            })}
            {/* Accesos rápidos tipo perfil en mobile */}
            <div className="border-t border-gray-200 mt-2 pt-2 flex gap-2 px-6">
              {profileNavItems.map(({ nameKey, href, icon: Icon }) => (
                <Link
                  key={nameKey}
                  to={href}
                  className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${pathname === href ? 'bg-rose-50 text-rose-600' : 'text-gray-500 hover:text-rose-600'}`}
                  title={t(`menu:${nameKey.split('.')[1]}`)}
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                </Link>
              ))}
              <button
                onClick={() => {
                  signOut();
                  setMobileOpen(false);
                }}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-rose-600"
                title={t('menu:logout')}
              >
                <LogOut className="w-5 h-5" />
              </button>
              {/* Selector de idioma móvil */}
              <div className="flex gap-2">
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={async () => {
                      i18n.changeLanguage(language.code);
                      
                      // Update user's language preference in database
                      try {
                        const { data: { user } } = await supabase.auth.getUser();
                        if (user) {
                          await supabase
                            .from('users')
                            .update({ language: language.code })
                            .eq('id', user.id);
                          // Update local state
                          setUserLanguage(language.code);
                        }
                      } catch (error) {
                        console.error('Error updating user language:', error);
                      }
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                      userLanguage === language.code 
                        ? 'border-rose-500 bg-rose-50 text-rose-600' 
                        : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <img 
                      src={language.flag} 
                      alt={language.name} 
                      className="rounded-sm object-cover border border-white shadow-sm w-6 h-auto" 
                    />
                    <span className="text-sm font-medium">{language.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
} 
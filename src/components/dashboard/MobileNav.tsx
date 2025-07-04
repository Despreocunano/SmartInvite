import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Menu, UserPlus, ListChecks, Grid, Settings, LogOut, Globe, Music, Send, MessageCircle, Gift, X } from 'lucide-react';
import logoDark from '../../assets/images/logo-dark.svg';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

const navItems = [
  { nameKey: 'menu.dashboard', href: '/', icon: Heart },
  { nameKey: 'menu.landing_alt', href: '/landing', icon: Globe },
  { nameKey: 'menu.attendees', href: '/attendees', icon: UserPlus },
  { nameKey: 'menu.rsvps', href: '/rsvps', icon: ListChecks },
  { nameKey: 'menu.tables', href: '/tables', icon: Grid },
  { nameKey: 'menu.wishlist', href: '/wishlist-admin', icon: Gift },
  { nameKey: 'menu.songs', href: '/songs', icon: Music },
  { nameKey: 'menu.reminders', href: '/reminders', icon: Send },
  { nameKey: 'menu.settings', href: '/settings', icon: Settings },
  { nameKey: 'menu.contact', href: '/contact', icon: MessageCircle },
];

export function MobileNav() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const { signOut } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar el menú al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="md:hidden w-full">
      <div className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
          <img 
            src={logoDark} 
            alt="Parte Digital" 
            className="h-8 w-auto"
          />
        </Link>
        <button onClick={() => setIsOpen((v) => !v)} className="text-gray-500 focus:outline-none">
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {isOpen && (
        <div ref={menuRef} className="absolute right-4 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <nav className="py-2">
            {navItems.map(({ nameKey, href, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={nameKey}
                  to={href}
                  className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors ${isActive ? 'bg-rose-50 text-rose-600' : 'text-gray-700 hover:bg-gray-100 hover:text-rose-600'}`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span>{t(`menu:${nameKey.split('.')[1]}`)}</span>
                </Link>
              );
            })}
            <div className="border-t border-gray-200 mt-2 pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  signOut();
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-rose-600 font-medium"
              >
                <LogOut className="w-5 h-5" />
                {t('menu:logout')}
              </button>
              <div className="flex gap-2 px-4">
                <button
                  onClick={() => i18n.changeLanguage('es')}
                  className={`p-1 rounded-full border-2 ${i18n.language.startsWith('es') ? 'border-rose-500' : 'border-transparent'} hover:border-rose-400`}
                  aria-label="Español"
                >
                  <img src="https://flagcdn.com/es.svg" alt="Español" width={24} height={24} className="rounded-full" />
                </button>
                <button
                  onClick={() => i18n.changeLanguage('en')}
                  className={`p-1 rounded-full border-2 ${i18n.language.startsWith('en') ? 'border-rose-500' : 'border-transparent'} hover:border-rose-400`}
                  aria-label="English"
                >
                  <img src="https://flagcdn.com/us.svg" alt="English" width={24} height={24} className="rounded-full" />
                </button>
              </div>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}

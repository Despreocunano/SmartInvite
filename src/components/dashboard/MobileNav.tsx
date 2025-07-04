import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart, Menu, X, UserPlus, ListChecks, Grid, Settings, LogOut, Globe, Music, Send, MessageCircle, Gift } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import logoDark from '../../assets/images/logo-dark.svg';
import { useTranslation } from 'react-i18next';

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { t } = useTranslation();

  const toggleNav = () => setIsOpen(!isOpen);

  const navigation = [
    {
      name: t('dashboard.main', 'Panel principal'),
      href: '/',
      icon: Heart
    },
    {
      name: t('dashboard.digital_invitation', 'Invitación Digital'),
      href: '/landing',
      icon: Globe
    },
    {
      name: t('dashboard.guests', 'Gestión de invitados'),
      href: '/attendees',
      icon: UserPlus
    },
    {
      name: t('dashboard.rsvps', 'Confirmaciones'),
      href: '/rsvps',
      icon: ListChecks
    },
    {
      name: t('dashboard.tables', 'Gestión de mesas'),
      href: '/tables',
      icon: Grid
    },
    {
      name: t('dashboard.wishlist', 'Lista de deseos'),
      href: '/wishlist-admin',
      icon: Gift
    },
    {
      name: t('dashboard.music', 'Música'),
      href: '/songs',
      icon: Music
    },
    {
      name: t('dashboard.reminders', 'Recordatorios'),
      href: '/reminders',
      icon: Send
    },
    {
      name: t('dashboard.settings', 'Configuración'),
      href: '/settings',
      icon: Settings
    },
    {
      name: t('dashboard.contact', 'Contacto'),
      href: '/contact',
      icon: MessageCircle
    }
  ];

  return (
    <div className="md:hidden">
      <div className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
          <img 
            src={logoDark} 
            alt="Parte Digital" 
            className="h-8 w-auto"
          />
        </Link>
        <button onClick={toggleNav} className="text-gray-500 focus:outline-none">
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-10 flex bg-black bg-opacity-50">
          <div className="w-64 bg-white h-full overflow-y-auto shadow-lg flex flex-col">
            <Link to="/" className="flex flex-col items-center px-4 py-6 border-b border-gray-200 hover:opacity-80 transition-opacity">
              <img 
                src={logoDark} 
                alt="Parte Digital" 
                className="h-12 w-auto mb-3"
              />
            </Link>
            <nav className="mt-5 px-4 space-y-1 flex-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      isActive
                        ? 'bg-rose-50 text-rose-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                      'group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-all'
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon
                      className={cn(
                        isActive
                          ? 'text-rose-600'
                          : 'text-gray-400 group-hover:text-gray-500',
                        'mr-3 h-5 w-5 flex-shrink-0'
                      )}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Logout Button */}
            <div className="px-4 py-4 border-t border-gray-200">
              <button
                onClick={() => {
                  signOut();
                  setIsOpen(false);
                }}
                className="group flex items-center px-3 py-3 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 w-full"
              >
                <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                {t('dashboard.logout', 'Cerrar sesión')}
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsOpen(false)}></div>
        </div>
      )}
    </div>
  );
}

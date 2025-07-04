import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart, UserPlus, ListChecks, Grid, Settings, LogOut, Globe, Music, Send, MessageCircle, Gift } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import logoDark from '../../assets/images/logo-dark.svg';

export function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const navigation = [
    {
      name: 'Panel principal',
      href: '/',
      icon: Heart
    },
    {
      name: 'Parte Digital',
      href: '/landing',
      icon: Globe
    },
    {
      name: 'Gestión de invitados',
      href: '/attendees',
      icon: UserPlus
    },
    {
      name: 'Confirmaciones',
      href: '/rsvps',
      icon: ListChecks
    },
    {
      name: 'Gestión de mesas',
      href: '/tables',
      icon: Grid
    },
    {
      name: 'Lista de deseos',
      href: '/wishlist-admin',
      icon: Gift
    },
    {
      name: 'Música',
      href: '/songs',
      icon: Music
    },
    {
      name: 'Recordatorios',
      href: '/reminders',
      icon: Send
    },
    {
      name: 'Configuración',
      href: '/settings',
      icon: Settings
    },
    {
      name: 'Contacto',
      href: '/contact',
      icon: MessageCircle
    }
  ];

  return (
    <div className="hidden md:flex flex-col fixed inset-y-0 bg-white shadow-md w-64">
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <Link to="/" className="flex items-center flex-col px-4 mb-6 hover:opacity-80 transition-opacity">
          <img 
            src={logoDark} 
            alt="Parte Digital" 
            className="h-12 w-auto mb-3"
          />
        </Link>

        <nav className="mt-4 flex-1 px-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            const showBadge = item.name === 'Parte Digital';
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  isActive
                    ? 'bg-rose-50 text-rose-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  'group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-all relative'
                )}
              >
                <Icon
                  className={cn(
                    isActive
                      ? 'text-rose-600'
                      : 'text-gray-400 group-hover:text-gray-500',
                    'mr-3 h-5 w-5 flex-shrink-0'
                  )}
                />
                <span className="relative flex-1 inline-block">
                  {item.name}
                  {showBadge && (
                    <span className="absolute -top-2 -right-3 px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-500 text-white shadow border border-white whitespace-nowrap z-10">
                     invitación
                    </span>
                  )}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => signOut()}
          className="group flex items-center px-3 py-3 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 w-full"
        >
          <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

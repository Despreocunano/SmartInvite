import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user } = useAuth();
  const { i18n, t } = useTranslation();

  useEffect(() => {
    if (!user) return;
    // Try to get country from user_metadata or fallback to localStorage
    let country = user.user_metadata?.country;
    if (!country) {
      country = localStorage.getItem('country') || undefined;
    }
    let lng = 'en-US';
    if (country === 'Panama') lng = 'es-PA';
    else if (country === 'Mexico') lng = 'es-MX';
    else if (country === 'USA') lng = 'en-US';
    i18n.changeLanguage(lng);
  }, [user, i18n]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <MobileNav />
      <main className="md:pl-64 min-h-screen">
        <div className="py-6">
          <div className="mx-auto px-4 sm:px-6 md:px-8">
            <h1 className="text-2xl font-bold mb-4">{t('dashboard.welcome')}</h1>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
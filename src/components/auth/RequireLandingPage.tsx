import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { FeatureLockModal } from '../ui/FeatureLockModal';
import { useTranslation } from 'react-i18next';

interface RequireLandingPageProps {
  children: React.ReactNode;
}

export function RequireLandingPage({ children }: RequireLandingPageProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [hasLandingPage, setHasLandingPage] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const checkLandingPage = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('landing_pages')
          .select('id')
          .eq('user_id', user.id)
          .limit(1);

        if (error) {
          console.error('Error checking landing page:', error);
          setHasLandingPage(false);
          return;
        }

        setHasLandingPage(data && data.length > 0);
      } catch (error) {
        console.error('Error checking landing page:', error);
        setHasLandingPage(false);
      } finally {
        setLoading(false);
      }
    };

    checkLandingPage();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  return (
    <>
      {children}
      <FeatureLockModal
        isOpen={!hasLandingPage}
        title={t('landing:welcome_modal_title')}
        description={t('landing:welcome_modal_description')}
        actionText={t('landing:welcome_modal_action')}
        actionPath="/landing"
      />
    </>
  );
} 
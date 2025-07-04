import { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { useWedding } from '../hooks/useWedding';
import { Modal } from '../components/ui/Modal';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Trash2, AlertTriangle, Camera, User, Settings as SettingsIcon } from 'lucide-react';
import { ImageUpload } from '../components/ui/ImageUpload';
import toast from 'react-hot-toast';
import { useTranslation, Trans } from 'react-i18next';

export function SettingsPage() {
  const { t } = useTranslation('settings');
  const { user, signOut } = useAuth();
  const { groomName, brideName, profileImage, updateNames, updateProfileImage } = useWedding();
  const navigate = useNavigate();
  
  const [newGroomName, setNewGroomName] = useState('');
  const [newBrideName, setNewBrideName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    setNewGroomName(groomName);
    setNewBrideName(brideName);
  }, [groomName, brideName]);

  const handleNamesUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await updateNames(newGroomName, newBrideName);
      if (result.success) {
        setSuccess(t('success_names'));
      } else {
        setError(t('error_names'));
      }
    } catch (err) {
      setError(t('error_names'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpdate = async (imageUrl: string) => {
    try {
      await updateProfileImage(imageUrl);
      setShowImageModal(false);
      toast.success(t('success_names'));
    } catch (error) {
      console.error('Error updating profile image:', error);
      toast.error(t('error.generic'));
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== t('delete_placeholder')) {
      toast.error(t('delete_type_error'));
      return;
    }

    setIsDeletingAccount(true);
    try {
      // Delete all related data
      const { error: deleteError } = await supabase
        .rpc('delete_user_data', { target_user_id: user?.id });

      if (deleteError) throw deleteError;

      // Delete auth user (usuario autenticado)
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No authenticated session');
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-user`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error || t('delete_error'));

      await signOut();
      navigate('/login');
      toast.success(t('delete_success'));
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error(t('delete_error'));
    } finally {
      setIsDeletingAccount(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 px-2 md:px-0">
      <div className="max-w-2xl mx-auto">
        {/* Header minimalista */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
            <SettingsIcon className="h-6 w-6 text-rose-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
            <p className="text-gray-500 text-sm">{t('subtitle')}</p>
          </div>
        </div>

        {/* Feedback banners */}
        {error && (
          <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-md px-4 py-2">
            <AlertTriangle className="h-4 w-4" /> {error}
          </div>
        )}
        {success && (
          <div className="mb-4 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-md px-4 py-2">
            <User className="h-4 w-4" /> {success}
          </div>
        )}

        {/* Card principal */}
        <Card className="shadow-none border border-gray-100 rounded-2xl">
          <CardContent className="py-8 px-6 md:px-12">
            {/* Foto de perfil */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative group w-28 h-28 mb-2">
                {profileImage ? (
                  <div className="w-28 h-28 rounded-full bg-cover bg-center border-4 border-rose-100" style={{ backgroundImage: `url(${profileImage})` }} />
                ) : (
                  <div className="w-28 h-28 bg-gray-100 rounded-full flex items-center justify-center border-4 border-rose-100">
                    <Camera className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setShowImageModal(true)}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <span className="text-white text-xs font-semibold bg-rose-500 px-3 py-1 rounded-full shadow">{t('change_photo')}</span>
                </button>
              </div>
              <p className="text-xs text-gray-500 text-center max-w-xs">
                {t('profile_photo_desc')}
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-8" />

            {/* Inputs de nombres */}
            <form onSubmit={handleNamesUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label={t('groom_name')}
                  value={newGroomName}
                  onChange={(e) => setNewGroomName(e.target.value)}
                  placeholder={t('groom_placeholder')}
                  leftIcon={<User className="h-4 w-4 text-gray-400" />}
                  required
                />
                <Input
                  label={t('bride_name')}
                  value={newBrideName}
                  onChange={(e) => setNewBrideName(e.target.value)}
                  placeholder={t('bride_placeholder')}
                  leftIcon={<User className="h-4 w-4 text-gray-400" />}
                  required
                />
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 my-8" />

              {/* Info de cuenta */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
                  <p className="text-base text-gray-900 font-semibold bg-gray-50 rounded px-3 py-2 border border-gray-100">{user?.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('account_created')}</label>
                  <p className="text-base text-gray-900 font-semibold bg-gray-50 rounded px-3 py-2 border border-gray-100">
                    {user?.created_at 
                      ? new Date(user.created_at).toLocaleDateString(t('created_at_format'), {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : new Date().toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <Button type="submit" size="lg" className='bg-primary hover:bg-primary-dark text-primary-contrast px-8' isLoading={isLoading}>
                  {t('save_changes')}
                </Button>
              </div>
            </form>

            {/* Divider */}
            <div className="border-t border-gray-200 my-8" />

            {/* Eliminar cuenta */}
            <div className="bg-red-50 rounded-xl p-6 flex flex-col gap-4 mt-8">
              <div className="flex items-center gap-3">
                <Trash2 className="h-6 w-6 text-red-500" />
                <span className="text-lg font-semibold text-red-700">{t('delete_account')}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-red-100 text-red-700 rounded-lg">
                <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                <span>{t('delete_warning')}</span>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm text-gray-700">
                  <Trans i18nKey="delete_confirm_text" ns="settings">
                    Para confirmar, escribe <span className="font-mono font-bold">ELIMINAR</span> en el campo de abajo:
                  </Trans>
                </p>
                <Input
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder={t('delete_placeholder')}
                />
              </div>
              <div className="flex justify-end mt-2">
                <Button
                  variant="danger"
                  size="lg"
                  onClick={() => setShowDeleteModal(true)}
                  leftIcon={<Trash2 className="h-5 w-5" />}
                >
                  {t('delete_account')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal de confirmación de eliminación */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        title={t('delete_account_title')}
        confirmText={t('delete_account_confirm')}
        isDanger
        isLoading={isDeletingAccount}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-lg">
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">
              {t('delete_warning')}
            </p>
          </div>

          <p className="text-sm text-gray-600">
            <Trans i18nKey="delete_confirm_text" ns="settings">
              Para confirmar, escribe <span className="font-mono font-bold">ELIMINAR</span> en el campo de abajo:
            </Trans>
          </p>

          <Input
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
            placeholder={t('delete_placeholder')}
          />
        </div>
      </Modal>

      {/* Modal de cambio de foto de perfil */}
      <Modal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        title={t('modal_profile_photo_title')}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            {t('modal_profile_photo_desc')}
          </p>
          <ImageUpload
            value={profileImage}
            onChange={handleImageUpdate}
            onRemove={() => handleImageUpdate('')}
            label={t('upload_photo')}
          />
        </div>
      </Modal>
    </div>
  );
}
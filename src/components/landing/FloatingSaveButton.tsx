import { Save, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import { FieldErrors } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface FloatingSaveButtonProps {
  isLoading: boolean;
  previewUrl?: string;
  publishedUrl?: string;
  hasRequiredInfo?: boolean;
  hasChanges?: boolean;
  errors?: FieldErrors;
  coverImageError?: string | null;
  galleryImagesError?: string | null;
  onSave?: () => void;
}

export function FloatingSaveButton({ 
  isLoading, 
  previewUrl, 
  publishedUrl, 
  hasRequiredInfo = true,
  hasChanges = false,
  errors,
  coverImageError,
  galleryImagesError,
  onSave
}: FloatingSaveButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useTranslation('landing');

  useEffect(() => {
    // Mostrar inmediatamente en desktop, con pequeño delay en mobile para evitar flash
    const isMobile = window.innerWidth < 640;
    const delay = isMobile ? 200 : 0;
    
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, []);

  const handleSaveClick = (e: React.MouseEvent) => {
    // Scroll a portada o galería si hay error
    if (coverImageError) {
      const el = document.getElementById('cover-image-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        (el as HTMLElement).focus?.();
      }
      e.preventDefault();
      return;
    }
    if (galleryImagesError) {
      const el = document.getElementById('gallery-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        (el as HTMLElement).focus?.();
      }
      e.preventDefault();
      return;
    }
    if (errors && Object.keys(errors).length > 0) {
      // Buscar el primer campo con error
      const firstErrorKey = Object.keys(errors)[0];
      const el = document.querySelector(`[name="${firstErrorKey}"]`);
      if (el && typeof (el as any).scrollIntoView === 'function') {
        (el as any).scrollIntoView({ behavior: 'smooth', block: 'center' });
        (el as HTMLElement).focus();
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      e.preventDefault();
      return;
    }
    if (onSave) onSave();
  };

  const handlePreviewClick = () => {
    if (previewUrl) {
      window.open(previewUrl, '_blank');
    }
  };

  // No renderizar hasta que esté listo para evitar el flash
  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 sm:bottom-0 sm:right-4 sm:left-auto sm:transform-none flex gap-2 z-50 w-fit max-w-full px-2 pb-2">
      {previewUrl && (
        <button
          type="button"
          className="min-w-[44px] max-w-[160px] w-auto sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg shadow-lg px-3 py-2 flex items-center justify-center gap-2 transition-all duration-200 z-50 text-sm font-medium border border-gray-300"
          onClick={handlePreviewClick}
        >
          <Eye className="h-4 w-4" />
          <span className="hidden sm:inline">{t('floating_preview')}</span>
        </button>
      )}
      {hasChanges && (
        <button
          type="submit"
          className="min-w-[44px] max-w-[160px] w-auto sm:w-auto bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-lg px-3 py-2 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed z-50 text-sm font-medium"
          disabled={isLoading}
          onClick={handleSaveClick}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span className="hidden sm:inline">{t('floating_save')}</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
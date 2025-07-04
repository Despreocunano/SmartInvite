import React, { useRef, useState } from 'react';
import { Music, X } from 'lucide-react';
import { Button } from './Button';
import { toast } from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import { useTranslation } from 'react-i18next';

interface MusicUploadProps {
  value?: string;
  onChange: (value: string) => void;
  onRemove?: () => void;
  className?: string;
  label?: string;
}

export function MusicUpload({
  value,
  onChange,
  onRemove,
  className = '',
  label
}: MusicUploadProps) {
  const { t } = useTranslation('landing');
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [audioName, setAudioName] = useState<string>('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error(t('music_upload_file_too_large'));
      return;
    }

    // Validate file type
    if (!file.type.startsWith('audio/')) {
      toast.error(t('music_upload_invalid_type'));
      return;
    }

    setIsUploading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No authenticated session');

      // Generate a unique file name
      const timestamp = new Date().getTime();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileExt = file.name.split('.').pop();
      const fileName = `${timestamp}-${randomString}.${fileExt}`;
      const filePath = `${session.user.id}/${fileName}`;

      // Upload file to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('landing-music')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('landing-music')
        .getPublicUrl(filePath);

      setAudioName(file.name);
      onChange(publicUrl);
      toast.success(t('music_upload_success'));
    } catch (error) {
      console.error('Error uploading music:', error);
      toast.error(t('music_upload_error'));
    } finally {
      setIsUploading(false);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const handleRemove = async () => {
    if (!value || !onRemove) return;

    try {
      // Extract file path from URL
      const url = new URL(value);
      const pathParts = url.pathname.split('/');
      const filePath = pathParts.slice(pathParts.indexOf('landing-music') + 1).join('/');

      const { error } = await supabase.storage
        .from('landing-music')
        .remove([filePath]);

      if (error) throw error;

      onRemove();
      setAudioName('');
      toast.success(t('music_upload_remove_success'));
    } catch (error) {
      console.error('Error removing music:', error);
      toast.error(t('music_upload_remove_error'));
    }
  };

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {value ? (
        <div className="relative p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
              <Music className="h-5 w-5 text-rose-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {audioName || t('music_upload_uploaded')}
              </p>
              <audio controls className="mt-2 max-w-full">
                <source src={value} type="audio/mpeg" />
                {t('music_upload_audio_not_supported')}
              </audio>
            </div>
            {onRemove && (
              <button
                type="button"
                onClick={handleRemove}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <Button
          type="button"
          variant="secondary"
          className="w-full h-32 flex flex-col items-center justify-center gap-2 border-2 border-dashed"
          onClick={() => inputRef.current?.click()}
          isLoading={isUploading}
          disabled={isUploading}
        >
          {!isUploading && (
            <>
              <Music className="h-8 w-8 text-gray-400" />
              <span className="text-sm text-gray-600">{label || t('music_upload_button')}</span>
              <span className="text-xs text-gray-500">{t('music_upload_helper')}</span>
            </>
          )}
        </Button>
      )}
    </div>
  );
}
import React, { useRef, useState } from 'react';
import { Image as ImageIcon, X } from 'lucide-react';
import { Button } from './Button';
import { toast } from 'react-hot-toast';
import { supabase } from '../../lib/supabase';

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  onRemove?: () => void;
  className?: string;
  label?: string;
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  className = '',
  label = 'Subir Imagen'
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('La imagen es demasiado grande. Máximo 10MB.');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona una imagen válida.');
      return;
    }

    // Validate specific image types
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Solo se permiten imágenes en formato JPG, PNG, WEBP o AVIF.');
      return;
    }

    setIsUploading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No authenticated session');

      // Generate a unique file name using timestamp and random string
      const timestamp = new Date().getTime();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileExt = file.name.split('.').pop();
      const fileName = `${timestamp}-${randomString}.${fileExt}`;
      const filePath = `${session.user.id}/${fileName}`;

      // Upload file to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('landing-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('landing-images')
        .getPublicUrl(filePath);

      onChange(publicUrl);
      toast.success('Imagen subida correctamente');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error al subir la imagen');
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
      const filePath = pathParts.slice(pathParts.indexOf('landing-images') + 1).join('/');

      const { error } = await supabase.storage
        .from('landing-images')
        .remove([filePath]);

      if (error) throw error;

      onRemove();
      toast.success('Imagen eliminada correctamente');
    } catch (error) {
      console.error('Error removing image:', error);
      toast.error('Error al eliminar la imagen');
    }
  };

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,.avif"
        onChange={handleFileChange}
        className="hidden"
      />

      {value ? (
        <div className="relative aspect-video rounded-lg overflow-hidden group">
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          {onRemove && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      ) : (
        <div className="relative w-full aspect-video">
          <Button
            type="button"
            variant="secondary"
            className="w-full h-full flex flex-col items-center justify-center gap-2 border-2 border-dashed"
            onClick={() => inputRef.current?.click()}
            isLoading={isUploading}
            disabled={isUploading}
          >
            {!isUploading && (
              <>
                <ImageIcon className="h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-600">{label}</span>
              </>
            )}
          </Button>
          {isUploading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10 rounded-lg">
              <svg className="animate-spin h-8 w-8 text-rose-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-rose-500 font-medium text-sm">Subiendo imagen...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
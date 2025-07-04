
import { ImageUpload } from './ImageUpload';

interface CoverImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  onRemove?: () => void;
  className?: string;
}

export function CoverImageUpload({
  value,
  onChange,
  onRemove,
  className = ''
}: CoverImageUploadProps) {
  return (
    <div className={className}>
      <div className="space-y-4">
        <p className="text-sm text-gray-500">
          Recomendamos una imagen horizontal de alta calidad. Algunos diseños no muestran la imagen de portada.
        </p>
        <ImageUpload
          value={value}
          onChange={onChange}
          onRemove={onRemove}
          label="Subir imagen de portada"
        />
      </div>
    </div>
  );
}
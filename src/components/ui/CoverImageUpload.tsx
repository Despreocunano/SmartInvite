import { ImageUpload } from './ImageUpload';

interface CoverImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  onRemove?: () => void;
  className?: string;
  helperText?: string;
  buttonLabel?: string;
}

export function CoverImageUpload({
  value,
  onChange,
  onRemove,
  className = '',
  helperText,
  buttonLabel
}: CoverImageUploadProps) {
  return (
    <div className={className}>
      <div className="space-y-4">
        {helperText && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
        <ImageUpload
          value={value}
          onChange={onChange}
          onRemove={onRemove}
          label={buttonLabel}
        />
      </div>
    </div>
  );
}
import { getInitials } from '../../lib/utils';

interface AttendeeAvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
}

export function AttendeeAvatar({ name, size = 'md' }: AttendeeAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-lg'
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-rose-100 flex items-center justify-center text-rose-700 font-medium`}>
      {getInitials(name)}
    </div>
  );
}
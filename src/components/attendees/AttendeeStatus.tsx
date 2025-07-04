import React from 'react';
import { Check, X, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { RsvpStatus } from '../../types/supabase';
import { useTranslation } from 'react-i18next';

interface AttendeeStatusProps {
  status: RsvpStatus;
  className?: string;
}

export function AttendeeStatus({ status, className = '' }: AttendeeStatusProps) {
  const { t } = useTranslation('landing');
  const baseClasses = "flex items-center";

  if (status === 'confirmed') {
    return (
      <div className={cn(baseClasses, "text-green-600", className)}>
        <Check className="w-4 h-4 mr-1" />
        <span className="text-sm font-medium">{t('attendees.status.confirmed')}</span>
      </div>
    );
  }

  if (status === 'declined') {
    return (
      <div className={cn(baseClasses, "text-red-600", className)}>
        <X className="w-4 h-4 mr-1" />
        <span className="text-sm font-medium">{t('attendees.status.declined')}</span>
      </div>
    );
  }

  return (
    <div className={cn(baseClasses, "text-amber-600", className)}>
      <Clock className="w-4 h-4 mr-1" />
      <span className="text-sm font-medium">{t('attendees.status.pending')}</span>
    </div>
  );
}
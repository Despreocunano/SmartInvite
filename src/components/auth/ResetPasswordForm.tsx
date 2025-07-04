import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { translateAuthError } from '../../lib/authErrors';
import { useTranslation } from 'react-i18next';

type ResetPasswordFormData = {
  password: string;
  confirmPassword: string;
};

export function ResetPasswordForm() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>();

  const password = watch('password');

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      setLoading(true);

      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) {
        throw error;
      }

      toast.success(t('reset.success_message'));
      setTimeout(() => {
        window.location.href = 'https://app.smartinvite.me/auth?showLogin=true';
      }, 1500);
    } catch (error) {
      console.error(t('error.update_password'), error);
      toast.error(translateAuthError(error as Error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-center mb-2">{t('reset.title')}</h2>
        <p className="text-xs text-gray-500 text-center mb-6">
          {t('reset.subtitle')}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <Input
              type="password"
              placeholder={t('reset.new_password')}
              error={errors.password?.message}
              {...register('password', {
                required: t('validation.password_required'),
                minLength: {
                  value: 6,
                  message: t('validation.password_min_length'),
                },
              })}
            />
          </div>

          <div>
            <Input
              type="password"
              placeholder={t('reset.confirm_password')}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword', {
                required: t('validation.confirm_password_required'),
                validate: (value) =>
                  value === password || t('validation.passwords_not_match'),
              })}
            />
          </div>

          <Button
            type="submit"
            className="w-full h-9 bg-primary text-primary-contrast hover:bg-primary-dark"
            isLoading={loading}
          >
            {t('reset.update_password')}
          </Button>
        </form>
      </div>
    </Card>
  );
} 
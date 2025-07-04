import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import { Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { translateAuthError } from '../../lib/authErrors';
import { useTranslation } from 'react-i18next';

type ForgotPasswordFormProps = {
  onBack: () => void;
};

type ForgotPasswordFormData = {
  email: string;
};

export function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps) {
  const { resetPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>();

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const { success: resetSuccess, error: resetError } = await resetPassword(data.email);

    if (!resetSuccess) {
      setError(translateAuthError(resetError));
    } else {
      setSuccess(true);
    }

    setLoading(false);
  };

  return (
    <Card className="w-full max-w-sm mx-auto border-0 shadow-xl">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-center text-xl font-bold text-gray-900">
          {t('forgot.title')}
        </CardTitle>
        <p className="text-center text-xs text-gray-500">
          {t('forgot.subtitle')}
        </p>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-3 p-2 bg-red-50 border border-red-200 text-red-700 rounded-md text-xs">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-3 p-2 bg-green-50 border border-green-200 text-green-700 rounded-md text-xs">
            {t('forgot.success_message')}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <Input
            label={t('forgot.email')}
            type="email"
            placeholder="tu@ejemplo.com"
            error={errors.email?.message}
            leftIcon={<Mail className="h-3 w-3 text-gray-400" />}
            {...register('email', {
              required: t('validation.email_required'),
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: t('validation.email_invalid'),
              },
            })}
          />
          <Button 
            type="submit" 
            isLoading={loading} 
            className="w-full bg-rose-500 hover:bg-rose-600 text-white h-9 text-sm"
          >
            {t('forgot.send_instructions')}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-4">
        <p className="text-xs text-gray-600">
          {t('forgot.remembered_password')}{' '}
          <button
            type="button"
            onClick={onBack}
            className="text-rose-600 hover:text-rose-800 font-medium transition-colors"
          >
            {t('forgot.back_to_login')}
          </button>
        </p>
      </CardFooter>
    </Card>
  );
} 
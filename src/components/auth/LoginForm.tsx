import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import { Mail, Lock } from 'lucide-react';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { translateAuthError } from '../../lib/authErrors';
import { useTranslation } from 'react-i18next';

type FormData = {
  email: string;
  password: string;
};

interface LoginFormProps {
  onToggleForm: () => void;
}

export function LoginForm({ onToggleForm }: LoginFormProps) {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { t } = useTranslation();
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      
      const { success, error } = await signIn(data.email, data.password);
      
      if (success) {
        navigate('/', { replace: true });
      } else if (error) {
        setErrorMessage(translateAuthError(error));
      }
    } catch (error) {
      setErrorMessage(t('error.unexpected'));
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (showForgotPassword) {
    return <ForgotPasswordForm onBack={() => setShowForgotPassword(false)} />;
  }

  return (
    <Card className="w-full max-w-sm mx-auto border-0 shadow-xl">
      <CardHeader className="space-y-1 pb-3">
        <CardTitle className="text-center text-lg font-bold text-gray-900">
          {t('login.title')}
        </CardTitle>
        <p className="text-center text-xs text-gray-500">
          {t('login.subtitle')}
        </p>
      </CardHeader>
      <CardContent>
        {errorMessage && (
          <div className="mb-3 p-2 bg-red-50 border border-red-200 text-red-700 rounded-md text-xs">
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2.5">
          <Input
            label={t('login.email')}
            type="email"
            placeholder="tu@ejemplo.com"
            error={errors.email?.message}
            leftIcon={<Mail className="h-3 w-3 text-gray-400" />}
            {...register('email', {
              required: t('validation.required'),
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: t('validation.invalid_email'),
              },
            })}
          />
          <Input
            label={t('login.password')}
            type="password"
            placeholder="••••••"
            error={errors.password?.message}
            leftIcon={<Lock className="h-3 w-3 text-gray-400" />}
            {...register('password', {
              required: t('validation.required'),
              minLength: {
                value: 6,
                message: t('validation.min_password'),
              },
            })}
          />
          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              {t('login.forgot_password')}
            </button>
          </div>
          <Button 
            type="submit" 
            isLoading={isLoading} 
            className="w-full bg-rose-500 hover:bg-rose-600 text-white h-9 text-sm mt-3"
          >
            {t('login.sign_in')}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-3">
        <p className="text-xs text-gray-600">
          {t('login.no_account')}{' '}
          <button
            type="button"
            onClick={onToggleForm}
            className="text-rose-600 hover:text-rose-800 font-medium transition-colors"
          >
            {t('login.register')}
          </button>
        </p>
      </CardFooter>
    </Card>
  );
}
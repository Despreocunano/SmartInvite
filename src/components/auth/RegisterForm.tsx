import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import { Mail, Lock, User, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { translateAuthError } from '../../lib/authErrors';
import { trackSignUp } from '../../lib/analytics';
import { CountrySelect } from '../ui/CountrySelect';
import { useTranslation } from 'react-i18next';
import { detectCountryFromURL as detectCountryFromURLUtil, detectLanguageFromCountry } from '../../lib/countryDetection';

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
  groomName: string;
  brideName: string;
  country: string;
  language: string;
};

interface RegisterFormProps {
  onToggleForm: () => void;
}

export function RegisterForm({ onToggleForm }: RegisterFormProps) {
  const { signUp, signIn, session } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const { t, i18n } = useTranslation();

  // Use the utility function for country detection
  const detectCountryFromURL = detectCountryFromURLUtil;

  const detectedCountry = detectCountryFromURL();
  console.log('Setting default country:', detectedCountry);
  
  const { register, handleSubmit, formState: { errors }, watch, setError, clearErrors, setValue } = useForm<FormData>({
    defaultValues: { 
      country: detectedCountry,
      language: i18n.language.startsWith('en') ? 'en' : 'es'
    }
  });
  const password = watch('password');
  const confirmPassword = watch('confirmPassword');
  const currentCountry = watch('country');
  
  console.log('Current country value:', currentCountry);

  // Update language based on detected country
  useEffect(() => {
    const detectedCountry = detectCountryFromURL();
    const detectedLanguage = detectLanguageFromCountry(detectedCountry);
    
    console.log('Detected country for language setting:', detectedCountry);
    console.log('Detected language:', detectedLanguage);
    
    i18n.changeLanguage(detectedLanguage);
    setValue('language', detectedLanguage);
  }, [i18n, setValue]);

  useEffect(() => {
    if (confirmPassword) {
      if (password !== confirmPassword) {
        setError('confirmPassword', {
          type: 'manual',
          message: t('validation.passwords_not_match')
        });
      } else {
        clearErrors('confirmPassword');
      }
    }
  }, [password, confirmPassword, setError, clearErrors, t]);

  const validatePassword = (value: string) => {
    if (!value) return t('validation.password_required');
    if (value.length < 6) return t('validation.password_min_length');
    return true;
  };

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);
      
      const { success, error } = await signUp(data.email, data.password, data.groomName, data.brideName, data.country, i18n.language.substring(0, 2));
      
      if (success) {
        // Intentar hacer login automático después del registro exitoso
        const { success: loginSuccess } = await signIn(data.email, data.password);
        if (loginSuccess) {
          // Navegar directamente sin enviar email de bienvenida
          navigate('/', { replace: true });
          trackSignUp(data.email);
        } else {
          setSuccessMessage(t('success.registration'));
          setTimeout(() => {
            onToggleForm();
          }, 2000);
        }
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

  return (
    <Card className="w-full max-w-sm mx-auto border-0 shadow-xl">
      <div className="flex justify-end p-2">
        <button
          className={`px-2 py-1 text-xs rounded-l ${i18n.language.startsWith('es') ? 'bg-rose-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => i18n.changeLanguage('es')}
        >
          ES
        </button>
        <button
          className={`px-2 py-1 text-xs rounded-r ${i18n.language.startsWith('en') ? 'bg-rose-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => i18n.changeLanguage('en')}
        >
          EN
        </button>
      </div>
      <CardHeader className="space-y-1 pb-3">
        <CardTitle className="text-center text-lg font-bold text-gray-900">
          {t('register.title')}
        </CardTitle>
        <p className="text-center text-xs text-gray-500">
          {t('register.subtitle')}
        </p>
      </CardHeader>
      <CardContent>
        {errorMessage && (
          <div className="mb-3 p-2 bg-red-50 border border-red-200 text-red-700 rounded-md text-xs">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="mb-3 p-2 bg-green-50 border border-green-200 text-green-700 rounded-md text-xs">
            {successMessage}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2.5">
          <div className="grid grid-cols-2 gap-2">
            <Input
              label={t('register.groom')}
              placeholder="Juan"
              error={errors.groomName?.message}
              leftIcon={<User className="h-3 w-3 text-gray-400" />}
              {...register('groomName', {
                required: t('validation.required'),
              })}
            />
            <Input
              label={t('register.bride')}
              placeholder="María"
              error={errors.brideName?.message}
              leftIcon={<User className="h-3 w-3 text-gray-400" />}
              {...register('brideName', {
                required: t('validation.required'),
              })}
            />
          </div>
          <div className="space-y-1">
            <CountrySelect
              id="country"
              label={t('register.country')}
              error={errors.country?.message}
              defaultValue=""
              {...register('country', { required: t('validation.required') })}
            />
            {detectCountryFromURL() && (
              <p className="text-xs text-green-600">
                {t('register.country_detected', 'País detectado automáticamente')}
              </p>
            )}
          </div>
          <Input
            label={t('register.email')}
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
            label={t('register.password')}
            type="password"
            placeholder="••••••"
            error={errors.password?.message}
            leftIcon={<Lock className="h-3 w-3 text-gray-400" />}
            {...register('password', {
              validate: validatePassword
            })}
          />
          <Input
            label={t('register.confirm')}
            type="password"
            placeholder="••••••"
            error={errors.confirmPassword?.message}
            leftIcon={<Lock className="h-3 w-3 text-gray-400" />}
            {...register('confirmPassword', {
              required: t('validation.required')
            })}
          />
          <div className="text-xs text-gray-500 pt-1">
            <p>{t('register.min_password')}</p>
          </div>
          <Button 
            type="submit" 
            isLoading={isLoading} 
            className="w-full bg-rose-500 hover:bg-rose-600 text-white h-9 text-sm mt-3"
          >
            {t('register.create')}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-3">
        <p className="text-xs text-gray-600">
          {t('register.already_account')} {' '}
          <button
            type="button"
            onClick={onToggleForm}
            className="text-rose-600 hover:text-rose-800 font-medium transition-colors"
          >
            {t('register.login')}
          </button>
        </p>
      </CardFooter>
    </Card>
  );
}
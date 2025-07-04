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

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
  groomName: string;
  brideName: string;
  country: string;
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
  
  const { register, handleSubmit, formState: { errors }, watch, setError, clearErrors } = useForm<FormData>();
  const password = watch('password');
  const confirmPassword = watch('confirmPassword');

  useEffect(() => {
    if (confirmPassword) {
      if (password !== confirmPassword) {
        setError('confirmPassword', {
          type: 'manual',
          message: 'Las contraseñas no coinciden'
        });
      } else {
        clearErrors('confirmPassword');
      }
    }
  }, [password, confirmPassword, setError, clearErrors]);

  const validatePassword = (value: string) => {
    if (!value) return 'La contraseña es requerida';
    if (value.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
    return true;
  };

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);
      
      const { success, error } = await signUp(data.email, data.password, data.groomName, data.brideName, data.country);
      
      if (success) {
        // Intentar hacer login automático después del registro exitoso
        const { success: loginSuccess } = await signIn(data.email, data.password);
        if (loginSuccess) {
          // Navegar directamente sin enviar email de bienvenida
          window.scrollTo(0, 0);
          navigate('/', { replace: true });
          trackSignUp(data.email);
        } else {
          setSuccessMessage('¡Registro exitoso! Ahora puedes iniciar sesión.');
          setTimeout(() => {
            onToggleForm();
          }, 2000);
        }
      } else if (error) {
        setErrorMessage(translateAuthError(error));
      }
    } catch (error) {
      setErrorMessage('Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm mx-auto border-0 shadow-xl">
      <CardHeader className="space-y-1 pb-3">
        <CardTitle className="text-center text-lg font-bold text-gray-900">
          Crea tu cuenta
        </CardTitle>
        <p className="text-center text-xs text-gray-500">
          Comienza a crear tu invitación digital
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
              label="Novio"
              placeholder="Juan"
              error={errors.groomName?.message}
              leftIcon={<User className="h-3 w-3 text-gray-400" />}
              {...register('groomName', {
                required: 'Requerido',
              })}
            />
            <Input
              label="Novia"
              placeholder="María"
              error={errors.brideName?.message}
              leftIcon={<User className="h-3 w-3 text-gray-400" />}
              {...register('brideName', {
                required: 'Requerido',
              })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">País</label>
            <select
              {...register('country', { required: 'El país es requerido' })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              defaultValue=""
            >
              <option value="" disabled>Selecciona tu país</option>
              <option value="USA">USA</option>
              <option value="Panama">Panama</option>
              <option value="Mexico">Mexico</option>
            </select>
            {errors.country && (
              <p className="text-xs text-red-500 mt-1">{errors.country.message}</p>
            )}
          </div>
          <Input
            label="Correo electrónico"
            type="email"
            placeholder="tu@ejemplo.com"
            error={errors.email?.message}
            leftIcon={<Mail className="h-3 w-3 text-gray-400" />}
            {...register('email', {
              required: 'Requerido',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Correo inválido',
              },
            })}
          />
          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••"
            error={errors.password?.message}
            leftIcon={<Lock className="h-3 w-3 text-gray-400" />}
            {...register('password', {
              validate: validatePassword
            })}
          />
          <Input
            label="Confirmar"
            type="password"
            placeholder="••••••"
            error={errors.confirmPassword?.message}
            leftIcon={<Lock className="h-3 w-3 text-gray-400" />}
            {...register('confirmPassword', {
              required: 'Requerido'
            })}
          />
          <div className="text-xs text-gray-500 pt-1">
            <p>Mínimo 6 caracteres</p>
          </div>
          <Button 
            type="submit" 
            isLoading={isLoading} 
            className="w-full bg-rose-500 hover:bg-rose-600 text-white h-9 text-sm mt-3"
          >
            Crear cuenta
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-3">
        <p className="text-xs text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <button
            type="button"
            onClick={onToggleForm}
            className="text-rose-600 hover:text-rose-800 font-medium transition-colors"
          >
            Inicia sesión
          </button>
        </p>
      </CardFooter>
    </Card>
  );
}
import { useState, useEffect } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { ResetPasswordForm } from './ResetPasswordForm';
import { Button } from '../ui/Button';
import logoParte from '../../assets/images/logo-parte.svg';

export function AuthPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setShowLogin(searchParams.get('showLogin') === 'true');
    setShowResetPassword(searchParams.get('resetPassword') === 'true');
  }, []);

  const toggleForm = () => {
    setShowLogin(!showLogin);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2D1B69] to-[#E91E63] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => window.location.href = 'https://smartinvite.me'}
          className="absolute top-4 left-4 text-white/90 hover:text-white hover:bg-white/10 rounded-full px-4 transition-all duration-200"
        >
          ← Volver al inicio
        </Button>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center">
              <img 
                src={logoParte} 
                alt="Tu Parte" 
                className="h-12 w-auto filter brightness-0 invert"
              />
            </div>
          </div>

          {showResetPassword ? (
            <ResetPasswordForm />
          ) : showLogin ? (
            <LoginForm onToggleForm={toggleForm} />
          ) : (
            <RegisterForm onToggleForm={toggleForm} />
          )}
        </div>
      </div>
    </div>
  );
}
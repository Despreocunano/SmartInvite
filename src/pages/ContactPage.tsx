import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Button } from '../components/ui/Button';
import { Mail, Phone, MapPin, Send, CheckCircle, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { useTranslation } from 'react-i18next';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export function ContactPage() {
  const { t } = useTranslation('contact');
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t('validation.name_required');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('validation.email_required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('validation.email_invalid');
    }

    if (!formData.subject.trim()) {
      newErrors.subject = t('validation.subject_required');
    }

    if (!formData.message.trim()) {
      newErrors.message = t('validation.message_required');
    } else if (formData.message.length < 10) {
      newErrors.message = t('validation.message_min');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error(t('error.form'));
      return;
    }

    setIsSubmitting(true);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl) {
        throw new Error('VITE_SUPABASE_URL no está configurada');
      }

      // Obtener token de sesión si existe
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Agregar token de autorización si existe
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/contact-form`, {
        method: 'POST',
        headers,
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Error HTTP ${response.status}: ${response.statusText}`);
      }

      if (result.success) {
        setIsSubmitted(true);
        toast.success(t('success_title'));
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        throw new Error(result.error || t('error.send'));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      let errorMessage = t('error.send');
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage = t('error.connection');
        } else if (error.message.includes('VITE_SUPABASE_URL')) {
          errorMessage = t('error.config');
        } else if (error.message.includes('401')) {
          errorMessage = t('error.auth');
        } else {
          errorMessage = error.message;
        }
      }
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <Mail className="h-5 w-5" />,
      title: t('email_label'),
      content: t('email_content'),
      link: 'mailto:contacto@smartinvite.me'
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      title: t('location'),
      content: t('location_content'),
      link: '#'
    }
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="container mx-auto max-w-4xl px-4 py-12">
          <Card className="text-center shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="py-16 px-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t('success_title')}
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                {t('success_body')}
              </p>
              <Button
                onClick={() => setIsSubmitted(false)}
                variant="primary"
                size="lg"
                className='bg-primary text-primary-contrast hover:bg-primary-dark px-8'
              >
                {t('send_another')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Información de contacto */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-gray-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {t('title')}
                </h2>
              </div>
              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <div key={index} className="group">
                    <a
                      href={info.link}
                      className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-all duration-300"
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 group-hover:bg-gray-200 transition-colors">
                        {info.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{info.title}</h3>
                        <p className="text-gray-600 text-sm">{info.content}</p>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-600 to-gray-700 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden z-0">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
              <div className="relative z-10">
                <h3 className="font-bold text-2xl mb-4">
                  {t('why_us_title')}
                </h3>
                <ul className="space-y-3 text-gray-100">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-white rounded-full mr-3 flex-shrink-0"></span>
                    <span>{t('why_us_1')}</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-white rounded-full mr-3 flex-shrink-0"></span>
                    <span>{t('why_us_2')}</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-white rounded-full mr-3 flex-shrink-0"></span>
                    <span>{t('why_us_3')}</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-white rounded-full mr-3 flex-shrink-0"></span>
                    <span>{t('why_us_4')}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* Formulario de contacto */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200">
            <CardHeader className="pb-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Send className="h-5 w-5 text-gray-600" />
                </div>
                <CardTitle className="text-2xl text-gray-900">{t('send_message_title')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    label={t('name')}
                    placeholder={t('name_placeholder')}
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    error={errors.name}
                    required
                  />
                  <Input
                    label={t('email')}
                    type="email"
                    placeholder={t('email_placeholder')}
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    error={errors.email}
                    required
                  />
                </div>
                <Input
                  label={t('subject')}
                  placeholder={t('subject_placeholder')}
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  error={errors.subject}
                  required
                />
                <Textarea
                  label={t('message')}
                  placeholder={t('message_placeholder')}
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  error={errors.message}
                  showCharacterCount
                  maxLength={500}
                  rows={6}
                  required
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isSubmitting}
                  leftIcon={<Send className="h-4 w-4" />}
                  className="w-full h-14 text-lg bg-primary text-primary-contrast hover:bg-primary-dark shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isSubmitting ? t('sending') : t('send')}
                </Button>
              </form>
            </CardContent>
          </div>
        </div>
      </div>
    </div>
  );
} 
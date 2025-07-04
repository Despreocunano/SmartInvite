import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Button } from '../components/ui/Button';
import { Mail, Phone, MapPin, Send, CheckCircle, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

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
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'El asunto es requerido';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'El mensaje es requerido';
    } else if (formData.message.length < 10) {
      newErrors.message = 'El mensaje debe tener al menos 10 caracteres';
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
      toast.error('Por favor, corrige los errores en el formulario');
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
        toast.success('¡Mensaje enviado con éxito! Te responderemos pronto.');
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        throw new Error(result.error || 'Error al enviar el mensaje');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Mostrar error más específico
      let errorMessage = 'Error al enviar el mensaje. Por favor, intenta nuevamente.';
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Error de conexión. Verifica tu conexión a internet.';
        } else if (error.message.includes('VITE_SUPABASE_URL')) {
          errorMessage = 'Error de configuración. Contacta al administrador.';
        } else if (error.message.includes('401')) {
          errorMessage = 'Error de autenticación. La función requiere configuración adicional.';
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
      title: 'Email',
      content: 'contacto@tuparte.digital',
      link: 'mailto:contacto@tuparte.digital'
    }
    //,
    //{
       //icon: <Phone className="h-5 w-5" />,
       //title: 'WhatsApp',
       //content: '+56 9 1234 5678',
       //link: 'https://wa.me/56912345678'
     //},
     ,
    {
      icon: <MapPin className="h-5 w-5" />,
      title: 'Ubicación',
      content: 'Santiago, Chile',
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
                ¡Mensaje enviado con éxito!
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                Gracias por contactarnos. Te responderemos lo antes posible, generalmente en menos de 24 horas.
              </p>
              <Button
                onClick={() => setIsSubmitted(false)}
                variant="primary"
                size="lg"
                className='bg-primary text-primary-contrast hover:bg-primary-dark px-8'
              >
                Enviar otro mensaje
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
                  Información de Contacto
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
                  ¿Por qué elegirnos?
                </h3>
                <ul className="space-y-3 text-gray-100">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-white rounded-full mr-3 flex-shrink-0"></span>
                    <span>Invitaciones digitales personalizadas y únicas</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-white rounded-full mr-3 flex-shrink-0"></span>
                    <span>Gestión completa de invitados y confirmaciones</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-white rounded-full mr-3 flex-shrink-0"></span>
                    <span>Soporte técnico especializado 24/7</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-white rounded-full mr-3 flex-shrink-0"></span>
                    <span>Respuesta rápida en menos de 24 horas</span>
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
                <CardTitle className="text-2xl text-gray-900">Envíanos un mensaje</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    label="Nombre completo"
                    placeholder="Tu nombre"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    error={errors.name}
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    error={errors.email}
                    required
                  />
                </div>

                <Input
                  label="Asunto"
                  placeholder="¿En qué podemos ayudarte?"
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  error={errors.subject}
                  required
                />

                <Textarea
                  label="Mensaje"
                  placeholder="Cuéntanos más detalles sobre tu proyecto o consulta..."
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
                  {isSubmitting ? 'Enviando mensaje...' : 'Enviar mensaje'}
                </Button>
              </form>
            </CardContent>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-gray-200">
          <p className="text-gray-600">
            © 2024 Parte Digital. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
} 
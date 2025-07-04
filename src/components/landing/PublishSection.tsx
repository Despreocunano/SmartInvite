import React, { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { TicketPlus, Globe, EyeOff, Copy, Check, Share2, Eye, Link2, CreditCard, Clock, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { createPayment, checkPaymentStatus, checkExistingPayment } from '../../lib/payment';
import { Modal } from '../ui/Modal';
import { trackBeginCheckout, trackPurchase } from '../../lib/analytics';
import { openPaymentWindow } from '../../lib/utils';
import { useTranslation } from 'react-i18next';

interface PublishSectionProps {
  previewUrl: string;
  publishedUrl: string | null;
  publishedStatus: {
    isPublished: boolean;
    slug: string | null;
  };
  isPublishing: boolean;
  onPublish: () => void;
  onUnpublish: () => void;
  hasRequiredInfo?: boolean;
  isLoading?: boolean;
}

// Skeleton component for loading state
const PublishSectionSkeleton = () => (
  <Card className="overflow-hidden">
    <CardContent className="p-0">
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
        {/* Vista Previa Skeleton */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-5 bg-gray-200 rounded animate-pulse w-24"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="h-10 bg-gray-200 rounded animate-pulse w-full md:flex-1"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse w-full md:flex-1"></div>
          </div>
        </div>

        {/* Compartir Skeleton */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-5 bg-gray-200 rounded animate-pulse w-28"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-36"></div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-10 bg-gray-200 rounded animate-pulse w-full"></div>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse flex-1"></div>
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export function PublishSection({
  previewUrl,
  publishedUrl,
  publishedStatus,
  isPublishing,
  onPublish,
  onUnpublish,
  hasRequiredInfo = true,
  isLoading = false
}: PublishSectionProps) {
  const [copied, setCopied] = React.useState(false);
  const [showQR, setShowQR] = React.useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = React.useState(false);
  const [paymentStatus, setPaymentStatus] = React.useState<string | null>(null);
  const [preferenceId, setPreferenceId] = React.useState<string | null>(null);
  const [paymentUrl, setPaymentUrl] = React.useState<string | null>(null);
  const [hasAlreadyPaid, setHasAlreadyPaid] = React.useState<boolean>(false);
  const [checkAttempts, setCheckAttempts] = React.useState(0);
  const maxCheckAttempts = 12; // Máximo 1 minuto de verificación (12 * 5 segundos)
  const { t } = useTranslation('landing');

  const handleCopy = async () => {
    if (!publishedUrl) return;

    try {
      await navigator.clipboard.writeText(publishedUrl);
      setCopied(true);
      toast.success(t('share_copy_success'));
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error(t('share_copy_error'));
    }
  };

  const handleShare = async (platform: 'whatsapp' | 'copy') => {
    if (!publishedUrl) return;

    const text = `¡Te invitamos a nuestra boda! 💍\n\nPuedes confirmar tu asistencia en:`;
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(publishedUrl);

    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodedText}%0A${encodedUrl}`, '_blank');
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(publishedUrl);
          setCopied(true);
          toast.success(t('share_copy_success'));
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          toast.error(t('share_copy_error'));
        }
        break;
    }
  };

  const handleStartPayment = async () => {
    if (!hasRequiredInfo) {
      toast.error('Por favor completa la información requerida antes de publicar');
      return;
    }

    setIsProcessingPayment(true);
    try {
      const result = await createPayment();
      if (result.success) {
        if (result.alreadyPaid) {
          setHasAlreadyPaid(true);
          toast.success('Ya tienes un pago aprobado. Tu invitación será publicada.');
          onPublish(); // Trigger the publish action
          return;
        }
        
        // Track begin checkout event
        trackBeginCheckout();
        
        setPreferenceId(result.preferenceId);
        setPaymentUrl(result.initPoint);
        setShowPaymentModal(true);
      } else if (result.alreadyPublished) {
        toast.success('Tu invitación ya está publicada');
        // Refresh the page to show the published status
        window.location.reload();
      } else {
        toast.error(result.error || 'Error al procesar el pago');
      }
    } catch (error) {
      console.error('Error starting payment:', error);
      toast.error('Error al iniciar el proceso de pago');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const checkStatus = async (isManualCheck = false) => {
    if (!preferenceId) return;
    
    // If this is a manual check after timeout, reset the attempts
    if (isManualCheck && (paymentStatus === 'timeout' || paymentStatus === 'failed')) {
      setCheckAttempts(0);
    }
    
    // Increment check attempts
    setCheckAttempts(prev => prev + 1);
    
    try {
      setPaymentStatus('checking');
      const result = await checkPaymentStatus(preferenceId);
      
      if (result.success) {
        if (result.landingPage.isPublished) {
          // Track successful purchase
          trackPurchase(preferenceId);
          
          setPaymentStatus('success');
          setHasAlreadyPaid(true);
          toast.success('¡Pago completado! Tu invitación ha sido publicada');
          // Close modal and reload page after a short delay
          setTimeout(() => {
            setShowPaymentModal(false);
            window.location.reload();
          }, 1500);
        } else if (result.payment.status === 'approved') {
          setPaymentStatus('processing');
          setHasAlreadyPaid(true);
          toast.success('Pago aprobado, publicando invitación...');
          // Trigger the publish action
          onPublish();
          // Check again in 3 seconds
          setTimeout(() => checkStatus(), 3000);
        } else if (result.payment.status === 'pending') {
          setPaymentStatus('pending');
          toast('Pago pendiente de confirmación', {
            icon: '⏳',
          });
        } else if (result.payment.status === 'rejected' || result.payment.status === 'cancelled') {
          setPaymentStatus('failed');
          toast.error('El pago fue rechazado o cancelado');
          // Stop checking for rejected payments - clear any pending intervals
          return;
        } else {
          setPaymentStatus('failed');
          toast.error('El pago no fue completado');
        }
      } else {
        setPaymentStatus('failed');
        toast.error(result.error || 'Error al verificar el estado del pago');
      }
    } catch (error) {
      console.error('💥 Error checking payment status:', error);
      setPaymentStatus('failed');
      toast.error('Error al verificar el estado del pago');
    }
  };

  const handleManualCheck = () => {
    checkStatus(true);
  };

  // Check if user has already paid when component mounts
  React.useEffect(() => {
    const checkPaymentHistory = async () => {
      try {
        const result = await checkExistingPayment();
        if (result.success && result.alreadyPaid) {
          setHasAlreadyPaid(true);
        }
      } catch (error) {
        console.error('Error checking payment history:', error);
      }
    };
    
    checkPaymentHistory();
  }, []);

  // Handle payment modal and automatic status checking
  React.useEffect(() => {
    if (showPaymentModal && preferenceId && paymentStatus && paymentStatus !== null) {
      // Only start checking after user has initiated payment (paymentStatus is not null)
      // Reset check attempts when payment is initiated
      setCheckAttempts(0);
      
      // Set up interval to check payment status every 5 seconds
      const interval = setInterval(() => {
        // Stop checking if we've reached max attempts
        if (checkAttempts >= maxCheckAttempts) {
          clearInterval(interval);
          setPaymentStatus('timeout');
          toast.error('Tiempo de verificación agotado. Por favor verifica manualmente.');
          return;
        }
        
        // Don't check if payment status is already failed or timeout
        if (paymentStatus === 'failed' || paymentStatus === 'timeout') {
          clearInterval(interval);
          return;
        }
        
        checkStatus();
      }, 5000);
      
      // Listen for window focus events (when user returns from Stripe)
      const handleFocus = () => {
        if (showPaymentModal && preferenceId && paymentStatus !== 'failed' && paymentStatus !== 'timeout') {
          // Check status immediately when user returns
          checkStatus();
        }
      };

      window.addEventListener('focus', handleFocus);

      return () => {
        clearInterval(interval);
        window.removeEventListener('focus', handleFocus);
      };
    } else if (!showPaymentModal) {
      // Reset check attempts when modal closes
      setCheckAttempts(0);
    }
  }, [showPaymentModal, preferenceId, checkAttempts, paymentStatus]);

  // Restart automatic checking when user manually checks after timeout
  React.useEffect(() => {
    if (showPaymentModal && preferenceId && paymentStatus === 'initiated' && checkAttempts === 0) {
      // If user manually checked after timeout and reset attempts, restart automatic checking
      
      const interval = setInterval(() => {
        if (checkAttempts >= maxCheckAttempts) {
          clearInterval(interval);
          setPaymentStatus('timeout');
          toast.error('Tiempo de verificación agotado. Por favor verifica manualmente.');
          return;
        }
        
        checkStatus();
      }, 5000);
      
      const handleFocus = () => {
        if (showPaymentModal && preferenceId) {
          checkStatus();
        }
      };

      window.addEventListener('focus', handleFocus);

      return () => {
        clearInterval(interval);
        window.removeEventListener('focus', handleFocus);
      };
    }
  }, [showPaymentModal, preferenceId, paymentStatus, checkAttempts]);

  return (
    <>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <PublishSectionSkeleton />
          ) : !hasRequiredInfo ? (
            <div className="p-2 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mx-auto">
                <TicketPlus className="w-8 h-8 text-rose-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-medium text-gray-900">{t('intro_title')}</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  {t('intro_subtitle')}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
              {/* Vista Previa */}
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center">
                    <Eye className="w-5 h-5 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{t('preview_title')}</h3>
                    <p className="text-sm text-gray-500">
                      {t('preview_subtitle')}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => window.open(previewUrl, '_blank')}
                    className="w-full md:flex-1 border border-primary text-primary hover:bg-primary-dark hover:text-primary-contrast"
                    leftIcon={<Eye className="h-4 w-4" />}
                    disabled={!hasRequiredInfo}
                  >
                    {t('preview_button')}
                  </Button>
                  {!publishedStatus.isPublished ? (
                    <Button
                      type="button"
                      onClick={handleStartPayment}
                      disabled={isProcessingPayment || !hasRequiredInfo}
                      className="flex-1 bg-primary hover:bg-primary-dark text-primary-contrast"
                      leftIcon={hasAlreadyPaid ? <Globe className="h-4 w-4" /> : <CreditCard className="h-4 w-4" />}
                    >
                      {isProcessingPayment ? t('processing_button') : t('publish_button')}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={onUnpublish}
                      variant="secondary"
                      className="flex-1 border border-primary bg-primary hover:bg-primary-dark text-primary-contrast"
                      leftIcon={<EyeOff className="h-4 w-4" />}
                    >
                      {t('unpublish_button')}
                    </Button>
                  )}
                </div>
              </div>

              {/* Compartir */}
              {publishedStatus.isPublished && publishedUrl && (
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                      <Share2 className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{t('share_title')}</h3>
                      <p className="text-sm text-gray-500">
                        {t('share_subtitle')}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Botón WhatsApp de ancho completo */}
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => handleShare('whatsapp')}
                      className="w-full border border-primary text-primary hover:bg-primary-dark hover:text-primary-contrast text-sm"
                      leftIcon={<Share2 className="h-4 w-4" />}
                    >
                      {t('share_whatsapp')}
                    </Button>

                    {/* Enlace con botón de copiar */}
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Link2 className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600 flex-1 truncate">{publishedUrl}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleShare('copy')}
                        className="shrink-0"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Publica tu invitación digital"
        panelClassName="sm:max-w-md"
      >
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col items-center">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-gray-700 font-medium text-lg">Pago online</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl font-bold text-gray-900">$39.990</span>
              <span className="text-xs text-gray-500">CLP</span>
            </div>
            <p className="text-sm text-gray-500 text-center">
              Pago único para publicar tu invitación digital y compartirla con tus invitados.
            </p>
          </div>

          {paymentStatus === null && (
            <>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Para publicar tu invitación, completa el pago con tarjeta bancaria:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>Pago único (no hay cargos recurrentes)</li>
                  <li>Pago seguro a través de tu banco</li>
                  <li>Puedes pagar con tarjeta de crédito o débito</li>
                </ul>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => {
                    if (paymentUrl) {
                      setPaymentStatus('initiated');
                      openPaymentWindow(
                        paymentUrl,
                        () => toast.success('Ventana de pago abierta. Completa el pago y regresa aquí.'),
                        () => toast.success('Redirigiendo a Stripe...'),
                        () => toast.error('El navegador bloqueó la ventana de pago. Por favor, permite popups e intenta nuevamente.')
                      );
                    }
                  }}
                  className="bg-[#635bff] hover:bg-[#5546d6] text-white"
                  disabled={!paymentUrl}
                >
                  Pagar
                </Button>
                <Button
                className='bg-primary text-primary-contrast hover:bg-primary-dark'
                  onClick={() => {
                    setPaymentStatus('initiated');
                    handleManualCheck();
                  }}
                  disabled={!preferenceId}
                >
                  Ya realicé el pago
                </Button>
              </div>
            </>
          )}

          {paymentStatus === 'checking' && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-rose-600 mx-auto mb-4"></div>
              <p className="text-gray-700">Verificando el estado del pago...</p>
            </div>
          )}

          {paymentStatus === 'initiated' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Pago iniciado</h3>
              <p className="text-gray-600 mb-4">
                Estamos verificando automáticamente el estado de tu pago. Si ya completaste el pago, se detectará en unos momentos.
              </p>
              <Button
                variant="secondary"
                onClick={handleManualCheck}
                disabled={!preferenceId}
              >
                Verificar manualmente
              </Button>
            </div>
          )}

          {paymentStatus === 'success' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">¡Pago completado!</h3>
              <p className="text-gray-600 mb-4">
                Tu invitación ha sido publicada correctamente.
              </p>
              <Button
                onClick={() => {
                  setShowPaymentModal(false);
                  window.location.reload();
                }}
              >
                Continuar
              </Button>
            </div>
          )}

          {paymentStatus === 'processing' && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-rose-600 mx-auto mb-4"></div>
              <p className="text-gray-700">
                Pago aprobado, estamos publicando tu invitación...
              </p>
            </div>
          )}

          {paymentStatus === 'pending' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Pago pendiente</h3>
              <p className="text-gray-600 mb-4">
                Tu pago está siendo procesado. Una vez confirmado, tu invitación será publicada automáticamente.
              </p>
              <Button
                onClick={() => {
                  setShowPaymentModal(false);
                }}
              >
                Entendido
              </Button>
            </div>
          )}

          {paymentStatus === 'failed' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Pago no completado</h3>
              <p className="text-gray-600 mb-4">
                Hubo un problema con tu pago. Por favor intenta nuevamente.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setPaymentStatus(null);
                  }}
                >
                  Volver
                </Button>
                <Button
                  onClick={() => {
                    setPaymentStatus('initiated');
                    if (paymentUrl) {
                      openPaymentWindow(
                        paymentUrl,
                        () => toast.success('Ventana de pago abierta. Completa el pago y regresa aquí.'),
                        () => toast.success('Redirigiendo a Stripe...'),
                        () => toast.error('El navegador bloqueó la ventana de pago. Por favor, permite popups e intenta nuevamente.')
                      );
                    }
                  }}
                  className="bg-[#635bff] hover:bg-[#5546d6] text-white"
                  disabled={!paymentUrl}
                >
                  Reintentar pago
                </Button>
              </div>
            </div>
          )}

          {paymentStatus === 'timeout' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Tiempo de verificación agotado</h3>
              <p className="text-gray-600 mb-4">
                No pudimos verificar automáticamente tu pago. Si ya realizaste el pago, puedes verificarlo manualmente.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setPaymentStatus(null);
                    setCheckAttempts(0);
                  }}
                >
                  Volver
                </Button>
                <Button
                  onClick={handleManualCheck}
                  disabled={!preferenceId}
                >
                  Verificar manualmente
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
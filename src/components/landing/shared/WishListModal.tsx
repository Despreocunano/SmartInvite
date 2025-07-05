import { useState } from 'react';
import { Gift, X, Heart, Home, Plane, Umbrella, Utensils, CreditCard, Check, Clock, PawPrint, Building2, GraduationCap, Baby, Users, TreePine, Stethoscope, Car, BookOpen, Camera, Music } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { createGiftPayment, checkGiftPaymentStatus } from '../../../lib/giftPayment';
import { openPaymentWindow } from '../../../lib/utils';

export interface WishListItem {
  id?: string;
  name: string;
  price?: number;
  icon: string;
  paid?: boolean;
  payment_status?: 'pending' | 'approved' | 'rejected' | 'cancelled';
}

interface WishListModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishListItems: WishListItem[];
  className?: string;
  isDemo?: boolean;
}

const ICON_MAP = {
  gift: Gift,
  heart: Heart,
  home: Home,
  plane: Plane,
  vacation: Umbrella,
  dinner: Utensils,
  pets: PawPrint,
  hospital: Building2,
  education: GraduationCap,
  children: Baby,
  community: Users,
  environment: TreePine,
  health: Stethoscope,
  transport: Car,
  books: BookOpen,
  photography: Camera,
  music: Music,
};

export function WishListModal({ isOpen, onClose, wishListItems, className = '', isDemo = false }: WishListModalProps) {
  const { t } = useTranslation('templates');
  const [processingPayment, setProcessingPayment] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<Record<string, string>>({});
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleGiftPayment = async (item: WishListItem) => {
    if (!item.id || !item.price) {
      toast.error(t('gifts.wishlist.payment_errors.no_price'));
      return;
    }
    if (!buyerName.trim() || !buyerEmail.trim()) {
      setFormError(t('gifts.wishlist.payment_errors.missing_info'));
      return;
    }
    if (!validateEmail(buyerEmail)) {
      setFormError(t('gifts.wishlist.payment_errors.invalid_email'));
      return;
    }
    setFormError(null);
    if (item.paid) {
      return;
    }
    setProcessingPayment(item.id);
    setPaymentStatus(prev => ({ ...prev, [item.id!]: 'initiating' }));
    try {
      // Obtener la URL actual para el retorno
      const returnUrl = window.location.href;
      const result = await createGiftPayment(item.id, item.price, buyerEmail, buyerName, returnUrl);
      if (result.success) {
        setPaymentStatus(prev => ({ ...prev, [item.id!]: 'initiated' }));
        if (result.initPoint) {
          openPaymentWindow(
            result.initPoint,
            () => toast.success(t('gifts.wishlist.payment_errors.popup_opened')),
            () => toast.success(t('gifts.wishlist.payment_errors.redirecting')),
            () => toast.error(t('gifts.wishlist.payment_errors.popup_blocked'))
          );
        }
        startPaymentVerification(item.id!, result.preferenceId);
              } else {
          setPaymentStatus(prev => ({ ...prev, [item.id!]: 'failed' }));
          toast.error(result.error || t('gifts.wishlist.payment_errors.processing_error'));
        }
      } catch (error) {
        setPaymentStatus(prev => ({ ...prev, [item.id!]: 'failed' }));
        toast.error(t('gifts.wishlist.payment_errors.init_error'));
      } finally {
      setProcessingPayment(null);
    }
  };

  const startPaymentVerification = async (itemId: string, preferenceId: string) => {
    let attempts = 0;
    const maxAttempts = 12; // 1 minuto (12 * 5 segundos)
    
    const checkStatus = async () => {
      attempts++;
      
      try {
        const result = await checkGiftPaymentStatus(preferenceId);
        
        if (result.success) {
          if (result.payment.status === 'approved') {
            setPaymentStatus(prev => ({ ...prev, [itemId]: 'success' }));
            toast.success(t('gifts.wishlist.payment_errors.payment_completed'));
            // Recargar la página para actualizar el estado
            setTimeout(() => window.location.reload(), 1500);
            return;
          } else if (result.payment.status === 'pending') {
            setPaymentStatus(prev => ({ ...prev, [itemId]: 'pending' }));
            if (attempts < maxAttempts) {
              setTimeout(checkStatus, 5000);
            } else {
              setPaymentStatus(prev => ({ ...prev, [itemId]: 'timeout' }));
            }
          } else if (result.payment.status === 'rejected' || result.payment.status === 'cancelled') {
            setPaymentStatus(prev => ({ ...prev, [itemId]: 'failed' }));
          }
        } else {
          setPaymentStatus(prev => ({ ...prev, [itemId]: 'failed' }));
        }
      } catch (error) {
        if (attempts < maxAttempts) {
          setTimeout(checkStatus, 5000);
        } else {
          setPaymentStatus(prev => ({ ...prev, [itemId]: 'timeout' }));
        }
      }
    };
    
    // Verificar inmediatamente y luego cada 5 segundos
    checkStatus();
  };

  const handleManualCheck = async (itemId: string, preferenceId: string) => {
    setPaymentStatus(prev => ({ ...prev, [itemId]: 'checking' }));
    
    try {
      const result = await checkGiftPaymentStatus(preferenceId);
      
      if (result.success && result.payment.status === 'approved') {
        setPaymentStatus(prev => ({ ...prev, [itemId]: 'success' }));
        toast.success(t('gifts.wishlist.payment_errors.payment_marked'));
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setPaymentStatus(prev => ({ ...prev, [itemId]: 'failed' }));
        toast.error(t('gifts.wishlist.payment_errors.payment_not_completed'));
      }
    } catch (error) {
      setPaymentStatus(prev => ({ ...prev, [itemId]: 'failed' }));
      toast.error(t('gifts.wishlist.payment_errors.verification_error'));
    }
  };

  const formatPrice = (price?: number) => {
    if (!price) return '';
    return `$${price.toLocaleString('es-CL')}`;
  };

  const getIconComponent = (iconName: string) => {
    const IconComponent = ICON_MAP[iconName as keyof typeof ICON_MAP] || Gift;
    return <IconComponent size={16} />;
  };

  const getPaymentButton = (item: WishListItem) => {
    if (!item.id || !item.price) return null;
    
    const status = paymentStatus[item.id];
    
    // Si ya está pagado, mostrar solo el estado visual
    if (item.paid) {
      return (
        <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg">
          <Check className="h-4 w-4" />
          <span className="text-sm font-medium">{t('gifts.wishlist.gifted')}</span>
        </div>
      );
    }
    
    // En modo demo, mostrar botón deshabilitado
    if (isDemo) {
      return (
        <div className="flex items-center gap-2 text-gray-400 bg-gray-100 px-3 py-2 rounded-lg cursor-not-allowed">
          <CreditCard className="h-4 w-4" />
          <span className="text-sm font-medium">{t('gifts.wishlist.example')}</span>
        </div>
      );
    }
    
    if (status === 'initiating' || processingPayment === item.id) {
      return (
        <div className="flex items-center gap-2 text-blue-600">
          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-600"></div>
          <span className="text-sm">{t('gifts.wishlist.processing')}</span>
        </div>
      );
    }
    
    if (status === 'initiated' || status === 'pending') {
      return (
        <div className="flex items-center gap-2 text-yellow-600">
          <Clock className="h-4 w-4" />
          <span className="text-sm">{t('gifts.wishlist.pending')}</span>
        </div>
      );
    }
    
    if (status === 'success') {
      return (
        <div className="flex items-center gap-2 text-green-600">
          <Check className="h-4 w-4" />
          <span className="text-sm font-medium">{t('gifts.wishlist.sent')}</span>
        </div>
      );
    }
    
    if (status === 'failed' || status === 'timeout') {
      return (
        <button
          onClick={() => handleGiftPayment(item)}
          className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
        >
          {t('gifts.wishlist.retry')}
        </button>
      );
    }
    
    return (
      <button
        onClick={() => handleGiftPayment(item)}
        className="px-3 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium flex items-center gap-2"
      >
        <CreditCard className="h-4 w-4" />
        {t('gifts.wishlist.gift')}
      </button>
    );
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${className}`}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden font-sans flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
              <Gift className="h-4 w-4 text-slate-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 font-sans">{t('gifts.wishlist.modal_title')}</h2>
              <p className="text-xs text-gray-500 font-sans">{t('gifts.wishlist.modal_subtitle')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="h-3 w-3 text-gray-600" />
          </button>
        </div>

        {/* Content con sticky y lista ordenada */}
        <div className="flex-1 min-h-0 flex flex-col">
          {/* Sticky datos del comprador */}
          <div className="bg-white z-10 sticky top-0 pt-4 pb-2 px-4">
          {!isDemo && (
            <>
              <div className="mb-2 flex gap-2">
                <input
                  type="text"
                  className="w-1/2 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-200"
                  placeholder={t('gifts.wishlist.name_placeholder')}
                  value={buyerName}
                  onChange={e => setBuyerName(e.target.value)}
                  disabled={processingPayment !== null}
                />
                <input
                  type="email"
                  className="w-1/2 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-200"
                  placeholder={t('gifts.wishlist.email_placeholder')}
                  value={buyerEmail}
                  onChange={e => setBuyerEmail(e.target.value)}
                  disabled={processingPayment !== null}
                />
              </div>
              <p className="text-xs text-gray-500 mb-2">{t('gifts.wishlist.privacy_notice')}</p>
              {formError && <p className="text-xs text-red-600 mb-2">{formError}</p>}
            </>
          )}
          {isDemo && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-700 font-medium">{t('gifts.wishlist.demo_notice')}</p>
            </div>
          )}
          </div>
          {/* Lista de regalos scrolleable y ordenada */}
          <div className="flex-1 min-h-0 overflow-y-auto grid gap-3 px-2 sm:px-4">
          {wishListItems.length === 0 ? (
            <div className="text-center py-8">
              <Gift className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-medium text-gray-900 mb-1 font-sans">{t('gifts.wishlist.no_gifts_title')}</h3>
              <p className="text-sm text-gray-500 font-sans">{t('gifts.wishlist.no_gifts_subtitle')}</p>
            </div>
          ) : (
              // Ordenar: disponibles para pago primero, luego pagados, y por precio ascendente
              [...wishListItems]
                .sort((a, b) => {
                  if (!!a.paid === !!b.paid) {
                    // Ambos pagados o ambos no pagados: ordenar por precio ascendente
                    return (a.price || 0) - (b.price || 0);
                  }
                  // No pagados primero
                  return a.paid ? 1 : -1;
                })
                .map((item, index) => (
                <div
                  key={index}
                  className={`bg-gray-50 rounded-lg p-3 border transition-all ${
                    item.paid ? 'border-green-200 bg-green-50' : 'border-gray-200 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 sm:gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        item.paid ? 'bg-green-100' : 'bg-rose-100'
                      }`}>
                        {getIconComponent(item.icon)}
                      </div>
                      <div className="min-w-0 flex-1">
                          <h3 className={`font-medium text-xs sm:text-sm font-sans truncate ${
                          item.paid ? 'text-green-800 line-through' : 'text-gray-900'
                        }`}>
                          {item.name}
                        </h3>
                        {item.price && (
                          <p className={`text-sm font-medium font-sans ${
                            item.paid ? 'text-green-600' : 'text-gray-600'
                          }`}>
                            {formatPrice(item.price)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      {getPaymentButton(item)}
                    </div>
                  </div>
                </div>
                ))
            )}
            </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <p className="text-xs text-gray-600 text-center font-sans leading-relaxed">
            {t('gifts.wishlist.footer_message')}
          </p>
        </div>
      </div>
    </div>
  );
} 
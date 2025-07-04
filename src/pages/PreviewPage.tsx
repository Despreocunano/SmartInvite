import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { getTemplate } from '../components/landing/templates';
import { TemplateProps } from '../components/landing/templates/types';
import { toast } from 'react-hot-toast';

interface LandingPageData {
  id: string;
  user_id: string;
  groom_name: string;
  bride_name: string;
  wedding_date: string;
  welcome_message: string;
  ceremony_date: string;
  ceremony_location: string;
  ceremony_time: string;
  ceremony_address: string;
  party_date: string;
  party_location: string;
  party_time: string;
  party_address: string;
  music_enabled: boolean;
  selected_track: string;
  template_id: string;
  dress_code: string;
  additional_info: string;
  accepts_kids: boolean;
  accepts_pets: boolean;
  cover_image?: string;
  gallery_images?: any[];
  bank_info?: {
    accountHolder: string;
    rut: string;
    bank: string;
    accountType: string;
    accountNumber: string;
    email: string;
  };
  hashtag: string;
  couple_code: string;
  store: string;
  wish_list_enabled: boolean;
  bank_info_enabled: boolean;
  couple_code_enabled: boolean;
}

export function PreviewPage() {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [landingData, setLandingData] = useState<LandingPageData | null>(null);
  const [wishListItems, setWishListItems] = useState<Array<{
    id: string;
    name: string;
    price?: number;
    icon: string;
    paid: boolean;
    payment_status: string;
  }>>([]);
  const [error, setError] = useState<string | null>(null);

  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If user is trying to access someone else's preview
  if (user.id !== userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h1>
          <p className="text-gray-600">No tienes permiso para ver esta página</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userId) {
          throw new Error('User ID is required');
        }

        const { data, error } = await supabase
          .from('landing_pages')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (error) throw error;
        if (!data) throw new Error('No landing page found');

        setLandingData(data);

        // Fetch wish list items if wish list is enabled
        if (data.wish_list_enabled) {
          const { data: wishListData, error: wishListError } = await supabase
            .from('wish_list_items')
            .select('id, name, price, icon, paid, payment_status')
            .eq('user_id', data.user_id);

          if (!wishListError && wishListData) {
            const mappedItems = wishListData.map(item => ({
              id: item.id,
              name: item.name,
              price: item.price ?? undefined,
              icon: item.icon || 'gift',
              paid: item.paid,
              payment_status: item.payment_status,
            }));
            setWishListItems(mappedItems);
          }
        }
      } catch (error) {
        setError('Error loading preview');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // Efecto para manejar parámetros de URL de pago
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    const itemId = urlParams.get('item_id');
    const type = urlParams.get('type');

    if (paymentStatus && itemId && type === 'gift') {
      // Limpiar los parámetros de URL
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('payment');
      newUrl.searchParams.delete('item_id');
      newUrl.searchParams.delete('type');
      window.history.replaceState({}, '', newUrl.toString());

      // Mostrar mensaje según el estado del pago
      if (paymentStatus === 'success') {
        toast.success('¡Pago completado exitosamente! El regalo ha sido enviado.');
        // Recargar los wish list items para mostrar el estado actualizado
        if (landingData?.wish_list_enabled) {
          const refreshWishList = async () => {
            const { data: wishListData, error: wishListError } = await supabase
              .from('wish_list_items')
              .select('id, name, price, icon, paid, payment_status')
              .eq('user_id', landingData.user_id);

            if (!wishListError && wishListData) {
              const mappedItems = wishListData.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price ?? undefined,
                icon: item.icon || 'gift',
                paid: item.paid,
                payment_status: item.payment_status,
              }));
              setWishListItems(mappedItems);
            }
          };
          refreshWishList();
        }
      } else if (paymentStatus === 'cancelled') {
        toast.error('El pago fue cancelado. Puedes intentar nuevamente cuando lo desees.');
      }
    }
  }, [landingData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  if (error || !landingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600">{error || 'Preview not found'}</p>
        </div>
      </div>
    );
  }

  const template = getTemplate(landingData.template_id);
  
  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Template no encontrado</h1>
          <p className="text-gray-600">El template seleccionado no está disponible</p>
        </div>
      </div>
    );
  }

  const TemplateComponent = template.component;

  const templateProps: TemplateProps = {
    groomName: landingData.groom_name,
    brideName: landingData.bride_name,
    weddingDate: landingData.wedding_date,
    welcomeMessage: landingData.welcome_message,
    hashtag: landingData.hashtag,
    ceremonyDate: landingData.ceremony_date,
    ceremonyTime: landingData.ceremony_time,
    ceremonyLocation: landingData.ceremony_location,
    ceremonyAddress: landingData.ceremony_address,
    partyDate: landingData.party_date,
    partyTime: landingData.party_time,
    partyLocation: landingData.party_location,
    partyAddress: landingData.party_address,
    musicEnabled: landingData.music_enabled,
    musicUrl: landingData.selected_track,
    coverImage: landingData.cover_image,
    galleryImages: landingData.gallery_images?.map(img => img.url),
    userId: landingData.user_id,
    bankInfo: landingData.bank_info,
    dress_code: landingData.dress_code,
    additional_info: landingData.additional_info,
    accepts_kids: landingData.accepts_kids,
    accepts_pets: landingData.accepts_pets,
    couple_code: landingData.couple_code,
    store: landingData.store,
    wishListItems: wishListItems,
    bank_info_enabled: landingData.bank_info_enabled,
    wish_list_enabled: landingData.wish_list_enabled,
    couple_code_enabled: landingData.couple_code_enabled,
  };

  return <TemplateComponent {...templateProps} />;
}
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getTemplate } from '../components/landing/templates';
import type { TemplateProps } from '../components/landing/templates/types';
import { Heart } from 'lucide-react';
import { Button } from '../components/ui/Button';
import logoParte from '../assets/images/logo-parte.svg';
import { toast } from 'react-hot-toast';

interface LandingPageData {
  id: string;
  user_id: string;
  groom_name: string;
  bride_name: string;
  wedding_date: string;
  welcome_message: string;
  hashtag: string;
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
  couple_code: string;
  store: string;
  wish_list_enabled: boolean;
  bank_info_enabled: boolean;
  couple_code_enabled: boolean;
}

export function PublicSitePage() {
  const { slug } = useParams<{ slug: string }>();
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!slug) {
          throw new Error('Slug is required');
        }

        const { data, error } = await supabase
          .from('landing_pages')
          .select('*')
          .eq('slug', slug)
          .not('published_at', 'is', null)
          .single();

        if (error) {
          throw error;
        }
        if (!data) {
          throw new Error('Page not found');
        }

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
              paid: item.paid || false,
              payment_status: item.payment_status
            }));
            setWishListItems(mappedItems);
          }
        }

        // Update page title and description
        document.title = `Boda de ${data.groom_name} y ${data.bride_name}`;
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          const date = new Date(data.wedding_date).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
          const time = data.ceremony_time || '';
          const location = data.ceremony_location || '';
          metaDescription.setAttribute('content', 
            `Te invitamos a celebrar nuestra boda el ${date}${time ? ` a las ${time}` : ''}${location ? ` en ${location}` : ''}. ¡Acompáñanos en este día tan especial!`
          );
        }
      } catch (error) {
        setError('Page not found');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

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
                paid: item.paid || false,
                payment_status: item.payment_status
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-slate-50">
        <div className="max-w-md w-full mx-auto p-8 text-center">
          <div className="mb-8">
            <img 
              src={logoParte} 
              alt="Parte Digital" 
              className="h-16 w-auto mx-auto"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            ¡Ups! Esta invitación ya no está disponible
          </h1>
          <p className="text-gray-600 mb-8">
            Lo sentimos, pero parece que esta invitación ya no está activa o ha sido eliminada.
          </p>
          <Button
            onClick={() => window.location.href = 'https://smartinvite.me'}
            size="lg"
            className="bg-rose-500 hover:bg-rose-600 text-white px-8 group"
          >
            <span>Ir al inicio</span>
            <Heart className="ml-2 h-5 w-5 group-hover:text-white transition-transform group-hover:scale-125" />
          </Button>
        </div>
      </div>
    );
  }

  const template = getTemplate(landingData.template_id);
  
  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-slate-50">
        <div className="max-w-md w-full mx-auto p-8 text-center">
          <div className="mb-8">
            <img 
              src={logoParte} 
              alt="Parte Digital" 
              className="h-16 w-auto mx-auto"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Template no encontrado
          </h1>
          <p className="text-gray-600 mb-8">
            Lo sentimos, pero el template seleccionado no está disponible.
          </p>
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
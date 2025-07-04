import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Switch } from '../ui/Switch';
import { MusicUpload } from '../ui/MusicUpload';
import { TemplateSelector } from './TemplateSelector';
import { CoverImageUpload } from '../ui/CoverImageUpload';
import { GalleryUpload } from '../ui/GalleryUpload';
import { PublishSection } from './PublishSection';
import { FloatingSaveButton } from './FloatingSaveButton';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { templates } from './templates';
import { PlacesAutocomplete } from '../ui/PlacesAutocomplete';
import { toast } from 'react-hot-toast';
import { Button } from '../ui/Button';
import { Grid } from 'lucide-react';
import { Select } from '../ui/Select';
import { useSearchParams } from 'react-router-dom';
import { trackEvent } from '../../lib/analytics';
import { WishListSection, WishListItem } from './form/WishListSection';
import { useLandingPreview } from '../../hooks/useLandingPreview';
import { useTranslation } from 'react-i18next';

interface LandingPageFormData {
  groom_name: string;
  bride_name: string;
  welcome_message: string;
  
  ceremony_date: string;
  ceremony_location: string;
  ceremony_time: string;
  ceremony_address: string;
  ceremony_place_id?: string;
  
  party_date: string;
  party_location: string;
  party_time: string;
  party_address: string;
  party_place_id?: string;
  
  music_enabled: boolean;
  selected_track: string;
  hashtag: string;

  // Additional Info
  dress_code: string;
  additional_info: string;

  accepts_kids: boolean;
  accepts_pets: boolean;

  couple_code: string;
  store: string;

  bank_info: {
    accountHolder: string;
    rut: string;
    bank: string;
    accountType: string;
    accountNumber: string;
    email: string;
  };

  wish_list_enabled: boolean;
  bank_info_enabled: boolean;
  couple_code_enabled: boolean;
}

interface LandingPageFormProps {
  initialData?: Partial<LandingPageFormData> & { 
    published_at?: string | null; 
    slug?: string | null;
    cover_image?: string;
    gallery_images?: { url: string; caption?: string }[];
    template_id?: string;
  };
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

interface PublishStatus {
  isPublished: boolean;
  slug: string | null;
}

const STORAGE_KEY = 'landing_page_status';

// Función para validar RUT chileno
const validateRut = (rut: string): boolean => {
  // Eliminar puntos y guión
  const cleanRut = rut.replace(/[.-]/g, '');
  
  // Verificar formato básico
  if (!/^[0-9]{7,8}[0-9kK]{1}$/.test(cleanRut)) {
    return false;
  }

  // Separar número y dígito verificador
  const rutNumber = cleanRut.slice(0, -1);
  const dv = cleanRut.slice(-1).toUpperCase();

  // 1. Invertir el número
  const rutReversed = rutNumber.split('').reverse().join('');

  // 2. Multiplicar por la serie 2,3,4,5,6,7
  let sum = 0;
  const serie = [2, 3, 4, 5, 6, 7];
  
  for (let i = 0; i < rutReversed.length; i++) {
    const digit = parseInt(rutReversed[i]);
    const multiplier = serie[i % serie.length];
    sum += digit * multiplier;
  }

  // 3. Dividir por 11 y obtener el resto
  const remainder = sum % 11;

  // 4. Calcular el dígito verificador
  const calculatedDv = 11 - remainder;
  const finalDv = calculatedDv === 11 ? '0' : calculatedDv === 10 ? 'K' : calculatedDv.toString();

  return finalDv === dv;
};

export function LandingPageForm({ initialData, onSuccess, onError }: LandingPageFormProps) {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showAllTemplates, setShowAllTemplates] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(initialData?.template_id || templates.deluxe_petro.id);
  const [selectedTrack, setSelectedTrack] = useState<string>(initialData?.selected_track || '');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [publishedUrl, setPublishedUrl] = useState<string>('');
  const [coverImage, setCoverImage] = useState<string>(initialData?.cover_image || '');
  const [galleryImages, setGalleryImages] = useState<{ url: string; caption?: string }[]>(initialData?.gallery_images || []);
  const [publishedStatus, setPublishedStatus] = useState<PublishStatus>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : { isPublished: false, slug: null };
  });
  const [userNames, setUserNames] = useState<{ groom_name: string; bride_name: string } | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [savedData, setSavedData] = useState(initialData);
  const [showCustomDressCode, setShowCustomDressCode] = useState(false);
  const [selectedDressCode, setSelectedDressCode] = useState(initialData?.dress_code || 'formal');
  const [rutValue, setRutValue] = useState(initialData?.bank_info?.rut || '');
  const [selectedStore, setSelectedStore] = useState(initialData?.store || 'falabella');
  const [hasModifiedPartyDate, setHasModifiedPartyDate] = useState(false);
  const [hasLandingPage, setHasLandingPage] = useState(false);
  const [rutError, setRutError] = useState<string | null>(null);
  const [wishListItems, setWishListItems] = useState<WishListItem[]>([]);
  const [wishListRefresh, setWishListRefresh] = useState(0);
  const [coverImageError, setCoverImageError] = useState<string | null>(null);
  const [galleryImagesError, setGalleryImagesError] = useState<string | null>(null);
  const [serviceStatus, setServiceStatus] = useState<'normal' | 'degraded' | 'down'>('normal');
  const [lastErrorTime, setLastErrorTime] = useState<number | null>(null);
  const [isCheckingPublishedStatus, setIsCheckingPublishedStatus] = useState(true);
  const { t, i18n } = useTranslation('landing');

  const { register, handleSubmit, formState: { errors }, watch, setValue, trigger } = useForm<LandingPageFormData>({
    defaultValues: {
      groom_name: initialData?.groom_name || userNames?.groom_name || '',
      bride_name: initialData?.bride_name || userNames?.bride_name || '',
      welcome_message: initialData?.welcome_message || '',
      ceremony_date: initialData?.ceremony_date || '',
      ceremony_location: initialData?.ceremony_location || '',
      ceremony_time: initialData?.ceremony_time || '',
      ceremony_address: initialData?.ceremony_address || '',
      ceremony_place_id: initialData?.ceremony_place_id,
      party_date: initialData?.party_date || '',
      party_location: initialData?.party_location || '',
      party_time: initialData?.party_time || '',
      party_address: initialData?.party_address || '',
      party_place_id: initialData?.party_place_id,
      dress_code: initialData?.dress_code || '',
      additional_info: initialData?.additional_info || '',
      hashtag: initialData?.hashtag || '',
      accepts_kids: initialData?.accepts_kids ?? false,
      accepts_pets: initialData?.accepts_pets ?? false,
      couple_code: initialData?.couple_code || '',
      store: initialData?.store || '',
      bank_info: initialData?.bank_info || {
        accountHolder: '',
        rut: '',
        bank: '',
        accountType: '',
        accountNumber: '',
        email: user?.email || ''
      },
      bank_info_enabled: initialData?.bank_info_enabled ?? false,
      couple_code_enabled: initialData?.couple_code_enabled ?? false,
      wish_list_enabled: initialData?.wish_list_enabled ?? false,
      music_enabled: initialData?.music_enabled ?? false,
    },
    mode: 'onChange',
  });

  // Show loading state if user is not available yet
  if (!user?.id) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  // Check for payment status in URL
  useEffect(() => {
    const paymentStatus = searchParams.get('payment_status');
    if (paymentStatus) {
      if (paymentStatus === 'success') {
        toast.success('¡Pago completado! Tu invitación ha sido publicada');
        // Refresh the page to update the published status
        window.location.href = '/landing';
      } else if (paymentStatus === 'failure') {
        toast.error('El pago no fue completado');
      } else if (paymentStatus === 'pending') {
        toast('Pago pendiente de confirmación');
      }
    }
  }, [searchParams]);

  const coupleCode = watch('couple_code');

  const dressCodeOptions = [
    { value: 'formal', label: t('dress_code_option_formal') },
    { value: 'black_tie', label: t('dress_code_option_black_tie') },
    { value: 'cocktail', label: t('dress_code_option_cocktail') },
    { value: 'semi_formal', label: t('dress_code_option_semi_formal') },
    { value: 'casual_elegante', label: t('dress_code_option_casual_elegante') },
    { value: 'custom', label: t('dress_code_option_custom') }
  ];

  const storeOptions = [
    { value: 'falabella', label: 'Falabella' },
    { value: 'paris', label: 'Paris' }
  ];

  // Fetch user names from users table
  useEffect(() => {
    const fetchUserNames = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from('users')
          .select('groom_name, bride_name')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        if (data) {
          setUserNames(data);
        }
      } catch (error) {
        console.error('Error fetching user names:', error);
      }
    };

    fetchUserNames();
  }, [user?.id]);

  // Update form values when userNames are loaded
  useEffect(() => {
    if (userNames && !initialData?.groom_name && !initialData?.bride_name) {
      setValue('groom_name', userNames.groom_name || '');
      setValue('bride_name', userNames.bride_name || '');
    }
  }, [userNames, initialData, setValue]);

  const groomName = watch('groom_name');
  const brideName = watch('bride_name');
  const ceremonyDate = watch('ceremony_date');
  const ceremonyLocation = watch('ceremony_location');
  const ceremonyTime = watch('ceremony_time');
  const ceremonyAddress = watch('ceremony_address');
  const partyDate = watch('party_date');
  const partyLocation = watch('party_location');
  const partyTime = watch('party_time');
  const partyAddress = watch('party_address');

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  React.useEffect(() => {
    if (user?.id) {
      setPreviewUrl(`${window.location.origin}/preview/${user.id}`);
    }
  }, [user?.id]);

  React.useEffect(() => {
    if (groomName && brideName && publishedStatus.slug) {
      setPublishedUrl(`https://smartinvite.me/invitacion/${publishedStatus.slug}`);
    }
  }, [groomName, brideName, publishedStatus.slug]);

  // Check if landing page exists and is published
  useEffect(() => {
    const checkPublishedStatus = async () => {
      if (!user?.id) return;

      try {
        setIsCheckingPublishedStatus(true);
        const { data, error } = await supabase
          .from('landing_pages')
          .select('published_at, slug')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking published status:', error);
          return;
        }

        if (data) {
          setHasLandingPage(true);
          if (data.published_at && data.slug) {
            const newStatus = {
              isPublished: true,
              slug: data.slug
            };
            setPublishedStatus(newStatus);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newStatus));
            setPublishedUrl(`https://smartinvite.me/invitacion/${data.slug}`);
          }
        } else {
          setHasLandingPage(false);
        }
      } catch (error) {
        console.error('Error checking published status:', error);
      } finally {
        setIsCheckingPublishedStatus(false);
      }
    };

    checkPublishedStatus();
  }, [user?.id]);

  // Inicializar savedData cuando se cargan los datos iniciales
  useEffect(() => {
    if (initialData && !savedData) {
      setSavedData(initialData);
    }
  }, [initialData, savedData]);

  // Watch for changes in form values
  const formValues = {
    ...watch(),
    cover_image: coverImage,
    gallery_images: galleryImages,
    wishListItems,
  };
  const landingPreview = useLandingPreview({
    user,
    formValues,
    publishedStatus,
    selectedTemplateId,
  });
  useEffect(() => {
    // Función para comparar valores de forma más precisa
    const compareValues = (current: any, initial: any): boolean => {
      if (current === initial) return false;
      if (typeof current !== typeof initial) return true;
      
      if (typeof current === 'object' && current !== null && initial !== null) {
        const currentKeys = Object.keys(current);
        const initialKeys = Object.keys(initial);
        
        if (currentKeys.length !== initialKeys.length) return true;
        
        for (const key of currentKeys) {
          if (!initialKeys.includes(key)) return true;
          if (compareValues(current[key], initial[key])) return true;
        }
        return false;
      }
      
      return current !== initial;
    };

    // Comparar valores del formulario
    const hasFormChanges = Object.keys(formValues).some(key => {
      const currentValue = formValues[key as keyof typeof formValues];
      const initialValue = savedData?.[key as keyof typeof savedData];
      return compareValues(currentValue, initialValue);
    });

    // Comparar otros valores importantes
    const hasOtherChanges = 
      watch('music_enabled') !== (savedData?.music_enabled || false) ||
      selectedTrack !== (savedData?.selected_track || '') ||
      coverImage !== (savedData?.cover_image || '') ||
      selectedTemplateId !== (savedData?.template_id || templates.deluxe_petro.id) ||
      watch('wish_list_enabled') !== (savedData?.wish_list_enabled || false) ||
      watch('bank_info_enabled') !== !!(savedData?.bank_info && (
        savedData.bank_info.accountHolder ||
        savedData.bank_info.rut ||
        savedData.bank_info.bank ||
        savedData.bank_info.accountType ||
        savedData.bank_info.accountNumber ||
        savedData.bank_info.email
      )) ||
      watch('couple_code_enabled') !== !!(savedData?.couple_code || savedData?.store) ||
      // Comparar gallery images de forma más precisa
      JSON.stringify(galleryImages.map(img => ({ url: img.url, caption: img.caption }))) !== 
      JSON.stringify((savedData?.gallery_images || []).map(img => ({ url: img.url, caption: img.caption })));

    setHasChanges(hasFormChanges || hasOtherChanges);
  }, [
    formValues,
    watch('music_enabled'),
    selectedTrack,
    coverImage,
    galleryImages,
    selectedTemplateId,
    watch('wish_list_enabled'),
    watch('bank_info_enabled'),
    watch('couple_code_enabled'),
    savedData
  ]);

  // Sincronizar fechas de ceremonia y recepción SOLO si party_date está vacío y no ha sido modificada
  useEffect(() => {
    const ceremonyDate = watch('ceremony_date');
    const partyDate = watch('party_date');
    if (ceremonyDate && !hasModifiedPartyDate && !partyDate) {
      setValue('party_date', ceremonyDate, { shouldValidate: true });
    }
  }, [watch('ceremony_date'), hasModifiedPartyDate, setValue, watch('party_date')]);

  // Efecto para sincronizar el dresscode con el formulario
  useEffect(() => {
    if (!showCustomDressCode) {
      setValue('dress_code', selectedDressCode);
    }
  }, [selectedDressCode, showCustomDressCode, setValue]);

  // Efecto para sincronizar la tienda con el formulario
  useEffect(() => {
    setValue('store', selectedStore);
  }, [selectedStore, setValue]);

  // Fetch initial wish list items
  useEffect(() => {
    const fetchWishList = async () => {
      if (!user?.id) return;
      try {
        const { data, error } = await supabase
          .from('wish_list_items')
          .select('id, name, price, icon')
          .eq('user_id', user.id);
        if (error) throw error;
        if (data && data.length > 0) {
          setWishListItems(data.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price ?? undefined,
            icon: item.icon || 'gift',
          })));
        } else {
          setWishListItems([]);
        }
      } catch (err) {
        console.error('Error fetching wish list:', err);
      }
    };
    fetchWishList();
  }, [user?.id, wishListRefresh]);

  // En el useEffect, sincronizar music_enabled con music_enabled
  useEffect(() => {
    if (watch('music_enabled')) {
      setValue('music_enabled', true);
    } else {
      setValue('music_enabled', false);
    }
  }, [watch('music_enabled')]);

  // En el useEffect, para forzar la validación de los campos de dirección:
  useEffect(() => {
    register('ceremony_address', { required: 'La dirección de la ceremonia es requerida' });
    register('party_address', { required: 'La dirección de la recepción es requerida' });
  }, [register]);

  // Handlers para limpiar errores al subir imágenes
  const handleCoverImageChange = (img: string) => {
    setCoverImage(img);
    if (img) setCoverImageError(null);
  };
  const handleGalleryImagesChange = (imgs: { url: string; caption?: string }[]) => {
    setGalleryImages(imgs);
    if (imgs.length >= 3) setGalleryImagesError(null);
  };

  const onSubmit = async (data: LandingPageFormData) => {
    if (!selectedTemplateId) {
      toast.error('Por favor selecciona una plantilla');
      return;
    }
    // Validación de portada y galería (solo visual, no toast)
    let hasError = false;
    if (!coverImage) {
      setCoverImageError('Debes subir una imagen de portada');
      hasError = true;
    } else {
      setCoverImageError(null);
    }
    if (!galleryImages || galleryImages.length < 3) {
      setGalleryImagesError('Debes subir al menos 3 imágenes a la galería');
      hasError = true;
    } else {
      setGalleryImagesError(null);
    }
    if (hasError) return;

    setIsLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No authenticated session');

      // First, get the existing landing page if it exists
      const { data: existingPage } = await supabase
        .from('landing_pages')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      // Clean hashtag by removing # if present
      const cleanHashtag = data.hashtag.replace(/^#/, '');

      const adjustDate = (dateStr: string) => {
        const [year, month, day] = dateStr.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        return date.toISOString();
      };

      // --- NUEVO: lógica para toggles ---
      const bankInfoToSave = data.bank_info_enabled ? data.bank_info : null;
      const coupleCodeToSave = data.couple_code_enabled ? data.couple_code : null;
      const storeToSave = data.couple_code_enabled ? data.store : null;

      const { error } = await supabase
        .from('landing_pages')
        .upsert({
          id: existingPage?.id, // Include the id if it exists
          user_id: user?.id,
          ...data,
          hashtag: cleanHashtag, // Use cleaned hashtag
          template_id: selectedTemplateId,
          wedding_date: adjustDate(data.ceremony_date),
          ceremony_date: adjustDate(data.ceremony_date),
          party_date: adjustDate(data.party_date),
          music_enabled: data.music_enabled,
          wish_list_enabled: data.wish_list_enabled,
          bank_info: bankInfoToSave || undefined,
          couple_code: coupleCodeToSave || undefined,
          store: storeToSave || undefined,
          selected_track: selectedTrack,
          cover_image: coverImage,
          gallery_images: galleryImages,
        });

      // Sincroniza los nombres en la tabla users
      if (user?.id) {
        await supabase
          .from('users')
          .update({
            groom_name: data.groom_name,
            bride_name: data.bride_name,
          })
          .eq('id', user.id);
      }

      if (error) throw error;

      // Actualizar hasLandingPage después de guardar exitosamente
      setHasLandingPage(true);

      // Actualizar savedData con los datos guardados
      const savedDataToUpdate = {
        ...data,
        hashtag: cleanHashtag,
        template_id: selectedTemplateId,
        music_enabled: data.music_enabled,
        wish_list_enabled: data.wish_list_enabled,
        bank_info: bankInfoToSave || undefined,
        couple_code: coupleCodeToSave || undefined,
        store: storeToSave || undefined,
        selected_track: selectedTrack,
        cover_image: coverImage,
        gallery_images: galleryImages,
      };
      setSavedData(savedDataToUpdate);

      // Resetear hasChanges después de guardar exitosamente
      setHasChanges(false);

      toast.success(
        !existingPage
          ? 'Invitación creada correctamente'
          : 'Cambios guardados correctamente'
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });

      trackEvent('landing_page_created', {
        userId: user?.id,
        templateId: selectedTemplateId,
        musicEnabled: data.music_enabled,
        selectedTrack: selectedTrack,
        coverImage: coverImage,
        galleryImages: galleryImages,
        hasBankInfo: !!data.bank_info
      });
    } catch (error) {
      console.error('Error saving landing page:', error);
      toast.error('Error al guardar los cambios');
      onError?.(error as Error);
    } finally {
      setIsLoading(false);
      // Limpiar errores visuales si ya se guardó correctamente
      if (coverImage) setCoverImageError(null);
      if (galleryImages && galleryImages.length >= 3) setGalleryImagesError(null);
    }
  };

  const handlePublish = async () => {
    if (!groomName || !brideName) {
      toast.error('Por favor completa los nombres antes de publicar');
      return;
    }

    setIsPublishing(true);
    try {
      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!session) throw new Error('No authenticated session');

      const slug = `${groomName.toLowerCase()}-y-${brideName.toLowerCase()}`
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      try {
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/publish-landing`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user?.id,
            slug,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          
          if (response.status === 401) {
            // Try to refresh token and retry once
            const { data: { session: retrySession }, error: retryError } = await supabase.auth.refreshSession();
            if (retryError || !retrySession) {
              throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
            }
            
            // Retry with new token
            const retryController = new AbortController();
            const retryTimeoutId = setTimeout(() => retryController.abort(), 15000);
            
            try {
              const retryResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/publish-landing`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${retrySession.access_token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  userId: user?.id,
                  slug,
                }),
                signal: retryController.signal,
              });
              
              clearTimeout(retryTimeoutId);
              
              if (!retryResponse.ok) {
                const retryErrorText = await retryResponse.text();
                throw new Error(`No se pudo publicar tu invitación: ${retryErrorText}`);
              }
              
              const data = await retryResponse.json();
              handlePublishSuccess(data);
            } catch (retryError) {
              clearTimeout(retryTimeoutId);
              if (retryError instanceof Error && retryError.name === 'AbortError') {
                throw new Error('La publicación está tardando más de lo esperado. Por favor, intenta nuevamente en unos minutos.');
              }
              throw retryError;
            }
          } else if (response.status === 502 || response.status === 503 || response.status === 504) {
            throw new Error('Estamos experimentando problemas técnicos temporales. Por favor, intenta nuevamente en unos minutos. Si el problema persiste, contacta nuestro soporte.');
          } else {
            throw new Error(`No se pudo publicar tu invitación: ${errorText}`);
          }
        } else {
          const data = await response.json();
          handlePublishSuccess(data);
        }
      } catch (fetchError) {
        clearTimeout(timeoutId);
        
        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
          throw new Error('La publicación está tardando más de lo esperado. Esto puede deberse a problemas temporales de conectividad. Por favor, intenta nuevamente en unos minutos.');
        }
        
        if (fetchError instanceof TypeError && fetchError.message.includes('fetch')) {
          throw new Error('Problema de conectividad. Por favor, verifica tu conexión a internet e intenta nuevamente.');
        }
        
        throw fetchError;
      }
    } catch (error) {
      console.error('Error publishing landing:', error);
      
      // Registrar error para el estado del servicio
      if (error instanceof Error && (
        error.message.includes('problemas técnicos') ||
        error.message.includes('conectividad') ||
        error.message.includes('tardando más')
      )) {
        setLastErrorTime(Date.now());
      }
      
      // Mostrar mensajes más amigables según el tipo de error
      let userMessage = 'Error al publicar la página';
      
      if (error instanceof Error) {
        if (error.message.includes('problemas técnicos')) {
          userMessage = error.message;
        } else if (error.message.includes('conectividad')) {
          userMessage = error.message;
        } else if (error.message.includes('tardando más')) {
          userMessage = error.message;
        } else if (error.message.includes('sesión ha expirado')) {
          userMessage = error.message;
        } else if (error.message.includes('URL is already in use')) {
          userMessage = 'Esta URL ya está en uso. Por favor, cambia los nombres de los novios o intenta con una combinación diferente.';
        } else if (error.message.includes('Landing page not found')) {
          userMessage = 'Primero debes guardar tu invitación antes de publicarla. Haz clic en "Guardar" y luego intenta publicar nuevamente.';
        } else {
          userMessage = `No se pudo publicar tu invitación: ${error.message}`;
        }
      }
      
      toast.error(userMessage);
      onError?.(error as Error);
    } finally {
      setIsPublishing(false);
    }
  };

  const handlePublishSuccess = (data: any) => {
    if (data.success) {
      const newStatus = {
        isPublished: true,
        slug: data.data.slug
      };
      setPublishedStatus(newStatus);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newStatus));
      
      // Show appropriate message based on whether it was already published
      if (data.alreadyPublished) {
        toast.success('Tu página ya está publicada');
      } else {
        toast.success('¡Página publicada correctamente!');
      }

      trackEvent('landing_page_published', {
        userId: user?.id,
        templateId: selectedTemplateId,
        musicEnabled: watch('music_enabled'),
        selectedTrack: selectedTrack,
        coverImage: coverImage,
        galleryImages: galleryImages,
        hasBankInfo: !!watch('bank_info')
      });
    } else {
      throw new Error(data.error || 'Error al publicar la página');
    }
  };

  const handleUnpublish = async () => {
    try {
      const { error } = await supabase
        .from('landing_pages')
        .update({ 
          published_at: null,
          slug: null
        })
        .eq('user_id', user?.id);

      if (error) {
        console.error('Error unpublishing landing page:', error);
        
        // Mensajes más amigables para errores de despublicación
        if (error.message.includes('network') || error.message.includes('connection')) {
          throw new Error('Problema de conectividad. Por favor, verifica tu conexión a internet e intenta nuevamente.');
        } else if (error.message.includes('timeout')) {
          throw new Error('La operación está tardando más de lo esperado. Por favor, intenta nuevamente en unos minutos.');
        } else {
          throw new Error(`No se pudo despublicar la página: ${error.message}`);
        }
      }

      const newStatus = {
        isPublished: false,
        slug: null
      };
      setPublishedStatus(newStatus);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newStatus));
      toast.success('Página despublicada correctamente');

      trackEvent('landing_page_unpublished', {
        userId: user?.id,
        templateId: selectedTemplateId,
        musicEnabled: watch('music_enabled'),
        selectedTrack: selectedTrack,
        coverImage: coverImage,
        galleryImages: galleryImages,
        hasBankInfo: !!watch('bank_info')
      });
    } catch (error) {
      console.error('Error unpublishing landing page:', error);
      
      let userMessage = 'Error al despublicar la página';
      
      if (error instanceof Error) {
        if (error.message.includes('conectividad')) {
          userMessage = error.message;
        } else if (error.message.includes('tardando más')) {
          userMessage = error.message;
        } else if (error.message.includes('No se pudo despublicar')) {
          userMessage = error.message;
        } else {
          userMessage = `No se pudo despublicar la página: ${error.message}`;
        }
      }
      
      toast.error(userMessage);
      onError?.(error as Error);
    }
  };

  const hasRequiredInfo = Boolean(
    groomName &&
    brideName &&
    ceremonyDate &&
    ceremonyLocation &&
    ceremonyTime &&
    ceremonyAddress &&
    partyDate &&
    partyLocation &&
    partyTime &&
    partyAddress &&
    selectedTemplateId &&
    // Validar datos bancarios si el toggle está activo
    (!watch('bank_info_enabled') || (
      watch('bank_info.accountHolder') &&
      watch('bank_info.rut') &&
      watch('bank_info.bank') &&
      watch('bank_info.accountType') &&
      watch('bank_info.accountNumber') &&
      watch('bank_info.email')
    )) &&
    // Validar lista de novios si el toggle está activo
    (!watch('couple_code_enabled') || (
      watch('couple_code') &&
      watch('store')
    )) &&
    // Validar música si el toggle está activo
    (!watch('music_enabled') || selectedTrack)
  );

  const formatRut = (value: string) => {
    // Eliminar todo excepto números y k
    const cleanValue = value.replace(/[^0-9kK]/g, '');
    
    // Si está vacío, retornar vacío
    if (!cleanValue) return '';
    
    // Separar número y dígito verificador
    const rutNumber = cleanValue.slice(0, -1);
    const dv = cleanValue.slice(-1).toUpperCase();
    
    // Formatear número con guión
    return `${rutNumber}-${dv}`;
  };

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatRut(e.target.value);
    setRutValue(formattedValue);
    setValue('bank_info.rut', formattedValue);

    // Validar en tiempo real
    if (formattedValue) {
      if (!/^[0-9]{7,8}-[0-9kK]{1}$/.test(formattedValue)) {
        setRutError('Formato de RUT inválido (ej: 12345678-9)');
      } else if (!validateRut(formattedValue)) {
        setRutError('RUT inválido');
      } else {
        setRutError(null);
      }
    } else {
      setRutError(null);
    }
  };

  const handleAccountTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setValue('bank_info.accountType', value);
    
    if (value === 'Cuenta RUT') {
      // Obtener el RUT sin dígito verificador
      const rutWithoutDV = rutValue.split('-')[0];
      
      // Establecer Banco Estado y deshabilitar el campo
      setValue('bank_info.bank', 'Banco Estado');
      setValue('bank_info.accountNumber', rutWithoutDV);
    } else {
      // Si cambia a otro tipo de cuenta, limpiar el banco y habilitar el campo
      setValue('bank_info.bank', '');
      setValue('bank_info.accountNumber', '');
    }
  };

  const handleWishListSaved = () => {
    setWishListRefresh((prev) => prev + 1);
  };

  // Check service status based on recent errors
  useEffect(() => {
    if (lastErrorTime && Date.now() - lastErrorTime < 300000) { // 5 minutes
      setServiceStatus('degraded');
    } else {
      setServiceStatus('normal');
    }
  }, [lastErrorTime]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" id="landing-form">
      <PublishSection
        previewUrl={landingPreview.previewUrl}
        publishedUrl={landingPreview.publishedUrl}
        publishedStatus={publishedStatus}
        isPublishing={isPublishing}
        onPublish={handlePublish}
        onUnpublish={handleUnpublish}
        hasRequiredInfo={hasLandingPage}
        isLoading={isCheckingPublishedStatus || (!hasLandingPage && !initialData)}
      />

      {/* Service Status Banner */}
      {serviceStatus === 'degraded' && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800">
                Problemas técnicos temporales
              </h3>
              <div className="mt-2 text-sm text-amber-700">
                <p>
                  Estamos experimentando algunos problemas técnicos. Si tienes dificultades para publicar tu invitación, por favor intenta nuevamente en unos minutos. Si el problema persiste, contacta nuestro soporte.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {!publishedStatus.isPublished && hasLandingPage && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800">
                {t('reminder_publish_title')}
              </h3>
              <div className="mt-2 text-sm text-amber-700">
                <p>
                  {t('reminder_publish_description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg p-6">
        <CardHeader className="px-0 pt-0 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
                <span className="text-rose-600 font-medium">1</span>
              </div>
              <CardTitle>{t('select_template_title')}</CardTitle>
            </div>
            <Button
              variant="secondary"
              size="sm"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowAllTemplates(true);
              }}
              leftIcon={<Grid className="h-4 w-4" />}
              className='border border-primary text-primary hover:bg-primary-dark hover:text-primary-contrast'
            >
              {t('see_all_templates')}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0 pt-6">
          <TemplateSelector
            selectedTemplateId={selectedTemplateId}
            onSelect={setSelectedTemplateId}
            showAllTemplates={showAllTemplates}
            setShowAllTemplates={setShowAllTemplates}
          />
        </CardContent>
      </div>

      <div className="bg-white rounded-lg p-6">
        <CardHeader className="px-0 pt-0 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
              <span className="text-rose-600 font-medium">2</span>
            </div>
            <CardTitle>{t('names_title')}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t('groom_name_label')}
              {...register('groom_name', { required: t('groom_name_required') })}
              error={errors.groom_name?.message}
            />
            <Input
              label={t('bride_name_label')}
              {...register('bride_name', { required: t('bride_name_required') })}
              error={errors.bride_name?.message}
            />
          </div>
        </CardContent>
      </div>

      <div className="bg-white rounded-lg p-6">
        <CardHeader className="px-0 pt-0 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
              <span className="text-rose-600 font-medium">3</span>
            </div>
            <CardTitle>{t('welcome_message_title')}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0 pt-6">
          <div className="space-y-4">
            <Textarea
              label={t('welcome_message_label')}
              {...register('welcome_message', {
                required: t('welcome_message_required'),
                maxLength: { value: 120, message: t('welcome_message_max') }
              })}
              error={errors.welcome_message?.message}
              placeholder={t('welcome_message_placeholder')}
              maxLength={120}
            />
            <div className="text-sm text-gray-500 text-right">
              {t('welcome_message_counter', { count: watch('welcome_message')?.length || 0 })}
            </div>
            <Input
              label={t('hashtag_label')}
              {...register('hashtag', { required: t('hashtag_required') })}
              error={errors.hashtag?.message}
              placeholder={t('hashtag_placeholder')}
            />
          </div>
        </CardContent>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6">
          <CardHeader className="px-0 pt-0 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
                <span className="text-rose-600 font-medium">4</span>
              </div>
              <CardTitle>{t('cover_image_title')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0 pt-6">
            <div id="cover-image-section">
              <CoverImageUpload
                value={coverImage}
                onChange={handleCoverImageChange}
                onRemove={() => {
                  setCoverImage('');
                  setCoverImageError(t('cover_image_required'));
                }}
                helperText={t('cover_image_recommendation')}
                buttonLabel={t('cover_image_button')}
              />
              {coverImageError && (
                <div className="text-sm text-red-500 mt-2">{coverImageError}</div>
              )}
            </div>
          </CardContent>
        </div>

        <div className="bg-white rounded-lg p-6">
          <CardHeader className="px-0 pt-0 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
                <span className="text-rose-600 font-medium">5</span>
              </div>
              <CardTitle>{t('gallery_title')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0 pt-6">
            <div id="gallery-section">
              <GalleryUpload
                images={galleryImages}
                onChange={handleGalleryImagesChange}
                helperText={t('gallery_recommendation')}
                buttonUploadLabel={t('gallery_button_upload')}
                buttonAddLabel={t('gallery_button_add')}
                counterText={t('gallery_counter', { count: galleryImages.length })}
              />
              {galleryImagesError && (
                <div className="text-sm text-red-500 mt-2">{galleryImagesError}</div>
              )}
            </div>
          </CardContent>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6">
        <CardHeader className="px-0 pt-0 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
              <span className="text-rose-600 font-medium">6</span>
            </div>
            <CardTitle>{t('ceremony_section_title')}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="date"
              label={t('ceremony_date_label')}
              {...register('ceremony_date', {
                required: t('ceremony_date_required'),
                validate: (value) => {
                  if (new Date(value) < new Date(today)) {
                    return t('ceremony_date_future');
                  }
                  return true;
                }
              })}
              error={errors.ceremony_date?.message}
              min={today}
              lang={i18n.language === 'en' ? 'en' : undefined}
            />
            <Input
              label={t('ceremony_time_label')}
              type="time"
              {...register('ceremony_time')}
            />
            <div className="md:col-span-2">
              <Input
                label={t('ceremony_location_label')}
                {...register('ceremony_location', { required: t('ceremony_location_required') })}
                error={errors.ceremony_location?.message}
                placeholder={t('ceremony_location_placeholder')}
                autoComplete="off"
                role="textbox"
                aria-autocomplete="none"
              />
            </div>
            <div className="md:col-span-2">
              <PlacesAutocomplete
                label={t('ceremony_address_label')}
                value={watch('ceremony_address')}
                onChange={(address, placeId) => {
                  setValue('ceremony_address', address, { shouldValidate: true });
                  setValue('ceremony_place_id', placeId);
                  trigger('ceremony_address');
                }}
                placeholder={t('ceremony_address_placeholder')}
                error={errors.ceremony_address?.message}
              />
            </div>
          </div>
        </CardContent>
      </div>

      <div className="bg-white rounded-lg p-6">
        <CardHeader className="px-0 pt-0 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
              <span className="text-rose-600 font-medium">7</span>
            </div>
            <CardTitle>{t('party_section_title')}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t('party_date_label')}
              type="date"
              min={today}
              {...register('party_date', { 
                required: t('party_date_required'),
                validate: value => {
                  const date = new Date(value);
                  return date >= new Date() || t('party_date_future');
                }
              })}
              error={errors.party_date?.message}
              onChange={(e) => {
                setHasModifiedPartyDate(true);
                setValue('party_date', e.target.value, { shouldValidate: true });
              }}
              lang={i18n.language === 'en' ? 'en' : undefined}
            />
            <Input
              label={t('party_time_label')}
              type="time"
              {...register('party_time', { required: t('party_time_required') })}
              error={errors.party_time?.message}
            />
            <div className="md:col-span-2">
              <Input
                label={t('party_location_label')}
                {...register('party_location', { required: t('party_location_required') })}
                error={errors.party_location?.message}
                placeholder={t('party_location_placeholder')}
                autoComplete="off"
                role="textbox"
                aria-autocomplete="none"
              />
            </div>
            <div className="md:col-span-2">
              <PlacesAutocomplete
                label={t('party_address_label')}
                value={watch('party_address')}
                onChange={(address, placeId) => {
                  setValue('party_address', address, { shouldValidate: true });
                  setValue('party_place_id', placeId);
                  trigger('party_address');
                }}
                placeholder={t('party_address_placeholder')}
                error={errors.party_address?.message}
              />
            </div>
          </div>
        </CardContent>
      </div>

      <div className="bg-white rounded-lg p-6">
        <CardHeader className="px-0 pt-0 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
              <span className="text-rose-600 font-medium">8</span>
            </div>
            <CardTitle>{t('additional_info_section_title')}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0 pt-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">{t('dress_code_label', 'Código de Vestimenta')}</label>
            <Select
              value={selectedDressCode === 'custom' ? 'custom' : watch('dress_code')}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                const value = e.target.value;
                setSelectedDressCode(value);
                if (value === 'custom') {
                  setShowCustomDressCode(true);
                  setValue('dress_code', '');
                } else {
                  setShowCustomDressCode(false);
                  setValue('dress_code', value);
                }
              }}
              options={dressCodeOptions}
              error={errors.dress_code?.message}
              required
            />
            {showCustomDressCode && (
              <Input
                {...register('dress_code', { required: t('dress_code_required', 'El código de vestimenta es requerido') })}
                placeholder={t('dress_code_custom_placeholder', 'Especifica el código de vestimenta')}
                error={errors.dress_code?.message}
              />
            )}
          </div>
          
          <Textarea
            label={t('additional_info_label')}
            {...register('additional_info', { required: t('additional_info_required') })}
            placeholder={t('additional_info_placeholder')}
            error={errors.additional_info?.message}
          />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">{t('accepts_kids_label')}</label>
                <p className="text-sm text-gray-500">{t('accepts_kids_helper')}</p>
              </div>
              <Switch
                checked={!!watch('accepts_kids')}
                onCheckedChange={(checked) => setValue('accepts_kids', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">{t('accepts_pets_label')}</label>
                <p className="text-sm text-gray-500">{t('accepts_pets_helper')}</p>
              </div>
              <Switch
                checked={!!watch('accepts_pets')}
                onCheckedChange={(checked) => setValue('accepts_pets', checked)}
              />
            </div>
          </div>
          <div className="pt-6">
          </div>
        </CardContent>
      </div>

      <div className="bg-white rounded-lg p-6">
        <div className="mb-2">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
              <span className="text-rose-600 font-medium">9</span>
            </div>
            <CardTitle className="text-lg sm:text-xl">{t('bank_info_section_title')}</CardTitle>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">{t('bank_info_toggle_label')}</span>
            <Switch checked={!!watch('bank_info_enabled')} onCheckedChange={(checked) => setValue('bank_info_enabled', checked)} />
          </div>
        </div>
        {watch('bank_info_enabled') && (
          <CardContent className="p-0 pt-6 space-y-6">
            <div>
              <p className="text-sm text-gray-500 mb-4">
                {t('bank_info_helper')}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label={t('bank_info_accountHolder_label')}
                  {...register('bank_info.accountHolder', { required: watch('bank_info_enabled') ? t('bank_info_accountHolder_required') : false })}
                  error={errors.bank_info?.accountHolder?.message}
                  placeholder={t('bank_info_accountHolder_placeholder', 'Nombre del titular de la cuenta')}
                />
                <Input
                  label={t('bank_info_rut_label')}
                  {...register('bank_info.rut', { required: watch('bank_info_enabled') ? t('bank_info_rut_required') : false })}
                  error={rutError || errors.bank_info?.rut?.message}
                  placeholder={t('bank_info_rut_placeholder')}
                  value={rutValue}
                  onChange={handleRutChange}
                />
                <Select
                  label={t('bank_info_accountType_label')}
                  value={watch('bank_info.accountType')}
                  onChange={handleAccountTypeChange}
                  error={errors.bank_info?.accountType?.message}
                  options={[
                    { value: '', label: t('bank_info_accountType_label') },
                    { value: 'Cuenta Corriente', label: t('bank_info_accountType_option_corriente') },
                    { value: 'Cuenta Vista', label: t('bank_info_accountType_option_vista') },
                    { value: 'Cuenta RUT', label: t('bank_info_accountType_option_rut') }
                  ]}
                />
                <Input
                  label={t('bank_info_accountNumber_label')}
                  {...register('bank_info.accountNumber', { required: watch('bank_info_enabled') ? t('bank_info_accountNumber_required') : false })}
                  error={errors.bank_info?.accountNumber?.message}
                  placeholder={t('bank_info_accountNumber_placeholder')}
                  disabled={watch('bank_info.accountType') === 'Cuenta RUT'}
                />
                <Input
                  label={t('bank_info_bank_label')}
                  {...register('bank_info.bank', { required: watch('bank_info_enabled') ? t('bank_info_bank_required') : false })}
                  error={errors.bank_info?.bank?.message}
                  placeholder={t('bank_info_bank_placeholder', 'Nombre del banco')}
                  disabled={watch('bank_info.accountType') === 'Cuenta RUT'}
                />
                <Input
                  label={t('bank_info_email_label')}
                  {...register('bank_info.email', { 
                    required: watch('bank_info_enabled') ? t('bank_info_email_required') : false,
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: t('bank_info_email_invalid')
                    }
                  })}
                  error={errors.bank_info?.email?.message}
                  placeholder={t('bank_info_email_placeholder')}
                />
              </div>
            </div>
          </CardContent>
        )}
      </div>

      <div className="bg-white rounded-lg p-6">
        <div className="mb-2">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
              <span className="text-rose-600 font-medium">10</span>
            </div>
            <CardTitle className="text-lg sm:text-xl">{t('couple_code_section_title')}</CardTitle>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">{t('couple_code_toggle_label')}</span>
            <Switch checked={!!watch('couple_code_enabled')} onCheckedChange={(checked) => setValue('couple_code_enabled', checked)} />
          </div>
        </div>
        {watch('couple_code_enabled') && (
          <CardContent className="p-0 pt-6">
            <div className="space-y-4">
              <Input
                label={t('couple_code_label')}
                {...register('couple_code', { required: watch('couple_code_enabled') ? t('couple_code_required') : false })}
                error={errors.couple_code?.message}
                placeholder={t('couple_code_placeholder')}
              />
              <Select
                label={t('store_label')}
                {...register('store', { required: watch('couple_code_enabled') ? t('store_required') : false })}
                options={[
                  { value: 'falabella', label: t('store_option_falabella') },
                  { value: 'paris', label: t('store_option_paris') }
                ]}
                disabled={!coupleCode ? true : false}
                value={selectedStore}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedStore(value);
                  setValue('store', value);
                }}
              />
              {!coupleCode && (
                <p className="text-sm text-gray-500">
                  {t('store_helper')}
                </p>
              )}
            </div>
          </CardContent>
        )}
      </div>

      <div className="bg-white rounded-lg p-6">
        <div className="mb-2">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
              <span className="text-rose-600 font-medium">11</span>
            </div>
            <CardTitle className="text-lg sm:text-xl">{t('wishlist_section_title')}</CardTitle>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">{t('wishlist_toggle_label')}</span>
            <Switch checked={watch('wish_list_enabled')} onCheckedChange={(checked) => setValue('wish_list_enabled', checked)} />
          </div>
        </div>
        <WishListSection
          value={wishListItems}
          onChange={setWishListItems}
          enabled={watch('wish_list_enabled')}
          onEnabledChange={(checked) => setValue('wish_list_enabled', checked)}
          errors={undefined}
          onSaved={handleWishListSaved}
        />
      </div>

      <div className="bg-white rounded-lg p-6">
        <div className="mb-2">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
              <span className="text-rose-600 font-medium">12</span>
            </div>
            <CardTitle className="text-lg sm:text-xl">{t('music_section_title')}</CardTitle>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">{t('music_toggle_label')}</span>
            <Switch checked={watch('music_enabled')} onCheckedChange={(checked) => setValue('music_enabled', checked)} />
          </div>
        </div>
        {watch('music_enabled') && (
          <CardContent className="p-0 pt-6 space-y-4">
            <div>
              <p className="text-sm text-gray-500">{t('music_helper')}</p>
              <MusicUpload
                value={selectedTrack}
                onChange={setSelectedTrack}
              />
            </div>
          </CardContent>
        )}
      </div>

      {hasChanges && (
        <FloatingSaveButton
          isLoading={isLoading}
          previewUrl={hasLandingPage ? landingPreview.previewUrl : undefined}
          publishedUrl={landingPreview.publishedUrl}
          hasRequiredInfo={hasLandingPage}
          hasChanges={hasChanges}
          errors={errors}
          coverImageError={coverImageError}
          galleryImagesError={galleryImagesError}
          onSave={() => handleSubmit(onSubmit)()}
        />
      )}
    </form>
  );
}
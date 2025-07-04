import { useEffect, useState } from 'react';

interface UseLandingPreviewParams {
  user?: { id: string } | null;
  formValues: Record<string, any>;
  publishedStatus: { isPublished: boolean; slug: string | null };
  selectedTemplateId: string;
}

export function useLandingPreview({ user, formValues, publishedStatus, selectedTemplateId }: UseLandingPreviewParams) {
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [publishedUrl, setPublishedUrl] = useState<string>('');

  useEffect(() => {
    if (user?.id) {
      setPreviewUrl(`${window.location.origin}/preview/${user.id}`);
    } else {
      setPreviewUrl('');
    }
  }, [user?.id]);

  useEffect(() => {
    if (formValues.groom_name && formValues.bride_name && publishedStatus.slug) {
      setPublishedUrl(`https://tuparte.digital/invitacion/${publishedStatus.slug}`);
    } else {
      setPublishedUrl('');
    }
  }, [formValues.groom_name, formValues.bride_name, publishedStatus.slug]);

  // Lógica de hasRequiredInfo (copiada de LandingPageForm)
  const hasRequiredInfo = Boolean(
    formValues.groom_name &&
    formValues.bride_name &&
    formValues.ceremony_date &&
    formValues.ceremony_location &&
    formValues.ceremony_time &&
    formValues.ceremony_address &&
    formValues.party_date &&
    formValues.party_location &&
    formValues.party_time &&
    formValues.party_address &&
    selectedTemplateId &&
    formValues.cover_image &&
    Array.isArray(formValues.gallery_images) && formValues.gallery_images.length >= 3 &&
    // Validar datos bancarios si el toggle está activo
    (!formValues.bank_info_enabled || (
      formValues.bank_info?.accountHolder &&
      formValues.bank_info?.rut &&
      formValues.bank_info?.bank &&
      formValues.bank_info?.accountType &&
      formValues.bank_info?.accountNumber &&
      formValues.bank_info?.email
    )) &&
    // Validar lista de novios si el toggle está activo
    (!formValues.couple_code_enabled || (
      formValues.couple_code &&
      formValues.store
    )) &&
    // Validar música si el toggle está activo
    (!formValues.music_enabled || formValues.selected_track) &&
    // Validar wish list si el toggle está activo
    (!formValues.wish_list_enabled || (
      (Array.isArray(formValues.wish_list_items) && formValues.wish_list_items.length > 0) ||
      (Array.isArray(formValues.wishListItems) && formValues.wishListItems.length > 0)
    ))
  );

  // Mostrar botón de preview si hay info suficiente y previewUrl existe
  const showPreviewButton = hasRequiredInfo && !!previewUrl;

  return {
    previewUrl,
    publishedUrl,
    hasRequiredInfo,
    showPreviewButton,
  };
} 
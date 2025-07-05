import { useState, useEffect } from 'react';
import { BaseTemplate } from '../BaseTemplate';
import { Hero } from './components/Hero';
import { Events } from './components/Events';
import { Countdown } from './components/Countdown';
import { GallerySection } from './components/GallerySection';
import { PartyInfo } from './components/PartyInfo';
import { Social } from './components/Social';
import { Gifts } from './components/Gifts';
import { Footer } from './components/Footer';
import { WelcomeModal } from './components/WelcomeModal';
import { KidsAndPets } from './components/KidsAndPets';
import type { TemplateProps } from '../types';
import { Branding } from '../../shared/Branding';
import { useTranslation } from 'react-i18next';

export function AcuarelaTemplate({
  groomName,
  brideName,
  weddingDate,
  welcomeMessage,
  hashtag,
  ceremonyDate,
  ceremonyTime,
  ceremonyLocation,
  ceremonyAddress,
  ceremonyPlaceId,
  partyDate,
  partyTime,
  partyLocation,
  partyAddress,
  partyPlaceId,
  musicEnabled = false,
  musicUrl,
  onMusicToggle,
  coverImage,
  galleryImages = [],
  userId,
  userLanguage,
  bankInfo,
  dress_code,
  additional_info,
  accepts_kids,
  accepts_pets,
  couple_code,
  store,
  wishListItems,
  isDemo,
  bank_info_enabled,
  wish_list_enabled,
  couple_code_enabled
}: TemplateProps) {
  const [showWelcomeModal, setShowWelcomeModal] = useState(musicEnabled);
  const [autoplayMusic, setAutoplayMusic] = useState(false);
  const { i18n } = useTranslation();

  // Change language when userLanguage is provided
  useEffect(() => {
    if (userLanguage) {
      i18n.changeLanguage(userLanguage);
    }
  }, [userLanguage, i18n]);

  const handleEnterWithMusic = () => {
    setAutoplayMusic(true);
    onMusicToggle?.(true);
    setShowWelcomeModal(false);
  };

  const handleEnterWithoutMusic = () => {
    setAutoplayMusic(false);
    onMusicToggle?.(false);
    setShowWelcomeModal(false);
  };

  // Generate default hashtag if none provided
  const defaultHashtag = `${groomName.replace(/\s+/g, '')}Y${brideName.replace(/\s+/g, '')}2024`;

  return (
    <BaseTemplate
      groomName={groomName}
      brideName={brideName}
      weddingDate={weddingDate}
      musicEnabled={musicEnabled}
      musicUrl={musicUrl}
      autoplayMusic={autoplayMusic}
      onMusicToggle={onMusicToggle}
    >
      {showWelcomeModal && (
        <WelcomeModal
          groomName={groomName}
          brideName={brideName}
          onEnterWithMusic={handleEnterWithMusic}
          onEnterWithoutMusic={handleEnterWithoutMusic}
        />
      )}

      <main
        className="font-['Playfair_Display'] w-full min-h-screen bg-[#FFFFFF]"
      >
        <div className="w-full mx-auto">
          <Hero
            groomName={groomName}
            brideName={brideName}
            weddingDate={weddingDate}
            welcomeMessage={welcomeMessage}
            backgroundImage={coverImage}
            showWelcomeModal={showWelcomeModal}
            userLanguage={userLanguage}
          />

          <Countdown 
            date={weddingDate}
          />

          <Events
            userId={userId}
            ceremonyDate={ceremonyDate}
            ceremonyTime={ceremonyTime}
            ceremonyLocation={ceremonyLocation}
            ceremonyAddress={ceremonyAddress}
            ceremonyPlaceId={ceremonyPlaceId}
            partyDate={partyDate}
            partyTime={partyTime}
            partyLocation={partyLocation}
            partyAddress={partyAddress}
            partyPlaceId={partyPlaceId}
            groomName={groomName}
            brideName={brideName}
            userLanguage={userLanguage}
          />

          <KidsAndPets
            acceptsKids={accepts_kids}
            acceptsPets={accepts_pets}
          />

          <PartyInfo
            dresscode={dress_code || ''}
            musicInfo="¿Cuál es la canción que no debe faltar en la playlist de la fiesta?"
            tips={additional_info || ''}
            userId={userId}
            userLanguage={userLanguage}
          />

          <GallerySection
            images={galleryImages}
            userLanguage={userLanguage}
          />

          {/* Mesa de Regalos solo si hay alguna sección activa */}
          {(bank_info_enabled || wish_list_enabled || couple_code_enabled) && (
            <Gifts
              bankInfo={bankInfo}
              couple_code={couple_code}
              store={store}
              wishListItems={wishListItems?.map(item => ({
                ...item,
                payment_status: item.payment_status as ('pending' | 'approved' | 'rejected' | 'cancelled' | undefined)
              }))}
              isDemo={isDemo}
              showBankInfo={bank_info_enabled}
              showWishList={wish_list_enabled}
              showCoupleCode={couple_code_enabled}
            />
          )}

          <Social
            hashtag={hashtag || defaultHashtag}
            userLanguage={userLanguage}
          />
          <Footer
            groomName={groomName}
            brideName={brideName}
            weddingDate={weddingDate}
            className="bg-[#303D5D]"
            userLanguage={userLanguage}
          />

          <div className="w-full max-w-3xl mx-auto">
            <Branding />
          </div>
        </div>
      </main>
    </BaseTemplate>
  );
}
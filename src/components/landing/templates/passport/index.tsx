import { useState } from 'react';
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
import { InfiniteGallery } from '../../shared/InfiniteGallery';
import { Branding } from '../../shared/Branding';

export function PassportTemplate({
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

      <main className="font-['Playfair_Display'] bg-[#4C1C1D] w-full">
        <div className="w-full">
          <Hero
            groomName={groomName}
            brideName={brideName}
            weddingDate={weddingDate}
            welcomeMessage={welcomeMessage}
            backgroundImage={coverImage}
            className="bg-[#4C1C1D]"
            showWelcomeModal={showWelcomeModal}
          />

          <Countdown 
            date={weddingDate}
            className="bg-[#4C1C1D]"
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
            className="bg-[#4C1C1D]"
            groomName={groomName}
            brideName={brideName}
          />

          <KidsAndPets
            acceptsKids={accepts_kids}
            acceptsPets={accepts_pets}
            className="bg-[#4C1C1D]"
          />

          <PartyInfo
            dresscode={dress_code || ''}
            musicInfo="¿Cuál es la canción que no debe faltar en la playlist de la fiesta?"
            tips={additional_info || ''}
            className="bg-[#4C1C1D]"
            userId={userId}
          />

          <GallerySection
            images={galleryImages}
            className="bg-[#4C1C1D]"
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
              className="bg-[#4C1C1D]"
              isDemo={isDemo}
              showBankInfo={bank_info_enabled}
              showWishList={wish_list_enabled}
              showCoupleCode={couple_code_enabled}
            />
          )}

          <Social
            hashtag={hashtag || defaultHashtag}
            className="bg-[#4C1C1D]"
          />

          <InfiniteGallery
            images={galleryImages}
            frameColor="#D4B572"
            className="bg-[#4C1C1D]"
          />

          <Footer
            groomName={groomName}
            brideName={brideName}
            weddingDate={weddingDate}
            className="bg-[#4C1C1D]"
          />

          <Branding />
        </div>
      </main>
    </BaseTemplate>
  );
}
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

export function LuzNaturalTemplate({
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

      <main className="font-['Playfair_Display'] bg-[#F5FFF5] w-full">
        <div className="w-full">
          <Hero
            groomName={groomName}
            brideName={brideName}
            weddingDate={weddingDate}
            welcomeMessage={welcomeMessage}
            className="bg-[#F5FFF5]"
            showWelcomeModal={showWelcomeModal}
            coverImage={coverImage}
          />

          <Countdown 
            date={weddingDate}
            className="bg-[#F5FFF5]"
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
            className="bg-[#F5FFF5]"
            groomName={groomName}
            brideName={brideName}
          />

          <KidsAndPets
            acceptsKids={accepts_kids}
            acceptsPets={accepts_pets}
            className='#540A17'
          />

          <PartyInfo
            dresscode={dress_code || 'Formal'}
            musicInfo="¿Cuál es la canción que no debe faltar en la playlist de la fiesta?"
            tips={additional_info || 'La celebración será al aire libre'}
            className="bg-[#F5FFF5]"
            userId={userId}
            textColor="#c8a784"
          />

          <GallerySection
            images={galleryImages}
            className="bg-[#F5FFF5]"
            textColor="#c8a784"
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
            className="bg-[#FEFCFA]"
            textColor="#c8a784"
              showBankInfo={bank_info_enabled}
              showWishList={wish_list_enabled}
              showCoupleCode={couple_code_enabled}
          />
          )}

          <Social
            hashtag={hashtag || defaultHashtag}
            className="bg-[#F5FFF5]"
          />

          <InfiniteGallery
            images={galleryImages}
            frameColor="#FABE5A"
            className="bg-[#F5FFF5]"
          />

          <Footer
            groomName={groomName}
            brideName={brideName}
            weddingDate={weddingDate}
            className="bg-[#FABE5A]"
          />
        </div>
      </main>
    </BaseTemplate>
  );
}
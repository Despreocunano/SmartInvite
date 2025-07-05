import { useState } from 'react';
import { Music2, Shirt, Lightbulb, X } from 'lucide-react';
import { Button } from '../../../../ui/Button';
import { SpotifySearch } from '../../../shared/SpotifySearch';
import { motion } from 'framer-motion';
import rosas from '../assets/cover.webp'
import { InfoModal } from '../../../shared/InfoModal';
import { useTranslation } from 'react-i18next';

interface PartyInfoProps {
  dresscode: string;
  musicInfo?: string;
  tips: string;
  className?: string;
  userId?: string;
}

export function PartyInfo({
  dresscode = 'Formal',
  tips = 'La celebración será al aire libre',
  className = '',
  userId
}: PartyInfoProps) {
  const { t } = useTranslation('templates');
  const [showMusicModal, setShowMusicModal] = useState(false);
  const [showDressCodeModal, setShowDressCodeModal] = useState(false);
  const [showTipsModal, setShowTipsModal] = useState(false);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <>
      <motion.section 
        className={`py-24 px-4 ${className}`}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={container}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            variants={item}
          >
            <h2 className="text-5xl md:text-6xl font-parisienne text-white mb-2">
              {t('party_info.title')}
            </h2>
            <p className="text-xl text-center text-[#cfd6bb]">
              {t('party_info.subtitle')}
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1: Dress Code (con imagen decorativa) */}
            <div className="relative">
              {/* Imagen decorativa detrás */}
              <motion.img 
                src={rosas} 
                alt="Rosas decorativas" 
                className="absolute -top-16 -left-32 w-64 h-64 object-contain z-0 pointer-events-none"
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ 
                  type: "spring",
                  stiffness: 200,
                  damping: 15
                }}
              />
              {/* Card */}
              <motion.div 
                className="bg-[#575756] rounded-2xl p-8 text-center shadow-lg relative z-10 min-h-[450px] flex flex-col gap-8"
                variants={item}
              >
                <h3 className="text-4xl font-parisienne text-white">{t('party_info.dress_code')}</h3>
                <motion.div 
                  className="flex items-center justify-center mx-auto my-4"
                  whileHover={{ rotate: 15 }}
                >
                  <Shirt className="w-16 h-16 text-white" />
                </motion.div>
                <h3 className="text-xl text-[#cfd6bb] font-sans mb-4">{t('party_info.dress_code_description')}</h3>
                <Button
                  onClick={() => setShowDressCodeModal(true)}
                  className="w-full rounded-lg bg-[#B87600] hover:bg-[#6F6F6E] text-[#2B2B2B] hover:text-white mt-4 font-sans"
                >
                  {t('party_info.see_more')}
                </Button>
              </motion.div>
            </div>
            
            {/* Card 2: Música (sin imagen decorativa) */}
            <div className="relative">
              <motion.div 
                className="bg-[#575756] rounded-2xl p-8 text-center shadow-lg relative z-10 min-h-[450px] flex flex-col gap-8"
                variants={item}
              >
                <h3 className="text-4xl font-parisienne text-white">{t('party_info.music')}</h3>
                <motion.div 
                  className="flex items-center justify-center mx-auto my-4"
                  whileHover={{ rotate: 15 }}
                >
                  <Music2 className="w-16 h-16 text-white" />
                </motion.div>
                <h3 className="text-xl text-[#cfd6bb] font-sans mb-4">{t('party_info.music_description')}</h3>
                <Button
                  onClick={() => setShowMusicModal(true)}
                  className="w-full rounded-lg bg-[#B87600] hover:bg-[#6F6F6E] text-[#2B2B2B] hover:text-white mt-4 font-sans"
                >
                  {t('party_info.suggest_song')}
                </Button>
              </motion.div>
            </div>
            
            {/* Card 3: Info Adicional (sin imagen decorativa) */}
            <div className="relative">
              <motion.div 
                className="bg-[#575756] rounded-2xl p-8 text-center shadow-lg relative z-10 min-h-[450px] flex flex-col gap-8"
                variants={item}
              >
                <h3 className="text-4xl font-parisienne text-white">{t('party_info.additional_info')}</h3>
                <motion.div 
                  className="flex items-center justify-center mx-auto my-4"
                  whileHover={{ rotate: 15 }}
                >
                  <Lightbulb className="w-16 h-16 text-white" />
                </motion.div>
                <h3 className="text-xl text-[#cfd6bb] font-sans mb-4">{t('party_info.additional_info_description')}</h3>
                <Button
                  onClick={() => setShowTipsModal(true)}
                  className="w-full rounded-lg bg-[#B87600] hover:bg-[#6F6F6E] text-[#2B2B2B] hover:text-white mt-4 font-sans"
                >
                  {t('party_info.see_more')}
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Music Modal */}
      <InfoModal
        isOpen={showMusicModal}
        onClose={() => setShowMusicModal(false)}
        title={t('party_info.suggest_songs')}
        icon={Music2}
        iconColor="#B87600"
        overlayColor="#2B2B2B"
      >
        <div className="space-y-6">
          <SpotifySearch
            userId={userId}
            maxTracks={2}
          />
        </div>
      </InfoModal>

      {/* Dress Code Modal */}
      <InfoModal
        isOpen={showDressCodeModal}
        onClose={() => setShowDressCodeModal(false)}
        title={t('party_info.dress_code')}
        icon={Shirt}
        iconColor="#B87600"
        overlayColor="#2B2B2B"
      >
        <p className="text-lg leading-relaxed whitespace-pre-wrap text-[#00534E]">
          {dresscode}
        </p>
      </InfoModal>

      {/* Tips Modal */}
      <InfoModal
        isOpen={showTipsModal}
        onClose={() => setShowTipsModal(false)}
        title={t('party_info.additional_info')}
        icon={Lightbulb}
        iconColor="#B87600"
        overlayColor="#2B2B2B"
      >
        <p className="text-lg leading-relaxed whitespace-pre-wrap text-[#00534E]">
          {tips}
        </p>
      </InfoModal>
    </>
  );
}
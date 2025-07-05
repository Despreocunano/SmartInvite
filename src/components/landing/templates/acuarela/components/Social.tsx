import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { CameraIcon } from '../animations/camera';
import bgHero from '../assets/bg-piccure.png';


export function Social({ hashtag, className = '', userLanguage = 'es' }: { hashtag?: string; className?: string; userLanguage?: string }) {
  const { t } = useTranslation('templates');
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };


  return (
    <motion.section 
      className={`px-4 ${className} relative overflow-hidden`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={container}
    >
      <motion.div 
        className="bg-[#FBFAF8] w-full max-w-3xl mx-auto flex flex-col items-center justify-center px-8 py-24 text-center relative z-10 gap-16"
        style={{
          backgroundImage: `url(${bgHero})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: '100% auto',
        }}
      >
        {/* Icono y título */}
        <div className="flex flex-col items-center gap-12 mb-8">
<CameraIcon />
          <h2 className="text-6xl font-libre text-[#be8750] mb-4">{t('social.share_photos')}</h2>
        </div>

        {/* Hashtag */}
        <div className="max-w-xl mx-auto mb-16 space-y-8">
          <div className="inline-block bg-white/90 border border-[#303D5D]/50 rounded-full px-8 py-5 relative">
            <p className="text-2xl font-light text-[#303D5D] tracking-wide">#{hashtag}</p>
          </div>
        </div>

        {/* Galería de imágenes */}
        {/* ... si hay imágenes ... */}
      </motion.div>
    </motion.section>
  );
}
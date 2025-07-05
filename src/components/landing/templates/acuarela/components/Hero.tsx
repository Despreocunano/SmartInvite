import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import topRight from '../assets/top_right.png';
import topLeft from '../assets/top_left.png';


interface HeroProps {
  groomName: string;
  brideName: string;
  weddingDate: string;
  welcomeMessage?: string;
  backgroundImage?: string;
  className?: string;
  showWelcomeModal?: boolean;
  userLanguage?: string;
}

export function Hero({
  groomName,
  brideName,
  weddingDate,
  welcomeMessage,
  className = '',
  showWelcomeModal = false,
  userLanguage = 'es'
}: HeroProps) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 100]);
  const { t } = useTranslation('templates');

  const date = new Date(weddingDate);
  let formattedDate;
  
  if (userLanguage === 'en') {
    // English format: MM.DD.YYYY
    formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}.${date.getFullYear()}`;
  } else {
    // Spanish format: DD.MM.YYYY
    formattedDate = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
  }

  // Delay animations until welcome modal is closed
  const baseDelay = showWelcomeModal ? 1 : 0;

  return (
    <section className={`relative min-h-screen flex items-center justify-center px-4 ${className}`}>
      {/* Imagen decorativa esquina superior izquierda */}
      <img
        src={topLeft}
        alt="Decoración esquina superior izquierda"
        className="absolute top-0 left-0 z-30 w-52 md:w-96 pointer-events-none select-none"
        style={{ objectFit: 'contain' }}
        draggable={false}
      />
            <img
        src={topRight}
        alt="Decoración esquina superior izquierda"
        className="absolute top-0 right-0 z-30 w-52 md:w-[600px] pointer-events-none select-none"
        style={{ objectFit: 'contain' }}
        draggable={false}
      />

      <div
        className="relative z-20 bg-[#FBFAF8] w-full max-w-3xl mx-auto min-h-[95vh] flex flex-col items-center justify-center px-4 lg:px-8 py-10 lg:py-20 mt-16 md:mt-20"
      >
        <div className="text-center text-[#303D5D] w-90% lg:w-1/2 mt-20">
          {/* Names */}
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: baseDelay + 0.4 }}
          >
            <h1 className="text-5xl md:text-7xl font-normal uppercase font-libre">
              {groomName}
              <span className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-[#BE8750]/30 backdrop-blur-sm rounded-full mx-4 md:mx-8 text-3xl md:text-4xl font-libre italic">
                &
              </span> 
              {brideName}
            </h1>
          </motion.div>
          {/* Date */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: baseDelay + 0.2 }}
          >
            <p className="text-xl font-sans tracking-wider">
              {t('hero.celebrate_wedding')}
            </p>
            <p className="text-4xl md:text-5xl font-light tracking-wider mt-4 font-ivyora">
              {formattedDate}
            </p>
          </motion.div>
          {/* Welcome Message */}
          {welcomeMessage && (
            <motion.div 
              className="max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: baseDelay + 0.6 }}
            >
              <blockquote className="text-xl font-light italic leading-relaxed">
                "{welcomeMessage}"
              </blockquote>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
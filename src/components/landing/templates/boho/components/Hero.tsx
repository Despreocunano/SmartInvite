import { motion, useScroll, useTransform } from 'framer-motion';
import bgImage from '../assets/flores-bg.png'

interface HeroProps {
  groomName: string;
  brideName: string;
  weddingDate: string;
  welcomeMessage?: string;
  backgroundImage?: string;
  className?: string;
  showWelcomeModal?: boolean;
}

export function Hero({
  groomName,
  brideName,
  weddingDate,
  welcomeMessage,
  className = '',
  showWelcomeModal = false
}: HeroProps) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 100]);

  const formattedDate = new Date(weddingDate).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).replace(/\//g, '.');

  // Delay animations until welcome modal is closed
  const baseDelay = showWelcomeModal ? 1 : 0;

  return (
    <section className={`relative min-h-screen flex items-center justify-center px-4 ${className}`}>
      {/* Imagen de flores central, detrás del arco */}
      <img
        src={bgImage}
        alt="Flores decorativas"
        className="absolute left-1/2 -top-10 md:-bottom-10 -translate-x-1/2 z-0 w-full pointer-events-none select-none"
        style={{ objectFit: 'contain' }}
        draggable={false}
      />

      {/* Arco central */}
      <div
        className="relative z-20 bg-[#f9f6f2] rounded-t-full w-full max-w-4xl mx-auto min-h-[90vh] flex flex-col items-center justify-centerp px-4 lg:px-8 py-32 lg:py-20 mt-20"
      >
        <div className="text-center text-[#985E4C] w-90% lg:w-1/2 mt-20">
          {/* Names */}
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: baseDelay + 0.4 }}
          >
            <h1 className="text-5xl md:text-7xl font-normal uppercase font-ivyora">
              {groomName}
              <span className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-[#FECBB4]/30 backdrop-blur-sm rounded-full mx-4 md:mx-8 text-3xl md:text-4xl font-ivyora italic">
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
              CELEBRAMOS NUESTRA BODA EL
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
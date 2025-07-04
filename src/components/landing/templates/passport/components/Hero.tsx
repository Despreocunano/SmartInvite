import { motion, useScroll, useTransform } from 'framer-motion';
// import backgroundImage from '../assets/fondo_esmeralda.webp'
// import topFlowers_a from '../assets/Grupo01_a.webp'
// import topFlowers_b from '../assets/Grupo01_b.webp'
// import topFlowers_c from '../assets/Grupo01_c.webp'
import mundo from '../assets/mundo.svg';

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
    <section className={`relative w-full min-h-screen overflow-hidden ${className}`}>
      {/* Fondo con imagen del mundo */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none select-none z-0">
        <img
          src={mundo}
          alt="Fondo mundo"
          className="w-full h-full object-contain opacity-20"
          style={{ maxWidth: '900px', maxHeight: '90vh' }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full min-h-screen flex items-center justify-center px-4">
        <div className="text-center text-white max-w-4xl mx-auto w-full">
          {/* Date */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: baseDelay + 0.2 }}
          >
            <div className="inline-block">
              <div className="w-auto h-px bg-white mb-4"></div>
              <p className="text-3xl font-light tracking-wider">
                {formattedDate}
              </p>
              <div className="w-auto h-px bg-white mt-4"></div>
            </div>
          </motion.div>

          {/* Names */}
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: baseDelay + 0.4 }}
          >
            <h1 className="text-7xl md:text-8xl font-light font-elsie">
              {groomName}
              <span className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-[#CFD6BA]/30 backdrop-blur-sm rounded-full mx-4 md:mx-8 text-3xl md:text-7xl font-elsie">
                &
              </span> 
              {brideName}
            </h1>
          </motion.div>

          {/* Welcome Message */}
          {welcomeMessage && (
            <motion.div 
              className="max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: baseDelay + 0.6 }}
            >
              <blockquote className="text-xl md:text-2xl font-light leading-relaxed">
                "{welcomeMessage}"
              </blockquote>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
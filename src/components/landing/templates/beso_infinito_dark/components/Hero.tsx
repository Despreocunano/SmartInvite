import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import topCenter from '../assets/hero_2.webp';
import topLeft from '../assets/hero_1.webp';
import topRight from '../assets/hero_3.webp';

import verticalSeparator from '../assets/curva_portada_vertical.svg';
import horizontalSeparator from '../assets/curva_portada_horizontal.webp';

interface HeroProps {
  groomName: string;
  brideName: string;
  weddingDate: string;
  welcomeMessage?: string;
  className?: string;
  showWelcomeModal?: boolean;
  coverImage?: string;
}

export function Hero({
  groomName,
  brideName,
  weddingDate,
  welcomeMessage,
  className = '',
  showWelcomeModal = false,
  coverImage
}: HeroProps) {
  const formattedDate = new Date(weddingDate).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).replace(/\//g, '.');

  // Delay animations until welcome modal is closed
  const baseDelay = showWelcomeModal ? 1 : 0;

  return (
    <div className={`w-full ${className}`}>
      {/* Mobile and Desktop Layout */}
      <div className="flex flex-col md:flex-row w-full">
        {/* Left Side - Background Image (50% on desktop, full height on mobile) */}
        <div className="w-full md:w-1/2 h-[57vh] md:h-screen relative">
          <img 
            src={coverImage || "https://images.pexels.com/photos/1058277/pexels-photo-1058277.jpeg"} 
            alt="Wedding background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#202831]/40"></div>
        </div>
        
        {/* Horizontal Separator - Only visible on mobile */}
          <img 
            src={horizontalSeparator} 
            alt="Decorative horizontal separator"
            className="block md:hidden w-full h-auto transform -translate-y-1/2 -mt-16"
          />        
        {/* Vertical Separator - Only visible on desktop */}
        <div className="hidden md:block absolute left-[47%] top-0 h-full z-0 transform -translate-x-1/2">
          <img 
            src={verticalSeparator} 
            alt="Decorative separator"
            className="h-full w-auto"
          />
        </div>
        
        {/* Right Side - Content Panel (50% on desktop, full width on mobile) */}
        <div className="w-full md:w-1/2 min-h-[20vh] md:min-h-screen flex items-center justify-center pb-16 md:pb-6 relative">
          {/* Top Flowers */}
          <motion.img
            src={topLeft}
            alt="Floral decoration"
            className="absolute hidden md:block -top-4 transform -translate-x-1/2 w-2/3 object-contain z-20"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: baseDelay + 0.4 }}
          />
                    <motion.img
            src={topCenter}
            alt="Floral decoration"
            className="absolute hidden md:block -top-4 transform -translate-x-1/2 w-2/3 object-contain z-30"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: baseDelay + 0.2 }}
          />
                    <motion.img
            src={topRight}
            alt="Floral decoration"
            className="absolute hidden md:block -top-4 transform -translate-x-1/2 w-2/3 object-contain z-20"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: baseDelay + 0.4 }}
          />

          {/* Main Content */}
          <div className="text-center text-[#FFFCE8] max-w-md mx-auto z-20 pt-0 md:pt-14">
            {/* Date */}
            <motion.div
              className="mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: baseDelay + 0.6 }}
            >
              <div className="inline-block border border-[#77ABAE] px-4 py-1 font-fraunces font-bold text-white/90 text-xl tracking-widest uppercase">
                <p>{formattedDate}</p>
              </div>
            </motion.div>

            {/* Names */}
            <motion.div
              className="mb-12 md:mb-12"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: baseDelay + 0.8 }}
            >
              <h1 className="text-7xl lg:text-8xl font-extrabold font-fraunces text-[#76ABAE]">
                {groomName}
                <span className="block text-3xl md:text-4xl lg:text-5xl font-lora font-normal">
                  &
                </span>
                {brideName}
              </h1>
            </motion.div>

            {/* Welcome Message */}
            {welcomeMessage && (
              <motion.div
                className="max-w-4xl mx-auto text-center font-lora text-white/90"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: baseDelay + 1 }}
              >
                <div className="relative">
                  <Quote className="absolute -top-2 -left-0 w-6 h-6 text-[#77ABAE] transform rotate-180" />
                  <blockquote className="text-xl md:text-lg lg:text-2xl font-sans leading-relaxed px-6 py-6">
                    {welcomeMessage}
                  </blockquote>
                  <Quote className="absolute -bottom-2 -right-0 w-6 h-6 text-[#77ABAE]" />
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
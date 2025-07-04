import { useState } from 'react';
import { Music2, Shirt, Lightbulb, X } from 'lucide-react';
import { Button } from '../../../../ui/Button';
import { SpotifySearch } from '../../../shared/SpotifySearch';
import { motion } from 'framer-motion';
import { InfoModal } from '../../../shared/InfoModal';
import grassBg from '../assets/top_left.png';

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
  const [showMusicModal, setShowMusicModal] = useState(false);

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
        className={`relative overflow-visible px-4 ${className}`}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={container}
      >
        {/* Fondo decorativo grass, realmente detrás del bloque */}
        <img
          src={grassBg}
          alt="Fondo césped decorativo"
          className="absolute left-20 top-0 -translate-x-1/2 z-0 w-[40%] pointer-events-none select-none"
          style={{ objectFit: 'contain' }}
          draggable={false}
        />
        {/* Bloque principal */}
        <div className="relative z-10 bg-[#FBFAF8] w-full max-w-3xl mx-auto flex flex-col items-center justify-center px-4 lg:px-8 py-16">
          <motion.div 
            className="text-center mb-16"
            variants={item}
          >
            <h2 className="text-6xl font-libre text-[#303D5D] mb-4">
              Información de la Fiesta
            </h2>
            <p className="text-2xl text-center font-sans text-[#303D5D]">
            Hagamos juntos una fiesta épica. Aquí algunos detalles a tener en cuenta.
            </p>
          </motion.div>
          
          <div className="flex flex-col gap-8">
            {/* Card 1: Dress Code */}
            <motion.div 
              className="bg-[#303D5D] w-full rounded-2xl p-8 shadow-lg relative z-10 min-h-[140px] flex flex-col md:flex-row items-center gap-8 text-center md:text-left"
              variants={item}
            >
              {/* Icono */}
              <motion.div 
                className="flex-shrink-0 flex items-center justify-center mx-auto md:mx-0 my-4 md:my-0"
                whileHover={{ rotate: 15 }}
              >
                <Shirt className="w-16 h-16 text-white" />
              </motion.div>
              {/* Contenido */}
              <div className="flex-1 flex flex-col justify-center items-center md:items-start gap-4">
                <h3 className="text-2xl font-sans text-[#BE8750]">Dress Code</h3>
                <p className="text-sm font-sans text-white mb-4 uppercase">{dresscode}</p>
              </div>
            </motion.div>

            {/* Card 2: Música */}
            <motion.div 
              className="bg-[#303D5D] w-full rounded-2xl p-8 shadow-lg relative min-h-[140px] flex flex-col md:flex-row items-center gap-8 text-center md:text-left"
              variants={item}
            >
              {/* Icono */}
              <motion.div 
                className="flex-shrink-0 flex items-center justify-center mx-auto md:mx-0 my-4 md:my-0"
                whileHover={{ rotate: 15 }}
              >
                <Music2 className="w-16 h-16 text-white" />
              </motion.div>
              {/* Contenido */}
              <div className="flex-1 flex flex-col justify-center items-center md:items-start gap-4">
                <h3 className="text-2xl font-sans text-[#BE8750]">Música</h3>
                <Button
                  onClick={() => setShowMusicModal(true)}
                  variant="secondary"
                  className="hover:bg-[#F7F6F2]/80 border-[#F7F6F2] text-white hover:text-[#985E4C] px-3 py-1 w-36 rounded-xl font-sans"
                >
                  Sugerir canción
                </Button>
              </div>
            </motion.div>

            {/* Card 3: Info Adicional */}
            <motion.div 
              className="bg-[#303D5D] w-full rounded-2xl p-8 shadow-lg relative z-10 min-h-[140px] flex flex-col md:flex-row items-center gap-8 text-center md:text-left"
              variants={item}
            >
              {/* Icono */}
              <motion.div 
                className="flex-shrink-0 flex items-center justify-center mx-auto md:mx-0 my-4 md:my-0"
                whileHover={{ rotate: 15 }}
              >
                <Lightbulb className="w-16 h-16 text-white" />
              </motion.div>
              {/* Contenido */}
              <div className="flex-1 flex flex-col justify-center items-center md:items-start gap-4">
                <h3 className="text-2xl font-sans text-[#BE8750]">Info Adicional</h3>
                <p className="text-sm font-sans text-white mb-4 uppercase">{tips}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Music Modal */}
      <InfoModal
        isOpen={showMusicModal}
        onClose={() => setShowMusicModal(false)}
        title="Sugerir Canciones"
        icon={Music2}
        iconColor="#708565"
        overlayColor="#708565"
      >
        <div className="space-y-6">
          <SpotifySearch
            userId={userId}
            maxTracks={2}
          />
        </div>
      </InfoModal>

    </>
  );
}
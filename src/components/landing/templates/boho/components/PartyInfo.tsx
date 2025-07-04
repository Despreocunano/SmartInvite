import { useState } from 'react';
import { Music2, Shirt, Lightbulb, X } from 'lucide-react';
import { Button } from '../../../../ui/Button';
import { SpotifySearch } from '../../../shared/SpotifySearch';
import { motion } from 'framer-motion';
import { InfoModal } from '../../../shared/InfoModal';
import grassBg from '../assets/grass.png';

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
        <div className="relative z-10 bg-[#f9f6f2] w-full max-w-4xl mx-auto flex flex-col items-center justify-center px-4 lg:px-8 py-16">
          <motion.div 
            className="text-center mb-16"
            variants={item}
          >
            <h2 className="text-6xl font-ivyora text-[#985E4C] mb-4">
              Información de la Fiesta
            </h2>
            <p className="text-2xl text-center font-sans text-[#985E4C]">
            Hagamos juntos una fiesta épica. Aquí algunos detalles a tener en cuenta.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1: Dress Code (con imagen decorativa) */}
              {/* Card */}
              <motion.div 
                className="bg-[#985E4C] rounded-2xl p-8 text-center shadow-lg relative z-10 min-h-[350px] flex flex-col gap-8"
                variants={item}
              >
                <h3 className="text-3xl font-sans text-white">Dress Code</h3>
                <motion.div 
                  className="flex items-center justify-center mx-auto my-4"
                  whileHover={{ rotate: 15 }}
                >
                  <Shirt className="w-16 h-16 text-white" />
                </motion.div>
                <p className="text-lg font-sans text-white mb-4 uppercase"> {dresscode}</p>
    
              </motion.div>
    
            
            {/* Card 2: Música (sin imagen decorativa) */}
            <div className="relative">
              <motion.div 
                className="bg-[#985E4C] rounded-2xl p-8 text-center shadow-lg relative min-h-[350px] flex flex-col gap-8"
                variants={item}
              >
                <h3 className="text-3xl font-sans text-white">Música</h3>
                <motion.div 
                  className="flex items-center justify-center mx-auto my-4"
                  whileHover={{ rotate: 15 }}
                >
                  <Music2 className="w-16 h-16 text-white" />
                </motion.div>
                <Button
                  onClick={() => setShowMusicModal(true)}
                  variant="secondary"
                  className=" hover:bg-[#F7F6F2]/80 border-[#F7F6F2] text-white hover:text-[#985E4C] px-6 py-2 w-48 mx-auto rounded-xl font-sans"
                >
                  Sugerir canción
                </Button>
              </motion.div>
            </div>
            
            {/* Card 3: Info Adicional (sin imagen decorativa) */}
            <div className="relative">
              <motion.div 
                className="bg-[#985E4C] rounded-2xl p-8 text-center shadow-lg relative z-10 min-h-[350px] flex flex-col gap-8"
                variants={item}
              >
                <h3 className="text-3xl font-sans text-white">Info Adicional</h3>
                <motion.div 
                  className="flex items-center justify-center mx-auto my-4"
                  whileHover={{ rotate: 15 }}
                >
                  <Lightbulb className="w-16 h-16 text-white" />
                </motion.div>
                <p className="text-lg font-sans text-white mb-4 uppercase">{tips}</p>

              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Music Modal */}
      <InfoModal
        isOpen={showMusicModal}
        onClose={() => setShowMusicModal(false)}
        title="Sugerir Canciones"
        icon={Music2}
        iconColor="#C49C79"
        overlayColor="#051B24"
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
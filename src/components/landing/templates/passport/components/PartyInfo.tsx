import { useState } from 'react';
import { Music2, Shirt, Lightbulb, X } from 'lucide-react';
import { Button } from '../../../../ui/Button';
import { SpotifySearch } from '../../../shared/SpotifySearch';
import { motion } from 'framer-motion';
import { InfoModal } from '../../../shared/InfoModal';

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
            <h2 className="text-5xl md:text-7xl font-elsie text-white mb-6">
              Información de la Fiesta
            </h2>
            <p className="text-2xl text-center text-white font-sans">
            Hagamos juntos una fiesta épica. Aquí algunos detalles a tener en cuenta.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative">
              {/* Card */}
              <motion.div 
                className="bg-[#c5a467] rounded-2xl p-8 text-center shadow-lg relative z-10 min-h-[450px] flex flex-col gap-8"
                variants={item}
              >
                <h3 className="text-4xl font-poppins text-white">Dress Code</h3>
                <motion.div 
                  className="flex items-center justify-center mx-auto my-4"
                  whileHover={{ rotate: 15 }}
                >
                  <Shirt className="w-16 h-16 text-white" />
                </motion.div>
                <h3 className="text-xl font-poppins text-[#cfd6bb] mb-4">Una orientación para que elijas tu mejor vestuario</h3>
                <Button
                  onClick={() => setShowDressCodeModal(true)}
                  variant="secondary"
                  className="font-poppins w-full rounded-full bg-[#CFD6BA] text-[#4C1C1E] uppercase hover:bg-[#4C1C1E] hover:border-[#4C1C1E] hover:text-white mt-4"
                >
                  Ver más
                </Button>
              </motion.div>
            </div>
            
            {/* Card 2: Música (sin imagen decorativa) */}
            <div className="relative">
              <motion.div 
                className="bg-[#c5a467] rounded-2xl p-8 text-center shadow-lg relative z-10 min-h-[450px] flex flex-col gap-8"
                variants={item}
              >
                <h3 className="text-4xl font-poppins text-white">Música</h3>
                <motion.div 
                  className="flex items-center justify-center mx-auto my-4"
                  whileHover={{ rotate: 15 }}
                >
                  <Music2 className="w-16 h-16 text-white" />
                </motion.div>
                <h3 className="text-xl font-poppins text-[#cfd6bb] mb-4">¿Cuál es la canción que no debe faltar en la playlist?</h3>
                <Button
                  onClick={() => setShowMusicModal(true)}
                  variant="secondary"
                  className="font-poppins w-full rounded-full bg-[#CFD6BA] text-[#4C1C1E] uppercase hover:bg-[#4C1C1E] hover:border-[#4C1C1E] hover:text-white mt-4"
                >
                  Sugerir canción
                </Button>
              </motion.div>
            </div>
            
            {/* Card 3: Info Adicional (sin imagen decorativa) */}
            <div className="relative">
              <motion.div 
                className="bg-[#c5a467] rounded-2xl p-8 text-center shadow-lg relative z-10 min-h-[450px] flex flex-col gap-8"
                variants={item}
              >
                <h3 className="text-4xl font-poppins text-white">Info Adicional</h3>
                <motion.div 
                  className="flex items-center justify-center mx-auto my-4"
                  whileHover={{ rotate: 15 }}
                >
                  <Lightbulb className="w-16 h-16 text-white" />
                </motion.div>
                <h3 className="text-xl font-poppins text-[#cfd6bb] mb-4">Información adicional para tener en cuenta</h3>
                <Button
                  onClick={() => setShowTipsModal(true)}
                  variant="secondary"
                  className="font-poppins w-full rounded-full bg-[#CFD6BA] text-[#4C1C1E] uppercase hover:bg-[#4C1C1E] hover:border-[#4C1C1E] hover:text-white mt-4"
                >
                  Ver más
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
        title="Sugerir Canciones"
        icon={Music2}
        iconColor="#4B1C1D"
        overlayColor="#4B1C1D"
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
        title="Código de Vestimenta"
        icon={Shirt}
        iconColor="#4B1C1D"
        overlayColor="#4B1C1D"
      >
        <p className="text-lg leading-relaxed whitespace-pre-wrap text-[#00534E]">
          {dresscode}
        </p>
      </InfoModal>

      {/* Tips Modal */}
      <InfoModal
        isOpen={showTipsModal}
        onClose={() => setShowTipsModal(false)}
        title="Información Adicional"
        icon={Lightbulb}
        iconColor="#4B1C1D"
        overlayColor="#4B1C1D"
      >
        <p className="text-lg leading-relaxed whitespace-pre-wrap text-[#00534E]">
          {tips}
        </p>
      </InfoModal>
    </>
  );
}
import { useState } from 'react';
import { Music2, Shirt, Lightbulb, X } from 'lucide-react';
import { Button } from '../../../../ui/Button';
import { SpotifySearch } from '../../../shared/SpotifySearch';
import { motion } from 'framer-motion';
import rosas from '../assets/flores_partyinfo.webp'
import { InfoModal } from '../../../shared/InfoModal';
import  lineas  from '../assets/divisor-generico.svg'

interface PartyInfoProps {
  dresscode: string;
  musicInfo?: string;
  tips: string;
  className?: string;
  userId?: string;
  textColor?: string;
}

export function PartyInfo({
  dresscode = 'Formal',
  tips = 'La celebración será al aire libre',
  className = '',
  userId,
  textColor = '#c8a784'
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
      <img src={lineas} alt="Líneas decorativas" className="w-full h-auto mb-20" style={{ display: 'block', marginLeft: 0, marginRight: 0 }} />
      <motion.section 
        className={`pb-24 px-4 ${className}`}
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
            <h2 className="text-5xl md:text-6xl font-fraunces text-white mb-2">
              Información de la Fiesta
            </h2>
            <p className={`text-xl text-center font-sans text-[${textColor}]`}>
            Hagamos juntos una fiesta épica. Aquí algunos detalles a tener en cuenta.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1: Dress Code (con imagen decorativa) */}
            <div className="relative">
              {/* Imagen decorativa detrás */}
              <motion.img 
                src={rosas} 
                alt="Rosas decorativas" 
                className="absolute -top-10 -left-8 md:-top-16 md:-left-20 w-24 h-24 md:w-52 md:h-52  object-contain z-50 pointer-events-none"
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
                className="bg-[#C5A07F] rounded-2xl p-8 text-center shadow-lg relative z-10 min-h-[450px] flex flex-col gap-8"
                variants={item}
              >
                <h3 className="text-4xl font-fraunces text-white">Dress Code</h3>
                <motion.div 
                  className="flex items-center justify-center mx-auto my-4"
                  whileHover={{ rotate: 15 }}
                >
                  <Shirt className="w-16 h-16 text-white" />
                </motion.div>
                <h3 className="text-xl font-sans text-[#540A17] mb-4">Una orientación para que elijas tu mejor vestuario</h3>
                <Button
                  onClick={() => setShowDressCodeModal(true)}
                  variant="secondary"
                  className="w-full rounded-full bg-white text-[#540A17] uppercase hover:bg-[#540A17] hover:border-[#540A17] hover:text-white mt-4"
                >
                  Ver más
                </Button>
              </motion.div>
            </div>
            
            {/* Card 2: Música (sin imagen decorativa) */}
            <div className="relative">
              <motion.div 
                className="bg-[#C5A07F] rounded-2xl p-8 text-center shadow-lg relative z-10 min-h-[450px] flex flex-col gap-8"
                variants={item}
              >
                <h3 className="text-4xl font-fraunces text-white">Música</h3>
                <motion.div 
                  className="flex items-center justify-center mx-auto my-4"
                  whileHover={{ rotate: 15 }}
                >
                  <Music2 className="w-16 h-16 text-white" />
                </motion.div>
                <h3 className="text-xl font-sans text-[#540A17] mb-4">¿Cuál es la canción que no debe faltar en la playlist de la fiesta?</h3>
                <Button
                  onClick={() => setShowMusicModal(true)}
                  variant="secondary"
                  className="w-full rounded-full bg-white text-[#540A17] uppercase hover:bg-[#540A17] hover:border-[#540A17] hover:text-white mt-4"
                >
                  Sugerir canción
                </Button>
              </motion.div>
            </div>
            
            {/* Card 3: Info Adicional (sin imagen decorativa) */}
            <div className="relative">
              <motion.div 
                className="bg-[#C5A07F] rounded-2xl p-8 text-center shadow-lg relative z-10 min-h-[450px] flex flex-col gap-8"
                variants={item}
              >
                <h3 className="text-4xl font-fraunces text-white">Info Adicional</h3>
                <motion.div 
                  className="flex items-center justify-center mx-auto my-4"
                  whileHover={{ rotate: 15 }}
                >
                  <Lightbulb className="w-16 h-16 text-white" />
                </motion.div>
                <h3 className="text-xl font-sans text-[#540A17] mb-4">Información adicional para tener en cuenta</h3>
                <Button
                  onClick={() => setShowTipsModal(true)}
                  variant="secondary"
                  className="w-full rounded-full bg-white text-[#540A17] uppercase hover:bg-[#540A17] hover:border-[#540A17] hover:text-white mt-4"
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
        iconColor="#540A17"
        overlayColor="#540A17"
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
        iconColor="#540A17"
        overlayColor="#540A17"
      >
        <p className="text-lg leading-relaxed whitespace-pre-wrap text-[#540A17]">
          {dresscode}
        </p>
      </InfoModal>

      {/* Tips Modal */}
      <InfoModal
        isOpen={showTipsModal}
        onClose={() => setShowTipsModal(false)}
        title="Información Adicional"
        icon={Lightbulb}
        iconColor="#540A17"
        overlayColor="#540A17"
      >
        <p className="text-lg leading-relaxed whitespace-pre-wrap text-[#540A17]">
          {tips}
        </p>
      </InfoModal>
    </>
  );
}
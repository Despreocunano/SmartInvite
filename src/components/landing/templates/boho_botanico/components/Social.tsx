import { motion } from 'framer-motion';
import { CameraIcon } from '../animations/camera';


export function Social({ hashtag, className = '' }: { hashtag?: string; className?: string }) {
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
        className="bg-[#F5F7F2] w-full max-w-4xl mx-auto flex flex-col items-center justify-center px-8 py-16 text-center relative z-10 gap-16"
      >
        {/* Icono y título */}
        <div className="flex flex-col items-center gap-8 mb-8">
<CameraIcon />
          <h2 className="text-6xl font-ivyora text-[#869484] mb-4">Comparte tus Fotos</h2>
        </div>

        {/* Hashtag */}
        <div className="max-w-xl mx-auto mb-16 space-y-8">
          <div className="inline-block bg-white/90 border border-[#869484]/50 rounded-full px-8 py-5 relative">
            <p className="text-2xl font-light text-[#869484] tracking-wide">#{hashtag}</p>
          </div>
        </div>

        {/* Galería de imágenes */}
        {/* ... si hay imágenes ... */}
      </motion.div>
    </motion.section>
  );
}
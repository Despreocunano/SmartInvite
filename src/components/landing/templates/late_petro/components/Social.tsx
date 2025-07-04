import { motion } from 'framer-motion';
import side_1 from '../assets/side_1.webp'
import side_2 from '../assets/side_2.webp'
import { CameraIcon } from '../animations/camera';
import { Instagram } from 'lucide-react';


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
      className={`py-28 px-4 ${className} relative overflow-hidden`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={container}
    >
      {/* Rosas decorativas */}
      <div className="absolute inset-0 overflow-hidden -scale-x-100">
        <motion.img
          src={side_1}
          alt="Rosa decorativa"
          className="absolute -left-0 top-0 md:top-1/4 -translate-y-1/2 w-32 md:w-64"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        <motion.img
          src={side_2}
          alt="Rosa decorativa"
          className="absolute -left-0 md:top-1/4 -translate-y-1/2 w-32 md:w-64"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        />
      </div>

      <motion.div 
        className="max-w-4xl mx-auto text-center relative z-10 flex flex-col gap-16"
      >
        {/* Icono y título */}
        <div className="flex flex-col items-center gap-8 mb-8">
<CameraIcon />
          <h2 className="text-7xl md:text-8xl font-carattere text-[#C49C79] mb-3">Comparte tus Fotos</h2>
        </div>

        {/* Hashtag */}
        <div className="max-w-xl mx-auto mb-16 space-y-8">
          <div className="inline-block bg-white/90 backdrop-blur-sm border border-[#F8BBD9]/50 rounded-full px-8 py-5 relative shadow-lg">
            <p className="text-2xl font-light text-[#2D1B69] tracking-wide drop-shadow">#{hashtag}</p>
          </div>
        </div>

        {/* Galería de imágenes */}
        {/* ... si hay imágenes ... */}
      </motion.div>
    </motion.section>
  );
}
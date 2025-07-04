import { motion } from 'framer-motion';
import side_1 from '../assets/side_1.webp'
import side_2 from '../assets/side_2.webp'
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
          <h2 className="text-7xl md:text-8xl font-carattere text-[#3E3F33] mb-3">Comparte tus Fotos</h2>
        </div>

        {/* Hashtag */}
        <div className="max-w-xl mx-auto mb-16 space-y-8">
          <div className="relative flex items-center justify-center min-h-[60px]">
            <div
              className="absolute inset-0 z-0 w-full h-full"
              style={{
                background: '#DAA267',
                clipPath: 'polygon(100% 0%, 95% 50%, 100% 100%, 0% 100%, 5% 50%, 0% 0%)',
                opacity: 0.7,
              }}
            />
            <p className="text-3xl md:text-4xl font-light text-white tracking-wide relative z-10 px-8 py-3">#{hashtag}</p>
          </div>
        </div>

        {/* Galería de imágenes */}
        {/* ... si hay imágenes ... */}
      </motion.div>
    </motion.section>
  );
}
import { Gallery } from '../../../shared/Gallery';
import { motion } from 'framer-motion';


interface GallerySectionProps {
  images: string[];
  className?: string;
}

export function GallerySection({ images, className = '' }: GallerySectionProps) {
  if (!images?.length) return null;

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
    <motion.section 
      className={`px-4 ${className}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={container}
    >
      <div className="bg-[#f9f6f2] w-full max-w-4xl mx-auto flex flex-col items-center justify-center px-8 py-16">
        <motion.div className="text-center mb-12" variants={item}>
          <h2 className="text-6xl font-ivyora text-[#985E4C] mb-4">
          Retratos de Nuestro Amor
          </h2>
          <p className="text-2xl text-center font-sans text-[#985E4C]">
          Un minuto, un segundo, un instante que queda en la eternidad.
          </p>
        </motion.div>

        <Gallery 
          images={images}
          frameColor="#985E4C"
        />
      </div>
    </motion.section>
  );
}
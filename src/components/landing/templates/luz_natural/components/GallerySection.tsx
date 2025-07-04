import { Gallery } from '../../../shared/Gallery';
import { motion } from 'framer-motion';


interface GallerySectionProps {
  images: string[];
  className?: string;
  textColor?: string;
}

export function GallerySection({ images, className = '', textColor = '#cfd6bb' }: GallerySectionProps) {
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
      className={`py-12 px-4 ${className}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={container}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div className="text-center mb-12" variants={item}>
          <h2 className="text-5xl md:text-6xl font-abril text-[#FABE5A] mb-2">
          Retratos de Nuestro Amor
          </h2>
          <p className="text-2xl font-libre text-[#9db677] text-center">
          Un minuto, un segundo, un instante que queda en la eternidad.
          </p>
        </motion.div>

        <Gallery 
          images={images}
        />
      </div>
    </motion.section>
  );
}
import { Gallery } from '../../../shared/Gallery';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';


interface GallerySectionProps {
  images: string[];
  className?: string;
  userLanguage?: string;
}

export function GallerySection({ images, className = '', userLanguage = 'es' }: GallerySectionProps) {
  const { t } = useTranslation('templates');
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
      <div className="bg-[#FBFAF8] w-full max-w-3xl mx-auto flex flex-col items-center justify-center px-8 py-16">
        <motion.div className="text-center mb-12" variants={item}>
          <h2 className="text-6xl font-libre text-[#303D5D] mb-4">
            {t('gallery.title')}
          </h2>
          <p className="text-2xl text-center font-sans text-[#303D5D]">
            {t('gallery.subtitle')}
          </p>
        </motion.div>

        <Gallery 
          images={images}
          frameColor="#303D5D"
        />
      </div>
    </motion.section>
  );
}
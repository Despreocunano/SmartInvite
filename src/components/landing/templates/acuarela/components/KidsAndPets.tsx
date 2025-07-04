import { Baby, PawPrint } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface KidsAndPetsProps {
  acceptsKids: boolean;
  acceptsPets: boolean;
  className?: string;
}

export function KidsAndPets({ acceptsKids, acceptsPets, className = '' }: KidsAndPetsProps) {
  const { t } = useTranslation('templates');
  if (!acceptsKids && !acceptsPets) return null;

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

  const content = (
    <div className={`grid ${acceptsKids && acceptsPets ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-8`}>
      {acceptsKids && (
        <motion.div 
          className="bg-[#303D5D] rounded-xl p-8 text-center border border-[#CFD6BA]/20"
          variants={item}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.div 
            className="w-16 h-16 bg-[#CFD6BA]/20 rounded-full flex items-center justify-center mx-auto mb-6"
            whileHover={{ rotate: 15 }}
          >
            <Baby className="w-12 h-12 text-white" />
          </motion.div>
          <h3 className="text-2xl font-sans mb-4 text-[#BE8750]">{t('kids_and_pets.kids_title')}</h3>
          <p className="text-white text-lg leading-relaxed font-sans">
            {t('kids_and_pets.kids_description')}
          </p>
        </motion.div>
      )}
      {acceptsPets && (
        <motion.div 
          className="bg-[#303D5D] rounded-xl p-8 text-center border border-[#CFD6BA]/20"
          variants={item}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.div 
            className="w-16 h-16 bg-[#CFD6BA]/20 rounded-full flex items-center justify-center mx-auto mb-6"
            whileHover={{ rotate: 15 }}
          >
            <PawPrint className="w-12 h-12 text-white" />
          </motion.div>
          <h3 className="text-2xl font-sans mb-4 text-[#BE8750]">{t('kids_and_pets.pets_title')}</h3>
          <p className="text-white text-lg leading-relaxed font-sans">
            {t('kids_and_pets.pets_description')}
          </p>
        </motion.div>
      )}
    </div>
  );

  return (
    <section className={`px-4 ${className}`}>
      <motion.div 
        className="bg-[#FBFAF8] w-full max-w-3xl mx-auto flex flex-col items-center justify-center px-8 py-16"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={container}
      >
        <motion.div className="text-center mb-12" variants={item}>
          <h2 className="text-6xl font-libre text-[#303D5D] mb-4">
            {t('kids_and_pets.title')}
          </h2>
        </motion.div>
        {content}
      </motion.div>
    </section>
  );
} 
import { Instagram } from 'lucide-react';
import { Button } from '../../../../ui/Button';
import { motion } from 'framer-motion';
import rosa_a from '../assets/side_01.webp'
import rosa_b from '../assets/side_02.webp'
import { CameraIcon } from '../animations/camera';


interface SocialProps {
  hashtag?: string;
  instagramPosts?: Array<{
    id: string;
    imageUrl: string;
    caption?: string;
  }>;
  className?: string;
}

export function Social({ hashtag, instagramPosts = [], className = '' }: SocialProps) {
  const handleInstagramClick = () => {
    window.open(`https://www.instagram.com/explore/tags/${hashtag?.toLowerCase()}`, '_blank');
  };

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
      className={`py-24 px-4 ${className} relative overflow-hidden`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={container}
    >
      {/* Rosas decorativas */}
      <div className="absolute -right-8 md:-right-24 top-0 h-full w-40 md:w-60 -scale-x-100">
        {/* Rosas decorativas */}
        <motion.img
          src={rosa_a}
          alt="Rosa decorativa"
          className="absolute left-4 md:left-14 top-0 md:top-[7%] -translate-y-1/2 w-32 md:w-64 z-0"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.7 }}
        />
        
        <motion.img
          src={rosa_b}
          alt="Rosa decorativa"
          className="absolute left-4 md:left-14 top-0 md:top-[7%] -translate-y-1/2 w-32 md:w-64 z-10"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
        />
      </div>

      <motion.div 
        className="max-w-4xl mx-auto text-center relative z-10"
        variants={item}
      >
          <CameraIcon />   
          <h2 className="text-5xl md:text-6xl font-fraunces text-white mb-6">Comparte tus Fotos</h2>
          
        
        <motion.div 
          className="max-w-xl mx-auto mb-12 space-y-6"
          variants={item}
        >
          <div className="inline-block bg-white/90 backdrop-blur-sm border border-[#F8BBD9]/50 rounded-full px-6 py-3 relative">

            <p className="text-2xl font-light text-[#2D1B69]">
              #{hashtag}
            </p>
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleInstagramClick}
              className="bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90 text-white"
              leftIcon={<Instagram className="w-5 h-5" />}
            >
              Ver en Instagram
            </Button>
          </motion.div>
        </motion.div>
        
        {instagramPosts.length > 0 && (
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            variants={container}
          >
            {instagramPosts.map((post, index) => (
              <motion.div 
                key={post.id}
                className="aspect-square overflow-hidden rounded-xl border border-[#F8BBD9]/30"
                variants={item}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img
                  src={post.imageUrl}
                  alt={post.caption || 'Instagram post'}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </motion.section>
  );
}
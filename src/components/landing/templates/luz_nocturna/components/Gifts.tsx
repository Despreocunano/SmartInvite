import { useState } from 'react';
import { Gift, Copy, Check } from 'lucide-react';
import { Button } from '../../../../ui/Button';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import rosa_a from '../assets/flores_a.webp'
import rosa_b from '../assets/flores_b.webp'
import rosa_c from '../assets/flores_c.webp'
import { GiftsIcon } from '../animations/gifts'
import { InfoModal } from '../../../shared/InfoModal';
import { WishListModal, WishListItem } from '../../../shared/WishListModal';

interface GiftsProps {
  bankInfo?: {
    accountHolder: string;
    rut: string;
    bank: string;
    accountType: string;
    accountNumber: string;
    email: string;
  };
  couple_code?: string;
  store?: string;
  wishListItems?: WishListItem[];
  className?: string;
  textColor?: string;
  showBankInfo?: boolean;
  showWishList?: boolean;
  showCoupleCode?: boolean;
}

export function Gifts({ bankInfo, couple_code, store, wishListItems = [], className = '', textColor = '#cfd6bb', showBankInfo = false, showWishList = false, showCoupleCode = false }: GiftsProps) {
  const [showModal, setShowModal] = useState(false);
  const [showWishListModal, setShowWishListModal] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const handleCopyAll = async () => {
    if (!bankInfo) return;

    const text = `${bankInfo.accountHolder}
${bankInfo.rut}
${bankInfo.accountType}
${bankInfo.accountNumber}
${bankInfo.bank}
${bankInfo.email}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Datos copiados al portapapeles');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Error al copiar los datos');
    }
  };

  return (
    <>
      <motion.section 
        className={`py-24 px-4 ${className} relative`}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={container}
      >
        {/* Rosas decorativas */}
        <motion.img
          src={rosa_a}
          alt="Rosa decorativa"
          className="absolute -left-2 md:-left-2 top-[4%] md:top-[7%] -translate-y-1/2 w-48 md:w-96 z-0"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
        />
        
        <motion.img
          src={rosa_b}
          alt="Rosa decorativa"
          className="absolute -left-2 md:-left-8 top-[8%] md:top-[20%] -translate-y-1/2 w-24 md:w-52 z-10"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
        />
                <motion.img
          src={rosa_c}
          alt="Rosa decorativa"
          className="absolute -left-2 md:-left-8 top-[12%] md:top-[35%] -translate-y-1/2 w-16 md:w-52 z-10"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
        />
        <motion.div 
          className="max-w-6xl mx-auto text-center"
          variants={item}
        >
          <GiftsIcon />
          
          <h2 className="text-5xl md:text-6xl font-abril text-[#FABE5A] mb-2">Mesa de Regalos</h2>
                    
          <motion.p 
            className="text-2xl font-libre text-[#9db677] text-center mb-6"
            variants={item}
          >
            Tu presencia es nuestro mejor regalo. Sin embargo, si deseas hacernos un obsequio, aquí tienes la información necesaria.
          </motion.p>
          
          <div className="flex flex-col md:flex-row gap-8 justify-center">
            {showBankInfo && bankInfo && (
              <motion.button
                onClick={() => setShowModal(true)}
                className="bg-[#9DB677] rounded-xl p-8 shadow-lg border border-[#CFD6BA]/20 w-full md:w-[400px]"
                variants={item}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h3 className="text-3xl font-libre mb-2 text-white">Datos Bancarios</h3>
                <p className="text-[#404040]/80 text-lg leading-relaxed font-sans mb-4">
                  Información para transferencia
                </p>
                <div className="bg-[#CFD6BA]/30 rounded-lg p-3 h-[72px] flex items-center justify-center">
                  <p className="text-[#33040D] font-sans text-sm">
                    Haz clic para ver los datos de transferencia
                  </p>
                </div>
              </motion.button>
            )}

            {showWishList && wishListItems.length > 0 && (
              <motion.button
                onClick={() => setShowWishListModal(true)}
                className="bg-[#9DB677] rounded-xl p-8 shadow-lg border border-[#CFD6BA]/20 w-full md:w-[400px]"
                variants={item}
              >
                <h3 className="text-3xl font-libre mb-2 text-white">Lista de Deseos</h3>
                <p className="text-[#404040]/80 text-lg leading-relaxed font-sans mb-4">
                  Regalos que nos harían muy felices
                </p>
                <div className="bg-[#CFD6BA]/30 rounded-lg p-3 h-[72px] flex items-center justify-center">
                  <p className="text-[#33040D] text-sm font-sans">
                    Haz clic para ver nuestra lista de deseos
                  </p>
                </div>
              </motion.button>
            )}

            {showCoupleCode && couple_code && store && (
              <motion.div
                className="bg-[#9DB677] rounded-xl p-8 shadow-lg border border-[#CFD6BA]/20 w-full md:w-[400px]"
                variants={item}
              >
                <h3 className="text-3xl font-libre mb-2 text-white">Lista de Regalos</h3>
                <p className="text-[#404040]/80 text-lg leading-relaxed font-sans mb-4">
                  Información de nuestra lista de regalos
                </p>
                <div className="bg-[#CFD6BA]/30 rounded-lg p-3 h-[72px] flex flex-col justify-center">
                  <p className="text-[#33040D] text-lg font-mono">Código: {couple_code}</p>
                  <p className="text-[#33040D] text-sm font-sans">Tienda: {store === 'falabella' ? 'Falabella' : 'Paris'}</p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.section>

      <InfoModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Datos Bancarios"
        icon={Gift}
        iconColor="#FABE5A"
        overlayColor="#333333"
      >
        {bankInfo ? (
          <div className="space-y-6">
            <div className="bg-[#333]/10 rounded-lg border border-[#333]/20 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#333]/80">Titular</p>
                  <p className="text-[#333]">{bankInfo.accountHolder}</p>
                </div>
                <div>
                  <p className="text-sm text-[#333]/80">RUT</p>
                  <p className="text-[#333]">{bankInfo.rut}</p>
                </div>
                <div>
                  <p className="text-sm text-[#333]/80">Banco</p>
                  <p className="text-[#333]">{bankInfo.bank}</p>
                </div>
                <div>
                  <p className="text-sm text-[#333]/80">Tipo de Cuenta</p>
                  <p className="text-[#333]">{bankInfo.accountType}</p>
                </div>
                <div>
                  <p className="text-sm text-[#333]/80">Número de Cuenta</p>
                  <p className="text-[#333]">{bankInfo.accountNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-[#333]/80">Email</p>
                  <p className="text-[#333]">{bankInfo.email}</p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleCopyAll}
              className="bg-[#FABE5A] text-[#012D27] hover:bg-[#333] hover:text-[#FFF] rounded-lg border hover:border-[#CFD6BA]"
              leftIcon={copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
            >
              {copied ? 'Copiado' : 'Copiar Datos'}
            </Button>
          </div>
        ) : (
          <p className="text-center text-[#CFD6BA]/80 py-8">
            Pronto encontrarás aquí la información bancaria para realizar tu regalo.
          </p>
        )}
      </InfoModal>

      <WishListModal
        isOpen={showWishListModal}
        onClose={() => setShowWishListModal(false)}
        wishListItems={wishListItems}
      />
    </>
  );
}
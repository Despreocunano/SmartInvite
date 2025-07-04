import { useState } from 'react';
import { Gift, Copy, Check } from 'lucide-react';
import { Button } from '../../../../ui/Button';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import side_1 from '../assets/side_1.webp'
import side_2 from '../assets/side_2.webp'
import { InfoModal } from '../../../shared/InfoModal';
import { WishListModal, WishListItem } from '../../../shared/WishListModal';
import { GiftsIcon } from '../animations/gifts';


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
  isDemo?: boolean;
  showBankInfo?: boolean;
  showWishList?: boolean;
  showCoupleCode?: boolean;
}

export function Gifts({ bankInfo, couple_code, store, wishListItems = [], className = '', isDemo, showBankInfo = false, showWishList = false, showCoupleCode = false }: GiftsProps) {
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
          src={side_1}
          alt="Rosa decorativa"
          className="absolute -left-6 md:-left-0 top-0 md:top-1/4 -translate-y-1/2 w-32 md:w-64"
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        <motion.img
          src={side_2}
          alt="Rosa decorativa"
          className="absolute -left-6 md:-left-6 top-0 md:top-1/4 -translate-y-1/2 w-32 md:w-64"
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        />

        <motion.div 
          className="max-w-6xl mx-auto text-center"
          variants={item}
        >
         < GiftsIcon /> 
          <h2 className="text-7xl md:text-8xl font-carattere text-[#3E3F33] mb-6">Mesa de Regalos</h2>
           <div className='max-w-4xl mx-auto mb-8'>        
          <motion.p 
            className="text-2xl text-center font-sans text-[#767168]"
            variants={item}
          >
            Tu presencia es nuestro mejor regalo. Sin embargo, si deseas hacernos un obsequio, aquí tienes la información necesaria.
          </motion.p>
          </div> 
          
          <div className="flex flex-col md:flex-row gap-8 justify-center">
            {showBankInfo && bankInfo && (
              <motion.button
                onClick={() => setShowModal(true)}
                className="bg-[#A19567] rounded-xl p-8 shadow-lg border border-[#CFD6BA]/20 w-full md:w-[400px]"
                variants={item}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h3 className="text-2xl font-sans mb-2 text-white">Datos Bancarios</h3>
                <p className="text-white/80 text-lg mb-2 font-sans">
                  Información para transferencia
                </p>
                <div className="bg-[#CFD6BA]/10 rounded-lg p-3 h-[72px] flex items-center justify-center">
                  <p className="text-white text-lg font-sans">
                    Haz clic para ver los datos de transferencia
                  </p>
                </div>
              </motion.button>
            )}
            {showWishList && wishListItems.length > 0 && (
              <motion.button
                onClick={() => setShowWishListModal(true)}
                className="bg-[#A19567] rounded-xl p-8 shadow-lg border border-[#CFD6BA]/20 w-full md:w-[400px]"
                variants={item}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h3 className="text-2xl font-sans mb-2 text-white">Lista de Deseos</h3>
                <p className="text-white/80 text-lg mb-2 font-sans">
                  Regalos que nos harían muy felices
                </p>
                <div className="bg-[#CFD6BA]/10 rounded-lg p-3 h-[72px] flex items-center justify-center">
                  <p className="text-white text-lg font-sans">
                    Haz clic para ver nuestra lista de deseos
                  </p>
                </div>
              </motion.button>
            )}
            {showCoupleCode && couple_code && store && (
              <motion.div
                className="bg-[#A19567] rounded-xl p-8 shadow-lg border border-[#CFD6BA]/20 w-full md:w-[400px]"
                variants={item}
              >
                <h3 className="text-2xl font-sans mb-2 text-white">Lista de Regalos</h3>
                <p className="text-white/80 text-lg mb-2 font-sans">
                  Información de nuestra lista de regalos
                </p>
                <div className="bg-[#CFD6BA]/10 rounded-lg p-3 h-[72px] flex flex-col justify-center">
                  <p className="text-white text-lg font-sans">Código: {couple_code}</p>
                  <p className="text-white/80 text-sm font-sans">Tienda: {store === 'falabella' ? 'Falabella' : 'Paris'}</p>
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
        iconColor="#C49C79"
        overlayColor="#A19567"
      >
        {bankInfo ? (
          <div className="space-y-6">
            <div className="bg-[#051B24]/10 rounded-lg border border-[#051B24]/20 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#000]/80 font-sans">Titular</p>
                  <p className="text-[#051B24] font-sans">{bankInfo.accountHolder}</p>
                </div>
                <div>
                  <p className="text-sm text-[#051B24]/80 font-sans">RUT</p>
                  <p className="text-[#051B24] font-sans">{bankInfo.rut}</p>
                </div>
                <div>
                  <p className="text-sm text-[#051B24]/80 font-sans">Banco</p>
                  <p className="text-[#051B24] font-sans">{bankInfo.bank}</p>
                </div>
                <div>
                  <p className="text-sm text-[#051B24]/80 font-sans">Tipo de Cuenta</p>
                  <p className="text-[#051B24] font-sans">{bankInfo.accountType}</p>
                </div>
                <div>
                  <p className="text-sm text-[#051B24]/80 font-sans">Número de Cuenta</p>
                  <p className="text-[#051B24] font-sans">{bankInfo.accountNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-[#051B24]/80 font-sans">Email</p>
                  <p className="text-[#051B24] font-sans">{bankInfo.email}</p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleCopyAll}
              className="bg-[#CFD6BA] text-[#012D27] hover:bg-[#012D27] hover:text-[#CFD6BA] rounded-full border hover:border-[#CFD6BA]"
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
        isDemo={isDemo}
      />
    </>
  );
}
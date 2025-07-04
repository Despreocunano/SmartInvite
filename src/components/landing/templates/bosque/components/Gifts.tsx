import { useState } from 'react';
import { Gift, Copy, Check } from 'lucide-react';
import { Button } from '../../../../ui/Button';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import rosa_a from '../assets/Grupo02_a.webp'
import rosa_b from '../assets/Grupo02_b.webp'
import rosa_c from '../assets/Grupo02_c.webp'
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
          src={rosa_c}
          alt="Rosa decorativa"
          className="absolute -left-6 md:-left-16 top-1/6 -translate-y-1/2 w-32 md:w-64"
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        <motion.img
          src={rosa_b}
          alt="Rosa decorativa"
          className="absolute -left-6 md:-left-16 top-1/6 -translate-y-1/2 w-32 md:w-64"
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        />
        <motion.img
          src={rosa_a}
          alt="Rosa decorativa"
          className="absolute -left-6 md:-left-16 top-1/6 -translate-y-1/2 w-32 md:w-64"
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
        />

        <motion.div 
          className="max-w-6xl mx-auto text-center"
          variants={item}
        >
         < GiftsIcon /> 
          <h2 className="text-5xl md:text-6xl font-parisienne text-white mb-6">Mesa de Regalos</h2>
                    
          <motion.p 
            className="text-xl text-[#cfd6bb] mb-8 max-w-2xl mx-auto"
            variants={item}
          >
            Tu presencia es nuestro mejor regalo. Sin embargo, si deseas hacernos un obsequio, aquí tienes la información necesaria.
          </motion.p>
          
          <div className="flex flex-col md:flex-row gap-8 justify-center">
            {showBankInfo && bankInfo && (
              <motion.button
                onClick={() => setShowModal(true)}
                className="bg-[#094831] rounded-xl p-8 shadow-lg border border-[#CFD6BA]/20 w-full md:w-[400px]"
                variants={item}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h3 className="text-xl font-serif mb-2 text-[#CFD6BA]">Datos Bancarios</h3>
                <p className="text-[#CFD6BA]/80 text-lg mb-2">
                  Información para transferencia
                </p>
                <div className="bg-[#CFD6BA]/10 rounded-lg p-3 h-[72px] flex items-center justify-center">
                  <p className="text-[#CFD6BA] text-lg">
                    Haz clic para ver los datos de transferencia
                  </p>
                </div>
              </motion.button>
            )}
            {showWishList && wishListItems.length > 0 && (
              <motion.button
                onClick={() => setShowWishListModal(true)}
                className="bg-[#094831] rounded-xl p-8 shadow-lg border border-[#CFD6BA]/20 w-full md:w-[400px]"
                variants={item}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h3 className="text-xl font-serif mb-2 text-[#CFD6BA]">Lista de Deseos</h3>
                <p className="text-[#CFD6BA]/80 text-lg mb-2">
                  Regalos que nos harían muy felices
                </p>
                <div className="bg-[#CFD6BA]/10 rounded-lg p-3 h-[72px] flex items-center justify-center">
                  <p className="text-[#CFD6BA] text-lg">
                    Haz clic para ver nuestra lista de deseos
                  </p>
                </div>
              </motion.button>
            )}
            {showCoupleCode && couple_code && store && (
              <motion.div
                className="bg-[#094831] rounded-xl p-8 shadow-lg border border-[#CFD6BA]/20 w-full md:w-[400px]"
                variants={item}
              >
                <h3 className="text-xl font-serif mb-2 text-[#CFD6BA]">Lista de Regalos</h3>
                <p className="text-[#CFD6BA]/80 text-lg mb-2">
                  Información de nuestra lista de regalos
                </p>
                <div className="bg-[#CFD6BA]/10 rounded-lg p-3 h-[72px] flex flex-col justify-center">
                  <p className="text-[#CFD6BA] text-lg font-mono">Código: {couple_code}</p>
                  <p className="text-[#CFD6BA]/80 text-sm">Tienda: {store === 'falabella' ? 'Falabella' : 'Paris'}</p>
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
        iconColor="#b87600"
        overlayColor="#012D27"
      >
        {bankInfo ? (
          <div className="space-y-6">
            <div className="bg-[#CFD6BA]/10 rounded-lg border border-[#CFD6BA]/20 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#00534E]/80">Titular</p>
                  <p className="text-[#00534E]">{bankInfo.accountHolder}</p>
                </div>
                <div>
                  <p className="text-sm text-[#00534E]/80">RUT</p>
                  <p className="text-[#00534E]">{bankInfo.rut}</p>
                </div>
                <div>
                  <p className="text-sm text-[#00534E]/80">Banco</p>
                  <p className="text-[#00534E]">{bankInfo.bank}</p>
                </div>
                <div>
                  <p className="text-sm text-[#00534E]/80">Tipo de Cuenta</p>
                  <p className="text-[#00534E]">{bankInfo.accountType}</p>
                </div>
                <div>
                  <p className="text-sm text-[#00534E]/80">Número de Cuenta</p>
                  <p className="text-[#00534E]">{bankInfo.accountNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-[#00534E]/80">Email</p>
                  <p className="text-[#00534E]">{bankInfo.email}</p>
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
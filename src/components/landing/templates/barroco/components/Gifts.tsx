import { useState } from 'react';
import { Gift, Copy, Check } from 'lucide-react';
import { Button } from '../../../../ui/Button';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
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
  showBankInfo?: boolean;
  showWishList?: boolean;
  showCoupleCode?: boolean;
}

export function Gifts({ bankInfo, couple_code, store, wishListItems = [], className = '', showBankInfo = false, showWishList = false, showCoupleCode = false }: GiftsProps) {
  const [showBankModal, setShowBankModal] = useState(false);
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
        <motion.div 
          className="max-w-6xl mx-auto text-center"
          variants={item}
        >
          <GiftsIcon /> 
          <h2 className="text-4xl md:text-6xl font-fraunces font-extrabold text-[#B87600] mb-4">Mesa de Regalos</h2>
          <motion.p 
            className="text-xl font-rubik text-[#8D6E63] mb-4"
            variants={item}
          >
            Tu presencia es nuestro mejor regalo. Sin embargo, si deseas hacernos un obsequio, aquí tienes la información necesaria.
          </motion.p>
          <div className="flex flex-col md:flex-row gap-8 justify-center">
            {showBankInfo && bankInfo && (
              <motion.button
                onClick={() => setShowBankModal(true)}
                className="bg-[#FCF3E8] backdrop-blur-sm rounded-2xl p-8 border border-[#333333]/30 w-full md:w-[400px] hover:bg-white transition-colors duration-200"
                variants={item}
              >
                <h3 className="text-2xl font-poppins mb-2 text-[#333333]">Datos Bancarios</h3>
                <p className="text-[#333333] text-sm mb-2 font-poppins">
                  Información para transferencia
                </p>
                <div className="bg-[#333333]/5 rounded-lg p-3 h-[72px] flex items-center justify-center">
                  <p className="text-[#333333] text-sm mb-2 font-poppins">
                    Haz clic para ver los datos de transferencia
                  </p>
                </div>
              </motion.button>
            )}

            {showWishList && wishListItems.length > 0 && (
              <motion.button
                onClick={() => setShowWishListModal(true)}
                className="bg-[#FCF3E8] backdrop-blur-sm rounded-2xl p-8 border border-[#333333]/30 w-full md:w-[400px] hover:bg-white transition-colors duration-200"
                variants={item}
              >
                <h3 className="text-2xl font-poppins mb-2 text-[#333333]">Lista de Deseos</h3>
                <p className="text-[#333333] text-sm mb-2 font-poppins">
                  Regalos que nos harían muy felices
                </p>
                <div className="bg-[#333333]/5 rounded-lg p-3 h-[72px] flex items-center justify-center">
                  <p className="text-[#333333] text-sm mb-2 font-poppins">
                    Haz clic para ver nuestra lista de deseos
                  </p>
                </div>
              </motion.button>
            )}

            {showCoupleCode && couple_code && store && (
              <motion.div
                className="bg-[#FCF3E8] rounded-2xl p-8 border border-[#333333]/30 w-full md:w-[400px]"
                variants={item}
              >
                <h3 className="text-2xl font-poppins mb-2 text-[#333333]">Lista de Regalos</h3>
                <p className="text-[#333333] text-sm mb-2 font-poppins">
                  Información de nuestra lista de regalos
                </p>
                <div className="bg-[#333333]/5 rounded-lg p-3 h-[72px] flex flex-col justify-center">
                  <p className="text-[#333333] text-sm mb-2 font-poppins">Código: {couple_code}</p>
                  <p className="text-[#333333] text-sm mb-2 font-poppins">Tienda: {store === 'falabella' ? 'Falabella' : 'Paris'}</p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.section>

      <InfoModal
        isOpen={showBankModal}
        onClose={() => setShowBankModal(false)}
        title="Datos Bancarios"
        icon={Gift}
        iconColor="#333333"
        overlayColor="#333333"
      >
        {bankInfo ? (
          <div className="space-y-6">
            <div className="bg-white/50 rounded-lg border border-[#F8BBD9]/30 p-6 font-sans">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#333333] font-sans">Titular</p>
                  <p className="text-[#333333]">{bankInfo.accountHolder}</p>
                </div>
                <div>
                  <p className="text-sm text-[#333333] font-sans">RUT</p>
                  <p className="text-[#333]">{bankInfo.rut}</p>
                </div>
                <div>
                  <p className="text-sm text-[#333] font-sans">Banco</p>
                  <p className="text-[#333]">{bankInfo.bank}</p>
                </div>
                <div>
                  <p className="text-sm text-[#333] font-sans">Tipo de Cuenta</p>
                  <p className="text-[#333333]">{bankInfo.accountType}</p>
                </div>
                <div>
                  <p className="text-sm text-[#333] font-sans">Número de Cuenta</p>
                  <p className="text-[#333]">{bankInfo.accountNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-[#333] font-sans">Email</p>
                  <p className="text-[#333]">{bankInfo.email}</p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleCopyAll}
              className="bg-[#333333] hover:bg-[#666666] text-white px-8 py-3 font-sans"
              leftIcon={copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
            >
              {copied ? 'Copiado' : 'Copiar Datos'}
            </Button>
          </div>
        ) : (
          <p className="text-xl text-center text-[#8D6E63]">
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
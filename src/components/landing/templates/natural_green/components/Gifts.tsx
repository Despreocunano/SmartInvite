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
        className={`px-4 ${className} relative`}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={container}
      >
        <motion.div 
          className="bg-[#EFEEE8] w-full max-w-3xl mx-auto flex flex-col items-center justify-center px-8 py-16 text-center"
          variants={item}
        >
         < GiftsIcon /> 
          <h2 className="text-6xl font-ivyora text-[#708565] mb-4">Mesa de Regalos</h2>
           <div className='max-w-4xl mx-auto mb-8'>        
          <motion.p 
            className="text-2xl text-center font-sans text-[#708565]"
            variants={item}
          >
            Tu presencia es nuestro mejor regalo. Sin embargo, si deseas hacernos un obsequio, aquí tienes la información necesaria.
          </motion.p>
          </div> 
          
          <div className="flex flex-col gap-4 justify-center">
            {showBankInfo && bankInfo && (
              <motion.button
                onClick={() => setShowModal(true)}
                className="bg-[#708565] rounded-xl p-8 shadow-lg border border-[#985e4c]/20 w-full"
                variants={item}
              >
                <h3 className="text-xl font-sans mb-2 text-[#FFFFFF]">Datos Bancarios</h3>
                <p className="text-[#FFFFFF]/80 text-lg mb-2 font-sans">
                  Información para transferencia
                </p>
                <div className="bg-[#CFD6BA]/10 rounded-lg p-3 h-[72px] flex items-center justify-center">
                  <p className="text-[#FFFFFF] text-lg font-sans">
                    Haz clic para ver los datos de transferencia
                  </p>
                </div>
              </motion.button>
            )}
            {showWishList && wishListItems.length > 0 && (
              <motion.button
                onClick={() => setShowWishListModal(true)}
                className="bg-[#708565] rounded-xl p-8 shadow-lg border border-[#985e4c]/20 w-full"
                variants={item}
              >
                <h3 className="text-xl font-sans mb-2 text-[#FFFFFF]">Lista de Deseos</h3>
                <p className="text-[#FFFFFF]/80 text-lg mb-2 font-sans">
                  Regalos que nos harían muy felices
                </p>
                <div className="bg-[#CFD6BA]/10 rounded-lg p-3 h-[72px] flex items-center justify-center">
                  <p className="text-[#FFFFFF] text-lg font-sans">
                    Haz clic para ver nuestra lista de deseos
                  </p>
                </div>
              </motion.button>
            )}
            {showCoupleCode && couple_code && store && (
              <motion.div
                className="bg-[#708565] rounded-xl p-8 shadow-lg border border-[#985e4c]/20 w-full"
                variants={item}
              >
                <h3 className="text-xl font-sans mb-2 text-[#FFFFFF]">Lista de Regalos</h3>
                <p className="text-[#FFFFFF]/80 text-lg mb-2 font-sans">
                  Información de nuestra lista de regalos
                </p>
                <div className="bg-[#CFD6BA]/10 rounded-lg p-3 h-[72px] flex flex-col justify-center">
                  <p className="text-[#FFFFFF] text-lg font-sans">Código: {couple_code}</p>
                  <p className="text-[#FFFFFF]/80 text-sm font-sans">Tienda: {store === 'falabella' ? 'Falabella' : 'Paris'}</p>
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
        iconColor="#708565"
        overlayColor="#708565"
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
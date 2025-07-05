import { useState } from 'react';
import { Gift, Copy, Check } from 'lucide-react';
import { Button } from '../../../../ui/Button';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { InfoModal } from '../../../shared/InfoModal';
import { WishListModal, WishListItem } from '../../../shared/WishListModal';
import { GiftsIcon } from '../animations/gifts';
import { useTranslation } from 'react-i18next';


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
  const { t } = useTranslation('templates');
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
      toast.success(t('gifts.bank_info.copy_success'));
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error(t('gifts.bank_info.copy_error'));
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
          className="bg-[#FBFAF8] w-full max-w-3xl mx-auto flex flex-col items-center justify-center px-8 py-16 text-center"
          variants={item}
        >
         < GiftsIcon /> 
          <h2 className="text-6xl font-libre text-[#303D5D] mb-4">{t('gifts.title')}</h2>
           <div className='max-w-4xl mx-auto mb-8'>        
          <motion.p 
            className="text-2xl text-center font-sans text-[#303D5D]"
            variants={item}
          >
            {t('gifts.subtitle')}
          </motion.p>
          </div> 
          
          <div className="flex flex-col gap-4 justify-center">
            {showBankInfo && bankInfo && (
              <motion.button
                onClick={() => setShowModal(true)}
                className="bg-[#303D5D] rounded-xl p-8 shadow-lg border border-[#985e4c]/20 w-full"
                variants={item}
              >
                <h3 className="text-xl font-sans mb-2 text-[#BE8750]">{t('gifts.bank_info.title')}</h3>
                <p className="text-[#FFFFFF]/80 text-lg mb-2 font-sans">
                  {t('gifts.bank_info.subtitle')}
                </p>
                <div className="bg-[#CFD6BA]/10 rounded-lg p-3 h-[72px] flex items-center justify-center">
                  <p className="text-[#FFFFFF] text-lg font-sans">
                    {t('gifts.bank_info.button_text')}
                  </p>
                </div>
              </motion.button>
            )}
            {showWishList && wishListItems.length > 0 && (
              <motion.button
                onClick={() => setShowWishListModal(true)}
                className="bg-[#303D5D] rounded-xl p-8 shadow-lg border border-[#985e4c]/20 w-full"
                variants={item}
              >
                <h3 className="text-xl font-sans mb-2 text-[#BE8750]">{t('gifts.wishlist.title')}</h3>
                <p className="text-[#FFFFFF]/80 text-lg mb-2 font-sans">
                  {t('gifts.wishlist.subtitle')}
                </p>
                <div className="bg-[#CFD6BA]/10 rounded-lg p-3 h-[72px] flex items-center justify-center">
                  <p className="text-[#FFFFFF] text-lg font-sans">
                    {t('gifts.wishlist.button_text')}
                  </p>
                </div>
              </motion.button>
            )}
            {showCoupleCode && couple_code && store && (
              <motion.div
                className="bg-[#303D5D] rounded-xl p-8 shadow-lg border border-[#985e4c]/20 w-full"
                variants={item}
              >
                <h3 className="text-xl font-sans mb-2 text-[#BE8750]">{t('gifts.couple_code.title')}</h3>
                <p className="text-[#FFFFFF]/80 text-lg mb-2 font-sans">
                  {t('gifts.couple_code.subtitle')}
                </p>
                <div className="bg-[#CFD6BA]/10 rounded-lg p-3 h-[72px] flex flex-col justify-center">
                  <p className="text-[#FFFFFF] text-lg font-sans">{t('gifts.couple_code.code_label')}: {couple_code}</p>
                  <p className="text-[#FFFFFF]/80 text-sm font-sans">{t('gifts.couple_code.store_label')}: {store === 'falabella' ? 'Falabella' : 'Paris'}</p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.section>

      <InfoModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={t('gifts.bank_info.modal_title')}
        icon={Gift}
        iconColor="#303D5D"
        overlayColor="#303D5D"
      >
        {bankInfo ? (
          <div className="space-y-6">
            <div className="bg-[#051B24]/10 rounded-lg border border-[#051B24]/20 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#000]/80 font-sans">{t('gifts.bank_info.account_holder')}</p>
                  <p className="text-[#051B24] font-sans">{bankInfo.accountHolder}</p>
                </div>
                <div>
                  <p className="text-sm text-[#051B24]/80 font-sans">{t('gifts.bank_info.rut')}</p>
                  <p className="text-[#051B24] font-sans">{bankInfo.rut}</p>
                </div>
                <div>
                  <p className="text-sm text-[#051B24]/80 font-sans">{t('gifts.bank_info.bank')}</p>
                  <p className="text-[#051B24] font-sans">{bankInfo.bank}</p>
                </div>
                <div>
                  <p className="text-sm text-[#051B24]/80 font-sans">{t('gifts.bank_info.account_type')}</p>
                  <p className="text-[#051B24] font-sans">{bankInfo.accountType}</p>
                </div>
                <div>
                  <p className="text-sm text-[#051B24]/80 font-sans">{t('gifts.bank_info.account_number')}</p>
                  <p className="text-[#051B24] font-sans">{bankInfo.accountNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-[#051B24]/80 font-sans">{t('gifts.bank_info.email')}</p>
                  <p className="text-[#051B24] font-sans">{bankInfo.email}</p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleCopyAll}
              className="bg-[#CFD6BA] text-[#012D27] hover:bg-[#012D27] hover:text-[#CFD6BA] rounded-full border hover:border-[#CFD6BA]"
              leftIcon={copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
            >
              {copied ? t('gifts.bank_info.copied') : t('gifts.bank_info.copy_button')}
            </Button>
          </div>
        ) : (
          <p className="text-center text-[#CFD6BA]/80 py-8">
            {t('gifts.bank_info.coming_soon')}
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
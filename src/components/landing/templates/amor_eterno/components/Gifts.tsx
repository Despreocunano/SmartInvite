import { useState } from 'react';
import { Gift, Copy, Check } from 'lucide-react';
import { Button } from '../../../../ui/Button';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import rosa_a from '../assets/side_a.webp'
import rosa_b from '../assets/side_b.webp'
import rosa_c from '../assets/side_c.webp'
import { InfoModal } from '../../../shared/InfoModal';
import { WishListModal, WishListItem } from '../../../shared/WishListModal';
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
  showBankInfo?: boolean;
  showWishList?: boolean;
  showCoupleCode?: boolean;
}

export function Gifts({ bankInfo, couple_code, store, wishListItems = [], className = '', showBankInfo = false, showWishList = false, showCoupleCode = false }: GiftsProps) {
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

  const handleStoreClick = () => {
    if (!store) return;
    
    let url = '';
    if (store === 'falabella') {
      url = `https://www.falabella.com/falabella-cl/collection/lista-de-regalos?code=${couple_code}`;
    } else if (store === 'paris') {
      url = `https://www.paris.cl/lista-de-regalos/${couple_code}`;
    }
    
    if (url) {
      window.open(url, '_blank');
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
          className="absolute -left-6 md:-left-16 top-1/6 -translate-y-1/2 w-32 md:w-64 z-0"
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        <motion.img
          src={rosa_b}
          alt="Rosa decorativa"
          className="absolute -left-6 md:-left-16 top-1/6 -translate-y-1/2 w-32 md:w-64 z-10"
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
          <motion.div 
            className="w-24 h-24 bg-[#CFD6BA]/30 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6"
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Gift className="w-16 h-16 text-[#CFD6BA]" />
          </motion.div>
          
          <h2 className="text-5xl md:text-6xl font-parisienne text-white mb-6">{t('gifts.title')}</h2>
                    
          <motion.p 
            className="text-xl text-[#cfd6bb] mb-8 max-w-2xl mx-auto"
            variants={item}
          >
            {t('gifts.subtitle')}
          </motion.p>
          
          <div className="flex flex-col md:flex-row gap-8 justify-center">
            {showBankInfo && bankInfo && (
              <motion.button
                onClick={() => setShowModal(true)}
                className="bg-[#575756] rounded-xl p-8 shadow-lg border border-[#CFD6BA]/20 w-full md:w-[400px]"
                variants={item}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h3 className="text-xl font-serif mb-2 text-[#CFD6BA]">{t('gifts.bank_info.title')}</h3>
                <p className="text-[#CFD6BA]/80 text-lg mb-2">
                  {t('gifts.bank_info.subtitle')}
                </p>
                <div className="bg-[#CFD6BA]/10 rounded-lg p-3 h-[72px] flex items-center justify-center">
                  <p className="text-[#CFD6BA] text-lg">
                    {t('gifts.bank_info.button_text')}
                  </p>
                </div>
              </motion.button>
            )}
            {showWishList && wishListItems.length > 0 && (
              <motion.button
                onClick={() => setShowWishListModal(true)}
                className="bg-[#575756] rounded-xl p-8 shadow-lg border border-[#CFD6BA]/20 w-full md:w-[400px]"
                variants={item}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h3 className="text-xl font-serif mb-2 text-[#CFD6BA]">{t('gifts.wishlist.title')}</h3>
                <p className="text-[#CFD6BA]/80 text-lg mb-2">
                  {t('gifts.wishlist.subtitle')}
                </p>
                <div className="bg-[#CFD6BA]/10 rounded-lg p-3 h-[72px] flex items-center justify-center">
                  <p className="text-[#CFD6BA] text-lg">
                    {t('gifts.wishlist.button_text')}
                  </p>
                </div>
              </motion.button>
            )}
            {showCoupleCode && couple_code && store && (
              <motion.div
                className="bg-[#575756] rounded-xl p-8 shadow-lg border border-[#CFD6BA]/20 w-full md:w-[400px]"
                variants={item}
              >
                <h3 className="text-xl font-serif mb-2 text-[#CFD6BA]">{t('gifts.couple_code.title')}</h3>
                <p className="text-[#CFD6BA]/80 text-lg mb-2">
                  {t('gifts.couple_code.subtitle')}
                </p>
                <div className="bg-[#CFD6BA]/10 rounded-lg p-3 h-[72px] flex flex-col justify-center">
                  <p className="text-[#CFD6BA] text-lg font-mono">{t('gifts.couple_code.code_label')}: {couple_code}</p>
                  <p className="text-[#CFD6BA]/80 text-sm">{t('gifts.couple_code.store_label')}: {store === 'falabella' ? 'Falabella' : 'Paris'}</p>
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
        iconColor="#CFD6BA"
        overlayColor="#2B2B2B"
      >
        {bankInfo ? (
          <div className="space-y-6">
            <div className="bg-[#CFD6BA]/10 rounded-lg border border-[#CFD6BA]/20 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#00534E]/80">{t('gifts.bank_info.account_holder')}</p>
                  <p className="text-[#00534E]">{bankInfo.accountHolder}</p>
                </div>
                <div>
                  <p className="text-sm text-[#00534E]/80">{t('gifts.bank_info.rut')}</p>
                  <p className="text-[#00534E]">{bankInfo.rut}</p>
                </div>
                <div>
                  <p className="text-sm text-[#00534E]/80">{t('gifts.bank_info.bank')}</p>
                  <p className="text-[#00534E]">{bankInfo.bank}</p>
                </div>
                <div>
                  <p className="text-sm text-[#00534E]/80">{t('gifts.bank_info.account_type')}</p>
                  <p className="text-[#00534E]">{bankInfo.accountType}</p>
                </div>
                <div>
                  <p className="text-sm text-[#00534E]/80">{t('gifts.bank_info.account_number')}</p>
                  <p className="text-[#00534E]">{bankInfo.accountNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-[#00534E]/80">{t('gifts.bank_info.email')}</p>
                  <p className="text-[#00534E]">{bankInfo.email}</p>
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
      />
    </>
  );
}
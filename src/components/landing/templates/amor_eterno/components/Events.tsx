import React from 'react';
import { useState, useEffect } from 'react';
import { UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../../../ui/Button';
import { PublicRsvpForm } from '../../../../forms/PublicRsvpForm';
import lineas from '../assets/lineas01.svg'
import curva from '../assets/curva01.svg'
import { InfoModal } from '../../../shared/InfoModal';
import rosa_a from '../assets/side_a.webp'
import rosa_b from '../assets/side_b.webp'
import rosa_c from '../assets/side_c.webp'
import { useTranslation } from 'react-i18next';

interface EventProps {
  title: string;
  date: string;
  time?: string;
  location: string;
  address?: string;
  placeId?: string;
  className?: string;
  variants?: any;
  onRsvp: () => void;
}

function Event({ title, date, time, location, address, placeId, className = '', variants, onRsvp }: EventProps) {
  const { t } = useTranslation('templates');
  
  const handleOpenMaps = () => {
    if (placeId) {
      window.open(`https://www.google.com/maps/place/?q=place_id:${placeId}`, '_blank');
    } else if (address) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
    }
  };

  return (
    <motion.div 
      className={`relative group ${className}`}
      variants={variants}
    >
      <div className="relative rounded-xl bg-transparent max-w-md mx-auto">

        <div className="relative -top-8 flex justify-center w-full">
          <div className="absolute bg-transparent w-[150px] h-[40px] transform -skew-y-3"></div>
          <div className="absolute bg-transparent w-[150px] h-[40px] transform skew-y-3"></div>
          <h3 className="relative z-10 text-5xl md:text-6xl font-parisienne text-white mb-6 text-center">
            {title}
          </h3>
        </div>

        <div className="p-0 md:p-10 pt-0 space-y-8">
          <div className="space-y-4 text-center">
            <h4 className="text-4xl font-parisienne text-white mb-2">{t('events.location')}</h4>
            <div className="flex flex-col items-center">
              <p className="text-lg font-lora text-[#c1b49a]">{location}</p>
            </div>
          </div>

          <div className="space-y-4 text-center">
            <h4 className="text-4xl font-parisienne text-white mb-2">{t('events.day')}</h4>
            <div className="flex items-center justify-center gap-4">
              <p className="text-lg font-lora text-[#cfd6ba]">
                {new Date(date).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              {time && (
                <span className="font-lora text-[#cfd6ba]">•</span>
              )}
              {time && (
                <span className="text-lg font-lora text-[#c1b49a]">{time}</span>
              )}
            </div>
          </div>

          {address && (
          <div className="space-y-4 text-center">
            <h4 className="text-4xl font-parisienne text-white mb-2">{t('events.address')}</h4>
              <div className="flex flex-col items-center">
                <p className="text-lg font-lora text-[#c1b49a]">{address}</p>
              </div>
            <Button
              onClick={handleOpenMaps}
              className="bg-[#B87600] hover:bg-[#575756] text-[#2B2B2B] hover:text-white px-6 py-2 w-48 mx-auto rounded-full text-base font-sans shadow-sm"
            >
              {t('events.how_to_get_there')}
            </Button>
          </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

interface EventsProps {
  userId: string;
  ceremonyDate?: string;
  ceremonyTime?: string;
  ceremonyLocation?: string;
  ceremonyAddress?: string;
  ceremonyPlaceId?: string;
  partyDate?: string;
  partyTime?: string;
  partyLocation?: string;
  partyAddress?: string;
  partyPlaceId?: string;
  className?: string;
  groomName?: string;
  brideName?: string;
}

export function Events({
  userId,
  ceremonyDate,
  ceremonyTime,
  ceremonyLocation,
  ceremonyAddress,
  ceremonyPlaceId,
  partyDate,
  partyTime,
  partyLocation,
  partyAddress,
  partyPlaceId,
  className = '',
  groomName = '',
  brideName = ''
}: EventsProps) {
  const { t } = useTranslation('templates');
  const [showRsvpModal, setShowRsvpModal] = useState(false);
  const [invitationToken, setInvitationToken] = useState<string | null>(null);
  const [showCalendarOptions, setShowCalendarOptions] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<'ceremony' | 'party' | null>(null);

  const generateCalendarLink = (type: 'google' | 'apple' | 'outlook') => {
    if (!selectedEvent) return '';

    const eventData = selectedEvent === 'ceremony' 
      ? {
          title: t('events.ceremony'),
          date: ceremonyDate,
          time: ceremonyTime,
          location: ceremonyLocation,
          address: ceremonyAddress
        }
      : {
          title: t('events.reception'),
          date: partyDate,
          time: partyTime,
          location: partyLocation,
          address: partyAddress
        };

    const eventTitle = encodeURIComponent(`Boda de ${groomName} & ${brideName}`);
    const eventLocation = encodeURIComponent(eventData.address || eventData.location || '');
    const startDate = new Date(eventData.date || '');
    const endDate = new Date(eventData.date || '');
    
    if (eventData.time) {
      const [hours, minutes] = eventData.time.split(':');
      startDate.setHours(parseInt(hours), parseInt(minutes));
      endDate.setHours(parseInt(hours) + 2, parseInt(minutes));
    }

    const formatDate = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, '');
    };

    switch (type) {
      case 'google':
        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${formatDate(startDate)}/${formatDate(endDate)}&location=${eventLocation}`;
      case 'apple':
        return `data:text/calendar;charset=utf8,BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
URL:${document.URL}
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:${eventTitle}
DESCRIPTION:${eventTitle}
LOCATION:${eventLocation}
END:VEVENT
END:VCALENDAR`;
      case 'outlook':
        return `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${eventTitle}&startdt=${startDate.toISOString()}&enddt=${endDate.toISOString()}&location=${eventLocation}`;
      default:
        return '';
    }
  };

  // Get token from URL when component mounts
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      console.log('Token found in URL:', token);
      setInvitationToken(token);
    }
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowRsvpModal(false);
        setShowCalendarOptions(false);
      }
    };

    if (showRsvpModal || showCalendarOptions) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showRsvpModal, showCalendarOptions]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { y: 30, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  if (!ceremonyLocation && !partyLocation) return null;

  return (
    <>
      <section className={`pb-24 px-4 w-full ${className} relative`}>
        {/* Rosas decorativas a la izquierda */}
        <motion.img 
          src={rosa_a} 
          alt="Rosa decorativa a" 
          className="hidden md:block absolute -left-16 top-[220px] w-64 z-0 select-none pointer-events-none"
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        />
        <motion.img 
          src={rosa_b} 
          alt="Rosa decorativa b" 
          className="hidden md:block absolute -left-16 top-[235px] w-64 z-0 select-none pointer-events-none"
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, ease: "easeOut" }}        />
        <motion.img 
          src={rosa_c} 
          alt="Rosa decorativa c" 
          className="hidden md:block absolute -left-16 top-[250px] w-64 z-0 select-none pointer-events-none"
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        />
        {/* Líneas decorativas de orilla a orilla */}
        <div className="w-screen max-w-none relative left-1/2 right-1/2 -translate-x-1/2 mb-20">
          <img src={lineas} alt="Líneas decorativas" className="w-full h-auto" />
        </div>
        <motion.div 
          className="w-full max-w-none mx-auto relative z-10"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={container}
        >
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 max-w-4xl mx-auto px-4">
            {ceremonyLocation && ceremonyDate && (
              <Event
                title={t('events.ceremony')}
                date={ceremonyDate}
                time={ceremonyTime}
                location={ceremonyLocation}
                address={ceremonyAddress}
                placeId={ceremonyPlaceId}
                variants={item}
                onRsvp={() => {
                  setSelectedEvent('ceremony');
                  setShowRsvpModal(true);
                }}
              />
            )}

            {partyLocation && partyDate && (
              <Event
                title={t('events.reception')}
                date={partyDate}
                time={partyTime}
                location={partyLocation}
                address={partyAddress}
                placeId={partyPlaceId}
                variants={item}
                onRsvp={() => {
                  setSelectedEvent('party');
                  setShowRsvpModal(true);
                }}
              />
            )}
          </div>

          <motion.div 
            className="mt-12 max-w-4xl mx-auto px-4"
            variants={item}
          >
            <div className="relative rounded-xl bg-transparent">
              <div className="p-8 md:p-10 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={() => setShowRsvpModal(true)}
                    className="bg-[#B87600] hover:bg-[#575756] text-[#2B2B2B] hover:text-white px-6 py-2 w-full rounded-full text-base font-sans shadow-sm"
                  >
                    {t('events.confirm_attendance')}
                  </Button>

                  <Button
                    onClick={() => {
                      setSelectedEvent(ceremonyLocation ? 'ceremony' : 'party');
                      setShowCalendarOptions(!showCalendarOptions);
                    }}
                    className="bg-[#B87600] hover:bg-[#575756] text-[#2B2B2B] hover:text-white px-6 py-2 w-full rounded-full text-base font-sans shadow-sm"
                  >
                    {t('events.schedule_event')}
                  </Button>
                  
                  <AnimatePresence>
                    {showCalendarOptions && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="col-span-1 md:col-span-2 mt-2 bg-[#575756] border border-[#575756]/20 rounded-lg shadow-lg p-2"
                      >
                        <motion.a
                          href={generateCalendarLink('google')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full text-left px-4 py-2 text-[#CFD6BA] hover:bg-[#CFD6BA]/10 rounded-md font-sans"
                          whileHover={{ x: 5 }}
                        >
                          {t('events.google_calendar')}
                        </motion.a>
                        <motion.a
                          href={generateCalendarLink('apple')}
                          download="event.ics"
                          className="block w-full text-left px-4 py-2 text-[#CFD6BA] hover:bg-[#CFD6BA]/10 rounded-md font-sans"
                          whileHover={{ x: 5 }}
                        >
                          {t('events.apple_calendar')}
                        </motion.a>
                        <motion.a
                          href={generateCalendarLink('outlook')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full text-left px-4 py-2 text-[#CFD6BA] hover:bg-[#CFD6BA]/10 rounded-md font-sans"
                          whileHover={{ x: 5 }}
                        >
                          {t('events.outlook')}
                        </motion.a>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
        {/* Separador decorativo abajo */}
        <div className="w-screen max-w-none relative left-1/2 right-1/2 -translate-x-1/2 mt-12">
          <img src={curva} alt="Separador decorativo" className="w-full h-auto" />
        </div>
      </section>

      <InfoModal
        isOpen={showRsvpModal}
        onClose={() => setShowRsvpModal(false)}
        title={t('events.confirm_attendance')}
        icon={UserPlus}
        iconColor="#B87600"
        overlayColor="#2B2B2B"
      >
        <div className="space-y-6">
          <div>
            <PublicRsvpForm
              userId={userId}
              invitationToken={invitationToken}
              onSuccess={() => setShowRsvpModal(false)}
            />
          </div>
        </div>
      </InfoModal>
    </>
  );
}
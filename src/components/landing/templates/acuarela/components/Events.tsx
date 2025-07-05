import React from 'react';
import { useState, useEffect } from 'react';
import { UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../../ui/Button';
import { PublicRsvpForm } from '../../../../forms/PublicRsvpForm';
import { InfoModal } from '../../../shared/InfoModal';

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
  icon?: React.ReactNode;
}

function Event({ title, date, time, location, address, placeId, className = '', variants, onRsvp, icon, userLanguage = 'es' }: EventProps & { userLanguage?: string }) {
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
      <div className="relative flex flex-col items-center w-full">
        {icon && (
          <div className="bg-[#2E424B] rounded-full w-40 h-40 flex items-center justify-center mb-6">{icon}</div>
        )}
        <h3 className="relative z-10 text-5xl font-libre text-[#303D5D] text-center mb-4">
          {title}
        </h3>
      </div>
        <div className="p-0 md:p-2 pt-0 space-y-8">
          <div className="space-y-4 text-center">
            <h4 className="text-3xl font-sans text-[#303D5D] mb-2">{t('events.location')}</h4>
            <div className="flex flex-col items-center">
              <p className="text-sm md:text-lg font-sans text-[#303D5D]">{location}</p>
            </div>
          </div>

          <div className="space-y-2 text-center">
            <h4 className="text-3xl font-sans text-[#303D5D] mb-2">{t('events.day')}</h4>
            <div className="flex items-center justify-center gap-4">
              <p className="text-sm md:text-lg font-sans text-[#303D5D]">
                {new Date(date).toLocaleDateString(
                  userLanguage === 'en' ? 'en-US' : 'es-ES', 
                  {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }
                )}
              </p>
              {time && (
                <span className="font-lora text-[#303D5D]">•</span>
              )}
              {time && (
                <span className="text-sm md:text-lg font-sans text-[#303D5D]">{time}</span>
              )}
            </div>
          </div>

          {address && (
          <div className="space-y-4 text-center">
            <h4 className="text-3xl font-sans text-[#303D5D] mb-2">{t('events.address')}</h4>
              <div className="flex flex-col items-center">
                <p className="text-sm md:text-lg font-sans text-[#303D5D]">{address}</p>
              </div>
            <Button
              onClick={handleOpenMaps}
              className="bg-[#303D5D] hover:bg-[#303D5D]/80 text-white px-6 py-2 w-48 mx-auto rounded-xl font-sans"
            >
              {t('events.how_to_get_there')}
            </Button>
          </div>
          )}
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
  userLanguage?: string;
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
  brideName = '',
  userLanguage = 'es'
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
          title: 'Ceremonia',
          date: ceremonyDate,
          time: ceremonyTime,
          location: ceremonyLocation,
          address: ceremonyAddress
        }
      : {
          title: 'Recepción',
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
      <section className={`px-4 w-full ${className}`}>
        <motion.div 
          className="w-full max-w-none mx-auto"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={container}
        >
          <div className="bg-[#FBFAF8] w-full max-w-3xl mx-auto items-center justify-center px-8 grid md:grid-cols-2 gap-8">
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
                userLanguage={userLanguage}
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
                userLanguage={userLanguage}
              />
            )}
          </div>
          <motion.div 
            className="max-w-3xl mx-auto"
            variants={item}
          >
            <div className="relative bg-[#FBFAF8]">
              <div className="p-8 md:p-10 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={() => setShowRsvpModal(true)}
                    className="bg-[#303D5D] hover:bg-[#303D5D]/80 text-white px-2 py-2 w-full mx-auto rounded-xl font-sans"
                  >
                    {t('events.confirm_attendance')}
                  </Button>

                  <Button
                    onClick={() => {
                      setSelectedEvent(ceremonyLocation ? 'ceremony' : 'party');
                      setShowCalendarOptions(!showCalendarOptions);
                    }}
                    className="bg-[#303D5D] hover:bg-[#303D5D]/80 text-white px-2 py-2 w-full mx-auto rounded-xl font-sans"
                  >
                    {t('events.schedule_event')}
                  </Button>
                  
                  <AnimatePresence>
                    {showCalendarOptions && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="col-span-1 md:col-span-2 mt-2 bg-[#303D5D] border border-[#CFD6BA]/20 rounded-lg shadow-lg p-2"
                      >
                        <motion.a
                          href={generateCalendarLink('google')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full text-left px-4 py-2 text-[#FFF] hover:bg-[#CFD6BA]/10 rounded-md"
                          whileHover={{ x: 5 }}
                        >
                          {t('events.google_calendar')}
                        </motion.a>
                        <motion.a
                          href={generateCalendarLink('apple')}
                          download="event.ics"
                          className="block w-full text-left px-4 py-2 text-[#FFF] hover:bg-[#CFD6BA]/10 rounded-md"
                          whileHover={{ x: 5 }}
                        >
                          {t('events.apple_calendar')}
                        </motion.a>
                        <motion.a
                          href={generateCalendarLink('outlook')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full text-left px-4 py-2 text-[#FFF] hover:bg-[#CFD6BA]/10 rounded-md"
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
      </section>

      <InfoModal
        isOpen={showRsvpModal}
        onClose={() => setShowRsvpModal(false)}
        title={t('events.confirm_attendance')}
        icon={UserPlus}
        iconColor="#303D5D"
        overlayColor="#303D5D"
      >
        <div className="space-y-6">
          <div>
            <PublicRsvpForm
              userId={userId}
              invitationToken={invitationToken}
              onSuccess={() => setShowRsvpModal(false)}
              theme={{
                backgroundColor: '#012D27',
                textColor: '#CFD6BA',
                borderColor: '#CFD6BA',
                inputBackground: '#012D27',
                placeholderColor: '#CFD6BA',
                accentColor: '#CFD6BA',
                successBackground: '#012D27',
                successText: '#CFD6BA',
                errorBackground: 'rgba(220, 38, 38, 0.1)',
                errorText: '#ef4444'
              }}
            />
          </div>
        </div>
      </InfoModal>
    </>
  );
}
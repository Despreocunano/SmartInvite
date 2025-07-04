import React from 'react';
import { useState, useEffect } from 'react';
import { UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../../../ui/Button';
import { PublicRsvpForm } from '../../../../forms/PublicRsvpForm';
import lineas from '../assets/divisor-generico.svg'
import { InfoModal } from '../../../shared/InfoModal';
import { ConfetiIcon } from '../animations/confeti';
import { RingsIcon } from '../animations/rings';

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

function Event({ title, date, time, location, address, placeId, className = '', variants, onRsvp, icon }: EventProps) {
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
        <div className="relative -top-8 flex flex-col items-center w-full">
          {icon && (
            <div className="mb-2">{icon}</div>
          )}
          <h3 className="relative z-10 text-5xl md:text-6xl font-parisienne text-white mb-6 text-center">
            {title}
          </h3>
        </div>

        <div className="p-0 md:p-10 pt-0 space-y-8">
          <div className="space-y-4 text-center">
            <h4 className="text-5xl font-parisienne text-white mb-2">Lugar</h4>
            <div className="flex flex-col items-center">
              <p className="text-lg font-lora text-[#cfd6ba]">{location}</p>
            </div>
          </div>

          <div className="space-y-4 text-center">
            <h4 className="text-5xl font-parisienne text-white mb-2">Día</h4>
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
                <span className="text-lg font-lora text-[#cfd6ba]">{time}</span>
              )}
            </div>
          </div>

          {address && (
          <div className="space-y-4 text-center">
            <h4 className="text-5xl font-parisienne text-white mb-2">Dirección</h4>
              <div className="flex flex-col items-center">
                <p className="text-lg font-lora text-[#cfd6ba]">{address}</p>
              </div>
            <Button
              onClick={handleOpenMaps}
              className="bg-[#E5D7A9] hover:bg-[#D0C293] text-[#0A3831] px-6 py-2 w-48 mx-auto rounded-full text-base font-medium shadow-sm"
            >
              ¿Cómo llegar?
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
      <section className={`pb-32 w-full ${className}`}>
        <img src={lineas} alt="Líneas decorativas" className="w-full h-auto mb-20" style={{ display: 'block', marginLeft: 0, marginRight: 0 }} />
        <motion.div 
          className="w-full max-w-none mx-auto px-4"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={container}
        >
          <div className="grid md:grid-cols-2 gap-12 md:gap-40 max-w-4xl mx-auto px-4">
            {ceremonyLocation && ceremonyDate && (
              <Event
                title="Ceremonia"
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
                icon={<RingsIcon />}
              />
            )}

            {partyLocation && partyDate && (
              <Event
                title="Recepción"
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
                icon={<ConfetiIcon />}
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
                    className="bg-[#E5D7A9] hover:bg-[#D0C293] text-[#0A3831] px-6 py-2 w-full rounded-full text-base font-medium shadow-sm"
                  >
                    Confirmar Asistencia
                  </Button>

                  <Button
                    onClick={() => {
                      setSelectedEvent(ceremonyLocation ? 'ceremony' : 'party');
                      setShowCalendarOptions(!showCalendarOptions);
                    }}
                    className="bg-[#E5D7A9] hover:bg-[#D0C293] text-[#0A3831] px-6 py-2 w-full rounded-full text-base font-medium shadow-sm"
                  >
                    Agendar Evento
                  </Button>
                  
                  <AnimatePresence>
                    {showCalendarOptions && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="col-span-1 md:col-span-2 mt-2 bg-[#012D27] border border-[#CFD6BA]/20 rounded-lg shadow-lg p-2"
                      >
                        <motion.a
                          href={generateCalendarLink('google')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full text-left px-4 py-2 text-[#CFD6BA] hover:bg-[#CFD6BA]/10 rounded-md"
                          whileHover={{ x: 5 }}
                        >
                          Google Calendar
                        </motion.a>
                        <motion.a
                          href={generateCalendarLink('apple')}
                          download="event.ics"
                          className="block w-full text-left px-4 py-2 text-[#CFD6BA] hover:bg-[#CFD6BA]/10 rounded-md"
                          whileHover={{ x: 5 }}
                        >
                          Apple Calendar
                        </motion.a>
                        <motion.a
                          href={generateCalendarLink('outlook')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full text-left px-4 py-2 text-[#CFD6BA] hover:bg-[#CFD6BA]/10 rounded-md"
                          whileHover={{ x: 5 }}
                        >
                          Outlook
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
        title="Confirmar Asistencia"
        icon={UserPlus}
        iconColor="#b87600"
        overlayColor="#012D27"
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
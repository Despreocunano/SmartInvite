import React from 'react';
import { useState, useEffect } from 'react';
import { MapPin, Clock, CalendarDays, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../../../ui/Button';
import { PublicRsvpForm } from '../../../../forms/PublicRsvpForm';
import divider from '../assets/divider_2.svg'
import modal from '../assets/modal.svg'


interface EventProps {
  title: string;
  date: string;
  time?: string;
  location: string;
  address?: string;
  placeId?: string;
  className?: string;
  variants?: any;
}

function Event({ title, date, time, location, address, placeId, className = '', variants }: EventProps) {
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
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Unique card design with layered effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#985B6F] to-[#985B6F] rounded-3xl transform rotate-2 opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-[#F8BBD9] to-[#FCE4EC] rounded-3xl transform -rotate-1 opacity-40"></div>
      
      <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-[#F8BBD9]/50">
        {/* Decorative header */}
        <div className="h-2 bg-gradient-to-r from-[#985B6F] via-[#F8BBD9] to-[#985B6F]"></div>
        
        <div className="p-8 md:p-10">
          <h3 className="text-4xl font-serif font-black mb-8 text-[#BC913B] relative">
            {title}
            <div className="absolute -bottom-2 left-0 w-16 h-1 bg-gradient-to-r from-[#BC913B] to-transparent rounded-full"></div>
          </h3>
          
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F8BBD9] to-[#FCE4EC] flex items-center justify-center flex-shrink-0 shadow-lg">
                  <MapPin className="w-6 h-6 text-[#2D1B69]" />
                </div>
                <div className="ml-4">
                  <p className="text-xl font-sans font-medium text-[#995B70]">{location}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F8BBD9] to-[#FCE4EC] flex items-center justify-center flex-shrink-0 shadow-lg">
                  <CalendarDays className="w-6 h-6 text-[#2D1B69]" />
                </div>
                <div className="ml-4">
                  <div className="flex items-center gap-2">
                    <p className="text-xl font-sans font-medium text-[#995B70]">
                    {new Date(date).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  {time && (
                      <div className="flex items-center text-[#2D1B69]">
                        <Clock className="w-4 h-4 mr-1" />
                        <span className="text-xl font-sans font-medium text-[#995B70]">{time}</span>
                    </div>
                  )}
                  </div>
                </div>
              </div>
            </div>

            {address && (
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F8BBD9] to-[#FCE4EC] flex items-center justify-center flex-shrink-0 shadow-lg">
                    <MapPin className="w-6 h-6 text-[#2D1B69]" />
                  </div>
                  <div className="ml-4">
                    <p className="text-xl font-sans font-medium text-[#995B70]">{address}</p>
                  </div>
                </div>
                
                <Button
                  onClick={handleOpenMaps}
                  className="bg-[#BF0D78] hover:bg-[#9a5b71] text-white px-8 py-4 w-full rounded-full text-lg font-sans"
                >
                  ¿Cómo llegar?
                </Button>
              </div>
            )}
          </div>
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
      <section className={`py-32 px-4 w-full ${className}`}>
        <motion.div 
          className="w-full max-w-none mx-auto"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={container}
        >
          <motion.div 
            className="text-center mb-20"
            variants={item}
          >
            <img src={divider} alt="Divider" className="mx-auto mb-4" />
            <h2 className="text-4xl md:text-5xl font-serif font-black text-[#995B70] mb-6">¿Cuándo y Dónde?</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 md:gap-16 max-w-7xl mx-auto px-4">
            {ceremonyLocation && ceremonyDate && (
              <Event
                title="Ceremonia"
                date={ceremonyDate}
                time={ceremonyTime}
                location={ceremonyLocation}
                address={ceremonyAddress}
                placeId={ceremonyPlaceId}
                variants={item}
              />
            )}

            {partyLocation && partyDate && (
              <Event
                title="Celebración"
                date={partyDate}
                time={partyTime}
                location={partyLocation}
                address={partyAddress}
                placeId={partyPlaceId}
                variants={item}
              />
            )}
          </div>

          <motion.div 
            className="mt-12 max-w-7xl mx-auto px-4"
            variants={item}
          >
            <div className="relative">
              {/* Unique card design with layered effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#985B6F] to-[#985B6F] rounded-3xl transform rotate-2 opacity-20"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-[#F8BBD9] to-[#FCE4EC] rounded-3xl transform -rotate-1 opacity-40"></div>
              
              <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-[#F8BBD9]/50">
                {/* Decorative header */}
                <div className="h-2 bg-gradient-to-r from-[#985B6F] via-[#F8BBD9] to-[#985B6F]"></div>
                
                <div className="p-8 md:p-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      onClick={() => setShowRsvpModal(true)}
                      className="bg-[#BF0D78] hover:bg-[#9a5b71] text-white px-8 py-4 w-full rounded-full text-lg font-sans"
                    >
                      Confirmar Asistencia
                    </Button>

                    <Button
                      onClick={() => {
                        setSelectedEvent(ceremonyLocation ? 'ceremony' : 'party');
                        setShowCalendarOptions(!showCalendarOptions);
                      }}
                      leftIcon={<CalendarDays className="w-5 h-5" />}
                      className="bg-[#BF0D78] hover:bg-[#9a5b71] text-white px-8 py-4 w-full rounded-full text-lg font-sans flex items-center justify-center gap-2"
                    >
                      Agendar Evento
                    </Button>
                    
                    <AnimatePresence>
                      {showCalendarOptions && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="col-span-1 md:col-span-2 mt-4 bg-white/90 backdrop-blur-sm border border-[#F8BBD9]/30 rounded-2xl shadow-lg p-4"
                        >
                          <motion.a
                            href={generateCalendarLink('google')}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full text-left px-4 py-3 text-[#2D1B69] hover:bg-[#F8BBD9]/20 rounded-xl transition-colors font-sans"
                            whileHover={{ x: 5 }}
                          >
                            Google Calendar
                          </motion.a>
                          <motion.a
                            href={generateCalendarLink('apple')}
                            download="event.ics"
                            className="block w-full text-left px-4 py-3 text-[#2D1B69] hover:bg-[#F8BBD9]/20 rounded-xl transition-colors font-sans"
                            whileHover={{ x: 5 }}
                          >
                            Apple Calendar
                          </motion.a>
                          <motion.a
                            href={generateCalendarLink('outlook')}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full text-left px-4 py-3 text-[#2D1B69] hover:bg-[#F8BBD9]/20 rounded-xl transition-colors font-sans"
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
            </div>
          </motion.div>
        </motion.div>
      </section>

      <AnimatePresence>
        {showRsvpModal && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C2127]/95 backdrop-blur-sm px-4"
          >
            <div 
              className="relative w-full max-w-2xl px-8 py-12 text-center bg-white rounded-lg shadow-xl"
            >
              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-24 h-24 border-l-2 border-t-2 border-[#E91E63]/30" />
              <div className="absolute top-0 right-0 w-24 h-24 border-r-2 border-t-2 border-[#E91E63]/30" />
              <div className="absolute bottom-0 left-0 w-24 h-24 border-l-2 border-b-2 border-[#E91E63]/30" />
              <div className="absolute bottom-0 right-0 w-24 h-24 border-r-2 border-b-2 border-[#E91E63]/30" />

              <button
                onClick={() => setShowRsvpModal(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>

              <div className="space-y-8">
                <div className="relative -mt-[100px] mb-8">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-lg">
                    <CalendarDays className="w-12 h-12 text-[#E91E63]" />
                  </div>
                </div>
                <h2 className="text-2xl font-serif text-gray-900">Confirmar Asistencia</h2>

                <PublicRsvpForm
                  userId={userId}
                  invitationToken={invitationToken}
                  onSuccess={() => setShowRsvpModal(false)}
                />
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
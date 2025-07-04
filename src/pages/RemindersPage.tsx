import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { useAttendees } from '../hooks/useAttendees';
import { useTables } from '../hooks/useTables';
import { useWedding } from '../hooks/useWedding';
import { sendEmail } from '../lib/api';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { Search, Send, Check, X, Clock, Filter } from 'lucide-react';

interface LandingPageData {
  ceremony_time?: string;
  party_time?: string;
  ceremony_location?: string;
  party_location?: string;
  ceremony_address?: string;
  party_address?: string;
  wedding_date?: string;
}

function RemindersAttendeesSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1 h-10 bg-gray-200 rounded-md animate-pulse"></div>
        <div className="w-40 h-10 bg-gray-200 rounded-md animate-pulse"></div>
      </div>
      <div className="flex items-center justify-between">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="space-y-2 max-h-[500px] overflow-y-auto">
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-lg border border-gray-200"
          >
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-gray-200 animate-pulse"></div>
              <div>
                <div className="h-4 w-40 bg-gray-200 rounded animate-pulse mb-1"></div>
                <div className="h-3 w-56 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RemindersPage() {
  const { t } = useTranslation('features');
  const { attendees, loading: attendeesLoading } = useAttendees();
  const { tables } = useTables();
  const { groomName, brideName, profileImage } = useWedding();
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>([]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'declined'>('all');
  const [isSending, setIsSending] = useState(false);
  const [activeInput, setActiveInput] = useState<'subject' | 'message'>('subject');
  const [landingPage, setLandingPage] = useState<LandingPageData | null>(null);
  const subjectRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const fetchLandingPage = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;

        const { data, error } = await supabase
          .from('landing_pages')
          .select(`
            ceremony_time,
            party_time,
            ceremony_location,
            party_location,
            ceremony_address,
            party_address,
            wedding_date
          `)
          .eq('user_id', session.user.id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            return;
          }
          throw error;
        }
        
        setLandingPage(data);

        // Check for missing fields and warn user
        const missingFields = [];
        if (!data?.wedding_date) missingFields.push(t('reminders.variables.date'));
        if (!data?.ceremony_time) missingFields.push(t('reminders.variables.ceremony_time'));
        if (!data?.party_time) missingFields.push(t('reminders.variables.party_time'));
        if (!data?.ceremony_location) missingFields.push(t('reminders.variables.ceremony_location'));
        if (!data?.party_location) missingFields.push(t('reminders.variables.party_location'));
        if (!data?.ceremony_address) missingFields.push(t('reminders.variables.ceremony_address'));
        if (!data?.party_address) missingFields.push(t('reminders.variables.party_address'));

        if (missingFields.length > 0) {
          toast(t('reminders.missing_fields_warning', { fields: missingFields.join(', ') }), {
            icon: '⚠️',
            style: {
              background: '#FEF3C7',
              color: '#92400E',
            },
          });
        }
      } catch (error) {
        if (error && typeof error === 'object' && 'code' in error && error.code !== 'PGRST116') {
          console.error('Error fetching landing page:', error);
          toast.error(t('reminders.load_error'));
        }
      }
    };

    fetchLandingPage();
  }, [t]);

  const variables = [
    { name: '{nombre}', description: t('reminders.variables.name') },
    { name: '{acompañante}', description: t('reminders.variables.companion') },
    { name: '{mesa}', description: t('reminders.variables.table') },
    { name: '{fecha}', description: t('reminders.variables.date') },
    { name: '{hora_ceremonia}', description: t('reminders.variables.ceremony_time') },
    { name: '{hora_fiesta}', description: t('reminders.variables.party_time') },
    { name: '{lugar_ceremonia}', description: t('reminders.variables.ceremony_location') },
    { name: '{lugar_fiesta}', description: t('reminders.variables.party_location') },
    { name: '{direccion_ceremonia}', description: t('reminders.variables.ceremony_address') },
    { name: '{direccion_fiesta}', description: t('reminders.variables.party_address') }
  ];

  const signature = `
<br><br>
<div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
  <table cellpadding="0" cellspacing="0" style="border: none;">
    <tr>
      <td style="vertical-align: middle; padding-right: 15px;">
        <img src="${profileImage || 'https://images.pexels.com/photos/931158/pexels-photo-931158.jpeg?w=50&h=50'}" alt="Logo" style="width: 50px; height: 50px; border-radius: 50%;">
      </td>
      <td style="vertical-align: middle;">
        <div style="font-family: 'Playfair Display', serif; color: #B76E79; font-size: 18px;">
          ${groomName} & ${brideName}
        </div>
        <div style="font-family: Arial, sans-serif; color: #666; font-size: 14px; margin-top: 4px;">
          ¡Gracias por ser parte de nuestra historia!
        </div>
      </td>
    </tr>
  </table>
</div>`;

  const filteredAttendees = attendees.filter(attendee => {
    const matchesSearch = 
      attendee.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (attendee.email && attendee.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (attendee.plus_one_name && attendee.plus_one_name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = 
      statusFilter === 'all' || 
      attendee.rsvp_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleSelectAll = () => {
    if (selectedAttendees.length === filteredAttendees.length) {
      setSelectedAttendees([]);
    } else {
      setSelectedAttendees(filteredAttendees.map(a => a.id));
    }
  };

  const toggleAttendee = (id: string) => {
    if (selectedAttendees.includes(id)) {
      setSelectedAttendees(selectedAttendees.filter(a => a !== id));
    } else {
      setSelectedAttendees([...selectedAttendees, id]);
    }
  };

  const replaceVariables = (text: string, attendee: any) => {
    const currentTable = tables.find(t => t.id === attendee.table_id);
    const weddingDate = landingPage?.wedding_date 
      ? new Date(landingPage.wedding_date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
        })
      : t('reminders.default_values.date_not_defined');

    const replacements = {
      '{nombre}': attendee.first_name || '',
      '{acompañante}': attendee.has_plus_one ? attendee.plus_one_name : '',
      '{mesa}': currentTable?.name || t('reminders.default_values.no_table'),
      '{fecha}': weddingDate,
      '{hora_ceremonia}': landingPage?.ceremony_time || t('reminders.default_values.time_not_defined'),
      '{hora_fiesta}': landingPage?.party_time || t('reminders.default_values.time_not_defined'),
      '{lugar_ceremonia}': landingPage?.ceremony_location || t('reminders.default_values.location_not_defined'),
      '{lugar_fiesta}': landingPage?.party_location || t('reminders.default_values.location_not_defined'),
      '{direccion_ceremonia}': landingPage?.ceremony_address || t('reminders.default_values.address_not_defined'),
      '{direccion_fiesta}': landingPage?.party_address || t('reminders.default_values.address_not_defined')
    };

    return text.replace(
      new RegExp(Object.keys(replacements).join('|'), 'g'),
      matched => replacements[matched as keyof typeof replacements]
    );
  };

  const insertVariable = (variable: string) => {
    if (activeInput === 'subject' && subjectRef.current) {
      const start = subjectRef.current.selectionStart || 0;
      const end = subjectRef.current.selectionEnd || 0;
      const newSubject = subject.substring(0, start) + variable + subject.substring(end);
      setSubject(newSubject);
      setTimeout(() => {
        subjectRef.current?.setSelectionRange(start + variable.length, start + variable.length);
        subjectRef.current?.focus();
      }, 0);
    } else if (activeInput === 'message' && messageRef.current) {
      const start = messageRef.current.selectionStart || 0;
      const end = messageRef.current.selectionEnd || 0;
      const newMessage = message.substring(0, start) + variable + message.substring(end);
      setMessage(newMessage);
      setTimeout(() => {
        messageRef.current?.setSelectionRange(start + variable.length, start + variable.length);
        messageRef.current?.focus();
      }, 0);
    }
  };

  const handleSendReminders = async () => {
    if (!subject.trim() || !message.trim()) {
      toast.error(t('reminders.validation_subject_message'));
      return;
    }

    if (selectedAttendees.length === 0) {
      toast.error(t('reminders.validation_attendees'));
      return;
    }

    setIsSending(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const attendeeId of selectedAttendees) {
        const attendee = attendees.find(a => a.id === attendeeId);
        if (!attendee) continue;

        const personalizedSubject = replaceVariables(subject, attendee);
        const personalizedMessage = replaceVariables(message, attendee) + signature;

        try {
          await sendEmail(
            attendeeId,
            personalizedSubject,
            personalizedMessage
          );
          successCount++;
        } catch (error) {
          console.error('Error sending reminder:', error);
          errorCount++;
        }
      }

      if (successCount > 0) {
        toast.success(t('reminders.send_success', { count: successCount }));
        setSelectedAttendees([]);
      }
      
      if (errorCount > 0) {
        toast.error(t('reminders.send_partial_error', { count: errorCount }));
      }
    } catch (error) {
      console.error('Error sending reminders:', error);
      toast.error(t('reminders.send_error'));
    } finally {
      setIsSending(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'declined':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('reminders.title')}</h1>
          <p className="text-gray-500 mt-1">
            {t('reminders.subtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel de invitados */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>{t('reminders.guests_title')}</CardTitle>
            </CardHeader>
            <CardContent>
              {attendeesLoading ? (
                <RemindersAttendeesSkeleton />
              ) : (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder={t('reminders.search_placeholder')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      leftIcon={<Search className="h-4 w-4 text-gray-400" />}
                      rightIcon={searchTerm ? (
                        <button onClick={() => setSearchTerm('')}>
                          <X className="h-4 w-4 text-gray-400" />
                        </button>
                      ) : undefined}
                    />
                    <div className="relative">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent sm:text-sm"
                      >
                        <option value="all">{t('reminders.filter_all')}</option>
                        <option value="pending">{t('reminders.filter_pending')}</option>
                        <option value="confirmed">{t('reminders.filter_confirmed')}</option>
                        <option value="declined">{t('reminders.filter_declined')}</option>
                      </select>
                      <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSelectAll}
                      className="text-sm"
                    >
                      {selectedAttendees.length === filteredAttendees.length
                        ? t('reminders.deselect_all')
                        : t('reminders.select_all')}
                    </Button>
                    <span className="text-sm text-gray-500">
                      {t('reminders.selected_count', { count: selectedAttendees.length })}
                    </span>
                  </div>

                  <div className="space-y-2 max-h-[500px] overflow-y-auto">
                    {filteredAttendees.map((attendee) => (
                      <div
                        key={attendee.id}
                        className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedAttendees.includes(attendee.id)
                            ? 'border-rose-200 bg-rose-50'
                            : 'border-gray-200 hover:border-rose-200 hover:bg-rose-50/50'
                        }`}
                        onClick={() => toggleAttendee(attendee.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${
                            attendee.rsvp_status === 'confirmed' ? 'bg-green-500' :
                            attendee.rsvp_status === 'declined' ? 'bg-red-500' :
                            'bg-amber-500'
                          }`} />
                          <div>
                            <div className="font-medium text-gray-900">
                              {attendee.first_name}
                              {attendee.has_plus_one && ' (+1)'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {attendee.email}
                            </div>
                          </div>
                        </div>
                        {selectedAttendees.includes(attendee.id) && (
                          <Check className="h-5 w-5 text-rose-600" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Panel de composición */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>{t('reminders.compose_title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('reminders.subject_label')}
                  </label>
                  <Input
                    ref={subjectRef}
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    onFocus={() => setActiveInput('subject')}
                    placeholder={t('reminders.subject_placeholder')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('reminders.message_label')}
                  </label>
                  <Textarea
                    ref={messageRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onFocus={() => setActiveInput('message')}
                    placeholder={t('reminders.message_placeholder')}
                    rows={8}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('reminders.variables_label')}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {variables.map((variable) => (
                      <button
                        key={variable.name}
                        onClick={() => insertVariable(variable.name)}
                        className="flex flex-col md:flex-row items-start md:items-center justify-between p-2 text-sm border border-gray-200 rounded-md hover:border-rose-200 hover:bg-rose-50 transition-colors"
                      >
                        <span className="font-mono text-gray-600 md:mr-2">{variable.name}</span>
                        <span className="text-gray-500 text-xs">{variable.description}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    onClick={handleSendReminders}
                    leftIcon={<Send className="h-4 w-4" />}
                    isLoading={isSending}
                    disabled={selectedAttendees.length === 0}
                    className="bg-primary text-primary-contrast hover:bg-primary-dark"
                  >
                    {t('reminders.send_button')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
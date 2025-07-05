import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Attendee, RsvpStatus } from '../types/supabase';
import { useAuth } from '../context/AuthContext';
import { useWedding } from '../hooks/useWedding';
import toast from 'react-hot-toast';
import { sendEmail, sendInvitationEmail } from '../lib/api';
import { getReminderTemplate, getSignatureTemplate } from '../templates/emailTemplates';
import { useTranslation } from 'react-i18next';

export function useAttendees() {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  const { groomName, brideName, profileImage } = useWedding();
  const { t } = useTranslation('attendees');

  const fetchAttendees = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('attendees')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      setAttendees(data || []);
    } catch (err) {
      console.error('Error fetching attendees:', err);
      setError(err instanceof Error ? err : new Error('Error fetching attendees'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendees();

    const channel = supabase.channel('attendees-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'attendees',
          filter: `user_id=eq.${user?.id}`
        },
        () => {
          fetchAttendees();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [user]);

  const addAttendee = async (data: Omit<Attendee, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return { success: false };
    
    try {
      const { data: newAttendee, error } = await supabase
        .from('attendees')
        .insert([{ ...data, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      setAttendees(prev => [...prev, newAttendee]);
      toast.success(t('toast.attendee_added'));

      // Send invitation email automatically if email is provided
      if (data.email) {
        try {
          // Get landing page slug
          const { data: landingPage, error: landingError } = await supabase
            .from('landing_pages')
            .select('slug')
            .eq('user_id', user.id)
            .single();

          if (!landingError && landingPage?.slug) {
            await sendInvitationEmail(newAttendee.id, landingPage.slug);
            toast.success(t('toast.invitation_sent'));
          }
        } catch (emailError) {
          console.error('Error sending invitation email:', emailError);
          // Don't show error toast for email failure, just log it
        }
      }

      return { success: true, data: newAttendee };
    } catch (err) {
      console.error('Error adding attendee:', err);
      toast.error(t('toast.error_adding'));
      return { success: false };
    }
  };

  const updateAttendee = async (id: string, updates: Partial<Attendee>) => {
    if (!user) return { success: false };

    try {
      const { data, error } = await supabase
        .from('attendees')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setAttendees(prev => 
        prev.map(attendee => 
          attendee.id === id ? { ...attendee, ...data } : attendee
        )
      );
      
      toast.success(t('toast.attendee_updated'));
      return { success: true, data };
    } catch (err) {
      console.error('Error updating attendee:', err);
      toast.error(t('toast.error_updating'));
      return { success: false };
    }
  };

  const updateRsvpStatus = async (id: string, status: RsvpStatus) => {
    if (!user) return { success: false };

    try {
      // Buscar el invitado para verificar si tiene acompañante
      const attendee = attendees.find(a => a.id === id);
      if (!attendee) throw new Error('Attendee not found');

      const updates: Partial<Attendee> = {
        rsvp_status: status,
        updated_at: new Date().toISOString(),
      };

      // Si el invitado tiene acompañante, el acompañante debe tener el mismo estado
      if (attendee.has_plus_one) {
        updates.plus_one_rsvp_status = status;
      }

      const { data, error } = await supabase
        .from('attendees')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setAttendees(prev => 
        prev.map(attendee => 
          attendee.id === id ? { ...attendee, ...data } : attendee
        )
      );
      
      toast.success(t('toast.status_updated'));
      return { success: true, data };
    } catch (err) {
      console.error('Error updating RSVP status:', err);
      toast.error(t('toast.error_updating_status'));
      return { success: false };
    }
  };

  const deleteAttendee = async (id: string) => {
    if (!user) return { success: false };

    try {
      const { error } = await supabase
        .from('attendees')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setAttendees(prev => prev.filter(attendee => attendee.id !== id));
      toast.success(t('toast.attendee_deleted'));
      return { success: true };
    } catch (err) {
      console.error('Error deleting attendee:', err);
      toast.error(t('toast.error_deleting'));
      return { success: false };
    }
  };

  const sendReminder = async (id: string) => {
    if (!user) return { success: false };

    try {
      const attendee = attendees.find(a => a.id === id);
      if (!attendee) throw new Error('Attendee not found');

      // Get landing page data
      const { data: landingPage, error: landingError } = await supabase
        .from('landing_pages')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (landingError) throw new Error('Error fetching landing page');

      const landingUrl = landingPage?.slug 
        ? `https://smartinvite.me/invitacion/${landingPage.slug}`
        : '';

      const signature = getSignatureTemplate(groomName, brideName, profileImage);
      const message = getReminderTemplate({ attendee, landingUrl, signature });

      await sendEmail(
        id,
        'Recordatorio de invitación',
        message
      );

      return { success: true };
    } catch (err) {
      console.error('Error sending reminder:', err);
      return { success: false };
    }
  };

  return {
    attendees,
    loading,
    error,
    addAttendee,
    updateAttendee,
    updateRsvpStatus,
    deleteAttendee,
    sendReminder,
    refreshAttendees: fetchAttendees
  };
}
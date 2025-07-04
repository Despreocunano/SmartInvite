import { supabase } from './supabase';
import type { RsvpStatus } from '../types/supabase';

export async function updateRsvpStatus(
  attendeeId: string, 
  status: RsvpStatus
) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('No hay una sesión autenticada');
  }

  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/update-rsvp-status`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        attendeeId,
        status,
      }),
    }
  );

  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Error al actualizar el estado');
  }

  return data;
}

export async function sendEmail(
  attendeeId: string,
  subject: string,
  message: string
) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('No hay una sesión autenticada');
  }

  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        attendeeId,
        subject,
        message,
      }),
    }
  );

  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Error al enviar el correo');
  }

  return data;
}

export async function sendInvitationEmail(
  attendeeId: string,
  landingSlug: string
) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('No hay una sesión autenticada');
  }

  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-invitation-email`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        attendeeId,
        landingSlug,
      }),
    }
  );

  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Error al enviar la invitación');
  }

  return data;
}

export async function getAttendeeByToken(token: string) {
  try {
    // Use direct Supabase client instead of Edge Function
    const { data: attendee, error: attendeeError } = await supabase
      .from('attendees')
      .select('*')
      .eq('invitation_token', token)
      .single();

    if (attendeeError || !attendee) {
      throw new Error('Invalid or expired token');
    }

    // Get landing page details
    const { data: landingPage, error: landingError } = await supabase
      .from('landing_pages')
      .select('*')
      .eq('user_id', attendee.user_id)
      .single();

    if (landingError) {
      throw new Error('Error fetching landing page');
    }

    return {
      success: true,
      attendee,
      landingPage
    };
  } catch (error) {
    console.error('Error getting attendee by token:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to get attendee');
  }
}

export async function testTokenConnection() {
  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/test-token`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Error testing connection');
  }

  return data;
}
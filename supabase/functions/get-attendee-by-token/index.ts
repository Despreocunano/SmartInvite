import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.8';
import { z } from 'npm:zod@3.22.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    });
  }

  try {
    // Use anon key with RLS policies
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '', 
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Get token from URL parameters
    const url = new URL(req.url);
    const token = url.searchParams.get('token');

    if (!token) {
      throw new Error('Token is required');
    }

    // Get attendee by token
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

    return new Response(JSON.stringify({
      success: true,
      attendee,
      landingPage
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Error getting attendee by token:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get attendee'
    }), {
      status: 400,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
}); 
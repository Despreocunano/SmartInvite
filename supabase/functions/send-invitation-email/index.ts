import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.8';
import { z } from 'npm:zod@3.22.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

const invitationEmailSchema = z.object({
  attendeeId: z.string().uuid(),
  landingSlug: z.string()
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '', 
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', 
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const body = await req.json();
    const { attendeeId, landingSlug } = invitationEmailSchema.parse(body);

    // Get attendee details
    const { data: attendee, error: attendeeError } = await supabase
      .from('attendees')
      .select('*')
      .eq('id', attendeeId)
      .eq('user_id', user.id)
      .single();

    if (attendeeError || !attendee) {
      throw new Error('Attendee not found or unauthorized');
    }

    // Get landing page details
    const { data: landingPage, error: landingError } = await supabase
      .from('landing_pages')
      .select('groom_name, bride_name, wedding_date')
      .eq('user_id', user.id)
      .single();

    if (landingError) {
      throw new Error('Error fetching landing page');
    }

    // Generate invitation token
    const invitationToken = crypto.randomUUID();
    
    // Store the token in the attendee record
    const { error: updateError } = await supabase
      .from('attendees')
      .update({ invitation_token: invitationToken })
      .eq('id', attendeeId);

    if (updateError) {
      throw new Error('Error storing invitation token');
    }

    // Get the sender email from environment variables
    const senderEmail = Deno.env.get('RESEND_SENDER_EMAIL');
    if (!senderEmail) {
      throw new Error('RESEND_SENDER_EMAIL environment variable is not set');
    }

    // Create invitation URL with token
    const invitationUrl = `https://tuparte.digital/invitacion/${landingSlug}?token=${invitationToken}`;

    // Create email content
    const emailContent = createInvitationEmail({
      attendee,
      landingPage,
      invitationUrl
    });

    // Send email using Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: senderEmail,
        to: attendee.email,
        subject: `¡Nos casamos! 🎉 ${landingPage.groom_name} y ${landingPage.bride_name}`,
        html: emailContent
      })
    });

    if (!resendResponse.ok) {
      const resendError = await resendResponse.json();
      console.error('Resend API error:', resendError);
      throw new Error(`Failed to send email: ${resendError.message || 'Unknown error'}`);
    }

    // Log the email
    const { error: logError } = await supabase.from('email_logs').insert([
      {
        user_id: user.id,
        guest_id: attendeeId,
        subject: `Invitación a la boda de ${landingPage.groom_name} y ${landingPage.bride_name}`,
        content: emailContent
      }
    ]);

    if (logError) {
      console.error('Failed to log email:', logError);
    }

    return new Response(JSON.stringify({
      success: true,
      invitationToken
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Error sending invitation email:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send invitation email'
    }), {
      status: error instanceof Error && error.message === 'Unauthorized' ? 401 : 400,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});

function createInvitationEmail({ attendee, landingPage, invitationUrl }: {
  attendee: any;
  landingPage: any;
  invitationUrl: string;
}) {
  const weddingDate = new Date(landingPage.wedding_date).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
      <div style="background-color: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
        <div style="margin-bottom: 35px;">
          <p style="font-size: 16px; line-height: 1.7; color: #333; margin-bottom: 20px; font-weight: 500;">
            Querido/a ${attendee.first_name} ${attendee.last_name},
          </p>
          <p style="font-size: 16px; line-height: 1.7; color: #333; margin-bottom: 20px;">
           ¡Estamos felices de contarte que nos casamos! Somos ${landingPage.groom_name} & ${landingPage.bride_name} y sería un honor para nosotros que nos acompañes en uno de los días más importantes de nuestras vidas.
          </p>
          <p style="font-size: 16px; line-height: 1.7; color: #333; margin-bottom: 20px;">
            La ceremonia se realizará el <strong>${weddingDate}</strong>, y no podríamos imaginar ese momento sin ti.
          </p>
          <p style="font-size: 16px; line-height: 1.7; color: #333; margin-bottom: 30px;">
            Hemos preparado una invitación digital con todos los detalles del evento.
          </p>
        </div>

        <div style="text-align: center; margin-bottom: 35px;">
          <a href="${invitationUrl}" 
             style="color: #8B5A96; text-decoration: underline; font-weight: 600; font-size: 16px;">
            Ver Invitación Digital →
          </a>
        </div>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 40px; border-left: 4px solid #8B5A96;">
          <p style="font-size: 14px; color: #666; margin: 0; text-align: center; line-height: 1.5;">
            <strong>Nota importante:</strong> Al hacer clic en el enlace, tus datos se precargarán automáticamente 
            en el formulario de confirmación para facilitar tu respuesta.
          </p>
        </div>

        <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
          <p style="color: #666; font-size: 14px; margin: 0; font-style: italic;">
            ¡Gracias por ser parte de nuestra historia!
          </p>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <a href="https://tuparte.digital" style="text-decoration: none; color: #666;">
            <img src="https://app.tuparte.digital/assets/logo-dark-Cd7SJvdg.svg" 
                 alt="TuParte Digital" 
                 style="height: 30px; width: auto; margin-bottom: 8px;">
            <p style="color: #666; font-size: 12px; margin: 0;">
              Creado con ❤️ por TuParte Digital
            </p>
          </a>
        </div>
      </div>
    </div>
  `;
} 
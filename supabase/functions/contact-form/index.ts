import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { z } from 'npm:zod@3.22.4';
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};
const contactFormSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('El email no es válido'),
  subject: z.string().min(1, 'El asunto es requerido'),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres')
});
serve(async (req)=>{
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    });
  }
  try {
    const body = await req.json();
    const { name, email, subject, message } = contactFormSchema.parse(body);
    
    // Get environment variables
    const senderEmail = Deno.env.get('RESEND_SENDER_EMAIL');
    const adminEmail = Deno.env.get('ADMIN_EMAIL') || 'contacto@tuparte.digital';
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    if (!senderEmail) {
      throw new Error('RESEND_SENDER_EMAIL environment variable is not set');
    }
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set');
    }
    // Simple email content for testing
    let htmlContent;
    if (subject === 'Solicitud de retiro de regalos') {
      // Template de retiro
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="margin-bottom: 20px;">
            <h2 style="font-size: 20px; color: #B76E79; margin-bottom: 8px;">Solicitud de retiro de regalos</h2>
            <p style="font-size: 16px; color: #333;">Se ha recibido una solicitud de retiro con los siguientes datos:</p>
          </div>
          <div style="margin-bottom: 20px;">
            <table style="width: 100%; font-size: 16px; color: #333; border-collapse: collapse;">
              <tr><td style="padding: 6px 0; font-weight: bold;">Nombre:</td><td>${name}</td></tr>
              <tr><td style="padding: 6px 0; font-weight: bold;">RUT:</td><td>${message.match(/RUT: (.*)\n/)? message.match(/RUT: (.*)\n/)[1] : ''}</td></tr>
              <tr><td style="padding: 6px 0; font-weight: bold;">Número de cuenta:</td><td>${message.match(/Número de cuenta: (.*)\n/)? message.match(/Número de cuenta: (.*)\n/)[1] : ''}</td></tr>
              <tr><td style="padding: 6px 0; font-weight: bold;">Banco:</td><td>${message.match(/Banco: (.*)\n/)? message.match(/Banco: (.*)\n/)[1] : ''}</td></tr>
              <tr><td style="padding: 6px 0; font-weight: bold;">Email:</td><td>${email}</td></tr>
            </table>
          </div>
          <div style="margin-bottom: 20px;">
            <p style="font-size: 15px; color: #666;">Por favor, gestiona el retiro y contacta al usuario si es necesario.</p>
          </div>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #999; font-size: 13px;">
            Este mensaje fue generado automáticamente desde el panel de administración de Tu Parte Digital.
          </div>
        </div>`;
    } else {
      htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Nuevo mensaje de contacto</title>
          </head>
          <body>
            <h2>Nuevo mensaje de contacto</h2>
            <p><strong>Nombre:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Asunto:</strong> ${subject}</p>
            <p><strong>Mensaje:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
          </body>
        </html>
      `;
    }
    
    // Send email to admin using Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: senderEmail,
        to: adminEmail,
        subject: `Nuevo mensaje de contacto: ${subject}`,
        html: htmlContent,
        replyTo: email
      })
    });
    
    if (!resendResponse.ok) {
      const resendError = await resendResponse.json();
      console.error('Resend API error:', resendError);
      throw new Error(`Failed to send email: ${resendError.message || 'Unknown error'}`);
    }
    
    // Send confirmation email to the user
    const confirmationHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Mensaje recibido - Tu Parte Digital</title>
        </head>
        <body>
          <h2>¡Mensaje recibido!</h2>
          <p>Gracias por contactarnos. Hemos recibido tu mensaje y te responderemos lo antes posible.</p>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Asunto:</strong> ${subject}</p>
          <p><strong>Mensaje:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        </body>
      </html>
    `;
    
    const confirmationResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: senderEmail,
        to: email,
        subject: 'Mensaje recibido - Tu Parte Digital',
        html: confirmationHtml
      })
    });
    
    if (!confirmationResponse.ok) {
      console.error('Failed to send confirmation email');
    }
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Mensaje enviado con éxito'
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error processing contact form:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Error al procesar el formulario'
    }), {
      status: 400,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});

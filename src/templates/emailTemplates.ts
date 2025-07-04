import { Attendee } from '../types/supabase';

interface EmailTemplateData {
  attendee: Attendee;
  landingUrl?: string;
  signature: string;
}

export const getReminderTemplate = ({ attendee, landingUrl, signature }: EmailTemplateData) => {
  return `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="margin-bottom: 20px;">
    <p style="font-size: 16px; line-height: 1.6; color: #333;">
      Hola ${attendee.first_name},
    </p>
  </div>

  <div style="margin-bottom: 20px;">
    <p style="font-size: 16px; line-height: 1.6; color: #333;">
      Te recordamos que aún no has confirmado tu asistencia a nuestra boda. Por favor, confirma tu asistencia lo antes posible.
    </p>
  </div>

  ${landingUrl ? `
  <div style="margin-bottom: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 8px;">
    <p style="font-size: 16px; line-height: 1.6; color: #333; margin: 0;">
      Puedes ver todos los detalles y confirmar tu asistencia en nuestra invitación digital:
    </p>
    <br>
    <a href="${landingUrl}" style="display: inline-block; margin-top: 10px; color: #B76E79; text-decoration: none; font-weight: 500;">
      Ver invitación digital →
    </a>
  </div>
  ` : ''}

  <div style="margin-bottom: 20px;">
    <p style="font-size: 16px; line-height: 1.6; color: #333;">
      ¡Gracias!
    </p>
  </div>

  ${signature}
</div>`;
};

export const getSignatureTemplate = (groomName: string, brideName: string, profileImage?: string) => {
  return `
<div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
  <table cellpadding="0" cellspacing="0" style="border: none;">
    <tr>
      <td style="vertical-align: middle; padding-right: 15px;">
        <img src="${profileImage || 'https://images.pexels.com/photos/931158/pexels-photo-931158.jpeg?w=50&h=50'}" 
             alt="Logo" 
             style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover;">
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
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <a href="https://tuparte.digital" style="text-decoration: none; color: #666;">
            <img src="https://res.cloudinary.com/sorostica/image/upload/v1750830636/logo-parte_r2bfjg.png" 
                 alt="TuParte Digital" 
                 style="height: 30px; width: auto; margin-bottom: 8px;">
            <p style="color: #666; font-size: 12px; margin: 0;">
              Con ❤️ por TuParte Digital
            </p>
          </a>
        </div>
</div>`;
}; 
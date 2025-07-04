// Plantilla de email de invitación para TuParte Digital
export function createInvitationEmail({ attendee, landingPage, invitationUrl }: {
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
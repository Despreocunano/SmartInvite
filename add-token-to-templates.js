import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lista de todas las plantillas
const templates = [
  'minimalista',
  'black_rose', 
  'deluxe_terra',
  'barroco',
  'esmeralda',
  'flowers',
  'cerezo',
  'girasol_noche',
  'burdeos',
  'girasol_dia'
];

// Función para agregar token a una plantilla
function addTokenToTemplate(templateName) {
  const filePath = path.join(__dirname, 'src/components/landing/templates', templateName, 'components/Events.tsx');
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ Archivo no encontrado: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;
  
  // Verificar si ya tiene la funcionalidad del token
  if (content.includes('invitationToken')) {
    console.log(`⏭️  Ya tiene token: ${templateName}`);
    return;
  }

  // 1. Agregar import de React si no existe
  if (!content.includes("import React from 'react';")) {
    content = content.replace(
      /import { useState } from 'react';/,
      "import React, { useState } from 'react';"
    );
    hasChanges = true;
  }

  // 2. Agregar estado para el token
  const stateRegex = /const \[showRsvpModal, setShowRsvpModal\] = useState\(false\);/;
  if (stateRegex.test(content)) {
    content = content.replace(
      stateRegex,
      `const [showRsvpModal, setShowRsvpModal] = useState(false);
  const [invitationToken, setInvitationToken] = useState<string | null>(null);`
    );
    hasChanges = true;
  }

  // 3. Agregar useEffect para obtener el token
  const useEffectRegex = /useEffect\(\(\) => \{/;
  if (useEffectRegex.test(content)) {
    // Agregar antes del primer useEffect
    content = content.replace(
      useEffectRegex,
      `// Get token from URL when component mounts
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      console.log('Token found in URL:', token);
      setInvitationToken(token);
    }
  }, []);

  useEffect(() => {`
    );
    hasChanges = true;
  }

  // 4. Agregar invitationToken al PublicRsvpForm
  const rsvpFormRegex = /<PublicRsvpForm\s+([^>]*)\/>/g;
  content = content.replace(rsvpFormRegex, (match, props) => {
    if (!props.includes('invitationToken')) {
      hasChanges = true;
      return `<PublicRsvpForm
              ${props}
              invitationToken={invitationToken}
            />`;
    }
    return match;
  });

  if (hasChanges) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Token agregado: ${templateName}`);
  } else {
    console.log(`⏭️  Sin cambios: ${templateName}`);
  }
}

// Ejecutar para todas las plantillas
console.log('🔧 Agregando funcionalidad de token a todas las plantillas...\n');

templates.forEach(template => {
  addTokenToTemplate(template);
});

console.log('\n✨ ¡Proceso completado!'); 
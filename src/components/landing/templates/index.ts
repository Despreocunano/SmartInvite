import { SignatureAzureTemplate } from './signature_azure';
import { SignatureCobreTemplate } from './signature_cobre';
import { SignatureEncantoTemplate } from './signature_encanto';
import { SignatureBlackTemplate } from './signature_black';
import { FlowersTemplate } from './flowers';
import { DamascoTemplate } from './damasco';
import { BosqueTemplate } from './bosque';
import { BesoInfinitoTemplate } from './beso_infinito';
import { BesoInfinitoDarkTemplate } from './beso_infinito_dark';
import { MinimalistaTemplate } from './minimalista';
import { AmorEternoTemplate } from './amor_eterno';
import { BarrocoTemplate } from './barroco';
import { LuzNaturalTemplate } from './luz_natural';
import { LuzNocturnaTemplate } from './luz_nocturna';
import { PassportTemplate } from './passport';
import { LatePetroTemplate } from './late_petro';
import { LatePastelTemplate } from './late_pastel';
import { BohoTemplate } from './boho';
import { BohoBotanicoTemplate } from './boho_botanico';
import { NaturalGreenTemplate } from './natural_green';
import { AcuarelaTemplate } from './acuarela';
import type { TemplateProps, Template, TemplateVariantGroup } from './types';

// Definición simplificada de templates con variantes
const templateDefinitions = {
  signature: {
    name: 'Signature',
    baseId: '550e8400-e29b-41d4-a716-446655440000',
    variants: [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Azure',
        color: 'azure',
        colorValue: '#253238',
        component: SignatureAzureTemplate,
        preview: 'https://res.cloudinary.com/sorostica/image/upload/v1750986148/azure_efbqda.png'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
        name: 'Cobre',
        color: 'cobre',
        colorValue: '#5B3229',
        component: SignatureCobreTemplate,
        preview: 'https://res.cloudinary.com/sorostica/image/upload/v1750986148/cobre_qtwden.png'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440008',
        name: 'Encanto',
        color: 'encanto',
        colorValue: '#254636',
        component: SignatureEncantoTemplate,
        preview: 'https://res.cloudinary.com/sorostica/image/upload/v1750986148/verde_zuvgmr.png'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440016',
        name: 'Black',
        color: 'black',
        colorValue: '#3D3D3D',
        component: SignatureBlackTemplate,
        preview: 'https://res.cloudinary.com/sorostica/image/upload/v1751235259/black_l4buco.png'
      }
    ]
  },
  luz: {
    name: 'Luz',
    baseId: '550e8400-e29b-41d4-a716-446655440011',
    variants: [
      {
        id: '550e8400-e29b-41d4-a716-446655440011',
        name: 'Natural',
        color: 'natural',
        colorValue: '#F5FFF5',
        component: LuzNaturalTemplate,
        preview: 'https://res.cloudinary.com/sorostica/image/upload/v1750533538/girasol_dia_ebtxrf.png'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440012',
        name: 'Nocturna',
        color: 'nocturna',
        colorValue: '#333',
        component: LuzNocturnaTemplate,
        preview: 'https://res.cloudinary.com/sorostica/image/upload/v1750533538/girason_noche_zlfbtz.png'
      }
    ]
  },
  late: {
    name: 'Late',
    baseId: '550e8400-e29b-41d4-a716-446655440014',
    variants: [
      {
        id: '550e8400-e29b-41d4-a716-446655440014',
        name: 'Petro',
        color: 'petro',
        colorValue: '#051B24',
        component: LatePetroTemplate,
        preview: 'https://res.cloudinary.com/sorostica/image/upload/v1751168581/late_h6nbzl.png'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440015',
        name: 'Pastel',
        color: 'pastel',
        colorValue: '#fcf6e3',
        component: LatePastelTemplate,
        preview: 'https://res.cloudinary.com/sorostica/image/upload/v1751224934/late_pastel_guspln.png'
      }
    ]
  },
  beso_infinito: {
    name: 'Beso Infinito',
    baseId: '550e8400-e29b-41d4-a716-446655440006',
    variants: [
      {
        id: '550e8400-e29b-41d4-a716-446655440006',
        name: 'Beso Infinito',
        color: 'burdeo',
        colorValue: '#430D0D',
        component: BesoInfinitoTemplate,
        preview: 'https://res.cloudinary.com/sorostica/image/upload/v1751245492/beso_hugmpy.png'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440017',
        name: 'Beso Infinito',
        color: 'black',
        colorValue: '#222831',
        component: BesoInfinitoDarkTemplate,
        preview: 'https://res.cloudinary.com/sorostica/image/upload/v1751245493/beso_2_asg9yy.png'
      }
    ]
  },
  boho: {
    name: 'Boho',
    baseId: '550e8400-e29b-41d4-a716-446655440018',
    variants: [
      {
        id: '550e8400-e29b-41d4-a716-446655440018',
        name: 'Boho',
        color: 'boho',
        colorValue: '#430D0D',
        component: BohoTemplate,
        preview: 'https://res.cloudinary.com/sorostica/image/upload/v1751261232/boho_c3qhu1.png'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440019',
        name: 'Boho Botanico',
        color: 'boho_botanico',
        colorValue: '#869484',
        component: BohoBotanicoTemplate,
        preview: 'https://res.cloudinary.com/sorostica/image/upload/v1751265636/boho_botanico_fzoxsh.png'
      }
    ]
  }
};

// Templates individuales (sin variantes)
const individualTemplates = {
  bosque: {
    id: '550e8400-e29b-41d4-a716-446655440005',
    name: 'Bosque',
    component: BosqueTemplate,
    preview: 'https://res.cloudinary.com/sorostica/image/upload/v1750919544/bosque_portada_m1kgac.png'
  },
  flowers: {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Damasco',
    component: FlowersTemplate,
    preview: 'https://res.cloudinary.com/sorostica/image/upload/v1750228351/flowers_x8glz3.png'
  },
  damasco: {
    id: '550e8400-e29b-41d4-a716-446655440004',
    name: 'Damasco',
    component: DamascoTemplate,
    preview: 'https://res.cloudinary.com/sorostica/image/upload/v1750228019/cerezo_2_vxfrn6.png'
  },
  minimalista: {
    id: '550e8400-e29b-41d4-a716-446655440007',
    name: 'Minimalista',
    component: MinimalistaTemplate,
    preview: 'https://res.cloudinary.com/sorostica/image/upload/v1750228541/minimalista_01_qheez7.png'
  },
  amor_eterno: {
    id: '550e8400-e29b-41d4-a716-446655440009',
    name: 'Amor Eterno',
    component: AmorEternoTemplate,
    preview: 'https://res.cloudinary.com/sorostica/image/upload/v1750299549/blackrose_nhvdaq.png'
  },
  barroco: {
    id: '550e8400-e29b-41d4-a716-446655440010',
    name: 'Barroco',
    component: BarrocoTemplate,
    preview: 'https://res.cloudinary.com/sorostica/image/upload/v1750439537/barroco_trm9ly.png'
  },
  passport: {
    id: '550e8400-e29b-41d4-a716-446655440013',
    name: 'Pasaporte',
    component: PassportTemplate,
    preview: 'https://res.cloudinary.com/sorostica/image/upload/v1750994484/passport_qogrop.png'
    },
    natural_green: {
      id: '550e8400-e29b-41d4-a716-446655440020',
      name: 'Natural Green',
      component: NaturalGreenTemplate,
      preview: 'https://res.cloudinary.com/sorostica/image/upload/v1751318234/natural_green_ctmc8g.png'
    },
    acuarela: {
      id: '550e8400-e29b-41d4-a716-446655440021',
      name: 'Acuarela',
      component: AcuarelaTemplate,
      preview: 'https://res.cloudinary.com/sorostica/image/upload/v1751344295/acuarela_tjbwpx.png'
    }
};

// Generar templates y templateVariants automáticamente
export const templateVariants: Record<string, TemplateVariantGroup> = {};
export const templates: Record<string, Template> = {};

// Procesar templates con variantes
Object.entries(templateDefinitions).forEach(([key, definition]) => {
  templateVariants[key] = {
    baseId: definition.baseId,
    name: definition.name,
    variants: definition.variants
  };

  // Crear un template por cada variante
  definition.variants.forEach((variant, index) => {
    const templateKey = index === 0 ? `${key}_${variant.color}` : `${key}_${variant.color}`;
    templates[templateKey] = {
      id: variant.id,
      name: `${definition.name} ${variant.name}`,
      component: variant.component,
      preview: variant.preview,
      hasVariants: true,
      variantGroup: key
    };
  });
});

// Agregar templates individuales
Object.entries(individualTemplates).forEach(([key, template]) => {
  templates[key] = {
    ...template,
    hasVariants: false
  };
});

// Generar templateIdMap automáticamente
const templateIdMap: Record<string, string> = {};
Object.entries(templates).forEach(([key, template]) => {
  templateIdMap[template.id] = key;
});

export function getTemplate(templateId: string): Template | null {
  const templateKey = templateIdMap[templateId];
  return templateKey ? templates[templateKey] : null;
}

// Get unique templates for display (grouping variants)
export function getUniqueTemplates(): (Template | TemplateVariantGroup)[] {
  const uniqueTemplates: (Template | TemplateVariantGroup)[] = [];
  const processedGroups = new Set<string>();

  Object.values(templates).forEach((template) => {
    if (template.hasVariants && template.variantGroup) {
      if (!processedGroups.has(template.variantGroup)) {
        const variantGroup = templateVariants[template.variantGroup];
        if (variantGroup) {
          uniqueTemplates.push({
            ...variantGroup,
            isVariantGroup: true
          });
          processedGroups.add(template.variantGroup);
        }
      }
    } else if (!template.hasVariants) {
      uniqueTemplates.push(template);
    }
  });

  return uniqueTemplates;
}

export type { TemplateProps };
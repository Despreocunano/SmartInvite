import { LatePetroTemplate } from '../../components/landing/templates/late_petro';

export default function ExampleLatePetroPage() {
  return (
    <LatePetroTemplate
      groomName="Sofía"
      brideName="Tomás"
      weddingDate={new Date('2025-11-10T17:30:00').toISOString()}
      welcomeMessage="¡Nos emociona compartir este día con ustedes!"
      hashtag="#SofiaYTomas2025"
      ceremonyDate={new Date('2025-11-10T17:30:00').toISOString()}
      ceremonyTime="17:30"
      ceremonyLocation="Iglesia San Juan"
      ceremonyAddress="Av. del Sol 456, Valparaíso"
      ceremonyPlaceId="ChIJ1234567890"
      partyDate={new Date('2025-11-10T20:00:00').toISOString()}
      partyTime="20:00"
      partyLocation="Club Social"
      partyAddress="Calle Luna 789, Valparaíso"
      partyPlaceId="ChIJ0987654321"
      musicEnabled={true}
      musicUrl="https://res.cloudinary.com/sorostica/video/upload/v1750387028/Bruno_Mars_-_Marry_You_Lyrics_NXTca1xc6O4_pgl1aw.mp3"
      coverImage="https://res.cloudinary.com/sorostica/image/upload/v1750355980/ejemplos%20partes/338_psip7x.jpg"
      galleryImages={[
        "https://res.cloudinary.com/sorostica/image/upload/v1750355980/ejemplos%20partes/2149868548_c8judk.jpg",
        "https://res.cloudinary.com/sorostica/image/upload/v1750355980/ejemplos%20partes/18047_zzca9u.jpg",
        "https://res.cloudinary.com/sorostica/image/upload/v1750355980/ejemplos%20partes/2149155580_phgipy.jpg",
        "https://res.cloudinary.com/sorostica/image/upload/v1750355980/ejemplos%20partes/18112_redbdd.jpg",
        "https://res.cloudinary.com/sorostica/image/upload/v1750355980/ejemplos%20partes/2148768327_jctnyu.jpg"
      ]}
      userId="demo-user-id"
      bankInfo={{
        accountHolder: "Sofía Ramírez",
        rut: "12.345.678-9",
        bank: "Banco Estado",
        accountType: "Cuenta Corriente",
        accountNumber: "123456789",
        email: "sofia@email.com"
      }}
      dress_code="Formal"
      additional_info="¡No olvides tu mejor sonrisa!"
      accepts_kids={true}
      accepts_pets={false}
      couple_code="SOFIATOMAS2025"
      store="https://listaderegalos.com/sofia-tomas"
      wishListItems={[
        {
          id: "1",
          name: "Juego de toallas premium",
          price: 35000,
          icon: "bath"
        }
      ]}
      isDemo={true}
      bank_info_enabled={true}
      wish_list_enabled={true}
      couple_code_enabled={true}
    />
  );
} 
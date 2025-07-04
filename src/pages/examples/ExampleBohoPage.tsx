import { BohoTemplate } from '../../components/landing/templates/boho';

export default function ExampleBohoPage() {
  return (
    <BohoTemplate
      groomName="Martina"
      brideName="Felipe"
      weddingDate={new Date('2025-06-30T17:00:00').toISOString()}
      welcomeMessage="¡Bienvenidos a nuestra boda! Nos alegra compartir este día tan especial con ustedes."
      hashtag="#MartinaYFelipe2025"
      ceremonyDate={new Date('2025-06-30T17:00:00').toISOString()}
      ceremonyTime="17:00"
      ceremonyLocation="Jardín Botánico"
      ceremonyAddress="Av. de las Flores 123, Viña del Mar"
      ceremonyPlaceId="ChIJ1234567890"
      partyDate={new Date('2025-06-30T20:00:00').toISOString()}
      partyTime="20:00"
      partyLocation="Casa de Campo"
      partyAddress="Camino Verde 456, Viña del Mar"
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
        accountHolder: "Martina López",
        rut: "12.345.678-9",
        bank: "Banco Estado",
        accountType: "Cuenta Corriente",
        accountNumber: "123456789",
        email: "martina@email.com"
      }}
      dress_code="Formal"
      additional_info="La celebración será al aire libre."
      accepts_kids={true}
      accepts_pets={true}
      couple_code="MARTINAFELIPE2025"
      store="https://listaderegalos.com/martina-felipe"
      wishListItems={[
        {
          id: "1",
          name: "Juego de sábanas de algodón egipcio",
          price: 120000,
          icon: "home"
        },
        {
          id: "2",
          name: "Set de ollas de acero inoxidable",
          price: 250000,
          icon: "dinner"
        },
        {
          id: "3",
          name: "Vale para cena romántica",
          price: 80000,
          icon: "love"
        }
      ]}
      isDemo={true}
      bank_info_enabled={true}
      wish_list_enabled={true}
      couple_code_enabled={true}
    />
  );
} 
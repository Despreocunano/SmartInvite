import { AcuarelaTemplate } from '../../components/landing/templates/acuarela';

export default function ExampleAcuarelaPage() {
  return (
    <AcuarelaTemplate
      groomName="Camila"
      brideName="Joaquín"
      weddingDate={new Date('2025-10-10T18:00:00').toISOString()}
      welcomeMessage="¡Nos emociona compartir este día tan especial contigo!"
      hashtag="CamilaYJoaquin2025"
      ceremonyDate={new Date('2025-10-10T18:00:00').toISOString()}
      ceremonyTime="18:00"
      ceremonyLocation="Club de Campo Acuarela"
      ceremonyAddress="Av. del Lago 123, Frutillar"
      ceremonyPlaceId="ChIJ1234567890"
      partyDate={new Date('2025-10-10T21:00:00').toISOString()}
      partyTime="21:00"
      partyLocation="Salón Acuarela"
      partyAddress="Av. del Lago 123, Frutillar"
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
        accountHolder: "Camila Torres",
        rut: "18.234.567-8",
        bank: "Banco Santander",
        accountType: "Cuenta Corriente",
        accountNumber: "234567890",
        email: "camila@email.com"
      }}
      dress_code="Formal"
      additional_info="La celebración será en un entorno natural, sugerimos llevar abrigo."
      accepts_kids={true}
      accepts_pets={true}
      couple_code="CAMILAYJOAQUIN2025"
      store="falabella"
      wishListItems={[
        {
          id: "1",
          name: "Set de copas de vino",
          price: 45000,
          icon: "wine"
        },
        {
          id: "2",
          name: "Aporte luna de miel",
          price: 100000,
          icon: "travel"
        },
        {
          id: "3",
          name: "Parrilla eléctrica",
          price: 85000,
          icon: "bbq"
        }
      ]}
      isDemo={true}
      bank_info_enabled={true}
      wish_list_enabled={true}
      couple_code_enabled={true}
    />
  );
} 
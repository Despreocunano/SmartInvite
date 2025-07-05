import { AcuarelaTemplate } from '../../components/landing/templates/acuarela';

export default function ExampleAcuarelaEnglishPage() {
  return (
    <AcuarelaTemplate
      groomName="John"
      brideName="Sarah"
      weddingDate={new Date('2025-10-10T18:00:00').toISOString()}
      welcomeMessage="We're excited to share this special day with you!"
      hashtag="JohnAndSarah2025"
      ceremonyDate={new Date('2025-10-10T18:00:00').toISOString()}
      ceremonyTime="18:00"
      ceremonyLocation="Acuarela Country Club"
      ceremonyAddress="Lake Ave 123, Frutillar"
      ceremonyPlaceId="ChIJ1234567890"
      partyDate={new Date('2025-10-10T21:00:00').toISOString()}
      partyTime="21:00"
      partyLocation="Acuarela Hall"
      partyAddress="Lake Ave 123, Frutillar"
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
        accountHolder: "Sarah Johnson",
        rut: "18.234.567-8",
        bank: "Santander Bank",
        accountType: "Checking Account",
        accountNumber: "234567890",
        email: "sarah@email.com"
      }}
      dress_code="Formal"
      additional_info="The celebration will be in a natural setting, we suggest bringing a jacket."
      accepts_kids={true}
      accepts_pets={true}
      couple_code="JOHNANDSARAH2025"
      store="falabella"
      userLanguage="en"
      wishListItems={[
        {
          id: "1",
          name: "Wine glass set",
          price: 45000,
          icon: "wine"
        },
        {
          id: "2",
          name: "Honeymoon contribution",
          price: 100000,
          icon: "travel"
        },
        {
          id: "3",
          name: "Electric grill",
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
import { BohoTemplate } from '../../components/landing/templates/boho';

export default function ExampleBohoEnglishPage() {
  return (
    <BohoTemplate
      groomName="David"
      brideName="Sophie"
      weddingDate={new Date('2025-08-20T17:00:00').toISOString()}
      welcomeMessage="Join us for a bohemian celebration of love!"
      hashtag="#DavidAndSophie2025"
      ceremonyDate={new Date('2025-08-20T17:00:00').toISOString()}
      ceremonyTime="17:00"
      ceremonyLocation="Sunset Gardens"
      ceremonyAddress="789 Nature Way, California"
      ceremonyPlaceId="ChIJ1234567890"
      partyDate={new Date('2025-08-20T20:00:00').toISOString()}
      partyTime="20:00"
      partyLocation="Bohemian Barn"
      partyAddress="456 Rustic Road, California"
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
        accountHolder: "Sophie Williams",
        rut: "18.234.567-8",
        bank: "Wells Fargo",
        accountType: "Savings Account",
        accountNumber: "234567890",
        email: "sophie@email.com"
      }}
      dress_code="Bohemian Chic"
      additional_info="A relaxed celebration in nature. Bring your good vibes!"
      accepts_kids={true}
      accepts_pets={true}
      couple_code="DAVIDSOPHIE2025"
      store="falabella"
      userLanguage="en"
      wishListItems={[
        {
          id: "1",
          name: "Handmade pottery set",
          price: 35000,
          icon: "gift"
        },
        {
          id: "2",
          name: "Adventure fund",
          price: 80000,
          icon: "travel"
        },
        {
          id: "3",
          name: "Garden tools",
          price: 25000,
          icon: "garden"
        }
      ]}
      isDemo={true}
      bank_info_enabled={true}
      wish_list_enabled={true}
      couple_code_enabled={true}
    />
  );
} 
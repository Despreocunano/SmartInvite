import { LatePetroTemplate } from '../../components/landing/templates/late_petro';

export default function ExampleLatePetroEnglishPage() {
  return (
    <LatePetroTemplate
      groomName="Christopher"
      brideName="Victoria"
      weddingDate={new Date('2025-05-10T19:00:00').toISOString()}
      welcomeMessage="A sophisticated celebration of elegance and love!"
      hashtag="#ChrisAndVicky2025"
      ceremonyDate={new Date('2025-05-10T19:00:00').toISOString()}
      ceremonyTime="19:00"
      ceremonyLocation="Petroleum Club"
      ceremonyAddress="123 Luxury Blvd, Houston"
      ceremonyPlaceId="ChIJ1234567890"
      partyDate={new Date('2025-05-10T22:00:00').toISOString()}
      partyTime="22:00"
      partyLocation="Executive Hall"
      partyAddress="456 Premium St, Houston"
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
        accountHolder: "Victoria Smith",
        rut: "28.901.234-5",
        bank: "Premium Bank",
        accountType: "Executive Account",
        accountNumber: "789012345",
        email: "victoria@email.com"
      }}
      dress_code="Black Tie"
      additional_info="An elegant celebration in sophisticated style."
      accepts_kids={false}
      accepts_pets={false}
      couple_code="CHRISVICKY2025"
      store="paris"
      userLanguage="en"
      wishListItems={[
        {
          id: "1",
          name: "Luxury watch set",
          price: 200000,
          icon: "watch"
        },
        {
          id: "2",
          name: "Fine dining experience",
          price: 120000,
          icon: "dinner"
        }
      ]}
      isDemo={true}
      bank_info_enabled={true}
      wish_list_enabled={true}
      couple_code_enabled={true}
    />
  );
} 
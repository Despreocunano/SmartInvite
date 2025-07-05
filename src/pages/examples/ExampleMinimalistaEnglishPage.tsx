import { MinimalistaTemplate } from '../../components/landing/templates/minimalista';

export default function ExampleMinimalistaEnglishPage() {
  return (
    <MinimalistaTemplate
      groomName="James"
      brideName="Olivia"
      weddingDate={new Date('2025-11-08T19:00:00').toISOString()}
      welcomeMessage="Simple elegance, timeless love."
      hashtag="#JamesAndOlivia2025"
      ceremonyDate={new Date('2025-11-08T19:00:00').toISOString()}
      ceremonyTime="19:00"
      ceremonyLocation="Modern Gallery"
      ceremonyAddress="123 Minimalist Ave, Los Angeles"
      ceremonyPlaceId="ChIJ1234567890"
      partyDate={new Date('2025-11-08T22:00:00').toISOString()}
      partyTime="22:00"
      partyLocation="Clean Space"
      partyAddress="456 Simple St, Los Angeles"
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
        accountHolder: "Olivia Brown",
        rut: "15.678.901-2",
        bank: "Bank of America",
        accountType: "Checking Account",
        accountNumber: "345678901",
        email: "olivia@email.com"
      }}
      dress_code="Minimalist Elegance"
      additional_info="A celebration of simplicity and love."
      accepts_kids={false}
      accepts_pets={false}
      couple_code="JAMESOLIVIA2025"
      store="paris"
      userLanguage="en"
      wishListItems={[
        {
          id: "1",
          name: "Minimalist vase set",
          price: 40000,
          icon: "gift"
        },
        {
          id: "2",
          name: "Design books",
          price: 30000,
          icon: "book"
        }
      ]}
      isDemo={true}
      bank_info_enabled={true}
      wish_list_enabled={true}
      couple_code_enabled={true}
    />
  );
} 
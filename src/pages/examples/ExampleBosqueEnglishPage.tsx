import { BosqueTemplate } from '../../components/landing/templates/bosque';

export default function ExampleBosqueEnglishPage() {
  return (
    <BosqueTemplate
      groomName="Forest"
      brideName="Maya"
      weddingDate={new Date('2025-07-20T16:30:00').toISOString()}
      welcomeMessage="A magical forest celebration of our love!"
      hashtag="#ForestAndMaya2025"
      ceremonyDate={new Date('2025-07-20T16:30:00').toISOString()}
      ceremonyTime="16:30"
      ceremonyLocation="Enchanted Forest"
      ceremonyAddress="123 Woodland Path, Seattle"
      ceremonyPlaceId="ChIJ1234567890"
      partyDate={new Date('2025-07-20T19:30:00').toISOString()}
      partyTime="19:30"
      partyLocation="Forest Lodge"
      partyAddress="456 Tree Line, Seattle"
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
        accountHolder: "Maya Thompson",
        rut: "35.678.901-2",
        bank: "Forest Bank",
        accountType: "Nature Account",
        accountNumber: "012345678",
        email: "maya@email.com"
      }}
      dress_code="Forest Elegance"
      additional_info="A magical celebration in the heart of nature."
      accepts_kids={true}
      accepts_pets={true}
      couple_code="FORESTMAYA2025"
      store="falabella"
      userLanguage="en"
      wishListItems={[
        {
          id: "1",
          name: "Camping gear set",
          price: 85000,
          icon: "camping"
        },
        {
          id: "2",
          name: "Adventure fund",
          price: 120000,
          icon: "adventure"
        },
        {
          id: "3",
          name: "Nature photography equipment",
          price: 95000,
          icon: "camera"
        }
      ]}
      isDemo={true}
      bank_info_enabled={true}
      wish_list_enabled={true}
      couple_code_enabled={true}
    />
  );
} 
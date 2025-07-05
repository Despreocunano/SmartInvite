import { BesoInfinitoDarkTemplate } from '../../components/landing/templates/beso_infinito_dark';

export default function ExampleBesoInfinitoDarkEnglishPage() {
  return (
    <BesoInfinitoDarkTemplate
      groomName="Michael"
      brideName="Emma"
      weddingDate={new Date('2025-09-15T18:00:00').toISOString()}
      welcomeMessage="Thank you for joining us on this special day!"
      hashtag="#MichaelAndEmma2025"
      ceremonyDate={new Date('2025-09-15T18:00:00').toISOString()}
      ceremonyTime="18:00"
      ceremonyLocation="Central Park"
      ceremonyAddress="123 Main St, New York"
      ceremonyPlaceId="ChIJ1234567890"
      partyDate={new Date('2025-09-15T21:00:00').toISOString()}
      partyTime="21:00"
      partyLocation="Stellar Hall"
      partyAddress="456 Fictional Ave, New York"
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
        accountHolder: "Michael Johnson",
        rut: "12.345.678-9",
        bank: "Chase Bank",
        accountType: "Checking Account",
        accountNumber: "123456789",
        email: "michael@email.com"
      }}
      dress_code="Formal"
      additional_info="Open bar and dance floor all night long!"
      accepts_kids={false}
      accepts_pets={true}
      couple_code="MICHAELEMMA2025"
      store="https://giftregistry.com/michael-emma"
      userLanguage="en"
      wishListItems={[
        {
          id: "1",
          name: "Wine glass set",
          price: 60000,
          icon: "wine"
        },
        {
          id: "2",
          name: "Italian coffee maker",
          price: 45000,
          icon: "coffee"
        }
      ]}
      isDemo={true}
      bank_info_enabled={true}
      wish_list_enabled={true}
      couple_code_enabled={true}
    />
  );
} 
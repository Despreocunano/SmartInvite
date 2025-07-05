import { BohoBotanicoTemplate } from '../../components/landing/templates/boho_botanico';

export default function ExampleBohoBotanicoEnglishPage() {
  return (
    <BohoBotanicoTemplate
      groomName="Daniel"
      brideName="Lily"
      weddingDate={new Date('2025-08-15T17:00:00').toISOString()}
      welcomeMessage="A botanical celebration of natural beauty and love!"
      hashtag="#DanielAndLily2025"
      ceremonyDate={new Date('2025-08-15T17:00:00').toISOString()}
      ceremonyTime="17:00"
      ceremonyLocation="Botanical Gardens"
      ceremonyAddress="123 Plant Way, Portland"
      ceremonyPlaceId="ChIJ1234567890"
      partyDate={new Date('2025-08-15T20:00:00').toISOString()}
      partyTime="20:00"
      partyLocation="Greenhouse Hall"
      partyAddress="456 Flower St, Portland"
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
        accountHolder: "Lily Anderson",
        rut: "32.456.789-0",
        bank: "Nature Bank",
        accountType: "Botanical Account",
        accountNumber: "901234567",
        email: "lily@email.com"
      }}
      dress_code="Botanical Bohemian"
      additional_info="A celebration surrounded by nature's beauty."
      accepts_kids={true}
      accepts_pets={true}
      couple_code="DANIELLILY2025"
      store="paris"
      userLanguage="en"
      wishListItems={[
        {
          id: "1",
          name: "Indoor plant collection",
          price: 45000,
          icon: "plant"
        },
        {
          id: "2",
          name: "Garden tools set",
          price: 35000,
          icon: "garden"
        },
        {
          id: "3",
          name: "Botanical books",
          price: 28000,
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
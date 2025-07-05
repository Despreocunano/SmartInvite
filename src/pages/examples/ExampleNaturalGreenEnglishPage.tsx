import { NaturalGreenTemplate } from '../../components/landing/templates/natural_green';

export default function ExampleNaturalGreenEnglishPage() {
  return (
    <NaturalGreenTemplate
      groomName="William"
      brideName="Charlotte"
      weddingDate={new Date('2025-07-15T17:30:00').toISOString()}
      welcomeMessage="A celebration surrounded by nature and love!"
      hashtag="#WilliamAndCharlotte2025"
      ceremonyDate={new Date('2025-07-15T17:30:00').toISOString()}
      ceremonyTime="17:30"
      ceremonyLocation="Green Meadows"
      ceremonyAddress="123 Nature Trail, Oregon"
      ceremonyPlaceId="ChIJ1234567890"
      partyDate={new Date('2025-07-15T20:30:00').toISOString()}
      partyTime="20:30"
      partyLocation="Forest Lodge"
      partyAddress="456 Woodland Dr, Oregon"
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
        accountHolder: "Charlotte Green",
        rut: "22.345.678-9",
        bank: "Green Bank",
        accountType: "Eco Account",
        accountNumber: "567890123",
        email: "charlotte@email.com"
      }}
      dress_code="Garden Party"
      additional_info="An eco-friendly celebration in harmony with nature."
      accepts_kids={true}
      accepts_pets={true}
      couple_code="WILLCHARLOTTE2025"
      store="paris"
      userLanguage="en"
      wishListItems={[
        {
          id: "1",
          name: "Organic garden kit",
          price: 55000,
          icon: "garden"
        },
        {
          id: "2",
          name: "Eco-friendly home items",
          price: 75000,
          icon: "home"
        },
        {
          id: "3",
          name: "Tree planting donation",
          price: 30000,
          icon: "tree"
        }
      ]}
      isDemo={true}
      bank_info_enabled={true}
      wish_list_enabled={true}
      couple_code_enabled={true}
    />
  );
} 
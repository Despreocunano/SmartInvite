import { PassportTemplate } from '../../components/landing/templates/passport';

export default function ExamplePassportEnglishPage() {
  return (
    <PassportTemplate
      groomName="Alexander"
      brideName="Isabella"
      weddingDate={new Date('2025-12-12T16:00:00').toISOString()}
      welcomeMessage="Join us on this journey of love!"
      hashtag="#AlexAndBella2025"
      ceremonyDate={new Date('2025-12-12T16:00:00').toISOString()}
      ceremonyTime="16:00"
      ceremonyLocation="Traveler's Chapel"
      ceremonyAddress="789 Adventure Blvd, Miami"
      ceremonyPlaceId="ChIJ1234567890"
      partyDate={new Date('2025-12-12T19:00:00').toISOString()}
      partyTime="19:00"
      partyLocation="Global Lounge"
      partyAddress="456 World Way, Miami"
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
        accountHolder: "Isabella Rodriguez",
        rut: "20.123.456-7",
        bank: "Citibank",
        accountType: "Travel Account",
        accountNumber: "456789012",
        email: "isabella@email.com"
      }}
      dress_code="Travel Chic"
      additional_info="A celebration of our love for travel and adventure!"
      accepts_kids={true}
      accepts_pets={false}
      couple_code="ALEXBELLA2025"
      store="falabella"
      userLanguage="en"
      wishListItems={[
        {
          id: "1",
          name: "Luggage set",
          price: 120000,
          icon: "travel"
        },
        {
          id: "2",
          name: "Travel guide books",
          price: 25000,
          icon: "book"
        },
        {
          id: "3",
          name: "Honeymoon fund",
          price: 150000,
          icon: "heart"
        }
      ]}
      isDemo={true}
      bank_info_enabled={true}
      wish_list_enabled={true}
      couple_code_enabled={true}
    />
  );
} 
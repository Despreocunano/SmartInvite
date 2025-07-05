import { LatePastelTemplate } from '../../components/landing/templates/late_pastel';

export default function ExampleLatePastelEnglishPage() {
  return (
    <LatePastelTemplate
      groomName="Benjamin"
      brideName="Grace"
      weddingDate={new Date('2025-06-28T18:30:00').toISOString()}
      welcomeMessage="A soft and romantic celebration of our love!"
      hashtag="#BenAndGrace2025"
      ceremonyDate={new Date('2025-06-28T18:30:00').toISOString()}
      ceremonyTime="18:30"
      ceremonyLocation="Pastel Gardens"
      ceremonyAddress="789 Soft Lane, San Francisco"
      ceremonyPlaceId="ChIJ1234567890"
      partyDate={new Date('2025-06-28T21:30:00').toISOString()}
      partyTime="21:30"
      partyLocation="Dreamy Hall"
      partyAddress="456 Gentle Ave, San Francisco"
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
        accountHolder: "Grace Wilson",
        rut: "25.678.901-3",
        bank: "Soft Bank",
        accountType: "Dream Account",
        accountNumber: "678901234",
        email: "grace@email.com"
      }}
      dress_code="Soft Elegance"
      additional_info="A dreamy celebration in pastel tones."
      accepts_kids={true}
      accepts_pets={true}
      couple_code="BENGRACE2025"
      store="falabella"
      userLanguage="en"
      wishListItems={[
        {
          id: "1",
          name: "Pastel kitchen set",
          price: 65000,
          icon: "kitchen"
        },
        {
          id: "2",
          name: "Romantic dinner fund",
          price: 90000,
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
import { NaturalGreenTemplate } from '../../components/landing/templates/natural_green';

export default function ExampleNaturalGreenPage() {
  return (
    <NaturalGreenTemplate
      groomName="Valentina"
      brideName="Andrés"
      weddingDate={new Date('2025-11-15T16:30:00').toISOString()}
      welcomeMessage="¡Gracias por acompañarnos en este día tan especial!"
      hashtag="ValentinaYAndres2025"
      ceremonyDate={new Date('2025-11-15T16:30:00').toISOString()}
      ceremonyTime="16:30"
      ceremonyLocation="Parque Natural Los Robles"
      ceremonyAddress="Camino del Bosque 789, Pucón"
      ceremonyPlaceId="ChIJ9876543210"
      partyDate={new Date('2025-11-15T20:00:00').toISOString()}
      partyTime="20:00"
      partyLocation="Salón del Lago"
      partyAddress="Ruta 5 Sur, Km 700, Pucón"
      partyPlaceId="ChIJ0123456789"
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
        accountHolder: "Valentina Ríos",
        rut: "15.678.910-2",
        bank: "Banco de Chile",
        accountType: "Cuenta Vista",
        accountNumber: "987654321",
        email: "valentina@email.com"
      }}
      dress_code="Cóctel"
      additional_info="La fiesta será en un entorno natural, sugerimos llevar abrigo."
      accepts_kids={true}
      accepts_pets={false}
      couple_code="VALENTINAANDRES2025"
      store="falabella"
      wishListItems={[
        {
          id: "1",
          name: "Set de copas de vino",
          price: 45000,
          icon: "wine"
        },
        {
          id: "2",
          name: "Aporte luna de miel",
          price: 100000,
          icon: "travel"
        },
        {
          id: "3",
          name: "Parrilla eléctrica",
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
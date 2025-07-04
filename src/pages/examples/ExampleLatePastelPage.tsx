import { LatePastelTemplate } from '../../components/landing/templates/late_pastel';

export default function ExampleLatePastelPage() {
  return (
    <LatePastelTemplate
      groomName="Camila"
      brideName="Ignacio"
      weddingDate={new Date('2025-10-05T16:00:00').toISOString()}
      welcomeMessage="¡Bienvenidos a nuestra celebración!"
      hashtag="#CamilaYNacho2025"
      ceremonyDate={new Date('2025-10-05T16:00:00').toISOString()}
      ceremonyTime="16:00"
      ceremonyLocation="Jardín de las Rosas"
      ceremonyAddress="Av. Primavera 321, Concepción"
      ceremonyPlaceId="ChIJ1234567890"
      partyDate={new Date('2025-10-05T19:00:00').toISOString()}
      partyTime="19:00"
      partyLocation="Salón Primavera"
      partyAddress="Calle Primavera 654, Concepción"
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
        accountHolder: "Camila Torres",
        rut: "12.345.678-9",
        bank: "Banco Estado",
        accountType: "Cuenta Corriente",
        accountNumber: "123456789",
        email: "camila@email.com"
      }}
      dress_code="Formal"
      additional_info="¡Esperamos que disfruten mucho!"
      accepts_kids={true}
      accepts_pets={true}
      couple_code="CAMILAINACHO2025"
      store="https://listaderegalos.com/camila-ignacio"
      wishListItems={[
        {
          id: "1",
          name: "Set de cuchillos profesionales",
          price: 90000,
          icon: "knife"
        }
      ]}
      isDemo={true}
      bank_info_enabled={true}
      wish_list_enabled={true}
      couple_code_enabled={true}
    />
  );
} 
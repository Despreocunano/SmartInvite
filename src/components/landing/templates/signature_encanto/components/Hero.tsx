import cornerSvg from '../assets/corner.svg';
import separatorSvg from '../assets/separator.svg';

interface HeroProps {
  groomName: string;
  brideName: string;
  weddingDate: string;
  welcomeMessage?: string;
  backgroundImage?: string;
  className?: string;
}

export function Hero({
  groomName,
  brideName,
  weddingDate,
  welcomeMessage,
  backgroundImage = 'https://images.pexels.com/photos/931796/pexels-photo-931796.jpeg',
  className = ''
}: HeroProps) {
  const formattedDate = new Date(weddingDate).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
  });

  return (
    <section className={`relative h-auto ${className}`}>
    <div className="grid grid-rows-[auto_auto] lg:grid-cols-2 h-full">
      {/* Imagen arriba en mobile, a la izquierda en desktop */}
      <div className="relative h-[40vh] lg:h-full order-1">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
      </div>
  
      <div className="relative flex items-center justify-center p-8 lg:p-20 z-10 lg:bg-transparent order-2">
        <div className="relative text-center text-[#D4B572] w-full max-w-2xl mx-auto">
          {/* Esquinas decorativas */}
          <div className="absolute top-0 left-0 w-[160px] h-[160px] -translate-x-4 -translate-y-4">
            <img src={cornerSvg} alt="" className="w-full h-full" />
          </div>
          <div className="absolute top-0 right-0 w-[160px] h-[160px] translate-x-4 -translate-y-4 rotate-90">
            <img src={cornerSvg} alt="" className="w-full h-full" />
          </div>
          <div className="absolute bottom-0 left-0 w-[160px] h-[160px] -translate-x-4 translate-y-4 -rotate-90">
            <img src={cornerSvg} alt="" className="w-full h-full" />
          </div>
          <div className="absolute bottom-0 right-0 w-[160px] h-[160px] translate-x-4 translate-y-4 rotate-180">
            <img src={cornerSvg} alt="" className="w-full h-full" />
          </div>
  
  
          {/* Texto principal */}
          <div className="py-20 px-2">
            <p className="text-lg mb-6 font-light tracking-[0.2em] uppercase">
              {formattedDate}
            </p>
            <div className="space-y-4 mb-8">
              <h1 className="text-8xl md:text-9xl font-serif">
                {groomName.charAt(0)} <span className="font-light text-[#C58F4D] text-7xl md:text-8xl">&</span> {brideName.charAt(0)}
              </h1>
              <p className="text-3xl md:text-4xl font-light tracking-widest uppercase text-[#C58F4D]">
                {groomName} & {brideName}
              </p>
            </div>
            {welcomeMessage && (
              <>
                <p className="text-xl font-light leading-relaxed mb-6 text-[#D4B573]">
                  {welcomeMessage}
                </p>
                <div className="flex justify-center">
                  <img src={separatorSvg} alt="" className="h-16" />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  </section>
  );
}
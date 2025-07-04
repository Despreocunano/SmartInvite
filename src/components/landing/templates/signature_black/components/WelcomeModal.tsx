import { Button } from '../../../../ui/Button';
import { Music } from 'lucide-react';

interface WelcomeModalProps {
  groomName: string;
  brideName: string;
  onEnterWithMusic: () => void;
  onEnterWithoutMusic: () => void;
}

export function WelcomeModal({
  groomName,
  brideName,
  onEnterWithMusic,
  onEnterWithoutMusic
}: WelcomeModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000]">
      <div className="relative w-full max-w-2xl px-8 py-12 text-center text-[#D4B572]">
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-24 h-24 border-l-2 border-t-2 border-[#D4B572]/30"></div>
        <div className="absolute top-0 right-0 w-24 h-24 border-r-2 border-t-2 border-[#D4B572]/30"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 border-l-2 border-b-2 border-[#D4B572]/30"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 border-r-2 border-b-2 border-[#D4B572]/30"></div>

        {/* Content */}
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-lg font-light tracking-[0.2em] uppercase">
              Bienvenidos a la invitación de
            </p>
            <div className="space-y-4">
              <p className="text-8xl font-serif">
                {groomName} & {brideName}
              </p>
            </div>
          </div>
          <div className="space-y-6">
            <p className="text-lg font-light">
              La música de fondo es parte de la experiencia
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                type="button"
                onClick={onEnterWithMusic}
                leftIcon={<Music className="h-4 w-4" />}
              >
                Ingresar con música
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={onEnterWithoutMusic}
              >
                Ingresar sin música
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#A19567]">
      <div className="relative w-full max-w-3xl px-12 py-12 text-center text-white">
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-24 h-24">
        </div>
        <div className="absolute top-0 right-0 w-24 h-24 scale-x-[-1]">
        </div>
        <div className="absolute bottom-0 left-0 w-24 h-24 scale-y-[-1]">
        </div>
        <div className="absolute bottom-0 right-0 w-24 h-24 scale-[-1]">
        </div>

        {/* Content */}
        <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-9xl font-carattere text-white">
              {groomName} & {brideName}
              </h1>
          
          </div>

          <div className="space-y-6">
            <p className="text-lg font-sans text-white">
              La música de fondo es parte de la experiencia
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                type="button"
                onClick={onEnterWithMusic}
                leftIcon={<Music className="h-4 w-4" />}
                className="bg-[#3E3F33] text-white hover:bg-[#3E3F33]/80 rounded-lg border border-[#3E3F33] hover:border-[#3E3F33]"
              >
                Ingresar con música
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={onEnterWithoutMusic}
                className="border-[#3E3F33] text-[#fff] hover:bg-[#3E3F33] hover:text-white rounded-lg"
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
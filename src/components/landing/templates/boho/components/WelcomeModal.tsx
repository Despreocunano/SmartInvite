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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#985E4C]">
      <div className="relative w-full max-w-3xl px-12 py-12 text-center text-[#F8F6F2]">
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
              <h1 className="text-9xl font-ivyora text-[#F8F6F2]">
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
                className="bg-[#c49c79] text-[#000] hover:bg-[#c49c79]/80 hover:text-[#000] rounded-full border border-[#c49c79] hover:border-[#c49c79]"
              >
                Ingresar con música
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={onEnterWithoutMusic}
                className="border-[#c49c79] text-[#fff] hover:bg-[#c49c79] hover:text-[#000] rounded-full"
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
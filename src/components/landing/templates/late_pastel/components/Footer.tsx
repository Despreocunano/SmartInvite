import { Heart } from 'lucide-react';

interface FooterProps {
  groomName: string;
  brideName: string;
  weddingDate: string;
  className?: string;
}

export function Footer({
  groomName,
  brideName,
  weddingDate,
  className = ''
}: FooterProps) {
  return (
    <footer className={`py-24 px-4 ${className}`}>
      <div className="max-w-4xl mx-auto text-center">
        <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <Heart className="w-6 h-6 text-[#3E3F33]" />
        </div>
        
        <h2 className="text-7xl md:text-8xl font-carattere text-[#3E3F33] mb-6">
          {groomName} & {brideName}
        </h2>
        
        <p className="text-[#3E3F33] text-2xl font-sans">
          {new Date(weddingDate).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>
    </footer>
  );
}
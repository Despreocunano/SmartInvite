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
    <footer className={`w-full max-w-4xl mx-auto px-8 py-16 ${className}`}>
      <div className="w-full text-center">
        <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <Heart className="w-6 h-6 text-white" />
        </div>
        
        <h2 className="text-7xl md:text-8xl font-ivyora text-[#FFF] mb-6">
          {groomName} & {brideName}
        </h2>
        
        <p className="text-white text-2xl font-sans">
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
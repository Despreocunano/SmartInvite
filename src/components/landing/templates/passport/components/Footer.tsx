import { HeartIcon } from "../assets/animations/heart"; 

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
      <HeartIcon />
        
        <h2 className="text-5xl md:text-7xl font-elsie text-white mb-6">
          {groomName} & {brideName}
        </h2>
        
        <p className="text-white text-xl font-sans">
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
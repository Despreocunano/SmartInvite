import Lottie from 'lottie-react';
import animationData from './lotties/rings.json';
import { useRef, useEffect } from 'react';

export function RingsIcon() {
  const lottieRef = useRef<any>(null);

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(0.5); // Velocidad más lenta
    }
  }, []);

  return (
    <div className="w-24 h-24 mx-auto mb-8">
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData}
        autoplay
        loop
      />
    </div>
  );
}
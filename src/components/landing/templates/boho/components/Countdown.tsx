import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';


interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownProps {
  date: string;
  className?: string;
}

export function Countdown({ date, className = '' }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(date) - +new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [date]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <section className={`px-4 w-full ${className}`}>
      <div className="relative bg-[#f9f6f2] w-full max-w-4xl mx-auto flex flex-col items-center justify-center px-2 md:px-8 py-16">
        <motion.div 
          className="text-center mb-12"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={container}
        >
          <h2 className="text-6xl font-ivyora text-[#985E4C] mb-4">Faltan</h2>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full px-4">
          <motion.div 
            className="relative group"
            variants={item}
            whileHover={{ scale: 1.05 }}
          >
            <div className="bg-[#985e4c] backdrop-blur-sm rounded-3xl p-8 text-center shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <div className="text-4xl font-bold text-[#FFCBB5] mb-3 font-serif">
                  {timeLeft.days}
                </div>
                <div className="text-[#FFCBB5] text-sm uppercase tracking-wider font-medium">
                  días
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div 
            className="relative group"
            variants={item}
            whileHover={{ scale: 1.05 }}
          >
            <div className="bg-[#985e4c] backdrop-blur-sm rounded-3xl p-8 text-center shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <div className="text-4xl font-bold text-[#FFCBB5] mb-3 font-serif">
                  {timeLeft.hours}
                </div>
                <div className="text-[#FFCBB5] text-sm uppercase tracking-wider font-medium">
                  horas
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div 
            className="relative group"
            variants={item}
            whileHover={{ scale: 1.05 }}
          >
            <div className="bg-[#985e4c] backdrop-blur-sm rounded-3xl p-8 text-center shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <div className="text-4xl font-bold text-[#FFCBB5] mb-3 font-serif">
                  {timeLeft.minutes}
                </div>
                <div className="text-[#FFCBB5] text-sm uppercase tracking-wider font-medium">
                  minutos
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div 
            className="relative group"
            variants={item}
            whileHover={{ scale: 1.05 }}
          >
            <div className="bg-[#985e4c] backdrop-blur-sm rounded-3xl p-8 text-center shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <div className="text-4xl font-bold text-[#FFCBB5] mb-3 font-serif">
                  {timeLeft.seconds}
                </div>
                <div className="text-[#FFCBB5] text-sm uppercase tracking-wider font-medium">
                  segundos
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music } from 'lucide-react';

const CARDS = [
  {
    id: 1,
    gradient: 'from-secondary via-[#2A0808] to-background',
    border: 'border-primary/50',
    title: 'The Royal Wedding',
    names: 'Priya & Arjun',
    date: 'Feb 14, 2025',
    details: 'The Taj Mahal Palace, Mumbai'
  },
  {
    id: 2,
    gradient: 'from-[#0F172A] via-[#1E1B4B] to-background',
    border: 'border-[#F7E7CE]/40',
    title: 'A Cinematic Affair',
    names: 'Rohan & Ananya',
    date: 'Mar 22, 2025',
    details: 'Umaid Bhawan, Jodhpur'
  },
  {
    id: 3,
    gradient: 'from-[#1B4332] via-[#064E3B] to-background',
    border: 'border-[#B76E79]/50',
    title: 'Garden Romance',
    names: 'Zara & Kabir',
    date: 'Apr 05, 2025',
    details: 'Rambagh Palace, Jaipur'
  }
];

export default function PhoneMockup() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % CARDS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-[300px] h-[600px] sm:w-[320px] sm:h-[640px] perspective-[1000px]" data-testid="container-phone-mockup">
      {/* Decorative Elements */}
      <motion.div 
        animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="absolute -right-8 top-1/4 w-16 h-16 bg-background/40 backdrop-blur-md rounded-full border border-primary/30 flex items-center justify-center shadow-lg z-20"
      >
        <Music className="text-primary" size={24} />
      </motion.div>

      {/* Phone Frame */}
      <div className="absolute inset-0 bg-[#1A1A24] rounded-[3rem] p-3 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_0_0_1px_rgba(212,175,55,0.2)] border-2 border-[#2A2A35] z-10 overflow-hidden ring-4 ring-black/50">
        
        {/* Notch */}
        <div className="absolute top-0 inset-x-0 h-7 flex justify-center z-50">
          <div className="w-1/3 h-full bg-[#1A1A24] rounded-b-3xl"></div>
        </div>

        {/* Screen Content */}
        <div className="relative w-full h-full bg-background rounded-[2.25rem] overflow-hidden border border-white/5">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8 }}
              className={`absolute inset-0 bg-gradient-to-b ${CARDS[activeIndex].gradient} flex flex-col items-center justify-center p-6 text-center`}
            >
              {/* Card Inner Border */}
              <div className={`absolute inset-4 border ${CARDS[activeIndex].border} rounded-2xl opacity-60 pointer-events-none`}></div>
              <div className={`absolute inset-5 border border-dashed ${CARDS[activeIndex].border} rounded-xl opacity-30 pointer-events-none`}></div>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="z-10"
              >
                <p className="text-primary text-xs uppercase tracking-[0.3em] mb-8">{CARDS[activeIndex].title}</p>
                <h3 className="font-serif text-4xl sm:text-5xl text-foreground font-bold italic mb-6">
                  {CARDS[activeIndex].names.split(' & ')[0]}
                  <br />
                  <span className="text-2xl text-primary font-sans not-italic font-normal">&</span>
                  <br />
                  {CARDS[activeIndex].names.split(' & ')[1]}
                </h3>
                
                <div className="w-12 h-[1px] bg-primary/50 mx-auto mb-6"></div>
                
                <p className="text-foreground/90 font-serif text-xl mb-2">{CARDS[activeIndex].date}</p>
                <p className="text-foreground/60 text-xs uppercase tracking-widest">{CARDS[activeIndex].details}</p>
              </motion.div>
              
              {/* Swipe indicator */}
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ x: '-100%' }}
                  animate={{ x: '0%' }}
                  transition={{ duration: 4, ease: "linear", repeat: Infinity }}
                  className="w-full h-full bg-primary/80"
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

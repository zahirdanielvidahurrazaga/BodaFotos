'use client';

import { useState, useEffect } from 'react';
import WelcomeScreen from '@/components/WelcomeScreen';
import Gallery from '@/components/Gallery';
import UploadButton from '@/components/UploadButton';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [guestName, setGuestName] = useState<string | null>(null);

  useEffect(() => {
    const savedName = localStorage.getItem('guest_name');
    if (savedName) setGuestName(savedName);
  }, []);

  const handleJoin = (name: string) => {
    localStorage.setItem('guest_name', name);
    setGuestName(name);
  };

  return (
    <AnimatePresence mode="wait">
      {!guestName ? (
        <WelcomeScreen key="welcome" onJoin={handleJoin} />
      ) : (
        <motion.div
          key="gallery"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="min-h-screen pb-40 bg-background"
        >
          <header className="sticky top-0 z-30 w-full px-8 py-10 glass border-b border-accent/10">
            <div className="flex flex-col items-center max-w-7xl mx-auto">
              <motion.h2 
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-4xl font-cursive text-accent drop-shadow-sm"
              >
                Jesús & Paola
              </motion.h2>
              <p className="mt-2 text-xs tracking-[0.4em] uppercase text-accent/60 font-heading">
                Galería de Invitados
              </p>
            </div>
          </header>

          <div className="max-w-7xl mx-auto px-6 mt-16">
            <div className="mb-20 text-center">
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 0.5 }}
                className="text-xs tracking-[0.2em] uppercase text-accent/50 mb-3 font-heading"
              >
                Qué alegría tenerte aquí, {guestName}
              </motion.p>
              <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold font-heading text-accent tracking-tight leading-[1.1]">
                Nuestra Historia
              </h1>
              <div className="w-12 h-[1px] bg-accent/30 mx-auto mt-8" />
            </div>
            
            <Gallery />
          </div>

          <UploadButton guestName={guestName} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

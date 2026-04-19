'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera } from 'lucide-react';

interface WelcomeScreenProps {
  onJoin: (name: string) => void;
}

export default function WelcomeScreen({ onJoin }: WelcomeScreenProps) {
  const [name, setName] = useState('');
  const [showContent, setShowContent] = useState(false);

  const [bgIndex, setBgIndex] = useState(0);
  const backgrounds = ['/couple-1.png', '/couple-2.png'];

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 1500);
    const bgTimer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 8000);
    return () => {
      clearTimeout(timer);
      clearInterval(bgTimer);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onJoin(name);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[100dvh] p-6 overflow-hidden bg-[#002b44] text-white font-serif">
      {/* Floral Background Motifs */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2 }}
          className="absolute -top-10 -left-10 w-64 h-64 border-t border-l border-accent/30 rounded-full"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute -bottom-10 -right-10 w-64 h-64 border-b border-r border-accent/30 rounded-full"
        />
      </div>

      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.div 
            key={bgIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.3, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 4, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center brightness-75"
            style={{ backgroundImage: `url(${backgrounds[bgIndex]})` }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-at from-[#002b44] via-transparent to-[#002b44]/60" />
      </div>

      <AnimatePresence mode="wait">
        {!showContent ? (
          <motion.div
            key="preloader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="z-50 flex flex-col items-center"
          >
            <h1 className="text-3xl font-heading tracking-[0.4em] uppercase text-accent animate-pulse">
              J&P
            </h1>
            <div className="w-12 h-[1px] bg-accent/40 mt-4" />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="z-20 w-full max-w-md text-center"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 1.2 }}
            >
              <p className="text-xs tracking-[0.5em] uppercase text-accent/80 mb-6 font-heading">
                01 MAYO 2026
              </p>
              <h1 className="text-6xl sm:text-7xl font-cursive text-accent mb-2 drop-shadow-xl">
                Jesús & Paola
              </h1>
              <p className="mb-16 text-[10px] tracking-[0.3em] uppercase text-white/40 font-heading">
                Nuestra Historia Compartida
              </p>
            </motion.div>

            <motion.form 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              onSubmit={handleSubmit} 
              className="space-y-12"
            >
              <div className="relative group">
                <input
                  type="text"
                  required
                  placeholder="Tu Nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-0 py-4 bg-transparent border-b border-white/10 outline-none focus:border-accent text-center text-xl transition-all duration-700 placeholder:text-white/10 text-white font-serif italic"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="relative mx-auto w-32 h-32 rounded-full bg-accent flex items-center justify-center shadow-[0_0_50px_rgba(197,160,89,0.3)] transition-all group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" />
                <div className="z-10 text-black flex flex-col items-center">
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase font-heading">Entrar</span>
                  <div className="w-8 h-[1px] bg-black/20 my-1" />
                  <span className="text-lg font-cursive italic">JP</span>
                </div>
                {/* Wax seal texture simulation */}
                <div className="absolute inset-0 border-4 border-black/5 rounded-full pointer-events-none" />
              </motion.button>
              
              <p className="text-[9px] tracking-[0.4em] uppercase text-white/30 font-heading">
                Toca el sello para comenzar
              </p>
            </motion.form>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ delay: 2 }}
              className="mt-20 text-[8px] tracking-[0.4em] uppercase text-white font-heading"
            >
              #BodaPaolayJesus
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

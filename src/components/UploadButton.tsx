'use client';

import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Image as ImageIcon, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';

interface UploadButtonProps {
  guestName: string;
}

export default function UploadButton({ guestName }: UploadButtonProps) {
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const processUpload = async (file: File) => {
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `photos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('wedding-photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('wedding-photos')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('photos')
        .insert({
          url: publicUrl,
          guest_name: guestName,
          event_id: 'default-event'
        });

      if (dbError) throw dbError;

      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (error: any) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
      if (cameraInputRef.current) cameraInputRef.current.value = '';
      if (galleryInputRef.current) galleryInputRef.current.value = '';
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await processUpload(file);
  };

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-6">
      <AnimatePresence>
        {uploading && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-32 px-8 py-4 bg-primary/80 backdrop-blur-xl rounded-full border border-accent/20 shadow-2xl flex items-center gap-4 z-50"
          >
            <Loader2 className="w-5 h-5 text-accent animate-spin" />
            <span className="text-xs tracking-[0.2em] uppercase text-accent font-heading">Guardando recuerdo...</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {success && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-32 px-8 py-4 bg-accent rounded-full shadow-2xl flex items-center gap-4 z-50"
          >
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary font-heading">¡Momento Guardado!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-8 bg-background/80 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-2xl px-6 py-4 rounded-full border border-accent/10 ring-1 ring-accent/5">
        <div className="relative">
          <input
            type="file"
            ref={galleryInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => galleryInputRef.current?.click()}
            disabled={uploading}
            className={`flex flex-col items-center justify-center gap-2 group transition-all ${
              uploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <div className="w-14 h-14 rounded-full bg-primary/40 border border-accent/20 flex items-center justify-center group-hover:bg-primary/60 transition-colors">
              <ImageIcon className="w-5 h-5 text-accent/80" />
            </div>
            <span className="text-[10px] tracking-[0.2em] uppercase font-heading text-accent/70">Galería</span>
          </motion.button>
        </div>

        <div className="w-[1px] h-12 bg-accent/20" />

        <div className="relative">
          <input
            type="file"
            ref={cameraInputRef}
            onChange={handleFileChange}
            accept="image/*"
            capture="environment"
            className="hidden"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => cameraInputRef.current?.click()}
            disabled={uploading}
            className={`flex flex-col items-center justify-center gap-2 group transition-all ${
              uploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <div className="w-16 h-16 rounded-full bg-accent shadow-[0_0_20px_rgba(197,160,89,0.3)] flex items-center justify-center group-hover:shadow-[0_0_30px_rgba(197,160,89,0.5)] transition-all relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent" />
              <Camera className="w-7 h-7 text-primary relative z-10" />
            </div>
            <span className="text-xs font-bold tracking-[0.2em] uppercase font-heading text-accent">Cámara</span>
          </motion.button>
        </div>
      </div>
    </div>
  );

}

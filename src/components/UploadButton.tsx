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
            className={`flex items-center justify-center w-14 h-14 rounded-full transition-all ${
              uploading ? 'opacity-50 cursor-not-allowed' : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            <ImageIcon className="w-5 h-5 text-white/80" />
          </motion.button>
        </div>

        {/* Elegant Divider */}
        <div className="w-[1px] h-8 bg-white/10 mx-2" />

        {/* Camera Button */}
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
            className={`relative flex items-center justify-center w-20 h-20 rounded-full shadow-[0_0_30px_rgba(196,160,82,0.3)] transition-all ${
              uploading 
                ? 'bg-neutral-800' 
                : 'bg-accent hover:shadow-[0_0_40px_rgba(196,160,82,0.5)]'
            }`}
          >
            {uploading ? (
              <Loader2 className="w-8 h-8 text-black animate-spin" />
            ) : (
              <div className="relative">
                <Camera className="w-8 h-8 text-black" />
                <motion.div
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1"
                >
                  <Sparkles className="w-4 h-4 text-black" />
                </motion.div>
              </div>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

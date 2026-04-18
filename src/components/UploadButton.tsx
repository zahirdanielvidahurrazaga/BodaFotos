'use client';

import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Loader2, Check, Sparkles } from 'lucide-react';

interface UploadButtonProps {
  guestName: string;
}

export default function UploadButton({ guestName }: UploadButtonProps) {
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `photos/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
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
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
      <AnimatePresence>
        {uploading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 glass px-8 py-4 rounded-full flex items-center gap-4 whitespace-nowrap shadow-2xl"
          >
            <div className="relative">
              <Loader2 className="w-5 h-5 text-accent animate-spin" />
              <div className="absolute inset-0 bg-accent/20 blur-md animate-pulse" />
            </div>
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary">Preserving Memory...</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1, rotate: 2 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-700 shadow-2xl overflow-hidden ${
          success ? 'bg-green-500' : 'bg-primary'
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-transparent pointer-events-none" />
        
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              className="flex flex-col items-center"
            >
              <Sparkles className="w-8 h-8 text-white mb-1" />
            </motion.div>
          ) : (
            <motion.div
              key="default"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="relative"
            >
              <Camera className={`w-8 h-8 text-white transition-opacity duration-300 ${uploading ? 'opacity-0' : 'opacity-100'}`} />
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleUpload}
        className="hidden"
        ref={fileInputRef}
      />
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { Photo, supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { MasonryPhotoAlbum } from 'react-photo-album';
import "react-photo-album/masonry.css";

export default function Gallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [guestName, setGuestName] = useState('');

  useEffect(() => {
    setGuestName(localStorage.getItem('wedding_guest_name') || 'Guest');
    fetchPhotos();

    const channel = supabase
      .channel('public:photos')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'photos' },
        (payload) => {
          setPhotos((prev) => [payload.new as Photo, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'photos' },
        (payload) => {
          setPhotos((prev) => prev.filter(photo => photo.id !== payload.old.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPhotos(data || []);
    } catch (error) {
      console.error('Fetch error:', error);
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  };

  const renderImage = (props: any) => {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="group relative overflow-hidden rounded-sm bg-neutral-100 border border-black/5"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="w-full h-full aspect-[3/4]"
        >
          <img 
            {...props} 
            className={`${props.className} w-full h-full object-cover transition-opacity duration-1000`}
            loading="lazy"
          />
        </motion.div>
        
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex flex-col justify-end p-4 pointer-events-none">
          <p className="text-xs tracking-[0.2em] uppercase text-white/60 mb-1">Captured By</p>
          <p className="text-white font-heading text-lg">
            {props.alt?.replace('Shared by ', '') || 'Guest'}
          </p>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-12 h-[1px] bg-accent/20">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, repeat: Infinity }}
            className="h-full bg-accent"
          />
        </div>
      </div>
    );
  }

  const formattedPhotos = photos.map(p => ({
    src: p.url,
    width: 800,
    height: 1000,
    key: p.id,
    alt: `Shared by ${p.guest_name}`,
  }));

  return (
    <div className="w-full pb-20">
      <MasonryPhotoAlbum 
        photos={formattedPhotos}
        render={{ image: renderImage }}
        columns={(containerWidth) => {
          if (containerWidth < 640) return 2;
          if (containerWidth < 1024) return 3;
          return 4;
        }}
        spacing={24}
      />
    </div>
  );
}

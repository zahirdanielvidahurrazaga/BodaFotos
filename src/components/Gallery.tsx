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
    setGuestName(localStorage.getItem('wedding_guest_name') || 'Invitado');
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 animate-pulse">
        <div className="w-12 h-[1px] bg-accent/30 mb-8" />
        <p className="text-xs tracking-[0.4em] uppercase text-accent/50 font-heading">
          Cargando recuerdos...
        </p>
      </div>
    );
  }

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

'use client';

import { useEffect, useState } from 'react';
import { Photo, supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { MasonryPhotoAlbum } from 'react-photo-album';
import "react-photo-album/masonry.css";

export default function Gallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
      
      const demoPhotos = [
        { id: 'd1', url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800', guest_name: 'Zahir', created_at: new Date().toISOString(), event_id: 'demo' },
        { id: 'd2', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800', guest_name: 'Sofia', created_at: new Date().toISOString(), event_id: 'demo' },
        { id: 'd3', url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800', guest_name: 'Marcos', created_at: new Date().toISOString(), event_id: 'demo' }
      ];

      // Combine real data with demo data for testing
      setPhotos([...(data || []), ...demoPhotos]);
    } catch (error) {
      console.warn('Using only demo data.');
      setPhotos([
        { id: '1', url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800', guest_name: 'Zahir', created_at: new Date().toISOString(), event_id: 'demo' },
        { id: '2', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800', guest_name: 'Sofia', created_at: new Date().toISOString(), event_id: 'demo' },
        { id: '3', url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800', guest_name: 'Marcos', created_at: new Date().toISOString(), event_id: 'demo' },
        { id: '4', url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=800', guest_name: 'Elena', created_at: new Date().toISOString(), event_id: 'demo' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderImage = (props: any) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-sm bg-muted/50 border border-black/5"
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="w-full h-full"
      >
        <img 
          {...props} 
          className={`${props.className} w-full h-full object-cover`} 
        />
      </motion.div>
      
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex flex-col justify-end p-4 pointer-events-none">
        <p className="text-[10px] tracking-[0.2em] uppercase text-white/60 mb-1">Captured By</p>
        <p className="text-white font-heading text-lg">
          {props.alt?.replace('Shared by ', '') || 'Guest'}
        </p>
      </div>
    </motion.div>
  );

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
    <div className="w-full">
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

'use client';

import { useEffect, useState } from 'react';
import { Photo, supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Trash2, Download, ShieldCheck, Camera, BarChart3, Settings, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchPhotos();
    }
  }, [isAuthenticated]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === '1234') { // Admin can change this later
      setIsAuthenticated(true);
    } else {
      alert('Password Incorrect');
    }
  };

  const fetchPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPhotos(data || []);
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this memory? This action cannot be undone.')) return;

    try {
      const { error } = await supabase
        .from('photos')
        .delete()
        .match({ id });

      if (error) throw error;
      setPhotos(photos.filter(p => p.id !== id));
    } catch (error: any) {
      console.error('Error deleting photo:', error);
      alert(`Deletion failed: ${error.message || 'Permission denied'}`);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm glass p-10 rounded-sm text-center border border-black/5"
        >
          <ShieldCheck className="w-12 h-12 text-accent mx-auto mb-6" />
          <h1 className="text-2xl font-bold font-heading mb-2">Private Access</h1>
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-8">Concierge Identification Needed</p>
          
          <form onSubmit={handleAuth} className="space-y-6">
            <input
              type="password"
              placeholder="Enter Passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full bg-transparent border-b border-black/10 text-center py-3 outline-none focus:border-accent transition-all font-serif italic"
            />
            <button
              type="submit"
              className="w-full py-4 bg-primary text-white text-xs font-bold tracking-[0.2em] uppercase rounded-sm"
            >
              Verify Identity
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfdfd]">
      <header className="sticky top-0 z-30 w-full glass border-b border-black/5 px-8 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border border-accent/20 flex items-center justify-center bg-white shadow-sm">
              <ShieldCheck className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-heading tracking-tight">Concierge Dashboard</h1>
              <p className="text-xs tracking-[0.3em] uppercase text-accent font-medium mt-1">Everlasting Control Panel</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <Link 
              href="/"
              className="flex-1 md:flex-none px-6 py-3 text-xs font-bold tracking-[0.2em] uppercase text-primary border border-primary/10 rounded-sm hover:bg-black/5 transition-all flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-3 h-3" />
              Feed
            </Link>
            <button 
              onClick={() => alert('ZIP generation started.')}
              className="flex-1 md:flex-none px-6 py-3 bg-primary text-white text-xs font-bold tracking-[0.2em] uppercase rounded-sm hover:opacity-90 transition-all shadow-xl shadow-primary/10 flex items-center justify-center gap-2"
            >
              <Download className="w-3 h-3" />
              Preserve
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-16">
          {[
            { label: 'Total Memories', value: photos.length, icon: Camera },
            { label: 'Guests', value: new Set(photos.map(p => p.guest_name)).size, icon: BarChart3 },
            { label: 'Storage', value: '4.2 GB', icon: Settings },
            { label: 'Status', value: 'Live', icon: ShieldCheck },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="p-8 bg-white border border-black/5 shadow-sm rounded-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className="w-5 h-5 text-accent/40" />
                <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground">Real-time</span>
              </div>
              <p className="text-3xl md:text-4xl font-bold font-heading tracking-tight">{stat.value}</p>
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {photos.map((photo, i) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group relative aspect-[4/5] bg-muted rounded-sm overflow-hidden border border-black/5"
            >
              <img 
                src={photo.url} 
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                alt={photo.guest_name}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex flex-col justify-end p-5 backdrop-blur-[2px]">
                <p className="text-xs tracking-[0.2em] uppercase text-white/60 mb-1">Shared By</p>
                <p className="text-white font-heading text-lg mb-4">{photo.guest_name}</p>
                <button 
                  onClick={() => handleDelete(photo.id)}
                  className="w-full py-3 bg-red-500/90 text-white text-[9px] font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-3 h-3" />
                  Remove
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {!loading && photos.length === 0 && (
          <div className="text-center py-40 border-2 border-dashed border-black/5 rounded-sm">
            <p className="text-muted-foreground font-heading italic">Waiting for the first magical moment...</p>
          </div>
        )}
      </main>
    </div>
  );
}

import React, { useState } from 'react';
import { Play, Square, MonitorPlay } from 'lucide-react'; // Ganti Youtube dengan MonitorPlay
import { motion, AnimatePresence } from 'framer-motion';

export default function YouTubeAudioPlayer({ videoId, title, isNight }) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!videoId) return null;

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Tombol Play/Pause (Tampilan Awal) */}
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className={`flex items-center gap-3 rounded-xl border p-3 transition w-full ${
          isNight 
            ? 'border-red-500/30 hover:bg-red-500/10' 
            : 'border-red-200 hover:bg-red-50'
        }`}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/15 text-red-500">
          {isPlaying ? <Square size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
        </div>
        <div className="min-w-0 flex-1 text-left">
          <p className="text-xs font-extrabold">{isPlaying ? 'Tutup Video' : 'Lagu Daerah'}</p>
          <p className={`mt-1 truncate text-[10px] ${isNight ? 'text-slate-400' : 'text-slate-500'}`}>
            {isPlaying ? 'Video sedang diputar...' : `Putar ${title}`}
          </p>
        </div>
        {/* Ganti <Youtube /> menjadi <MonitorPlay /> */}
        <MonitorPlay size={20} className="text-red-500" />
      </button>

      {/* Video Player (Muncul saat diputar) */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.9 }}
            animate={{ opacity: 1, height: 'auto', scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.9 }}
            className="w-full rounded-xl overflow-hidden shadow-lg border border-white/10"
          >
            <div className="relative pt-[56.25%] bg-black">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
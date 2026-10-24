import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Music } from 'lucide-react';

export default function AudioPlayer({ audioUrl, title, isNight }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [audioUrl]);

  const togglePlay = (e) => {
    e.preventDefault(); // Mencegah klik tembus ke elemen lain
    if (!audioUrl || !audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log("Browser blokir audio:", e));
    }
    setIsPlaying(!isPlaying);
  };

  if (!audioUrl) return null;

  return (
    <div className="relative">
      <audio ref={audioRef} src={audioUrl} loop onEnded={() => setIsPlaying(false)} />
      
      {/* Efek Ping saat memutar */}
      {isPlaying && (
        <span className={`absolute inset-0 rounded-full opacity-30 animate-ping ${isNight ? 'bg-emerald-500' : 'bg-emerald-400'}`} />
      )}

      <button
        onClick={togglePlay}
        title={`Putar ${title}`}
        className={`relative z-10 flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border-2 transition-all hover:scale-105 shadow-lg ${
          isNight 
            ? 'border-emerald-500/50 bg-slate-800 text-emerald-400 hover:bg-slate-700' 
            : 'border-emerald-400 bg-white text-emerald-600 hover:bg-emerald-50'
        }`}
      >
        {isPlaying ? <Pause size={22} fill="currentColor" /> : <Music size={22} />}
      </button>
    </div>
  );
}
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPinned, Leaf, Bot, Gamepad2, Landmark } from 'lucide-react';

const GAMES = [
  { 
    id: 'peta-buta', 
    title: 'Peta Buta', 
    desc: 'Temukan provinsi sebelum waktu habis!', 
    emoji: '🗺️', 
    gradient: 'from-emerald-500 to-teal-700', 
    path: '/game/peta-buta', 
    icon: MapPinned,
    glow: 'bg-emerald-500',
    tag: 'Kuis Peta'
  },
  { 
    id: 'detektif', 
    title: 'Detektif Alam', 
    desc: 'Drag flora & fauna ke provinsi asal.', 
    emoji: '🕵️', 
    gradient: 'from-purple-500 to-pink-700', 
    path: '/game/detektif', 
    icon: Leaf,
    glow: 'bg-purple-500',
    tag: 'Tebak Gambar'
  },
  { 
    id: 'petualangan', 
    title: 'Petualangan Si Bot', 
    desc: 'Lari, lompat, kumpulkan koin!', 
    emoji: '🤖', 
    gradient: 'from-sky-500 to-blue-700', 
    path: '/game/petualangan', 
    icon: Bot,
    glow: 'bg-sky-500',
    tag: 'Refleks'
  },
  // GAME BARU: TEBAK BUDAYA
  { 
    id: 'budaya', 
    title: 'Tebak Budaya', 
    desc: 'Seberapa kenal kamu dengan budaya Indonesia?', 
    emoji: '🏛️', 
    gradient: 'from-amber-500 to-orange-600', 
    path: '/game/budaya', 
    icon: Landmark,
    glow: 'bg-amber-500',
    tag: 'Pengetahuan'
  },
];

export default function GameHub() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a] relative overflow-hidden flex flex-col font-sans">
      
      {/* Latar Belakang Animasi */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-emerald-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-sky-500/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto w-full p-5 sm:p-8 flex-1 flex flex-col">
        
        <motion.button 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/')} 
          className="self-start flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 group"
        >
          <div className="bg-white/5 group-hover:bg-white/10 p-2 rounded-full transition-colors">
            <ArrowLeft size={18} />
          </div>
          <span className="text-sm font-bold tracking-wide">Kembali ke Beranda</span>
        </motion.button>

        <motion.div 
          initial={{ y: -20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 0.1 }}
          className="text-center mb-10 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full mb-5 shadow-lg">
            <Gamepad2 size={16} className="text-emerald-400" />
            <span className="text-[10px] sm:text-xs font-black text-white uppercase tracking-[0.2em]">Arcade Nusantara</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 mb-4 tracking-tight drop-shadow-sm">
            Pilih Petualanganmu
          </h1>
          <p className="text-slate-400 text-sm sm:text-lg max-w-md mx-auto font-medium">
            Kumpulan mini-game seru untuk menguji pengetahuan geografimu dengan cara yang menyenangkan.
          </p>
        </motion.div>

        {/* Grid Game (Akan menjadi 2 kolom di tablet, 2 kolom di desktop agar proporsional karena ada 4 game) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 flex-1 items-start">
          {GAMES.map((game, i) => {
            const Icon = game.icon;
            return (
              <motion.button
                key={game.id}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.15, type: 'spring', stiffness: 100 }}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(game.path)}
                className="relative group text-left w-full h-full"
              >
                <div className={`absolute inset-0 rounded-3xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 ${game.glow}`}></div>
                
                <div className="relative h-full flex flex-col bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl overflow-hidden">
                  <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${game.gradient} opacity-80`}></div>
                  
                  <div className="absolute -right-6 -bottom-6 text-[120px] opacity-10 group-hover:opacity-20 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500 pointer-events-none select-none">
                    {game.emoji}
                  </div>

                  <span className="self-start text-[9px] font-black uppercase tracking-widest text-white/50 mb-4 bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
                    {game.tag}
                  </span>

                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-5 shadow-lg bg-gradient-to-br ${game.gradient} text-white`}>
                    <Icon size={26} />
                  </div>

                  <div className="relative z-10 mb-6 flex-1">
                    <h3 className="text-xl sm:text-2xl font-black text-white mb-2 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-all">
                      {game.title}
                    </h3>
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-medium">
                      {game.desc}
                    </p>
                  </div>

                  <div className="relative z-10 mt-auto pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white group-hover:translate-x-1 transition-transform">Mainkan Sekarang</span>
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-br ${game.gradient} text-white shadow-md group-hover:scale-110 transition-transform`}>
                        <ArrowLeft size={16} className="rotate-180" />
                      </div>
                    </div>
                  </div>

                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
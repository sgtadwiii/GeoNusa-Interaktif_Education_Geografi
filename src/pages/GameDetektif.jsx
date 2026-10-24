import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { ArrowLeft, Trophy, Leaf, Bird, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import materiData from '../data/materi.json';

const ROUNDS = 5;

export default function GameDetektif() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('idle');
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);

  // Ambil 5 provinsi acak dari SD
  const gameData = useMemo(() => {
    if (status === 'idle') return [];
    return [...materiData.SD].sort(() => Math.random() - 0.5).slice(0, ROUNDS);
  }, [status]);

  const currentItem = gameData[round];
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleDrop = (targetProvince) => {
    const correct = targetProvince === currentItem.nama.replace(/\s*\(.*?\)\s*/g, '').toLowerCase();
    
    if (correct) {
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
      setScore((s) => s + 200);
    }

    setTimeout(() => {
      if (round + 1 >= ROUNDS) {
        setStatus('gameover');
        if (correct) confetti({ particleCount: 300, spread: 100, origin: { y: 0.5 } });
      } else {
        setRound((r) => r + 1);
      }
    }, 1200);
  };

  return (
    <div className="h-[100dvh] w-full bg-gradient-to-br from-purple-950 via-slate-950 to-pink-950 relative overflow-hidden flex flex-col">
      {/* HEADER */}
      <div className="flex items-center justify-between p-4 bg-slate-950/50 backdrop-blur-xl border-b border-white/10">
        <button onClick={() => navigate('/game')} className="flex items-center gap-2 text-white/80 hover:text-white">
          <ArrowLeft size={20} /> <span className="text-sm font-bold">Kembali</span>
        </button>
        <div className="flex items-center gap-2 bg-amber-500/20 px-3 py-1.5 rounded-full border border-amber-500/40">
          <Trophy size={18} className="text-amber-400" />
          <span className="font-bold text-white">{score}</span>
        </div>
      </div>

      {/* GAME AREA */}
      <div className="flex-1 flex flex-col items-center justify-between p-4 relative">
        {/* START */}
        <AnimatePresence>
          {status === 'idle' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-40 flex items-center justify-center bg-slate-950/80 backdrop-blur-md px-8">
              <div className="text-center max-w-md">
                <div className="text-7xl mb-6">🕵️</div>
                <h1 className="text-4xl font-black text-white mb-3">Detektif Alam</h1>
                <p className="text-slate-300 mb-8">
                  Drag kartu flora/fauna ke provinsi asalnya! <br/>
                  <span className="text-purple-400 font-bold">{ROUNDS} ronde · Skor per ronde: 200</span>
                </p>
                <button onClick={() => setStatus('playing')} className="bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold px-10 py-4 rounded-2xl shadow-2xl shadow-purple-500/30 hover:scale-105 transition">
                  🔍 Mulai Investigasi
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* GAME */}
        {status === 'playing' && currentItem && (
          <>
            <motion.div
              key={round}
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mt-8 text-center"
            >
              <p className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-2">Ronde {round + 1}/{ROUNDS}</p>
              <h2 className="text-2xl font-black text-white mb-1">Dari mana asal ini?</h2>
            </motion.div>

            {/* DRAGGABLE CARD */}
            <motion.div
              key={`card-${round}`}
              drag
              dragConstraints={{ left: -200, right: 200, top: -200, bottom: 200 }}
              dragElastic={0.2}
              whileDrag={{ scale: 1.1, rotate: 5, cursor: 'grabbing' }}
              style={{ x, y }}
              onDragEnd={(e, info) => {
                // Cek jarak drop ke tombol provinsi
                const dropTarget = document.elementFromPoint(
                  e.clientX,
                  e.clientY
                );
                const provinceBtn = dropTarget?.closest('[data-province]');
                if (provinceBtn) {
                  handleDrop(provinceBtn.dataset.province);
                }
                x.set(0);
                y.set(0);
              }}
              className="cursor-grab active:cursor-grabbing z-30"
            >
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl shadow-2xl p-8 w-64 text-white text-center border-4 border-white/20">
                <div className="text-6xl mb-4">
                  {currentItem.flora.toLowerCase().includes('bunga') ? '🌸' : '🦜'}
                </div>
                <p className="text-xs uppercase tracking-widest opacity-70 mb-1">Flora & Fauna</p>
                <p className="font-black text-lg leading-tight">{currentItem.flora}</p>
                <p className="text-sm opacity-80 mt-1">& {currentItem.fauna}</p>
              </div>
            </motion.div>

            {/* DROP ZONES (5 pilihan provinsi) */}
            <div className="w-full max-w-2xl mt-8 mb-4">
              <p className="text-center text-slate-400 text-xs mb-3">⬇️ Drag ke provinsi yang benar ⬇️</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {gameData
                  .filter((_, i) => i !== round)
                  .slice(0, 5)
                  .concat([currentItem])
                  .sort(() => Math.random() - 0.5)
                  .map((prov) => (
                    <button
                      key={prov.id}
                      data-province={prov.nama.replace(/\s*\(.*?\)\s*/g, '').toLowerCase()}
                      className="bg-slate-800/80 hover:bg-purple-600/40 border border-slate-700 hover:border-purple-500 rounded-xl p-3 text-white text-sm font-bold transition shadow-lg"
                    >
                      {prov.nama.replace(/\s*\(.*?\)\s*/g, '')}
                    </button>
                  ))}
              </div>
            </div>
          </>
        )}

        {/* GAME OVER */}
        <AnimatePresence>
          {status === 'gameover' && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 z-40 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
              <div className="bg-slate-900 border-2 border-purple-500/40 rounded-3xl p-8 max-w-md w-full text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h2 className="text-3xl font-black text-white mb-2">Investigasi Selesai!</h2>
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-4 my-6">
                  <p className="text-xs text-slate-400 uppercase font-bold">Skor</p>
                  <p className="text-5xl font-black text-purple-400">{score}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => { setStatus('idle'); setScore(0); setRound(0); }} className="flex-1 bg-purple-500 text-white font-bold py-3 rounded-xl hover:bg-purple-600">
                    Main Lagi
                  </button>
                  <button onClick={() => navigate('/game')} className="flex-1 bg-slate-700 text-white font-bold py-3 rounded-xl">
                    Menu
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
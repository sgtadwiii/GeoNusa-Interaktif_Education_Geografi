import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, Heart, Pause, Play } from 'lucide-react';
import confetti from 'canvas-confetti';

const GROUND_HEIGHT = 120;

export default function GamePetualangan() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('idle'); // idle | playing | paused | gameover
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [botY, setBotY] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [obstacles, setObstacles] = useState([]);
  const [coins, setCoins] = useState([]);
  const [speed, setSpeed] = useState(5);
  
  const gameLoop = useRef(null);
  const jumpTimer = useRef(null);

  // Game Loop (via requestAnimationFrame / interval)
  useEffect(() => {
    if (status !== 'playing') return;
    
    const loop = setInterval(() => {
      // Update speed
      setSpeed((s) => Math.min(s + 0.02, 15));
      setScore((sc) => sc + 1);

      // Update obstacles
      setObstacles((obs) => {
        const moved = obs.map((o) => ({ ...o, x: o.x - speed }));
        // Spawn obstacle baru
        if (Math.random() < 0.02 && moved.length < 3) {
          const lastX = moved[moved.length - 1]?.x || 800;
          if (lastX > 400) {
            moved.push({ id: Date.now(), x: 800, type: 'cactus' });
          }
        }
        return moved.filter((o) => o.x > -60);
      });

      // Update coins
      setCoins((cs) => {
        const moved = cs.map((c) => ({ ...c, x: c.x - speed, rotation: (c.rotation || 0) + 5 }));
        if (Math.random() < 0.015 && moved.length < 4) {
          const lastX = moved[moved.length - 1]?.x || 800;
          if (lastX > 300) {
            moved.push({ id: Date.now(), x: 800, y: Math.random() * 100 + 80, rotation: 0 });
          }
        }
        return moved.filter((c) => c.x > -60);
      });
    }, 16);

    return () => clearInterval(loop);
  }, [status, speed]);

  // Collision detection
  useEffect(() => {
    if (status !== 'playing') return;
    
    // Bot posisi sekitar 100px dari kiri
    const botX = 100;
    const botRealY = GROUND_HEIGHT - 50 - botY;

    // Cek tabrakan dengan obstacles
    obstacles.forEach((obs) => {
      if (obs.x > botX - 30 && obs.x < botX + 50 && botY < 40) {
        handleHit(obs.id, 'obstacle');
      }
    });

    // Cek coin
    coins.forEach((coin) => {
      if (coin.x > botX - 30 && coin.x < botX + 40 && Math.abs(coin.y - (GROUND_HEIGHT - botY - 25)) < 40) {
        setCoins((cs) => cs.filter((c) => c.id !== coin.id));
        setScore((s) => s + 50);
      }
    });
  }, [obstacles, coins, botY, status]);

  const handleHit = (id, type) => {
    if (type === 'obstacle') {
      setObstacles((o) => o.filter((x) => x.id !== id));
      setLives((l) => {
        const newLives = l - 1;
        if (newLives <= 0) setStatus('gameover');
        return newLives;
      });
    }
  };

  const jump = useCallback(() => {
    if (status !== 'playing' || isJumping) return;
    setIsJumping(true);
    setBotY(120); // Naik
    
    setTimeout(() => {
      setBotY(0); // Turun
      setIsJumping(false);
    }, 500);
  }, [status, isJumping]);

  // Keyboard control
  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [jump]);

  const resetGame = () => {
    setStatus('playing');
    setScore(0);
    setLives(3);
    setBotY(0);
    setObstacles([]);
    setCoins([]);
    setSpeed(5);
  };

  return (
    <div className="h-[100dvh] w-full bg-gradient-to-b from-sky-400 via-amber-100 to-emerald-300 relative overflow-hidden flex flex-col select-none">
      {/* HEADER */}
      <div className="relative z-20 flex items-center justify-between p-4 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
        <button onClick={() => navigate('/game')} className="flex items-center gap-2 text-white/80 hover:text-white">
          <ArrowLeft size={20} /> <span className="text-sm font-bold">Kembali</span>
        </button>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-red-500/20 px-3 py-1.5 rounded-full border border-red-500/40">
            {[...Array(3)].map((_, i) => (
              <Heart key={i} size={16} className={i < lives ? 'text-red-500 fill-red-500' : 'text-slate-500'} />
            ))}
          </div>
          <div className="flex items-center gap-2 bg-amber-500/20 px-3 py-1.5 rounded-full border border-amber-500/40">
            <Trophy size={16} className="text-amber-400" />
            <span className="font-bold text-white">{Math.floor(score)}</span>
          </div>
        </div>
      </div>

      {/* GAME CANVAS */}
      <div className="flex-1 relative overflow-hidden">
        {/* CLOUDS BACKGROUND */}
        <motion.div animate={{ x: ['100%', '-100%'] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} className="absolute top-10 text-6xl opacity-60">☁️</motion.div>
        <motion.div animate={{ x: ['100%', '-100%'] }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }} className="absolute top-32 text-5xl opacity-40">☁️</motion.div>
        
        {/* OBSTACLES */}
        {obstacles.map((obs) => (
          <div key={obs.id} className="absolute text-5xl" style={{ left: obs.x, bottom: GROUND_HEIGHT }}>🌵</div>
        ))}

        {/* COINS */}
        {coins.map((coin) => (
          <motion.div key={coin.id} className="absolute text-3xl" style={{ left: coin.x, bottom: coin.y + GROUND_HEIGHT, rotate: coin.rotation }}>🪙</motion.div>
        ))}

        {/* BOT */}
        {status === 'playing' && (
          <motion.div
            animate={{ y: -botY }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="absolute z-10 text-6xl"
            style={{ left: 100, bottom: GROUND_HEIGHT }}
          >
            🤖
          </motion.div>
        )}

        {/* GROUND */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-700 to-green-500 border-t-4 border-green-800" style={{ height: GROUND_HEIGHT }}>
          <div className="absolute top-0 left-0 right-0 h-4 bg-green-400" />
          {/* Ground texture */}
          <div className="flex h-full overflow-hidden opacity-30">
            {[...Array(20)].map((_, i) => <div key={i} className="flex-1 border-r-2 border-green-800" />)}
          </div>
        </div>

        {/* START SCREEN */}
        <AnimatePresence>
          {status === 'idle' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-40 flex items-center justify-center bg-slate-950/80 backdrop-blur-md px-8">
              <div className="text-center max-w-md">
                <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-8xl mb-6">🤖</motion.div>
                <h1 className="text-4xl font-black text-white mb-3">Petualangan Si Bot</h1>
                <p className="text-slate-300 mb-6">
                  Lompati kaktus dan kumpulkan koin emas!<br/>
                  <span className="text-emerald-400 font-bold">Klik atau tekan SPACE untuk melompat</span>
                </p>
                <button onClick={resetGame} className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold px-10 py-4 rounded-2xl shadow-2xl shadow-emerald-500/30 hover:scale-105 transition">
                  🚀 Mulai Berlari
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* GAME OVER */}
        <AnimatePresence>
          {status === 'gameover' && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 z-40 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
              <div className="bg-slate-900 border-2 border-emerald-500/40 rounded-3xl p-8 max-w-md w-full text-center">
                <div className="text-6xl mb-4">💥</div>
                <h2 className="text-3xl font-black text-white mb-2">Si Bot Tumbang!</h2>
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 my-6">
                  <p className="text-xs text-slate-400 uppercase font-bold">Jarak Tempuh</p>
                  <p className="text-5xl font-black text-emerald-400">{Math.floor(score)}m</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={resetGame} className="flex-1 bg-emerald-500 text-white font-bold py-3 rounded-xl hover:bg-emerald-600">
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

        {/* JUMP HINT */}
        {status === 'playing' && (
          <div className="absolute bottom-32 left-1/2 -translate-x-1/2 text-white/70 text-sm font-bold animate-pulse pointer-events-none">
            TAP / SPACE untuk melompat
          </div>
        )}
      </div>

      {/* JUMP AREA (Tap area bawah) */}
      {status === 'playing' && (
        <button onClick={jump} className="absolute inset-x-0 bottom-0 h-64 z-20 bg-transparent" aria-label="Jump" />
      )}
    </div>
  );
}
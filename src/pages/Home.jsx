import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  Map,
  House,
  Gamepad2,
  UserRound,
  Sun,
  Moon,
  ArrowRight,
  Compass,
  Globe2,
  Joystick, // Icon tambahan untuk Game
} from 'lucide-react';
import { Button } from '../components/ui/button';
import HomeAnimations from '../components/ui/HomeAnimations';

// --- KOMPONEN IKON GITHUB LOKAL ---
function GithubIcon({ size = 14, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.9 1.2 1.9 1.2 3.2 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z" />
    </svg>
  );
}

export default function Home() {
  const [isNight, setIsNight] = useState(() => {
    try { return localStorage.getItem('geonusa-theme') === 'night'; } catch { return false; }
  });

  // EFEK PARALLAX 3D
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => { x.set(0); y.set(0); };

  const animals = isNight
    ? { main: `${import.meta.env.BASE_URL}images/owl.png`, bird: null }
    : { main: `${import.meta.env.BASE_URL}images/monyet.png`, bird: `${import.meta.env.BASE_URL}images/burung.png` };

  return (
    <main className={`relative isolate min-h-screen overflow-hidden font-sans transition-colors duration-700 ${isNight ? 'bg-slate-950' : 'bg-sky-400'}`}>
      
      {/* BACKGROUND */}
      <AnimatePresence initial={false}>
        <motion.div
          key={isNight ? 'night' : 'day'}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/${isNight ? 'geonusamalam.png' : 'geonusasiang.png'})` }}
        />
      </AnimatePresence>

      <div className={`pointer-events-none absolute inset-0 -z-10 transition-colors duration-700 ${isNight ? 'bg-gradient-to-b from-slate-950/20 via-blue-950/10 to-slate-950/30' : 'bg-gradient-to-b from-sky-400/5 via-transparent to-green-950/10'}`} />

      <HomeAnimations isNight={isNight} />

      {/* NAVBAR */}
      <header className="absolute left-1/2 top-4 z-40 w-[calc(100%-24px)] max-w-[1320px] -translate-x-1/2 sm:top-6 sm:w-[calc(100%-48px)]">
        <nav className={`flex min-h-[58px] items-center justify-between gap-2 rounded-full border px-3 py-2 shadow-lg backdrop-blur-xl transition-all duration-500 sm:px-5 md:min-h-[64px] md:px-7 ${isNight ? 'border-white/15 bg-slate-950/55 text-white shadow-black/20' : 'border-white/65 bg-white/75 text-slate-800 shadow-slate-900/10'}`}>
          
          {/* LOGO */}
          <Link to="/" className="flex shrink-0 items-center gap-2 text-lg font-extrabold tracking-tight sm:text-xl">
            <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.5 }}>
              <Map className="h-7 w-7 text-rose-600 sm:h-8 sm:w-8" />
            </motion.div>
            <span>GeoNusa</span>
          </Link>

          {/* MENU DESKTOP (Termasuk Game) */}
          <div className="hidden items-center gap-1 md:flex">
            <Link to="/" className="flex items-center gap-2 rounded-full bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-rose-600/20 transition hover:bg-rose-700">
              <House size={18} /> Beranda
            </Link>
            <Link to="/dashboard" className="flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium opacity-80 transition hover:bg-white/20 hover:opacity-100">
              <Map size={19} /> Peta Interaktif
            </Link>
            <Link to="/kuis" className="flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium opacity-80 transition hover:bg-white/20 hover:opacity-100">
              <Gamepad2 size={19} /> Kuis
            </Link>
            <Link to="/game" className="flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium opacity-80 transition hover:bg-white/20 hover:opacity-100">
              <Joystick size={19} /> Game
            </Link>
          </div>

          {/* TOMBOL KANAN */}
          <div className="flex shrink-0 items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={() => {
                setIsNight((prev) => {
                  const next = !prev;
                  try { localStorage.setItem('geonusa-theme', next ? 'night' : 'day'); } catch {}
                  return next;
                });
              }}
              className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 hover:scale-105 ${isNight ? 'border-amber-300/30 bg-amber-300/15 text-amber-300 hover:bg-amber-300/25' : 'border-sky-500/10 bg-sky-100/80 text-orange-500 hover:bg-sky-200'}`}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={isNight ? 'moon' : 'sun'}
                  initial={{ opacity: 0, rotate: -45, scale: 0.7 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 45, scale: 0.7 }}
                  transition={{ duration: 0.2 }}
                >
                  {isNight ? <Moon size={20} /> : <Sun size={20} />}
                </motion.span>
              </AnimatePresence>
            </motion.button>

            <Link to="/login">
              <Button className="flex h-10 items-center gap-2 rounded-full bg-rose-600 px-4 text-sm font-semibold text-white shadow-md shadow-rose-600/20 hover:bg-rose-700 sm:px-5">
                <UserRound size={17} />
                <span className="hidden sm:inline">Masuk</span>
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* ANIMASI HEWAN */}
      <AnimatePresence mode="wait">
        <motion.img
          key={animals.main}
          src={animals.main}
          alt={isNight ? 'Burung hantu malam' : 'Monyet bergelantungan'}
          initial={{ opacity: 0, y: -20, rotate: -10, scale: 0.8 }}
          animate={{ opacity: 1, y: isNight ? [0, -8, 0] : [0, 5, -2, 5, 0], rotate: isNight ? [-3, 3, -3] : [-6, 5, -4, 6, -6], scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.8 }}
          transition={{ opacity: { duration: 0.35 }, scale: { duration: 0.35 }, y: { duration: isNight ? 3.5 : 2.8, repeat: Infinity, ease: 'easeInOut' }, rotate: { duration: isNight ? 4 : 3.5, repeat: Infinity, ease: 'easeInOut' } }}
          className={`pointer-events-none absolute right-[3%] top-[100px] z-20 hidden origin-top object-contain drop-shadow-2xl sm:block md:top-[115px] ${isNight ? 'w-20 sm:w-24 md:w-32' : 'w-24 sm:w-28 md:w-36'}`}
        />
      </AnimatePresence>

      <AnimatePresence>
        {!isNight && animals.bird && (
          <motion.img
            key="day-bird"
            src={animals.bird}
            alt="Burung terbang"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: [0.85, 1, 0.85], x: [0, 45, 0], y: [0, -10, 4, 0], rotate: [0, -4, 3, 0] }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ opacity: { duration: 3, repeat: Infinity, ease: 'easeInOut' }, x: { duration: 6, repeat: Infinity, ease: 'easeInOut' }, y: { duration: 4, repeat: Infinity, ease: 'easeInOut' }, rotate: { duration: 4, repeat: Infinity, ease: 'easeInOut' } }}
            className="pointer-events-none absolute right-[30%] top-[125px] z-10 hidden w-14 object-contain drop-shadow-md sm:block md:right-[34%] md:top-[145px] md:w-20"
          />
        )}
      </AnimatePresence>

      {/* KONTEN UTAMA (Hero Section) */}
      <section className="relative mx-auto flex min-h-screen w-full max-w-[1600px] flex-col justify-center px-5 pb-12 pt-28 sm:px-8 md:px-12 lg:px-[6%]">
        
        <motion.div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d", borderRadius: '34px 22px 40px 18px' }}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className={`relative z-20 w-full max-w-[540px] border p-6 shadow-2xl backdrop-blur-md transition-colors duration-500 sm:p-8 md:p-9 lg:p-10 ${isNight ? 'border-white/20 bg-slate-950/60 text-white shadow-black/30' : 'border-white/70 bg-white/70 text-slate-900 shadow-slate-900/10'}`}
        >
          <motion.div style={{ transform: "translateZ(30px)" }} className={`mb-5 inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-bold sm:text-sm ${isNight ? 'border border-rose-300/15 bg-rose-500/15 text-rose-200' : 'bg-rose-100/90 text-rose-600'}`}>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-600 text-white">
              <Globe2 size={15} className="animate-pulse" />
            </span>
            Media Belajar Geografi #1
          </motion.div>

          <motion.h1 style={{ transform: "translateZ(40px)" }} className="mb-4 text-[36px] font-extrabold leading-[1.1] tracking-[-1.4px] sm:text-[43px] md:text-[48px] lg:text-[52px]">
            Jelajahi{' '}
            <motion.span className="text-rose-600 inline-block" whileHover={{ scale: 1.1, rotate: -2 }}>
              Nusantara
            </motion.span>
            <br />
            Secara Interaktif
          </motion.h1>

          <motion.p style={{ transform: "translateZ(20px)" }} className={`mb-6 max-w-[460px] text-sm font-medium leading-relaxed sm:text-base ${isNight ? 'text-slate-200' : 'text-slate-700'}`}>
            Belajar geografi Indonesia jadi menyenangkan! Temukan gunung berapi, flora, fauna, dan budaya dari Sabang sampai Merauke.
          </motion.p>

          {/* CONTAINER TOMBOL (Diperbarui: Ada Game) */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 mt-2" style={{ transform: "translateZ(30px)" }}>
            
            {/* 1. TOMBOL JELAJAH */}
            <Link to="/dashboard" className="inline-flex w-full sm:w-auto relative group">
              <div className={`absolute inset-0 rounded-full blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-300 animate-pulse ${isNight ? 'bg-rose-500' : 'bg-rose-400'}`}></div>
              <Button size="lg" className="relative z-10 group flex h-[54px] w-full sm:w-auto items-center justify-center gap-3 rounded-full bg-rose-600 px-5 text-base font-bold text-white shadow-lg shadow-rose-600/40 transition-all hover:-translate-y-1 hover:bg-rose-700 sm:px-7">
                <motion.span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-rose-600" animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
                  <Compass size={21} />
                </motion.span>
                Mulai Jelajah
                <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>

            {/* 2. TOMBOL KUIS */}
            <Link to="/kuis" className="inline-flex w-full sm:w-auto">
              <Button size="lg" variant="outline" className={`group flex h-[54px] w-full sm:w-auto items-center justify-center gap-3 rounded-full border-2 px-5 text-base font-bold transition-all hover:-translate-y-1 sm:px-7 ${isNight ? 'border-slate-600 bg-slate-800/80 text-white hover:bg-slate-700 hover:text-rose-400 hover:border-rose-400' : 'border-slate-300 bg-white/70 text-slate-700 hover:bg-white hover:text-rose-600 hover:border-rose-300'}`}>
                <span className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${isNight ? 'bg-slate-700 text-slate-300 group-hover:text-rose-400' : 'bg-slate-100 text-slate-600 group-hover:text-rose-600'}`}>
                  <Gamepad2 size={20} />
                </span>
                Main Kuis
              </Button>
            </Link>

            {/* 3. TOMBOL GAME (BARU) */}
            <Link to="/game" className="inline-flex w-full sm:w-auto">
              <Button size="lg" variant="outline" className={`group flex h-[54px] w-full sm:w-auto items-center justify-center gap-3 rounded-full border-2 px-5 text-base font-bold transition-all hover:-translate-y-1 sm:px-7 ${isNight ? 'border-slate-600 bg-slate-800/80 text-white hover:bg-slate-700 hover:text-emerald-400 hover:border-emerald-400' : 'border-slate-300 bg-white/70 text-slate-700 hover:bg-white hover:text-emerald-600 hover:border-emerald-300'}`}>
                <span className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${isNight ? 'bg-slate-700 text-slate-300 group-hover:text-emerald-400' : 'bg-slate-100 text-slate-600 group-hover:text-emerald-600'}`}>
                  <Joystick size={20} />
                </span>
                Main Game
              </Button>
            </Link>

          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <div className={`absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center gap-1.5 text-[11px] sm:text-xs font-medium transition-colors duration-500 ${isNight ? 'text-white/60' : 'text-slate-800/70'}`}>
        <span>Developers</span>
        <a href="https://github.com/sgtadwiii" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-1 font-bold transition-colors ${isNight ? 'text-white/90 hover:text-rose-400' : 'text-slate-900 hover:text-rose-600'}`}>
          @sgtadwiii
          <GithubIcon size={13} className="ml-0.5" />
        </a>
      </div>
    </main>
  );
}
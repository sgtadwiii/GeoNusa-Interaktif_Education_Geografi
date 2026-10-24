import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  BookOpen,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import HomeAnimations from '../components/ui/HomeAnimations';

export default function Home() {
  const [isNight, setIsNight] = useState(() => {
    try {
      return localStorage.getItem('geonusa-theme') === 'night';
    } catch {
      return false;
    }
  });

  const animals = isNight
    ? {
        main: `${import.meta.env.BASE_URL}images/owl.png`, // Pastikan nama file owl.png ada di folder public
        bird: null,
      }
    : {
        main: `${import.meta.env.BASE_URL}images/monyet.png`,
        bird: `${import.meta.env.BASE_URL}images/burung.png`,
      };

  return (
    <main
      className={`relative isolate min-h-screen overflow-hidden font-sans transition-colors duration-700 ${
        isNight ? 'bg-slate-950' : 'bg-sky-400'
      }`}
    >
      {/* BACKGROUND SIANG / MALAM */}
      <AnimatePresence initial={false}>
        <motion.div
          key={isNight ? 'night' : 'day'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9 }}
          className="absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${import.meta.env.BASE_URL}images/${
              isNight ? 'geonusamalam.png' : 'geonusasiang.png'
            })`,
          }}
        />
      </AnimatePresence>

      {/* OVERLAY LEMBUT */}
      <div
        className={`pointer-events-none absolute inset-0 -z-10 transition-colors duration-700 ${
          isNight
            ? 'bg-gradient-to-b from-slate-950/20 via-blue-950/10 to-slate-950/30'
            : 'bg-gradient-to-b from-sky-400/5 via-transparent to-green-950/10'
        }`}
      />

      <HomeAnimations isNight={isNight} />

      {/* NAVBAR */}
      <header className="absolute left-1/2 top-4 z-40 w-[calc(100%-28px)] max-w-[1320px] -translate-x-1/2 sm:top-6 sm:w-[calc(100%-48px)]">
        <nav
          className={`flex min-h-[58px] items-center justify-between gap-2 rounded-full border px-3 py-2 shadow-lg backdrop-blur-xl transition-all duration-500 sm:px-5 md:min-h-[64px] md:px-7 ${
            isNight
              ? 'border-white/15 bg-slate-950/55 text-white shadow-black/20'
              : 'border-white/65 bg-white/75 text-slate-800 shadow-slate-900/10'
          }`}
        >
          {/* LOGO */}
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2 text-lg font-extrabold tracking-tight sm:text-xl"
          >
            <Map className="h-7 w-7 text-rose-600 sm:h-8 sm:w-8" />
            <span>GeoNusa</span>
          </Link>

          {/* MENU DESKTOP */}
          <div className="hidden items-center gap-1 md:flex">
            <Link
              to="/"
              className="flex items-center gap-2 rounded-full bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-rose-600/20 transition hover:bg-rose-700"
            >
              <House size={18} />
              Beranda
            </Link>

            <Link
              to="/dashboard"
              className="flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium opacity-80 transition hover:bg-white/20 hover:opacity-100"
            >
              <Map size={19} />
              Peta Interaktif
            </Link>

            <Link
              to="/kuis"
              className="flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium opacity-80 transition hover:bg-white/20 hover:opacity-100"
            >
              <Gamepad2 size={19} />
              Kuis
            </Link>
          </div>

          {/* TOMBOL KANAN */}
          <div className="flex shrink-0 items-center gap-2">
            {/* TOGGLE TEMA */}
            <button
              type="button"
              onClick={() => {
                setIsNight((prev) => {
                  const nextTheme = !prev;
                  try {
                    localStorage.setItem(
                      'geonusa-theme',
                      nextTheme ? 'night' : 'day'
                    );
                  } catch {}
                  return nextTheme;
                });
              }}
              aria-label={
                isNight ? 'Aktifkan mode siang' : 'Aktifkan mode malam'
              }
              title={isNight ? 'Mode siang' : 'Mode malam'}
              className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 hover:scale-105 ${
                isNight
                  ? 'border-amber-300/30 bg-amber-300/15 text-amber-300 hover:bg-amber-300/25'
                  : 'border-sky-500/10 bg-sky-100/80 text-orange-500 hover:bg-sky-200'
              }`}
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
            </button>

            <Link to="/login">
              <Button className="flex h-10 items-center gap-2 rounded-full bg-rose-600 px-4 text-sm font-semibold text-white shadow-md shadow-rose-600/20 hover:bg-rose-700 sm:px-5">
                <UserRound size={17} />
                <span>Masuk</span>
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* MONYET SIANG / OWL MALAM */}
      <AnimatePresence mode="wait">
        <motion.img
          key={animals.main}
          src={animals.main}
          alt={isNight ? 'Burung hantu malam' : 'Monyet bergelantungan'}
          initial={{ opacity: 0, y: -12, rotate: -8, scale: 0.9 }}
          animate={{
            opacity: 1,
            y: isNight ? [0, -8, 0] : [0, 5, -2, 5, 0],
            rotate: isNight ? [-3, 3, -3] : [-6, 5, -4, 6, -6],
            scale: 1,
          }}
          exit={{ opacity: 0, y: -10, scale: 0.9 }}
          transition={{
            opacity: { duration: 0.35 },
            scale: { duration: 0.35 },
            y: {
              duration: isNight ? 3.5 : 2.8,
              repeat: Infinity,
              ease: 'easeInOut',
            },
            rotate: {
              duration: isNight ? 4 : 3.5,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          }}
          className={`pointer-events-none absolute right-[3%] top-[100px] z-20 hidden origin-top object-contain drop-shadow-lg sm:block md:top-[115px] ${
            isNight ? 'w-20 sm:w-24 md:w-32' : 'w-24 sm:w-28 md:w-36'
          }`}
        />
      </AnimatePresence>

      {/* BURUNG SIANG */}
      <AnimatePresence>
        {!isNight && animals.bird && (
          <motion.img
            key="day-bird"
            src={animals.bird}
            alt="Burung terbang"
            initial={{ opacity: 0, x: -20 }}
            animate={{
              opacity: [0.85, 1, 0.85],
              x: [0, 45, 0],
              y: [0, -10, 4, 0],
              rotate: [0, -4, 3, 0],
            }}
            exit={{ opacity: 0, y: -8 }}
            transition={{
              opacity: {
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              },
              x: {
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              },
              y: {
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              },
              rotate: {
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              },
            }}
            className="pointer-events-none absolute right-[30%] top-[125px] z-10 hidden w-14 object-contain drop-shadow-md sm:block md:right-[34%] md:top-[145px] md:w-20"
          />
        )}
      </AnimatePresence>

      {/* KONTEN UTAMA */}
      <section className="relative mx-auto flex min-h-screen w-full max-w-[1600px] items-center px-5 pb-8 pt-28 sm:px-8 md:px-12 lg:px-[6%]">
        <motion.div
          layout
          className={`relative z-20 w-full max-w-[540px] border p-6 shadow-xl backdrop-blur-md transition-colors duration-500 sm:p-8 md:p-9 lg:p-10 ${
            isNight
              ? 'border-white/20 bg-slate-950/55 text-white shadow-black/20'
              : 'border-white/70 bg-white/65 text-slate-900 shadow-slate-900/10'
          }`}
          style={{
            borderRadius: '34px 22px 40px 18px',
          }}
          initial={{ opacity: 0, x: -28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* LABEL */}
          <div
            className={`mb-5 inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-bold sm:text-sm ${
              isNight
                ? 'border border-rose-300/15 bg-rose-500/15 text-rose-200'
                : 'bg-rose-100/90 text-rose-600'
            }`}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-600 text-white">
              <Globe2 size={15} />
            </span>
            Media Belajar Geografi #1
          </div>

          {/* JUDUL */}
          <h1 className="mb-4 text-[36px] font-extrabold leading-[1.1] tracking-[-1.4px] sm:text-[43px] md:text-[48px] lg:text-[52px]">
            Jelajahi <span className="text-rose-600">Nusantara</span>
            <br />
            Secara Interaktif
          </h1>

          {/* DESKRIPSI */}
          <p
            className={`mb-6 max-w-[460px] text-sm font-medium leading-relaxed sm:text-base ${
              isNight ? 'text-slate-200' : 'text-slate-700'
            }`}
          >
            Belajar geografi Indonesia jadi menyenangkan! Temukan
            gunung berapi, flora, fauna, dan budaya dari Sabang
            sampai Merauke.
          </p>

          {/* CONTAINER TOMBOL (Responsif: Berjejer ke bawah di HP) */}
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            {/* TOMBOL JELAJAH */}
            <Link to="/dashboard" className="inline-flex w-full sm:w-auto">
              <Button
                size="lg"
                className="group flex h-[54px] w-full sm:w-auto items-center justify-center gap-3 rounded-full bg-rose-600 px-5 text-base font-bold text-white shadow-lg shadow-rose-600/25 transition-all hover:-translate-y-0.5 hover:bg-rose-700 sm:px-7"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-rose-600">
                  <Compass size={21} />
                </span>
                Mulai Jelajah
                <ArrowRight
                  size={20}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Button>
            </Link>

            {/* TOMBOL KUIS (BARU) */}
            <Link to="/kuis" className="inline-flex w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className={`group flex h-[54px] w-full sm:w-auto items-center justify-center gap-3 rounded-full border-2 px-5 text-base font-bold transition-all hover:-translate-y-0.5 sm:px-7 ${
                  isNight
                    ? 'border-slate-600 bg-slate-800/80 text-white hover:bg-slate-700 hover:text-rose-400'
                    : 'border-slate-300 bg-white/70 text-slate-700 hover:bg-white hover:text-rose-600'
                }`}
              >
                <span className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                  isNight 
                    ? 'bg-slate-700 text-slate-300 group-hover:text-rose-400' 
                    : 'bg-slate-100 text-slate-600 group-hover:text-rose-600'
                }`}>
                  <Gamepad2 size={20} />
                </span>
                Main Kuis
              </Button>
            </Link>
          </div>

          {/* AKSEN KECIL */}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute -bottom-3 -right-3 -z-10 h-20 w-20 rounded-full blur-2xl ${
              isNight ? 'bg-indigo-400/20' : 'bg-sky-300/30'
            }`}
          />
        </motion.div>
      </section>

      {/* FOOTER KECIL OPSIONAL */}
      <div
        className={`pointer-events-none absolute bottom-3 right-5 z-10 hidden items-center gap-2 text-xs font-medium sm:flex ${
          isNight ? 'text-white/70' : 'text-slate-800/65'
        }`}
      >
        <BookOpen size={14} />
        Belajar • Jelajahi • Temukan
      </div>
    </main>
  );
}
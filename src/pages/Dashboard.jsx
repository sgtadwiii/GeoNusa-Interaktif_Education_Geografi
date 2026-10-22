import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Map,
  Menu,
  X,
  Search,
  Compass,
  GraduationCap,
  Sparkles,
  Leaf,
  Bird,
  BookOpen,
  MapPinned,
  ChevronRight,
  ArrowRight,
  Layers,
  Globe2,
  Mountain,
  Sun,
  Moon,
  ExternalLink,
  Building2,
  Brain,
  Home,
} from 'lucide-react';

import LeafletMap from '../components/ui/LeafletMap';
import materiData from '../data/materi.json';

const THEME_KEY = 'geonusa-theme';

const particles = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: (i * 37 + 13) % 100,
  y: (i * 23 + 7) % 100,
  duration: 5 + (i % 5) * 1.5,
  delay: (i % 7) * 0.4,
}));

function getInitialTheme() {
  try {
    return localStorage.getItem(THEME_KEY) || 'day';
  } catch {
    return 'day';
  }
}

function getSourceUrl(source) {
  const match = String(source || '').match(/https?:\/\/[^\s)]+/i);
  return match ? match[0] : null;
}

// ======================================================
// BACKGROUND ANIMATION
// ======================================================

function FloatingAtmosphere({ isNight }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute rounded-full ${
            isNight ? 'bg-cyan-200/50' : 'bg-emerald-300/60'
          }`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.id % 3 === 0 ? 5 : 3,
            height: particle.id % 3 === 0 ? 5 : 3,
          }}
          animate={{
            y: [0, -18, 0],
            x: [0, particle.id % 2 === 0 ? 10 : -10, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [0.8, 1.3, 0.8],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      <motion.div
        className={`absolute -right-24 -top-24 h-80 w-80 rounded-full blur-3xl ${
          isNight ? 'bg-cyan-500/10' : 'bg-emerald-300/20'
        }`}
        animate={{ scale: [1, 1.2, 1], x: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      <motion.div
        className={`absolute -bottom-28 -left-20 h-96 w-96 rounded-full blur-3xl ${
          isNight ? 'bg-indigo-500/15' : 'bg-sky-300/20'
        }`}
        animate={{ scale: [1, 1.15, 1], y: [0, -15, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
    </div>
  );
}

// ======================================================
// IMAGE FROM JSON
// ======================================================

function RegionImage({ src, name, isNight }) {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [src]);

  if (!src || imageError) {
    return (
      <div
        className={`flex h-48 flex-col items-center justify-center gap-3 rounded-2xl border ${
          isNight
            ? 'border-white/10 bg-white/5 text-slate-400'
            : 'border-slate-200 bg-slate-100 text-slate-500'
        }`}
      >
        <MapPinned size={36} />
        <p className="text-xs font-semibold">
          {src ? 'Gambar tidak dapat dimuat' : 'Belum ada gambar wilayah'}
        </p>
      </div>
    );
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl">
      <motion.img
        src={src}
        alt={`Pemandangan ${name}`}
        loading="lazy"
        onError={() => setImageError(true)}
        className="h-48 w-full object-cover sm:h-56"
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.04 }}
        transition={{ duration: 0.45 }}
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-2 p-4">
        <div className="min-w-0 text-white">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/75">
            Jelajah Nusantara
          </p>
          <h3 className="mt-1 text-xl font-black">{name}</h3>
        </div>

        <span className="rounded-xl border border-white/30 bg-white/20 p-2 text-white backdrop-blur-md">
          <MapPinned size={20} />
        </span>
      </div>
    </div>
  );
}

// ======================================================
// SIDEBAR MENU ITEM
// ======================================================

function SidebarLink({ to, icon: Icon, title, description, isNight, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`group flex items-center gap-3 rounded-2xl border p-3 transition-all duration-300 ${
        isNight
          ? 'border-transparent hover:border-white/10 hover:bg-white/5'
          : 'border-transparent hover:border-slate-200 hover:bg-white/80'
      }`}
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-md shadow-emerald-600/15 transition-transform group-hover:scale-105">
        <Icon size={21} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-extrabold">{title}</p>
        <p
          className={`mt-1 text-[11px] ${
            isNight ? 'text-slate-400' : 'text-slate-500'
          }`}
        >
          {description}
        </p>
      </div>

      <ChevronRight
        size={16}
        className={`transition-transform group-hover:translate-x-1 ${
          isNight ? 'text-slate-400' : 'text-slate-500'
        }`}
      />
    </Link>
  );
}

// ======================================================
// DASHBOARD
// ======================================================

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('SD');
  const [selectedCity, setSelectedCity] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState(getInitialTheme);

  const isNight = theme === 'night';

  const cities = useMemo(
    () => materiData[activeTab] || [],
    [activeTab]
  );

  const filteredCities = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return cities;

    return cities.filter((city) =>
      `${city.nama || ''} ${city.pulau || ''} ${
        city.geografi || ''
      } ${city.deskripsi || ''}`
        .toLowerCase()
        .includes(query)
    );
  }, [cities, searchQuery]);

  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // Dashboard tetap berjalan jika localStorage tidak tersedia.
    }
  }, [theme]);

  useEffect(() => {
    setSelectedCity(null);
    setSearchQuery('');
  }, [activeTab]);

  const selectLocation = (city) => {
    setSelectedCity(city);
    setIsSidebarOpen(false);
  };

  const selectNextLocation = () => {
    if (!cities.length) return;
    const currentIndex = cities.findIndex((city) =>
      selectedCity?.id != null ? city.id === selectedCity.id : city.nama === selectedCity?.nama
    );
    const nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % cities.length;
    selectLocation(cities[nextIndex]);
  };

  const sourceUrl = getSourceUrl(selectedCity?.sumber);

  const sourceLabel = String(selectedCity?.sumber || '')
    .replace(/\s*\(https?:\/\/[^\s)]+\)/i, '')
    .trim();

  const surface = isNight
    ? 'border-white/10 bg-slate-950/70 text-white'
    : 'border-white/70 bg-white/80 text-slate-800';

  const muted = isNight ? 'text-slate-400' : 'text-slate-500';

  return (
    <div
      className={`relative flex h-[100dvh] min-h-[600px] overflow-hidden font-sans transition-colors duration-700 ${
        isNight ? 'bg-slate-950' : 'bg-sky-50'
      }`}
    >
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={theme}
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
    backgroundImage: `url(${import.meta.env.BASE_URL}images/${isNight ? 'geonusamalam.png' : 'geonusasiang.png'})` 
  }}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{
              opacity: isNight ? 0.5 : 0.65,
              scale: 1,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          />
        </AnimatePresence>

        <div
          className={`absolute inset-0 ${
            isNight
              ? 'bg-slate-950/65'
              : 'bg-gradient-to-br from-sky-100/45 via-white/20 to-emerald-100/40'
          }`}
        />
      </div>

      <FloatingAtmosphere isNight={isNight} />

      {/* MOBILE SIDEBAR OVERLAY */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.button
            aria-label="Tutup menu"
            className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[290px] flex-col border-r backdrop-blur-2xl transition-all duration-300 md:relative md:z-20 md:w-[320px] md:shrink-0 ${
          surface
        } ${
          isSidebarOpen
            ? 'translate-x-0'
            : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* BRAND */}
        <div className="border-b border-inherit p-5">
          <div className="mb-7 flex items-center justify-between">
            <Link
              to="/"
              className="group flex items-center gap-3"
              onClick={() => setIsSidebarOpen(false)}
            >
              <motion.div
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-lg shadow-emerald-500/25"
                whileHover={{ rotate: -8, scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                <Globe2 size={27} />
              </motion.div>

              <div>
                <h1 className="text-xl font-black tracking-tight">
                  Geo<span className="text-emerald-500">Nusa</span>
                </h1>
                <p
                  className={`text-[10px] font-semibold tracking-[0.2em] ${muted}`}
                >
                  EXPLORE YOUR WORLD
                </p>
              </div>
            </Link>

            <button
              onClick={() => setIsSidebarOpen(false)}
              className="rounded-xl p-2 hover:bg-black/5 md:hidden"
              aria-label="Tutup sidebar"
            >
              <X size={20} />
            </button>
          </div>

          {/* JENJANG */}
          <p
            className={`mb-3 text-[10px] font-extrabold uppercase tracking-[0.18em] ${muted}`}
          >
            Jenjang pendidikan
          </p>

          <div
            className={`grid grid-cols-3 gap-1 rounded-2xl p-1.5 ${
              isNight ? 'bg-black/25' : 'bg-slate-200/60'
            }`}
          >
            {[
              { id: 'SD', icon: '🌱' },
              { id: 'SMP', icon: '🧭' },
              { id: 'SMA', icon: '🌍' },
            ].map((level) => (
              <button
                key={level.id}
                onClick={() => setActiveTab(level.id)}
                className={`relative flex flex-col items-center gap-1 rounded-xl py-2.5 transition ${
                  activeTab === level.id
                    ? 'text-white'
                    : `${muted} hover:bg-white/10`
                }`}
              >
                {activeTab === level.id && (
                  <motion.div
                    layoutId="activeLevel"
                    className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-600/20"
                    transition={{
                      type: 'spring',
                      stiffness: 350,
                      damping: 30,
                    }}
                  />
                )}

                <span className="relative z-10 text-base">
                  {level.icon}
                </span>
                <span className="relative z-10 text-xs font-extrabold">
                  {level.id}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* SIDEBAR NAVIGATION */}
        <div className="border-b border-inherit px-3 py-3">
          <p
            className={`mb-2 px-2 text-[10px] font-extrabold uppercase tracking-[0.18em] ${muted}`}
          >
            Menu utama
          </p>

          {/* <div className="space-y-1">
            <SidebarLink
              to="/"
              icon={Home}
              title="Beranda"
              description="Halaman utama GeoNusa"
              isNight={isNight}
              onClick={() => setIsSidebarOpen(false)}
            />

            <SidebarLink
              to="/kuis"
              icon={Brain}
              title="Uji Pemahaman"
              description="Latihan dan kuis geografi"
              isNight={isNight}
              onClick={() => setIsSidebarOpen(false)}
            />
          </div> */}
        </div>

        {/* SEARCH */}
        <div className="px-4 pb-3 pt-4">
          <div
            className={`flex items-center gap-2 rounded-2xl border px-3 ${
              isNight
                ? 'border-white/10 bg-white/5'
                : 'border-slate-200 bg-white/70'
            }`}
          >
            <Search size={17} className={muted} />

            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari materi geografi..."
              aria-label="Cari materi geografi"
              className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-slate-400"
            />

            <Layers size={15} className={muted} />
          </div>
        </div>

        {/* DAFTAR MATERI */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-4 [scrollbar-width:thin]">
          <div className="mb-3 flex items-center justify-between px-2 pt-2">
            <p
              className={`text-[10px] font-extrabold uppercase tracking-[0.18em] ${muted}`}
            >
              Eksplorasi wilayah
            </p>

            <span
              className={`rounded-full px-2 py-1 text-[10px] font-bold ${
                isNight
                  ? 'bg-white/10'
                  : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              {filteredCities.length} materi
            </span>
          </div>

          <div className="space-y-2">
            {filteredCities.map((city, index) => {
              const active = selectedCity?.id === city.id;

              return (
                <motion.button
                  key={city.id}
                  layout
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: Math.min(index * 0.035, 0.25),
                  }}
                  onClick={() => selectLocation(city)}
                  className={`group relative flex w-full min-h-[72px] items-center gap-3 overflow-hidden rounded-2xl border p-3.5 text-left transition-all duration-300 ${
                    active
                      ? isNight
                        ? 'border-emerald-400/40 bg-emerald-400/10 shadow-lg'
                        : 'border-emerald-300 bg-emerald-50 shadow-lg'
                      : isNight
                        ? 'border-transparent hover:border-white/10 hover:bg-white/5'
                        : 'border-transparent hover:border-slate-200 hover:bg-white/70'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="activeLesson"
                      className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-emerald-500"
                    />
                  )}

                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-sm transition-transform group-hover:scale-105"
                    style={{
                      backgroundColor: `${city.warna || '#10b981'}22`,
                      color: city.warna || '#10b981',
                    }}
                  >
                    <MapPinned size={21} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-bold">
                      {city.nama}
                    </h3>
                    <p
                      className={`mt-1 line-clamp-1 text-[11px] ${muted}`}
                    >
                      {city.pulau || city.geografi || 'Jelajahi wilayah'}
                    </p>
                  </div>

                  <ChevronRight
                    size={16}
                    className={`shrink-0 transition-transform group-hover:translate-x-1 ${
                      active ? 'text-emerald-500' : muted
                    }`}
                  />
                </motion.button>
              );
            })}

            {filteredCities.length === 0 && (
              <div className={`rounded-2xl p-6 text-center ${muted}`}>
                <Search size={26} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm font-semibold">
                  Materi tidak ditemukan
                </p>
                <p className="mt-1 text-xs">
                  Coba kata kunci lainnya.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* SIDEBAR FOOTER */}
        <div className="border-t border-inherit p-4">
          <div
            className={`flex items-center gap-3 rounded-2xl p-3 ${
              isNight ? 'bg-white/5' : 'bg-emerald-50/80'
            }`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-300 to-orange-400 text-white shadow-md">
              <GraduationCap size={23} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-extrabold">
                Petualangan dimulai!
              </p>
              <p className={`mt-1 text-[10px] ${muted}`}>
                Belajar sambil menjelajah.
              </p>
            </div>

            <Sparkles size={17} className="text-amber-400" />
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="relative z-10 flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* TOPBAR */}
        <header className="relative z-30 flex items-center justify-between gap-3 px-4 py-4 md:px-7 md:py-5">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className={`rounded-2xl border p-3 shadow-sm backdrop-blur-xl md:hidden ${surface}`}
              aria-label="Buka menu"
            >
              <Menu size={20} />
            </button>

            <div className="min-w-0">
              <div
                className={`mb-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] ${muted}`}
              >
                <Compass size={13} className="text-emerald-500" />
                Ruang eksplorasi
              </div>

              <h2 className={'truncate text-lg font-black tracking-tight md:text-2xl' }>
                Jelajahi Bumi
                <span className="ml-2 hidden text-emerald-500 sm:inline">
                  ✦
                </span>
              </h2>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <div
              className={`hidden items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold sm:flex ${surface}`}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Mode belajar
            </div>

            <motion.button
              whileHover={{ scale: 1.06, rotate: 5 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setTheme(isNight ? 'day' : 'night')}
              className={`flex h-11 w-11 items-center justify-center rounded-2xl border shadow-lg backdrop-blur-xl ${surface}`}
              aria-label={
                isNight ? 'Aktifkan mode siang' : 'Aktifkan mode malam'
              }
              title={isNight ? 'Mode siang' : 'Mode malam'}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={theme}
                  initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
                  transition={{ duration: 0.2 }}
                >
                  {isNight ? (
                    <Sun size={20} className="text-amber-400" />
                  ) : (
                    <Moon size={20} className="text-indigo-500" />
                  )}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </div>
        </header>

        {/* MAP */}
        <div className="relative min-h-0 flex-1 overflow-hidden px-3 pb-3 md:px-5 md:pb-5">
          <div
            className={`absolute inset-3 overflow-hidden rounded-[28px] border shadow-2xl md:inset-x-5 md:inset-y-0 md:rounded-[32px] ${
              isNight
                ? 'border-white/10 bg-slate-900/40 shadow-black/20'
                : 'border-white/70 bg-white/20 shadow-emerald-950/10'
            }`}
          >
            <div className="absolute inset-0 z-0">
              <LeafletMap
                locations={cities}
                selectedLocation={selectedCity}
                onSelectLocation={selectLocation}
                isNight={isNight}
              />
            </div>

            <div className="pointer-events-none absolute inset-0 z-[2] rounded-[inherit] ring-1 ring-inset ring-white/10" />

            {/* MAP GUIDE: otomatis disembunyikan saat materi dibuka */}
            {!selectedCity && <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              className={`pointer-events-none absolute left-4 top-4 z-10 max-w-[230px] rounded-2xl border p-3 shadow-xl backdrop-blur-xl md:left-6 md:top-6 md:max-w-[270px] md:p-4 ${surface}`}
            >
              <div className="mb-2 flex items-center gap-2">
                <div className="rounded-xl bg-emerald-500/15 p-2 text-emerald-500">
                  <Globe2 size={19} />
                </div>

                <div>
                  <p className="text-sm font-extrabold">
                    Peta interaktif
                  </p>
                  <p className={`text-[10px] ${muted}`}>
                    GeoNusa Explorer
                  </p>
                </div>
              </div>

              <p className={`text-[11px] leading-relaxed md:text-xs ${muted}`}>
                Pilih penanda di peta atau materi di samping untuk mulai menjelajah.
              </p>
            </motion.div>}

            {/* FLOATING COMPASS */}
            <motion.div
              className={`pointer-events-none absolute bottom-5 left-4 z-10 flex h-14 w-14 items-center justify-center rounded-2xl border shadow-xl backdrop-blur-xl md:bottom-7 md:left-6 md:h-16 md:w-16 ${surface}`}
              animate={{ y: [0, -7, 0], rotate: [0, 4, -4, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-700 text-white shadow-inner md:h-12 md:w-12">
                <Compass size={26} />
                <span className="absolute -top-1 text-[8px] font-black">
                  N
                </span>
              </div>
            </motion.div>

            {/* WELCOME CARD */}
            <AnimatePresence>
              {!selectedCity && (
                <motion.div
                  key="welcome"
                  initial={{ opacity: 0, y: 20, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.97 }}
                  className="absolute bottom-5 left-20 right-3 z-10 md:bottom-7 md:left-28 md:right-auto md:w-[340px]"
                >
                  <div className={`rounded-3xl border p-4 shadow-2xl backdrop-blur-2xl md:p-5 ${surface}`}>
                    <div className="mb-3 flex items-center gap-2">
                      <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-500">
                        Level {activeTab}
                      </span>
                      <Sparkles size={15} className="text-amber-400" />
                    </div>

                    <h3 className="text-lg font-black leading-tight md:text-xl">
                      Bumi punya banyak cerita.
                    </h3>

                    <p className={`mt-2 text-xs leading-relaxed md:text-sm ${muted}`}>
                      Temukan bentang alam, flora, fauna, dan keunikan wilayah Indonesia melalui petualangan geografi.
                    </p>

                    <button
                      onClick={() => {
                        if (filteredCities.length) {
                          selectLocation(filteredCities[0]);
                        } else {
                          setIsSidebarOpen(true);
                        }
                      }}
                      className="mt-4 flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-3 text-xs font-extrabold text-white shadow-lg shadow-emerald-600/20 transition hover:brightness-110"
                    >
                      Mulai eksplorasi
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* LESSON DETAIL */}
            <AnimatePresence mode="wait">
              {selectedCity && (
                <motion.section
                  key={`${activeTab}-${selectedCity.id}`}
                  initial={{ opacity: 0, x: 35, scale: 0.97 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 25, scale: 0.98 }}
                  transition={{
                    type: 'spring',
                    stiffness: 260,
                    damping: 28,
                  }}
                  className={`absolute inset-x-2 bottom-2 top-[190px] z-20 flex flex-col overflow-hidden rounded-[28px] border shadow-2xl sm:inset-x-auto sm:bottom-4 sm:right-4 sm:top-4 sm:w-[min(410px,calc(100%-32px))] md:inset-y-4 md:right-6 md:w-[390px] ${isNight ? 'border-slate-700 bg-[#0b1626] text-slate-100' : 'border-white bg-white text-slate-800'}`}
                >
                  {/* HEADER */}
                  <div
                    className={`relative shrink-0 overflow-hidden border-b p-5 ${
                      isNight
                        ? 'border-slate-700 bg-gradient-to-br from-[#102b35] to-[#0b1626]'
                        : 'border-slate-200 bg-gradient-to-br from-white to-emerald-50'
                    }`}
                  >
                    <motion.div
                      className="absolute -right-5 -top-9 h-32 w-32 rounded-full border-[18px] border-emerald-400/10"
                      animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                      transition={{
                        duration: 18,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />

                    <div className="relative flex items-start justify-between gap-3">
                      <div>
                        <div className="mb-3 flex items-center gap-2">
                          <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-500">
                            Materi {activeTab}
                          </span>
                          <span className={`text-[10px] font-semibold ${muted}`}>
                            GeoNusa
                          </span>
                        </div>

                        <h2 className="max-w-[270px] text-2xl font-black leading-tight tracking-tight md:text-3xl">
                          {selectedCity.nama}
                        </h2>

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <p className={`text-xs leading-relaxed ${muted}`}>
                            {selectedCity.pulau || 'Jelajahi karakteristik wilayah ini'}
                          </p>
                          {cities.length > 1 && (
                            <button
                              type="button"
                              onClick={selectNextLocation}
                              title="Buka materi berikutnya"
                              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-emerald-500/25 bg-emerald-500 px-2.5 py-1.5 text-[10px] font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-600 active:translate-y-0"
                            >
                              Berikutnya <ArrowRight size={13} />
                            </button>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedCity(null)}
                        className={`shrink-0 rounded-xl border p-2.5 transition hover:rotate-[-8deg] ${
                          isNight
                            ? 'border-white/10 bg-white/5 hover:bg-white/10'
                            : 'border-slate-200 bg-white/80 hover:bg-white'
                        }`}
                        aria-label="Tutup materi"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>

                  {/* MATERI DARI JSON */}
                  <div className="flex-1 space-y-5 overflow-y-auto p-4 md:p-5">
                    {/* GAMBAR */}
                    <section>
                      <RegionImage
                        src={selectedCity.gambar}
                        name={selectedCity.nama}
                        isNight={isNight}
                      />
                    </section>

                    {/* DESKRIPSI */}
                    <section>
                      <div className="mb-2 flex items-center gap-2">
                        <BookOpen size={17} className="text-emerald-500" />
                        <h3 className="text-sm font-extrabold">
                          Tentang wilayah ini
                        </h3>
                      </div>

                      <p className={`text-sm leading-7 ${muted}`}>
                        {selectedCity.deskripsi || 'Deskripsi wilayah belum tersedia.'}
                      </p>
                    </section>

                    {/* IDENTITAS WILAYAH */}
                    <section>
                      <div className="mb-3 flex items-center gap-2">
                        <MapPinned size={17} className="text-emerald-500" />
                        <h3 className="text-sm font-extrabold">
                          Identitas wilayah
                        </h3>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <motion.div
                          whileHover={{ y: -3 }}
                          className={`rounded-2xl border p-4 ${
                            isNight
                              ? 'border-emerald-400/20 bg-[#102a2b]'
                              : 'border-emerald-100 bg-emerald-50'
                          }`}
                        >
                          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-500">
                            <Building2 size={20} />
                          </div>

                          <p className={`mb-1 text-[10px] font-bold uppercase tracking-wider ${muted}`}>
                            Ibu kota
                          </p>

                          <p className="text-sm font-extrabold">
                            {selectedCity.ibukota || 'Belum tersedia'}
                          </p>
                        </motion.div>

                        <motion.div
                          whileHover={{ y: -3 }}
                          className={`rounded-2xl border p-4 ${
                            isNight
                              ? 'border-sky-400/20 bg-[#102238]'
                              : 'border-sky-100 bg-sky-50'
                          }`}
                        >
                          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/15 text-sky-500">
                            <Globe2 size={20} />
                          </div>

                          <p className={`mb-1 text-[10px] font-bold uppercase tracking-wider ${muted}`}>
                            Kawasan pulau
                          </p>

                          <p className="text-sm font-extrabold">
                            {selectedCity.pulau || 'Belum tersedia'}
                          </p>
                        </motion.div>
                      </div>
                    </section>

                    {/* GEOGRAFI */}
                    <section
                      className={`rounded-2xl border p-4 ${
                        isNight
                          ? 'border-slate-700 bg-[#111e30]'
                          : 'border-slate-200 bg-slate-50'
                      }`}
                    >
                      <div className="mb-3 flex items-center gap-2">
                        <Mountain size={18} className="text-teal-500" />
                        <h3 className="text-sm font-extrabold">
                          Karakteristik geografis
                        </h3>
                      </div>

                      <p className={`text-sm leading-7 ${muted}`}>
                        {selectedCity.geografi || 'Informasi geografis belum tersedia.'}
                      </p>

                      {Array.isArray(selectedCity.koordinat) &&
                        selectedCity.koordinat.length >= 2 && (
                          <div className={`mt-4 flex items-center gap-2 border-t pt-3 ${
                            isNight ? 'border-white/10' : 'border-slate-200'
                          }`}>
                            <MapPinned size={15} className="shrink-0 text-emerald-500" />

                            <div>
                              <p className={`text-[10px] font-bold uppercase tracking-wider ${muted}`}>
                                Koordinat geografis
                              </p>

                              <p className="mt-1 text-xs font-bold">
                                {selectedCity.koordinat[1]}, {selectedCity.koordinat[0]}
                              </p>

                              <p className={`mt-1 text-[10px] ${muted}`}>
                                Lintang, Bujur
                              </p>
                            </div>
                          </div>
                        )}
                    </section>

                    {/* FLORA DAN FAUNA */}
                    <section>
                      <div className="mb-3 flex items-center gap-2">
                        <Layers size={17} className="text-emerald-500" />
                        <h3 className="text-sm font-extrabold">
                          Keanekaragaman hayati
                        </h3>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <motion.div
                          whileHover={{ y: -3 }}
                          className={`rounded-2xl border p-3 ${
                            isNight
                              ? 'border-emerald-400/20 bg-[#102a2b]'
                              : 'border-emerald-100 bg-emerald-50'
                          }`}
                        >
                          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-500">
                            <Leaf size={20} />
                          </div>

                          <h4 className="mb-2 text-xs font-extrabold text-emerald-500">
                            Flora
                          </h4>

                          <p className={`text-xs leading-relaxed ${muted}`}>
                            {selectedCity.flora || 'Informasi flora belum tersedia.'}
                          </p>
                        </motion.div>

                        <motion.div
                          whileHover={{ y: -3 }}
                          className={`rounded-2xl border p-3 ${
                            isNight
                              ? 'border-orange-400/20 bg-[#2b2118]'
                              : 'border-orange-100 bg-orange-50'
                          }`}
                        >
                          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/15 text-orange-500">
                            <Bird size={20} />
                          </div>

                          <h4 className="mb-2 text-xs font-extrabold text-orange-500">
                            Fauna
                          </h4>

                          <p className={`text-xs leading-relaxed ${muted}`}>
                            {selectedCity.fauna || 'Informasi fauna belum tersedia.'}
                          </p>
                        </motion.div>
                      </div>
                    </section>

                    {/* SUMBER REFERENSI */}
                    <section
                      className={`rounded-2xl border p-4 ${
                        isNight
                          ? 'border-slate-700 bg-[#111e30]'
                          : 'border-slate-200 bg-white/70'
                      }`}
                    >
                      <div className="mb-3 flex items-center gap-2">
                        <BookOpen size={17} className="text-emerald-500" />
                        <h3 className="text-sm font-extrabold">
                          Sumber referensi
                        </h3>
                      </div>

                      {sourceUrl ? (
                        <a
                          href={sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`group flex items-center gap-3 rounded-xl border p-3 transition ${
                            isNight
                              ? 'border-white/10 hover:bg-white/5'
                              : 'border-slate-200 hover:bg-emerald-50'
                          }`}
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-500">
                            <ExternalLink size={19} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-extrabold">
                              {sourceLabel || 'Baca sumber referensi'}
                            </p>

                            <p className={`mt-1 break-all text-[10px] ${muted}`}>
                              {sourceUrl}
                            </p>
                          </div>

                          <ChevronRight
                            size={17}
                            className="shrink-0 text-emerald-500 transition-transform group-hover:translate-x-1"
                          />
                        </a>
                      ) : (
                        <p className={`text-xs leading-relaxed ${muted}`}>
                          Sumber referensi belum tersedia untuk materi ini.
                        </p>
                      )}
                    </section>
                  </div>

                  {/* Tidak ada tombol kuis di panel materi */}
                </motion.section>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
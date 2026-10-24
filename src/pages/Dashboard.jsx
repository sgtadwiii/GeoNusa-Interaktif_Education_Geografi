import React, { useEffect, useMemo, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import {
  Menu, X, Search, Compass, Leaf, Bird, BookOpen,
  MapPinned, ChevronRight, ArrowRight, Layers, Globe2, Mountain,
  Sun, Moon, ExternalLink, Bot, ChevronUp, Sparkles
} from 'lucide-react';

import LeafletMap from '../components/ui/LeafletMap';
import materiData from '../data/materi.json';

const THEME_KEY = 'geonusa-theme';

function getInitialTheme() {
  try { return localStorage.getItem(THEME_KEY) || 'day'; } catch { return 'day'; }
}

function getSourceUrl(source) {
  const match = String(source || '').match(/https?:\/\/[^\s)]+/i);
  return match ? match[0] : null;
}

// ==========================================
// KOMPONEN MASKOT BOT
// ==========================================
function Mascot() {
  const [isVisible, setIsVisible] = useState(true);
  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    let timeoutId;
    const loopVisibility = () => {
      setIsVisible(true);
      timeoutId = setTimeout(() => {
        if (!showBubble) setIsVisible(false);
        timeoutId = setTimeout(loopVisibility, 40000);
      }, 6000);
    };
    loopVisibility();
    return () => clearTimeout(timeoutId);
  }, [showBubble]);

  return (
    <div className="fixed bottom-6 right-4 z-50 flex flex-col items-end pointer-events-none">
      <AnimatePresence>
        {showBubble && (
          <motion.div initial={{ opacity: 0, y: 10, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.8 }} className="mb-2 rounded-2xl rounded-br-sm bg-white px-4 py-2 text-xs font-bold text-slate-800 shadow-xl border border-slate-200 pointer-events-auto">
            Halo! Ayo mulai petualanganmu! 👋
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isVisible && (
          <motion.button initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 100, opacity: 0 }} transition={{ type: "spring", stiffness: 200, damping: 20 }} onClick={() => { setShowBubble(!showBubble); setIsVisible(true); }} className="pointer-events-auto relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-xl shadow-emerald-500/30 transition-transform hover:scale-110">
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}><Bot size={28} /></motion.div>
            <span className="absolute top-3 right-3 flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-300 opacity-75"></span><span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400"></span></span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

// ==========================================
// DASHBOARD UTAMA
// ==========================================
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('SD');
  const [selectedCity, setSelectedCity] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState(getInitialTheme);
  const [sheetHeight, setSheetHeight] = useState('85dvh'); 
  const dragControls = useDragControls();
  
  const [hasScrolled, setHasScrolled] = useState(false);
  const contentRef = useRef(null);

  const isNight = theme === 'night';
  const cities = useMemo(() => materiData[activeTab] || [], [activeTab]);

  const filteredCities = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return cities;
    return cities.filter((city) =>
      `${city.nama || ''} ${city.pulau || ''} ${city.geografi || ''}`.toLowerCase().includes(query)
    );
  }, [cities, searchQuery]);

  // Ambil kota pertama (Aceh) untuk rekomendasi awal
  const firstCity = cities[0]; 

  useEffect(() => {
    try { localStorage.setItem(THEME_KEY, theme); } catch {}
  }, [theme]);

  useEffect(() => {
    setSelectedCity(null);
    setSearchQuery('');
  }, [activeTab]);

  useEffect(() => {
    setHasScrolled(false);
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [selectedCity]);

  const handleScroll = (e) => {
    if (e.target.scrollTop > 20 && !hasScrolled) setHasScrolled(true);
  };

  const selectLocation = (city) => {
    setSelectedCity(city);
    setIsSidebarOpen(false);
    setSheetHeight('85dvh'); 
  };

  const selectNextLocation = () => {
    if (!cities.length) return;
    const currentIndex = cities.findIndex((city) => city.id === selectedCity?.id);
    const nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % cities.length;
    selectLocation(cities[nextIndex]);
  };

  const sourceUrl = getSourceUrl(selectedCity?.sumber);
  const surface = isNight ? 'border-white/10 bg-slate-950/70 text-white' : 'border-white/70 bg-white/80 text-slate-800';
  const muted = isNight ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className={`relative flex h-[100dvh] min-h-[600px] overflow-hidden font-sans transition-colors duration-700 ${isNight ? 'bg-slate-950' : 'bg-sky-50'}`}>
      
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center transition-all duration-700" style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/${isNight ? 'geonusamalam.png' : 'geonusasiang.png'})`, opacity: isNight ? 0.3 : 0.5 }} />
        <div className={`absolute inset-0 ${isNight ? 'bg-slate-950/80' : 'bg-gradient-to-br from-sky-100/60 via-white/30 to-emerald-100/50'}`} />
      </div>

      <Mascot />

      {/* MOBILE SIDEBAR OVERLAY */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.button className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSidebarOpen(false)} />
        )}
      </AnimatePresence>

      {/* SIDEBAR (DAFTAR KOTA) */}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[290px] flex-col border-r backdrop-blur-2xl transition-all duration-300 md:relative md:z-20 md:w-[320px] md:shrink-0 ${surface} ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="border-b border-inherit p-5">
          <div className="mb-6 flex items-center justify-between">
            <Link to="/" className="group flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-lg"><Globe2 size={24} /></div>
              <h1 className="text-xl font-black tracking-tight">Geo<span className="text-emerald-500">Nusa</span></h1>
            </Link>
            <button onClick={() => setIsSidebarOpen(false)} className="rounded-xl p-2 hover:bg-black/5 md:hidden"><X size={20} /></button>
          </div>

          <div className={`grid grid-cols-3 gap-1 rounded-2xl p-1.5 ${isNight ? 'bg-black/25' : 'bg-slate-200/60'}`}>
            {['SD', 'SMP', 'SMA'].map((level) => (
              <button key={level} onClick={() => setActiveTab(level)} className={`relative flex flex-col items-center gap-1 rounded-xl py-2.5 transition ${activeTab === level ? 'text-white' : `${muted} hover:bg-white/10`}`}>
                {activeTab === level && <motion.div layoutId="activeLevel" className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg" />}
                <span className="relative z-10 text-xs font-extrabold">{level}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 py-3">
          <div className={`flex items-center gap-2 rounded-2xl border px-3 ${isNight ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white/70'}`}>
            <Search size={17} className={muted} />
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Cari wilayah..." className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none" />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4">
          <div className="space-y-2">
            {filteredCities.map((city, index) => {
              const active = selectedCity?.id === city.id;
              return (
                <motion.button key={city.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} onClick={() => selectLocation(city)} className={`group relative flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition-all ${active ? (isNight ? 'border-emerald-400/40 bg-emerald-400/10' : 'border-emerald-300 bg-emerald-50') : (isNight ? 'border-transparent hover:bg-white/5' : 'border-transparent hover:bg-white/60')}`}>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm" style={{ backgroundColor: `${city.warna || '#10b981'}22`, color: city.warna || '#10b981' }}><MapPinned size={20} /></div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-bold">{city.nama}</h3>
                    <p className={`mt-1 truncate text-[11px] ${muted}`}>{city.pulau || city.geografi || 'Wilayah'}</p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT (PETA) */}
      <main className="relative z-10 flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="relative z-30 flex items-center justify-between gap-3 px-4 py-4 md:px-7 md:py-5">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className={`rounded-2xl border p-3 shadow-sm backdrop-blur-xl md:hidden ${surface}`}><Menu size={20} /></button>
            <div>
              <div className={`mb-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] ${muted}`}><Compass size={13} className="text-emerald-500" /> Ruang eksplorasi</div>
              <h2 className={'truncate text-lg font-black tracking-tight md:text-2xl'}>Jelajahi Bumi</h2>
            </div>
          </div>
          <button onClick={() => setTheme(isNight ? 'day' : 'night')} className={`flex h-11 w-11 items-center justify-center rounded-2xl border shadow-lg backdrop-blur-xl ${surface}`}>
            {isNight ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-indigo-500" />}
          </button>
        </header>

        <div className="relative min-h-0 flex-1 overflow-hidden px-3 pb-3 md:px-5 md:pb-5">
          <div className={`absolute inset-3 overflow-hidden rounded-[28px] border shadow-2xl md:inset-x-5 md:inset-y-0 md:rounded-[32px] ${isNight ? 'border-white/10 bg-slate-900/40' : 'border-white/70 bg-white/20'}`}>
            <div className="absolute inset-0 z-0"><LeafletMap locations={cities} selectedLocation={selectedCity} onSelectLocation={selectLocation} isNight={isNight} /></div>
            <div className="pointer-events-none absolute inset-0 z-[2] rounded-[inherit] ring-1 ring-inset ring-white/10" />

            {/* ==================================================== */}
            {/* KARTU AJAKAN BELAJAR (MULAI DARI ACEH) */}
            {/* ==================================================== */}
            <AnimatePresence>
              {!selectedCity && firstCity && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-10"
                >
                  <div className={`relative overflow-hidden rounded-3xl border p-5 shadow-2xl backdrop-blur-xl ${
                    isNight ? 'border-white/10 bg-slate-900/80 text-white' : 'border-white bg-white/90 text-slate-800'
                  }`}>
                    {/* Ornamen Latar */}
                    <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-emerald-500/10 blur-xl"></div>
                    
                    <div className="mb-3 flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg">
                        <Sparkles size={16} />
                      </span>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-500">Panduan Pemula</span>
                    </div>

                    <h3 className="text-lg font-black leading-tight mb-2">
                      Mulai belajar dari {firstCity.nama}?
                    </h3>
                    <p className={`text-xs mb-4 leading-relaxed ${muted}`}>
                      Klik tombol di bawah untuk langsung membuka materi geografi {firstCity.nama}.
                    </p>

                    <button
                      onClick={() => selectLocation(firstCity)}
                      className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition-transform hover:scale-[1.02] active:scale-95"
                    >
                      Mulai Belajar Sekarang
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </button>
                    
                    <p className={`mt-3 text-center text-[10px] ${muted}`}>
                      Atau klik penanda (pin) lain di peta.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

        {/* ======================================================== */}
        {/* PANEL MATERI (BOTTOM SHEET) */}
        {/* ======================================================== */}
        <AnimatePresence>
          {selectedCity && (
            <motion.section
              key={`${activeTab}-${selectedCity.id}`}
              drag="y"
              dragControls={dragControls}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0.1, bottom: 0.8 }}
              onDragEnd={(event, info) => {
                if (info.offset.y > 100) setSheetHeight('20dvh');
                else if (info.offset.y < -50) setSheetHeight('85dvh');
              }}
              initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1, height: sheetHeight }} exit={{ y: '100%', opacity: 0 }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`absolute bottom-0 left-0 right-0 z-40 flex flex-col overflow-hidden rounded-t-[32px] border-t shadow-2xl md:bottom-4 md:left-auto md:right-6 md:top-4 md:w-[400px] md:rounded-[28px] md:border md:!h-auto ${isNight ? 'border-slate-700 bg-[#0b1626] text-slate-100' : 'border-white bg-white text-slate-800'}`}
            >
              <div className="flex w-full cursor-grab active:cursor-grabbing justify-center py-3 md:hidden" onPointerDown={(e) => dragControls.start(e)} onClick={() => setSheetHeight(sheetHeight === '20dvh' ? '85dvh' : '20dvh')}>
                <div className={`h-1.5 w-12 rounded-full ${isNight ? 'bg-slate-700' : 'bg-slate-300'}`} />
              </div>

              <div className={`relative shrink-0 overflow-hidden border-b p-5 ${isNight ? 'border-slate-700 bg-gradient-to-br from-[#102b35] to-[#0b1626]' : 'border-slate-200 bg-gradient-to-br from-white to-emerald-50'}`}>
                <div className="relative flex items-start justify-between gap-3">
                  <div>
                    <div className="mb-2 flex items-center gap-2"><span className="rounded-full bg-emerald-500/15 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-500">Materi {activeTab}</span></div>
                    <h2 className="text-2xl font-black leading-tight md:text-3xl">{selectedCity.nama}</h2>
                    <p className={`mt-2 text-xs ${muted}`}>{selectedCity.pulau || 'Karakteristik wilayah'}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button onClick={() => setSelectedCity(null)} className={`shrink-0 rounded-xl border p-2 md:block hidden ${isNight ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}><X size={18} /></button>
                    {cities.length > 1 && (
                      <button onClick={selectNextLocation} className="inline-flex items-center gap-1 rounded-xl bg-emerald-500 px-3 py-2 text-[11px] font-extrabold text-white shadow-sm hover:bg-emerald-600 transition-transform hover:translate-x-1">
                        Berikutnya <ArrowRight size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div ref={contentRef} onScroll={handleScroll} className="relative flex-1 overflow-y-auto p-5 space-y-6" style={{ scrollbarWidth: 'thin' }}>
                <AnimatePresence>
                  {!hasScrolled && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, y: [0, -10, 0] }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 2, repeat: Infinity }} className="absolute top-2 left-1/2 -translate-x-1/2 pointer-events-none flex flex-col items-center z-10">
                      <ChevronUp size={20} className="text-emerald-500" />
                      <span className="text-[10px] font-bold text-emerald-500 bg-white/80 px-2 py-0.5 rounded-full backdrop-blur-sm">Geser untuk baca</span>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="h-8" />

                <div className="relative overflow-hidden rounded-2xl group">
                  <img src={selectedCity.gambar} alt={selectedCity.nama} className="h-40 w-full object-cover sm:h-48 transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 text-white">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/80">Jelajah Nusantara</p>
                    <h3 className="text-lg font-black">{selectedCity.nama}</h3>
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center gap-2"><BookOpen size={17} className="text-emerald-500" /><h3 className="text-sm font-extrabold">Tentang wilayah ini</h3></div>
                  <p className={`text-sm leading-relaxed ${muted}`}>{selectedCity.deskripsi}</p>
                </div>

                <div className={`rounded-2xl border p-4 ${isNight ? 'border-slate-700 bg-[#111e30]' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="mb-2 flex items-center gap-2"><Mountain size={18} className="text-teal-500" /><h3 className="text-sm font-extrabold">Geografi</h3></div>
                  <p className={`text-sm leading-relaxed mb-3 ${muted}`}>{selectedCity.geografi}</p>
                  <div className={`flex items-center gap-2 border-t pt-3 ${isNight ? 'border-white/10' : 'border-slate-200'}`}>
                    <MapPinned size={15} className="text-emerald-500" />
                    <div>
                      <p className={`text-[10px] font-bold uppercase ${muted}`}>Koordinat</p>
                      <p className="text-xs font-bold">{selectedCity.koordinat[1]}, {selectedCity.koordinat[0]}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center gap-2"><Layers size={17} className="text-emerald-500" /><h3 className="text-sm font-extrabold">Biodiversitas</h3></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className={`rounded-2xl border p-3 ${isNight ? 'border-emerald-400/20 bg-[#102a2b]' : 'border-emerald-100 bg-emerald-50'}`}>
                      <Leaf size={18} className="text-emerald-500 mb-2" />
                      <h4 className="text-xs font-extrabold text-emerald-500 mb-1">Flora</h4>
                      <p className={`text-xs ${muted}`}>{selectedCity.flora}</p>
                    </div>
                    <div className={`rounded-2xl border p-3 ${isNight ? 'border-orange-400/20 bg-[#2b2118]' : 'border-orange-100 bg-orange-50'}`}>
                      <Bird size={18} className="text-orange-500 mb-2" />
                      <h4 className="text-xs font-extrabold text-orange-500 mb-1">Fauna</h4>
                      <p className={`text-xs ${muted}`}>{selectedCity.fauna}</p>
                    </div>
                  </div>
                </div>

                {sourceUrl && (
                  <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 rounded-xl border p-3 transition ${isNight ? 'border-white/10 hover:bg-white/5' : 'border-slate-200 hover:bg-emerald-50'}`}>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-500"><ExternalLink size={19} /></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-extrabold">Sumber Referensi</p>
                      <p className={`mt-1 truncate text-[10px] ${muted}`}>{sourceUrl}</p>
                    </div>
                    <ChevronRight size={17} className="text-emerald-500" />
                  </a>
                )}
                <div className="h-10" />
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
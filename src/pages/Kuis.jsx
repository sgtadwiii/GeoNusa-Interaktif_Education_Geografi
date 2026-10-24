import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, CheckCircle2, XCircle, Trophy, RotateCcw, 
  Sparkles, Brain, ChevronRight, Home, Sun, Moon, 
  Star, Target, ShieldCheck
} from 'lucide-react';
import kuisData from '../data/kuisSD.json';

// --- FUNGSI ACAK SOAL ---
const shuffleArray = (items) => {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function Kuis() {
  // 1. STATE TEMA (SIANG/MALAM)
  const [isNight, setIsNight] = useState(() => {
    try {
      return localStorage.getItem('geonusa-theme') === 'night';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('geonusa-theme', isNight ? 'night' : 'day');
    } catch {}
  }, [isNight]);

  // 2. STATE KUIS
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  // Inisialisasi soal
  useEffect(() => {
    const data = Array.isArray(kuisData?.kuis) ? kuisData.kuis : [];
    setQuestions(shuffleArray(data).map(q => ({ ...q, opsi: shuffleArray(q.opsi) })));
  }, []);

  const question = questions[currentQuestion];
  const totalQuestions = questions.length;

  // 3. LOGIKA MENJAWAB
  const handleAnswer = (option) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);
    if (option === question.jawaban) setScore(prev => prev + 1);
  };

  const nextQuestion = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const restartQuiz = () => {
    setQuestions(shuffleArray(kuisData.kuis).map(q => ({ ...q, opsi: shuffleArray(q.opsi) })));
    setCurrentQuestion(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowResult(false);
  };

  // Hitung persentase
  const percentage = totalQuestions ? Math.round((score / totalQuestions) * 100) : 0;

  return (
    <main className={`relative min-h-screen font-sans overflow-hidden transition-colors duration-700 ${
      isNight ? 'bg-slate-950 text-white' : 'bg-sky-50 text-slate-800'
    }`}>
      
      {/* BACKGROUND DINAMIS (Sama seperti Home) */}
      <div 
        className="absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat opacity-40 transition-all duration-700"
        style={{ 
          backgroundImage: `url(${import.meta.env.BASE_URL}images/${isNight ? 'geonusamalam.png' : 'geonusasiang.png'})` 
        }}
      />
      <div className={`absolute inset-0 -z-10 transition-colors duration-700 ${
        isNight ? 'bg-gradient-to-b from-slate-950/80 to-slate-950/95' : 'bg-gradient-to-b from-white/60 to-sky-50/90'
      }`} />

      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b backdrop-blur-md transition-colors duration-500 border-white/20 bg-white/40 dark:bg-slate-900/40">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg hover:text-rose-600 transition">
            <div className="p-2 bg-rose-100 text-rose-600 rounded-xl"><ArrowLeft size={20} /></div>
            <span className="hidden sm:inline">Kembali</span>
          </Link>
          
          <div className="flex items-center gap-3">
            {/* Skor Sementara */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold shadow-sm ${
              isNight ? 'bg-slate-800 text-amber-400' : 'bg-white text-emerald-600'
            }`}>
              <Star size={18} className="fill-current" />
              <span>{score} Poin</span>
            </div>

            {/* Toggle Tema */}
            <button 
              onClick={() => setIsNight(!isNight)}
              className={`p-2.5 rounded-full shadow-md transition-transform hover:scale-110 ${
                isNight ? 'bg-slate-800 text-amber-300' : 'bg-white text-orange-500'
              }`}
            >
              {isNight ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* KONTEN UTAMA */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-80px)] max-w-4xl flex-col justify-center px-4 py-8 sm:px-6">
        
        <AnimatePresence mode="wait">
          
          {/* ================= SCREEN 1: SOAL KUIS ================= */}
          {!showResult && totalQuestions > 0 && question && (
            <motion.div
              key="quiz-screen"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              className="w-full max-w-2xl mx-auto"
            >
              {/* Indikator Progress */}
              <div className="mb-6 flex items-center justify-between text-sm font-bold">
                <span className={isNight ? 'text-slate-400' : 'text-slate-500'}>
                  Soal {currentQuestion + 1} dari {totalQuestions}
                </span>
                <span className={isNight ? 'text-emerald-400' : 'text-emerald-600'}>
                  {Math.round(((currentQuestion) / totalQuestions) * 100)}% Selesai
                </span>
              </div>
              <div className="mb-8 h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                <motion.div 
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestion) / totalQuestions) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              {/* KARTU SOAL */}
              <div className={`overflow-hidden rounded-[32px] border-2 shadow-2xl transition-colors duration-500 ${
                isNight ? 'border-slate-700 bg-slate-900/90' : 'border-white bg-white/90'
              }`}>
                
                {/* Bagian Atas Kartu (Pertanyaan) */}
                <div className={`relative p-6 sm:p-8 ${
                  isNight ? 'bg-gradient-to-br from-slate-800 to-slate-900' : 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
                }`}>
                  <motion.div 
                    animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }} 
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute right-6 top-6 opacity-30"
                  >
                    <Brain size={80} />
                  </motion.div>
                  
                  <div className="relative z-10">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-bold mb-4 backdrop-blur-sm">
                      <Target size={14} /> Pilihan Ganda
                    </span>
                    <h2 className="text-xl font-bold leading-snug sm:text-2xl">
                      {question.pertanyaan}
                    </h2>
                  </div>
                </div>

                {/* Bagian Bawah Kartu (Pilihan) */}
                <div className="p-4 sm:p-6 space-y-3">
                  {question.opsi.map((opsi, index) => {
                    const isSelected = selectedOption === opsi;
                    const isCorrect = opsi === question.jawaban;
                    
                    // Logika Warna Pilihan
                    let btnStyle = isNight 
                      ? 'border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-emerald-500' 
                      : 'border-slate-200 bg-white hover:bg-emerald-50 hover:border-emerald-400';

                    if (isAnswered) {
                      if (isCorrect) btnStyle = 'border-emerald-500 bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 scale-[1.02] shadow-lg shadow-emerald-500/20';
                      else if (isSelected) btnStyle = 'border-rose-500 bg-rose-500/20 text-rose-600 dark:text-rose-400 animate-shake';
                      else btnStyle = isNight ? 'border-slate-800 bg-slate-900 opacity-50' : 'border-slate-200 bg-slate-50 opacity-50';
                    }

                    return (
                      <motion.button
                        key={index}
                        whileHover={!isAnswered ? { scale: 1.01 } : {}}
                        whileTap={!isAnswered ? { scale: 0.98 } : {}}
                        onClick={() => handleAnswer(opsi)}
                        disabled={isAnswered}
                        className={`flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left font-semibold transition-all duration-300 ${btnStyle}`}
                      >
                        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                          isAnswered && isCorrect ? 'bg-emerald-500 text-white' :
                          isAnswered && isSelected ? 'bg-rose-500 text-white' :
                          isNight ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="flex-1 text-sm sm:text-base">{opsi}</span>
                        
                        {isAnswered && isCorrect && <CheckCircle2 className="text-emerald-500" />}
                        {isAnswered && isSelected && !isCorrect && <XCircle className="text-rose-500" />}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* TOMBOL NEXT (Muncul saat dijawab) */}
              <AnimatePresence>
                {isAnswered && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="mt-6 flex justify-end"
                  >
                    <button
                      onClick={nextQuestion}
                      className="group flex items-center gap-2 rounded-full bg-rose-600 px-8 py-4 font-bold text-white shadow-xl shadow-rose-600/30 transition-all hover:bg-rose-700 hover:scale-105"
                    >
                      {currentQuestion === totalQuestions - 1 ? 'Lihat Hasil' : 'Soal Selanjutnya'}
                      <ChevronRight size={20} className="transition-transform group-hover:translate-x-1" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ================= SCREEN 2: HASIL AKHIR ================= */}
          {showResult && (
            <motion.div
              key="result-screen"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className={`w-full max-w-md mx-auto rounded-[32px] border-2 p-8 text-center shadow-2xl ${
                isNight ? 'border-slate-700 bg-slate-900' : 'border-white bg-white'
              }`}
            >
              <motion.div 
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }} 
                transition={{ duration: 2, repeat: Infinity }}
                className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-orange-500 shadow-lg shadow-orange-500/40 text-white"
              >
                <Trophy size={56} />
              </motion.div>

              <h2 className="text-3xl font-extrabold mb-2">Kuis Selesai!</h2>
              <p className={isNight ? 'text-slate-400' : 'text-slate-500'}>
                {percentage >= 80 ? 'Luar biasa! Kamu jenius geografi!' : 
                 percentage >= 60 ? 'Kerja bagus! Sedikit lagi sempurna!' : 
                 'Jangan menyerah, coba lagi ya!'}
              </p>

              {/* Skor Box */}
              <div className={`my-8 rounded-2xl p-6 ${isNight ? 'bg-slate-800' : 'bg-slate-50'}`}>
                <p className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-1">Skor Akhir</p>
                <div className="text-5xl font-black text-emerald-500 mb-2">{percentage}%</div>
                <p className={`text-sm font-medium ${isNight ? 'text-slate-300' : 'text-slate-600'}`}>
                  Benar {score} dari {totalQuestions} soal
                </p>
              </div>

              {/* Tombol Aksi */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={restartQuiz}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 py-4 font-bold text-white transition hover:bg-rose-700"
                >
                  <RotateCcw size={18} /> Main Lagi
                </button>
                <Link
                  to="/dashboard"
                  className={`flex w-full items-center justify-center gap-2 rounded-xl border-2 py-4 font-bold transition hover:-translate-y-0.5 ${
                    isNight ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Home size={18} /> Kembali ke Peta
                </Link>
              </div>
            </motion.div>
          )}

          {/* Jika data kosong */}
          {totalQuestions === 0 && (
            <div className="text-center">Memuat soal...</div>
          )}

        </AnimatePresence>
      </div>
    </main>
  );
}
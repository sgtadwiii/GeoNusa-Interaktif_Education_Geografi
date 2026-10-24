import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Timer, Trophy, CheckCircle2, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

// Data Kuis Budaya (Bisa kamu tambah sendiri)
const KUIS_BUDAYA = [
  {
    id: 1,
    provinsi: 'Sumatera Barat',
    soal: 'Rumah adat dengan atap menyerupai tanduk kerbau ini berasal dari provinsi mana?',
    gambar: '🏠', // Bisa diganti dengan URL gambar asli jika ada
    pilihan: ['Sumatera Barat', 'Sumatera Utara', 'Aceh', 'Riau'],
    jawaban: 'Sumatera Barat',
    penjelasan: 'Rumah Gadang adalah rumah adat Minangkabau, Sumatera Barat. Atapnya melengkung menyerupai tanduk kerbau (Gonjong).'
  },
  {
    id: 2,
    provinsi: 'Bali',
    soal: 'Tarian sakral yang menceritakan pertempuran antara Barong dan Rangda berasal dari daerah mana?',
    gambar: '💃',
    pilihan: ['Bali', 'Jawa Tengah', 'Jawa Timur', 'Nusa Tenggara Barat'],
    jawaban: 'Bali',
    penjelasan: 'Tari Barong berasal dari Bali. Tarian ini melambangkan pertempuran abadi antara kebaikan (Barong) dan kejahatan (Rangda).'
  },
  {
    id: 3,
    provinsi: 'Papua',
    soal: 'Alat musik tiup tradisional yang terbuat dari kulit kerang dan sering dimainkan di Papua adalah...',
    gambar: '🐚',
    pilihan: ['Angklung', 'Tifa', 'Sasando', 'Kolintang'],
    jawaban: 'Tifa',
    penjelasan: 'Tifa adalah alat musik khas Papua dan Maluku yang terbuat dari kayu dan kulit hewan (bukan kerang, tapi Soal ini menguji pengetahuan alat musik timur).'
  },
  {
    id: 4,
    provinsi: 'Jawa Tengah',
    soal: 'Candi Borobudur, yang merupakan candi Buddha terbesar di dunia, terletak di provinsi...',
    gambar: '🛕',
    pilihan: ['Jawa Timur', 'DI Yogyakarta', 'Jawa Tengah', 'Banten'],
    jawaban: 'Jawa Tengah',
    penjelasan: 'Candi Borobudur secara administratif terletak di Kabupaten Magelang, Jawa Tengah.'
  },
  {
    id: 5,
    provinsi: 'Nusa Tenggara Timur',
    soal: 'Tarian yang sangat terkenal dengan para penari pria yang mengenakan selendang dan menirukan gerakan burung adalah...',
    gambar: '🦅',
    pilihan: ['Tari Kecak', 'Tari Saman', 'Tari Piring', 'Tari Cakalele'],
    jawaban: 'Tari Saman',
    penjelasan: 'Tari Saman berasal dari suku Gayo, Aceh. (Namun tarian ini sering ditampilkan di banyak acara Nusantara).'
  }
];

const TIME_PER_QUESTION = 20;
const TOTAL_QUESTIONS = KUIS_BUDAYA.length;

export default function GameBudaya() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('idle'); // idle | playing | gameover | win
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // Timer Logic
  useEffect(() => {
    if (status !== 'playing' || selectedAnswer) return;
    if (timeLeft <= 0) {
      handleAnswer(null); // Waktu habis
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, status, selectedAnswer]);

  const currentQuestion = KUIS_BUDAYA[questionIndex];

  const handleAnswer = (answer) => {
    if (selectedAnswer) return; // Mencegah klik ganda
    setSelectedAnswer(answer);

    const isCorrect = answer === currentQuestion.jawaban;
    
    if (isCorrect) {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      setScore((s) => s + 100 + timeLeft * 5);
    } else {
      setLives((l) => l - 1);
    }

    setTimeout(() => {
      setSelectedAnswer(null);
      if (!isCorrect && lives - 1 <= 0) {
        setStatus('gameover');
      } else if (questionIndex + 1 >= TOTAL_QUESTIONS) {
        setStatus('win');
        confetti({ particleCount: 300, spread: 100, origin: { y: 0.5 } });
      } else {
        setQuestionIndex((i) => i + 1);
        setTimeLeft(TIME_PER_QUESTION);
      }
    }, 2500); // Waktu untuk membaca penjelasan
  };

  const resetGame = () => {
    setStatus('playing');
    setScore(0);
    setLives(3);
    setQuestionIndex(0);
    setTimeLeft(TIME_PER_QUESTION);
    setSelectedAnswer(null);
  };

  return (
    <div className="min-h-[100dvh] w-full bg-gradient-to-br from-[#1e1b4b] via-slate-950 to-[#2e1065] relative overflow-hidden flex flex-col font-sans">
      
      {/* HEADER HUD */}
      <div className="relative z-20 flex items-center justify-between p-4 bg-slate-950/50 backdrop-blur-xl border-b border-white/10">
        <button onClick={() => navigate('/game')} className="flex items-center gap-2 text-white/80 hover:text-white transition">
          <ArrowLeft size={20} /> <span className="text-sm font-bold hidden sm:inline">Kembali</span>
        </button>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-red-500/20 px-3 py-1.5 rounded-full border border-red-500/40">
            {[...Array(3)].map((_, i) => (
              <Heart key={i} size={18} className={i < lives ? 'text-red-500 fill-red-500' : 'text-slate-600'} />
            ))}
          </div>
          <div className="flex items-center gap-2 bg-amber-500/20 px-3 py-1.5 rounded-full border border-amber-500/40">
            <Trophy size={18} className="text-amber-400" />
            <span className="font-bold text-white">{score}</span>
          </div>
        </div>
      </div>

      {/* MAIN GAME AREA */}
      <div className="relative flex-1 flex flex-col items-center justify-center p-4 sm:p-6 overflow-y-auto">
        
        {/* START SCREEN */}
        <AnimatePresence>
          {status === 'idle' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="absolute inset-0 z-40 flex items-center justify-center bg-slate-950/80 backdrop-blur-md px-6">
              <div className="text-center max-w-md">
                <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="text-8xl mb-6">
                  🏛️
                </motion.div>
                <h1 className="text-4xl font-black text-white mb-3">Tebak Budaya</h1>
                <p className="text-slate-300 mb-8 leading-relaxed">
                  Seberapa kenal kamu dengan kekayaan budaya Indonesia?<br/>
                  <span className="text-amber-400 font-bold">{TOTAL_QUESTIONS} Soal · 3 Nyawa · {TIME_PER_QUESTION}s per soal</span>
                </p>
                <button onClick={resetGame} className="bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold px-10 py-4 rounded-2xl shadow-2xl shadow-amber-500/30 hover:scale-105 transition w-full sm:w-auto">
                  🚀 Mulai Kuis
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* GAMEPLAY */}
        {status === 'playing' && currentQuestion && (
          <div className="w-full max-w-2xl mx-auto z-10">
            {/* Timer & Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Soal {questionIndex + 1}/{TOTAL_QUESTIONS}</span>
                <div className="flex items-center gap-1 text-white bg-slate-800/80 px-2 py-1 rounded-md">
                  <Timer size={14} className={timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-amber-400'} />
                  <span className={`text-sm font-bold ${timeLeft <= 5 ? 'text-red-500' : ''}`}>{timeLeft}s</span>
                </div>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${timeLeft <= 5 ? 'bg-red-500' : 'bg-amber-500'}`}
                  animate={{ width: `${(timeLeft / TIME_PER_QUESTION) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Kartu Soal */}
            <motion.div 
              key={questionIndex}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl mb-6"
            >
              <div className="text-6xl text-center mb-6 drop-shadow-lg">{currentQuestion.gambar}</div>
              <h2 className="text-xl sm:text-2xl font-bold text-white text-center leading-snug mb-8">
                {currentQuestion.soal}
              </h2>

              {/* Pilihan Ganda */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQuestion.pilihan.map((pilihan, idx) => {
                  const isSelected = selectedAnswer === pilihan;
                  const isCorrectAnswer = pilihan === currentQuestion.jawaban;
                  
                  let btnClass = "bg-slate-800/80 border-slate-700 text-white hover:bg-slate-700 hover:border-slate-500";
                  
                  if (selectedAnswer) {
                    if (isCorrectAnswer) {
                      btnClass = "bg-emerald-500/20 border-emerald-500 text-emerald-400";
                    } else if (isSelected && !isCorrectAnswer) {
                      btnClass = "bg-red-500/20 border-red-500 text-red-400";
                    } else {
                      btnClass = "bg-slate-800/50 border-slate-800 text-slate-500 opacity-50";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(pilihan)}
                      disabled={!!selectedAnswer}
                      className={`relative flex items-center justify-between p-4 rounded-xl border-2 transition-all font-bold text-sm sm:text-base ${btnClass}`}
                    >
                      <span>{pilihan}</span>
                      {selectedAnswer && isCorrectAnswer && <CheckCircle2 size={20} className="text-emerald-400" />}
                      {selectedAnswer && isSelected && !isCorrectAnswer && <XCircle size={20} className="text-red-400" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Penjelasan (Muncul setelah menjawab) */}
            <AnimatePresence>
              {selectedAnswer && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`p-4 rounded-2xl border ${selectedAnswer === currentQuestion.jawaban ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}
                >
                  <p className={`text-sm font-bold mb-1 ${selectedAnswer === currentQuestion.jawaban ? 'text-emerald-400' : 'text-red-400'}`}>
                    {selectedAnswer === currentQuestion.jawaban ? 'Jawaban Benar! 🎉' : 'Jawaban Salah 😅'}
                  </p>
                  <p className="text-slate-300 text-sm leading-relaxed">{currentQuestion.penjelasan}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* GAME OVER / WIN SCREEN */}
        <AnimatePresence>
          {(status === 'gameover' || status === 'win') && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 z-40 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
              <div className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-8 max-w-md w-full text-center shadow-[0_0_50px_rgba(245,158,11,0.2)]">
                <div className="text-6xl mb-4">{status === 'win' ? '🏆' : '💀'}</div>
                <h2 className="text-3xl font-black text-white mb-2">
                  {status === 'win' ? 'Luar Biasa!' : 'Nyawa Habis'}
                </h2>
                <p className="text-slate-400 mb-6">
                  {status === 'win' ? 'Kamu sangat mengenal budaya Indonesia!' : 'Jangan menyerah, coba lagi!'}
                </p>
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 mb-6">
                  <p className="text-xs text-amber-400 uppercase font-bold tracking-widest">Skor Akhir</p>
                  <p className="text-5xl font-black text-amber-400">{score}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={resetGame} className="flex-1 bg-amber-500 text-white font-bold py-3 rounded-xl hover:bg-amber-600 transition">
                    Main Lagi
                  </button>
                  <button onClick={() => navigate('/game')} className="flex-1 bg-slate-700 text-white font-bold py-3 rounded-xl hover:bg-slate-600 transition">
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
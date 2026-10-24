import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Timer, Trophy, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import LeafletGameMap from '../components/game/LeafletGameMap';
import materiData from '../data/materi.json';

const TOTAL_QUESTIONS = 10;
const TIME_PER_QUESTION = 15;

export default function GamePetaButa() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('idle'); // idle | playing | gameover | win
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong' | null

  // Ambil 10 provinsi acak dari materi SD
  const questions = useMemo(() => {
    if (status === 'idle') return [];
    const all = [...materiData.SD].sort(() => Math.random() - 0.5);
    return all.slice(0, TOTAL_QUESTIONS);
  }, [status]);

  const currentQuestion = questions[questionIndex];

  // Timer
  useEffect(() => {
    if (status !== 'playing') return;
    if (timeLeft <= 0) {
      handleWrong(null);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, status]);

  const handleCorrect = () => {
    setFeedback('correct');
    setScore((s) => s + 100 + timeLeft * 5);
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    setTimeout(() => {
      setFeedback(null);
      nextQuestion();
    }, 1000);
  };

  const handleWrong = (clickedProvince) => {
    setFeedback('wrong');
    const newLives = lives - 1;
    setLives(newLives);
    setTimeout(() => {
      setFeedback(null);
      if (newLives <= 0) setStatus('gameover');
      else nextQuestion();
    }, 1200);
  };

  const nextQuestion = () => {
    if (questionIndex + 1 >= TOTAL_QUESTIONS) {
      setStatus('win');
      confetti({ particleCount: 300, spread: 100, origin: { y: 0.5 } });
    } else {
      setQuestionIndex((i) => i + 1);
      setTimeLeft(TIME_PER_QUESTION);
    }
  };

  const handleProvinceClick = useCallback((provinceName) => {
    if (status !== 'playing' || !currentQuestion) return;
    const cleanTarget = currentQuestion.nama.replace(/\s*\(.*?\)\s*/g, '').trim().toLowerCase();
    const cleanClicked = provinceName.toLowerCase();

    if (cleanClicked === cleanTarget || cleanClicked.includes(cleanTarget)) {
      handleCorrect();
    } else {
      handleWrong(cleanClicked);
    }
  }, [status, currentQuestion, lives]);

  const resetGame = () => {
    setStatus('playing');
    setScore(0);
    setLives(3);
    setQuestionIndex(0);
    setTimeLeft(TIME_PER_QUESTION);
    setFeedback(null);
  };

  return (
    <div className="h-[100dvh] w-full bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 relative overflow-hidden flex flex-col">
      {/* HEADER HUD */}
      <div className="relative z-20 flex items-center justify-between p-4 bg-slate-950/50 backdrop-blur-xl border-b border-white/10">
        <button onClick={() => navigate('/game')} className="flex items-center gap-2 text-white/80 hover:text-white transition">
          <ArrowLeft size={20} /> <span className="text-sm font-bold">Kembali</span>
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

      {/* MAIN AREA */}
      <div className="relative flex-1">
        {/* PETA */}
        <LeafletGameMap onProvinceClick={handleProvinceClick} status={status} />

        {/* OVERLAY FEEDBACK */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.5 }}
              className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
            >
              <div className={`text-6xl font-black ${feedback === 'correct' ? 'text-emerald-400' : 'text-red-500'} drop-shadow-2xl`}>
                {feedback === 'correct' ? 'BENAR! +' + (100 + timeLeft * 5) : 'SALAH!'}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* QUESTION BOX */}
        {status === 'playing' && currentQuestion && (
          <motion.div
            key={questionIndex}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-20 w-[90%] max-w-md"
          >
            <div className="bg-slate-900/90 backdrop-blur-xl border border-emerald-500/40 rounded-2xl p-4 shadow-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                  Soal {questionIndex + 1}/{TOTAL_QUESTIONS}
                </span>
                <div className="flex items-center gap-1 text-white">
                  <Timer size={14} className={timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-amber-400'} />
                  <span className={`text-sm font-bold ${timeLeft <= 5 ? 'text-red-500' : ''}`}>{timeLeft}s</span>
                </div>
              </div>
              <p className="text-white text-lg font-bold text-center">
                Klik Provinsi <span className="text-emerald-400">{currentQuestion.nama.replace(/\s*\(.*?\)\s*/g, '')}</span>!
              </p>
              {/* Progress bar timer */}
              <div className="mt-3 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${timeLeft <= 5 ? 'bg-red-500' : 'bg-emerald-500'}`}
                  animate={{ width: `${(timeLeft / TIME_PER_QUESTION) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* START SCREEN */}
        <AnimatePresence>
          {status === 'idle' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-40 flex items-center justify-center bg-slate-950/80 backdrop-blur-md"
            >
              <div className="text-center max-w-md px-8">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-7xl mb-6"
                >
                  🗺️
                </motion.div>
                <h1 className="text-4xl font-black text-white mb-3">Peta Buta</h1>
                <p className="text-slate-300 mb-8">
                  Temukan provinsi yang disebutkan sebelum waktu habis! <br/>
                  <span className="text-emerald-400 font-bold">{TOTAL_QUESTIONS} soal · 3 nyawa · {TIME_PER_QUESTION}s per soal</span>
                </p>
                <button
                  onClick={resetGame}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold px-10 py-4 rounded-2xl shadow-2xl shadow-emerald-500/30 hover:scale-105 transition"
                >
                  🚀 Mulai Bermain
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* GAME OVER / WIN */}
        <AnimatePresence>
          {(status === 'gameover' || status === 'win') && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-40 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4"
            >
              <div className="bg-slate-900 border-2 border-emerald-500/40 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
                <div className="text-6xl mb-4">{status === 'win' ? '🏆' : '💀'}</div>
                <h2 className="text-3xl font-black text-white mb-2">
                  {status === 'win' ? 'Selamat!' : 'Game Over'}
                </h2>
                <p className="text-slate-400 mb-6">
                  {status === 'win' ? 'Kamu berhasil menyelesaikan semua soal!' : 'Nyawa kamu habis.'}
                </p>
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 mb-6">
                  <p className="text-xs text-slate-400 uppercase font-bold">Skor Akhir</p>
                  <p className="text-5xl font-black text-emerald-400">{score}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={resetGame} className="flex-1 bg-emerald-500 text-white font-bold py-3 rounded-xl hover:bg-emerald-600 transition">
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
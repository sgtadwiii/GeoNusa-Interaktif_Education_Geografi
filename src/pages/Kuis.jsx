import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Trophy,
  RotateCcw,
  Sparkles,
  Brain,
  ChevronRight,
  GraduationCap,
  Target,
  Zap,
  Home,
  BookOpen,
  Medal,
  CircleHelp,
} from 'lucide-react';

import kuisData from '../data/kuisSD.json';

const THEME_KEY = 'geonusa-theme';

const shuffleArray = (items) => {
  const shuffled = [...items];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
};

const getQuestions = () => {
  const questions = Array.isArray(kuisData?.kuis)
    ? kuisData.kuis
    : [];

  return shuffleArray(questions).map((question) => ({
    ...question,
    opsi: shuffleArray(question.opsi ?? []),
  }));
};

const getInitialTheme = () => {
  try {
    return localStorage.getItem(THEME_KEY) === 'night'
      ? 'night'
      : 'day';
  } catch {
    return 'day';
  }
};

function OptionButton({
  option,
  index,
  selectedOption,
  correctAnswer,
  answered,
  onSelect,
}) {
  const isSelected = selectedOption === option;
  const isCorrect = option === correctAnswer;

  let style =
    'border-slate-200 bg-white hover:border-emerald-400 hover:bg-emerald-50/70 dark:border-white/10 dark:bg-white/[0.035] dark:hover:border-emerald-400/50 dark:hover:bg-emerald-400/[0.06]';

  let letterStyle =
    'bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-300';

  if (answered && isCorrect) {
    style =
      'border-emerald-500 bg-emerald-50 text-emerald-800 dark:border-emerald-400 dark:bg-emerald-400/10 dark:text-emerald-200';
    letterStyle = 'bg-emerald-500 text-white';
  } else if (answered && isSelected && !isCorrect) {
    style =
      'border-rose-500 bg-rose-50 text-rose-800 dark:border-rose-400 dark:bg-rose-400/10 dark:text-rose-200';
    letterStyle = 'bg-rose-500 text-white';
  } else if (answered) {
    style =
      'border-slate-200 bg-slate-50/60 opacity-60 dark:border-white/5 dark:bg-white/[0.015]';
  }

  return (
    <motion.button
      type="button"
      whileHover={!answered ? { y: -2 } : undefined}
      whileTap={!answered ? { scale: 0.99 } : undefined}
      disabled={answered}
      onClick={() => onSelect(option)}
      className={`flex min-h-[62px] w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition-colors duration-200 sm:gap-4 sm:p-4 ${style}`}
    >
      <span
        className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl text-xs font-black transition-colors ${letterStyle}`}
      >
        {String.fromCharCode(65 + index)}
      </span>

      <span className="min-w-0 flex-1 text-sm font-semibold leading-6 sm:text-[15px]">
        {option}
      </span>

      {answered && isCorrect && (
        <CheckCircle2
          size={21}
          className="shrink-0 text-emerald-500"
        />
      )}

      {answered && isSelected && !isCorrect && (
        <XCircle size={21} className="shrink-0 text-rose-500" />
      )}

      {!answered && (
        <ChevronRight
          size={18}
          className="shrink-0 text-slate-300 dark:text-slate-600"
        />
      )}
    </motion.button>
  );
}

export default function Kuis() {
  const [theme, setTheme] = useState(getInitialTheme);
  const [questions, setQuestions] = useState(getQuestions);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answerHistory, setAnswerHistory] = useState([]);

  const isNight = theme === 'night';

  const question = questions[currentQuestion];
  const totalQuestions = questions.length;
  const progress = totalQuestions
    ? ((currentQuestion + (showResult ? 1 : 0)) / totalQuestions) * 100
    : 0;

  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // Tema tetap berfungsi selama sesi berjalan.
    }
  }, [theme]);

  const handleAnswer = useCallback(
    (option) => {
      if (isAnswered || !question) return;

      const correct = option === question.jawaban;

      setSelectedOption(option);
      setIsAnswered(true);
      setAnswerHistory((previous) => [
        ...previous,
        {
          pertanyaan: question.pertanyaan,
          pilihan: option,
          jawaban: question.jawaban,
          benar: correct,
        },
      ]);

      if (correct) {
        setScore((previous) => previous + 1);
      }
    },
    [isAnswered, question]
  );

  const nextQuestion = () => {
    if (!isAnswered) return;

    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion((previous) => previous + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const restartQuiz = () => {
    setQuestions(getQuestions());
    setCurrentQuestion(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowResult(false);
    setAnswerHistory([]);
  };

  const percentage = totalQuestions
    ? Math.round((score / totalQuestions) * 100)
    : 0;

  const resultMessage =
    percentage >= 80
      ? {
          title: 'Luar biasa!',
          description: 'Pemahaman geografimu sangat baik. Terus jelajahi Indonesia!',
          icon: Trophy,
        }
      : percentage >= 60
        ? {
            title: 'Kerja bagus!',
            description: 'Kamu sudah berada di jalur yang tepat. Sedikit latihan lagi!',
            icon: Medal,
          }
        : {
            title: 'Terus berlatih!',
            description: 'Tidak apa-apa, setiap jawaban adalah kesempatan untuk belajar.',
            icon: GraduationCap,
          };

  const ResultIcon = resultMessage.icon;

  return (
    <div className={isNight ? 'dark' : ''}>
      <div className="relative flex min-h-screen flex-col overflow-hidden bg-slate-50 font-sans text-slate-800 transition-colors duration-300 dark:bg-[#07101f] dark:text-slate-100">
        {/* Background dekoratif, selaras dengan dashboard */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-emerald-400/10 blur-[100px]" />
          <div className="absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-teal-400/10 blur-[100px]" />
        </div>

        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl dark:border-white/[0.08] dark:bg-[#091326]/90">
          <div className="mx-auto flex min-h-[72px] max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <Link
              to="/"
              className="group flex min-w-0 items-center gap-3"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[14px] bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-lg shadow-emerald-500/20">
                <ArrowLeft size={19} />
              </span>

              <span className="min-w-0">
                <span className="block text-sm font-black tracking-tight transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                  Kembali ke GeoNusa
                </span>
                <span className="mt-0.5 hidden text-[10px] text-slate-500 sm:block">
                  Jelajahi peta dan materi geografi
                </span>
              </span>
            </Link>

            <button
              type="button"
              onClick={() =>
                setTheme((previous) =>
                  previous === 'night' ? 'day' : 'night'
                )
              }
              aria-label={
                isNight ? 'Aktifkan mode siang' : 'Aktifkan mode malam'
              }
              className="flex h-10 shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold transition hover:border-emerald-400 dark:border-white/10 dark:bg-white/5 sm:px-4"
            >
              <span>{isNight ? '☀️' : '🌙'}</span>
              <span className="hidden sm:inline">
                {isNight ? 'Mode Siang' : 'Mode Malam'}
              </span>
            </button>
          </div>
        </header>

        <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6 sm:px-6 sm:py-9 lg:py-10">
          {/* Intro */}
          <section className="mb-7 sm:mb-9">
            <div className="relative isolate overflow-hidden rounded-[26px] bg-gradient-to-br from-[#073f49] via-[#087b70] to-[#0eb88f] p-6 text-white shadow-xl shadow-emerald-950/10 sm:p-9">
              <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full border border-white/15 shadow-[0_0_0_25px_rgba(255,255,255,0.03),0_0_0_55px_rgba(255,255,255,0.025)]" />

              <motion.div
                className="pointer-events-none absolute right-8 top-8 hidden text-white/20 sm:block"
                animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 6, repeat: Infinity }}
              >
                <Brain size={100} strokeWidth={1} />
              </motion.div>

              <div className="relative max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-black tracking-[1.5px] text-emerald-100">
                  <Sparkles size={13} />
                  RUANG LATIHAN GEOGRAFI
                </div>

                <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-[42px]">
                  Uji pemahaman,
                  <br />
                  <span className="text-emerald-200">
                    jelajahi pengetahuanmu.
                  </span>
                </h1>

                <p className="mt-3 max-w-xl text-xs leading-7 text-white/80 sm:text-sm">
                  Jawab pertanyaan seputar wilayah dan keunikan
                  Indonesia. Setiap percobaan menghadirkan urutan soal
                  yang berbeda.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-[10px] font-bold sm:text-xs">
                    <Zap size={14} /> Soal acak
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-[10px] font-bold sm:text-xs">
                    <Target size={14} /> Skor langsung
                  </span>
                </div>
              </div>
            </div>
          </section>

          {!showResult && totalQuestions > 0 && question && (
            <section className="mx-auto w-full max-w-3xl">
              {/* Progress and stats */}
              <div className="mb-4 grid grid-cols-2 gap-3 sm:mb-5 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-white/10 dark:bg-[#101b2e] sm:p-4">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <BookOpen size={16} className="text-emerald-500" />
                    <span className="text-[10px] font-bold sm:text-xs">
                      Progres soal
                    </span>
                  </div>
                  <p className="mt-2 text-lg font-black sm:text-xl">
                    {currentQuestion + 1}
                    <span className="ml-1 text-sm font-semibold text-slate-400">
                      / {totalQuestions}
                    </span>
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-white/10 dark:bg-[#101b2e] sm:p-4">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    <span className="text-[10px] font-bold sm:text-xs">
                      Jawaban benar
                    </span>
                  </div>
                  <p className="mt-2 text-lg font-black sm:text-xl">
                    {score}
                    <span className="ml-1 text-sm font-semibold text-slate-400">
                      poin
                    </span>
                  </p>
                </div>

                <div className="col-span-2 rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-white/10 dark:bg-[#101b2e] sm:col-span-1 sm:p-4">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <Sparkles size={16} className="text-amber-500" />
                    <span className="text-[10px] font-bold sm:text-xs">
                      Status
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-black">
                    {isAnswered ? 'Jawaban tersimpan' : 'Siap menjawab'}
                  </p>
                </div>
              </div>

              <div className="mb-5 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500"
                  initial={false}
                  animate={{
                    width: `${((currentQuestion + (isAnswered ? 1 : 0)) / totalQuestions) * 100}%`,
                  }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                />
              </div>

              {/* Question card */}
              <AnimatePresence mode="wait">
                <motion.article
                  key={currentQuestion}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.22 }}
                  className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-xl shadow-slate-900/[0.04] dark:border-white/10 dark:bg-[#101b2e] dark:shadow-black/10"
                >
                  <div className="relative overflow-hidden bg-gradient-to-br from-[#0b2534] via-[#0b514e] to-[#087b70] p-5 text-white sm:p-8">
                    <div className="pointer-events-none absolute -right-8 -top-12 h-40 w-40 rounded-full border border-white/10 shadow-[0_0_0_22px_rgba(255,255,255,0.025)]" />

                    <div className="relative flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-black tracking-wider text-emerald-100">
                        <CircleHelp size={14} />
                        PERTANYAAN {currentQuestion + 1}
                      </span>

                      <span className="rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-bold text-white/80">
                        {totalQuestions} soal
                      </span>
                    </div>

                    <h2 className="relative mt-5 max-w-2xl text-xl font-black leading-relaxed sm:mt-6 sm:text-2xl">
                      {question.pertanyaan}
                    </h2>

                    <p className="relative mt-3 text-xs text-white/65 sm:text-sm">
                      Pilih satu jawaban yang paling tepat.
                    </p>
                  </div>

                  <div className="space-y-3 p-4 sm:p-7">
                    {question.opsi.map((option, index) => (
                      <OptionButton
                        key={`${currentQuestion}-${option}-${index}`}
                        option={option}
                        index={index}
                        selectedOption={selectedOption}
                        correctAnswer={question.jawaban}
                        answered={isAnswered}
                        onSelect={handleAnswer}
                      />
                    ))}
                  </div>

                  <AnimatePresence>
                    {isAnswered && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 sm:px-7 sm:pb-7">
                          <div
                            className={`rounded-2xl border p-4 ${
                              selectedOption === question.jawaban
                                ? 'border-emerald-500/25 bg-emerald-500/[0.07]'
                                : 'border-rose-500/25 bg-rose-500/[0.06]'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              {selectedOption === question.jawaban ? (
                                <CheckCircle2
                                  size={21}
                                  className="mt-0.5 shrink-0 text-emerald-500"
                                />
                              ) : (
                                <XCircle
                                  size={21}
                                  className="mt-0.5 shrink-0 text-rose-500"
                                />
                              )}

                              <div className="min-w-0">
                                <p
                                  className={`text-sm font-extrabold ${
                                    selectedOption === question.jawaban
                                      ? 'text-emerald-700 dark:text-emerald-300'
                                      : 'text-rose-700 dark:text-rose-300'
                                  }`}
                                >
                                  {selectedOption === question.jawaban
                                    ? 'Tepat sekali!'
                                    : 'Belum tepat, tetap semangat!'}
                                </p>

                                {selectedOption !== question.jawaban && (
                                  <p className="mt-1 text-xs leading-6 text-slate-600 dark:text-slate-300">
                                    Jawaban yang benar:{' '}
                                    <strong>{question.jawaban}</strong>
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={nextQuestion}
                            className="mt-4 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-emerald-600/15 transition hover:brightness-105 active:scale-[0.99] sm:w-auto sm:min-w-52 sm:justify-self-end sm:ml-auto"
                          >
                            {currentQuestion === totalQuestions - 1
                              ? 'Lihat Hasil'
                              : 'Soal Selanjutnya'}
                            <ChevronRight size={18} />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.article>
              </AnimatePresence>

              <p className="mt-4 text-center text-[10px] leading-5 text-slate-500 dark:text-slate-400 sm:text-xs">
                Jawab dengan teliti. Hasil akan muncul setelah semua soal selesai.
              </p>
            </section>
          )}

          {/* Empty state */}
          {totalQuestions === 0 && (
            <div className="mx-auto w-full max-w-xl rounded-[26px] border border-slate-200 bg-white p-8 text-center dark:border-white/10 dark:bg-[#101b2e] sm:p-12">
              <CircleHelp size={42} className="mx-auto text-emerald-500" />
              <h2 className="mt-4 text-xl font-black">
                Belum ada soal kuis
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Periksa file kuisSD.json dan pastikan soal tersedia di dalam properti kuis.
              </p>
              <Link
                to="/"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-white"
              >
                <Home size={17} /> Kembali ke beranda
              </Link>
            </div>
          )}

          {/* Result */}
          <AnimatePresence>
            {showResult && (
              <motion.section
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="mx-auto w-full max-w-2xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl shadow-slate-900/[0.05] dark:border-white/10 dark:bg-[#101b2e]"
              >
                <div className="relative overflow-hidden bg-gradient-to-br from-[#073f49] via-[#087b70] to-[#0eb88f] px-6 py-9 text-center text-white sm:px-10 sm:py-12">
                  <div className="pointer-events-none absolute -right-14 -top-20 h-56 w-56 rounded-full border border-white/15 shadow-[0_0_0_25px_rgba(255,255,255,0.03)]" />

                  <motion.div
                    initial={{ scale: 0.5, rotate: -15 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: 180,
                      damping: 12,
                    }}
                    className="relative mx-auto grid h-24 w-24 place-items-center rounded-[28px] border border-white/20 bg-white/10 text-amber-200 shadow-xl backdrop-blur-sm sm:h-28 sm:w-28"
                  >
                    <ResultIcon size={49} />
                  </motion.div>

                  <p className="relative mt-5 text-[10px] font-black tracking-[2px] text-emerald-100">
                    PERJALANAN SELESAI
                  </p>
                  <h2 className="relative mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                    {resultMessage.title}
                  </h2>
                  <p className="relative mx-auto mt-3 max-w-md text-xs leading-6 text-white/80 sm:text-sm">
                    {resultMessage.description}
                  </p>
                </div>

                <div className="p-5 sm:p-8">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center dark:border-white/10 dark:bg-white/[0.03] sm:p-5">
                      <p className="text-[10px] font-bold text-slate-500 sm:text-xs">
                        Skor akhir
                      </p>
                      <p className="mt-2 text-3xl font-black text-emerald-600 dark:text-emerald-400 sm:text-4xl">
                        {percentage}%
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center dark:border-white/10 dark:bg-white/[0.03] sm:p-5">
                      <p className="text-[10px] font-bold text-slate-500 sm:text-xs">
                        Jawaban benar
                      </p>
                      <p className="mt-2 text-3xl font-black sm:text-4xl">
                        {score}
                        <span className="ml-1 text-base text-slate-400">
                          / {totalQuestions}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500"
                    />
                  </div>

                  <div className="mt-6 rounded-2xl border border-slate-200 p-4 dark:border-white/10 sm:p-5">
                    <h3 className="flex items-center gap-2 text-sm font-extrabold">
                      <BookOpen size={18} className="text-emerald-500" />
                      Ringkasan jawaban
                    </h3>

                    <div className="mt-4 max-h-72 space-y-3 overflow-y-auto pr-1">
                      {answerHistory.map((answer, index) => (
                        <div
                          key={`${index}-${answer.pertanyaan}`}
                          className="flex items-start gap-3"
                        >
                          {answer.benar ? (
                            <CheckCircle2
                              size={18}
                              className="mt-0.5 shrink-0 text-emerald-500"
                            />
                          ) : (
                            <XCircle
                              size={18}
                              className="mt-0.5 shrink-0 text-rose-500"
                            />
                          )}

                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold leading-5">
                              {index + 1}. {answer.pertanyaan}
                            </p>
                            <p className="mt-1 text-[11px] leading-5 text-slate-500 dark:text-slate-400">
                              Jawabanmu: {answer.pilihan}
                            </p>
                            {!answer.benar && (
                              <p className="mt-1 text-[11px] font-semibold leading-5 text-emerald-700 dark:text-emerald-300">
                                Jawaban benar: {answer.jawaban}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={restartQuiz}
                      className="flex min-h-[50px] items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-extrabold transition hover:border-emerald-400 hover:bg-emerald-50 dark:border-white/10 dark:bg-white/[0.03] dark:hover:bg-emerald-400/10"
                    >
                      <RotateCcw size={17} />
                      Acak & Ulangi
                    </button>

                    <Link
                      to="/"
                      className="flex min-h-[50px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-3 text-sm font-extrabold text-white shadow-lg shadow-emerald-600/15 transition hover:brightness-105"
                    >
                      <Home size={17} />
                      Kembali ke GeoNusa
                    </Link>
                  </div>
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          <footer className="mt-auto pt-9">
            <div className="flex flex-wrap items-center justify-center gap-2 border-t border-slate-200 py-5 text-[10px] text-slate-500 dark:border-white/10 sm:text-xs">
              <Sparkles size={14} className="text-emerald-500" />
              <span className="font-extrabold text-slate-700 dark:text-slate-200">
                GeoNusa
              </span>
              <span>— Belajar geografi, jelajahi negeri.</span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
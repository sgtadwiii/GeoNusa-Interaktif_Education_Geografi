import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Aset emoji PNG dari CDN
const PLANE =
  'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/2708.png';

const OWL =
  'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f989.png';

export default function HomeAnimations({ isNight }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">

      {/* PESAWAT MELINTAS */}
      {/* <motion.img
        src={PLANE}
        alt=""
        initial={{ x: '-10vw' }}
        animate={{ x: '110vw' }}
        transition={{
          duration: 22,
          repeat: Infinity,
          repeatDelay: 5,
          ease: 'linear',
        }}
        className="absolute top-[23%] left-0 w-9 sm:w-12 md:w-14"
        style={{ filter: isNight ? 'brightness(1.5)' : 'none' }}
      /> */}

      {/* EFEK KHUSUS MALAM */}
      <AnimatePresence>
        {isNight && (
          <motion.div
            key="night-effects"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            {/* BINTANG JATUH */}
            {/* {[0, 1, 2].map((star) => (
              <motion.div
                key={star}
                className="shooting-star absolute h-[2px] w-16 rounded-full"
                style={{
                  top: `${12 + star * 15}%`,
                  left: `${20 + star * 28}%`,
                  animationDelay: `${star * 2.8}s`,
                }}
              />
            ))} */}

            {/* KUNANG-KUNANG */}
            {Array.from({ length: 14 }, (_, i) => (
              <motion.div
                key={i}
                className="firefly absolute rounded-full"
                style={{
                  left: `${5 + ((i * 23) % 90)}%`,
                  top: `${48 + ((i * 17) % 45)}%`,
                  animationDelay: `${(i % 7) * 0.6}s`,
                }}
                animate={{
                  x: [0, 12, -8, 0],
                  y: [0, -14, 8, 0],
                }}
                transition={{
                  duration: 4 + (i % 3),
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}

            {/* BURUNG HANTU MELINTAS */}
            <motion.img
              src={OWL}
              alt=""
              initial={{ x: '-15vw', y: 0 }}
              animate={{
                x: '110vw',
                y: [0, -18, 5, 0],
              }}
              transition={{
                x: {
                  duration: 18,
                  repeat: Infinity,
                  repeatDelay: 12,
                  ease: 'linear',
                },
                y: {
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
              }}
              className="absolute left-0 top-[30%] w-8 sm:w-10 md:w-12"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS ANIMATIONS */}
      <style>{`
        .shooting-star {
          background: linear-gradient(
            90deg,
            transparent,
            #dbeafe,
            #ffffff
          );
          box-shadow: 0 0 8px #93c5fd;
          transform: rotate(-35deg);
          opacity: 0;
          animation: shooting 1.2s ease-out infinite;
        }

        .firefly {
          width: 5px;
          height: 5px;
          background: #fde68a;
          box-shadow:
            0 0 7px 2px #facc15,
            0 0 15px 4px rgba(250, 204, 21, 0.35);
          animation: glow 2.5s ease-in-out infinite;
        }

        @keyframes shooting {
          0%, 15% {
            opacity: 0;
            transform: translate(0, 0) rotate(-35deg);
          }
          25% {
            opacity: 1;
          }
          55% {
            opacity: 0.8;
            transform: translate(110px, 75px) rotate(-35deg);
          }
          65%, 100% {
            opacity: 0;
            transform: translate(130px, 90px) rotate(-35deg);
          }
        }

        @keyframes glow {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .shooting-star,
          .firefly {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
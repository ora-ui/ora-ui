'use client';

import * as React from 'react';
import { motion } from 'motion/react';
import { MeshGradient } from '@paper-design/shaders-react';
import { Logo } from '@/header/assets/logo';

const SPRING = { type: 'spring', duration: 0.8, bounce: 0 } as const;

const BASE_SPEED = 0.11;

const ACCENTS = ['#333333', '#485721', '#6F451C', '#005C5E', '#4A4A7B', '#743C4D'];

export default function Page() {
  const [paused, setPaused] = React.useState(false);
  const [accent, setAccent] = React.useState(0);
  const [shimmer, setShimmer] = React.useState(false);

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        setPaused((p) => !p);
      } else if (e.key === 'ArrowRight') {
        setAccent((i) => (i + 1) % ACCENTS.length);
      } else if (e.key === 'ArrowLeft') {
        setAccent((i) => (i - 1 + ACCENTS.length) % ACCENTS.length);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  React.useEffect(() => {
    const id = window.setTimeout(() => setShimmer(true), 1050);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#070707]">
      <MeshGradient
        className="absolute inset-0 h-full w-full"
        speed={paused ? 0 : BASE_SPEED}
        scale={1.65}
        distortion={0.93}
        swirl={0}
        grainMixer={0.04}
        grainOverlay={0.03}
        colors={['#070707', '#111010', ACCENTS[accent]]}
      />

      <div
        className="relative grid h-full w-full place-items-center px-6"
        style={{ ['--primary' as string]: 'rgba(255,255,255,0.7)' }}
      >
        <div className="flex items-center">
          <Logo className="h-7 w-auto shrink-0 text-white/80" />
          <motion.span
            aria-hidden
            className="flex shrink-0 items-center overflow-hidden"
            initial={{ width: 0, opacity: 0, filter: 'blur(4px)' }}
            animate={{ width: 'auto', opacity: 1, filter: 'blur(0px)' }}
            transition={{ ...SPRING, delay: 0.4 }}
          >
            <span className="mx-3 h-5 w-px bg-white/30" />
          </motion.span>
          <motion.span
            className="flex shrink-0 items-center overflow-hidden whitespace-nowrap text-xl"
            initial={{ width: 0, opacity: 0, filter: 'blur(4px)' }}
            animate={{ width: 'auto', opacity: 1, filter: 'blur(0px)' }}
            transition={{ ...SPRING, delay: 0.7 }}
          >
            <motion.span
              initial={{ x: -8 }}
              animate={{ x: 0 }}
              transition={{ ...SPRING, delay: 0.7 }}
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: shimmer
                  ? 'linear-gradient(to right, rgba(255,255,255,0.45) 40%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0.45) 60%)'
                  : 'none',
                backgroundSize: '200% auto',
                color: shimmer ? undefined : 'rgba(255,255,255,0.5)',
                animation: shimmer ? 'splash-shimmer 3.5s linear infinite' : undefined,
              }}
            >
              Launching soon
            </motion.span>
          </motion.span>
        </div>
      </div>

      <style>{`
        @keyframes splash-shimmer {
          from { background-position: 100% center; }
          to   { background-position: -100% center; }
        }
      `}</style>
    </div>
  );
}

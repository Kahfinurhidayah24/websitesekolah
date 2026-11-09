import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Logo } from './Logo';
import { SCHOOL_INFO } from '../data/schoolData';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(30);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsVisible(false);
            setTimeout(onComplete, 200);
          }, 150);
          return 100;
        }
        return prev + 25;
      });
    }, 120);

    return () => clearInterval(timer);
  }, [onComplete]);

  const handleSkip = () => {
    setIsVisible(false);
    setTimeout(onComplete, 100);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-forest-950 text-white select-none transition-opacity duration-300">
      <div className="flex flex-col items-center px-6 max-w-sm text-center">
        <Logo className="w-24 h-24 mb-4" />

        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-900/60 text-green-200 text-[11px] font-semibold mb-2">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Website Resmi & PPDB</span>
        </div>

        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white font-['Outfit']">
          {SCHOOL_INFO.name}
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Kec. Cipayung, Jakarta Timur &bull; NPSN {SCHOOL_INFO.npsn}
        </p>

        {/* Progress Bar */}
        <div className="w-56 mt-6">
          <div className="h-1.5 w-full bg-forest-800 rounded-full overflow-hidden border border-forest-700/60">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-amber-400 rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2 font-mono">
            <span>Memuat data...</span>
            <span className="text-amber-400 font-bold">{progress}%</span>
          </div>
        </div>

        <button
          onClick={handleSkip}
          className="mt-4 text-[11px] text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
        >
          Lewati
        </button>
      </div>
    </div>
  );
};

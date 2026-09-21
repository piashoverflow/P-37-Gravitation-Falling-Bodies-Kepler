import React from 'react';
import { Play, Pause, RotateCcw, Orbit, ArrowDownCircle, Compass, Scale, Info, Sparkles } from 'lucide-react';
import { SimulationMode } from '../types';

interface HeaderProps {
  mode: SimulationMode;
  setMode: (mode: SimulationMode) => void;
  isRunning: boolean;
  setIsRunning: (running: boolean | ((prev: boolean) => boolean)) => void;
  onReset: () => void;
  speed: number;
  setSpeed: (speed: number) => void;
  showMath: boolean;
  setShowMath: (show: boolean | ((prev: boolean) => boolean)) => void;
  lang: 'en' | 'bn';
  setLang: (lang: 'en' | 'bn') => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  setMode,
  isRunning,
  setIsRunning,
  onReset,
  speed,
  setSpeed,
  showMath,
  setShowMath,
  lang,
  setLang,
}) => {
  const modes = [
    {
      id: 'falling_bodies' as SimulationMode,
      labelEn: 'Falling Bodies (Galileo)',
      labelBn: 'পড়ন্ত বস্তু (গ্যালিলিও)',
      icon: ArrowDownCircle,
    },
    {
      id: 'kepler_orbits' as SimulationMode,
      labelEn: "Kepler's Planetary Laws",
      labelBn: 'কেপলারের গ্রহীয় গতি',
      icon: Orbit,
    },
    {
      id: 'gravitation_vector' as SimulationMode,
      labelEn: 'Gravitation Vector Law',
      labelBn: 'মহাকর্ষ বল ও ভেক্টর রূপ',
      icon: Compass,
    },
    {
      id: 'inertial_mass' as SimulationMode,
      labelEn: 'Inertial vs Grav. Mass',
      labelBn: 'জড় ভর বনাম মহাকর্ষীয় ভর',
      icon: Scale,
    },
  ];

  return (
    <header className="bg-slate-900/90 border-b border-cyan-500/20 backdrop-blur-md sticky top-0 z-40 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
            <Orbit className="w-6 h-6 text-white animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-bold font-mono bg-cyan-500/20 text-cyan-300 rounded border border-cyan-500/30">
                P-37
              </span>
              <h1 className="text-lg font-bold text-white tracking-wide">
                {lang === 'bn' ? 'পড়ন্ত বস্তু ও মহাকর্ষীয় বলবিদ্যা' : 'Falling Bodies & Gravitational Mechanics'}
              </h1>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              {lang === 'bn' 
                ? 'গ্যালিলিওর সূত্রাবলী • কেপলারের ৩টি সূত্র • ভেক্টর মহাকর্ষ বল • সমতুল্যতা নীতি' 
                : "Galileo's Laws • Kepler's 3 Planetary Laws • Vector Gravitation • Equivalence Principle"}
            </p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 gap-1 overflow-x-auto max-w-full">
          {modes.map((m) => {
            const Icon = m.icon;
            const active = mode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  active
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? m.labelBn : m.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Global Controls & Language Switch */}
        <div className="flex items-center gap-2">
          {/* Play/Pause */}
          <button
            onClick={() => setIsRunning((p) => !p)}
            className={`p-2 rounded-lg text-white font-medium flex items-center gap-1 transition-all ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-600 shadow-md shadow-amber-500/20'
                : 'bg-emerald-500 hover:bg-emerald-600 shadow-md shadow-emerald-500/20'
            }`}
            title={isRunning ? 'Pause' : 'Start'}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Speed Selector */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-xs">
            {[0.5, 1, 2].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-2 py-1 rounded font-mono ${
                  speed === s ? 'bg-slate-800 text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Math Derivations Toggle */}
          <button
            onClick={() => setShowMath((p) => !p)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              showMath
                ? 'bg-purple-600/30 text-purple-300 border-purple-500/50 shadow-sm shadow-purple-500/30'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-600'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>{lang === 'bn' ? 'গাণিতিক প্রমাণ' : 'Math & Theory'}</span>
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
            className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-amber-400"
          >
            {lang === 'en' ? 'বাংলা' : 'EN'}
          </button>
        </div>
      </div>
    </header>
  );
};

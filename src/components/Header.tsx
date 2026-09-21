import React from 'react';
import { PresetMode, Language, AppTheme } from '../types';
import { t } from '../utils/i18n';
import { 
  Orbit, 
  Globe, 
  BookOpen, 
  GraduationCap, 
  ArrowDownCircle, 
  Compass, 
  Layers, 
  Scale
} from 'lucide-react';

interface HeaderProps {
  language: Language;
  onToggleLanguage: () => void;
  preset: PresetMode;
  onSelectPreset: (p: PresetMode) => void;
  theme?: AppTheme;
  onOpenTheory: () => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onToggleLanguage,
  preset,
  onSelectPreset,
  onOpenTheory,
}) => {
  const tabs: { id: PresetMode; label: string; icon: React.ReactNode }[] = [
    { id: 'falling_bodies', label: t(language, 'tabFalling'), icon: <ArrowDownCircle className="w-3.5 h-3.5" /> },
    { id: 'kepler_laws', label: t(language, 'tabKepler12'), icon: <Orbit className="w-3.5 h-3.5" /> },
    { id: 'kepler_harmonic', label: t(language, 'tabKepler3'), icon: <Compass className="w-3.5 h-3.5" /> },
    { id: 'vector_gravitation', label: t(language, 'tabVectorGrav'), icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'equivalence', label: t(language, 'tabEquivalence'), icon: <Scale className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="w-full bg-white border-b border-slate-300 sticky top-0 z-40 shadow-xs">
      <div className="max-w-[1780px] mx-auto px-3 sm:px-4 py-2.5 flex flex-col xl:flex-row items-center justify-between gap-3">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-2.5 self-start xl:self-auto">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-sky-500/25 shrink-0">
            <Orbit className="w-5 h-5" />
          </div>
          <div className="flex flex-col justify-center leading-none">
            {language === 'bn' ? (
              <>
                <span className="text-[15px] font-black text-slate-950 tracking-tight leading-tight">
                  {t(language, 'brandTitle')}
                </span>
                <span className="text-[12px] font-black text-sky-700 tracking-wider uppercase leading-tight">
                  {t(language, 'brandSubtitle')}
                </span>
              </>
            ) : (
              <>
                <span className="text-[15px] font-black text-slate-950 tracking-tight leading-tight">
                  {t(language, 'brandTitle')}
                </span>
                <span className="text-[12px] font-black text-sky-700 tracking-wider uppercase leading-tight">
                  {t(language, 'brandSubtitle')}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Center: Module Tabs */}
        <nav className="flex items-center gap-1.5 p-1 bg-slate-200/90 rounded-2xl border border-slate-300 overflow-x-auto max-w-full">
          {tabs.map((tab) => {
            const isActive = preset === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectPreset(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-sky-600 text-white font-black shadow-sm shadow-sky-600/30 border border-sky-500'
                    : 'bg-white/80 hover:bg-white text-slate-800 hover:text-slate-950 font-extrabold border border-slate-300/80 shadow-2xs'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Language Toggle, Theory Button & Udvash Badge */}
        <div className="flex items-center gap-2 self-end xl:self-auto shrink-0">
          <button
            onClick={onToggleLanguage}
            className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-100 rounded-xl text-xs font-black text-slate-900 border border-slate-300 shadow-2xs transition-colors"
            title="Toggle Language (English / বাংলা)"
          >
            <Globe className="w-3.5 h-3.5 text-slate-700" />
            <span>{language === 'bn' ? 'BN' : 'EN'}</span>
          </button>

          <button
            onClick={onOpenTheory}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 rounded-xl text-xs font-black border border-indigo-300 transition-all shadow-2xs"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-700" />
            <span>{t(language, 'theoryButton')}</span>
          </button>

          {/* Udvash Branding Badge */}
          <div 
            id="udvash-top-badge"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-50 to-orange-50 hover:from-red-100 hover:to-orange-100 rounded-xl border border-red-200/90 text-red-700 text-xs font-black tracking-wide shadow-2xs transition-all"
            title="Udvash Academic & Admission Care"
          >
            <GraduationCap className="w-3.5 h-3.5 text-red-600 shrink-0" />
            <span className="font-extrabold text-[13px]">{t(language, 'udvashBadge')}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

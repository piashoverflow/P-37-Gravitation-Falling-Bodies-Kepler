import React from 'react';
import { SimulationParams, Language } from '../types';
import { t } from '../utils/i18n';
import { PLANET_DATA } from '../utils/physics';
import { 
  Sliders, 
  RotateCcw, 
  Orbit, 
  ArrowDownCircle, 
  Layers, 
  Scale, 
  Eye, 
  Compass, 
  Wind, 
  CheckSquare, 
  Square 
} from 'lucide-react';

interface ControlPanelProps {
  language: Language;
  params: SimulationParams;
  onChangeParams: (updater: (prev: SimulationParams) => SimulationParams) => void;
  onResetDefaults: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  language,
  params,
  onChangeParams,
  onResetDefaults,
}) => {
  const updateParam = <K extends keyof SimulationParams>(key: K, value: SimulationParams[K]) => {
    onChangeParams((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="w-full lg:w-72 xl:w-80 shrink-0 flex flex-col gap-3">
      {/* 1. Header Card with Reset Defaults */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3.5 flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-sky-50 text-sky-700 rounded-lg border border-sky-200">
              <Sliders className="w-4 h-4" />
            </div>
            <h2 className="text-xs font-black text-slate-800 tracking-wider uppercase">
              {t(language, 'controlParameters')}
            </h2>
          </div>

          <button
            onClick={onResetDefaults}
            className="flex items-center gap-1 text-[11px] font-bold text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 px-2.5 py-1 rounded-lg border border-sky-200 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{t(language, 'resetDefaults')}</span>
          </button>
        </div>

        {/* Tab 1: Falling Bodies */}
        {params.preset === 'falling_bodies' && (
          <div className="flex flex-col gap-3">
            {/* Medium toggle */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-slate-700">মাধ্যম নির্বাচন (Medium):</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => updateParam('vacuum', true)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    params.vacuum
                      ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  🌌 {t(language, 'vacuumMode')}
                </button>
                <button
                  onClick={() => updateParam('vacuum', false)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    !params.vacuum
                      ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  💨 {t(language, 'airResistanceMode')}
                </button>
              </div>
            </div>

            {/* Height Slider */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">{t(language, 'dropHeight')}</span>
                <span className="font-mono font-black text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                  {params.dropHeight} m
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={params.dropHeight}
                onChange={(e) => updateParam('dropHeight', parseFloat(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>

            {/* Gravity Slider */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">{t(language, 'gravityVal')}</span>
                <span className="font-mono font-black text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                  {params.gravity} m/s²
                </span>
              </div>
              <input
                type="range"
                min="1.6"
                max="25"
                step="0.1"
                value={params.gravity}
                onChange={(e) => updateParam('gravity', parseFloat(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
              <div className="flex gap-1.5 mt-1">
                <button
                  onClick={() => updateParam('gravity', 1.62)}
                  className="text-[10px] px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-bold"
                >
                  চাঁদ (1.62)
                </button>
                <button
                  onClick={() => updateParam('gravity', 9.81)}
                  className="text-[10px] px-2 py-0.5 bg-sky-100 hover:bg-sky-200 rounded text-sky-800 font-bold"
                >
                  পৃথিবী (9.81)
                </button>
                <button
                  onClick={() => updateParam('gravity', 24.79)}
                  className="text-[10px] px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-bold"
                >
                  বৃহস্পতি (24.79)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Kepler's 1st & 2nd Laws */}
        {params.preset === 'kepler_laws' && (
          <div className="flex flex-col gap-3">
            {/* Eccentricity e */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">{t(language, 'eccentricity')}</span>
                <span className="font-mono font-black text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                  e = {params.eccentricity.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="0.75"
                step="0.05"
                value={params.eccentricity}
                onChange={(e) => updateParam('eccentricity', parseFloat(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                <span>বৃত্তাকার (e=0)</span>
                <span>অধিক উপবৃত্তাকার (e=0.75)</span>
              </div>
            </div>

            {/* Semi-Major Axis a */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">{t(language, 'semiMajorAxis')}</span>
                <span className="font-mono font-black text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                  {params.semiMajorAxis} AU
                </span>
              </div>
              <input
                type="range"
                min="1.0"
                max="3.5"
                step="0.1"
                value={params.semiMajorAxis}
                onChange={(e) => updateParam('semiMajorAxis', parseFloat(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>

            {/* Central Sun Mass */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">{t(language, 'centralMass')}</span>
                <span className="font-mono font-black text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                  {params.centralMass} M☉
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.1"
                value={params.centralMass}
                onChange={(e) => updateParam('centralMass', parseFloat(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>
          </div>
        )}

        {/* Tab 3: Kepler's 3rd Law Harmonic */}
        {params.preset === 'kepler_harmonic' && (
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold text-slate-700">সৌরজগতের গ্রহ নির্বাচন:</span>
            <div className="grid grid-cols-2 gap-1.5">
              {(Object.keys(PLANET_DATA) as Array<keyof typeof PLANET_DATA>).map((key) => {
                const planet = PLANET_DATA[key];
                const isSelected = params.selectedPlanet === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      updateParam('selectedPlanet', key);
                      updateParam('semiMajorAxis', planet.a);
                      updateParam('eccentricity', planet.e);
                    }}
                    className={`px-2 py-1.5 rounded-xl text-xs font-bold border transition-all text-left flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: planet.color }} />
                    <span className="truncate">{language === 'bn' ? planet.nameBn : planet.nameEn}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col gap-1 mt-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">কাস্টম কক্ষপথের পরাক্ষ (a):</span>
                <span className="font-mono font-black text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                  {params.semiMajorAxis} AU
                </span>
              </div>
              <input
                type="range"
                min="0.3"
                max="10.0"
                step="0.1"
                value={params.semiMajorAxis}
                onChange={(e) => updateParam('semiMajorAxis', parseFloat(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>
          </div>
        )}

        {/* Tab 4: Vector Gravitation */}
        {params.preset === 'vector_gravitation' && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">{t(language, 'mass1')}</span>
                <span className="font-mono font-black text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                  {params.m1} × 10²⁴ kg
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                step="0.5"
                value={params.m1}
                onChange={(e) => updateParam('m1', parseFloat(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">{t(language, 'mass2')}</span>
                <span className="font-mono font-black text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                  {params.m2} × 10²⁴ kg
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="10"
                step="0.5"
                value={params.m2}
                onChange={(e) => updateParam('m2', parseFloat(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">{t(language, 'distanceR')}</span>
                <span className="font-mono font-black text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                  {params.distR} × 10⁶ m
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                step="1"
                value={params.distR}
                onChange={(e) => updateParam('distR', parseFloat(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>
          </div>
        )}

        {/* Tab 5: Equivalence Principle */}
        {params.preset === 'equivalence' && (
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold text-slate-700">আইনস্টাইনের লিফট অবস্থা:</span>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => updateParam('elevatorState', 'static_gravity')}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all text-left ${
                  params.elevatorState === 'static_gravity'
                    ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                🌍 ১. ভূপৃষ্ঠে স্থির লিফট (g = 9.8 m/s²)
              </button>
              <button
                onClick={() => updateParam('elevatorState', 'accelerating_rocket')}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all text-left ${
                  params.elevatorState === 'accelerating_rocket'
                    ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                🚀 ২. মহাশূন্যে ত্বরণশীল রকেট (a = {params.elevatorAcc} m/s²)
              </button>
              <button
                onClick={() => updateParam('elevatorState', 'freefall_cable_cut')}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all text-left ${
                  params.elevatorState === 'freefall_cable_cut'
                    ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                ✂️ ৩. তারছেঁড়া লিফট / মুক্ত পতন (ওজনহীনতা, W=0)
              </button>
            </div>

            {params.elevatorState === 'accelerating_rocket' && (
              <div className="flex flex-col gap-1 mt-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700">{t(language, 'elevatorAcc')}</span>
                  <span className="font-mono font-black text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                    {params.elevatorAcc} m/s²
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="0.5"
                  value={params.elevatorAcc}
                  onChange={(e) => updateParam('elevatorAcc', parseFloat(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                />
              </div>
            )}
          </div>
        )}

        {/* Visualizer Toggles */}
        <div className="border-t border-slate-200 pt-3 flex flex-col gap-2">
          <div className="text-[11px] font-black text-slate-700 tracking-wider uppercase flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-sky-600" />
            <span>{t(language, 'visualizerToggles')}</span>
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={params.showVelocityVector}
              onChange={(e) => updateParam('showVelocityVector', e.target.checked)}
              className="accent-sky-600 rounded"
            />
            <span>{t(language, 'showVectors')}</span>
          </label>

          {params.preset === 'kepler_laws' && (
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={params.showSweepSectors}
                onChange={(e) => updateParam('showSweepSectors', e.target.checked)}
                className="accent-sky-600 rounded"
              />
              <span>{t(language, 'showSweepSectors')}</span>
            </label>
          )}

          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={params.showGrid}
              onChange={(e) => updateParam('showGrid', e.target.checked)}
              className="accent-sky-600 rounded"
            />
            <span>{t(language, 'showGrid')}</span>
          </label>
        </div>
      </div>
    </div>
  );
};

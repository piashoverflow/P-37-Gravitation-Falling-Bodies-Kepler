import React from 'react';
import { SimulationMode, FallingBodyParams, KeplerParams, GravitationParams, InertialMassParams } from '../types';
import { Sliders, Settings2, Wind, Orbit, Disc } from 'lucide-react';

interface ControlDeckProps {
  mode: SimulationMode;
  fallingParams: FallingBodyParams;
  setFallingParams: React.Dispatch<React.SetStateAction<FallingBodyParams>>;
  keplerParams: KeplerParams;
  setKeplerParams: React.Dispatch<React.SetStateAction<KeplerParams>>;
  gravParams: GravitationParams;
  setGravParams: React.Dispatch<React.SetStateAction<GravitationParams>>;
  inertialParams: InertialMassParams;
  setInertialParams: React.Dispatch<React.SetStateAction<InertialMassParams>>;
  lang: 'en' | 'bn';
}

export const ControlDeck: React.FC<ControlDeckProps> = ({
  mode,
  fallingParams,
  setFallingParams,
  keplerParams,
  setKeplerParams,
  gravParams,
  setGravParams,
  inertialParams,
  setInertialParams,
  lang,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-800">
        <Sliders className="w-4 h-4 text-cyan-400" />
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
          {lang === 'bn' ? 'সিস্টেম প্যারামিটার ও কন্ট্রোল' : 'Physics Parameters & Controls'}
        </h2>
      </div>

      {/* MODE 1: FALLING BODIES CONTROLS */}
      {mode === 'falling_bodies' && (
        <div className="space-y-4 text-xs">
          <div>
            <div className="flex justify-between text-slate-300 font-medium mb-1">
              <span>{lang === 'bn' ? 'অভিকর্ষজ ত্বরণ g (m/s²)' : 'Gravity g (m/s²)'}</span>
              <span className="font-mono text-cyan-400">{fallingParams.gravity.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="1.6"
              max="25.0"
              step="0.1"
              value={fallingParams.gravity}
              onChange={(e) => setFallingParams((p) => ({ ...p, gravity: parseFloat(e.target.value) }))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
              <span>Moon (1.62)</span>
              <span>Earth (9.81)</span>
              <span>Jupiter (24.79)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-300 font-medium mb-1">
              <span>{lang === 'bn' ? 'নলের উচ্চতা (m)' : 'Tube Height (m)'}</span>
              <span className="font-mono text-cyan-400">{fallingParams.tubeHeight} m</span>
            </div>
            <input
              type="range"
              min="20"
              max="150"
              step="5"
              value={fallingParams.tubeHeight}
              onChange={(e) => setFallingParams((p) => ({ ...p, tubeHeight: parseFloat(e.target.value) }))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-300 font-medium mb-1">
              <span>{lang === 'bn' ? 'বাতাসের ঘনত্ব (kg/m³)' : 'Air Density (kg/m³)'}</span>
              <span className="font-mono text-cyan-400">{fallingParams.airDensity.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="3.0"
              step="0.1"
              value={fallingParams.airDensity}
              onChange={(e) => setFallingParams((p) => ({ ...p, airDensity: parseFloat(e.target.value) }))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-slate-300 font-medium">
              {lang === 'bn' ? 'নল ১ সম্পূর্ণ বায়ুশূন্য' : 'Evacuate Tube 1'}
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[11px] font-bold border border-emerald-500/30">
              Active Vacuum (0 atm)
            </span>
          </div>
        </div>
      )}

      {/* MODE 2: KEPLER'S ORBIT CONTROLS */}
      {mode === 'kepler_orbits' && (
        <div className="space-y-4 text-xs">
          <div>
            <div className="flex justify-between text-slate-300 font-medium mb-1">
              <span>{lang === 'bn' ? 'উৎকেন্দ্রিকতা e (Eccentricity)' : 'Orbital Eccentricity (e)'}</span>
              <span className="font-mono text-cyan-400">{keplerParams.eccentricity.toFixed(3)}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="0.85"
              step="0.01"
              value={keplerParams.eccentricity}
              onChange={(e) => setKeplerParams((p) => ({ ...p, eccentricity: parseFloat(e.target.value) }))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
              <span>Circular (e=0)</span>
              <span>Earth (0.017)</span>
              <span>Mercury (0.206)</span>
              <span>Comet (0.85)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-300 font-medium mb-1">
              <span>{lang === 'bn' ? 'অর্ধ-মুখ্য অক্ষ a (Semi-Major Axis AU)' : 'Semi-Major Axis a (AU)'}</span>
              <span className="font-mono text-cyan-400">{keplerParams.semiMajorAxis.toFixed(2)} AU</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="4.0"
              step="0.1"
              value={keplerParams.semiMajorAxis}
              onChange={(e) => setKeplerParams((p) => ({ ...p, semiMajorAxis: parseFloat(e.target.value) }))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          {/* Preset Buttons */}
          <div>
            <span className="text-slate-400 font-medium block mb-1.5">
              {lang === 'bn' ? 'বাস্তব সৌরজগৎ প্রিসেট:' : 'Solar System Presets:'}
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { name: 'Earth', e: 0.017, a: 1.0 },
                { name: 'Mercury', e: 0.206, a: 1.2 },
                { name: 'Mars', e: 0.093, a: 1.52 },
                { name: "Halley's Comet", e: 0.75, a: 2.8 },
              ].map((preset) => (
                <button
                  key={preset.name}
                  onClick={() =>
                    setKeplerParams((p) => ({
                      ...p,
                      eccentricity: preset.e,
                      semiMajorAxis: preset.a,
                    }))
                  }
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 text-[11px] font-mono text-left"
                >
                  {preset.name} (e={preset.e})
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={keplerParams.showSweepSectors}
                onChange={(e) => setKeplerParams((p) => ({ ...p, showSweepSectors: e.target.checked }))}
                className="rounded accent-cyan-500"
              />
              <span>{lang === 'bn' ? 'সমান ক্ষেত্রফল শেডিং (A₁ = A₂)' : 'Show Equal Area Sectors (2nd Law)'}</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={keplerParams.showVelocityVector}
                onChange={(e) => setKeplerParams((p) => ({ ...p, showVelocityVector: e.target.checked }))}
                className="rounded accent-cyan-500"
              />
              <span>{lang === 'bn' ? 'কক্ষীয় বেগ ভেক্টর প্রদর্শন' : 'Show Orbital Velocity Vector'}</span>
            </label>
          </div>
        </div>
      )}

      {/* MODE 3: GRAVITATION VECTOR CONTROLS */}
      {mode === 'gravitation_vector' && (
        <div className="space-y-4 text-xs">
          <div>
            <div className="flex justify-between text-slate-300 font-medium mb-1">
              <span>{lang === 'bn' ? 'ভর m₁ (× 10²² kg)' : 'Mass m₁ (× 10²² kg)'}</span>
              <span className="font-mono text-blue-400">{gravParams.m1}</span>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              step="5"
              value={gravParams.m1}
              onChange={(e) => setGravParams((p) => ({ ...p, m1: parseFloat(e.target.value) }))}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-300 font-medium mb-1">
              <span>{lang === 'bn' ? 'ভর m₂ (× 10²² kg)' : 'Mass m₂ (× 10²² kg)'}</span>
              <span className="font-mono text-emerald-400">{gravParams.m2}</span>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              step="5"
              value={gravParams.m2}
              onChange={(e) => setGravParams((p) => ({ ...p, m2: parseFloat(e.target.value) }))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="text-cyan-400 font-bold">{lang === 'bn' ? 'ইন্টারেক্টিভ ড্র্যাগ:' : 'Interactive Drag:'}</div>
            <div>
              {lang === 'bn' 
                ? 'ক্যানভাসে যেকোনো ভরকে ধরে টেনে সরালে তাৎক্ষণিকভাবে ভেক্টর কোণ ও বলের মান পরিবর্তিত হবে।'
                : 'Click & drag either mass directly on the canvas to inspect the inverse-square vector dynamics.'}
            </div>
          </div>
        </div>
      )}

      {/* MODE 4: INERTIAL MASS LAB */}
      {mode === 'inertial_mass' && (
        <div className="space-y-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 space-y-2">
            <div className="text-amber-400 font-bold">
              {lang === 'bn' ? 'সমতুল্যতা নীতি (Principle of Equivalence)' : 'Principle of Equivalence'}
            </div>
            <p className="text-slate-400 leading-relaxed">
              {lang === 'bn'
                ? 'আইনস্টাইন দেখিয়েছিলেন, একটি বদ্ধ রকেটের অভিন্ন ত্বরণ (a = 9.8 m/s²) এবং পৃথিবীর পৃষ্ঠে অবস্থিত অভিকর্ষ বলের প্রভাব স্থানীয়ভাবে সমতুল্য।'
                : "Einstein demonstrated that uniform acceleration (a = 9.8 m/s²) in deep space and uniform gravity on Earth's surface produce identical physical effects."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

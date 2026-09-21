import React, { useState } from 'react';
import { Header } from './components/Header';
import { SimulationCanvas } from './components/SimulationCanvas';
import { ControlDeck } from './components/ControlDeck';
import { MathFormulaOverlay } from './components/MathFormulaOverlay';
import { SimulationMode, FallingBodyParams, KeplerParams, GravitationParams, InertialMassParams } from './types';
import { Activity, ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  const [mode, setMode] = useState<SimulationMode>('falling_bodies');
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1);
  const [showMath, setShowMath] = useState<boolean>(false);
  const [lang, setLang] = useState<'en' | 'bn'>('bn');
  const [time, setTime] = useState<number>(0);

  // Parameters
  const [fallingParams, setFallingParams] = useState<FallingBodyParams>({
    vacuum: true,
    tubeHeight: 50,
    gravity: 9.81,
    airDensity: 1.225,
    coinMass: 0.05,
    featherMass: 0.005,
    coinArea: 0.0004,
    featherArea: 0.0025,
    coinCd: 0.5,
    featherCd: 1.8,
  });

  const [keplerParams, setKeplerParams] = useState<KeplerParams>({
    semiMajorAxis: 2.0,
    eccentricity: 0.5,
    centralMass: 1.0,
    showSweepSectors: true,
    sweepInterval: 0.5,
    showVelocityVector: true,
    showFoci: true,
    showOrbitsTrack: true,
  });

  const [gravParams, setGravParams] = useState<GravitationParams>({
    m1: 30,
    m2: 60,
    showVectorComponents: true,
    showFieldGrid: true,
    gravitationalConstant: 6.6743e-11,
  });

  const [inertialParams, setInertialParams] = useState<InertialMassParams>({
    elevatorAcc: 9.81,
    externalGravity: 9.81,
    boxState: 'rocket',
    objectMass: 2.0,
  });

  const handleReset = () => {
    setTime(0);
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      <Header
        mode={mode}
        setMode={setMode}
        isRunning={isRunning}
        setIsRunning={setIsRunning}
        onReset={handleReset}
        speed={speed}
        setSpeed={setSpeed}
        showMath={showMath}
        setShowMath={setShowMath}
        lang={lang}
        setLang={setLang}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-3 md:p-5 grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 flex flex-col items-center justify-center">
          <SimulationCanvas
            mode={mode}
            isRunning={isRunning}
            speed={speed}
            fallingParams={fallingParams}
            keplerParams={keplerParams}
            gravParams={gravParams}
            inertialParams={inertialParams}
            time={time}
            setTime={setTime}
            lang={lang}
          />
        </div>

        <div className="lg:col-span-1">
          <ControlDeck
            mode={mode}
            fallingParams={fallingParams}
            setFallingParams={setFallingParams}
            keplerParams={keplerParams}
            setKeplerParams={setKeplerParams}
            gravParams={gravParams}
            setGravParams={setGravParams}
            inertialParams={inertialParams}
            setInertialParams={setInertialParams}
            lang={lang}
          />
        </div>
      </main>

      <MathFormulaOverlay
        mode={mode}
        show={showMath}
        onClose={() => setShowMath(false)}
        lang={lang}
      />

      {/* Footer */}
      <footer className="bg-slate-950/80 border-t border-slate-900 px-4 py-2.5 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-mono text-slate-400">P-37 Gravitation & Planetary Dynamics Lab</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Developed by</span>
            <span className="font-bold text-cyan-400">Shamsuddin Piash</span>
            <span>• BUET ME '25</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

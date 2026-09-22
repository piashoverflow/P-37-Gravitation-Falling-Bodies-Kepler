import React, { useState, useEffect, useRef } from 'react';
import { Language, PresetMode, AppTheme, SimulationParams, TelemetryState } from './types';
import { Header } from './components/Header';
import { ControlPanel } from './components/ControlPanel';
import { MotionCanvas } from './components/MotionCanvas';
import { AnalyticsPanel } from './components/AnalyticsPanel';
import { TheoryModal } from './components/TheoryModal';
import { G_UNIVERSAL, solveKepler } from './utils/physics';

export default function App() {
  const [language, setLanguage] = useState<Language>('bn');
  const [theme, setTheme] = useState<AppTheme>('clean_bright');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const initialParams: SimulationParams = {
    preset: 'falling_bodies',
    theme: 'clean_bright',
    vacuum: true,
    dropHeight: 50,
    gravity: 9.81,
    airDensity: 1.225,
    coinMass: 0.05,
    featherMass: 0.005,
    coinArea: 0.0005,
    featherArea: 0.003,
    coinCd: 0.47,
    featherCd: 1.2,
    semiMajorAxis: 1.5,
    eccentricity: 0.35,
    centralMass: 1.0,
    showSweepSectors: true,
    sweepPeriodFraction: 0.1,
    showVelocityVector: true,
    showAccelerationVector: false,
    showFoci: true,
    showOrbitGrid: true,
    selectedPlanet: 'earth',
    comparisonMode: 'single',
    customA: 1.0,
    m1: 6.0,
    m2: 2.0,
    distR: 12,
    showVectorComponents: false,
    showFieldLines: false,
    showGrid: true,
    elevatorState: 'static_gravity',
    elevatorAcc: 4.0,
    testMass: 50,
    slowMo: false,
    timeScale: 1.0,
  };

  const [params, setParams] = useState<SimulationParams>(initialParams);

  // Compute Telemetry based on state
  const computeInitialTelemetry = (p: SimulationParams): TelemetryState => {
    const rMeters = p.distR * 1e6;
    const m1Kg = p.m1 * 1e24;
    const m2Kg = p.m2 * 1e24;
    const forceMag = (G_UNIVERSAL * m1Kg * m2Kg) / (rMeters * rMeters);

    let apparentW = p.testMass * p.gravity;
    if (p.elevatorState === 'freefall_cable_cut') {
      apparentW = 0;
    } else if (p.elevatorState === 'accelerating_rocket') {
      apparentW = p.testMass * (0 + p.elevatorAcc);
    }

    return {
      elapsedTime: 0,
      coinY: 0,
      coinV: 0,
      coinA: p.gravity,
      featherY: 0,
      featherV: 0,
      featherA: p.gravity,
      coinTerminalV: Math.sqrt((2 * p.coinMass * p.gravity) / (p.airDensity * p.coinCd * p.coinArea)),
      featherTerminalV: Math.sqrt((2 * p.featherMass * p.gravity) / (p.airDensity * p.featherCd * p.featherArea)),
      isLanded: false,
      orbitalR: p.semiMajorAxis * (1 - p.eccentricity),
      orbitalTheta: 0,
      orbitalV: Math.sqrt(p.centralMass * (2 / (p.semiMajorAxis * (1 - p.eccentricity)) - 1 / p.semiMajorAxis)),
      orbitalPeriod: Math.pow(p.semiMajorAxis, 1.5),
      sweptArea: 0,
      arealVelocity: 0.5,
      keplerConstant: 1.0,
      forceMagnitude: forceMag,
      f12x: forceMag,
      f12y: 0,
      apparentWeight: apparentW,
      scaleReading: apparentW / 9.81,
      effectiveG: apparentW / p.testMass,
    };
  };

  const [telemetry, setTelemetry] = useState<TelemetryState>(() => computeInitialTelemetry(initialParams));

  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Reset
  const handleReset = () => {
    setIsPlaying(false);
    lastTimeRef.current = null;
    setTelemetry(computeInitialTelemetry(params));
  };

  // Reset Defaults
  const handleResetDefaults = () => {
    setIsPlaying(false);
    lastTimeRef.current = null;
    const restored = { ...initialParams, preset: params.preset };
    setParams(restored);
    setTelemetry(computeInitialTelemetry(restored));
  };

  // Preset Selection
  const handlePresetSelect = (newPreset: PresetMode) => {
    setIsPlaying(false);
    lastTimeRef.current = null;
    const next = { ...params, preset: newPreset };
    setParams(next);
    setTelemetry(computeInitialTelemetry(next));
  };

  // Step Forward
  const handleStep = () => {
    const dt = 0.05;
    updateSimulationState(dt);
  };

  // State updater function
  const updateSimulationState = (dt: number) => {
    setTelemetry((prev) => {
      const nextT = prev.elapsedTime + dt;

      // 1. Falling Bodies
      if (params.preset === 'falling_bodies') {
        let newCoinY = prev.coinY;
        let newCoinV = prev.coinV;
        let newFeatherY = prev.featherY;
        let newFeatherV = prev.featherV;

        if (newCoinY < params.dropHeight) {
          const coinAcc = params.gravity;
          newCoinV += coinAcc * dt;
          newCoinY = Math.min(params.dropHeight, newCoinY + newCoinV * dt);
        }

        if (newFeatherY < params.dropHeight) {
          let featherAcc = params.gravity;
          if (!params.vacuum) {
            const dragForce = 0.5 * params.airDensity * params.featherCd * params.featherArea * newFeatherV * newFeatherV;
            featherAcc = Math.max(0, params.gravity - dragForce / params.featherMass);
          }
          newFeatherV += featherAcc * dt;
          newFeatherY = Math.min(params.dropHeight, newFeatherY + newFeatherV * dt);
        }

        const isLanded = newCoinY >= params.dropHeight && newFeatherY >= params.dropHeight;

        return {
          ...prev,
          elapsedTime: nextT,
          coinY: newCoinY,
          coinV: newCoinY >= params.dropHeight ? 0 : newCoinV,
          featherY: newFeatherY,
          featherV: newFeatherY >= params.dropHeight ? 0 : newFeatherV,
          isLanded,
        };
      }

      // 2. Kepler Orbits
      if (params.preset === 'kepler_laws' || params.preset === 'kepler_harmonic') {
        const period = Math.pow(params.semiMajorAxis, 1.5);
        const meanMotion = (2 * Math.PI) / (period || 1);
        const M = (meanMotion * nextT) % (2 * Math.PI);
        const E = solveKepler(M, params.eccentricity);
        const trueAnomaly = 2 * Math.atan2(
          Math.sqrt(1 + params.eccentricity) * Math.sin(E / 2),
          Math.sqrt(1 - params.eccentricity) * Math.cos(E / 2)
        );
        const r = params.semiMajorAxis * (1 - params.eccentricity * Math.cos(E));
        const v = Math.sqrt(params.centralMass * (2 / r - 1 / params.semiMajorAxis));

        return {
          ...prev,
          elapsedTime: nextT,
          orbitalR: r,
          orbitalTheta: trueAnomaly,
          orbitalV: v,
          orbitalPeriod: period,
        };
      }

      // 3. Gravitation
      if (params.preset === 'vector_gravitation') {
        const rM = params.distR * 1e6;
        const force = (G_UNIVERSAL * (params.m1 * 1e24) * (params.m2 * 1e24)) / (rM * rM);
        return {
          ...prev,
          elapsedTime: nextT,
          forceMagnitude: force,
        };
      }

      // 4. Equivalence
      if (params.preset === 'equivalence') {
        let appW = params.testMass * params.gravity;
        if (params.elevatorState === 'freefall_cable_cut') {
          appW = 0;
        } else if (params.elevatorState === 'accelerating_rocket') {
          appW = params.testMass * (0 + params.elevatorAcc);
        }
        return {
          ...prev,
          elapsedTime: nextT,
          apparentWeight: appW,
          scaleReading: appW / 9.81,
        };
      }

      return { ...prev, elapsedTime: nextT };
    });
  };

  // Animation Loop
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      lastTimeRef.current = null;
      return;
    }

    const loop = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const rawDt = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      const dt = Math.min(rawDt, 0.05) * (params.slowMo ? 0.25 : 1.0);
      updateSimulationState(dt);

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, params]);

  // Synchronize parameter updates
  const handleParamsUpdate = (updater: (prev: SimulationParams) => SimulationParams) => {
    setParams((prev) => {
      const next = updater(prev);
      setTelemetry(computeInitialTelemetry(next));
      return next;
    });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F8FAFC] text-slate-800">
      {/* 1. Header with Udvash Branding */}
      <Header
        language={language}
        onToggleLanguage={() => setLanguage((prev) => (prev === 'bn' ? 'en' : 'bn'))}
        preset={params.preset}
        onSelectPreset={handlePresetSelect}
        onOpenTheory={() => setIsModalOpen(true)}
        onReset={handleReset}
      />

      {/* 2. Main 3-Column Layout */}
      <main className="max-w-[1780px] w-full mx-auto p-3 sm:p-4 flex-1 flex flex-col lg:flex-row gap-4 items-start">
        {/* Left Sidebar: Control Parameters */}
        <ControlPanel
          language={language}
          params={params}
          onChangeParams={handleParamsUpdate}
          onResetDefaults={handleResetDefaults}
        />

        {/* Center: Motion Canvas Workspace */}
        <MotionCanvas
          language={language}
          theme={theme}
          params={params}
          telemetry={telemetry}
          isPlaying={isPlaying}
          onTogglePlay={() => {
            if (telemetry.isLanded || telemetry.coinY >= params.dropHeight) {
              setTelemetry(computeInitialTelemetry(params));
              setIsPlaying(true);
            } else {
              setIsPlaying((prev) => !prev);
            }
          }}
          onStep={handleStep}
          onReset={handleReset}
          onToggleSlowMo={() => setParams((prev) => ({ ...prev, slowMo: !prev.slowMo }))}
        />

        {/* Right Sidebar: Analytics & Step-by-Step Math */}
        <AnalyticsPanel
          language={language}
          params={params}
          telemetry={telemetry}
        />
      </main>

      {/* 3. Academic Theory & Derivations Modal */}
      <TheoryModal
        language={language}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

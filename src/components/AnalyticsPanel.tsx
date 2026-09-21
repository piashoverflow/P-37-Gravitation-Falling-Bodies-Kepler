import React, { useRef, useEffect } from 'react';
import { SimulationParams, TelemetryState, Language } from '../types';
import { t } from '../utils/i18n';
import { fmtNum, fmtSci, G_UNIVERSAL } from '../utils/physics';
import { 
  Activity, 
  Orbit, 
  Scale, 
  BarChart3, 
  Zap, 
  Clock, 
  TrendingUp, 
  Layers 
} from 'lucide-react';

interface AnalyticsPanelProps {
  language: Language;
  params: SimulationParams;
  telemetry: TelemetryState;
}

export const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({
  language,
  params,
  telemetry,
}) => {
  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Draw Real-Time Analytics Graph
  useEffect(() => {
    const canvas = chartCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, w, h);

    // Axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(30, 10);
    ctx.lineTo(30, h - 20);
    ctx.lineTo(w - 10, h - 20);
    ctx.stroke();

    if (params.preset === 'falling_bodies') {
      // Draw v(t) curve
      ctx.font = '9px JetBrains Mono';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('v (m/s)', 35, 18);
      ctx.fillText('t (s)', w - 25, h - 6);

      // Vacuum linear curve: v = gt
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(30, h - 20);
      const maxT = Math.sqrt((2 * params.dropHeight) / params.gravity);
      for (let x = 0; x <= w - 45; x += 5) {
        const simT = (x / (w - 45)) * maxT;
        const simV = params.gravity * simT;
        const maxV = params.gravity * maxT;
        const yPix = (h - 20) - (simV / (maxV || 1)) * (h - 35);
        ctx.lineTo(30 + x, yPix);
      }
      ctx.stroke();

      // Current point
      const curX = 30 + (telemetry.elapsedTime / (maxT || 1)) * (w - 45);
      const curY = (h - 20) - (telemetry.coinV / (params.gravity * maxT || 1)) * (h - 35);
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(Math.min(w - 15, curX), Math.max(15, curY), 4, 0, Math.PI * 2);
      ctx.fill();
    } else if (params.preset === 'kepler_harmonic') {
      // Draw T^2 vs a^3 linear plot
      ctx.font = '9px JetBrains Mono';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('T² (yr²)', 35, 18);
      ctx.fillText('a³ (AU³)', w - 35, h - 6);

      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(30, h - 20);
      ctx.lineTo(w - 15, 15);
      ctx.stroke();

      // Point for current planet
      const pA = params.semiMajorAxis;
      const pT = Math.pow(pA, 1.5);
      const ratio = (pA / 10);
      const ptX = 30 + ratio * (w - 45);
      const ptY = (h - 20) - ratio * (h - 35);

      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(Math.min(w - 15, ptX), Math.max(15, ptY), 5, 0, Math.PI * 2);
      ctx.fill();
    } else if (params.preset === 'vector_gravitation') {
      // Draw F vs r inverse-square curve
      ctx.font = '9px JetBrains Mono';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('F (N)', 35, 18);
      ctx.fillText('r (m)', w - 25, h - 6);

      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 1; x <= w - 45; x += 3) {
        const simR = 5 + (x / (w - 45)) * 25; // 5 to 30
        const simF = 1 / (simR * simR);
        const yPix = (h - 20) - (simF / (1 / 25)) * (h - 35);
        if (x === 1) ctx.moveTo(30 + x, yPix);
        else ctx.lineTo(30 + x, yPix);
      }
      ctx.stroke();
    }
  }, [params, telemetry]);

  return (
    <div className="w-full lg:w-80 xl:w-96 shrink-0 flex flex-col gap-3">
      {/* 1. Live Telemetry Metric Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3.5 flex flex-col gap-3">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
          <div className="p-1.5 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-200">
            <Activity className="w-4 h-4" />
          </div>
          <h2 className="text-xs font-black text-slate-800 tracking-wider uppercase">
            {t(language, 'telemetryTitle')}
          </h2>
        </div>

        {/* Telemetry Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {/* Time Elapsed */}
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex flex-col">
            <span className="text-[10px] text-slate-500 font-bold uppercase">{t(language, 'timeElapsed')}</span>
            <span className="font-mono font-black text-slate-900 text-sm mt-0.5">
              {fmtNum(telemetry.elapsedTime, 2)} s
            </span>
          </div>

          {/* Preset specific metrics */}
          {params.preset === 'falling_bodies' && (
            <>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase">{t(language, 'velocity')} (Coin)</span>
                <span className="font-mono font-black text-emerald-700 text-sm mt-0.5">
                  {fmtNum(telemetry.coinV, 2)} m/s
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase">{t(language, 'velocity')} (Feather)</span>
                <span className="font-mono font-black text-pink-700 text-sm mt-0.5">
                  {fmtNum(telemetry.featherV, 2)} m/s
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase">পতন দূরত্ব (Fall Dist)</span>
                <span className="font-mono font-black text-sky-700 text-sm mt-0.5">
                  {fmtNum(telemetry.coinY, 1)} / {params.dropHeight} m
                </span>
              </div>
            </>
          )}

          {(params.preset === 'kepler_laws' || params.preset === 'kepler_harmonic') && (
            <>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase">{t(language, 'orbitalPeriod')} (T)</span>
                <span className="font-mono font-black text-indigo-700 text-sm mt-0.5">
                  {fmtNum(Math.pow(params.semiMajorAxis, 1.5), 2)} yr
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase">{t(language, 'harmonicRatio')}</span>
                <span className="font-mono font-black text-emerald-700 text-sm mt-0.5">
                  1.00 yr²/AU³
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex flex-col col-span-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase">কক্ষীয় দ্রুতি (Orbital Speed v)</span>
                <span className="font-mono font-black text-sky-700 text-sm mt-0.5">
                  {fmtNum(telemetry.orbitalV, 2)} AU/yr ({fmtNum(telemetry.orbitalV * 4.74, 1)} km/s)
                </span>
              </div>
            </>
          )}

          {params.preset === 'vector_gravitation' && (
            <>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex flex-col col-span-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase">{t(language, 'gravForce')}</span>
                <span className="font-mono font-black text-emerald-700 text-sm mt-0.5">
                  {fmtSci(telemetry.forceMagnitude, 3)} N
                </span>
              </div>
            </>
          )}

          {params.preset === 'equivalence' && (
            <>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex flex-col col-span-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase">{t(language, 'apparentWeight')}</span>
                <span className="font-mono font-black text-sky-700 text-base mt-0.5">
                  {fmtNum(telemetry.apparentWeight, 1)} N
                </span>
              </div>
            </>
          )}
        </div>

        {/* Real-Time Graph Canvas */}
        <div className="mt-1 flex flex-col gap-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
            <BarChart3 className="w-3 h-3" />
            <span>লাইভ ফিজিক্স গ্রাফ (Live Dynamics)</span>
          </span>
          <div className="w-full h-28 bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
            <canvas ref={chartCanvasRef} width={320} height={112} className="w-full h-full block" />
          </div>
        </div>
      </div>

      {/* 2. Step-by-Step Mathematical Equations & Substitution Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3.5 flex flex-col gap-2.5">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
          <div className="p-1 bg-amber-50 text-amber-700 rounded-md border border-amber-200">
            <Zap className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-xs font-black text-slate-800 tracking-wider uppercase">
            {t(language, 'exactMathTitle')}
          </h3>
        </div>

        {/* Dynamic Formula Content */}
        {params.preset === 'falling_bodies' && (
          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-sky-800 font-black block">গ্যালিলিওর ২য় সূত্র: h = ½ gt²</span>
              <p className="text-slate-600 font-medium">
                h = 0.5 × {params.gravity} × ({fmtNum(telemetry.elapsedTime, 2)})² = <span className="font-black text-slate-900">{fmtNum(0.5 * params.gravity * telemetry.elapsedTime * telemetry.elapsedTime, 2)} m</span>
              </p>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-emerald-800 font-black block">গ্যালিলিওর ৩য় সূত্র: v² = 2gh</span>
              <p className="text-slate-600 font-medium">
                v = √(2 × {params.gravity} × {params.dropHeight}) = <span className="font-black text-slate-900">{fmtNum(Math.sqrt(2 * params.gravity * params.dropHeight), 2)} m/s</span>
              </p>
            </div>
          </div>
        )}

        {(params.preset === 'kepler_laws' || params.preset === 'kepler_harmonic') && (
          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-sky-800 font-black block">কেপলারের ৩য় সূত্র: T² = k · a³</span>
              <p className="text-slate-600 font-medium">
                a = {params.semiMajorAxis} AU  ➔  a³ = {fmtNum(Math.pow(params.semiMajorAxis, 3), 2)}
              </p>
              <p className="text-slate-600 font-medium">
                T = a^(3/2) = <span className="font-black text-slate-900">{fmtNum(Math.pow(params.semiMajorAxis, 1.5), 2)} বছর</span>
              </p>
              <div className="text-[11px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mt-1">
                T² / a³ = 1.000 (ধ্রুবক)
              </div>
            </div>
          </div>
        )}

        {params.preset === 'vector_gravitation' && (
          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-sky-800 font-black block">F = G (m₁ · m₂) / r²</span>
              <p className="text-slate-600 font-medium">
                = (6.674×10⁻¹¹) × ({params.m1}×10²⁴) × ({params.m2}×10²⁴) / ({params.distR}×10⁶)²
              </p>
              <p className="font-black text-emerald-800 text-sm mt-1">
                |F⃗| = {fmtSci(telemetry.forceMagnitude, 3)} N
              </p>
            </div>
          </div>
        )}

        {params.preset === 'equivalence' && (
          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-sky-800 font-black block">W = m(g ± a) [আইনস্টাইনের সমতুল্যতা নীতি]</span>
              <p className="text-slate-600 font-medium">
                {params.elevatorState === 'freefall_cable_cut'
                  ? 'মুক্ত পতন: a = g ➔ W = m(g - g) = 0 N'
                  : params.elevatorState === 'accelerating_rocket'
                  ? `রকেট ত্বরণ: W = m(0 + ${params.elevatorAcc}) = ${fmtNum(telemetry.apparentWeight, 1)} N`
                  : 'ভূপৃষ্ঠে স্থির: W = m(9.81 + 0) = 490.5 N'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useRef, useEffect, useState } from 'react';
import { SimulationParams, TelemetryState, Language, AppTheme } from '../types';
import { 
  drawRoundRect, 
  drawVectorArrow, 
  fmtNum, 
  fmtSci, 
  PLANET_DATA 
} from '../utils/physics';
import { t } from '../utils/i18n';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  Maximize2, 
  Minimize2, 
  RotateCw 
} from 'lucide-react';

interface MotionCanvasProps {
  language: Language;
  theme: AppTheme;
  params: SimulationParams;
  telemetry: TelemetryState;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStep: () => void;
  onReset: () => void;
  onToggleSlowMo: () => void;
}

export const MotionCanvas: React.FC<MotionCanvasProps> = ({
  language,
  theme,
  params,
  telemetry,
  isPlaying,
  onTogglePlay,
  onStep,
  onReset,
  onToggleSlowMo,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerDimensions, setContainerDimensions] = useState<{ width: number; height: number }>({
    width: 800,
    height: 520,
  });
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  // ResizeObserver for crisp rendering
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const w = Math.round(entry.contentRect.width);
      const h = Math.max(480, Math.min(640, Math.round(entry.contentRect.width * 0.58)));
      setContainerDimensions({ width: w, height: h });
    });

    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  // Main Canvas Render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const { width, height } = containerDimensions;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    // Draw Subtle Grid
    if (params.showGrid) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      const step = 40;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }

    // ==========================================
    // PRESET 1: FALLING BODIES (Galileo's Tubes)
    // ==========================================
    if (params.preset === 'falling_bodies') {
      const tubeW = Math.min(220, width * 0.35);
      const tubeH = height - 120;
      const tubeY = 40;
      const tube1X = width * 0.25 - tubeW / 2;
      const tube2X = width * 0.75 - tubeW / 2;

      // Draw Left Tube: Vacuum Tube
      ctx.fillStyle = 'rgba(30, 41, 59, 0.7)';
      drawRoundRect(ctx, tube1X, tubeY, tubeW, tubeH, 16);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw Right Tube: Atmospheric Air
      ctx.fillStyle = 'rgba(30, 41, 59, 0.7)';
      drawRoundRect(ctx, tube2X, tubeY, tubeW, tubeH, 16);
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Tube Headers
      ctx.font = 'bold 13px Plus Jakarta Sans, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(language === 'bn' ? 'বায়ুশূন্য নল (Vacuum: Air Drag = 0)' : 'Vacuum Tube (Drag = 0)', tube1X + tubeW / 2, tubeY - 12);
      ctx.fillStyle = '#f59e0b';
      ctx.fillText(language === 'bn' ? 'বায়ুপূর্ণ নল (Atmospheric Air Drag)' : 'Air-Filled Tube (With Drag)', tube2X + tubeW / 2, tubeY - 12);

      // Ruler scale on left
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.textAlign = 'right';
      for (let i = 0; i <= 5; i++) {
        const markY = tubeY + (tubeH / 5) * i;
        const markH = params.dropHeight * (1 - i / 5);
        ctx.beginPath();
        ctx.moveTo(tube1X - 5, markY);
        ctx.lineTo(tube1X, markY);
        ctx.stroke();
        ctx.fillText(`${markH.toFixed(0)}m`, tube1X - 8, markY + 3);
      }

      // Objects in Tube 1 (Vacuum: Coin & Feather fall together at telemetry.coinY)
      const vacNormY = Math.min(1, telemetry.coinY / params.dropHeight);
      const vacPosY = tubeY + 20 + vacNormY * (tubeH - 50);

      // Vacuum Coin
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(tube1X + tubeW * 0.35, vacPosY, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ca8a04';
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px JetBrains Mono';
      ctx.textAlign = 'center';
      ctx.fillText('Coin', tube1X + tubeW * 0.35, vacPosY + 3);

      // Vacuum Feather (Falls exactly alongside coin!)
      ctx.fillStyle = '#ec4899';
      ctx.beginPath();
      ctx.ellipse(tube1X + tubeW * 0.65, vacPosY, 7, 18, Math.PI / 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.fillText('Feather', tube1X + tubeW * 0.65, vacPosY + 3);

      // Tube 2 (Air Resistance: Coin drops fast, Feather flutters slowly)
      const airCoinNormY = Math.min(1, telemetry.coinY / params.dropHeight);
      const airCoinPosY = tubeY + 20 + airCoinNormY * (tubeH - 50);

      const airFeatherNormY = Math.min(1, (params.vacuum ? telemetry.coinY : telemetry.featherY) / params.dropHeight);
      const airFeatherPosY = tubeY + 20 + airFeatherNormY * (tubeH - 50);

      // Air Coin
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(tube2X + tubeW * 0.35, airCoinPosY, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ca8a04';
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.fillText('Coin', tube2X + tubeW * 0.35, airCoinPosY + 3);

      // Air Feather (Floats slowly)
      ctx.fillStyle = '#ec4899';
      ctx.beginPath();
      ctx.ellipse(tube2X + tubeW * 0.65, airFeatherPosY, 7, 18, Math.sin(telemetry.elapsedTime * 6) * 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.fillText('Feather', tube2X + tubeW * 0.65, airFeatherPosY + 3);

      // Vectors
      if (params.showVelocityVector) {
        drawVectorArrow(ctx, tube1X + tubeW * 0.35, vacPosY, tube1X + tubeW * 0.35, vacPosY + Math.min(50, telemetry.coinV * 1.5), '#22c55e', `v=${fmtNum(telemetry.coinV, 1)}m/s`);
        drawVectorArrow(ctx, tube2X + tubeW * 0.65, airFeatherPosY, tube2X + tubeW * 0.65, airFeatherPosY + Math.min(40, telemetry.featherV * 2.5), '#ec4899', `v=${fmtNum(telemetry.featherV, 1)}m/s`);
      }
    }

    // ==========================================
    // PRESET 2: KEPLER'S 1ST & 2ND LAWS
    // ==========================================
    else if (params.preset === 'kepler_laws') {
      const centerX = width * 0.5;
      const centerY = height * 0.5;
      const scale = Math.min(width, height) * 0.22 / (params.semiMajorAxis || 1.8);

      const a = params.semiMajorAxis * scale;
      const e = params.eccentricity;
      const b = a * Math.sqrt(Math.max(0.01, 1 - e * e));
      const c = a * e; // distance from center to focus

      // Primary Focus: The Sun
      const sunX = centerX - c;
      const sunY = centerY;

      // Draw Ellipse Orbit Track
      ctx.save();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, a, b, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Major & Minor Axes
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.beginPath();
      ctx.moveTo(centerX - a, centerY);
      ctx.lineTo(centerX + a, centerY);
      ctx.moveTo(centerX, centerY - b);
      ctx.lineTo(centerX, centerY + b);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // Swept Area Sectors (Kepler's 2nd Law)
      if (params.showSweepSectors) {
        ctx.fillStyle = 'rgba(14, 165, 233, 0.18)';
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
        ctx.lineWidth = 1;

        // Sector 1 around Perihelion (θ ≈ 0)
        ctx.beginPath();
        ctx.moveTo(sunX, sunY);
        for (let th = -0.35; th <= 0.35; th += 0.05) {
          const rTh = (a * (1 - e * e)) / (1 + e * Math.cos(th));
          ctx.lineTo(sunX + rTh * Math.cos(th), sunY + rTh * Math.sin(th));
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Sector 2 around Aphelion (θ ≈ π)
        ctx.beginPath();
        ctx.moveTo(sunX, sunY);
        for (let th = Math.PI - 0.7; th <= Math.PI + 0.7; th += 0.05) {
          const rTh = (a * (1 - e * e)) / (1 + e * Math.cos(th));
          ctx.lineTo(sunX + rTh * Math.cos(th), sunY + rTh * Math.sin(th));
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Labels for Equal Areas
        ctx.font = 'bold 11px Plus Jakarta Sans';
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('Area A₁ (Perihelion: Fast)', sunX + 45, sunY - 25);
        ctx.fillText('Area A₂ (Aphelion: Slow)', sunX - 120, sunY - 25);
        ctx.fillStyle = '#fef08a';
        ctx.fillText('A₁ = A₂ in equal time Δt', sunX - 40, sunY + 60);
      }

      // Draw Foci
      // Focus 1: Sun
      const sunGlow = ctx.createRadialGradient(sunX, sunY, 4, sunX, sunY, 28);
      sunGlow.addColorStop(0, '#fef08a');
      sunGlow.addColorStop(0.4, '#f59e0b');
      sunGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = sunGlow;
      ctx.beginPath();
      ctx.arc(sunX, sunY, 28, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(sunX, sunY, 10, 0, Math.PI * 2);
      ctx.fill();

      // Focus 2 (Empty)
      const f2X = centerX + c;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.beginPath();
      ctx.arc(f2X, centerY, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = '10px JetBrains Mono';
      ctx.fillText('F₂ (Empty Focus)', f2X, centerY - 8);

      // Planet Position from Telemetry theta
      const th = telemetry.orbitalTheta;
      const rOrb = (a * (1 - e * e)) / (1 + e * Math.cos(th));
      const planetX = sunX + rOrb * Math.cos(th);
      const planetY = sunY + rOrb * Math.sin(th);

      // Connecting radius vector line
      ctx.strokeStyle = 'rgba(234, 179, 8, 0.4)';
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(sunX, sunY);
      ctx.lineTo(planetX, planetY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Planet
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(planetX, planetY, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Velocity Vector (tangent to orbit)
      if (params.showVelocityVector) {
        // v_r and v_theta
        const vLen = Math.min(55, Math.max(20, telemetry.orbitalV * 18));
        const tangAngle = th + Math.PI / 2 + Math.atan2(e * Math.sin(th), 1 + e * Math.cos(th));
        const toVx = planetX + vLen * Math.cos(tangAngle);
        const toVy = planetY + vLen * Math.sin(tangAngle);
        drawVectorArrow(ctx, planetX, planetY, toVx, toVy, '#22c55e', `v=${fmtNum(telemetry.orbitalV, 2)}AU/yr`);
      }
    }

    // ==========================================
    // PRESET 3: KEPLER'S 3RD LAW HARMONIC SYSTEM
    // ==========================================
    else if (params.preset === 'kepler_harmonic') {
      const centerX = width * 0.45;
      const centerY = height * 0.5;
      const maxAU = 10;
      const scale = (Math.min(width, height) * 0.42) / maxAU;

      // Draw Sun
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 12, 0, Math.PI * 2);
      ctx.fill();

      // Draw Orbits of solar planets
      Object.keys(PLANET_DATA).forEach((k) => {
        const p = PLANET_DATA[k as keyof typeof PLANET_DATA];
        const rPix = p.a * scale;
        ctx.strokeStyle = p.nameEn.toLowerCase() === params.selectedPlanet ? '#38bdf8' : 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = p.nameEn.toLowerCase() === params.selectedPlanet ? 2 : 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY, rPix, 0, Math.PI * 2);
        ctx.stroke();

        // Planet Body
        const orbPeriod = Math.pow(p.a, 1.5);
        const planetAngle = (telemetry.elapsedTime / orbPeriod) * Math.PI * 2;
        const px = centerX + rPix * Math.cos(planetAngle);
        const py = centerY + rPix * Math.sin(planetAngle);

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(px, py, p.nameEn.toLowerCase() === params.selectedPlanet ? 7 : 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = '10px Plus Jakarta Sans';
        ctx.fillText(language === 'bn' ? p.nameBn.split(' ')[0] : p.nameEn, px + 8, py + 3);
      });
    }

    // ==========================================
    // PRESET 4: VECTOR GRAVITATION
    // ==========================================
    else if (params.preset === 'vector_gravitation') {
      const centerY = height * 0.5;
      const sepPixels = Math.min(width * 0.6, (params.distR / 30) * (width * 0.5) + 120);

      // Barycenter (Center of Mass of 2-body system)
      const totalM = params.m1 + params.m2;
      const baryX = width * 0.5;
      const r1Dist = (params.m2 / totalM) * sepPixels;
      const r2Dist = (params.m1 / totalM) * sepPixels;

      // When playing, the masses revolve around the barycenter
      const orbAng = isPlaying ? telemetry.elapsedTime * 0.8 : 0;
      const m1X = baryX - r1Dist * Math.cos(orbAng);
      const m1Y = centerY - r1Dist * Math.sin(orbAng) * 0.4;
      const m2X = baryX + r2Dist * Math.cos(orbAng);
      const m2Y = centerY + r2Dist * Math.sin(orbAng) * 0.4;

      // Radius scale based on mass
      const r1 = Math.max(16, Math.min(38, Math.cbrt(params.m1) * 12));
      const r2 = Math.max(12, Math.min(32, Math.cbrt(params.m2) * 12));

      // Mutual Orbit Track
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.ellipse(baryX, centerY, r1Dist, r1Dist * 0.4, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(baryX, centerY, r2Dist, r2Dist * 0.4, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Barycenter Cross
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(baryX - 6, centerY);
      ctx.lineTo(baryX + 6, centerY);
      ctx.moveTo(baryX, centerY - 6);
      ctx.lineTo(baryX, centerY + 6);
      ctx.stroke();
      ctx.fillStyle = '#eab308';
      ctx.font = '10px JetBrains Mono';
      ctx.textAlign = 'center';
      ctx.fillText('Barycenter', baryX, centerY - 10);

      // Connecting line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.beginPath();
      ctx.moveTo(m1X, m1Y);
      ctx.lineTo(m2X, m2Y);
      ctx.stroke();

      // Distance tag
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 12px JetBrains Mono';
      ctx.fillText(`r = ${params.distR} × 10⁶ m`, baryX, centerY + 25);

      // Mass 1
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(m1X, m1Y, r1, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#93c5fd';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px JetBrains Mono';
      ctx.fillText(`m₁ = ${params.m1} × 10²⁴ kg`, m1X, m1Y + r1 + 16);

      // Mass 2
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.arc(m2X, m2Y, r2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fdba74';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`m₂ = ${params.m2} × 10²⁴ kg`, m2X, m2Y + r2 + 16);

      // Force Vectors
      const dx = m2X - m1X;
      const dy = m2Y - m1Y;
      const angle = Math.atan2(dy, dx);
      const forceArrowLen = Math.min(65, Math.max(25, (telemetry.forceMagnitude / 1e20) * 10 + 25));

      drawVectorArrow(ctx, m1X, m1Y, m1X + Math.cos(angle) * (r1 + forceArrowLen), m1Y + Math.sin(angle) * (r1 + forceArrowLen), '#22c55e', 'F⃗₁₂', 7);
      drawVectorArrow(ctx, m2X, m2Y, m2X - Math.cos(angle) * (r2 + forceArrowLen), m2Y - Math.sin(angle) * (r2 + forceArrowLen), '#22c55e', 'F⃗₂₁', 7);

      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 12px Plus Jakarta Sans';
      ctx.fillText('F⃗₁₂ = - F⃗₂₁  (নিউটনের ৩য় সূত্র: সমমানের ও বিপরীতমুখী মহাকর্ষ বল)', width * 0.5, height - 30);
    }

    // ==========================================
    // PRESET 5: EQUIVALENCE PRINCIPLE
    // ==========================================
    else if (params.preset === 'equivalence') {
      const boxW = 180;
      const boxH = 240;
      const boxX = width * 0.5 - boxW / 2;

      // Elevator vertical position with motion
      let boxY = height * 0.5 - boxH / 2;
      if (isPlaying) {
        if (params.elevatorState === 'freefall_cable_cut') {
          const dropPeriod = 3.5;
          const dropProg = (telemetry.elapsedTime % dropPeriod) / dropPeriod;
          boxY += Math.pow(dropProg, 2) * 70;
        } else if (params.elevatorState === 'accelerating_rocket') {
          const risePeriod = 3.5;
          const riseProg = (telemetry.elapsedTime % risePeriod) / risePeriod;
          boxY -= Math.pow(riseProg, 2) * 50;
        }
      }

      // Rocket flame underneath if accelerating
      if (params.elevatorState === 'accelerating_rocket') {
        const plumeH = isPlaying ? 24 + Math.random() * 12 : 18;
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.moveTo(boxX + 30, boxY + boxH);
        ctx.lineTo(boxX + 50, boxY + boxH + plumeH);
        ctx.lineTo(boxX + 70, boxY + boxH);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(boxX + boxW - 70, boxY + boxH);
        ctx.lineTo(boxX + boxW - 50, boxY + boxH + plumeH);
        ctx.lineTo(boxX + boxW - 30, boxY + boxH);
        ctx.fill();
      }

      // Elevator Box
      ctx.fillStyle = 'rgba(30, 41, 59, 0.85)';
      drawRoundRect(ctx, boxX, boxY, boxW, boxH, 12);
      ctx.fill();
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Cable on top (cut in freefall)
      if (params.elevatorState !== 'freefall_cable_cut') {
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(width * 0.5, boxY);
        ctx.lineTo(width * 0.5, boxY - 50);
        ctx.stroke();
      } else {
        // Cut cable indication
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(width * 0.5, boxY - 20);
        ctx.lineTo(width * 0.5 + 10, boxY - 28);
        ctx.moveTo(width * 0.5, boxY - 10);
        ctx.lineTo(width * 0.5 - 10, boxY - 2);
        ctx.stroke();
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 11px Plus Jakarta Sans';
        ctx.textAlign = 'center';
        ctx.fillText('✂️ তার ছেঁড়া তার (Free Fall)', width * 0.5, boxY - 35);
      }

      // Weighing Scale on floor
      const scaleW = 90;
      const scaleH = 16;
      const scaleX = width * 0.5 - scaleW / 2;
      const scaleY = boxY + boxH - scaleH - 12;

      ctx.fillStyle = '#475569';
      drawRoundRect(ctx, scaleX, scaleY, scaleW, scaleH, 4);
      ctx.fill();
      ctx.strokeStyle = '#64748b';
      ctx.stroke();

      // Person standing on scale (or floating in freefall)
      const personOffsetY = params.elevatorState === 'freefall_cable_cut' ? -35 : 0;
      const personFootY = scaleY + personOffsetY;

      // Person body
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      // Head
      ctx.beginPath();
      ctx.arc(width * 0.5, personFootY - 70, 10, 0, Math.PI * 2);
      ctx.stroke();
      // Torso
      ctx.beginPath();
      ctx.moveTo(width * 0.5, personFootY - 60);
      ctx.lineTo(width * 0.5, personFootY - 25);
      ctx.stroke();
      // Legs
      ctx.beginPath();
      ctx.moveTo(width * 0.5, personFootY - 25);
      ctx.lineTo(width * 0.5 - 12, personFootY);
      ctx.moveTo(width * 0.5, personFootY - 25);
      ctx.lineTo(width * 0.5 + 12, personFootY);
      ctx.stroke();

      // Scale digital readout
      ctx.fillStyle = '#22c55e';
      ctx.font = 'bold 11px JetBrains Mono';
      ctx.textAlign = 'center';
      ctx.fillText(
        `${fmtNum(telemetry.apparentWeight, 1)} N`,
        width * 0.5,
        scaleY + 12
      );

      // Status text
      ctx.font = 'bold 13px Plus Jakarta Sans';
      ctx.fillStyle = params.elevatorState === 'freefall_cable_cut' ? '#f43f5e' : '#38bdf8';
      const stateLabel =
        params.elevatorState === 'static_gravity'
          ? 'ভূপৃষ্ঠে স্থির: W = mg = 9.81 m'
          : params.elevatorState === 'accelerating_rocket'
          ? `মহাশূন্যে রকেট ত্বরণ a: W = m(g + a)`
          : 'মুক্ত পতন: আপাত ওজন W = 0 (ওজনহীনতা)';
      ctx.fillText(stateLabel, width * 0.5, boxY + boxH + 30);
    }

  }, [containerDimensions, params, telemetry, language]);

  return (
    <div ref={containerRef} className="flex-1 w-full flex flex-col gap-3">
      {/* Simulation Canvas Container */}
      <div className="relative w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-md">
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: `${containerDimensions.height}px` }}
          className="block"
        />

        {/* Top-Right Canvas Overlay Badges */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="p-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-600 transition-colors"
            title={isFullScreen ? t(language, 'exitFullScreen') : t(language, 'fullScreen')}
          >
            {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Control Deck Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3 flex flex-wrap items-center justify-between gap-3">
        {/* Playback Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onTogglePlay}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? t(language, 'pause') : t(language, 'play')}</span>
          </button>

          <button
            onClick={onStep}
            disabled={isPlaying}
            className="flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-800 rounded-xl text-xs font-bold transition-colors border border-slate-200"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>{t(language, 'step')}</span>
          </button>

          <button
            onClick={onReset}
            className="flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors border border-slate-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t(language, 'reset')}</span>
          </button>
        </div>

        {/* Slow Mo Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSlowMo}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              params.slowMo
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
          >
            🐢 {t(language, 'slowMo')}
          </button>
        </div>
      </div>
    </div>
  );
};

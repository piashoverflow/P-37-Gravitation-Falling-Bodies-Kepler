import React, { useRef, useEffect } from 'react';
import { SimulationMode, FallingBodyParams, KeplerParams, GravitationParams, InertialMassParams } from '../types';

interface SimulationCanvasProps {
  mode: SimulationMode;
  isRunning: boolean;
  speed: number;
  fallingParams: FallingBodyParams;
  keplerParams: KeplerParams;
  gravParams: GravitationParams;
  inertialParams: InertialMassParams;
  time: number;
  setTime: (updater: (prev: number) => number) => void;
  lang: 'en' | 'bn';
}

export const SimulationCanvas: React.FC<SimulationCanvasProps> = ({
  mode,
  isRunning,
  speed,
  fallingParams,
  keplerParams,
  gravParams,
  inertialParams,
  time,
  setTime,
  lang,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Dragging state for gravitation mode
  const m1PosRef = useRef({ x: 220, y: 260 });
  const m2PosRef = useRef({ x: 580, y: 260 });
  const isDraggingRef = useRef<'m1' | 'm2' | null>(null);

  // Kepler angle state
  const keplerTrueAnomalyRef = useRef(0);
  const keplerSectorPointsRef = useRef<{ theta1: number; theta2: number; area: number }[]>([]);

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1) * speed;
      lastTime = now;

      if (isRunning) {
        setTime((t) => t + dt);
      }

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      // Clear Canvas with sleek deep space gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#070b14');
      bgGrad.addColorStop(1, '#0d1527');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle starfield / grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // ==========================================
      // MODE 1: FALLING BODIES (GALILEO'S EXPERIMENT)
      // ==========================================
      if (mode === 'falling_bodies') {
        renderFallingBodies(ctx, width, height, time, fallingParams, lang);
      }
      // ==========================================
      // MODE 2: KEPLER'S PLANETARY MOTION LAWS
      // ==========================================
      else if (mode === 'kepler_orbits') {
        renderKeplerOrbits(ctx, width, height, dt, isRunning, keplerParams, lang, keplerTrueAnomalyRef, keplerSectorPointsRef);
      }
      // ==========================================
      // MODE 3: UNIVERSAL GRAVITATION VECTOR LAB
      // ==========================================
      else if (mode === 'gravitation_vector') {
        renderGravitationVectors(ctx, width, height, gravParams, lang, m1PosRef.current, m2PosRef.current);
      }
      // ==========================================
      // MODE 4: INERTIAL MASS VS GRAVITATIONAL MASS
      // ==========================================
      else if (mode === 'inertial_mass') {
        renderInertialMassLab(ctx, width, height, time, inertialParams, lang);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [mode, isRunning, speed, fallingParams, keplerParams, gravParams, inertialParams, time, lang, setTime]);

  // Mouse drag handlers for gravitation vector mode
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mode !== 'gravitation_vector') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

    const d1 = Math.hypot(x - m1PosRef.current.x, y - m1PosRef.current.y);
    const d2 = Math.hypot(x - m2PosRef.current.x, y - m2PosRef.current.y);

    if (d1 < 35) isDraggingRef.current = 'm1';
    else if (d2 < 35) isDraggingRef.current = 'm2';
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current || mode !== 'gravitation_vector') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(60, Math.min(canvas.width - 60, ((e.clientX - rect.left) / rect.width) * canvas.width));
    const y = Math.max(60, Math.min(canvas.height - 60, ((e.clientY - rect.top) / rect.height) * canvas.height));

    if (isDraggingRef.current === 'm1') {
      m1PosRef.current = { x, y };
    } else if (isDraggingRef.current === 'm2') {
      m2PosRef.current = { x, y };
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = null;
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-2">
      <canvas
        ref={canvasRef}
        width={860}
        height={540}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="w-full max-w-4xl h-auto rounded-2xl shadow-2xl border border-slate-800 bg-[#090e1a] cursor-crosshair"
      />
    </div>
  );
};

// ==========================================
// RENDER HELPERS
// ==========================================

function renderFallingBodies(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  p: FallingBodyParams,
  lang: 'en' | 'bn'
) {
  const tubeWidth = 140;
  const tubeHeightPx = 380;
  const tubeY = 70;
  const tube1X = width * 0.28 - tubeWidth / 2;
  const tube2X = width * 0.72 - tubeWidth / 2;

  // Header Title
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 16px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    lang === 'bn' 
      ? 'গ্যালিলিওর পড়ন্ত বস্তুর পরীক্ষা: বায়ুশূন্য নল বনাম সাধারণ বাতাসযুক্ত নল' 
      : "Galileo's Falling Bodies: Vacuum Evacuated Tube vs. Atmospheric Air",
    width / 2,
    35
  );

  // Kinematic calculations for Tube 1 (Vacuum: a = g)
  const g = p.gravity;
  const realH = p.tubeHeight;
  const tMaxVac = Math.sqrt((2 * realH) / g);
  const curTVac = Math.min(time % (tMaxVac + 1.2), tMaxVac);

  // Position in vacuum (m): y = 0.5 * g * t^2
  const yVacReal = 0.5 * g * curTVac * curTVac;
  const yVacNorm = Math.min(yVacReal / realH, 1.0);
  const vVacReal = g * curTVac;

  // Kinematic calculations for Tube 2 (Air with terminal velocity)
  // Coin terminal velocity (high):
  const vtCoin = Math.sqrt((2 * p.coinMass * g) / (p.airDensity * p.coinCd * p.coinArea));
  // Feather terminal velocity (low):
  const vtFeather = p.vacuum 
    ? 999 
    : Math.sqrt((2 * p.featherMass * g) / (p.airDensity * p.featherCd * p.featherArea));

  // Analytical solution for air drag fall: y(t) = (vt^2/g) * ln(cosh(g*t / vt))
  const calcAirY = (vt: number, t: number) => {
    if (p.vacuum || vt > 500) return 0.5 * g * t * t;
    const gt_vt = (g * t) / vt;
    // prevent overflow
    if (gt_vt > 20) return vt * t;
    return ((vt * vt) / g) * Math.log(Math.cosh(gt_vt));
  };

  const calcAirV = (vt: number, t: number) => {
    if (p.vacuum || vt > 500) return g * t;
    return vt * Math.tanh((g * t) / vt);
  };

  const tAir = time % (tMaxVac + 1.2);
  const yCoinAirReal = Math.min(calcAirY(vtCoin, tAir), realH);
  const yFeatherAirReal = Math.min(calcAirY(vtFeather, tAir), realH);

  const yCoinAirNorm = yCoinAirReal / realH;
  const yFeatherAirNorm = yFeatherAirReal / realH;

  // Render Tube 1 (Vacuum)
  renderGlassTube(ctx, tube1X, tubeY, tubeWidth, tubeHeightPx, true, lang);
  // Render Tube 2 (Air)
  renderGlassTube(ctx, tube2X, tubeY, tubeWidth, tubeHeightPx, false, lang);

  // Draw Objects in Tube 1 (Vacuum)
  const tube1CenterX = tube1X + tubeWidth / 2;
  const coin1Y = tubeY + 25 + yVacNorm * (tubeHeightPx - 50);
  const feather1Y = tubeY + 25 + yVacNorm * (tubeHeightPx - 50);

  drawCoin(ctx, tube1CenterX - 28, coin1Y, vVacReal, lang);
  drawFeather(ctx, tube1CenterX + 28, feather1Y, vVacReal, lang);

  // Draw Objects in Tube 2 (Air)
  const tube2CenterX = tube2X + tubeWidth / 2;
  const coin2Y = tubeY + 25 + yCoinAirNorm * (tubeHeightPx - 50);
  const feather2Y = tubeY + 25 + yFeatherAirNorm * (tubeHeightPx - 50);

  drawCoin(ctx, tube2CenterX - 28, coin2Y, calcAirV(vtCoin, tAir), lang);
  drawFeather(ctx, tube2CenterX + 28, feather2Y, calcAirV(vtFeather, tAir), lang);

  // Telemetry HUD bottom
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(width * 0.1, height - 68, width * 0.8, 52, 10);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#94a3b8';
  ctx.font = '12px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText(
    lang === 'bn'
      ? `বায়ুশূন্য নলে ত্বরণ: a = g = ${g.toFixed(2)} m/s² (উভয় বস্তু একই সাথে পড়বে)`
      : `Vacuum Tube: a = g = ${g.toFixed(2)} m/s² (Coin & Feather drop simultaneously)`,
    width * 0.12,
    height - 44
  );

  ctx.fillStyle = '#38bdf8';
  ctx.fillText(
    lang === 'bn'
      ? `বাতাসযুক্ত নলে পালকের প্রান্তিক বেগ (Terminal Velocity): v_t = ${vtFeather.toFixed(2)} m/s`
      : `Air Tube Feather Terminal Velocity: v_t = ${vtFeather.toFixed(2)} m/s`,
    width * 0.12,
    height - 24
  );
}

function renderGlassTube(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  isVacuum: boolean,
  lang: 'en' | 'bn'
) {
  // Tube background glass
  ctx.fillStyle = isVacuum ? 'rgba(56, 189, 248, 0.04)' : 'rgba(244, 114, 182, 0.04)';
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 20);
  ctx.fill();

  // Tube border
  ctx.strokeStyle = isVacuum ? 'rgba(56, 189, 248, 0.5)' : 'rgba(148, 163, 184, 0.5)';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Valve on top
  ctx.fillStyle = '#475569';
  ctx.fillRect(x + w / 2 - 12, y - 14, 24, 14);
  ctx.fillStyle = isVacuum ? '#22c55e' : '#ef4444';
  ctx.beginPath();
  ctx.arc(x + w / 2, y - 7, 4, 0, Math.PI * 2);
  ctx.fill();

  // Tube Title
  ctx.fillStyle = isVacuum ? '#38bdf8' : '#e2e8f0';
  ctx.font = 'bold 13px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    isVacuum 
      ? (lang === 'bn' ? 'নল ১: সম্পূর্ণ বায়ুশূন্য (Vacuum)' : 'Tube 1: Evacuated Vacuum')
      : (lang === 'bn' ? 'নল ২: স্বাভাবিক বাতাস (Air Medium)' : 'Tube 2: Atmospheric Air'),
    x + w / 2,
    y - 20
  );

  // Height markings
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.font = '9px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';
  for (let i = 0; i <= 4; i++) {
    const markY = y + 25 + (i / 4) * (h - 50);
    ctx.beginPath();
    ctx.moveTo(x + 4, markY);
    ctx.lineTo(x + 14, markY);
    ctx.stroke();
    ctx.fillText(`${(100 - i * 25)}%`, x + 18, markY + 3);
  }
}

function drawCoin(ctx: CanvasRenderingContext2D, x: number, y: number, v: number, lang: 'en' | 'bn') {
  // Gold Coin
  const grad = ctx.createRadialGradient(x, y, 2, x, y, 14);
  grad.addColorStop(0, '#fef08a');
  grad.addColorStop(1, '#ca8a04');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#eab308';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Coin symbol
  ctx.fillStyle = '#713f12';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('৳', x, y + 4);

  // Velocity vector arrow
  if (v > 0.1) {
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    const arrowLen = Math.min(v * 2.5, 45);
    ctx.beginPath();
    ctx.moveTo(x, y + 15);
    ctx.lineTo(x, y + 15 + arrowLen);
    ctx.stroke();
    // arrowhead
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.moveTo(x - 3, y + 15 + arrowLen);
    ctx.lineTo(x + 3, y + 15 + arrowLen);
    ctx.lineTo(x, y + 20 + arrowLen);
    ctx.fill();
  }
}

function drawFeather(ctx: CanvasRenderingContext2D, x: number, y: number, v: number, lang: 'en' | 'bn') {
  // Feather shape
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.25);

  ctx.fillStyle = '#f472b6';
  ctx.beginPath();
  ctx.ellipse(0, 0, 8, 22, 0, 0, Math.PI * 2);
  ctx.fill();

  // Shaft
  ctx.strokeStyle = '#fbcfe8';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, -22);
  ctx.lineTo(0, 24);
  ctx.stroke();

  ctx.restore();

  // Velocity arrow
  if (v > 0.1) {
    ctx.strokeStyle = '#ec4899';
    ctx.lineWidth = 2;
    const arrowLen = Math.min(v * 2.5, 45);
    ctx.beginPath();
    ctx.moveTo(x, y + 15);
    ctx.lineTo(x, y + 15 + arrowLen);
    ctx.stroke();
    // arrowhead
    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.moveTo(x - 3, y + 15 + arrowLen);
    ctx.lineTo(x + 3, y + 15 + arrowLen);
    ctx.lineTo(x, y + 20 + arrowLen);
    ctx.fill();
  }
}

// ==========================================
// KEPLER'S LAWS RENDERER
// ==========================================
function renderKeplerOrbits(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  dt: number,
  isRunning: boolean,
  p: KeplerParams,
  lang: 'en' | 'bn',
  thetaRef: React.MutableRefObject<number>,
  sectorPointsRef: React.MutableRefObject<{ theta1: number; theta2: number; area: number }[]>
) {
  const centerX = width * 0.48;
  const centerY = height * 0.52;

  const a = p.semiMajorAxis * 75; // semi-major axis px
  const e = p.eccentricity;
  const b = a * Math.sqrt(Math.max(0.01, 1 - e * e)); // semi-minor axis
  const c = a * e; // distance from center to foci

  const sunX = centerX - c; // Sun at primary focus F1
  const sunY = centerY;
  const emptyFocusX = centerX + c;

  // Header Title
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 16px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    lang === 'bn' 
      ? "কেপলারের গ্রহীয় গতি: ১. উপবৃত্তাকার কক্ষপথ  ২. ক্ষেত্রফল ধ্রুবক (dA/dt = L/2m)  ৩. T² ∝ a³" 
      : "Kepler's Planetary Laws: 1. Ellipses  2. Equal Areas in Equal Times  3. Harmonic Law (T² ∝ a³)",
    width / 2,
    30
  );

  // Draw full elliptical orbit track
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
  ctx.lineWidth = 1.8;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, a, b, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw Foci
  if (p.showFoci) {
    // Primary focus F1 (Sun)
    ctx.fillStyle = '#eab308';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('F₁ (Sun / সূর্য)', sunX, sunY - 22);

    // Empty focus F2
    ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
    ctx.beginPath();
    ctx.arc(emptyFocusX, sunY, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText('F₂ (Empty Focus)', emptyFocusX, sunY - 10);
  }

  // Draw Semi-Major axis line
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.beginPath();
  ctx.moveTo(centerX - a, centerY);
  ctx.lineTo(centerX + a, centerY);
  ctx.stroke();

  // Current True Anomaly & Radius r(theta)
  const theta = thetaRef.current;
  const rCurrent = (a * (1 - e * e)) / (1 + e * Math.cos(theta));
  const planetX = sunX + rCurrent * Math.cos(theta);
  const planetY = sunY + rCurrent * Math.sin(theta);

  // Advance planet using angular momentum conservation: d(theta)/dt = h / r^2
  if (isRunning) {
    const G_M = p.centralMass * 3000;
    const hAngular = Math.sqrt(G_M * a * (1 - e * e));
    const dTheta = (hAngular / Math.max(rCurrent * rCurrent, 100)) * dt * 4;
    thetaRef.current = (theta + dTheta) % (Math.PI * 2);
  }

  // Draw Equal Area Sectors (Kepler's 2nd Law)
  if (p.showSweepSectors) {
    // Shade 2 canonical sectors: Sector 1 at Perihelion, Sector 2 at Aphelion
    const drawSector = (startAngle: number, endAngle: number, color: string, label: string) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(sunX, sunY);
      const steps = 30;
      for (let i = 0; i <= steps; i++) {
        const th = startAngle + (i / steps) * (endAngle - startAngle);
        const r = (a * (1 - e * e)) / (1 + e * Math.cos(th));
        ctx.lineTo(sunX + r * Math.cos(th), sunY + r * Math.sin(th));
      }
      ctx.closePath();
      ctx.fill();

      // Sector label
      const midTh = (startAngle + endAngle) / 2;
      const midR = (a * (1 - e * e)) / (1 + e * Math.cos(midTh)) * 0.55;
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(label, sunX + midR * Math.cos(midTh), sunY + midR * Math.sin(midTh));
    };

    // Perihelion sector (fast speed, short r)
    drawSector(-0.35, 0.35, 'rgba(56, 189, 248, 0.28)', 'Area A₁');
    // Aphelion sector (slow speed, long r)
    drawSector(Math.PI - 0.12, Math.PI + 0.12, 'rgba(234, 179, 8, 0.28)', 'Area A₂');
  }

  // Draw Line from Sun to Planet (Radius vector r)
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(sunX, sunY);
  ctx.lineTo(planetX, planetY);
  ctx.stroke();

  // Draw Sun
  const sunGrad = ctx.createRadialGradient(sunX, sunY, 4, sunX, sunY, 20);
  sunGrad.addColorStop(0, '#fef08a');
  sunGrad.addColorStop(0.6, '#f59e0b');
  sunGrad.addColorStop(1, '#b45309');
  ctx.fillStyle = sunGrad;
  ctx.beginPath();
  ctx.arc(sunX, sunY, 18, 0, Math.PI * 2);
  ctx.fill();

  // Sun glow
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
  ctx.lineWidth = 6;
  ctx.stroke();

  // Draw Planet
  const planetGrad = ctx.createRadialGradient(planetX, planetY, 2, planetX, planetY, 9);
  planetGrad.addColorStop(0, '#67e8f9');
  planetGrad.addColorStop(1, '#0e7490');
  ctx.fillStyle = planetGrad;
  ctx.beginPath();
  ctx.arc(planetX, planetY, 9, 0, Math.PI * 2);
  ctx.fill();

  // Velocity Vector at Planet
  if (p.showVelocityVector) {
    // Velocity magnitude via Vis-Viva equation: v = sqrt(GM * (2/r - 1/a))
    const GM = p.centralMass * 3000;
    const vMag = Math.sqrt(Math.max(1, GM * (2 / rCurrent - 1 / a)));
    // Direction perpendicular to radius + eccentricity correction
    const flightAngle = Math.atan2(e * Math.sin(theta), 1 + e * Math.cos(theta));
    const vAngle = theta + Math.PI / 2 + flightAngle;

    const vArrowLen = vMag * 0.8;
    const vx = planetX + vArrowLen * Math.cos(vAngle);
    const vy = planetY + vArrowLen * Math.sin(vAngle);

    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(planetX, planetY);
    ctx.lineTo(vx, vy);
    ctx.stroke();

    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(vx, vy, 3.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillText(`v = ${vMag.toFixed(1)}`, vx + 8, vy);
  }

  // Perihelion / Aphelion annotations
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '11px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    lang === 'bn' ? 'অনুসূর (Perihelion - দ্রুততম গতি)' : 'Perihelion (Maximum Velocity)',
    centerX - a,
    centerY + 24
  );
  ctx.fillText(
    lang === 'bn' ? 'অপসূর (Aphelion - ধীরতম গতি)' : 'Aphelion (Minimum Velocity)',
    centerX + a,
    centerY + 24
  );

  // Live Kepler HUD bottom
  const orbitalPeriod = Math.sqrt(Math.pow(p.semiMajorAxis, 3) / p.centralMass) * 365.25;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(width * 0.08, height - 60, width * 0.84, 46, 10);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.font = '11px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText(
    `e = ${e.toFixed(3)}  |  a = ${p.semiMajorAxis.toFixed(2)} AU  |  b = ${(b / 75).toFixed(2)} AU  |  T ≈ ${orbitalPeriod.toFixed(1)} days`,
    width * 0.11,
    height - 38
  );

  ctx.fillStyle = '#e2e8f0';
  ctx.fillText(
    lang === 'bn'
      ? `কেপলারের ৩য় সূত্র প্রমাণ: T² / a³ = ${(Math.pow(orbitalPeriod / 365.25, 2) / Math.pow(p.semiMajorAxis, 3)).toFixed(4)} (ধ্রুবক)`
      : `Kepler's 3rd Law Verification: T² / a³ = ${(Math.pow(orbitalPeriod / 365.25, 2) / Math.pow(p.semiMajorAxis, 3)).toFixed(4)} (Constant)`,
    width * 0.11,
    height - 22
  );
}

// ==========================================
// GRAVITATION VECTOR RENDERER
// ==========================================
function renderGravitationVectors(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  p: GravitationParams,
  lang: 'en' | 'bn',
  m1Pos: { x: number; y: number },
  m2Pos: { x: number; y: number }
) {
  // Title
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 16px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    lang === 'bn' 
      ? 'সার্বজনীন মহাকর্ষ সূত্র ও ভেক্টর রূপ: F₁₂ = -G(m₁m₂/r²) r̂₁₂ (ক্রিয়া-প্রতিক্রিয়া জোড়)' 
      : "Newton's Universal Gravitation & Vector Form: F₁₂ = -G(m₁m₂/r²) r̂₁₂",
    width / 2,
    30
  );

  const dx = m2Pos.x - m1Pos.x;
  const dy = m2Pos.y - m1Pos.y;
  const rPx = Math.max(30, Math.hypot(dx, dy));
  const rMeters = rPx * 1e5; // scaled distance in km/meters
  const rHatX = dx / rPx;
  const rHatY = dy / rPx;

  // Force magnitude: F = G * m1 * m2 / r^2
  const G = 6.6743e-11;
  const m1Kg = p.m1 * 1e22;
  const m2Kg = p.m2 * 1e22;
  const fMag = (G * m1Kg * m2Kg) / (rMeters * rMeters);

  // Scaled arrow length
  const arrowScale = Math.min(Math.max(fMag * 1e-15, 25), 110);

  // Draw distance line connecting masses
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(m1Pos.x, m1Pos.y);
  ctx.lineTo(m2Pos.x, m2Pos.y);
  ctx.stroke();
  ctx.setLineDash([]);

  // Distance label
  const midX = (m1Pos.x + m2Pos.x) / 2;
  const midY = (m1Pos.y + m2Pos.y) / 2;
  ctx.fillStyle = '#f8fafc';
  ctx.font = '12px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`r = ${(rMeters / 1e6).toFixed(2)} × 10⁶ m`, midX, midY - 12);

  // Unit Vector r_hat
  const unitLen = 30;
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(midX - (unitLen / 2) * rHatX, midY - (unitLen / 2) * rHatY);
  ctx.lineTo(midX + (unitLen / 2) * rHatX, midY + (unitLen / 2) * rHatY);
  ctx.stroke();
  ctx.fillText('r̂₁₂', midX, midY + 22);

  // Draw Mass 1 (Sphere 1)
  const r1 = Math.max(16, Math.min(32, Math.sqrt(p.m1) * 6));
  const grad1 = ctx.createRadialGradient(m1Pos.x, m1Pos.y, 3, m1Pos.x, m1Pos.y, r1);
  grad1.addColorStop(0, '#60a5fa');
  grad1.addColorStop(1, '#1e40af');
  ctx.fillStyle = grad1;
  ctx.beginPath();
  ctx.arc(m1Pos.x, m1Pos.y, r1, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#93c5fd';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`m₁`, m1Pos.x, m1Pos.y + 4);
  ctx.fillText(`${p.m1} × 10²² kg`, m1Pos.x, m1Pos.y + r1 + 16);

  // Draw Force Vector F21 on Mass 1 (acting towards Mass 2)
  const f21X = m1Pos.x + arrowScale * rHatX;
  const f21Y = m1Pos.y + arrowScale * rHatY;
  ctx.strokeStyle = '#f43f5e';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(m1Pos.x, m1Pos.y);
  ctx.lineTo(f21X, f21Y);
  ctx.stroke();
  // Arrowhead
  ctx.fillStyle = '#f43f5e';
  ctx.beginPath();
  ctx.arc(f21X, f21Y, 4.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = 'bold 11px "JetBrains Mono", monospace';
  ctx.fillText('F₂₁ (Force on m₁ by m₂)', f21X, f21Y - 10);

  // Draw Mass 2 (Sphere 2)
  const r2 = Math.max(16, Math.min(32, Math.sqrt(p.m2) * 6));
  const grad2 = ctx.createRadialGradient(m2Pos.x, m2Pos.y, 3, m2Pos.x, m2Pos.y, r2);
  grad2.addColorStop(0, '#34d399');
  grad2.addColorStop(1, '#065f46');
  ctx.fillStyle = grad2;
  ctx.beginPath();
  ctx.arc(m2Pos.x, m2Pos.y, r2, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#a7f3d0';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`m₂`, m2Pos.x, m2Pos.y + 4);
  ctx.fillText(`${p.m2} × 10²² kg`, m2Pos.x, m2Pos.y + r2 + 16);

  // Draw Force Vector F12 on Mass 2 (acting towards Mass 1)
  const f12X = m2Pos.x - arrowScale * rHatX;
  const f12Y = m2Pos.y - arrowScale * rHatY;
  ctx.strokeStyle = '#f43f5e';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(m2Pos.x, m2Pos.y);
  ctx.lineTo(f12X, f12Y);
  ctx.stroke();
  ctx.fillStyle = '#f43f5e';
  ctx.beginPath();
  ctx.arc(f12X, f12Y, 4.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillText('F₁₂ (Force on m₂ by m₁)', f12X, f12Y - 10);

  // Telemetry HUD bottom
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(width * 0.1, height - 64, width * 0.8, 50, 10);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#f43f5e';
  ctx.font = '12px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText(
    `|F₁₂| = |F₂₁| = ${fMag.toExponential(3)} N  (Newton's 3rd Law: F₁₂ = -F₂₁)`,
    width * 0.12,
    height - 40
  );

  ctx.fillStyle = '#94a3b8';
  ctx.fillText(
    lang === 'bn'
      ? 'যেকোনো ভরকে মাউস দিয়ে ড্র্যাগ করে দূরত্ব পরিবর্তন করুন • ইনভার্স স্কয়ার ল পর্যবেক্ষণ করুন'
      : 'Drag either mass with mouse to adjust distance • Observe inverse-square force decay',
    width * 0.12,
    height - 22
  );
}

// ==========================================
// INERTIAL VS GRAVITATIONAL MASS RENDERER
// ==========================================
function renderInertialMassLab(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  p: InertialMassParams,
  lang: 'en' | 'bn'
) {
  // Title
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 16px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    lang === 'bn' 
      ? 'আইনস্টাইনের সমতুল্যতা নীতি: জড় ভর (m_i = F/a) বনাম মহাকর্ষীয় ভর (m_g = Fr²/GM)' 
      : "Einstein's Equivalence Principle: Inertial Mass vs. Gravitational Mass",
    width / 2,
    30
  );

  const boxW = 240;
  const boxH = 320;
  const box1X = width * 0.26 - boxW / 2;
  const box2X = width * 0.74 - boxW / 2;
  const boxY = 80;

  // Chamber 1: Rocket Accelerating in Deep Space (g = 0, a = 9.8 m/s^2)
  renderChamber(ctx, box1X, boxY, boxW, boxH, 'Rocket in Deep Space (ত্বরণশীল রকেট)', lang, true, time);
  // Chamber 2: Resting on Earth Surface (g = 9.8 m/s^2, a = 0)
  renderChamber(ctx, box2X, boxY, boxW, boxH, 'Chamber on Earth Surface (পৃথিবীপৃষ্ঠে স্থির কামরা)', lang, false, time);

  // Bottom HUD
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(width * 0.08, height - 64, width * 0.84, 52, 10);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.font = '12px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText(
    lang === 'bn'
      ? 'উপসংহার: কামরার ভেতরের কোনো স্থানীয় পরীক্ষা দিয়েই রকেটের ত্বরণ এবং পৃথিবীর অভিকর্ষের মধ্যে পার্থক্য বোঝা সম্ভব নয়!'
      : 'Conclusion: No local mechanical experiment inside a closed chamber can distinguish between gravity and uniform acceleration!',
    width * 0.1,
    height - 40
  );

  ctx.fillStyle = '#e2e8f0';
  ctx.fillText(
    lang === 'bn'
      ? 'জড় ভর এবং মহাকর্ষীয় ভর সম্পূর্ণ অভিন্ন: m_i ≡ m_g (সমতুল্যতা নীতি / Principle of Equivalence)'
      : 'Inertial mass and gravitational mass are strictly equivalent: m_i ≡ m_g',
    width * 0.1,
    height - 20
  );
}

function renderChamber(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  title: string,
  lang: 'en' | 'bn',
  isRocket: boolean,
  time: number
) {
  // Chamber box
  ctx.fillStyle = 'rgba(30, 41, 59, 0.4)';
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 14);
  ctx.fill();
  ctx.strokeStyle = isRocket ? '#38bdf8' : '#34d399';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Chamber title
  ctx.fillStyle = isRocket ? '#38bdf8' : '#34d399';
  ctx.font = 'bold 12px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(title, x + w / 2, y - 10);

  // Rocket exhaust flame if rocket
  if (isRocket) {
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.moveTo(x + w / 2 - 25, y + h);
    ctx.lineTo(x + w / 2 + 25, y + h);
    const flicker = Math.sin(time * 30) * 10;
    ctx.lineTo(x + w / 2, y + h + 45 + flicker);
    ctx.closePath();
    ctx.fill();

    // Thrust upward vector
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x + w + 16, y + h / 2);
    ctx.lineTo(x + w + 16, y + h / 2 - 50);
    ctx.stroke();
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(x + w + 10, y + h / 2 - 50);
    ctx.lineTo(x + w + 22, y + h / 2 - 50);
    ctx.lineTo(x + w + 16, y + h / 2 - 62);
    ctx.fill();
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillText('a = 9.8 m/s²', x + w + 20, y + h / 2 - 70);
  } else {
    // Gravity downward vector
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x + w + 16, y + h / 2);
    ctx.lineTo(x + w + 16, y + h / 2 + 50);
    ctx.stroke();
    ctx.fillStyle = '#34d399';
    ctx.beginPath();
    ctx.moveTo(x + w + 10, y + h / 2 + 50);
    ctx.lineTo(x + w + 22, y + h / 2 + 50);
    ctx.lineTo(x + w + 16, y + h / 2 + 62);
    ctx.fill();
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillText('g = 9.8 m/s²', x + w + 20, y + h / 2 + 75);
  }

  // Dropping Ball inside chamber
  const cycleT = time % 2.0;
  const dropY = Math.min(0.5 * 9.8 * cycleT * cycleT * 50, h - 50);
  const ballX = x + w / 2;
  const ballY = y + 40 + dropY;

  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(ballX, ballY, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Scale on the floor
  ctx.fillStyle = '#475569';
  ctx.fillRect(x + w / 2 - 40, y + h - 16, 80, 12);
  ctx.fillStyle = '#22c55e';
  ctx.font = '9px "JetBrains Mono", monospace';
  ctx.fillText('SCALE: W = mg', x + w / 2, y + h - 22);
}

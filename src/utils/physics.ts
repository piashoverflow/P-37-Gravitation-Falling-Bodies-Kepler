export const G_UNIVERSAL = 6.67430e-11; // N m^2 / kg^2
export const EARTH_MASS = 5.972e24; // kg
export const SOLAR_MASS = 1.989e30; // kg
export const AU_METERS = 1.496e11; // m
export const SECONDS_PER_YEAR = 365.25 * 86400;

export function fmtNum(val: number, decimals: number = 2): string {
  if (!isFinite(val)) return '0.00';
  return val.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function fmtSci(val: number, decimals: number = 2): string {
  if (!isFinite(val) || val === 0) return '0.00';
  const exponent = Math.floor(Math.log10(Math.abs(val)));
  const mantissa = val / Math.pow(10, exponent);
  return `${mantissa.toFixed(decimals)} × 10^{${exponent}}`;
}

export function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

export function drawVectorArrow(
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  color: string,
  label?: string,
  headLen: number = 10
) {
  const dx = toX - fromX;
  const dy = toY - fromY;
  const angle = Math.atan2(dy, dx);
  const length = Math.hypot(dx, dy);

  if (length < 2) return;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2.5;

  // Main line
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();

  // Arrow head
  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(
    toX - headLen * Math.cos(angle - Math.PI / 6),
    toY - headLen * Math.sin(angle - Math.PI / 6)
  );
  ctx.lineTo(
    toX - headLen * Math.cos(angle + Math.PI / 6),
    toY - headLen * Math.sin(angle + Math.PI / 6)
  );
  ctx.closePath();
  ctx.fill();

  // Label
  if (label) {
    ctx.font = 'bold 11px JetBrains Mono, monospace';
    ctx.fillStyle = color;
    const midX = (fromX + toX) / 2 + Math.cos(angle + Math.PI / 2) * 12;
    const midY = (fromY + toY) / 2 + Math.sin(angle + Math.PI / 2) * 12;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, midX, midY);
  }
  ctx.restore();
}

// Solve Kepler's equation M = E - e*sin(E) using Newton-Raphson
export function solveKepler(M: number, e: number): number {
  let E = M;
  for (let i = 0; i < 15; i++) {
    const dE = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
    E -= dE;
    if (Math.abs(dE) < 1e-7) break;
  }
  return E;
}

export const PLANET_DATA = {
  mercury: { nameBn: 'বুধ (Mercury)', nameEn: 'Mercury', a: 0.387, e: 0.2056, color: '#94a3b8' },
  venus: { nameBn: 'শুক্র (Venus)', nameEn: 'Venus', a: 0.723, e: 0.0068, color: '#f59e0b' },
  earth: { nameBn: 'পৃথিবী (Earth)', nameEn: 'Earth', a: 1.000, e: 0.0167, color: '#38bdf8' },
  mars: { nameBn: 'মঙ্গল (Mars)', nameEn: 'Mars', a: 1.524, e: 0.0934, color: '#ef4444' },
  jupiter: { nameBn: 'বৃহস্পতি (Jupiter)', nameEn: 'Jupiter', a: 5.204, e: 0.0484, color: '#d97706' },
  saturn: { nameBn: 'শনি (Saturn)', nameEn: 'Saturn', a: 9.582, e: 0.0542, color: '#eab308' },
};

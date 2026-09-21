export type Language = 'bn' | 'en';
export type AppTheme = 'clean_bright' | 'midnight';
export type PresetMode = 'falling_bodies' | 'kepler_laws' | 'kepler_harmonic' | 'vector_gravitation' | 'equivalence';

export interface SimulationParams {
  preset: PresetMode;
  theme: AppTheme;
  
  // Tab 1: Falling Bodies
  vacuum: boolean;
  dropHeight: number; // m (5 to 100)
  gravity: number; // m/s^2 (default 9.81)
  airDensity: number; // kg/m^3 (1.225)
  coinMass: number; // kg (0.05)
  featherMass: number; // kg (0.005)
  coinArea: number; // m^2
  featherArea: number; // m^2
  coinCd: number; // drag coeff (0.47)
  featherCd: number; // drag coeff (1.2)
  
  // Tab 2: Kepler's Laws (1 & 2)
  semiMajorAxis: number; // AU (1.0 to 5.0)
  eccentricity: number; // 0.0 to 0.85
  centralMass: number; // Solar masses (0.5 to 2.5)
  showSweepSectors: boolean;
  sweepPeriodFraction: number; // fraction of orbit to shade
  showVelocityVector: boolean;
  showAccelerationVector: boolean;
  showFoci: boolean;
  showOrbitGrid: boolean;

  // Tab 3: Kepler's 3rd Law Harmonic System
  selectedPlanet: 'mercury' | 'venus' | 'earth' | 'mars' | 'jupiter' | 'saturn';
  comparisonMode: 'single' | 'multi_system';
  customA: number; // AU

  // Tab 4: Vector Gravitation & Newton's Law
  m1: number; // 10^24 kg
  m2: number; // 10^24 kg
  distR: number; // 10^6 m
  showVectorComponents: boolean;
  showFieldLines: boolean;
  showGrid: boolean;

  // Tab 5: Equivalence Principle & Mass
  elevatorState: 'static_gravity' | 'accelerating_rocket' | 'freefall_cable_cut';
  elevatorAcc: number; // m/s^2 (0 to 20)
  testMass: number; // kg
  
  // Playback
  slowMo: boolean;
  timeScale: number;
}

export interface TelemetryState {
  // General
  elapsedTime: number;
  
  // Falling bodies
  coinY: number;
  coinV: number;
  coinA: number;
  featherY: number;
  featherV: number;
  featherA: number;
  coinTerminalV: number;
  featherTerminalV: number;
  isLanded: boolean;
  
  // Kepler
  orbitalR: number;
  orbitalTheta: number;
  orbitalV: number;
  orbitalPeriod: number; // years
  sweptArea: number;
  arealVelocity: number; // dA/dt
  keplerConstant: number; // T^2 / a^3
  
  // Gravitation
  forceMagnitude: number; // N
  f12x: number;
  f12y: number;
  
  // Equivalence
  apparentWeight: number; // N
  scaleReading: number; // kg
  effectiveG: number; // m/s^2
}

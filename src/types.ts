export type SimulationMode = 'falling_bodies' | 'kepler_orbits' | 'gravitation_vector' | 'inertial_mass';

export interface FallingBodyParams {
  vacuum: boolean;
  tubeHeight: number; // meters (10 to 100)
  gravity: number; // m/s^2 (default 9.81)
  airDensity: number; // kg/m^3 (default 1.225)
  coinMass: number; // kg
  featherMass: number; // kg
  coinArea: number;
  featherArea: number;
  coinCd: number; // drag coefficient
  featherCd: number;
}

export interface KeplerParams {
  semiMajorAxis: number; // AU or normalized units (1.0 to 5.0)
  eccentricity: number; // 0.0 to 0.85
  centralMass: number; // Solar masses (0.5 to 3.0)
  showSweepSectors: boolean;
  sweepInterval: number; // seconds
  showVelocityVector: boolean;
  showFoci: boolean;
  showOrbitsTrack: boolean;
}

export interface GravitationParams {
  m1: number; // 10^22 kg scale
  m2: number;
  showVectorComponents: boolean;
  showFieldGrid: boolean;
  gravitationalConstant: number; // scaled for simulation
}

export interface InertialMassParams {
  elevatorAcc: number; // a in m/s^2
  externalGravity: number; // g in m/s^2
  boxState: 'ground' | 'rocket' | 'freefall';
  objectMass: number;
}

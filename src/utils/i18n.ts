import { Language } from '../types';

export const translations = {
  bn: {
    // Header
    brandTitle: 'পড়ন্ত বস্তু ও মহাকর্ষ',
    brandSubtitle: 'ল্যাব',
    tabFalling: 'পড়ন্ত বস্তুর সূত্র (Galileo)',
    tabKepler12: 'কেপলারের ১ম ও ২য় সূত্র',
    tabKepler3: 'কেপলারের ৩য় সূত্র (Harmonic)',
    tabVectorGrav: 'মহাকর্ষের ভেক্টর রূপ',
    tabEquivalence: 'জড় ভর ও মহাকর্ষীয় ভর',
    theoryButton: 'থিওরি ও সূত্রাবলী',
    udvashBadge: 'উদ্ভাস (Udvash)',

    // Controls
    controlParameters: 'কন্ট্রোল প্যারামিটারস',
    resetDefaults: 'ডিফল্ট রিসেট',
    vacuumMode: 'বায়ুশূন্য অবস্থা (Vacuum)',
    airResistanceMode: 'বায়ুর বাধা সহ (Air Drag)',
    dropHeight: 'পতনের উচ্চতা (h)',
    gravityVal: 'অভিকর্ষজ ত্বরণ (g)',
    semiMajorAxis: 'উপবৃত্তের পরাক্ষ (a)',
    eccentricity: 'উৎকেন্দ্রিকতা (e)',
    centralMass: 'কেন্দ্রীয় ভর (M_sun)',
    mass1: '১ম বস্তুর ভর (m₁)',
    mass2: '২য় বস্তুর ভর (m₂)',
    distanceR: 'দূরত্ব (r)',
    elevatorCondition: 'লিফট ও গতি কাঠামো',
    elevatorAcc: 'লিফটের ত্বরণ (a)',
    
    // Toggles
    visualizerToggles: 'ভিজ্যুয়ালাইজার অপশনস',
    showVectors: 'গতি ও বল ভেক্টর (Vectors)',
    showSweepSectors: 'কেপলারের ক্ষেত্রফল ছায়া (Swept Area)',
    showOrbitsTrack: 'কক্ষপথ ও নাভি বিন্দু (Foci)',
    showGrid: 'স্থানাঙ্ক গ্রিড (Grid)',

    // Telemetry & Stats
    telemetryTitle: 'লাইভ পরিমাপ ও টেলিমেট্রি',
    timeElapsed: 'অতিবাহিত সময় (t)',
    velocity: 'বেগ (v)',
    acceleration: 'ত্বরণ (a)',
    terminalVelocity: 'প্রান্তিক বেগ (v_t)',
    orbitalPeriod: 'পর্যায়কাল (T)',
    harmonicRatio: 'হারমোনিক অনুপাত (T²/a³)',
    gravForce: 'মহাকর্ষ বল (|F|)',
    apparentWeight: 'আপাত ওজন (W_apparent)',
    
    // Math Box
    exactMathTitle: 'গাণিতিক সমীকরণ ও বিশ্লেষণ',
    play: 'শুরু করুন',
    pause: 'থামুন',
    step: 'ধাপ (Step)',
    slowMo: '০.২৫x স্লো-মো',
    reset: 'রিসেট',
    fullScreen: 'পূর্ণ পর্দা',
    exitFullScreen: 'ছোট পর্দা',
  },
  en: {
    // Header
    brandTitle: 'Falling Bodies & Gravitation',
    brandSubtitle: 'LAB',
    tabFalling: "Galileo's Falling Bodies",
    tabKepler12: "Kepler's 1st & 2nd Laws",
    tabKepler3: "Kepler's 3rd Law (Harmonic)",
    tabVectorGrav: 'Vector Gravitation',
    tabEquivalence: 'Inertial vs Gravitational Mass',
    theoryButton: 'Theory & Derivations',
    udvashBadge: 'Udvash',

    // Controls
    controlParameters: 'Control Parameters',
    resetDefaults: 'Reset Defaults',
    vacuumMode: 'Vacuum Condition',
    airResistanceMode: 'With Air Drag',
    dropHeight: 'Drop Height (h)',
    gravityVal: 'Gravitational Accel (g)',
    semiMajorAxis: 'Semi-Major Axis (a)',
    eccentricity: 'Eccentricity (e)',
    centralMass: 'Central Mass (M)',
    mass1: 'Mass 1 (m₁)',
    mass2: 'Mass 2 (m₂)',
    distanceR: 'Distance (r)',
    elevatorCondition: 'Elevator Frame State',
    elevatorAcc: 'Elevator Accel (a)',
    
    // Toggles
    visualizerToggles: 'Visualizer Options',
    showVectors: 'Velocity & Force Vectors',
    showSweepSectors: 'Swept Area Sectors',
    showOrbitsTrack: 'Orbit Track & Foci',
    showGrid: 'Coordinate Grid',

    // Telemetry & Stats
    telemetryTitle: 'Live Telemetry & Metrics',
    timeElapsed: 'Time Elapsed (t)',
    velocity: 'Velocity (v)',
    acceleration: 'Acceleration (a)',
    terminalVelocity: 'Terminal Velocity (v_t)',
    orbitalPeriod: 'Orbital Period (T)',
    harmonicRatio: 'Harmonic Ratio (T²/a³)',
    gravForce: 'Gravitational Force (|F|)',
    apparentWeight: 'Apparent Weight (W_app)',
    
    // Math Box
    exactMathTitle: 'Mathematical Equations & Proof',
    play: 'Play',
    pause: 'Pause',
    step: 'Step',
    slowMo: '0.25x Slow-Mo',
    reset: 'Reset',
    fullScreen: 'Fullscreen',
    exitFullScreen: 'Exit Fullscreen',
  },
};

export function t(lang: Language, key: keyof typeof translations['bn']): string {
  return translations[lang][key] || translations['bn'][key] || key;
}

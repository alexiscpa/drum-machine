export interface CutoutSettings {
  enabled: boolean;
  playMeasures: number;    // 1-8
  muteMeasures: number;    // 1-8
}

export interface ProgressiveSettings {
  enabled: boolean;
  startTempo: number;      // Starting BPM
  targetTempo: number;     // Goal BPM
  incrementBpm: number;    // How much to increase (1-10)
  incrementEvery: number;  // Measures between increments
}

export interface LoopSettings {
  enabled: boolean;
  startMeasure: number;
  endMeasure: number;
}

export interface PracticeState {
  cutout: CutoutSettings;
  progressive: ProgressiveSettings;
  loop: LoopSettings;

  // Runtime state
  currentCutoutPhase: 'play' | 'mute';
  cutoutMeasureCount: number;
  progressiveMeasureCount: number;
}

export const DEFAULT_CUTOUT: CutoutSettings = {
  enabled: false,
  playMeasures: 2,
  muteMeasures: 1,
};

export const DEFAULT_PROGRESSIVE: ProgressiveSettings = {
  enabled: false,
  startTempo: 80,
  targetTempo: 120,
  incrementBpm: 5,
  incrementEvery: 4,
};

export const DEFAULT_LOOP: LoopSettings = {
  enabled: false,
  startMeasure: 0,
  endMeasure: 1,
};

export const DEFAULT_PRACTICE: PracticeState = {
  cutout: DEFAULT_CUTOUT,
  progressive: DEFAULT_PROGRESSIVE,
  loop: DEFAULT_LOOP,
  currentCutoutPhase: 'play',
  cutoutMeasureCount: 0,
  progressiveMeasureCount: 0,
};

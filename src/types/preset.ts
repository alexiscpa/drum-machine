import type { InstrumentId, InstrumentSettings, DrumKit } from './instrument';
import type { Pattern, TimeSignature } from './pattern';
import type { CutoutSettings, ProgressiveSettings, LoopSettings } from './practice';

export interface UserPreset {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;

  // Pattern data
  pattern: Pattern;

  // Transport settings
  tempo: number;
  timeSignature: TimeSignature;

  // Sound settings
  kit: DrumKit;
  instrumentSettings: Record<InstrumentId, InstrumentSettings>;

  // Practice settings (optional)
  cutoutSettings?: CutoutSettings;
  progressiveSettings?: ProgressiveSettings;
  loopSettings?: LoopSettings;
}

export interface MetronomeSettings {
  enabled: boolean;
  volume: number;         // 0-1
  accentDownbeat: boolean;
  clickSound: 'beep' | 'wood' | 'stick';
}

export const DEFAULT_METRONOME: MetronomeSettings = {
  enabled: false,
  volume: 0.5,
  accentDownbeat: true,
  clickSound: 'beep',
};

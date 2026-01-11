import type { TimeSignature } from './pattern';

export interface TransportState {
  isPlaying: boolean;
  tempo: number;              // 40-240 BPM
  timeSignature: TimeSignature;
  currentStep: number;
  currentMeasure: number;
  swing: number;              // 0-100, 50 = no swing
}

export const DEFAULT_TRANSPORT: TransportState = {
  isPlaying: false,
  tempo: 120,
  timeSignature: '4/4',
  currentStep: 0,
  currentMeasure: 0,
  swing: 50,
};

export const MIN_TEMPO = 40;
export const MAX_TEMPO = 240;

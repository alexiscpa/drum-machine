import type { InstrumentId } from './instrument';

export type TimeSignature = '3/4' | '4/4' | '6/8' | '5/4';

export interface TimeSignatureConfig {
  beats: number;           // numerator
  division: number;        // denominator
  stepsPerBeat: number;    // subdivision (usually 4 for 16th notes)
  stepsPerMeasure: number; // total steps per measure
}

export const TIME_SIGNATURES: Record<TimeSignature, TimeSignatureConfig> = {
  '3/4': { beats: 3, division: 4, stepsPerBeat: 4, stepsPerMeasure: 12 },
  '4/4': { beats: 4, division: 4, stepsPerBeat: 4, stepsPerMeasure: 16 },
  '6/8': { beats: 6, division: 8, stepsPerBeat: 2, stepsPerMeasure: 12 },
  '5/4': { beats: 5, division: 4, stepsPerBeat: 4, stepsPerMeasure: 20 },
};

export interface Step {
  active: boolean;
  velocity: number;  // 0-1, default 0.8
  accent: boolean;   // if true, velocity = 1.0
}

export type StepPattern = Step[];

export interface Track {
  instrumentId: InstrumentId;
  steps: StepPattern;
}

export interface Pattern {
  id: string;
  name: string;
  nameZh: string;
  timeSignature: TimeSignature;
  stepsPerMeasure: number;
  measures: number;                  // 1-8 measures per pattern
  tracks: Record<InstrumentId, StepPattern>;
}

export type Genre = 'pop' | 'rock' | 'blues' | 'country' | 'funk';

export interface PresetPattern {
  id: string;
  genre: Genre;
  name: string;
  nameZh: string;
  description: string;
  descriptionZh: string;
  suggestedTempo: { min: number; max: number };
  pattern: Pattern;
}

export function createEmptyStep(): Step {
  return { active: false, velocity: 0.8, accent: false };
}

export function createEmptyPattern(timeSignature: TimeSignature = '4/4', measures: number = 1): StepPattern {
  const config = TIME_SIGNATURES[timeSignature];
  const totalSteps = config.stepsPerMeasure * measures;
  return Array(totalSteps).fill(null).map(() => createEmptyStep());
}

export function createPatternFromArray(arr: number[], defaultVelocity: number = 0.8): StepPattern {
  return arr.map((v) => ({
    active: v === 1,
    velocity: defaultVelocity,
    accent: false,
  }));
}

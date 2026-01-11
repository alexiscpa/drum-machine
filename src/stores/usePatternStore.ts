import { create } from 'zustand';
import type {
  InstrumentId,
  StepPattern,
  TimeSignature,
  PresetPattern,
} from '../types';
import { INSTRUMENT_IDS, createEmptyPattern } from '../types';

interface PatternState {
  // Pattern data indexed by instrument
  patterns: Record<InstrumentId, StepPattern>;

  // Pattern metadata
  measures: number;
  activePresetId: string | null;

  // Actions
  toggleStep: (instrument: InstrumentId, stepIndex: number) => void;
  setStepVelocity: (instrument: InstrumentId, stepIndex: number, velocity: number) => void;
  toggleAccent: (instrument: InstrumentId, stepIndex: number) => void;
  setPattern: (instrument: InstrumentId, pattern: StepPattern) => void;
  setPatterns: (patterns: Record<InstrumentId, StepPattern>) => void;
  loadPreset: (preset: PresetPattern) => void;
  clearPattern: (instrument?: InstrumentId) => void;
  clearAllPatterns: () => void;
  setMeasures: (measures: number) => void;
  initializePatterns: (timeSignature: TimeSignature, measures: number) => void;
}

function createDefaultPatterns(timeSignature: TimeSignature = '4/4', measures: number = 1): Record<InstrumentId, StepPattern> {
  const patterns: Partial<Record<InstrumentId, StepPattern>> = {};

  INSTRUMENT_IDS.forEach((id) => {
    patterns[id] = createEmptyPattern(timeSignature, measures);
  });

  return patterns as Record<InstrumentId, StepPattern>;
}

export const usePatternStore = create<PatternState>((set) => ({
  patterns: createDefaultPatterns(),
  measures: 1,
  activePresetId: null,

  toggleStep: (instrument, stepIndex) => set((state) => {
    const pattern = [...state.patterns[instrument]];
    pattern[stepIndex] = {
      ...pattern[stepIndex],
      active: !pattern[stepIndex].active,
    };

    return {
      patterns: {
        ...state.patterns,
        [instrument]: pattern,
      },
      activePresetId: null, // Clear preset indicator when modified
    };
  }),

  setStepVelocity: (instrument, stepIndex, velocity) => set((state) => {
    const pattern = [...state.patterns[instrument]];
    pattern[stepIndex] = {
      ...pattern[stepIndex],
      velocity: Math.max(0, Math.min(1, velocity)),
    };

    return {
      patterns: {
        ...state.patterns,
        [instrument]: pattern,
      },
      activePresetId: null,
    };
  }),

  toggleAccent: (instrument, stepIndex) => set((state) => {
    const pattern = [...state.patterns[instrument]];
    pattern[stepIndex] = {
      ...pattern[stepIndex],
      accent: !pattern[stepIndex].accent,
    };

    return {
      patterns: {
        ...state.patterns,
        [instrument]: pattern,
      },
      activePresetId: null,
    };
  }),

  setPattern: (instrument, pattern) => set((state) => ({
    patterns: {
      ...state.patterns,
      [instrument]: pattern,
    },
    activePresetId: null,
  })),

  setPatterns: (patterns) => set({
    patterns,
    activePresetId: null,
  }),

  loadPreset: (preset) => set({
    patterns: preset.pattern.tracks,
    measures: preset.pattern.measures,
    activePresetId: preset.id,
  }),

  clearPattern: (instrument) => set((state) => {
    if (instrument) {
      const emptyPattern = createEmptyPattern('4/4', state.measures);

      return {
        patterns: {
          ...state.patterns,
          [instrument]: emptyPattern,
        },
        activePresetId: null,
      };
    }
    return state;
  }),

  clearAllPatterns: () => set((state) => ({
    patterns: createDefaultPatterns('4/4', state.measures),
    activePresetId: null,
  })),

  setMeasures: (measures) => set((state) => {
    const currentStepsPerMeasure = state.patterns.kick.length / state.measures;
    const newTotalSteps = currentStepsPerMeasure * measures;

    const newPatterns: Partial<Record<InstrumentId, StepPattern>> = {};

    INSTRUMENT_IDS.forEach((id) => {
      const currentPattern = state.patterns[id];

      if (newTotalSteps > currentPattern.length) {
        // Extend pattern by repeating
        newPatterns[id] = [];
        for (let i = 0; i < newTotalSteps; i++) {
          newPatterns[id]![i] = { ...currentPattern[i % currentPattern.length] };
        }
      } else {
        // Truncate pattern
        newPatterns[id] = currentPattern.slice(0, newTotalSteps);
      }
    });

    return {
      patterns: newPatterns as Record<InstrumentId, StepPattern>,
      measures,
      activePresetId: null,
    };
  }),

  initializePatterns: (timeSignature, measures) => set({
    patterns: createDefaultPatterns(timeSignature, measures),
    measures,
    activePresetId: null,
  }),
}));

import { create } from 'zustand';
import type { CutoutSettings, ProgressiveSettings, LoopSettings } from '../types';
import { DEFAULT_CUTOUT, DEFAULT_PROGRESSIVE, DEFAULT_LOOP } from '../types';

interface PracticeState {
  // Cutout mode (rhythm disappears for practice)
  cutout: CutoutSettings;
  currentCutoutPhase: 'play' | 'mute';
  cutoutMeasureCount: number;

  // Progressive tempo (auto speed increase)
  progressive: ProgressiveSettings;
  progressiveMeasureCount: number;

  // Loop section
  loop: LoopSettings;

  // Actions
  setCutoutEnabled: (enabled: boolean) => void;
  setCutoutPlayMeasures: (measures: number) => void;
  setCutoutMuteMeasures: (measures: number) => void;
  advanceCutoutPhase: () => boolean; // Returns true if phase changed

  setProgressiveEnabled: (enabled: boolean) => void;
  setProgressiveStartTempo: (tempo: number) => void;
  setProgressiveTargetTempo: (tempo: number) => void;
  setProgressiveIncrement: (bpm: number) => void;
  setProgressiveInterval: (measures: number) => void;
  advanceProgressiveMeasure: () => number | null; // Returns new tempo if changed

  setLoopEnabled: (enabled: boolean) => void;
  setLoopStart: (measure: number) => void;
  setLoopEnd: (measure: number) => void;
  setLoopBounds: (start: number, end: number) => void;

  resetCutout: () => void;
  resetProgressive: () => void;
  resetAll: () => void;
}

export const usePracticeStore = create<PracticeState>((set, get) => ({
  cutout: DEFAULT_CUTOUT,
  currentCutoutPhase: 'play',
  cutoutMeasureCount: 0,

  progressive: DEFAULT_PROGRESSIVE,
  progressiveMeasureCount: 0,

  loop: DEFAULT_LOOP,

  // Cutout actions
  setCutoutEnabled: (enabled) => set((state) => ({
    cutout: { ...state.cutout, enabled },
    currentCutoutPhase: 'play',
    cutoutMeasureCount: 0,
  })),

  setCutoutPlayMeasures: (measures) => set((state) => ({
    cutout: { ...state.cutout, playMeasures: Math.max(1, Math.min(8, measures)) },
  })),

  setCutoutMuteMeasures: (measures) => set((state) => ({
    cutout: { ...state.cutout, muteMeasures: Math.max(1, Math.min(8, measures)) },
  })),

  advanceCutoutPhase: () => {
    const state = get();
    if (!state.cutout.enabled) return false;

    const currentCount = state.cutoutMeasureCount + 1;
    const targetMeasures = state.currentCutoutPhase === 'play'
      ? state.cutout.playMeasures
      : state.cutout.muteMeasures;

    if (currentCount >= targetMeasures) {
      const newPhase = state.currentCutoutPhase === 'play' ? 'mute' : 'play';
      set({
        currentCutoutPhase: newPhase,
        cutoutMeasureCount: 0,
      });
      return true;
    } else {
      set({ cutoutMeasureCount: currentCount });
      return false;
    }
  },

  // Progressive actions
  setProgressiveEnabled: (enabled) => set((state) => ({
    progressive: { ...state.progressive, enabled },
    progressiveMeasureCount: 0,
  })),

  setProgressiveStartTempo: (tempo) => set((state) => ({
    progressive: { ...state.progressive, startTempo: Math.max(40, Math.min(240, tempo)) },
  })),

  setProgressiveTargetTempo: (tempo) => set((state) => ({
    progressive: { ...state.progressive, targetTempo: Math.max(40, Math.min(240, tempo)) },
  })),

  setProgressiveIncrement: (bpm) => set((state) => ({
    progressive: { ...state.progressive, incrementBpm: Math.max(1, Math.min(20, bpm)) },
  })),

  setProgressiveInterval: (measures) => set((state) => ({
    progressive: { ...state.progressive, incrementEvery: Math.max(1, Math.min(16, measures)) },
  })),

  advanceProgressiveMeasure: () => {
    const state = get();
    if (!state.progressive.enabled) return null;

    const currentCount = state.progressiveMeasureCount + 1;

    if (currentCount >= state.progressive.incrementEvery) {
      // Time to increment tempo
      set({ progressiveMeasureCount: 0 });

      // Calculate if we've reached target
      // This would need to coordinate with transport store
      return state.progressive.incrementBpm;
    } else {
      set({ progressiveMeasureCount: currentCount });
      return null;
    }
  },

  // Loop actions
  setLoopEnabled: (enabled) => set((state) => ({
    loop: { ...state.loop, enabled },
  })),

  setLoopStart: (measure) => set((state) => ({
    loop: {
      ...state.loop,
      startMeasure: Math.max(0, Math.min(measure, state.loop.endMeasure)),
    },
  })),

  setLoopEnd: (measure) => set((state) => ({
    loop: {
      ...state.loop,
      endMeasure: Math.max(state.loop.startMeasure, measure),
    },
  })),

  setLoopBounds: (start, end) => set({
    loop: {
      enabled: true,
      startMeasure: Math.max(0, start),
      endMeasure: Math.max(start, end),
    },
  }),

  // Reset actions
  resetCutout: () => set({
    cutout: DEFAULT_CUTOUT,
    currentCutoutPhase: 'play',
    cutoutMeasureCount: 0,
  }),

  resetProgressive: () => set({
    progressive: DEFAULT_PROGRESSIVE,
    progressiveMeasureCount: 0,
  }),

  resetAll: () => set({
    cutout: DEFAULT_CUTOUT,
    currentCutoutPhase: 'play',
    cutoutMeasureCount: 0,
    progressive: DEFAULT_PROGRESSIVE,
    progressiveMeasureCount: 0,
    loop: DEFAULT_LOOP,
  }),
}));

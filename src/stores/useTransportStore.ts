import { create } from 'zustand';
import type { TimeSignature } from '../types';

interface TransportState {
  isPlaying: boolean;
  tempo: number;
  timeSignature: TimeSignature;
  currentStep: number;
  currentMeasure: number;
  swing: number;

  // Actions
  play: () => void;
  stop: () => void;
  toggle: () => void;
  setTempo: (bpm: number) => void;
  incrementTempo: (amount: number) => void;
  setTimeSignature: (sig: TimeSignature) => void;
  setSwing: (value: number) => void;
  setCurrentStep: (step: number) => void;
  setCurrentMeasure: (measure: number) => void;
  setPosition: (step: number, measure: number) => void;
  reset: () => void;
}

export const useTransportStore = create<TransportState>((set) => ({
  isPlaying: false,
  tempo: 120,
  timeSignature: '4/4',
  currentStep: 0,
  currentMeasure: 0,
  swing: 50,

  play: () => set({ isPlaying: true }),

  stop: () => set({
    isPlaying: false,
    currentStep: 0,
    currentMeasure: 0,
  }),

  toggle: () => set((state) => ({ isPlaying: !state.isPlaying })),

  setTempo: (bpm) => set({
    tempo: Math.max(40, Math.min(240, bpm)),
  }),

  incrementTempo: (amount) => set((state) => ({
    tempo: Math.max(40, Math.min(240, state.tempo + amount)),
  })),

  setTimeSignature: (sig) => set({
    timeSignature: sig,
    currentStep: 0,
    currentMeasure: 0,
  }),

  setSwing: (value) => set({
    swing: Math.max(0, Math.min(100, value)),
  }),

  setCurrentStep: (step) => set({ currentStep: step }),

  setCurrentMeasure: (measure) => set({ currentMeasure: measure }),

  setPosition: (step, measure) => set({
    currentStep: step,
    currentMeasure: measure,
  }),

  reset: () => set({
    isPlaying: false,
    currentStep: 0,
    currentMeasure: 0,
  }),
}));

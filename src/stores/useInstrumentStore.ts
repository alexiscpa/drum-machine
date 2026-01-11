import { create } from 'zustand';
import type { InstrumentId, InstrumentSettings, DrumKit } from '../types';
import { INSTRUMENTS } from '../types';

interface InstrumentState {
  // Settings for each instrument
  settings: Record<InstrumentId, InstrumentSettings>;

  // Solo state (only one at a time)
  soloedInstrument: InstrumentId | null;

  // Current drum kit
  kit: DrumKit;

  // Actions
  setVolume: (instrument: InstrumentId, volume: number) => void;
  setPan: (instrument: InstrumentId, pan: number) => void;
  toggleMute: (instrument: InstrumentId) => void;
  setMute: (instrument: InstrumentId, muted: boolean) => void;
  toggleSolo: (instrument: InstrumentId) => void;
  clearSolo: () => void;
  setKit: (kit: DrumKit) => void;
  resetInstrument: (instrument: InstrumentId) => void;
  resetAll: () => void;
}

function createDefaultSettings(): Record<InstrumentId, InstrumentSettings> {
  const settings: Partial<Record<InstrumentId, InstrumentSettings>> = {};

  INSTRUMENTS.forEach((inst) => {
    settings[inst.id] = { ...inst.defaultSettings };
  });

  return settings as Record<InstrumentId, InstrumentSettings>;
}

export const useInstrumentStore = create<InstrumentState>((set) => ({
  settings: createDefaultSettings(),
  soloedInstrument: null,
  kit: 'acoustic',

  setVolume: (instrument, volume) => set((state) => ({
    settings: {
      ...state.settings,
      [instrument]: {
        ...state.settings[instrument],
        volume: Math.max(0, Math.min(1, volume)),
      },
    },
  })),

  setPan: (instrument, pan) => set((state) => ({
    settings: {
      ...state.settings,
      [instrument]: {
        ...state.settings[instrument],
        pan: Math.max(-1, Math.min(1, pan)),
      },
    },
  })),

  toggleMute: (instrument) => set((state) => ({
    settings: {
      ...state.settings,
      [instrument]: {
        ...state.settings[instrument],
        muted: !state.settings[instrument].muted,
      },
    },
  })),

  setMute: (instrument, muted) => set((state) => ({
    settings: {
      ...state.settings,
      [instrument]: {
        ...state.settings[instrument],
        muted,
      },
    },
  })),

  toggleSolo: (instrument) => set((state) => ({
    soloedInstrument: state.soloedInstrument === instrument ? null : instrument,
  })),

  clearSolo: () => set({ soloedInstrument: null }),

  setKit: (kit) => set({ kit }),

  resetInstrument: (instrument) => set((state) => {
    const defaultInst = INSTRUMENTS.find((i) => i.id === instrument);
    if (!defaultInst) return state;

    return {
      settings: {
        ...state.settings,
        [instrument]: { ...defaultInst.defaultSettings },
      },
    };
  }),

  resetAll: () => set({
    settings: createDefaultSettings(),
    soloedInstrument: null,
  }),
}));

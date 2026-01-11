import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { UserPreset, MetronomeSettings } from '../types';
import { DEFAULT_METRONOME } from '../types';

interface PresetState {
  // User presets
  presets: UserPreset[];

  // Metronome settings
  metronome: MetronomeSettings;

  // Actions
  savePreset: (name: string, data: Omit<UserPreset, 'id' | 'name' | 'createdAt' | 'updatedAt'>) => string;
  updatePreset: (id: string, data: Partial<UserPreset>) => void;
  deletePreset: (id: string) => void;
  renamePreset: (id: string, name: string) => void;
  duplicatePreset: (id: string, newName: string) => string | null;
  getPreset: (id: string) => UserPreset | undefined;

  setMetronomeEnabled: (enabled: boolean) => void;
  setMetronomeVolume: (volume: number) => void;
  setMetronomeSound: (sound: MetronomeSettings['clickSound']) => void;
  setMetronomeAccentDownbeat: (accent: boolean) => void;

  exportPresets: () => string;
  importPresets: (data: string) => boolean;
  clearAllPresets: () => void;
}

export const usePresetStore = create<PresetState>()(
  persist(
    (set, get) => ({
      presets: [],
      metronome: DEFAULT_METRONOME,

      savePreset: (name, data) => {
        const id = uuidv4();
        const now = Date.now();

        const newPreset: UserPreset = {
          id,
          name,
          createdAt: now,
          updatedAt: now,
          ...data,
        };

        set((state) => ({
          presets: [...state.presets, newPreset],
        }));

        return id;
      },

      updatePreset: (id, data) => set((state) => ({
        presets: state.presets.map((preset) =>
          preset.id === id
            ? { ...preset, ...data, updatedAt: Date.now() }
            : preset
        ),
      })),

      deletePreset: (id) => set((state) => ({
        presets: state.presets.filter((preset) => preset.id !== id),
      })),

      renamePreset: (id, name) => set((state) => ({
        presets: state.presets.map((preset) =>
          preset.id === id
            ? { ...preset, name, updatedAt: Date.now() }
            : preset
        ),
      })),

      duplicatePreset: (id, newName) => {
        const state = get();
        const original = state.presets.find((p) => p.id === id);
        if (!original) return null;

        const newId = uuidv4();
        const now = Date.now();

        const duplicate: UserPreset = {
          ...original,
          id: newId,
          name: newName,
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          presets: [...state.presets, duplicate],
        }));

        return newId;
      },

      getPreset: (id) => get().presets.find((p) => p.id === id),

      setMetronomeEnabled: (enabled) => set((state) => ({
        metronome: { ...state.metronome, enabled },
      })),

      setMetronomeVolume: (volume) => set((state) => ({
        metronome: { ...state.metronome, volume: Math.max(0, Math.min(1, volume)) },
      })),

      setMetronomeSound: (clickSound) => set((state) => ({
        metronome: { ...state.metronome, clickSound },
      })),

      setMetronomeAccentDownbeat: (accentDownbeat) => set((state) => ({
        metronome: { ...state.metronome, accentDownbeat },
      })),

      exportPresets: () => {
        const state = get();
        return JSON.stringify(state.presets, null, 2);
      },

      importPresets: (data) => {
        try {
          const imported = JSON.parse(data) as UserPreset[];

          if (!Array.isArray(imported)) {
            return false;
          }

          // Validate basic structure
          const valid = imported.every(
            (p) =>
              typeof p.id === 'string' &&
              typeof p.name === 'string' &&
              p.pattern &&
              typeof p.tempo === 'number'
          );

          if (!valid) {
            return false;
          }

          // Generate new IDs to avoid conflicts
          const now = Date.now();
          const newPresets = imported.map((p) => ({
            ...p,
            id: uuidv4(),
            createdAt: now,
            updatedAt: now,
          }));

          set((state) => ({
            presets: [...state.presets, ...newPresets],
          }));

          return true;
        } catch {
          return false;
        }
      },

      clearAllPresets: () => set({ presets: [] }),
    }),
    {
      name: 'drum-machine-presets',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      partialize: (state) => ({
        presets: state.presets,
        metronome: state.metronome,
      }),
    }
  )
);

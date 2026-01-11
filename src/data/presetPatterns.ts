import type { PresetPattern, InstrumentId, StepPattern, Step } from '../types';
import { INSTRUMENT_IDS } from '../types';

// Helper to create a step
const s = (active: boolean, velocity: number = 0.8, accent: boolean = false): Step => ({
  active,
  velocity,
  accent,
});

// Helper to create pattern from 0/1 array
const p = (arr: number[], velocity: number = 0.8): StepPattern =>
  arr.map((v) => s(v === 1, velocity));

// Create empty pattern of given length
const empty = (length: number): StepPattern =>
  Array(length).fill(null).map(() => s(false));

// Create all instrument tracks with defaults
function createTracks(
  partial: Partial<Record<InstrumentId, StepPattern>>,
  length: number = 16
): Record<InstrumentId, StepPattern> {
  const tracks: Partial<Record<InstrumentId, StepPattern>> = {};

  INSTRUMENT_IDS.forEach((id) => {
    tracks[id] = partial[id] || empty(length);
  });

  return tracks as Record<InstrumentId, StepPattern>;
}

export const PRESET_PATTERNS: PresetPattern[] = [
  // ========== POP ==========
  {
    id: 'pop-basic',
    genre: 'pop',
    name: 'Basic Pop',
    nameZh: '基本流行',
    description: 'Standard pop beat with 4-on-the-floor kick',
    descriptionZh: '標準流行節拍，四四拍底鼓',
    suggestedTempo: { min: 100, max: 130 },
    pattern: {
      id: 'pop-basic',
      name: 'Basic Pop',
      nameZh: '基本流行',
      timeSignature: '4/4',
      stepsPerMeasure: 16,
      measures: 1,
      tracks: createTracks({
        'kick':         p([1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0]),
        'snare':        p([0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0]),
        'hihat-closed': p([1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0], 0.6),
      }),
    },
  },
  {
    id: 'pop-8th',
    genre: 'pop',
    name: 'Pop 8th Note',
    nameZh: '流行八分音符',
    description: 'Pop beat with 8th note hi-hat',
    descriptionZh: '流行節拍配八分音符踩鈸',
    suggestedTempo: { min: 90, max: 120 },
    pattern: {
      id: 'pop-8th',
      name: 'Pop 8th Note',
      nameZh: '流行八分音符',
      timeSignature: '4/4',
      stepsPerMeasure: 16,
      measures: 1,
      tracks: createTracks({
        'kick':         p([1,0,0,0, 0,0,1,0, 1,0,0,0, 0,0,1,0]),
        'snare':        p([0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0]),
        'hihat-closed': p([1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0], 0.6),
      }),
    },
  },
  {
    id: 'pop-ballad',
    genre: 'pop',
    name: 'Pop Ballad',
    nameZh: '流行抒情',
    description: 'Gentle ballad pattern',
    descriptionZh: '柔和抒情節拍',
    suggestedTempo: { min: 60, max: 90 },
    pattern: {
      id: 'pop-ballad',
      name: 'Pop Ballad',
      nameZh: '流行抒情',
      timeSignature: '4/4',
      stepsPerMeasure: 16,
      measures: 1,
      tracks: createTracks({
        'kick':         p([1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0]),
        'snare':        p([0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,1]),
        'hihat-closed': p([1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0], 0.5),
      }),
    },
  },

  // ========== ROCK ==========
  {
    id: 'rock-standard',
    genre: 'rock',
    name: 'Standard Rock',
    nameZh: '標準搖滾',
    description: 'Classic rock beat with driving kick',
    descriptionZh: '經典搖滾節拍，強勁底鼓',
    suggestedTempo: { min: 110, max: 140 },
    pattern: {
      id: 'rock-standard',
      name: 'Standard Rock',
      nameZh: '標準搖滾',
      timeSignature: '4/4',
      stepsPerMeasure: 16,
      measures: 1,
      tracks: createTracks({
        'kick':         p([1,0,0,0, 0,0,1,0, 1,0,0,0, 0,0,1,0]),
        'snare':        p([0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0]),
        'hihat-closed': p([1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0], 0.7),
      }),
    },
  },
  {
    id: 'rock-hard',
    genre: 'rock',
    name: 'Hard Rock',
    nameZh: '硬式搖滾',
    description: 'Heavy rock pattern',
    descriptionZh: '重型搖滾節拍',
    suggestedTempo: { min: 120, max: 150 },
    pattern: {
      id: 'rock-hard',
      name: 'Hard Rock',
      nameZh: '硬式搖滾',
      timeSignature: '4/4',
      stepsPerMeasure: 16,
      measures: 1,
      tracks: createTracks({
        'kick':         p([1,0,1,0, 0,0,1,0, 1,0,1,0, 0,0,1,0]),
        'snare':        p([0,0,0,0, 1,0,0,1, 0,0,0,0, 1,0,0,0]),
        'hihat-closed': p([1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1], 0.6),
        'crash':        p([1,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0], 0.8),
      }),
    },
  },
  {
    id: 'rock-punk',
    genre: 'rock',
    name: 'Punk Rock',
    nameZh: '龐克搖滾',
    description: 'Fast punk beat',
    descriptionZh: '快速龐克節拍',
    suggestedTempo: { min: 150, max: 200 },
    pattern: {
      id: 'rock-punk',
      name: 'Punk Rock',
      nameZh: '龐克搖滾',
      timeSignature: '4/4',
      stepsPerMeasure: 16,
      measures: 1,
      tracks: createTracks({
        'kick':         p([1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0]),
        'snare':        p([0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0]),
        'hihat-closed': p([1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1], 0.7),
      }),
    },
  },

  // ========== BLUES ==========
  {
    id: 'blues-shuffle',
    genre: 'blues',
    name: 'Blues Shuffle',
    nameZh: '藍調搖擺',
    description: 'Classic shuffle pattern',
    descriptionZh: '經典藍調搖擺節奏',
    suggestedTempo: { min: 80, max: 120 },
    pattern: {
      id: 'blues-shuffle',
      name: 'Blues Shuffle',
      nameZh: '藍調搖擺',
      timeSignature: '4/4',
      stepsPerMeasure: 16,
      measures: 1,
      tracks: createTracks({
        'kick':         p([1,0,0,0, 0,0,1,0, 1,0,0,0, 0,0,1,0]),
        'snare':        p([0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0]),
        'hihat-closed': p([1,0,0,1, 0,0,1,0, 1,0,0,1, 0,0,1,0], 0.6),
        'ride':         p([1,0,0,1, 0,0,1,0, 1,0,0,1, 0,0,1,0], 0.5),
      }),
    },
  },
  {
    id: 'blues-slow',
    genre: 'blues',
    name: 'Slow Blues',
    nameZh: '慢藍調',
    description: 'Slow blues with triplet feel',
    descriptionZh: '慢板藍調三連音感',
    suggestedTempo: { min: 50, max: 80 },
    pattern: {
      id: 'blues-slow',
      name: 'Slow Blues',
      nameZh: '慢藍調',
      timeSignature: '4/4',
      stepsPerMeasure: 16,
      measures: 1,
      tracks: createTracks({
        'kick':         p([1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0]),
        'snare':        p([0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,1]),
        'hihat-closed': p([1,0,0,1, 0,0,1,0, 1,0,0,1, 0,0,1,0], 0.5),
      }),
    },
  },

  // ========== COUNTRY ==========
  {
    id: 'country-train',
    genre: 'country',
    name: 'Country Train',
    nameZh: '鄉村火車',
    description: 'Classic country train beat',
    descriptionZh: '經典鄉村火車節拍',
    suggestedTempo: { min: 100, max: 140 },
    pattern: {
      id: 'country-train',
      name: 'Country Train',
      nameZh: '鄉村火車',
      timeSignature: '4/4',
      stepsPerMeasure: 16,
      measures: 1,
      tracks: createTracks({
        'kick':         p([1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0]),
        'snare':        p([0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0]),
        'hihat-closed': p([1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1], 0.5),
      }),
    },
  },
  {
    id: 'country-waltz',
    genre: 'country',
    name: 'Country Waltz',
    nameZh: '鄉村華爾滋',
    description: '3/4 time waltz pattern',
    descriptionZh: '三四拍華爾滋節奏',
    suggestedTempo: { min: 90, max: 130 },
    pattern: {
      id: 'country-waltz',
      name: 'Country Waltz',
      nameZh: '鄉村華爾滋',
      timeSignature: '3/4',
      stepsPerMeasure: 12,
      measures: 1,
      tracks: createTracks({
        'kick':         p([1,0,0,0, 0,0,0,0, 0,0,0,0]),
        'snare':        p([0,0,0,0, 1,0,0,0, 1,0,0,0]),
        'hihat-closed': p([1,0,0,0, 1,0,0,0, 1,0,0,0], 0.5),
      }, 12),
    },
  },
  {
    id: 'country-boom-chuck',
    genre: 'country',
    name: 'Boom-Chuck',
    nameZh: '鄉村節拍',
    description: 'Classic boom-chuck pattern',
    descriptionZh: '經典鄉村伴奏節拍',
    suggestedTempo: { min: 100, max: 140 },
    pattern: {
      id: 'country-boom-chuck',
      name: 'Boom-Chuck',
      nameZh: '鄉村節拍',
      timeSignature: '4/4',
      stepsPerMeasure: 16,
      measures: 1,
      tracks: createTracks({
        'kick':         p([1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0]),
        'snare':        p([0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0]),
        'hihat-closed': p([1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0], 0.6),
      }),
    },
  },

  // ========== FUNK ==========
  {
    id: 'funk-groove',
    genre: 'funk',
    name: 'Funk Groove',
    nameZh: '放克律動',
    description: 'Syncopated funk groove',
    descriptionZh: '切分放克律動',
    suggestedTempo: { min: 90, max: 120 },
    pattern: {
      id: 'funk-groove',
      name: 'Funk Groove',
      nameZh: '放克律動',
      timeSignature: '4/4',
      stepsPerMeasure: 16,
      measures: 1,
      tracks: createTracks({
        'kick':         p([1,0,0,1, 0,0,1,0, 0,1,0,0, 1,0,0,0]),
        'snare':        p([0,0,0,0, 1,0,0,1, 0,0,0,0, 1,0,0,0]),
        'hihat-closed': p([1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1], 0.5),
        'hihat-open':   p([0,0,0,0, 0,0,0,0, 0,0,1,0, 0,0,0,0], 0.6),
      }),
    },
  },
  {
    id: 'funk-16th',
    genre: 'funk',
    name: 'Funk 16th',
    nameZh: '放克十六分',
    description: '16th note funk pattern',
    descriptionZh: '十六分音符放克節奏',
    suggestedTempo: { min: 85, max: 110 },
    pattern: {
      id: 'funk-16th',
      name: 'Funk 16th',
      nameZh: '放克十六分',
      timeSignature: '4/4',
      stepsPerMeasure: 16,
      measures: 1,
      tracks: createTracks({
        'kick':         p([1,0,0,0, 0,0,1,0, 0,0,1,0, 0,0,0,0]),
        'snare':        p([0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,1,0]),
        'hihat-closed': p([1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1], 0.5),
      }),
    },
  },
  {
    id: 'funk-disco',
    genre: 'funk',
    name: 'Disco',
    nameZh: '迪斯可',
    description: 'Classic disco pattern',
    descriptionZh: '經典迪斯可節奏',
    suggestedTempo: { min: 110, max: 130 },
    pattern: {
      id: 'funk-disco',
      name: 'Disco',
      nameZh: '迪斯可',
      timeSignature: '4/4',
      stepsPerMeasure: 16,
      measures: 1,
      tracks: createTracks({
        'kick':         p([1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0]),
        'snare':        p([0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0]),
        'hihat-closed': p([0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0], 0.5),
        'hihat-open':   p([1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0], 0.6),
      }),
    },
  },
];

export function getPresetsByGenre(genre: PresetPattern['genre']): PresetPattern[] {
  return PRESET_PATTERNS.filter((p) => p.genre === genre);
}

export function getPresetById(id: string): PresetPattern | undefined {
  return PRESET_PATTERNS.find((p) => p.id === id);
}

export const GENRES: Array<{ id: PresetPattern['genre']; name: string; nameZh: string }> = [
  { id: 'pop', name: 'Pop', nameZh: '流行' },
  { id: 'rock', name: 'Rock', nameZh: '搖滾' },
  { id: 'blues', name: 'Blues', nameZh: '藍調' },
  { id: 'country', name: 'Country', nameZh: '鄉村' },
  { id: 'funk', name: 'Funk', nameZh: '放克' },
];

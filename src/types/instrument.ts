export type InstrumentId =
  | 'kick'
  | 'snare'
  | 'hihat-closed'
  | 'hihat-open'
  | 'ride'
  | 'crash'
  | 'tom-high'
  | 'tom-mid'
  | 'tom-low';

export type DrumKit = 'acoustic' | 'electronic' | 'percussion';

export interface InstrumentSettings {
  volume: number;   // 0-1
  muted: boolean;
  pan: number;      // -1 to 1 (left to right)
}

export interface InstrumentDefinition {
  id: InstrumentId;
  name: string;
  nameZh: string;
  shortName: string;
  color: string;
  defaultSettings: InstrumentSettings;
}

export const INSTRUMENT_IDS: InstrumentId[] = [
  'kick',
  'snare',
  'hihat-closed',
  'hihat-open',
  'ride',
  'crash',
  'tom-high',
  'tom-mid',
  'tom-low',
];

export const INSTRUMENTS: InstrumentDefinition[] = [
  {
    id: 'kick',
    name: 'Kick',
    nameZh: '底鼓',
    shortName: 'K',
    color: '#ef4444',
    defaultSettings: { volume: 0.8, muted: false, pan: 0 },
  },
  {
    id: 'snare',
    name: 'Snare',
    nameZh: '小鼓',
    shortName: 'S',
    color: '#f97316',
    defaultSettings: { volume: 0.8, muted: false, pan: 0 },
  },
  {
    id: 'hihat-closed',
    name: 'Hi-Hat (Closed)',
    nameZh: '閉合踩鈸',
    shortName: 'HC',
    color: '#eab308',
    defaultSettings: { volume: 0.6, muted: false, pan: 0.2 },
  },
  {
    id: 'hihat-open',
    name: 'Hi-Hat (Open)',
    nameZh: '開放踩鈸',
    shortName: 'HO',
    color: '#84cc16',
    defaultSettings: { volume: 0.5, muted: false, pan: 0.2 },
  },
  {
    id: 'ride',
    name: 'Ride',
    nameZh: '疊音鈸',
    shortName: 'R',
    color: '#22c55e',
    defaultSettings: { volume: 0.5, muted: false, pan: 0.3 },
  },
  {
    id: 'crash',
    name: 'Crash',
    nameZh: '碎音鈸',
    shortName: 'C',
    color: '#06b6d4',
    defaultSettings: { volume: 0.6, muted: false, pan: -0.3 },
  },
  {
    id: 'tom-high',
    name: 'Tom (High)',
    nameZh: '高音筒鼓',
    shortName: 'TH',
    color: '#3b82f6',
    defaultSettings: { volume: 0.7, muted: false, pan: -0.2 },
  },
  {
    id: 'tom-mid',
    name: 'Tom (Mid)',
    nameZh: '中音筒鼓',
    shortName: 'TM',
    color: '#6366f1',
    defaultSettings: { volume: 0.7, muted: false, pan: 0 },
  },
  {
    id: 'tom-low',
    name: 'Tom (Low)',
    nameZh: '低音筒鼓',
    shortName: 'TL',
    color: '#8b5cf6',
    defaultSettings: { volume: 0.7, muted: false, pan: 0.2 },
  },
];

export function getInstrument(id: InstrumentId): InstrumentDefinition {
  const instrument = INSTRUMENTS.find((i) => i.id === id);
  if (!instrument) {
    throw new Error(`Unknown instrument: ${id}`);
  }
  return instrument;
}

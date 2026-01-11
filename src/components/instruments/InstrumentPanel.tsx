import { useInstrumentStore } from '../../stores';
import { INSTRUMENTS } from '../../types';
import { Slider, Select } from '../ui';
import type { DrumKit } from '../../types';

const KIT_OPTIONS = [
  { value: 'acoustic', label: '原聲鼓組' },
  { value: 'electronic', label: '電子鼓組' },
  { value: 'percussion', label: '打擊樂' },
];

export function InstrumentPanel() {
  const settings = useInstrumentStore((s) => s.settings);
  const setVolume = useInstrumentStore((s) => s.setVolume);
  const kit = useInstrumentStore((s) => s.kit);
  const setKit = useInstrumentStore((s) => s.setKit);
  const resetAll = useInstrumentStore((s) => s.resetAll);

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          樂器控制
        </h2>
        <button
          onClick={resetAll}
          className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          重置
        </button>
      </div>

      {/* Kit selector */}
      <div className="mb-4">
        <Select
          label="鼓組音色"
          value={kit}
          options={KIT_OPTIONS}
          onChange={(value) => setKit(value as DrumKit)}
        />
      </div>

      {/* Volume controls */}
      <div className="space-y-3">
        {INSTRUMENTS.map((instrument) => (
          <div key={instrument.id} className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: instrument.color }}
            />
            <span className="w-20 text-sm text-gray-700 dark:text-gray-300 truncate">
              {instrument.nameZh}
            </span>
            <Slider
              value={Math.round(settings[instrument.id].volume * 100)}
              min={0}
              max={100}
              step={5}
              onChange={(value) => setVolume(instrument.id, value / 100)}
              showValue={false}
              className="flex-1"
            />
            <span className="w-8 text-xs text-gray-500 text-right">
              {Math.round(settings[instrument.id].volume * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { usePatternStore, useTransportStore } from '../../stores';
import { GENRES, getPresetsByGenre } from '../../data/presetPatterns';
import type { Genre, PresetPattern } from '../../types';

export function PatternPresets() {
  const [selectedGenre, setSelectedGenre] = useState<Genre>('pop');
  const loadPreset = usePatternStore((s) => s.loadPreset);
  const activePresetId = usePatternStore((s) => s.activePresetId);
  const setTimeSignature = useTransportStore((s) => s.setTimeSignature);
  const setTempo = useTransportStore((s) => s.setTempo);
  const tempo = useTransportStore((s) => s.tempo);

  const presets = getPresetsByGenre(selectedGenre);

  const handleLoadPreset = (preset: PresetPattern) => {
    loadPreset(preset);
    setTimeSignature(preset.pattern.timeSignature);

    // Set tempo to middle of suggested range if current tempo is outside
    const { min, max } = preset.suggestedTempo;
    if (tempo < min || tempo > max) {
      setTempo(Math.round((min + max) / 2));
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
        預設節奏
      </h2>

      {/* Genre tabs */}
      <div className="flex flex-wrap gap-1 mb-4">
        {GENRES.map((genre) => (
          <button
            key={genre.id}
            onClick={() => setSelectedGenre(genre.id)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              selectedGenre === genre.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {genre.nameZh}
          </button>
        ))}
      </div>

      {/* Preset list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {presets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => handleLoadPreset(preset)}
            className={`p-3 text-left rounded-lg transition-colors ${
              activePresetId === preset.id
                ? 'bg-blue-100 dark:bg-blue-900 border-2 border-blue-500'
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <div className="font-medium text-gray-800 dark:text-gray-200">
              {preset.nameZh}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {preset.descriptionZh}
            </div>
            <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              建議速度: {preset.suggestedTempo.min}-{preset.suggestedTempo.max} BPM
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

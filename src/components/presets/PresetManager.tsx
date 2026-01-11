import { useState, type ChangeEvent } from 'react';
import { usePresetStore, usePatternStore, useTransportStore, useInstrumentStore } from '../../stores';
import { Button } from '../ui';
import type { UserPreset } from '../../types';

export function PresetManager() {
  const [presetName, setPresetName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const presets = usePresetStore((s) => s.presets);
  const savePreset = usePresetStore((s) => s.savePreset);
  const deletePreset = usePresetStore((s) => s.deletePreset);
  const exportPresets = usePresetStore((s) => s.exportPresets);
  const importPresets = usePresetStore((s) => s.importPresets);

  const patterns = usePatternStore((s) => s.patterns);
  const measures = usePatternStore((s) => s.measures);
  const setPatterns = usePatternStore((s) => s.setPatterns);
  const setMeasures = usePatternStore((s) => s.setMeasures);

  const tempo = useTransportStore((s) => s.tempo);
  const timeSignature = useTransportStore((s) => s.timeSignature);
  const setTempo = useTransportStore((s) => s.setTempo);
  const setTimeSignature = useTransportStore((s) => s.setTimeSignature);

  const instrumentSettings = useInstrumentStore((s) => s.settings);
  const kit = useInstrumentStore((s) => s.kit);
  const setKit = useInstrumentStore((s) => s.setKit);

  const handleSave = () => {
    if (!presetName.trim()) return;

    savePreset(presetName.trim(), {
      pattern: {
        id: `user-${Date.now()}`,
        name: presetName,
        nameZh: presetName,
        timeSignature,
        stepsPerMeasure: patterns.kick.length / measures,
        measures,
        tracks: patterns,
      },
      tempo,
      timeSignature,
      kit,
      instrumentSettings,
    });

    setPresetName('');
    setShowSaveDialog(false);
  };

  const handleLoad = (preset: UserPreset) => {
    setPatterns(preset.pattern.tracks);
    setMeasures(preset.pattern.measures);
    setTempo(preset.tempo);
    setTimeSignature(preset.timeSignature);
    setKit(preset.kit);
  };

  const handleExport = () => {
    const data = exportPresets();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'drum-machine-presets.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target?.result as string;
      if (importPresets(data)) {
        alert('匯入成功！');
      } else {
        alert('匯入失敗，請檢查檔案格式。');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          我的預設
        </h2>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowSaveDialog(true)}
          >
            儲存
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExport}
          >
            匯出
          </Button>
          <label className="cursor-pointer">
            <span className="inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 px-3 py-1.5 text-sm">
              匯入
            </span>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Save dialog */}
      {showSaveDialog && (
        <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <input
            type="text"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            placeholder="輸入預設名稱..."
            className="w-full px-3 py-2 mb-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <div className="flex gap-2">
            <Button variant="primary" size="sm" onClick={handleSave}>
              儲存
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowSaveDialog(false);
                setPresetName('');
              }}
            >
              取消
            </Button>
          </div>
        </div>
      )}

      {/* Preset list */}
      {presets.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
          尚無儲存的預設
        </p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {presets.map((preset) => (
            <div
              key={preset.id}
              className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg"
            >
              <div>
                <div className="font-medium text-gray-800 dark:text-gray-200">
                  {preset.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {preset.tempo} BPM | {preset.timeSignature}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleLoad(preset)}
                >
                  載入
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    if (confirm(`確定要刪除「${preset.name}」嗎？`)) {
                      deletePreset(preset.id);
                    }
                  }}
                >
                  刪除
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

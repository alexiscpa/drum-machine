import { usePracticeStore, useTransportStore, usePresetStore } from '../../stores';
import { Toggle, Slider, Select } from '../ui';

export function PracticePanel() {
  // Cutout mode
  const cutout = usePracticeStore((s) => s.cutout);
  const currentCutoutPhase = usePracticeStore((s) => s.currentCutoutPhase);
  const setCutoutEnabled = usePracticeStore((s) => s.setCutoutEnabled);
  const setCutoutPlayMeasures = usePracticeStore((s) => s.setCutoutPlayMeasures);
  const setCutoutMuteMeasures = usePracticeStore((s) => s.setCutoutMuteMeasures);

  // Progressive tempo
  const progressive = usePracticeStore((s) => s.progressive);
  const setProgressiveEnabled = usePracticeStore((s) => s.setProgressiveEnabled);
  const setProgressiveStartTempo = usePracticeStore((s) => s.setProgressiveStartTempo);
  const setProgressiveTargetTempo = usePracticeStore((s) => s.setProgressiveTargetTempo);
  const setProgressiveIncrement = usePracticeStore((s) => s.setProgressiveIncrement);
  const setProgressiveInterval = usePracticeStore((s) => s.setProgressiveInterval);

  // Metronome
  const metronome = usePresetStore((s) => s.metronome);
  const setMetronomeEnabled = usePresetStore((s) => s.setMetronomeEnabled);
  const setMetronomeVolume = usePresetStore((s) => s.setMetronomeVolume);
  const setMetronomeSound = usePresetStore((s) => s.setMetronomeSound);

  const isPlaying = useTransportStore((s) => s.isPlaying);

  return (
    <div className="space-y-4">
      {/* Metronome */}
      <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          節拍器
        </h3>

        <div className="space-y-4">
          <Toggle
            checked={metronome.enabled}
            onChange={setMetronomeEnabled}
            label="啟用節拍器"
          />

          {metronome.enabled && (
            <>
              <Slider
                label="音量"
                value={Math.round(metronome.volume * 100)}
                min={0}
                max={100}
                step={5}
                onChange={(v) => setMetronomeVolume(v / 100)}
              />

              <Select
                label="節拍音效"
                value={metronome.clickSound}
                options={[
                  { value: 'beep', label: '嗶聲' },
                  { value: 'wood', label: '木魚' },
                  { value: 'stick', label: '鼓棒' },
                ]}
                onChange={(v) => setMetronomeSound(v as 'beep' | 'wood' | 'stick')}
              />
            </>
          )}
        </div>
      </div>

      {/* Cutout Mode */}
      <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          節拍消隱練習
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          節奏播放一段時間後會自動靜音，訓練您的內在節奏感。
        </p>

        <div className="space-y-4">
          <Toggle
            checked={cutout.enabled}
            onChange={setCutoutEnabled}
            label="啟用節拍消隱"
          />

          {cutout.enabled && (
            <>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Slider
                    label="播放小節數"
                    value={cutout.playMeasures}
                    min={1}
                    max={8}
                    onChange={setCutoutPlayMeasures}
                  />
                </div>
                <div className="flex-1">
                  <Slider
                    label="靜音小節數"
                    value={cutout.muteMeasures}
                    min={1}
                    max={8}
                    onChange={setCutoutMuteMeasures}
                  />
                </div>
              </div>

              {isPlaying && (
                <div className={`p-2 rounded-lg text-center text-sm font-medium ${
                  currentCutoutPhase === 'play'
                    ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                    : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                }`}>
                  {currentCutoutPhase === 'play' ? '播放中' : '靜音中'}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Progressive Tempo */}
      <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          漸進速度
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          自動增加速度，逐步挑戰您的演奏極限。
        </p>

        <div className="space-y-4">
          <Toggle
            checked={progressive.enabled}
            onChange={setProgressiveEnabled}
            label="啟用漸進速度"
          />

          {progressive.enabled && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Slider
                  label="起始速度"
                  value={progressive.startTempo}
                  min={40}
                  max={200}
                  step={5}
                  onChange={setProgressiveStartTempo}
                />
                <Slider
                  label="目標速度"
                  value={progressive.targetTempo}
                  min={40}
                  max={240}
                  step={5}
                  onChange={setProgressiveTargetTempo}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Slider
                  label="每次增加 (BPM)"
                  value={progressive.incrementBpm}
                  min={1}
                  max={20}
                  onChange={setProgressiveIncrement}
                />
                <Slider
                  label="每隔幾小節"
                  value={progressive.incrementEvery}
                  min={1}
                  max={16}
                  onChange={setProgressiveInterval}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

import { PatternRow } from './PatternRow';
import { usePatternStore, useTransportStore } from '../../stores';
import { INSTRUMENTS, TIME_SIGNATURES } from '../../types';

export function PatternGrid() {
  const clearAllPatterns = usePatternStore((s) => s.clearAllPatterns);
  const timeSignature = useTransportStore((s) => s.timeSignature);

  const config = TIME_SIGNATURES[timeSignature];

  // Generate beat numbers for header
  const beatNumbers = [];
  for (let i = 0; i < config.stepsPerMeasure; i++) {
    if (i % config.stepsPerBeat === 0) {
      beatNumbers.push({
        index: i,
        beat: Math.floor(i / config.stepsPerBeat) + 1,
      });
    }
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          節奏編輯器
        </h2>
        <button
          onClick={clearAllPatterns}
          className="text-sm text-red-500 hover:text-red-600"
        >
          清除全部
        </button>
      </div>

      {/* Beat numbers header */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-28 sm:w-36 flex-shrink-0" />
        <div className="flex gap-0.5">
          {Array(config.stepsPerMeasure)
            .fill(null)
            .map((_, i) => {
              const isDownbeat = i % config.stepsPerBeat === 0;
              const beatNum = Math.floor(i / config.stepsPerBeat) + 1;

              return (
                <div
                  key={i}
                  className={`w-8 h-4 sm:w-10 sm:h-5 flex items-center justify-center text-xs ${
                    isDownbeat
                      ? 'font-bold text-gray-700 dark:text-gray-300'
                      : 'text-gray-400 dark:text-gray-600'
                  }`}
                >
                  {isDownbeat ? beatNum : '·'}
                </div>
              );
            })}
        </div>
      </div>

      {/* Instrument rows */}
      <div className="space-y-1">
        {INSTRUMENTS.map((instrument) => (
          <PatternRow key={instrument.id} instrument={instrument} />
        ))}
      </div>

      {/* Help text */}
      <div className="mt-4 text-xs text-gray-500 dark:text-gray-500">
        <p>點擊：開/關步進 | 右鍵點擊：切換重音</p>
      </div>
    </div>
  );
}

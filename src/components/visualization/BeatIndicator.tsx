import { useTransportStore } from '../../stores';
import { TIME_SIGNATURES } from '../../types';

export function BeatIndicator() {
  const isPlaying = useTransportStore((s) => s.isPlaying);
  const currentStep = useTransportStore((s) => s.currentStep);
  const timeSignature = useTransportStore((s) => s.timeSignature);

  const config = TIME_SIGNATURES[timeSignature];
  const currentBeat = Math.floor(currentStep / config.stepsPerBeat);
  const isOnBeat = currentStep % config.stepsPerBeat === 0;

  return (
    <div className="flex items-center justify-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
      {Array(config.beats)
        .fill(null)
        .map((_, i) => {
          const isCurrentBeat = isPlaying && i === currentBeat;
          const isDownbeat = i === 0;

          return (
            <div
              key={i}
              className={`
                transition-all duration-75
                ${isDownbeat ? 'w-8 h-8' : 'w-6 h-6'}
                rounded-full
                ${
                  isCurrentBeat && isOnBeat
                    ? isDownbeat
                      ? 'bg-red-500 scale-125 shadow-lg shadow-red-500/50'
                      : 'bg-blue-500 scale-110 shadow-lg shadow-blue-500/50'
                    : isCurrentBeat
                    ? 'bg-blue-400 scale-105'
                    : 'bg-gray-300 dark:bg-gray-600'
                }
              `}
            />
          );
        })}
    </div>
  );
}

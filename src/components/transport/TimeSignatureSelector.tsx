import { useTransportStore, usePatternStore } from '../../stores';
import type { TimeSignature } from '../../types';

const TIME_SIGNATURES: Array<{ value: TimeSignature; label: string }> = [
  { value: '3/4', label: '3/4' },
  { value: '4/4', label: '4/4' },
  { value: '6/8', label: '6/8' },
  { value: '5/4', label: '5/4' },
];

export function TimeSignatureSelector() {
  const timeSignature = useTransportStore((s) => s.timeSignature);
  const setTimeSignature = useTransportStore((s) => s.setTimeSignature);
  const initializePatterns = usePatternStore((s) => s.initializePatterns);
  const measures = usePatternStore((s) => s.measures);

  const handleChange = (sig: TimeSignature) => {
    setTimeSignature(sig);
    initializePatterns(sig, measures);
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
        拍號
      </span>
      <div className="flex gap-1">
        {TIME_SIGNATURES.map((sig) => (
          <button
            key={sig.value}
            onClick={() => handleChange(sig.value)}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              timeSignature === sig.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {sig.label}
          </button>
        ))}
      </div>
    </div>
  );
}

import { PatternStep } from './PatternStep';
import { usePatternStore, useInstrumentStore, useTransportStore } from '../../stores';
import type { InstrumentDefinition } from '../../types';
import { TIME_SIGNATURES } from '../../types';

interface PatternRowProps {
  instrument: InstrumentDefinition;
}

export function PatternRow({ instrument }: PatternRowProps) {
  const pattern = usePatternStore((s) => s.patterns[instrument.id]);
  const toggleStep = usePatternStore((s) => s.toggleStep);
  const toggleAccent = usePatternStore((s) => s.toggleAccent);

  const settings = useInstrumentStore((s) => s.settings[instrument.id]);
  const toggleMute = useInstrumentStore((s) => s.toggleMute);
  const toggleSolo = useInstrumentStore((s) => s.toggleSolo);
  const soloedInstrument = useInstrumentStore((s) => s.soloedInstrument);

  const currentStep = useTransportStore((s) => s.currentStep);
  const currentMeasure = useTransportStore((s) => s.currentMeasure);
  const isPlaying = useTransportStore((s) => s.isPlaying);
  const timeSignature = useTransportStore((s) => s.timeSignature);

  const config = TIME_SIGNATURES[timeSignature];
  const stepsPerBeat = config.stepsPerBeat;

  const isMuted = settings.muted || (soloedInstrument !== null && soloedInstrument !== instrument.id);
  const isSoloed = soloedInstrument === instrument.id;

  // Calculate global current step position
  const globalCurrentStep = isPlaying ? currentMeasure * config.stepsPerMeasure + currentStep : -1;

  return (
    <div className="flex items-center gap-2 py-1">
      {/* Instrument label and controls */}
      <div className="flex items-center gap-1 w-28 sm:w-36 flex-shrink-0">
        <div
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: instrument.color }}
        />
        <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
          {instrument.nameZh}
        </span>
        <div className="flex gap-1 ml-auto">
          <button
            onClick={() => toggleMute(instrument.id)}
            className={`w-6 h-6 text-xs font-bold rounded ${
              isMuted
                ? 'bg-red-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
            title="靜音"
          >
            M
          </button>
          <button
            onClick={() => toggleSolo(instrument.id)}
            className={`w-6 h-6 text-xs font-bold rounded ${
              isSoloed
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
            title="獨奏"
          >
            S
          </button>
        </div>
      </div>

      {/* Pattern steps */}
      <div className="flex gap-0.5 flex-wrap">
        {pattern.map((step, index) => {
          const isDownbeat = index % stepsPerBeat === 0;
          const isCurrent = index === globalCurrentStep % pattern.length;

          return (
            <PatternStep
              key={index}
              active={step.active}
              accent={step.accent}
              isCurrent={isCurrent}
              isDownbeat={isDownbeat}
              color={instrument.color}
              onClick={() => toggleStep(instrument.id, index)}
              onRightClick={() => {
                if (step.active) {
                  toggleAccent(instrument.id, index);
                }
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

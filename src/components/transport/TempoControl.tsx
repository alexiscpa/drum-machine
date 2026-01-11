import React, { useState, useEffect } from 'react';
import { useTransportStore } from '../../stores';
import { Slider, Button } from '../ui';
import { MIN_TEMPO, MAX_TEMPO } from '../../types';

export function TempoControl() {
  const tempo = useTransportStore((s) => s.tempo);
  const setTempo = useTransportStore((s) => s.setTempo);
  const incrementTempo = useTransportStore((s) => s.incrementTempo);

  const [inputValue, setInputValue] = useState(tempo.toString());

  useEffect(() => {
    setInputValue(tempo.toString());
  }, [tempo]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    const value = parseInt(inputValue, 10);
    if (!isNaN(value)) {
      setTempo(value);
    } else {
      setInputValue(tempo.toString());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    }
  };

  return (
    <div className="flex flex-col gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          速度 (BPM)
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => incrementTempo(-5)}
            className="w-8 h-8 p-0"
          >
            -5
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => incrementTempo(-1)}
            className="w-8 h-8 p-0"
          >
            -1
          </Button>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            className="w-16 px-2 py-1 text-center text-lg font-bold bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => incrementTempo(1)}
            className="w-8 h-8 p-0"
          >
            +1
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => incrementTempo(5)}
            className="w-8 h-8 p-0"
          >
            +5
          </Button>
        </div>
      </div>

      <Slider
        value={tempo}
        min={MIN_TEMPO}
        max={MAX_TEMPO}
        step={1}
        onChange={setTempo}
        showValue={false}
      />

      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-500">
        <span>{MIN_TEMPO}</span>
        <span>{MAX_TEMPO}</span>
      </div>
    </div>
  );
}

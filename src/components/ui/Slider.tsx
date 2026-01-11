interface SliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  label?: string;
  showValue?: boolean;
  className?: string;
}

export function Slider({
  value,
  min,
  max,
  step = 1,
  onChange,
  label,
  showValue = true,
  className = '',
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {(label || showValue) && (
        <div className="flex justify-between items-center text-sm">
          {label && <span className="text-gray-600 dark:text-gray-400">{label}</span>}
          {showValue && (
            <span className="font-medium text-gray-900 dark:text-gray-100">{value}</span>
          )}
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
        style={{
          background: `linear-gradient(to right, #2563eb 0%, #2563eb ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`,
        }}
      />
    </div>
  );
}

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
}

export function Toggle({
  checked,
  onChange,
  label,
  className = '',
}: ToggleProps) {
  return (
    <label className={`inline-flex items-center gap-2 cursor-pointer ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 rounded-full peer peer-checked:bg-blue-600 transition-colors"></div>
        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform"></div>
      </div>
      {label && (
        <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
      )}
    </label>
  );
}

import React from 'react';

interface PatternStepProps {
  active: boolean;
  accent: boolean;
  isCurrent: boolean;
  isDownbeat: boolean;
  color: string;
  onClick: () => void;
  onRightClick: () => void;
}

export function PatternStep({
  active,
  accent,
  isCurrent,
  isDownbeat,
  color,
  onClick,
  onRightClick,
}: PatternStepProps) {
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onRightClick();
  };

  return (
    <button
      onClick={onClick}
      onContextMenu={handleContextMenu}
      className={`
        w-8 h-8 sm:w-10 sm:h-10 rounded-md transition-all duration-75
        border-2 flex items-center justify-center
        ${isDownbeat ? 'border-l-4' : ''}
        ${isCurrent ? 'ring-2 ring-yellow-400 ring-offset-1' : ''}
        ${
          active
            ? accent
              ? 'border-white shadow-lg scale-105'
              : 'border-transparent'
            : 'border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
        }
      `}
      style={{
        backgroundColor: active ? color : undefined,
        opacity: active ? (accent ? 1 : 0.7) : undefined,
      }}
    >
      {active && accent && (
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      )}
    </button>
  );
}

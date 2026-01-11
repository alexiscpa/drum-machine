import { useState } from 'react';
import { useTransportStore } from '../../stores';
import { useDarkMode } from '../../hooks/useDarkMode';

export function Header() {
  const tempo = useTransportStore((s) => s.tempo);
  const isPlaying = useTransportStore((s) => s.isPlaying);
  const currentMeasure = useTransportStore((s) => s.currentMeasure);
  const currentStep = useTransportStore((s) => s.currentStep);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const { isDark, toggle: toggleDarkMode } = useDarkMode();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                吉他練習鼓機
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Guitar Practice Drum Machine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Status indicators */}
            <div className="hidden sm:flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-500 dark:text-gray-400">BPM</span>
                <span className="font-bold text-lg text-gray-900 dark:text-gray-100">
                  {tempo}
                </span>
              </div>

              {isPlaying && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-gray-500 dark:text-gray-400">
                    小節 {currentMeasure + 1} | 步進 {currentStep + 1}
                  </span>
                </div>
              )}
            </div>

            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              title={isDark ? '切換淺色模式' : '切換深色模式'}
            >
              {isDark ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Keyboard shortcuts help */}
            <div className="relative">
              <button
                onClick={() => setShowShortcuts(!showShortcuts)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                title="鍵盤快捷鍵"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>

              {showShortcuts && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 z-50">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    鍵盤快捷鍵
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">播放/停止</span>
                      <kbd className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">Space</kbd>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">重置</span>
                      <kbd className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">R</kbd>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">節拍器開/關</span>
                      <kbd className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">M</kbd>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">加速 (+5 BPM)</span>
                      <kbd className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">↑</kbd>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">減速 (-5 BPM)</span>
                      <kbd className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">↓</kbd>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">節拍消隱開/關</span>
                      <kbd className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">C</kbd>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">深色/淺色模式</span>
                      <kbd className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">D</kbd>
                    </li>
                  </ul>
                  <p className="mt-3 text-xs text-gray-500 dark:text-gray-500">
                    按住 Shift 可微調 BPM (±1)
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

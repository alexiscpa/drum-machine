import { useEffect, useState, useRef } from 'react';
import { useAudioEngine } from './hooks/useAudioEngine';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useDarkMode } from './hooks/useDarkMode';
import { usePatternStore } from './stores';
import { PRESET_PATTERNS } from './data/presetPatterns';
import { Header } from './components/layout';
import { TransportControls, TempoControl, TimeSignatureSelector } from './components/transport';
import { PatternGrid, PatternPresets } from './components/pattern';
import { InstrumentPanel } from './components/instruments';
import { PracticePanel } from './components/practice';
import { BeatIndicator } from './components/visualization';
import { PresetManager } from './components/presets';

type Tab = 'patterns' | 'instruments' | 'practice' | 'presets';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('patterns');
  const { initEngine } = useAudioEngine();
  const { toggle: toggleDarkMode } = useDarkMode();
  const loadPreset = usePatternStore((s) => s.loadPreset);
  const hasLoadedDefault = useRef(false);
  useKeyboardShortcuts(toggleDarkMode);

  // Load default pattern on mount
  useEffect(() => {
    if (!hasLoadedDefault.current) {
      const defaultPreset = PRESET_PATTERNS.find((p) => p.id === 'pop-basic');
      if (defaultPreset) {
        loadPreset(defaultPreset);
      }
      hasLoadedDefault.current = true;
    }
  }, [loadPreset]);

  // Initialize audio on first interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      initEngine();
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [initEngine]);

  const tabs: Array<{ id: Tab; label: string }> = [
    { id: 'patterns', label: '節奏' },
    { id: 'instruments', label: '樂器' },
    { id: 'practice', label: '練習' },
    { id: 'presets', label: '預設' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Transport section */}
        <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <TransportControls />
            <div className="flex-1">
              <TempoControl />
            </div>
            <TimeSignatureSelector />
          </div>
        </div>

        {/* Beat indicator */}
        <div className="mb-6">
          <BeatIndicator />
        </div>

        {/* Tab navigation for mobile */}
        <div className="lg:hidden mb-4">
          <div className="flex bg-white dark:bg-gray-800 rounded-xl p-1 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-6">
          {/* Left column - Pattern editor */}
          <div className={`lg:col-span-2 space-y-6 ${activeTab !== 'patterns' ? 'hidden lg:block' : ''}`}>
            <PatternGrid />
            <PatternPresets />
          </div>

          {/* Right column - Controls */}
          <div className="space-y-6 mt-6 lg:mt-0">
            {/* Show all on desktop, tab-based on mobile */}
            <div className={`${activeTab !== 'instruments' ? 'hidden lg:block' : ''}`}>
              <InstrumentPanel />
            </div>

            <div className={`${activeTab !== 'practice' ? 'hidden lg:block' : ''}`}>
              <PracticePanel />
            </div>

            <div className={`${activeTab !== 'presets' ? 'hidden lg:block' : ''}`}>
              <PresetManager />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-500">
          <p>吉他練習鼓機 - 專為吉他彈唱練習設計</p>
          <p className="mt-1">點擊或觸碰螢幕以啟用音訊</p>
        </footer>
      </main>
    </div>
  );
}

export default App;

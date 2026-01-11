import { useEffect, useCallback } from 'react';
import { useTransportStore, usePracticeStore, usePresetStore } from '../stores';

/**
 * Hook for global keyboard shortcuts
 *
 * Shortcuts:
 * - Space: Play/Stop
 * - R: Reset to beginning
 * - M: Toggle metronome
 * - D: Toggle dark mode
 * - Arrow Up / +: Increase tempo by 5
 * - Arrow Down / -: Decrease tempo by 5
 * - Shift + Arrow Up: Increase tempo by 1
 * - Shift + Arrow Down: Decrease tempo by 1
 * - C: Toggle cutout practice mode
 */
export function useKeyboardShortcuts(toggleDarkMode?: () => void) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Ignore if typing in an input field
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement ||
      e.target instanceof HTMLSelectElement
    ) {
      return;
    }

    // Get fresh state directly from stores to avoid stale closures
    const transportStore = useTransportStore.getState();
    const presetStore = usePresetStore.getState();
    const practiceStore = usePracticeStore.getState();

    switch (e.code) {
      case 'Space':
        e.preventDefault();
        transportStore.toggle();
        break;

      case 'KeyR':
        if (!e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          transportStore.stop();
        }
        break;

      case 'KeyM':
        if (!e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          presetStore.setMetronomeEnabled(!presetStore.metronome.enabled);
        }
        break;

      case 'ArrowUp':
      case 'NumpadAdd':
        e.preventDefault();
        transportStore.incrementTempo(e.shiftKey ? 1 : 5);
        break;

      case 'ArrowDown':
      case 'NumpadSubtract':
        e.preventDefault();
        transportStore.incrementTempo(e.shiftKey ? -1 : -5);
        break;

      case 'Equal': // + key
        if (!e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          transportStore.incrementTempo(e.shiftKey ? 1 : 5);
        }
        break;

      case 'Minus': // - key
        if (!e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          transportStore.incrementTempo(e.shiftKey ? -1 : -5);
        }
        break;

      case 'KeyC':
        if (!e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          practiceStore.setCutoutEnabled(!practiceStore.cutout.enabled);
        }
        break;

      case 'KeyD':
        if (!e.ctrlKey && !e.metaKey && toggleDarkMode) {
          e.preventDefault();
          toggleDarkMode();
        }
        break;
    }
  }, [toggleDarkMode]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}

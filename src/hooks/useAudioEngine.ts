import { useEffect, useRef, useCallback } from 'react';
import { getAudioEngine } from '../audio';
import {
  useTransportStore,
  usePatternStore,
  useInstrumentStore,
  usePracticeStore,
  usePresetStore,
} from '../stores';

/**
 * Hook to manage the audio engine lifecycle and synchronize it with React state.
 *
 * This hook:
 * 1. Initializes the audio engine on first user interaction
 * 2. Subscribes to store changes and updates the engine
 * 3. Registers callbacks for UI updates
 * 4. Handles practice mode logic (cutout, progressive tempo)
 */
export function useAudioEngine() {
  const engineRef = useRef(getAudioEngine());
  const initializedRef = useRef(false);

  // Transport state
  const isPlaying = useTransportStore((s) => s.isPlaying);
  const tempo = useTransportStore((s) => s.tempo);
  const timeSignature = useTransportStore((s) => s.timeSignature);
  const swing = useTransportStore((s) => s.swing);
  const setPosition = useTransportStore((s) => s.setPosition);
  const setTempo = useTransportStore((s) => s.setTempo);
  const incrementTempo = useTransportStore((s) => s.incrementTempo);

  // Pattern state
  const patterns = usePatternStore((s) => s.patterns);
  const measures = usePatternStore((s) => s.measures);

  // Instrument state
  const instrumentSettings = useInstrumentStore((s) => s.settings);
  const soloedInstrument = useInstrumentStore((s) => s.soloedInstrument);
  const kit = useInstrumentStore((s) => s.kit);

  // Practice state
  const cutout = usePracticeStore((s) => s.cutout);
  const currentCutoutPhase = usePracticeStore((s) => s.currentCutoutPhase);
  const progressive = usePracticeStore((s) => s.progressive);
  const advanceCutoutPhase = usePracticeStore((s) => s.advanceCutoutPhase);
  const advanceProgressiveMeasure = usePracticeStore((s) => s.advanceProgressiveMeasure);

  // Metronome state
  const metronome = usePresetStore((s) => s.metronome);

  // Initialize audio engine
  const initEngine = useCallback(async () => {
    if (initializedRef.current) return;

    try {
      await engineRef.current.init();
      initializedRef.current = true;
    } catch (error) {
      console.error('Failed to initialize audio engine:', error);
    }
  }, []);

  // Ensure engine is initialized and resumed on user interaction
  useEffect(() => {
    const handleUserGesture = async () => {
      if (!initializedRef.current) {
        await initEngine();
      } else {
        await engineRef.current.resume();
      }
    };

    // Listen for user interaction to initialize audio
    document.addEventListener('click', handleUserGesture, { once: false });
    document.addEventListener('touchstart', handleUserGesture, { once: false });
    document.addEventListener('keydown', handleUserGesture, { once: false });

    return () => {
      document.removeEventListener('click', handleUserGesture);
      document.removeEventListener('touchstart', handleUserGesture);
      document.removeEventListener('keydown', handleUserGesture);
    };
  }, [initEngine]);

  // Update engine when tempo changes
  useEffect(() => {
    engineRef.current.setTempo(tempo);
  }, [tempo]);

  // Update engine when time signature changes
  useEffect(() => {
    engineRef.current.setTimeSignature(timeSignature);
  }, [timeSignature]);

  // Update engine when swing changes
  useEffect(() => {
    engineRef.current.setSwing(swing);
  }, [swing]);

  // Update engine when patterns change
  useEffect(() => {
    engineRef.current.setPatterns(patterns);
  }, [patterns]);

  // Update engine when measures change
  useEffect(() => {
    engineRef.current.setTotalMeasures(measures);
  }, [measures]);

  // Update engine when instrument settings change
  useEffect(() => {
    engineRef.current.setInstrumentSettings(instrumentSettings);
  }, [instrumentSettings]);

  // Update engine when solo changes
  useEffect(() => {
    engineRef.current.setSoloedInstrument(soloedInstrument);
  }, [soloedInstrument]);

  // Update engine when kit changes
  useEffect(() => {
    engineRef.current.setKit(kit);
  }, [kit]);

  // Update engine when metronome settings change
  useEffect(() => {
    engineRef.current.setMetronomeEnabled(metronome.enabled);
    engineRef.current.setMetronomeVolume(metronome.volume);
    engineRef.current.setMetronomeSound(metronome.clickSound);
  }, [metronome]);

  // Handle cutout mode - mute/unmute
  useEffect(() => {
    if (cutout.enabled) {
      engineRef.current.setMuted(currentCutoutPhase === 'mute');
    } else {
      engineRef.current.setMuted(false);
    }
  }, [cutout.enabled, currentCutoutPhase]);

  // Register UI step callback
  useEffect(() => {
    const unsubscribe = engineRef.current.onStep((step, measure) => {
      setPosition(step, measure);
    });

    return unsubscribe;
  }, [setPosition]);

  // Register measure callback for practice features
  useEffect(() => {
    const unsubscribe = engineRef.current.onMeasure(() => {
      // Handle cutout phase advance
      if (cutout.enabled) {
        advanceCutoutPhase();
      }

      // Handle progressive tempo
      if (progressive.enabled) {
        const increment = advanceProgressiveMeasure();
        if (increment !== null) {
          // Check if we haven't reached target
          const currentTempo = useTransportStore.getState().tempo;
          if (progressive.startTempo < progressive.targetTempo) {
            // Increasing tempo
            if (currentTempo < progressive.targetTempo) {
              incrementTempo(increment);
            }
          } else {
            // Decreasing tempo
            if (currentTempo > progressive.targetTempo) {
              incrementTempo(-increment);
            }
          }
        }
      }
    });

    return unsubscribe;
  }, [cutout.enabled, progressive.enabled, progressive.startTempo, progressive.targetTempo, advanceCutoutPhase, advanceProgressiveMeasure, incrementTempo]);

  // Handle play/stop
  useEffect(() => {
    if (isPlaying) {
      // Set initial tempo for progressive mode
      if (progressive.enabled) {
        setTempo(progressive.startTempo);
      }
      engineRef.current.start();
    } else {
      engineRef.current.stop();
    }
  }, [isPlaying, progressive.enabled, progressive.startTempo, setTempo]);

  return {
    engine: engineRef.current,
    initEngine,
    isInitialized: initializedRef.current,
  };
}

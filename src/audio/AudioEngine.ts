import { Scheduler, type StepCallback, type MeasureCallback } from './Scheduler';
import { SynthDrums } from './SynthDrums';
import { Metronome, type ClickSound } from './Metronome';
import type {
  InstrumentId,
  InstrumentSettings,
  DrumKit,
  StepPattern,
  TimeSignature,
} from '../types';

export type UIStepCallback = (step: number, measure: number) => void;

/**
 * Main audio engine that orchestrates all audio components.
 *
 * Responsibilities:
 * - Manages AudioContext lifecycle
 * - Coordinates Scheduler, SynthDrums, and Metronome
 * - Handles instrument routing and mixing
 * - Provides UI callbacks for step visualization
 */
export class AudioEngine {
  private context: AudioContext | null = null;
  private scheduler: Scheduler | null = null;
  private drums: SynthDrums | null = null;
  private metronome: Metronome | null = null;

  // Audio nodes
  private masterGain: GainNode | null = null;
  private instrumentGains: Map<InstrumentId, GainNode> = new Map();

  // Configuration
  private patterns: Record<InstrumentId, StepPattern> = {} as Record<InstrumentId, StepPattern>;
  private instrumentSettings: Record<InstrumentId, InstrumentSettings> = {} as Record<InstrumentId, InstrumentSettings>;
  private soloedInstrument: InstrumentId | null = null;
  private timeSignature: TimeSignature = '4/4';
  private metronomeEnabled: boolean = false;
  private isMuted: boolean = false;

  // Callbacks
  private uiStepCallbacks: UIStepCallback[] = [];
  private uiMeasureCallbacks: MeasureCallback[] = [];

  // Notes queue for UI synchronization (decoupled from audio timing)
  private notesQueue: Array<{ step: number; measure: number; time: number }> = [];

  /**
   * Initialize the audio engine. Must be called after a user gesture.
   */
  async init(): Promise<void> {
    if (this.context) return;

    this.context = new AudioContext({ latencyHint: 'interactive' });

    // Resume if suspended (required by some browsers)
    if (this.context.state === 'suspended') {
      await this.context.resume();
    }

    // Create master gain
    this.masterGain = this.context.createGain();
    this.masterGain.connect(this.context.destination);

    // Create instrument gain nodes
    const instrumentIds: InstrumentId[] = [
      'kick', 'snare', 'hihat-closed', 'hihat-open',
      'ride', 'crash', 'tom-high', 'tom-mid', 'tom-low'
    ];

    instrumentIds.forEach((id) => {
      const gain = this.context!.createGain();
      gain.connect(this.masterGain!);
      this.instrumentGains.set(id, gain);
    });

    // Initialize components
    this.scheduler = new Scheduler(this.context);
    this.drums = new SynthDrums(this.context, this.masterGain);
    this.metronome = new Metronome(this.context, this.masterGain);

    // Register scheduler callbacks
    this.scheduler.onStep(this.handleStep);
    this.scheduler.onMeasure(this.handleMeasure);

    // Start animation frame loop for UI updates
    this.startUILoop();
  }

  /**
   * Ensure audio context is running (call on user interaction)
   */
  async resume(): Promise<void> {
    if (this.context?.state === 'suspended') {
      await this.context.resume();
    }
  }

  /**
   * Start playback
   */
  start(): void {
    if (!this.scheduler) {
      console.warn('AudioEngine not initialized');
      return;
    }
    this.scheduler.start();
  }

  /**
   * Stop playback
   */
  stop(): void {
    if (!this.scheduler) return;
    this.scheduler.stop();
    this.notesQueue = [];
  }

  /**
   * Reset to beginning
   */
  reset(): void {
    if (!this.scheduler) return;
    this.scheduler.reset();
    this.notesQueue = [];
  }

  /**
   * Check if currently playing
   */
  isPlaying(): boolean {
    return this.scheduler?.getIsRunning() ?? false;
  }

  // Configuration methods

  setTempo(bpm: number): void {
    this.scheduler?.setTempo(bpm);
  }

  setTimeSignature(sig: TimeSignature): void {
    this.timeSignature = sig;
    const config = {
      '3/4': { stepsPerMeasure: 12 },
      '4/4': { stepsPerMeasure: 16 },
      '6/8': { stepsPerMeasure: 12 },
      '5/4': { stepsPerMeasure: 20 },
    }[sig];
    this.scheduler?.setStepsPerMeasure(config.stepsPerMeasure);
  }

  setTotalMeasures(measures: number): void {
    this.scheduler?.setTotalMeasures(measures);
  }

  setSwing(value: number): void {
    this.scheduler?.setSwing(value);
  }

  setPatterns(patterns: Record<InstrumentId, StepPattern>): void {
    this.patterns = patterns;
  }

  setPattern(instrument: InstrumentId, pattern: StepPattern): void {
    this.patterns[instrument] = pattern;
  }

  setInstrumentSettings(settings: Record<InstrumentId, InstrumentSettings>): void {
    this.instrumentSettings = settings;
    this.updateGains();
  }

  setInstrumentSetting(instrument: InstrumentId, settings: InstrumentSettings): void {
    this.instrumentSettings[instrument] = settings;
    this.updateGain(instrument);
  }

  setSoloedInstrument(instrument: InstrumentId | null): void {
    this.soloedInstrument = instrument;
    this.updateGains();
  }

  setKit(kit: DrumKit): void {
    this.drums?.setKit(kit);
  }

  setMetronomeEnabled(enabled: boolean): void {
    this.metronomeEnabled = enabled;
  }

  setMetronomeVolume(volume: number): void {
    this.metronome?.setVolume(volume);
  }

  setMetronomeSound(sound: ClickSound): void {
    this.metronome?.setClickSound(sound);
  }

  setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (this.masterGain) {
      this.masterGain.gain.value = muted ? 0 : 1;
    }
  }

  // Gain management

  private updateGains(): void {
    this.instrumentGains.forEach((_, id) => {
      this.updateGain(id);
    });
  }

  private updateGain(instrument: InstrumentId): void {
    const gain = this.instrumentGains.get(instrument);
    if (!gain) return;

    const settings = this.instrumentSettings[instrument];
    if (!settings) {
      gain.gain.value = 0.8;
      return;
    }

    // Handle mute/solo logic
    let shouldPlay = !settings.muted;

    if (this.soloedInstrument !== null) {
      shouldPlay = instrument === this.soloedInstrument;
    }

    gain.gain.value = shouldPlay ? settings.volume : 0;
  }

  // Scheduler callbacks

  private handleStep: StepCallback = (step, measure, time) => {
    // Queue for UI update
    this.notesQueue.push({ step, measure, time });

    // Play metronome on beat
    if (this.metronomeEnabled && this.metronome) {
      const stepsPerBeat = this.getStepsPerBeat();
      if (step % stepsPerBeat === 0) {
        const isDownbeat = step === 0;
        this.metronome.click(time, isDownbeat);
      }
    }

    // Play drum sounds
    if (this.drums && !this.isMuted) {
      const instrumentIds: InstrumentId[] = [
        'kick', 'snare', 'hihat-closed', 'hihat-open',
        'ride', 'crash', 'tom-high', 'tom-mid', 'tom-low'
      ];

      instrumentIds.forEach((id) => {
        const pattern = this.patterns[id];
        if (!pattern) return;

        const totalSteps = pattern.length;
        const globalStep = measure * this.getStepsPerMeasure() + step;
        const patternStep = globalStep % totalSteps;

        const stepData = pattern[patternStep];
        if (stepData?.active) {
          const velocity = stepData.accent ? 1.0 : stepData.velocity;
          const gain = this.instrumentGains.get(id);
          this.drums!.trigger(id, time, velocity, gain || undefined);
        }
      });
    }
  };

  private handleMeasure: MeasureCallback = (measure, time) => {
    // Trigger measure callbacks
    this.uiMeasureCallbacks.forEach((cb) => cb(measure, time));
  };

  private getStepsPerBeat(): number {
    const config = {
      '3/4': 4,
      '4/4': 4,
      '6/8': 2,
      '5/4': 4,
    };
    return config[this.timeSignature];
  }

  private getStepsPerMeasure(): number {
    const config = {
      '3/4': 12,
      '4/4': 16,
      '6/8': 12,
      '5/4': 20,
    };
    return config[this.timeSignature];
  }

  // UI synchronization

  private startUILoop(): void {
    const processQueue = () => {
      if (!this.context) return;

      const currentTime = this.context.currentTime;

      // Process notes that should have played by now
      while (this.notesQueue.length > 0 && this.notesQueue[0].time <= currentTime) {
        const note = this.notesQueue.shift()!;
        this.uiStepCallbacks.forEach((cb) => cb(note.step, note.measure));
      }

      requestAnimationFrame(processQueue);
    };

    requestAnimationFrame(processQueue);
  }

  // Callback registration

  onStep(callback: UIStepCallback): () => void {
    this.uiStepCallbacks.push(callback);
    return () => {
      const index = this.uiStepCallbacks.indexOf(callback);
      if (index > -1) {
        this.uiStepCallbacks.splice(index, 1);
      }
    };
  }

  onMeasure(callback: MeasureCallback): () => void {
    this.uiMeasureCallbacks.push(callback);
    return () => {
      const index = this.uiMeasureCallbacks.indexOf(callback);
      if (index > -1) {
        this.uiMeasureCallbacks.splice(index, 1);
      }
    };
  }

  // Cleanup

  dispose(): void {
    this.stop();
    this.context?.close();
    this.context = null;
    this.scheduler = null;
    this.drums = null;
    this.metronome = null;
    this.masterGain = null;
    this.instrumentGains.clear();
    this.uiStepCallbacks = [];
    this.uiMeasureCallbacks = [];
    this.notesQueue = [];
  }
}

// Singleton instance
let engineInstance: AudioEngine | null = null;

export function getAudioEngine(): AudioEngine {
  if (!engineInstance) {
    engineInstance = new AudioEngine();
  }
  return engineInstance;
}

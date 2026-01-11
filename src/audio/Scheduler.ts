export type StepCallback = (step: number, measure: number, time: number) => void;
export type MeasureCallback = (measure: number, time: number) => void;

interface SchedulerConfig {
  tempo: number;
  stepsPerMeasure: number;
  totalMeasures: number;
  swing: number;
}

/**
 * Audio Scheduler using the two-clock approach for precise timing.
 *
 * The scheduler uses:
 * 1. AudioContext.currentTime for precise scheduling (hardware clock)
 * 2. setTimeout for the lookahead loop (JavaScript clock)
 *
 * Notes are scheduled slightly ahead of time to ensure smooth playback
 * even when the main thread is busy with UI updates.
 */
export class Scheduler {
  private audioContext: AudioContext;
  private isRunning: boolean = false;
  private timerId: number | null = null;

  // Timing
  private tempo: number = 120;
  private stepsPerMeasure: number = 16;
  private totalMeasures: number = 1;
  private swing: number = 50;

  // Position
  private currentStep: number = 0;
  private currentMeasure: number = 0;
  private nextStepTime: number = 0;

  // Timing constants
  private readonly LOOKAHEAD_MS = 25;        // Check every 25ms
  private readonly SCHEDULE_AHEAD_SEC = 0.1; // Schedule 100ms ahead

  // Callbacks
  private stepCallbacks: StepCallback[] = [];
  private measureCallbacks: MeasureCallback[] = [];

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
  }

  /**
   * Start the scheduler from the beginning
   */
  start(): void {
    if (this.isRunning) return;

    this.isRunning = true;
    this.currentStep = 0;
    this.currentMeasure = 0;
    this.nextStepTime = this.audioContext.currentTime;
    this.schedule();
  }

  /**
   * Stop the scheduler
   */
  stop(): void {
    this.isRunning = false;
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  /**
   * Reset position to beginning without stopping
   */
  reset(): void {
    this.currentStep = 0;
    this.currentMeasure = 0;
    if (this.isRunning) {
      this.nextStepTime = this.audioContext.currentTime;
    }
  }

  /**
   * Main scheduling loop
   */
  private schedule = (): void => {
    if (!this.isRunning) return;

    // Schedule all notes within the lookahead window
    while (this.nextStepTime < this.audioContext.currentTime + this.SCHEDULE_AHEAD_SEC) {
      this.scheduleStep(this.currentStep, this.currentMeasure, this.nextStepTime);
      this.advanceStep();
    }

    // Schedule next check using setTimeout
    this.timerId = window.setTimeout(this.schedule, this.LOOKAHEAD_MS);
  };

  /**
   * Trigger callbacks for a step
   */
  private scheduleStep(step: number, measure: number, time: number): void {
    // Notify all step callbacks
    this.stepCallbacks.forEach((cb) => cb(step, measure, time));

    // Check if this is the first step of a measure
    if (step === 0) {
      this.measureCallbacks.forEach((cb) => cb(measure, time));
    }
  }

  /**
   * Move to the next step
   */
  private advanceStep(): void {
    const secondsPerBeat = 60.0 / this.tempo;
    const secondsPerStep = secondsPerBeat / 4; // 16th note subdivisions

    // Apply swing to odd 16th notes (steps 1, 3, 5, 7, etc.)
    let stepDuration = secondsPerStep;
    if (this.swing !== 50 && this.currentStep % 2 === 0) {
      // Even step (on the beat) - adjust duration based on swing
      const swingRatio = this.swing / 100;
      stepDuration = secondsPerStep * (1 + (swingRatio - 0.5));
    } else if (this.swing !== 50 && this.currentStep % 2 === 1) {
      // Odd step (off the beat) - compensate
      const swingRatio = this.swing / 100;
      stepDuration = secondsPerStep * (1 - (swingRatio - 0.5));
    }

    this.nextStepTime += stepDuration;
    this.currentStep++;

    // Check for measure boundary
    if (this.currentStep >= this.stepsPerMeasure) {
      this.currentStep = 0;
      this.currentMeasure++;

      // Loop back if we've reached the end
      if (this.currentMeasure >= this.totalMeasures) {
        this.currentMeasure = 0;
      }
    }
  }

  // Configuration methods

  setTempo(bpm: number): void {
    this.tempo = Math.max(40, Math.min(240, bpm));
  }

  getTempo(): number {
    return this.tempo;
  }

  setStepsPerMeasure(steps: number): void {
    this.stepsPerMeasure = steps;
  }

  setTotalMeasures(measures: number): void {
    this.totalMeasures = measures;
  }

  setSwing(value: number): void {
    this.swing = Math.max(0, Math.min(100, value));
  }

  configure(config: Partial<SchedulerConfig>): void {
    if (config.tempo !== undefined) this.setTempo(config.tempo);
    if (config.stepsPerMeasure !== undefined) this.setStepsPerMeasure(config.stepsPerMeasure);
    if (config.totalMeasures !== undefined) this.setTotalMeasures(config.totalMeasures);
    if (config.swing !== undefined) this.setSwing(config.swing);
  }

  // Callback registration

  onStep(callback: StepCallback): () => void {
    this.stepCallbacks.push(callback);
    return () => {
      const index = this.stepCallbacks.indexOf(callback);
      if (index > -1) {
        this.stepCallbacks.splice(index, 1);
      }
    };
  }

  onMeasure(callback: MeasureCallback): () => void {
    this.measureCallbacks.push(callback);
    return () => {
      const index = this.measureCallbacks.indexOf(callback);
      if (index > -1) {
        this.measureCallbacks.splice(index, 1);
      }
    };
  }

  // State getters

  getIsRunning(): boolean {
    return this.isRunning;
  }

  getCurrentStep(): number {
    return this.currentStep;
  }

  getCurrentMeasure(): number {
    return this.currentMeasure;
  }

  getNextStepTime(): number {
    return this.nextStepTime;
  }
}

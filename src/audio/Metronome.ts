export type ClickSound = 'beep' | 'wood' | 'stick';

/**
 * Metronome click sound generator using Web Audio API synthesis.
 */
export class Metronome {
  private context: AudioContext;
  private masterGain: GainNode;
  private clickSound: ClickSound = 'beep';

  constructor(context: AudioContext, destination: AudioNode) {
    this.context = context;
    this.masterGain = context.createGain();
    this.masterGain.gain.value = 0.5;
    this.masterGain.connect(destination);
  }

  setClickSound(sound: ClickSound): void {
    this.clickSound = sound;
  }

  setVolume(volume: number): void {
    this.masterGain.gain.value = Math.max(0, Math.min(1, volume));
  }

  /**
   * Play a metronome click
   * @param time - AudioContext time to play at
   * @param isDownbeat - Whether this is the first beat of the measure (accented)
   */
  click(time: number, isDownbeat: boolean = false): void {
    switch (this.clickSound) {
      case 'beep':
        this.playBeep(time, isDownbeat);
        break;
      case 'wood':
        this.playWood(time, isDownbeat);
        break;
      case 'stick':
        this.playStick(time, isDownbeat);
        break;
    }
  }

  private playBeep(time: number, isDownbeat: boolean): void {
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.type = 'sine';
    osc.frequency.value = isDownbeat ? 1000 : 800;

    gain.gain.setValueAtTime(isDownbeat ? 1 : 0.7, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.06);
  }

  private playWood(time: number, isDownbeat: boolean): void {
    // Synthesized wood block using filtered noise burst
    const bufferSize = this.context.sampleRate * 0.03;
    const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.context.createBufferSource();
    noise.buffer = buffer;

    const filter = this.context.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = isDownbeat ? 2500 : 2000;
    filter.Q.value = 15;

    const gain = this.context.createGain();
    gain.gain.setValueAtTime(isDownbeat ? 1 : 0.7, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.03);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(time);
    noise.stop(time + 0.04);
  }

  private playStick(time: number, isDownbeat: boolean): void {
    // Drum stick click using two short oscillators
    const osc1 = this.context.createOscillator();
    const osc2 = this.context.createOscillator();

    osc1.type = 'triangle';
    osc2.type = 'square';

    osc1.frequency.value = isDownbeat ? 3000 : 2500;
    osc2.frequency.value = isDownbeat ? 4500 : 4000;

    const gain = this.context.createGain();
    gain.gain.setValueAtTime(isDownbeat ? 0.4 : 0.3, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.02);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain);

    osc1.start(time);
    osc1.stop(time + 0.025);
    osc2.start(time);
    osc2.stop(time + 0.025);
  }
}

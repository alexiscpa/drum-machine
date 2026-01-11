import type { InstrumentId, DrumKit } from '../types';

/**
 * Synthesized drum sounds using Web Audio API oscillators and noise.
 * Based on classic drum synthesis techniques.
 */

// Pre-generated noise buffer for snare/hi-hat
let noiseBuffer: AudioBuffer | null = null;

function getNoiseBuffer(context: AudioContext): AudioBuffer {
  if (noiseBuffer && noiseBuffer.sampleRate === context.sampleRate) {
    return noiseBuffer;
  }

  const bufferSize = context.sampleRate * 0.5; // 0.5 seconds of noise
  noiseBuffer = context.createBuffer(1, bufferSize, context.sampleRate);
  const output = noiseBuffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }

  return noiseBuffer;
}

// Drum kit parameters for different sounds
interface KitParams {
  kick: { pitch: number; decay: number; click: number };
  snare: { pitch: number; noise: number; decay: number };
  hihat: { openness: number; decay: number };
  tom: { pitch: number; decay: number };
  ride: { pitch: number; decay: number };
  crash: { pitch: number; decay: number };
}

const KIT_PARAMS: Record<DrumKit, KitParams> = {
  acoustic: {
    kick: { pitch: 150, decay: 0.5, click: 0.3 },
    snare: { pitch: 185, noise: 0.8, decay: 0.2 },
    hihat: { openness: 1, decay: 0.05 },
    tom: { pitch: 1, decay: 0.3 },
    ride: { pitch: 1, decay: 0.8 },
    crash: { pitch: 1, decay: 1.2 },
  },
  electronic: {
    kick: { pitch: 100, decay: 0.4, click: 0.5 },
    snare: { pitch: 200, noise: 0.5, decay: 0.15 },
    hihat: { openness: 0.5, decay: 0.03 },
    tom: { pitch: 1.2, decay: 0.25 },
    ride: { pitch: 1.3, decay: 0.6 },
    crash: { pitch: 1.2, decay: 0.8 },
  },
  percussion: {
    kick: { pitch: 120, decay: 0.3, click: 0.2 },
    snare: { pitch: 250, noise: 0.6, decay: 0.1 },
    hihat: { openness: 0.8, decay: 0.04 },
    tom: { pitch: 0.9, decay: 0.35 },
    ride: { pitch: 0.9, decay: 0.5 },
    crash: { pitch: 0.8, decay: 1.0 },
  },
};

export class SynthDrums {
  private context: AudioContext;
  private kit: DrumKit = 'acoustic';
  private masterGain: GainNode;

  constructor(context: AudioContext, destination: AudioNode) {
    this.context = context;
    this.masterGain = context.createGain();
    this.masterGain.connect(destination);
  }

  setKit(kit: DrumKit): void {
    this.kit = kit;
  }

  /**
   * Trigger a drum sound
   */
  trigger(
    instrument: InstrumentId,
    time: number,
    velocity: number = 0.8,
    output?: GainNode
  ): void {
    const dest = output || this.masterGain;

    switch (instrument) {
      case 'kick':
        this.playKick(time, velocity, dest);
        break;
      case 'snare':
        this.playSnare(time, velocity, dest);
        break;
      case 'hihat-closed':
        this.playHiHat(time, velocity, false, dest);
        break;
      case 'hihat-open':
        this.playHiHat(time, velocity, true, dest);
        break;
      case 'ride':
        this.playRide(time, velocity, dest);
        break;
      case 'crash':
        this.playCrash(time, velocity, dest);
        break;
      case 'tom-high':
        this.playTom(time, velocity, 'high', dest);
        break;
      case 'tom-mid':
        this.playTom(time, velocity, 'mid', dest);
        break;
      case 'tom-low':
        this.playTom(time, velocity, 'low', dest);
        break;
    }
  }

  private playKick(time: number, velocity: number, dest: GainNode): void {
    const params = KIT_PARAMS[this.kit].kick;

    // Main body oscillator (sine wave with pitch envelope)
    const osc = this.context.createOscillator();
    osc.type = 'sine';

    const oscGain = this.context.createGain();

    // Frequency envelope: high -> low
    osc.frequency.setValueAtTime(params.pitch, time);
    osc.frequency.exponentialRampToValueAtTime(30, time + params.decay);

    // Amplitude envelope
    oscGain.gain.setValueAtTime(velocity, time);
    oscGain.gain.exponentialRampToValueAtTime(0.001, time + params.decay);

    // Click component (triangle wave for attack)
    const clickOsc = this.context.createOscillator();
    clickOsc.type = 'triangle';
    const clickGain = this.context.createGain();

    clickOsc.frequency.setValueAtTime(params.pitch * 3, time);
    clickOsc.frequency.exponentialRampToValueAtTime(30, time + 0.02);

    clickGain.gain.setValueAtTime(velocity * params.click, time);
    clickGain.gain.exponentialRampToValueAtTime(0.001, time + 0.02);

    // Connect and schedule
    osc.connect(oscGain);
    clickOsc.connect(clickGain);
    oscGain.connect(dest);
    clickGain.connect(dest);

    osc.start(time);
    osc.stop(time + params.decay + 0.1);
    clickOsc.start(time);
    clickOsc.stop(time + 0.03);
  }

  private playSnare(time: number, velocity: number, dest: GainNode): void {
    const params = KIT_PARAMS[this.kit].snare;

    // Body: two triangle oscillators
    const osc1 = this.context.createOscillator();
    const osc2 = this.context.createOscillator();
    osc1.type = 'triangle';
    osc2.type = 'triangle';
    osc1.frequency.value = params.pitch;
    osc2.frequency.value = params.pitch * 1.89; // ~349Hz ratio

    const oscGain = this.context.createGain();
    oscGain.gain.setValueAtTime(velocity * 0.5, time);
    oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

    // Noise component for snare rattle
    const noise = this.context.createBufferSource();
    noise.buffer = getNoiseBuffer(this.context);

    const noiseFilter = this.context.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.value = 1000;

    const noiseGain = this.context.createGain();
    noiseGain.gain.setValueAtTime(velocity * params.noise, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, time + params.decay);

    // Connect
    osc1.connect(oscGain);
    osc2.connect(oscGain);
    oscGain.connect(dest);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(dest);

    // Start and stop
    osc1.start(time);
    osc1.stop(time + 0.1);
    osc2.start(time);
    osc2.stop(time + 0.1);
    noise.start(time);
    noise.stop(time + params.decay + 0.1);
  }

  private playHiHat(time: number, velocity: number, isOpen: boolean, dest: GainNode): void {
    const params = KIT_PARAMS[this.kit].hihat;
    const decayTime = isOpen ? params.decay * 6 : params.decay;

    // Noise source
    const noise = this.context.createBufferSource();
    noise.buffer = getNoiseBuffer(this.context);

    // Highpass filter for metallic sound
    const hpFilter = this.context.createBiquadFilter();
    hpFilter.type = 'highpass';
    hpFilter.frequency.value = 5000;

    // Bandpass for additional shaping
    const bpFilter = this.context.createBiquadFilter();
    bpFilter.type = 'bandpass';
    bpFilter.frequency.value = 10000;
    bpFilter.Q.value = 1;

    const gain = this.context.createGain();
    gain.gain.setValueAtTime(velocity * 0.3, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + decayTime);

    // Connect
    noise.connect(hpFilter);
    hpFilter.connect(bpFilter);
    bpFilter.connect(gain);
    gain.connect(dest);

    noise.start(time);
    noise.stop(time + decayTime + 0.1);
  }

  private playRide(time: number, velocity: number, dest: GainNode): void {
    const params = KIT_PARAMS[this.kit].ride;

    // Multiple sine waves for bell-like tone
    const frequencies = [300, 450, 600, 800].map(f => f * params.pitch);

    frequencies.forEach((freq, i) => {
      const osc = this.context.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;

      const gain = this.context.createGain();
      const vol = velocity * 0.15 * (1 - i * 0.2);
      gain.gain.setValueAtTime(vol, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + params.decay * (1 - i * 0.15));

      osc.connect(gain);
      gain.connect(dest);

      osc.start(time);
      osc.stop(time + params.decay + 0.1);
    });

    // Add some noise for shimmer
    const noise = this.context.createBufferSource();
    noise.buffer = getNoiseBuffer(this.context);

    const noiseFilter = this.context.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 8000;
    noiseFilter.Q.value = 2;

    const noiseGain = this.context.createGain();
    noiseGain.gain.setValueAtTime(velocity * 0.08, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, time + params.decay * 0.5);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(dest);

    noise.start(time);
    noise.stop(time + params.decay + 0.1);
  }

  private playCrash(time: number, velocity: number, dest: GainNode): void {
    const params = KIT_PARAMS[this.kit].crash;

    // Noise-based crash with filtering
    const noise = this.context.createBufferSource();
    noise.buffer = getNoiseBuffer(this.context);

    const lpFilter = this.context.createBiquadFilter();
    lpFilter.type = 'lowpass';
    lpFilter.frequency.value = 12000;

    const hpFilter = this.context.createBiquadFilter();
    hpFilter.type = 'highpass';
    hpFilter.frequency.value = 3000;

    const gain = this.context.createGain();
    gain.gain.setValueAtTime(velocity * 0.6, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + params.decay);

    // Some tonal components
    [400, 600, 900].forEach((freq) => {
      const osc = this.context.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq * params.pitch;

      const oscGain = this.context.createGain();
      oscGain.gain.setValueAtTime(velocity * 0.1, time);
      oscGain.gain.exponentialRampToValueAtTime(0.001, time + params.decay * 0.7);

      osc.connect(oscGain);
      oscGain.connect(dest);

      osc.start(time);
      osc.stop(time + params.decay + 0.1);
    });

    noise.connect(hpFilter);
    hpFilter.connect(lpFilter);
    lpFilter.connect(gain);
    gain.connect(dest);

    noise.start(time);
    noise.stop(time + params.decay + 0.1);
  }

  private playTom(
    time: number,
    velocity: number,
    type: 'high' | 'mid' | 'low',
    dest: GainNode
  ): void {
    const params = KIT_PARAMS[this.kit].tom;
    const basePitch = { high: 200, mid: 150, low: 100 }[type];
    const pitch = basePitch * params.pitch;

    // Main oscillator with pitch decay
    const osc = this.context.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(pitch * 1.5, time);
    osc.frequency.exponentialRampToValueAtTime(pitch, time + 0.05);

    const oscGain = this.context.createGain();
    oscGain.gain.setValueAtTime(velocity * 0.7, time);
    oscGain.gain.exponentialRampToValueAtTime(0.001, time + params.decay);

    // Attack transient
    const clickOsc = this.context.createOscillator();
    clickOsc.type = 'triangle';
    clickOsc.frequency.value = pitch * 2;

    const clickGain = this.context.createGain();
    clickGain.gain.setValueAtTime(velocity * 0.3, time);
    clickGain.gain.exponentialRampToValueAtTime(0.001, time + 0.02);

    // Connect
    osc.connect(oscGain);
    clickOsc.connect(clickGain);
    oscGain.connect(dest);
    clickGain.connect(dest);

    osc.start(time);
    osc.stop(time + params.decay + 0.1);
    clickOsc.start(time);
    clickOsc.stop(time + 0.03);
  }
}

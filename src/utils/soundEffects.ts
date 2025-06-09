// Sound effects utility for whale alerts
import { Howl, Howler } from 'howler';

// Sound effect instances
let whaleAlertSound: Howl | null = null;
let megaWhaleAlertSound: Howl | null = null;
let clickSound: Howl | null = null;

// Initialize sound effects
export const initSoundEffects = () => {
  // Regular whale alert sound (for transfers > $50K)
  whaleAlertSound = new Howl({
    src: ['/sounds/whale-alert.mp3'],
    volume: 0.5,
    preload: true,
  });

  // Mega whale alert sound (for transfers > $1M)
  megaWhaleAlertSound = new Howl({
    src: ['/sounds/mega-whale-alert.mp3'],
    volume: 0.7,
    preload: true,
  });

  // UI click sound
  clickSound = new Howl({
    src: ['/sounds/click.mp3'],
    volume: 0.3,
    preload: true,
  });
};

// Play whale alert sound based on transfer amount
export const playWhaleAlertSound = (amount: string) => {
  if (!whaleAlertSound || !megaWhaleAlertSound) {
    initSoundEffects();
  }

  const value = parseFloat(amount) / Math.pow(10, 6); // USDC has 6 decimals
  
  if (value >= 1000000) {
    // Play mega whale sound for transfers > $1M
    megaWhaleAlertSound?.play();
  } else if (value >= 50000) {
    // Play regular whale sound for transfers > $50K
    whaleAlertSound?.play();
  }
};

// Play UI click sound
export const playClickSound = () => {
  if (!clickSound) {
    initSoundEffects();
  }
  
  clickSound?.play();
};

// Sound settings
let soundEnabled = true;

export const toggleSound = (): boolean => {
  soundEnabled = !soundEnabled;
  
  // Mute/unmute all sounds
  Howler.mute(!soundEnabled);
  
  return soundEnabled;
};

export const isSoundEnabled = (): boolean => {
  return soundEnabled;
};

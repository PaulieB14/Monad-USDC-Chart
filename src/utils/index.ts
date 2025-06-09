// Utility exports
export * from './addressUtils';
export * from './formatters';

// Simple sound effect functions (no external dependencies)
export const initSoundEffects = () => {
  // Placeholder for sound effects initialization
  // Currently disabled to prevent browser compatibility issues
  console.log('Sound effects placeholder loaded');
};

// Sound management
let soundEnabled = true;

export const toggleSound = (): boolean => {
  soundEnabled = !soundEnabled;
  console.log(`Sound ${soundEnabled ? 'enabled' : 'disabled'}`);
  return soundEnabled;
};

export const isSoundEnabled = (): boolean => {
  return soundEnabled;
};

export const setSoundEnabled = (enabled: boolean): void => {
  soundEnabled = enabled;
};

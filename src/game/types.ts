// Game types for Kitchen Chaos: Chef Cutter (The Golden Butter Edition)

export type ItemType =
  | 'apple'
  | 'tomato'
  | 'watermelon'
  | 'lemon'
  | 'orange'
  | 'strawberry'
  | 'pineapple'
  | 'avocado'
  | 'carrot'
  | 'golden_butter'
  | 'oven_bomb';

export interface FlyingItem {
  id: string;
  type: ItemType;
  word: string;
  typedLength: number; // How many characters already typed
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  vRot: number;
  radius: number;
  isBomb: boolean;
  isGoldenButter: boolean;
  scoreValue: number;
  sliced: boolean;
  slicedAt?: number;
  sliceAngle?: number;
  colorTheme: string;
}

export interface SlicedPiece {
  id: string;
  type: ItemType;
  side: 'left' | 'right';
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  vRot: number;
  radius: number;
  alpha: number;
  isGoldenButter: boolean;
  colorTheme: string;
}

export interface ButterParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  decay: number;
  sparkle?: boolean;
}

export interface ButterSplat {
  x: number;
  y: number;
  radius: number;
  points: { angle: number; dist: number }[];
  color: string;
  alpha: number;
  decay: number;
}

export interface SliceTrailPoint {
  x: number;
  y: number;
  age: number;
  maxAge: number;
}

export interface ButterSliceEffect {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
  glowColor: string;
  alpha: number;
  width: number;
  createdAt: number;
  duration: number;
}

export interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  scale: number;
}

export interface LevelConfig {
  levelNumber: number;
  title: string;
  targetSlices: number;
  itemsPerWaveMin: number;
  itemsPerWaveMax: number;
  flingVelocityScale: number;
  launchIntervalMs: number;
  bombChance: number;
  goldenButterChance: number;
  wordLengths: [number, number]; // [minLen, maxLen]
}

export type GameState =
  | 'MENU'
  | 'PLAYING'
  | 'PAUSED'
  | 'LEVEL_TRANSITION'
  | 'GAME_OVER'
  | 'VICTORY';

export type GameMode = 'CAREER' | 'ENDLESS' | 'ZEN';

export type ThemeMode = 'day' | 'night';

export interface GameMetrics {
  score: number;
  highScore: number;
  level: number;
  slices: number;
  currentCombo: number;
  maxCombo: number;
  comboTimer: number; // 0 to 1 ratio
  bombsAvoided: number;
  bombsExploded: number;
  wordsTypedAccurately: number;
  mistakes: number;
  levelSlicesProgress: number;
}

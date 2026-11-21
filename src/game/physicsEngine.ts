// Physics and Level Controller Engine for Kitchen Chaos: Chef Cutter
import {
  FlyingItem,
  SlicedPiece,
  ButterParticle,
  ButterSplat,
  ButterSliceEffect,
  FloatingText,
  ItemType,
  LevelConfig,
  ThemeMode
} from './types';
import { getFoodWord, getBombWord, getGoldenButterWord } from './wordBank';

export const LEVEL_CONFIGS: LevelConfig[] = [
  {
    levelNumber: 1,
    title: 'Apprentice Prep Cook',
    targetSlices: 8,
    itemsPerWaveMin: 1,
    itemsPerWaveMax: 2,
    flingVelocityScale: 1.0,
    launchIntervalMs: 2400,
    bombChance: 0.0, // No bombs
    goldenButterChance: 0.1,
    wordLengths: [3, 4]
  },
  {
    levelNumber: 2,
    title: 'Line Cook Slicer',
    targetSlices: 12,
    itemsPerWaveMin: 1,
    itemsPerWaveMax: 2,
    flingVelocityScale: 1.05,
    launchIntervalMs: 2200,
    bombChance: 0.0, // No bombs
    goldenButterChance: 0.12,
    wordLengths: [4, 5]
  },
  {
    levelNumber: 3,
    title: 'Bakery Bomb Warning',
    targetSlices: 15,
    itemsPerWaveMin: 2,
    itemsPerWaveMax: 3,
    flingVelocityScale: 1.1,
    launchIntervalMs: 2000,
    bombChance: 0.25, // BAKERY BOMBS UNLOCKED!
    goldenButterChance: 0.15,
    wordLengths: [4, 6]
  },
  {
    levelNumber: 4,
    title: 'Sizzling Sauté Station',
    targetSlices: 18,
    itemsPerWaveMin: 2,
    itemsPerWaveMax: 3,
    flingVelocityScale: 1.15,
    launchIntervalMs: 1900,
    bombChance: 0.28,
    goldenButterChance: 0.15,
    wordLengths: [4, 6]
  },
  {
    levelNumber: 5,
    title: 'Golden Butter Alchemist',
    targetSlices: 20,
    itemsPerWaveMin: 2,
    itemsPerWaveMax: 4,
    flingVelocityScale: 1.2,
    launchIntervalMs: 1800,
    bombChance: 0.3,
    goldenButterChance: 0.25, // Extra butter!
    wordLengths: [4, 7]
  },
  {
    levelNumber: 6,
    title: 'Sous Chef Velocity',
    targetSlices: 22,
    itemsPerWaveMin: 2,
    itemsPerWaveMax: 4,
    flingVelocityScale: 1.25,
    launchIntervalMs: 1700,
    bombChance: 0.32,
    goldenButterChance: 0.18,
    wordLengths: [5, 7]
  },
  {
    levelNumber: 7,
    title: 'Iron Skillet Rush',
    targetSlices: 24,
    itemsPerWaveMin: 3,
    itemsPerWaveMax: 4,
    flingVelocityScale: 1.28,
    launchIntervalMs: 1600,
    bombChance: 0.34,
    goldenButterChance: 0.18,
    wordLengths: [5, 8]
  },
  {
    levelNumber: 8,
    title: 'Molten Caramel Carver',
    targetSlices: 26,
    itemsPerWaveMin: 3,
    itemsPerWaveMax: 5,
    flingVelocityScale: 1.32,
    launchIntervalMs: 1550,
    bombChance: 0.35,
    goldenButterChance: 0.2,
    wordLengths: [5, 8]
  },
  {
    levelNumber: 9,
    title: 'Executive Chef Command',
    targetSlices: 28,
    itemsPerWaveMin: 3,
    itemsPerWaveMax: 5,
    flingVelocityScale: 1.36,
    launchIntervalMs: 1500,
    bombChance: 0.36,
    goldenButterChance: 0.2,
    wordLengths: [5, 9]
  },
  {
    levelNumber: 10,
    title: 'Inferno Bakery Blitz',
    targetSlices: 30,
    itemsPerWaveMin: 3,
    itemsPerWaveMax: 5,
    flingVelocityScale: 1.4,
    launchIntervalMs: 1400,
    bombChance: 0.38,
    goldenButterChance: 0.22,
    wordLengths: [5, 9]
  },
  {
    levelNumber: 11,
    title: 'Pastry Blade Virtuoso',
    targetSlices: 32,
    itemsPerWaveMin: 3,
    itemsPerWaveMax: 6,
    flingVelocityScale: 1.44,
    launchIntervalMs: 1350,
    bombChance: 0.4,
    goldenButterChance: 0.22,
    wordLengths: [5, 10]
  },
  {
    levelNumber: 12,
    title: 'High Velocity Garnish',
    targetSlices: 35,
    itemsPerWaveMin: 4,
    itemsPerWaveMax: 6,
    flingVelocityScale: 1.48,
    launchIntervalMs: 1300,
    bombChance: 0.42,
    goldenButterChance: 0.25,
    wordLengths: [6, 10]
  },
  {
    levelNumber: 13,
    title: 'Chamber of Molten Spices',
    targetSlices: 38,
    itemsPerWaveMin: 4,
    itemsPerWaveMax: 6,
    flingVelocityScale: 1.52,
    launchIntervalMs: 1250,
    bombChance: 0.44,
    goldenButterChance: 0.25,
    wordLengths: [6, 10]
  },
  {
    levelNumber: 14,
    title: 'Apex Culinary Carver',
    targetSlices: 40,
    itemsPerWaveMin: 4,
    itemsPerWaveMax: 7,
    flingVelocityScale: 1.56,
    launchIntervalMs: 1200,
    bombChance: 0.45,
    goldenButterChance: 0.28,
    wordLengths: [6, 10]
  },
  {
    levelNumber: 15,
    title: 'THE GOLDEN BUTTER MASTER',
    targetSlices: 45,
    itemsPerWaveMin: 5,
    itemsPerWaveMax: 7,
    flingVelocityScale: 1.6,
    launchIntervalMs: 1150,
    bombChance: 0.48,
    goldenButterChance: 0.35,
    wordLengths: [6, 10]
  }
];

export const FRUIT_VEG_TYPES: ItemType[] = [
  'apple',
  'tomato',
  'watermelon',
  'lemon',
  'orange',
  'strawberry',
  'pineapple',
  'avocado',
  'carrot'
];

export class PhysicsEngine {
  public gravity: number = 0.40; // px / frame^2

  /**
   * Spawns a batch of flying items from below the bottom edge
   */
  public spawnWave(
    width: number,
    height: number,
    config: LevelConfig,
    activeWords: Set<string>,
    theme: ThemeMode
  ): FlyingItem[] {
    const count = Math.floor(
      Math.random() * (config.itemsPerWaveMax - config.itemsPerWaveMin + 1)
    ) + config.itemsPerWaveMin;

    const spawned: FlyingItem[] = [];

    for (let i = 0; i < count; i++) {
      const isBomb = config.bombChance > 0 && Math.random() < config.bombChance;
      const isGoldenButter = !isBomb && Math.random() < config.goldenButterChance;

      let type: ItemType;
      let word: string;
      let radius: number;
      let scoreValue: number;

      if (isBomb) {
        type = 'oven_bomb';
        word = getBombWord(activeWords);
        radius = 44;
        scoreValue = -500;
      } else if (isGoldenButter) {
        type = 'golden_butter';
        word = getGoldenButterWord();
        radius = 48;
        scoreValue = 300;
      } else {
        type = FRUIT_VEG_TYPES[Math.floor(Math.random() * FRUIT_VEG_TYPES.length)];
        word = getFoodWord(config.wordLengths[0], config.wordLengths[1], activeWords);
        radius = type === 'watermelon' || type === 'pineapple' ? 52 : 40;
        scoreValue = 100 + word.length * 15;
      }

      activeWords.add(word);

      // Distribute spawn points across the bottom
      const margin = width * 0.12;
      const slotWidth = (width - margin * 2) / Math.max(count, 1);
      const spawnX = margin + slotWidth * i + (Math.random() * 0.6 + 0.2) * slotWidth;
      const spawnY = height + 60 + Math.random() * 40;

      // Parabolic upward arc:
      // Direct velocity inward towards the center area
      const targetCenterX = width * 0.5 + (Math.random() * 200 - 100);
      const dx = targetCenterX - spawnX;
      const vx = (dx / (width * 0.5)) * (2.2 + Math.random() * 1.5) * config.flingVelocityScale;

      // Vertical launch velocity based on canvas height so apex hits upper third of screen
      // v = sqrt(2 * g * distance)
      const targetApexDistance = height * (0.65 + Math.random() * 0.22);
      const baseVy = -Math.sqrt(2 * this.gravity * targetApexDistance);
      const vy = baseVy * (0.95 + Math.random() * 0.1) * (0.9 + 0.1 * config.flingVelocityScale);

      const vRot = (Math.random() - 0.5) * 0.08;

      spawned.push({
        id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        type,
        word,
        typedLength: 0,
        x: spawnX,
        y: spawnY,
        vx,
        vy,
        rotation: Math.random() * Math.PI * 2,
        vRot,
        radius,
        isBomb,
        isGoldenButter,
        scoreValue,
        sliced: false,
        colorTheme: theme
      });
    }

    return spawned;
  }

  /**
   * Updates all active flying items using real-time parabolic gravity math
   */
  public updateItems(items: FlyingItem[], height: number): { active: FlyingItem[]; escaped: FlyingItem[] } {
    const active: FlyingItem[] = [];
    const escaped: FlyingItem[] = [];

    for (const item of items) {
      if (item.sliced) continue;

      // Parabolic physics equations
      item.x += item.vx;
      item.y += item.vy;
      item.vy += this.gravity; // Accelerate downward due to gravity
      item.rotation += item.vRot;

      // Check if item has fallen out of bottom view after reaching apex
      if (item.vy > 0 && item.y > height + item.radius + 80) {
        escaped.push(item);
      } else {
        active.push(item);
      }
    }

    return { active, escaped };
  }

  /**
   * Splits an item into two distinct halves with diverging trajectories & rotations
   */
  public splitItem(item: FlyingItem, customAngle?: number): {
    halves: SlicedPiece[];
    particles: ButterParticle[];
    splats: ButterSplat[];
    sliceEffect: ButterSliceEffect;
  } {
    const angle = customAngle !== undefined ? customAngle : -Math.PI / 4 + (Math.random() - 0.5) * 0.4;
    const normalX = Math.cos(angle + Math.PI / 2);
    const normalY = Math.sin(angle + Math.PI / 2);

    const kickSpeed = 4.0 + Math.random() * 2.5;

    const leftHalf: SlicedPiece = {
      id: `${item.id}_half_L`,
      type: item.type,
      side: 'left',
      x: item.x - normalX * 8,
      y: item.y - normalY * 8,
      vx: item.vx - normalX * kickSpeed - (Math.random() * 1.5 + 1.0),
      vy: item.vy - 2.5 + (Math.random() - 0.5) * 1.5,
      rotation: item.rotation,
      vRot: -0.09 - Math.random() * 0.06,
      radius: item.radius,
      alpha: 1.0,
      isGoldenButter: item.isGoldenButter,
      colorTheme: item.colorTheme
    };

    const rightHalf: SlicedPiece = {
      id: `${item.id}_half_R`,
      type: item.type,
      side: 'right',
      x: item.x + normalX * 8,
      y: item.y + normalY * 8,
      vx: item.vx + normalX * kickSpeed + (Math.random() * 1.5 + 1.0),
      vy: item.vy - 2.5 + (Math.random() - 0.5) * 1.5,
      rotation: item.rotation,
      vRot: 0.09 + Math.random() * 0.06,
      radius: item.radius,
      alpha: 1.0,
      isGoldenButter: item.isGoldenButter,
      colorTheme: item.colorTheme
    };

    // Instantiate Butter Slice Trail across item coordinates
    const sliceLen = item.radius * 2.4;
    const dirX = Math.cos(angle);
    const dirY = Math.sin(angle);
    const sliceEffect: ButterSliceEffect = {
      startX: item.x - dirX * sliceLen,
      startY: item.y - dirY * sliceLen,
      endX: item.x + dirX * sliceLen,
      endY: item.y + dirY * sliceLen,
      color: item.colorTheme === 'night' ? '#FF0055' : '#FFD700',
      glowColor: item.colorTheme === 'night' ? '#FF1493' : '#FFC72C',
      alpha: 1.0,
      width: item.isGoldenButter ? 10 : 7,
      createdAt: performance.now(),
      duration: 320 // ms
    };

    // Visual blast of molten golden butter splash particles
    const particleCount = item.isGoldenButter ? 42 : 28;
    const particles: ButterParticle[] = [];

    const isNight = item.colorTheme === 'night';
    const butterColors = isNight
      ? ['#FF0055', '#FF1493', '#FF4D88', '#FFFFFF', '#FFA3C2']
      : ['#FFD700', '#FFC72C', '#FFE57F', '#FFF9C4', '#FFA000'];

    for (let i = 0; i < particleCount; i++) {
      const pAngle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 7 + 2.5;
      particles.push({
        x: item.x + (Math.random() - 0.5) * 16,
        y: item.y + (Math.random() - 0.5) * 16,
        vx: Math.cos(pAngle) * speed + item.vx * 0.3,
        vy: Math.sin(pAngle) * speed + item.vy * 0.3 - 2.0,
        radius: Math.random() * 4.5 + 2.0,
        color: butterColors[Math.floor(Math.random() * butterColors.length)],
        alpha: 1.0,
        decay: 0.018 + Math.random() * 0.02,
        sparkle: Math.random() > 0.6
      });
    }

    // Molten butter puddle / splat marks on screen background
    const splats: ButterSplat[] = [];
    const splatPointCount = 8;
    const points: { angle: number; dist: number }[] = [];
    for (let i = 0; i < splatPointCount; i++) {
      const a = (i / splatPointCount) * Math.PI * 2;
      points.push({
        angle: a,
        dist: 0.7 + Math.random() * 0.6
      });
    }

    splats.push({
      x: item.x,
      y: item.y,
      radius: item.radius * (0.8 + Math.random() * 0.4),
      points,
      color: isNight ? 'rgba(255, 0, 85, 0.28)' : 'rgba(255, 199, 44, 0.38)',
      alpha: 1.0,
      decay: 0.003 // Lingers on wall
    });

    return {
      halves: [leftHalf, rightHalf],
      particles,
      splats,
      sliceEffect
    };
  }

  /**
   * Updates physical sliced halves
   */
  public updateHalves(halves: SlicedPiece[], height: number): SlicedPiece[] {
    const active: SlicedPiece[] = [];
    for (const h of halves) {
      h.x += h.vx;
      h.y += h.vy;
      h.vy += this.gravity * 1.1; // Halves drop slightly faster
      h.rotation += h.vRot;

      if (h.y < height + h.radius + 60) {
        active.push(h);
      }
    }
    return active;
  }

  /**
   * Updates butter droplets & splash particles
   */
  public updateParticles(particles: ButterParticle[]): ButterParticle[] {
    const active: ButterParticle[] = [];
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += this.gravity * 0.5; // Butter droplets float and fall
      p.vx *= 0.98; // Air resistance
      p.alpha -= p.decay;

      if (p.alpha > 0.01) {
        active.push(p);
      }
    }
    return active;
  }

  /**
   * Updates background butter splats
   */
  public updateSplats(splats: ButterSplat[]): ButterSplat[] {
    const active: ButterSplat[] = [];
    for (const s of splats) {
      s.alpha -= s.decay;
      if (s.alpha > 0.01) {
        active.push(s);
      }
    }
    return active;
  }

  /**
   * Updates floating points score text
   */
  public updateFloatingTexts(texts: FloatingText[]): FloatingText[] {
    const active: FloatingText[] = [];
    for (const t of texts) {
      t.x += t.vx;
      t.y += t.vy;
      t.alpha -= 0.022;
      t.scale = Math.min(t.scale + 0.02, 1.25);
      if (t.alpha > 0.01) {
        active.push(t);
      }
    }
    return active;
  }

  /**
   * Calculate multiplier based on streak
   */
  public getMultiplier(comboStreak: number): number {
    if (comboStreak >= 11) return 10;
    if (comboStreak >= 8) return 8;
    if (comboStreak >= 5) return 5;
    if (comboStreak >= 3) return 3;
    if (comboStreak >= 2) return 2;
    return 1;
  }
}

export const physicsEngine = new PhysicsEngine();

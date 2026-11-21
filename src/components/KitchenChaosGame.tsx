import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  FlyingItem,
  SlicedPiece,
  ButterParticle,
  ButterSplat,
  ButterSliceEffect,
  FloatingText,
  SliceTrailPoint,
  GameState,
  GameMode,
  ThemeMode,
  GameMetrics,
  LevelConfig
} from '../game/types';
import { LEVEL_CONFIGS, physicsEngine } from '../game/physicsEngine';
import { GameRenderer } from '../game/renderer';
import { soundEngine } from '../audio/soundEngine';
import { GameHUD } from './GameHUD';
import { ActiveTypingBar } from './ActiveTypingBar';
import { TitleMenu } from './TitleMenu';
import { GameOverModal } from './GameOverModal';
import { VictoryModal } from './VictoryModal';
import { HowToPlayModal } from './HowToPlayModal';

const HIGH_SCORE_KEY = 'kitchen_chaos_chef_cutter_high_score';

export const KitchenChaosGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Game UI & State Machine
  const [gameState, setGameState] = useState<GameState>('MENU');
  const [gameMode, setGameMode] = useState<GameMode>('CAREER');
  const [theme, setTheme] = useState<ThemeMode>('day');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isMusicActive, setIsMusicActive] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [levelUpBanner, setLevelUpBanner] = useState<string | null>(null);

  // Metrics State
  const [metrics, setMetrics] = useState<GameMetrics>({
    score: 0,
    highScore: 0,
    level: 1,
    slices: 0,
    currentCombo: 1,
    maxCombo: 1,
    comboTimer: 0,
    bombsAvoided: 0,
    bombsExploded: 0,
    wordsTypedAccurately: 0,
    mistakes: 0,
    levelSlicesProgress: 0
  });

  // Active typing buffer & target
  const [activeTargetId, setActiveTargetId] = useState<string | null>(null);
  const [typedBuffer, setTypedBuffer] = useState<string>('');

  // Engine references across animation frames
  const engineRef = useRef({
    items: [] as FlyingItem[],
    halves: [] as SlicedPiece[],
    particles: [] as ButterParticle[],
    splats: [] as ButterSplat[],
    sliceEffects: [] as ButterSliceEffect[],
    floatingTexts: [] as FloatingText[],
    swipeTrail: [] as SliceTrailPoint[],
    isPointerDown: false,
    lastPointerPos: null as { x: number; y: number } | null,
    flashAlpha: 0,
    shakeIntensity: 0,
    shakeX: 0,
    shakeY: 0,
    lastLaunchTime: 0,
    comboExpiryTime: 0,
    activeWords: new Set<string>(),
    animFrameId: 0
  });

  // Load High Score on initial mount
  useEffect(() => {
    const savedHighScore = localStorage.getItem(HIGH_SCORE_KEY);
    if (savedHighScore) {
      const val = parseInt(savedHighScore, 10);
      if (!isNaN(val)) {
        setMetrics(m => ({ ...m, highScore: val }));
      }
    }
  }, []);

  // Sync theme class with HTML element
  useEffect(() => {
    if (theme === 'night') {
      document.documentElement.classList.add('dark');
      document.body.className = 'theme-night bg-[#1A1A1A] text-white';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.className = 'theme-day bg-[#FFC72C] text-[#004D40]';
    }
  }, [theme]);

  // Current Level Configuration
  const currentConfig: LevelConfig =
    LEVEL_CONFIGS[Math.min(metrics.level - 1, LEVEL_CONFIGS.length - 1)] || LEVEL_CONFIGS[0];

  // Reset Game State completely
  const resetGame = useCallback(
    (targetMode: GameMode = gameMode) => {
      engineRef.current.items = [];
      engineRef.current.halves = [];
      engineRef.current.particles = [];
      engineRef.current.splats = [];
      engineRef.current.sliceEffects = [];
      engineRef.current.floatingTexts = [];
      engineRef.current.swipeTrail = [];
      engineRef.current.activeWords.clear();
      engineRef.current.flashAlpha = 0;
      engineRef.current.shakeIntensity = 0;
      engineRef.current.lastLaunchTime = performance.now();
      engineRef.current.comboExpiryTime = 0;

      setActiveTargetId(null);
      setTypedBuffer('');
      setLevelUpBanner(null);

      setMetrics(prev => ({
        ...prev,
        score: 0,
        level: 1,
        slices: 0,
        currentCombo: 1,
        comboTimer: 0,
        bombsAvoided: 0,
        bombsExploded: 0,
        wordsTypedAccurately: 0,
        mistakes: 0,
        levelSlicesProgress: 0
      }));

      setGameState('PLAYING');
    },
    [gameMode]
  );

  // Slices an item: splits physics halves, creates butter trail, blasts particles, updates score
  const executeSlice = useCallback(
    (item: FlyingItem, customAngle?: number) => {
      if (item.sliced) return;
      item.sliced = true;
      engineRef.current.activeWords.delete(item.word);

      if (item.isBomb) {
        // BAKERY BOMB DETONATION!
        soundEngine.playBombExplosion();

        // White screen flash!
        engineRef.current.flashAlpha = 1.0;
        // Violent screen shake
        engineRef.current.shakeIntensity = 30;

        // Reset combo multiplier and deduct 500 points
        setMetrics(m => {
          const newScore = Math.max(0, m.score - 500);
          return {
            ...m,
            score: newScore,
            currentCombo: 1,
            comboTimer: 0,
            bombsExploded: m.bombsExploded + 1
          };
        });

        // Floating score deduction text
        engineRef.current.floatingTexts.push({
          id: `deduct_${Date.now()}`,
          text: '-500 PTS BOMB EXPLOSION!',
          x: item.x,
          y: item.y - 30,
          vx: (Math.random() - 0.5) * 2,
          vy: -3,
          alpha: 1.0,
          color: '#FF1744',
          scale: 1.0
        });

        // Bomb shrapnel and dark smoke particles
        for (let i = 0; i < 35; i++) {
          const pAngle = Math.random() * Math.PI * 2;
          const pSpeed = Math.random() * 9 + 3;
          engineRef.current.particles.push({
            x: item.x,
            y: item.y,
            vx: Math.cos(pAngle) * pSpeed,
            vy: Math.sin(pAngle) * pSpeed - 3,
            radius: Math.random() * 5 + 2,
            color: Math.random() > 0.5 ? '#FF0055' : '#424242',
            alpha: 1.0,
            decay: 0.02,
            sparkle: true
          });
        }
      } else {
        // FOOD ITEM OR GOLDEN BUTTER BAR SLICED!
        soundEngine.playSlice(item.isGoldenButter ? 1.3 : 1.0);
        soundEngine.playChop();

        const splitResult = physicsEngine.splitItem(item, customAngle);
        engineRef.current.halves.push(...splitResult.halves);
        engineRef.current.particles.push(...splitResult.particles);
        engineRef.current.splats.push(...splitResult.splats);
        engineRef.current.sliceEffects.push(splitResult.sliceEffect);

        // Update Combo & Multipliers
        const now = performance.now();
        engineRef.current.comboExpiryTime = now + 2400; // 2.4s window to chain combo

        setMetrics(m => {
          const nextCombo = m.currentCombo + 1;
          const multiplier = physicsEngine.getMultiplier(nextCombo);
          const pointsEarned = item.scoreValue * multiplier;
          const newScore = m.score + pointsEarned;
          const newSlices = m.slices + 1;
          const newLevelProgress = m.levelSlicesProgress + 1;
          const newMaxCombo = Math.max(m.maxCombo, multiplier);

          // Update saved high score if beaten
          if (newScore > m.highScore) {
            localStorage.setItem(HIGH_SCORE_KEY, newScore.toString());
          }

          // Floating score text
          const bonusLabel = item.isGoldenButter
            ? `+${pointsEarned} GOLDEN BUTTER!`
            : multiplier > 1
            ? `+${pointsEarned} (${multiplier}x)`
            : `+${pointsEarned}`;

          engineRef.current.floatingTexts.push({
            id: `score_${Date.now()}`,
            text: bonusLabel,
            x: item.x,
            y: item.y - 20,
            vx: (Math.random() - 0.5) * 1.5,
            vy: -2.8,
            alpha: 1.0,
            color: item.isGoldenButter ? '#FFD700' : multiplier > 1 ? '#4ADE80' : '#FFFFFF',
            scale: multiplier > 1 ? 1.2 : 1.0
          });

          // Play combo musical chime
          if (nextCombo > 1) {
            soundEngine.playComboChime(multiplier);
          }

          // Check Level Advancement (Career Mode)
          if (gameMode === 'CAREER' && newLevelProgress >= currentConfig.targetSlices) {
            if (m.level >= 15) {
              // VICTORY!
              soundEngine.playLevelUp();
              setGameState('VICTORY');
            } else {
              // ADVANCE LEVEL
              const nextLevel = m.level + 1;
              soundEngine.playLevelUp();
              setLevelUpBanner(`LEVEL ${nextLevel}: ${LEVEL_CONFIGS[nextLevel - 1].title}`);
              setTimeout(() => setLevelUpBanner(null), 2500);

              return {
                ...m,
                score: newScore,
                highScore: Math.max(newScore, m.highScore),
                level: nextLevel,
                slices: newSlices,
                currentCombo: nextCombo,
                maxCombo: newMaxCombo,
                levelSlicesProgress: 0,
                wordsTypedAccurately: m.wordsTypedAccurately + 1
              };
            }
          }

          return {
            ...m,
            score: newScore,
            highScore: Math.max(newScore, m.highScore),
            slices: newSlices,
            currentCombo: nextCombo,
            maxCombo: newMaxCombo,
            levelSlicesProgress: newLevelProgress,
            wordsTypedAccurately: m.wordsTypedAccurately + 1
          };
        });
      }

      // Reset target if sliced item was the targeted one
      if (activeTargetId === item.id) {
        setActiveTargetId(null);
        setTypedBuffer('');
      }
    },
    [activeTargetId, currentConfig, gameMode]
  );

  // Physical Keyboard Input Listener
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Pause shortcut
      if (e.key === 'Escape') {
        setGameState('PAUSED');
        return;
      }

      // Backspace to clear current target
      if (e.key === 'Backspace') {
        setActiveTargetId(null);
        setTypedBuffer('');
        const activeItems = engineRef.current.items.filter(i => !i.sliced);
        for (const item of activeItems) {
          item.typedLength = 0;
        }
        return;
      }

      // Ignore non-alphabetical keys
      if (e.key.length !== 1 || !/^[a-zA-Z]$/.test(e.key)) return;

      const key = e.key.toLowerCase();
      const activeItems = engineRef.current.items.filter(i => !i.sliced);

      // Scenario A: User already targeting an item
      if (activeTargetId) {
        const target = activeItems.find(i => i.id === activeTargetId);
        if (target) {
          const expectedChar = target.word[target.typedLength];
          if (expectedChar === key) {
            target.typedLength += 1;
            setTypedBuffer(target.word.slice(0, target.typedLength));
            soundEngine.playTypingKey(true);

            // Word completed!
            if (target.typedLength === target.word.length) {
              executeSlice(target);
            }
            return;
          }
        }
      }

      // Scenario B: No active target or mismatch, find matching item
      const candidate = activeItems.find(i => i.word[0] === key);
      if (candidate) {
        // Reset previous items
        for (const it of activeItems) {
          if (it.id !== candidate.id) it.typedLength = 0;
        }

        candidate.typedLength = 1;
        setActiveTargetId(candidate.id);
        setTypedBuffer(key);
        soundEngine.playTypingKey(true);

        // Instant completion for 1-letter words (if any)
        if (candidate.typedLength === candidate.word.length) {
          executeSlice(candidate);
        }
      } else {
        // Key didn't match any floating word
        soundEngine.playTypingKey(false);
        setMetrics(m => ({ ...m, mistakes: m.mistakes + 1 }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, activeTargetId, executeSlice]);

  // Main 60fps Game & Physics Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let renderer = new GameRenderer(ctx, canvas.width, canvas.height);

    // Responsive Canvas Resize Observer
    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      renderer.setDimensions(rect.width, rect.height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const loop = (timestamp: number) => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      if (gameState === 'PLAYING') {
        const engine = engineRef.current;

        // 1. WAVE CONTROLLER: Spawn next volley when timer expires
        const launchInterval =
          gameMode === 'ENDLESS'
            ? Math.max(1000, 2200 - metrics.slices * 25)
            : currentConfig.launchIntervalMs;

        if (timestamp - engine.lastLaunchTime > launchInterval) {
          engine.lastLaunchTime = timestamp;
          const newItems = physicsEngine.spawnWave(
            w,
            h,
            currentConfig,
            engine.activeWords,
            theme
          );
          engine.items.push(...newItems);
          soundEngine.playLaunch();
        }

        // 2. PARABOLIC GRAVITY PHYSICS TRACKING
        const { active, escaped } = physicsEngine.updateItems(engine.items, h);
        engine.items = active;

        // Clean up escaped words
        for (const esc of escaped) {
          engine.activeWords.delete(esc.word);
          if (esc.isBomb) {
            setMetrics(m => ({ ...m, bombsAvoided: m.bombsAvoided + 1 }));
          }
          if (esc.id === activeTargetId) {
            setActiveTargetId(null);
            setTypedBuffer('');
          }
        }

        // 3. UPDATE SPLIT HALVES, PARTICLES, SPLATS, & TEXTS
        engine.halves = physicsEngine.updateHalves(engine.halves, h);
        engine.particles = physicsEngine.updateParticles(engine.particles);
        engine.splats = physicsEngine.updateSplats(engine.splats);
        engine.floatingTexts = physicsEngine.updateFloatingTexts(engine.floatingTexts);

        // 4. COMBO EXPIRY TIMER UPDATE
        if (engine.comboExpiryTime > 0) {
          const remaining = Math.max(0, engine.comboExpiryTime - timestamp);
          const ratio = remaining / 2400;
          if (remaining <= 0) {
            engine.comboExpiryTime = 0;
            setMetrics(m => ({ ...m, currentCombo: 1, comboTimer: 0 }));
          } else {
            setMetrics(m => ({ ...m, comboTimer: ratio }));
          }
        }

        // 5. SCREEN SHAKE & FLASH DECAY
        if (engine.flashAlpha > 0) {
          engine.flashAlpha = Math.max(0, engine.flashAlpha - 0.04);
        }
        if (engine.shakeIntensity > 0) {
          engine.shakeX = (Math.random() - 0.5) * engine.shakeIntensity;
          engine.shakeY = (Math.random() - 0.5) * engine.shakeIntensity;
          engine.shakeIntensity = Math.max(0, engine.shakeIntensity - 1.2);
        } else {
          engine.shakeX = 0;
          engine.shakeY = 0;
        }

        // 6. SWIPE TRAIL POINT AGING
        for (let i = engine.swipeTrail.length - 1; i >= 0; i--) {
          engine.swipeTrail[i].age += 16;
          if (engine.swipeTrail[i].age >= engine.swipeTrail[i].maxAge) {
            engine.swipeTrail.splice(i, 1);
          }
        }
      }

      // --- RENDER PASS ---
      ctx.save();
      if (engineRef.current.shakeIntensity > 0) {
        ctx.translate(engineRef.current.shakeX, engineRef.current.shakeY);
      }

      // Draw background & flash
      renderer.drawBackground(theme, engineRef.current.flashAlpha);

      // Draw background splats
      renderer.drawSplats(engineRef.current.splats);

      // Draw sliced pieces
      for (const piece of engineRef.current.halves) {
        renderer.drawSlicedPiece(piece, theme);
      }

      // Draw airborne items with floating typography badges
      for (const item of engineRef.current.items) {
        renderer.drawItem(item, theme, item.id === activeTargetId);
      }

      // Draw butter slice trails
      renderer.drawSliceEffects(engineRef.current.sliceEffects);

      // Draw player blade swipe trail
      renderer.drawPlayerSwipeTrail(engineRef.current.swipeTrail, theme);

      // Draw molten butter particles
      renderer.drawParticles(engineRef.current.particles);

      // Draw floating score popups
      renderer.drawFloatingTexts(engineRef.current.floatingTexts);

      ctx.restore();

      engineRef.current.animFrameId = requestAnimationFrame(loop);
    };

    engineRef.current.animFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(engineRef.current.animFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [gameState, theme, currentConfig, gameMode, metrics.slices, activeTargetId]);

  // Pointer / Blade Swipe Slashing Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.x;
    const y = e.clientY - rect.y;

    engineRef.current.isPointerDown = true;
    engineRef.current.lastPointerPos = { x, y };
    engineRef.current.swipeTrail.push({ x, y, age: 0, maxAge: 250 });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!engineRef.current.isPointerDown || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.x;
    const y = e.clientY - rect.y;

    const prev = engineRef.current.lastPointerPos;
    if (prev) {
      // Check blade swipe collision with airborne items
      const activeItems = engineRef.current.items.filter(i => !i.sliced);
      for (const item of activeItems) {
        // Distance from item center to segment
        const dist = Math.hypot(item.x - x, item.y - y);
        if (dist <= item.radius + 15) {
          const swipeAngle = Math.atan2(y - prev.y, x - prev.x);
          executeSlice(item, swipeAngle);
        }
      }
    }

    engineRef.current.lastPointerPos = { x, y };
    engineRef.current.swipeTrail.push({ x, y, age: 0, maxAge: 250 });
  };

  const handlePointerUp = () => {
    engineRef.current.isPointerDown = false;
    engineRef.current.lastPointerPos = null;
  };

  const activeTargetItem = engineRef.current.items.find(i => i.id === activeTargetId) || null;

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        theme === 'night' ? 'bg-[#1A1A1A] text-white' : 'bg-[#FFC72C] text-[#004D40]'
      }`}
    >
      {/* Top Navigation & HUD */}
      <GameHUD
        metrics={metrics}
        currentLevelConfig={currentConfig}
        theme={theme}
        gameState={gameState}
        isMuted={isMuted}
        isMusicActive={isMusicActive}
        onToggleTheme={() => setTheme(t => (t === 'day' ? 'night' : 'day'))}
        onToggleSound={() => {
          const next = !isMuted;
          setIsMuted(next);
          soundEngine.setMuted(next);
        }}
        onToggleMusic={() => {
          soundEngine.toggleMusic();
          setIsMusicActive(soundEngine.isMusicActive());
        }}
        onTogglePause={() => setGameState(s => (s === 'PLAYING' ? 'PAUSED' : 'PLAYING'))}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      {/* Main Game Screen */}
      <div className="flex-1 relative flex flex-col items-center justify-center overflow-hidden">
        {gameState === 'MENU' ? (
          <TitleMenu
            theme={theme}
            highScore={metrics.highScore}
            selectedMode={gameMode}
            isMuted={isMuted}
            onSelectMode={setGameMode}
            onStartGame={() => resetGame(gameMode)}
            onOpenHelp={() => setIsHelpOpen(true)}
            onToggleTheme={() => setTheme(t => (t === 'day' ? 'night' : 'day'))}
            onToggleSound={() => {
              const next = !isMuted;
              setIsMuted(next);
              soundEngine.setMuted(next);
            }}
          />
        ) : (
          <div className="w-full h-full flex-1 relative flex items-center justify-center">
            {/* HTML5 Physics Canvas */}
            <canvas
              ref={canvasRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              className="w-full h-full absolute inset-0 cursor-crosshair touch-none"
            />

            {/* Active Physical Typing HUD Bar */}
            <ActiveTypingBar
              activeTarget={activeTargetItem}
              typedBuffer={typedBuffer}
              theme={theme}
            />

            {/* Level Up Announcement Banner */}
            {levelUpBanner && (
              <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-bounce">
                <div
                  className={`px-6 py-2.5 rounded-2xl font-black text-sm sm:text-base tracking-wide border shadow-2xl ${
                    theme === 'night'
                      ? 'bg-[#FF0055] text-white border-white shadow-[0_0_30px_rgba(255,0,85,0.7)]'
                      : 'bg-[#004D40] text-[#FFD700] border-[#00332C] shadow-xl'
                  }`}
                >
                  ★ {levelUpBanner} ★
                </div>
              </div>
            )}

            {/* Paused Overlay */}
            {gameState === 'PAUSED' && (
              <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div
                  className={`p-6 sm:p-8 rounded-2xl border text-center max-w-sm w-full ${
                    theme === 'night'
                      ? 'bg-[#1E1E1E] border-[#333] text-white'
                      : 'bg-[#FFFDFB] border-[#004D40]/30 text-[#004D40]'
                  }`}
                >
                  <h2 className="text-2xl font-black mb-1">Game Paused</h2>
                  <p className="text-xs opacity-75 mb-6">Kitchen knives are held steady.</p>

                  <div className="space-y-3">
                    <button
                      onClick={() => setGameState('PLAYING')}
                      className={`w-full py-3 rounded-xl font-black text-sm shadow-md transition-all ${
                        theme === 'night'
                          ? 'bg-[#FF0055] hover:bg-[#FF1493] text-white'
                          : 'bg-[#004D40] hover:bg-[#00332C] text-[#FFD700]'
                      }`}
                    >
                      Resume Slicing
                    </button>
                    <button
                      onClick={() => resetGame()}
                      className="w-full py-2.5 rounded-xl font-bold text-xs border border-current opacity-70 hover:opacity-100 transition-opacity"
                    >
                      Restart Level
                    </button>
                    <button
                      onClick={() => setGameState('MENU')}
                      className="w-full py-2.5 rounded-xl font-bold text-xs opacity-60 hover:opacity-100 transition-opacity"
                    >
                      Main Menu
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Game Over Modal */}
      {gameState === 'GAME_OVER' && (
        <GameOverModal
          metrics={metrics}
          theme={theme}
          onRestart={() => resetGame()}
          onExitMenu={() => setGameState('MENU')}
        />
      )}

      {/* Victory Modal */}
      {gameState === 'VICTORY' && (
        <VictoryModal
          metrics={metrics}
          theme={theme}
          onRestart={() => resetGame()}
          onExitMenu={() => setGameState('MENU')}
        />
      )}

      {/* How to Play Rules Modal */}
      <HowToPlayModal
        isOpen={isHelpOpen}
        theme={theme}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
};

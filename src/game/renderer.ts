// High-Performance 2D Canvas Renderer for Kitchen Chaos: Chef Cutter (The Golden Butter Edition)
import {
  FlyingItem,
  SlicedPiece,
  ButterParticle,
  ButterSplat,
  ButterSliceEffect,
  FloatingText,
  SliceTrailPoint,
  ThemeMode
} from './types';

export class GameRenderer {
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
  }

  public setDimensions(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  /**
   * Clears canvas and draws background matching the theme constraints
   */
  public drawBackground(theme: ThemeMode, flashAlpha: number = 0) {
    const { ctx, width, height } = this;

    if (theme === 'day') {
      // Golden Butter Yellow (#FFC72C)
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#FFD700');
      grad.addColorStop(0.5, '#FFC72C');
      grad.addColorStop(1, '#FFB300');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Subtle warm culinary cutting-board parquet / wood grain grid
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 77, 64, 0.04)';
      ctx.lineWidth = 1;
      const step = 48;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Elegant faint central chef emblem / watermarked ring
      ctx.strokeStyle = 'rgba(0, 77, 64, 0.05)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, Math.min(width, height) * 0.35, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    } else {
      // Obsidian Charcoal Velvet (#1A1A1A)
      const grad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        width * 0.1,
        width / 2,
        height / 2,
        width * 0.8
      );
      grad.addColorStop(0, '#262626');
      grad.addColorStop(0.6, '#1A1A1A');
      grad.addColorStop(1, '#121212');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Infrared Strawberry Neon grid accents
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 0, 85, 0.04)';
      ctx.lineWidth = 1;
      const step = 56;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Bomb white screen flash overlay
    if (flashAlpha > 0.01) {
      ctx.save();
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(flashAlpha, 0.95)})`;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }
  }

  /**
   * Draws background butter splats
   */
  public drawSplats(splats: ButterSplat[]) {
    const { ctx } = this;
    for (const s of splats) {
      ctx.save();
      ctx.fillStyle = s.color;
      ctx.globalAlpha = Math.max(s.alpha, 0);
      ctx.beginPath();

      const numPoints = s.points.length;
      for (let i = 0; i < numPoints; i++) {
        const p = s.points[i];
        const r = s.radius * p.dist;
        const px = s.x + Math.cos(p.angle) * r;
        const py = s.y + Math.sin(p.angle) * r;
        if (i === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }

  /**
   * Renders the butter slice trail effects
   */
  public drawSliceEffects(effects: ButterSliceEffect[]) {
    const { ctx } = this;
    const now = performance.now();

    for (const eff of effects) {
      const elapsed = now - eff.createdAt;
      if (elapsed > eff.duration) continue;

      const progress = elapsed / eff.duration;
      const alpha = (1 - progress) * eff.alpha;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.lineCap = 'round';

      // Outer glow
      ctx.strokeStyle = eff.glowColor;
      ctx.lineWidth = eff.width * (1.6 - progress * 0.6);
      ctx.shadowColor = eff.glowColor;
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.moveTo(eff.startX, eff.startY);
      ctx.lineTo(eff.endX, eff.endY);
      ctx.stroke();

      // Searing core
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = Math.max(eff.width * 0.45 * (1 - progress * 0.5), 1.5);
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.moveTo(eff.startX, eff.startY);
      ctx.lineTo(eff.endX, eff.endY);
      ctx.stroke();

      ctx.restore();
    }
  }

  /**
   * Renders interactive player swipe / blade trail
   */
  public drawPlayerSwipeTrail(points: SliceTrailPoint[], theme: ThemeMode) {
    if (points.length < 2) return;
    const { ctx } = this;

    const isNight = theme === 'night';
    const glowColor = isNight ? '#FF0055' : '#FFC72C';
    const coreColor = isNight ? '#FF1493' : '#FFE57F';

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    for (let i = 1; i < points.length; i++) {
      const p1 = points[i - 1];
      const p2 = points[i];
      const life = 1 - p2.age / p2.maxAge;
      if (life <= 0) continue;

      ctx.globalAlpha = life;

      // Glow stroke
      ctx.strokeStyle = glowColor;
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 12;
      ctx.lineWidth = life * 10 + 2;

      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();

      // Sharp hot inner edge
      ctx.strokeStyle = coreColor;
      ctx.shadowBlur = 0;
      ctx.lineWidth = life * 4 + 1;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }

    ctx.restore();
  }

  /**
   * Draws butter droplets and splash particles
   */
  public drawParticles(particles: ButterParticle[]) {
    const { ctx } = this;
    for (const p of particles) {
      ctx.save();
      ctx.globalAlpha = Math.max(p.alpha, 0);
      ctx.fillStyle = p.color;

      if (p.sparkle) {
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(p.radius, 0.5), 0, Math.PI * 2);
      ctx.fill();

      // Subtle specular shine on molten butter drop
      if (p.radius > 2.5) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
        ctx.beginPath();
        ctx.arc(p.x - p.radius * 0.3, p.y - p.radius * 0.3, p.radius * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  /**
   * Renders a flying airborne item with its high-contrast typography badge
   */
  public drawItem(item: FlyingItem, theme: ThemeMode, isTargeted: boolean = false) {
    const { ctx } = this;

    ctx.save();
    ctx.translate(item.x, item.y);
    ctx.rotate(item.rotation);

    // Render the graphic for this food item or bomb
    if (item.isBomb) {
      this.drawOvenBombGraphic(item.radius, theme);
    } else if (item.isGoldenButter) {
      this.drawGoldenButterGraphic(item.radius, theme);
    } else {
      this.drawFoodGraphic(item.type, item.radius, theme);
    }

    ctx.restore();

    // COMPONENT LABELING:
    // Floating word badge stays HORIZONTALLY LEVEL above the item's center
    // (Never rolls upside down, ensuring high legibility while item tumbles!)
    this.drawItemBadge(item, theme, isTargeted);
  }

  /**
   * Draws floating typography badge with dark casing, solid white text, and matched prefix highlight
   */
  private drawItemBadge(item: FlyingItem, theme: ThemeMode, isTargeted: boolean) {
    const { ctx } = this;
    const isNight = theme === 'night';

    ctx.save();
    // Position floating badge right above item center
    const badgeY = item.y - item.radius - 24;
    const badgeX = item.x;

    // Font settings
    const fontSize = 15;
    ctx.font = `800 ${fontSize}px "Outfit", "Plus Jakarta Sans", sans-serif`;
    ctx.textBaseline = 'middle';

    const word = item.word.toLowerCase();
    const textWidth = ctx.measureText(word).width;
    const padX = 14;
    const padY = 8;
    const badgeW = textWidth + padX * 2;
    const badgeH = fontSize + padY * 2;
    const cornerRadius = 8;

    // Badge casing background:
    // High-contrast dark badge casing across BOTH themes
    // Day: Midnight Caviar Teal (#00332C)
    // Night: Deep Obsidian Surface (#242424)
    const casingFill = isNight ? '#222222' : '#00332C';
    let casingBorder = isNight ? '#444444' : '#004D40';

    if (item.isBomb) {
      casingBorder = isNight ? '#FF0055' : '#D32F2F';
    } else if (item.isGoldenButter) {
      casingBorder = '#FFD700';
    } else if (isTargeted) {
      casingBorder = isNight ? '#FF0055' : '#FFC72C';
    }

    // Badge shadow for depth
    ctx.shadowColor = item.isBomb
      ? 'rgba(255, 0, 85, 0.45)'
      : isNight
      ? 'rgba(0, 0, 0, 0.6)'
      : 'rgba(0, 51, 44, 0.35)';
    ctx.shadowBlur = isTargeted || item.isBomb ? 12 : 6;
    ctx.shadowOffsetY = 2;

    // Draw rounded rect badge casing
    ctx.fillStyle = casingFill;
    ctx.strokeStyle = casingBorder;
    ctx.lineWidth = isTargeted ? 2.5 : 1.8;

    this.roundRect(ctx, badgeX - badgeW / 2, badgeY - badgeH / 2, badgeW, badgeH, cornerRadius);
    ctx.fill();
    ctx.stroke();

    // Reset shadow for crisp text
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // Draw little arrow pointer pointing down to the flying item
    ctx.fillStyle = casingFill;
    ctx.beginPath();
    ctx.moveTo(badgeX - 5, badgeY + badgeH / 2);
    ctx.lineTo(badgeX + 5, badgeY + badgeH / 2);
    ctx.lineTo(badgeX, badgeY + badgeH / 2 + 5);
    ctx.closePath();
    ctx.fill();

    // Render characters:
    // Typed matched characters in bright golden yellow or neon, remaining in solid bold white
    const startX = badgeX - textWidth / 2;
    let currX = startX;

    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      const charWidth = ctx.measureText(char).width;

      if (i < item.typedLength) {
        // Highlighted typed letters
        if (item.isBomb) {
          ctx.fillStyle = '#FF1744'; // Red alert if typing a bomb word!
        } else if (isNight) {
          ctx.fillStyle = '#FF1493'; // Infrared Strawberry Neon
        } else {
          ctx.fillStyle = '#FFD700'; // Golden butter yellow
        }
      } else {
        // Untyped remaining letters: thick solid White (#FFFFFF)
        ctx.fillStyle = '#FFFFFF';
      }

      ctx.fillText(char, currX, badgeY);
      currX += charWidth;
    }

    // Danger indicator badge icon if it's an Oven Bomb
    if (item.isBomb) {
      ctx.fillStyle = '#FF1744';
      ctx.font = '900 11px "Outfit", sans-serif';
      ctx.fillText('⚠ AVOID!', badgeX, badgeY - badgeH / 2 - 8);
    }

    ctx.restore();
  }

  /**
   * Draws sliced halves tumbling through space
   */
  public drawSlicedPiece(piece: SlicedPiece, theme: ThemeMode) {
    const { ctx } = this;
    ctx.save();
    ctx.translate(piece.x, piece.y);
    ctx.rotate(piece.rotation);
    ctx.globalAlpha = Math.max(piece.alpha, 0);

    // Clip to left or right half
    ctx.save();
    ctx.beginPath();
    const clipW = piece.radius * 2.5;
    const clipH = piece.radius * 2.5;
    if (piece.side === 'left') {
      ctx.rect(-clipW, -clipH, clipW, clipH * 2);
    } else {
      ctx.rect(0, -clipH, clipW, clipH * 2);
    }
    ctx.clip();

    if (piece.isGoldenButter) {
      this.drawGoldenButterGraphic(piece.radius, theme, true);
    } else {
      this.drawFoodGraphic(piece.type, piece.radius, theme, true);
    }

    ctx.restore();

    // Cross-section cut surface highlighting
    ctx.strokeStyle = piece.colorTheme === 'night' ? '#FF1493' : '#FFE57F';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, -piece.radius);
    ctx.lineTo(0, piece.radius);
    ctx.stroke();

    ctx.restore();
  }

  /**
   * Draws floating point score text (+100, +300 COMBO x3)
   */
  public drawFloatingTexts(texts: FloatingText[]) {
    const { ctx } = this;
    for (const t of texts) {
      ctx.save();
      ctx.globalAlpha = Math.max(t.alpha, 0);
      ctx.translate(t.x, t.y);
      ctx.scale(t.scale, t.scale);

      ctx.font = '900 18px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Outline
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 4;
      ctx.strokeText(t.text, 0, 0);

      // Fill
      ctx.fillStyle = t.color;
      ctx.fillText(t.text, 0, 0);

      ctx.restore();
    }
  }

  // --- PROCEDURAL FOOD & BOMB GRAPHICS ---

  private drawOvenBombGraphic(radius: number, theme: ThemeMode) {
    const { ctx } = this;
    const isNight = theme === 'night';

    // Glowing danger ring
    ctx.save();
    const glowColor = isNight ? 'rgba(255, 0, 85, 0.7)' : 'rgba(211, 47, 47, 0.6)';
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 24;

    // Heavy iron spherical body
    const ironGrad = ctx.createRadialGradient(-radius * 0.3, -radius * 0.3, 4, 0, 0, radius);
    ironGrad.addColorStop(0, '#424242');
    ironGrad.addColorStop(0.7, '#1E1E1E');
    ironGrad.addColorStop(1, '#0F0F0F');
    ctx.fillStyle = ironGrad;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();

    // Glowing oven grate / thermal core slits
    ctx.strokeStyle = isNight ? '#FF0055' : '#FF5722';
    ctx.lineWidth = 3.5;
    ctx.shadowColor = isNight ? '#FF1493' : '#FF9800';
    ctx.shadowBlur = 12;

    for (let i = -1; i <= 1; i++) {
      const offset = i * (radius * 0.35);
      const span = Math.sqrt(radius * radius - offset * offset) * 0.65;
      ctx.beginPath();
      ctx.moveTo(-span, offset);
      ctx.lineTo(span, offset);
      ctx.stroke();
    }

    // Brass bomb cap / collar
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#FFA000';
    ctx.fillRect(-radius * 0.28, -radius - 8, radius * 0.56, 10);

    // Burning animated fuse
    ctx.strokeStyle = '#8D6E63';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, -radius - 8);
    ctx.quadraticCurveTo(radius * 0.35, -radius - 22, radius * 0.1, -radius - 28);
    ctx.stroke();

    // Dynamic crackling sparks at fuse tip
    const sparkX = radius * 0.1;
    const sparkY = -radius - 28;
    ctx.fillStyle = '#FFF';
    ctx.shadowColor = isNight ? '#FF0055' : '#FFEB3B';
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.arc(sparkX, sparkY, 4, 0, Math.PI * 2);
    ctx.fill();

    // Little spark rays
    for (let s = 0; s < 4; s++) {
      const sAngle = (s / 4) * Math.PI * 2 + (Date.now() * 0.01);
      ctx.strokeStyle = isNight ? '#FF0055' : '#FF9800';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(sparkX, sparkY);
      ctx.lineTo(sparkX + Math.cos(sAngle) * 9, sparkY + Math.sin(sAngle) * 9);
      ctx.stroke();
    }

    ctx.restore();
  }

  private drawGoldenButterGraphic(radius: number, theme: ThemeMode, isSliced: boolean = false) {
    const { ctx } = this;
    const isNight = theme === 'night';

    ctx.save();
    // Shimmering aura
    ctx.shadowColor = isNight ? '#FF0055' : '#FFD700';
    ctx.shadowBlur = 20;

    // Churned Golden Butter Block
    const w = radius * 1.6;
    const h = radius * 1.1;

    // 3D block top face
    const butterGrad = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
    butterGrad.addColorStop(0, '#FFF9C4');
    butterGrad.addColorStop(0.3, '#FFEB3B');
    butterGrad.addColorStop(0.8, '#FFC72C');
    butterGrad.addColorStop(1, '#FFA000');

    ctx.fillStyle = butterGrad;
    this.roundRect(ctx, -w / 2, -h / 2, w, h, 8);
    ctx.fill();

    // Golden border
    ctx.strokeStyle = isNight ? '#FF1493' : '#FFB300';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Crown or Butter Swirl engraving
    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.32, 0.2, Math.PI * 1.8);
    ctx.stroke();

    // Specular highlight stripe
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    this.roundRect(ctx, -w / 2 + 6, -h / 2 + 4, w - 12, 5, 2);
    ctx.fill();

    ctx.restore();
  }

  private drawFoodGraphic(type: string, radius: number, theme: ThemeMode, isSliced: boolean = false) {
    const { ctx } = this;

    switch (type) {
      case 'apple': {
        // Crisp glossy red apple
        const grad = ctx.createRadialGradient(-radius * 0.25, -radius * 0.25, 4, 0, 0, radius);
        grad.addColorStop(0, '#FF5252');
        grad.addColorStop(0.7, '#D32F2F');
        grad.addColorStop(1, '#9A0007');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();

        // Indentation top
        ctx.fillStyle = '#680003';
        ctx.beginPath();
        ctx.arc(0, -radius * 0.85, 6, 0, Math.PI * 2);
        ctx.fill();

        // Stem
        ctx.strokeStyle = '#5D4037';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, -radius * 0.85);
        ctx.quadraticCurveTo(8, -radius - 12, 12, -radius - 14);
        ctx.stroke();

        // Tiny green leaf
        ctx.fillStyle = '#4CAF50';
        ctx.beginPath();
        ctx.ellipse(8, -radius - 8, 8, 4, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();

        // Specular shine
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.ellipse(-radius * 0.35, -radius * 0.35, radius * 0.28, radius * 0.16, -Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      case 'watermelon': {
        // Striped green outer rind
        ctx.fillStyle = '#2E7D32';
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();

        // Dark green stripes
        ctx.strokeStyle = '#1B5E20';
        ctx.lineWidth = 4;
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 3) {
          ctx.beginPath();
          ctx.arc(0, 0, radius - 2, a, a + 0.3);
          ctx.stroke();
        }

        // Inner white rind
        ctx.fillStyle = '#DCEDC8';
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.84, 0, Math.PI * 2);
        ctx.fill();

        // Vibrant pink-red juicy core
        ctx.fillStyle = '#E91E63';
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.74, 0, Math.PI * 2);
        ctx.fill();

        // Black watermelon seeds
        ctx.fillStyle = '#212121';
        for (let i = 0; i < 5; i++) {
          const seedAngle = (i / 5) * Math.PI * 2 + 0.3;
          const sx = Math.cos(seedAngle) * radius * 0.45;
          const sy = Math.sin(seedAngle) * radius * 0.45;
          ctx.beginPath();
          ctx.ellipse(sx, sy, 3, 5, seedAngle, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      }

      case 'tomato': {
        // Plump red tomato
        const grad = ctx.createRadialGradient(-radius * 0.25, -radius * 0.25, 4, 0, 0, radius);
        grad.addColorStop(0, '#FF3D00');
        grad.addColorStop(0.7, '#DD2C00');
        grad.addColorStop(1, '#BF360C');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();

        // Star-shaped green calyx
        ctx.fillStyle = '#2E7D32';
        for (let i = 0; i < 5; i++) {
          const a = (i / 5) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(0, -radius * 0.3);
          ctx.lineTo(Math.cos(a) * radius * 0.55, -radius * 0.3 + Math.sin(a) * radius * 0.35);
          ctx.lineTo(Math.cos(a + 0.5) * 4, -radius * 0.3 + Math.sin(a + 0.5) * 4);
          ctx.closePath();
          ctx.fill();
        }

        // Specular highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.beginPath();
        ctx.ellipse(-radius * 0.3, -radius * 0.35, radius * 0.25, radius * 0.14, -Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      case 'lemon': {
        // Oval citrus shape with pointed tips
        ctx.fillStyle = '#FFEB3B';
        ctx.beginPath();
        ctx.ellipse(0, 0, radius * 1.15, radius * 0.85, 0, 0, Math.PI * 2);
        ctx.fill();

        // Lemon tip nubs
        ctx.beginPath();
        ctx.arc(-radius * 1.12, 0, 5, 0, Math.PI * 2);
        ctx.arc(radius * 1.12, 0, 5, 0, Math.PI * 2);
        ctx.fill();

        // Peel texture dots
        ctx.fillStyle = '#FBC02D';
        ctx.beginPath();
        ctx.arc(-radius * 0.3, radius * 0.2, 2, 0, Math.PI * 2);
        ctx.arc(radius * 0.4, -radius * 0.1, 2, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      case 'orange': {
        // Bright juicy orange
        const grad = ctx.createRadialGradient(-radius * 0.25, -radius * 0.25, 4, 0, 0, radius);
        grad.addColorStop(0, '#FFA726');
        grad.addColorStop(0.8, '#FB8C00');
        grad.addColorStop(1, '#EF6C00');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();

        // Stem button
        ctx.fillStyle = '#558B2F';
        ctx.beginPath();
        ctx.arc(0, -radius * 0.88, 4, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      case 'strawberry': {
        // Conical / heart strawberry
        ctx.fillStyle = '#D50000';
        ctx.beginPath();
        ctx.moveTo(0, radius * 1.1);
        ctx.bezierCurveTo(-radius * 1.2, radius * 0.3, -radius * 1.0, -radius * 0.7, 0, -radius * 0.7);
        ctx.bezierCurveTo(radius * 1.0, -radius * 0.7, radius * 1.2, radius * 0.3, 0, radius * 1.1);
        ctx.fill();

        // Yellow seed dots
        ctx.fillStyle = '#FFEB3B';
        const seedCoords = [
          [-radius * 0.4, 0], [0, 0], [radius * 0.4, 0],
          [-radius * 0.2, radius * 0.4], [radius * 0.2, radius * 0.4],
          [0, radius * 0.7], [-radius * 0.3, -radius * 0.3], [radius * 0.3, -radius * 0.3]
        ];
        for (const [sx, sy] of seedCoords) {
          ctx.beginPath();
          ctx.ellipse(sx, sy, 1.8, 2.5, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        // Green leafy top
        ctx.fillStyle = '#388E3C';
        for (let i = -2; i <= 2; i++) {
          ctx.beginPath();
          ctx.ellipse(i * (radius * 0.25), -radius * 0.75, 5, 10, i * 0.3, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      }

      case 'pineapple': {
        // Amber textured oval body
        const grad = ctx.createLinearGradient(0, -radius * 0.8, 0, radius * 0.8);
        grad.addColorStop(0, '#FFA000');
        grad.addColorStop(0.5, '#FF8F00');
        grad.addColorStop(1, '#E65100');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(0, radius * 0.2, radius * 0.8, radius * 0.95, 0, 0, Math.PI * 2);
        ctx.fill();

        // Crosshatch scales
        ctx.strokeStyle = '#FFE082';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-radius * 0.6, 0);
        ctx.lineTo(radius * 0.6, radius * 0.6);
        ctx.moveTo(radius * 0.6, 0);
        ctx.lineTo(-radius * 0.6, radius * 0.6);
        ctx.stroke();

        // Crown of green fronds
        ctx.fillStyle = '#2E7D32';
        for (let f = -2; f <= 2; f++) {
          ctx.beginPath();
          ctx.moveTo(f * 6, -radius * 0.7);
          ctx.lineTo(f * 12, -radius * 1.5);
          ctx.lineTo(f * 6 + 6, -radius * 0.7);
          ctx.closePath();
          ctx.fill();
        }
        break;
      }

      case 'avocado': {
        // Pear-shaped dark green skin
        ctx.fillStyle = '#1B3518';
        ctx.beginPath();
        ctx.ellipse(0, radius * 0.15, radius * 0.88, radius * 1.05, 0, 0, Math.PI * 2);
        ctx.fill();

        // Light lime-green creamy flesh
        ctx.fillStyle = '#C5E1A5';
        ctx.beginPath();
        ctx.ellipse(0, radius * 0.15, radius * 0.75, radius * 0.9, 0, 0, Math.PI * 2);
        ctx.fill();

        // Glossy brown center pit
        const pitGrad = ctx.createRadialGradient(-3, radius * 0.25 - 3, 2, 0, radius * 0.25, radius * 0.42);
        pitGrad.addColorStop(0, '#8D6E63');
        pitGrad.addColorStop(0.8, '#4E342E');
        pitGrad.addColorStop(1, '#3E2723');
        ctx.fillStyle = pitGrad;
        ctx.beginPath();
        ctx.arc(0, radius * 0.25, radius * 0.38, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      case 'carrot': {
        // Tapered orange carrot
        ctx.fillStyle = '#FF6D00';
        ctx.beginPath();
        ctx.moveTo(-radius * 0.45, -radius * 0.6);
        ctx.lineTo(radius * 0.45, -radius * 0.6);
        ctx.lineTo(0, radius * 1.2);
        ctx.closePath();
        ctx.fill();

        // Ridges
        ctx.strokeStyle = '#E65100';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-radius * 0.25, -radius * 0.2);
        ctx.lineTo(radius * 0.25, -radius * 0.2);
        ctx.moveTo(-radius * 0.18, radius * 0.3);
        ctx.lineTo(radius * 0.18, radius * 0.3);
        ctx.stroke();

        // Top green foliage
        ctx.strokeStyle = '#4CAF50';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, -radius * 0.6);
        ctx.lineTo(-8, -radius * 1.1);
        ctx.moveTo(0, -radius * 0.6);
        ctx.lineTo(0, -radius * 1.2);
        ctx.moveTo(0, -radius * 0.6);
        ctx.lineTo(8, -radius * 1.1);
        ctx.stroke();
        break;
      }

      default: {
        // Generic fallback fruit
        ctx.fillStyle = '#FF5252';
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
    }
  }

  private roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
}

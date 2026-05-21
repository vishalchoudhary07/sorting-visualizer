/**
 * visualizer.js
 * Canvas rendering engine — supports 5 visual styles:
 *   bars | dots | radial | wave | spectrum
 */

// ─── COLOR PALETTE ────────────────────────────────────────────────────────────
const COLOR = {
  bar:     '#3b82f6',  // default bar — blue
  cmp:     '#f59e0b',  // comparing  — amber
  swap:    '#ef4444',  // swapping   — red
  sorted:  '#22c55e',  // sorted     — green
  pivot:   '#a855f7',  // pivot      — purple
  sub:     '#06b6d4',  // sub-array  — cyan
};

/**
 * Determine the highlight colour for a given index.
 * @param {number} idx
 * @param {object|null} step
 * @returns {string}
 */
function getBarColor(idx, step) {
  if (!step) return COLOR.bar;
  if (step.sorted && step.sorted.has(idx)) return COLOR.sorted;
  if (step.type === 'pivot' && step.i === idx) return COLOR.pivot;
  if (step.type === 'sub' && idx >= step.i && idx <= step.j) return COLOR.sub;
  if ((step.type === 'cmp' || step.type === 'set') && (idx === step.i || idx === step.j)) return COLOR.cmp;
  if (step.type === 'swap' && (idx === step.i || idx === step.j)) return COLOR.swap;
  return COLOR.bar;
}

// ─── MAIN DRAW DISPATCHER ─────────────────────────────────────────────────────
/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLCanvasElement} canvas
 * @param {number[]} arr
 * @param {object|null} step
 * @param {string} visStyle  — 'bars' | 'dots' | 'radial' | 'wave' | 'spectrum'
 * @param {boolean} showValues
 */
function drawArray(ctx, canvas, arr, step, visStyle, showValues) {
  const W = canvas.width;
  const H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  if (!arr || arr.length === 0) return;

  const n = arr.length;
  const max = Math.max(...arr) || 1;

  switch (visStyle) {
    case 'bars':     drawBars(ctx, W, H, arr, n, max, step, showValues); break;
    case 'dots':     drawDots(ctx, W, H, arr, n, max, step, showValues); break;
    case 'radial':   drawRadial(ctx, W, H, arr, n, max, step); break;
    case 'wave':     drawWave(ctx, W, H, arr, n, max, step); break;
    case 'spectrum': drawSpectrum(ctx, W, H, arr, n, max, step); break;
    default:         drawBars(ctx, W, H, arr, n, max, step, showValues);
  }
}

// ─── BARS ─────────────────────────────────────────────────────────────────────
// ─── BARS ─────────────────────────────────────────────────────────────────────
function drawBars(ctx, W, H, arr, n, max, step, showValues) {
  const bw = W / n;

  arr.forEach((v, i) => {
    const bh = (v / max) * (H * 0.88);
    const x = i * bw;
    const y = H - bh;
    
    const baseColor = getBarColor(i, step);
    
    // Create a slick vertical gradient for each bar
    const grad = ctx.createLinearGradient(x, y, x, H);
    grad.addColorStop(0, baseColor);
    
    // Fade the bottom of the bar out slightly for a modern look
    if (baseColor === COLOR.bar) {
      grad.addColorStop(1, 'rgba(59,130,246, 0.1)');
    } else {
      grad.addColorStop(1, 'rgba(20,20,20, 0.8)'); 
    }

    ctx.fillStyle = grad;

    // Draw rounded top corners for the bars
    const radius = Math.min(4, bw / 2);
    ctx.beginPath();
    ctx.moveTo(x + 0.5, H);
    ctx.lineTo(x + 0.5, y + radius);
    ctx.quadraticCurveTo(x + 0.5, y, x + 0.5 + radius, y);
    ctx.lineTo(x + Math.max(1, bw - 0.5) - radius, y);
    ctx.quadraticCurveTo(x + Math.max(1, bw - 0.5), y, x + Math.max(1, bw - 0.5), y + radius);
    ctx.lineTo(x + Math.max(1, bw - 0.5), H);
    ctx.fill();

    if (showValues && bw > 24 && bh > 20) {
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.font = `bold ${Math.min(11, bw - 4)}px 'Space Mono', monospace`;
      ctx.textAlign = 'center';
      ctx.fillText(v, x + bw / 2, y + 16);
    }
  });
}

// ─── SCATTER DOTS ─────────────────────────────────────────────────────────────
function drawDots(ctx, W, H, arr, n, max, step, showValues) {
  const bw = W / n;

  // faint connector line
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(59,130,246,.15)';
  ctx.lineWidth = 1;
  arr.forEach((v, i) => {
    const x = i * bw + bw / 2;
    const y = H - (v / max) * (H * 0.88) - 4;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.stroke();

  arr.forEach((v, i) => {
    const x = i * bw + bw / 2;
    const y = H - (v / max) * (H * 0.88) - 4;
    const r = Math.min(bw / 2 - 0.5, 5);

    ctx.beginPath();
    ctx.arc(x, y, Math.max(1.5, r), 0, Math.PI * 2);
    ctx.fillStyle = getBarColor(i, step);
    ctx.fill();

    if (showValues && bw > 24) {
      ctx.fillStyle = getBarColor(i, step);
      ctx.font = '9px Space Mono';
      ctx.textAlign = 'center';
      ctx.fillText(v, x, y - 8);
    }
  });
}

// ─── CIRCULAR / RADIAL ────────────────────────────────────────────────────────
function drawRadial(ctx, W, H, arr, n, max, step) {
  const cx = W / 2;
  const cy = H / 2;
  const outerR = Math.min(W, H) / 2 - 20;
  const innerR = outerR * 0.22;
  const angleStep = (Math.PI * 2) / n;

  arr.forEach((v, i) => {
    const angle = -Math.PI / 2 + i * angleStep;
    const r = innerR + (v / max) * (outerR - innerR);

    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * innerR, cy + Math.sin(angle) * innerR);
    ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
    ctx.strokeStyle = getBarColor(i, step);
    ctx.lineWidth = Math.max(1, (W / n) * 0.8);
    ctx.stroke();
  });
}

// ─── WAVEFORM ─────────────────────────────────────────────────────────────────
function drawWave(ctx, W, H, arr, n, max, step) {
  const bw = W / n;

  // fill area
  ctx.beginPath();
  arr.forEach((v, i) => {
    const x = i * bw + bw / 2;
    const y = H - (v / max) * (H * 0.88);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, 'rgba(59,130,246,.28)');
  grad.addColorStop(1, 'rgba(59,130,246,.02)');
  ctx.fillStyle = grad;
  ctx.fill();

  // stroke
  ctx.beginPath();
  arr.forEach((v, i) => {
    const x = i * bw + bw / 2;
    const y = H - (v / max) * (H * 0.88);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.strokeStyle = 'rgba(59,130,246,.5)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // highlighted points
  arr.forEach((v, i) => {
    const col = getBarColor(i, step);
    if (col !== COLOR.bar) {
      const x = i * bw + bw / 2;
      const y = H - (v / max) * (H * 0.88);
      ctx.beginPath();
      ctx.arc(x, y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = col;
      ctx.fill();
    }
  });
}

// ─── COLOR SPECTRUM ───────────────────────────────────────────────────────────
function drawSpectrum(ctx, W, H, arr, n, max, step) {
  const bw = W / n;

  arr.forEach((v, i) => {
    const bh = (v / max) * (H * 0.88);
    const x = i * bw;
    const y = H - bh;

    // hue mapped to value — sorted = full rainbow
    const hue = (v / max) * 270;
    const isSorted = step && step.sorted && step.sorted.has(i);
    ctx.fillStyle = isSorted ? COLOR.sorted : `hsl(${hue}, 85%, 60%)`;
    ctx.fillRect(x + 0.5, y, Math.max(1, bw - 0.5), bh);

    // overlay highlight
    const highlight = getBarColor(i, step);
    if (highlight !== COLOR.bar && !isSorted) {
      ctx.fillStyle = highlight;
      ctx.globalAlpha = 0.45;
      ctx.fillRect(x + 0.5, y, Math.max(1, bw - 0.5), bh);
      ctx.globalAlpha = 1;
    }
  });
}

// ─── LIVE COMPARISON GRAPH ────────────────────────────────────────────────────
function drawGraph(graphCtx, graphCanvas, data) {
  const W = graphCanvas.width;
  const H = graphCanvas.height;
  graphCtx.clearRect(0, 0, W, H);

  if (data.length < 2) return;

  const maxV = Math.max(...data, 1);

  graphCtx.beginPath();
  data.forEach((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - (v / maxV) * (H * 0.82) - 4;
    i === 0 ? graphCtx.moveTo(x, y) : graphCtx.lineTo(x, y);
  });
  graphCtx.strokeStyle = '#f59e0b';
  graphCtx.lineWidth = 1.5;
  graphCtx.stroke();

  // fill below
  graphCtx.lineTo(W, H);
  graphCtx.lineTo(0, H);
  graphCtx.closePath();
  const g = graphCtx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, 'rgba(245,158,11,.22)');
  g.addColorStop(1, 'rgba(245,158,11,0)');
  graphCtx.fillStyle = g;
  graphCtx.fill();
}

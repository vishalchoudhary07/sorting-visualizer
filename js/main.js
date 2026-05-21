/**
 * main.js
 * Application controller — wires all modules together.
 * Handles: Normal mode, Step-by-Step mode, theme toggle, data presets, canvas resize.
 */

// ─── CANVAS ELEMENTS ──────────────────────────────────────────────────────────
const mainCanvas   = document.getElementById('mainCanvas');
const mainCtx      = mainCanvas.getContext('2d');
const graphCanvas  = document.getElementById('liveGraph');
const graphCtx     = graphCanvas.getContext('2d');

// ─── APP STATE ────────────────────────────────────────────────────────────────
let array        = [];
let N            = 60;
let currentAlgo  = 'bubble';
let currentVis   = 'bars';
let currentPreset = 'random';
let showValues   = false;
let mode         = 'normal';   // 'normal' | 'step'

// sort runtime state
let sortSteps   = [];
let stepIdx     = 0;
let sortInterval = null;
let timerInterval = null;
let sorting      = false;
let paused       = false;
let comparisons  = 0;
let swaps        = 0;
let startTime    = null;
let graphData    = [];

// ─── RESIZE ───────────────────────────────────────────────────────────────────
function resizeCanvases() {
  const ca = document.getElementById('canvasArea');
  mainCanvas.width  = ca.clientWidth;
  mainCanvas.height = ca.clientHeight;

  graphCanvas.width  = graphCanvas.parentElement.clientWidth - 40;
  graphCanvas.height = 80;

  redraw();
}
window.addEventListener('resize', resizeCanvases);

// ─── REDRAW HELPERS ───────────────────────────────────────────────────────────
function redraw(step) {
  drawArray(mainCtx, mainCanvas, array, step || null, currentVis, showValues);
}

// ─── ARRAY HELPERS ────────────────────────────────────────────────────────────
function newArray() {
  array = generateArray(currentPreset, N);
  redraw();
}

// ─── SORT CONTROL ─────────────────────────────────────────────────────────────
function stopSort() {
  if (sortInterval) { clearInterval(sortInterval); sortInterval = null; }
  sorting = false;
}

function resetSortState() {
  stopSort();
  clearInterval(timerInterval); timerInterval = null;
  comparisons = 0; swaps = 0; startTime = null;
  graphData = []; sortSteps = []; stepIdx = 0;
  resetStats();
  updateWhyBox('Press PLAY to begin.');
  drawGraph(graphCtx, graphCanvas, []);
  document.getElementById('playBtn').textContent  = '▶ PLAY';
  document.getElementById('playBtn').disabled     = false;
  document.getElementById('pauseBtn').disabled    = true;
  sorting = false; paused = false;
}

function startSort() {
  if (sorting && !paused) return;

  if (paused) {
    paused = false;
    document.getElementById('playBtn').textContent = '▶ PLAYING';
    runSort();
    return;
  }

  resetSortState();
  sortSteps = buildSteps(currentAlgo, [...array]);
  stepIdx   = 0;

  startTime = performance.now();
  sorting   = true;

  document.getElementById('playBtn').textContent = '▶ PLAYING';
  document.getElementById('pauseBtn').disabled   = false;

  timerInterval = setInterval(() => {
    if (sorting && !paused) {
      updateStats(comparisons, swaps, Math.round(performance.now() - startTime), stepIdx);
    }
  }, 100);

  runSort();
}

function runSort() {
  const speed = parseInt(document.getElementById('speedSlider').value);
  const delay = Math.max(4, Math.round(210 - speed * 2));

  sortInterval = setInterval(() => {
    if (paused) { clearInterval(sortInterval); sortInterval = null; return; }
    if (stepIdx >= sortSteps.length) {
      stopSort();
      clearInterval(timerInterval);
      document.getElementById('playBtn').textContent = '▶ PLAY';
      document.getElementById('pauseBtn').disabled   = true;
      addHistoryEntry(currentAlgo, array.length, currentPreset, comparisons, swaps,
        Math.round(performance.now() - startTime), currentVis);
      return;
    }

    const step = sortSteps[stepIdx];
    array = step.arr;

    if (step.type === 'cmp')  comparisons++;
    if (step.type === 'swap') swaps++;

    graphData.push(comparisons);
    if (graphData.length % 4 === 0) drawGraph(graphCtx, graphCanvas, graphData);

    updateWhyBox(step.why || '');
    drawArray(mainCtx, mainCanvas, array, step, currentVis, showValues);
    updateStats(comparisons, swaps, Math.round(performance.now() - startTime), stepIdx + 1);
    stepIdx++;
  }, delay);
}

// ─── STEP MODE ────────────────────────────────────────────────────────────────
function initStepMode() {
  sortSteps = buildSteps(currentAlgo, [...array]);
  stepIdx   = 0;
  comparisons = 0; swaps = 0;
  updateStepInfo();
  redraw();
}

function stepForward() {
  if (stepIdx >= sortSteps.length) return;
  const step = sortSteps[stepIdx];
  array = step.arr;
  if (step.type === 'cmp')  comparisons++;
  if (step.type === 'swap') swaps++;
  updateWhyBox(step.why || '');
  drawArray(mainCtx, mainCanvas, array, step, currentVis, showValues);
  stepIdx++;
  updateStepInfo();
  updateStats(comparisons, swaps, '—', stepIdx);
  if (stepIdx >= sortSteps.length) {
    addHistoryEntry(currentAlgo, array.length, currentPreset, comparisons, swaps, 0, currentVis);
  }
}

function stepBackward() {
  if (stepIdx <= 0) return;
  stepIdx--;
  comparisons = Math.max(0, comparisons - 1);
  const step = sortSteps[Math.max(0, stepIdx - 1)];
  if (step) {
    array = step.arr;
    drawArray(mainCtx, mainCanvas, array, step, currentVis, showValues);
    updateWhyBox(step.why || '');
  }
  updateStepInfo();
}

function updateStepInfo() {
  document.getElementById('stepInfo').textContent =
    `STEP ${stepIdx} / ${sortSteps.length}`;
}

// ─── MODE SWITCHING ───────────────────────────────────────────────────────────
function setMode(newMode) {
  mode = newMode;
  stopSort();
  clearInterval(timerInterval);

  // element references
  const stepControls  = document.getElementById('stepControls');

  // reset visibility
  stepControls.style.display = 'none';

  document.querySelectorAll('.mode-tab').forEach(t =>
    t.classList.toggle('active', t.dataset.mode === newMode)
  );

  if (newMode === 'step') {
    stepControls.style.display = 'flex';
    initStepMode();
  }

  setTimeout(resizeCanvases, 60);
}

// ─── EVENT WIRING ─────────────────────────────────────────────────────────────

// Algorithm tabs
document.querySelectorAll('.algo-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.algo-tab').forEach(b => b.classList.remove('active'));
    tab.classList.add('active');
    currentAlgo = tab.dataset.algo;
    renderAlgoInfo(currentAlgo);
    resetSortState();
    array = generateArray(currentPreset, N);
    redraw();
    if (mode === 'step') initStepMode();
  });
});

// Mode tabs
document.querySelectorAll('.mode-tab').forEach(tab => {
  tab.addEventListener('click', () => setMode(tab.dataset.mode));
});

// Play / Pause / Reset
document.getElementById('playBtn').addEventListener('click', startSort);

document.getElementById('pauseBtn').addEventListener('click', () => {
  paused = true;
  stopSort();
  document.getElementById('playBtn').textContent = '▶ RESUME';
  document.getElementById('playBtn').disabled    = false;
});

document.getElementById('resetBtn').addEventListener('click', () => {
  resetSortState();
  array = generateArray(currentPreset, N);
  redraw();
  if (mode === 'step') initStepMode();
});

// Step controls
document.getElementById('stepBack').addEventListener('click', stepBackward);
document.getElementById('stepFwd').addEventListener('click', stepForward);

// Visual style buttons
document.querySelectorAll('.vis-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.vis-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentVis = btn.dataset.vis;
    redraw();
  });
});

// Data preset buttons
document.querySelectorAll('.data-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.data-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentPreset = btn.dataset.preset;
    resetSortState();
    array = generateArray(currentPreset, N);
    redraw();
    if (mode === 'step') initStepMode();
  });
});

// Size slider
document.getElementById('sizeSlider').addEventListener('input', e => {
  N = parseInt(e.target.value);
  document.getElementById('sizeVal').textContent = N;
  resetSortState();
  array = generateArray(currentPreset, N);
  redraw();
  if (mode === 'step') initStepMode();
});

// Show values toggle
document.getElementById('showValues').addEventListener('change', e => {
  showValues = e.target.checked;
  redraw();
});

// Custom array input
document.getElementById('applyCustom').addEventListener('click', () => {
  const raw = document.getElementById('customInput').value;
  const parsed = raw
    .split(/[,\s]+/)
    .map(v => parseInt(v.trim()))
    .filter(v => !isNaN(v) && v > 0);

  if (parsed.length >= 2) {
    array = parsed;
    N = parsed.length;
    document.getElementById('sizeVal').textContent = N;
    resetSortState();
    redraw();
    if (mode === 'step') initStepMode();
  } else {
    alert('Please enter at least 2 valid positive numbers, separated by commas.');
  }
});

// Theme toggle
document.getElementById('themeBtn').addEventListener('click', () => {
  document.body.classList.toggle('light');
});

// Keyboard shortcuts
document.addEventListener('keydown', e => {
  if (mode === 'step') {
    if (e.key === 'ArrowRight') stepForward();
    if (e.key === 'ArrowLeft')  stepBackward();
  }
  if (e.key === ' ') {
    e.preventDefault();
    if (!sorting || paused) startSort();
    else {
      paused = true; stopSort();
      document.getElementById('playBtn').textContent = '▶ RESUME';
    }
  }
});

// ─── BOOT ─────────────────────────────────────────────────────────────────────
renderAlgoInfo('bubble');
array = generateArray('random', N);
setTimeout(() => { resizeCanvases(); redraw(); }, 80);
window.addEventListener('load', () => { resizeCanvases(); redraw(); });
/**
 * stats.js
 * Manages the live stats panel, the "What's Happening" box,
 * and the algorithm complexity info card.
 */

// ─── STAT ELEMENTS ────────────────────────────────────────────────────────────
const elComp  = document.getElementById('statComp');
const elSwap  = document.getElementById('statSwap');
const elTime  = document.getElementById('statTime');
const elStep  = document.getElementById('statStep');
const elWhy   = document.getElementById('whyBox');
const elCxGrid = document.getElementById('complexityGrid');

/**
 * Update the four stat boxes.
 * @param {number} comparisons
 * @param {number} swaps
 * @param {string|number} time   — pass a string like "240ms" or a number (ms)
 * @param {number} stepNum
 */
function updateStats(comparisons, swaps, time, stepNum) {
  elComp.textContent = comparisons.toLocaleString();
  elSwap.textContent = swaps.toLocaleString();
  elTime.textContent = typeof time === 'number' ? time + 'ms' : time;
  elStep.textContent = stepNum.toLocaleString();
}

/** Reset stats to zero. */
function resetStats() {
  updateStats(0, 0, '0ms', 0);
}

/**
 * Update the "What's Happening" explanation box.
 * @param {string} text
 */
function updateWhyBox(text) {
  elWhy.textContent = text || '';
}

/**
 * Render the complexity info card for the given algorithm key.
 * @param {string} algoKey
 */
function renderAlgoInfo(algoKey) {
  const info = ALGO_INFO[algoKey];
  if (!info) return;

  elCxGrid.innerHTML = `
    <div class="cx-row">
      <span class="cx-label">BEST</span>
      <span class="cx-val ${complexityClass(info.best)}">${info.best}</span>
    </div>
    <div class="cx-row">
      <span class="cx-label">AVERAGE</span>
      <span class="cx-val ${complexityClass(info.avg)}">${info.avg}</span>
    </div>
    <div class="cx-row">
      <span class="cx-label">WORST</span>
      <span class="cx-val ${complexityClass(info.worst)}">${info.worst}</span>
    </div>
    <div class="cx-row">
      <span class="cx-label">SPACE</span>
      <span class="cx-val ${complexityClass(info.space)}">${info.space}</span>
    </div>
    <div class="cx-row">
      <span class="cx-label">STABLE</span>
      <span class="cx-val ${info.stable ? 'good' : 'bad'}">${info.stable ? 'YES' : 'NO'}</span>
    </div>
    <div class="use-case">${info.use}</div>
  `;
}

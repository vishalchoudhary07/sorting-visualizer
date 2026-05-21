/**
 * history.js
 * Tracks completed sort runs and renders the history list.
 */

/** @type {Array<{algo,size,preset,comparisons,swaps,time,vis}>} */
const runHistory = [];

const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistory');

/**
 * Record a completed sort run.
 * @param {string} algoKey
 * @param {number} arraySize
 * @param {string} preset
 * @param {number} comparisons
 * @param {number} swaps
 * @param {number} elapsedMs
 * @param {string} visStyle
 */
function addHistoryEntry(algoKey, arraySize, preset, comparisons, swaps, elapsedMs, visStyle) {
  runHistory.unshift({
    algo: ALGO_INFO[algoKey]?.name || algoKey,
    size: arraySize,
    preset,
    comparisons,
    swaps,
    time: elapsedMs,
    vis: visStyle,
    ts: Date.now(),
  });
  renderHistory();
}

/** Re-render the history list. */
function renderHistory() {
  if (runHistory.length === 0) {
    historyList.innerHTML = '<div class="history-empty">No runs yet.</div>';
    return;
  }

  historyList.innerHTML = runHistory
    .slice(0, 10)
    .map(h => `
      <div class="history-item">
        <div class="h-algo">${h.algo}</div>
        ${h.size} items · ${h.preset} · ${h.vis}<br>
        Comp: ${h.comparisons.toLocaleString()} · Swaps: ${h.swaps.toLocaleString()} · ${h.time}ms
      </div>
    `)
    .join('');
}

clearHistoryBtn.addEventListener('click', () => {
  runHistory.length = 0;
  renderHistory();
});

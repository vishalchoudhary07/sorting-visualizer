/**
 * data.js
 * Array generation presets and algorithm metadata.
 */

// ─── ALGORITHM REGISTRY ──────────────────────────────────────────────────────
const ALGO_GENERATORS = {
  bubble:    bubbleGen,
  selection: selectionGen,
  insertion: insertionGen,
  merge:     mergeGen,
  quick:     quickGen,
  heap:      heapGen,
  counting:  countingGen,
  radix:     radixGen,
};

const ALGO_INFO = {
  bubble: {
    name: 'Bubble Sort',
    best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: true,
    use: 'Educational purposes, small datasets, nearly-sorted arrays where early-exit helps.',
  },
  selection: {
    name: 'Selection Sort',
    best: 'O(n²)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: false,
    use: 'Memory-constrained systems, small arrays, minimising the number of writes.',
  },
  insertion: {
    name: 'Insertion Sort',
    best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: true,
    use: 'Small or nearly-sorted datasets; used as the base case in Timsort and Introsort.',
  },
  merge: {
    name: 'Merge Sort',
    best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)', stable: true,
    use: 'Large datasets, linked lists, external sorting, any situation requiring stable sort.',
  },
  quick: {
    name: 'Quick Sort',
    best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)', stable: false,
    use: 'General-purpose in-memory sorting; the default in most standard libraries.',
  },
  heap: {
    name: 'Heap Sort',
    best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)', stable: false,
    use: 'Guaranteed O(n log n) without extra memory; priority queue implementations.',
  },
  counting: {
    name: 'Counting Sort',
    best: 'O(n + k)', avg: 'O(n + k)', worst: 'O(n + k)', space: 'O(k)', stable: true,
    use: 'Integer data with a small, known range (e.g. exam scores, age groups).',
  },
  radix: {
    name: 'Radix Sort',
    best: 'O(nk)', avg: 'O(nk)', worst: 'O(nk)', space: 'O(n + k)', stable: true,
    use: 'Large sets of integers or fixed-length strings; phone numbers, zip codes.',
  },
};

// ─── COMPLEXITY CLASS HELPER ──────────────────────────────────────────────────
function complexityClass(cx) {
  if (cx.startsWith('O(1)') || cx.startsWith('O(n)') || cx.startsWith('O(n+') || cx.startsWith('O(nk')) return 'good';
  if (cx.startsWith('O(n log')) return 'ok';
  return 'bad';
}

// ─── ARRAY GENERATION PRESETS ─────────────────────────────────────────────────
function generateArray(preset = 'random', n = 60) {
  const max = Math.min(n * 3, 480);
  let a = [];

  switch (preset) {
    case 'random':
      for (let i = 0; i < n; i++) a.push(Math.floor(Math.random() * max) + 4);
      break;

    case 'nearly': {
      // sorted with ~5% swaps
      a = Array.from({ length: n }, (_, i) => Math.round((i + 1) * max / n));
      const swapCount = Math.max(1, Math.floor(n * 0.05));
      for (let s = 0; s < swapCount; s++) {
        const j = Math.floor(Math.random() * n);
        const k = Math.floor(Math.random() * n);
        [a[j], a[k]] = [a[k], a[j]];
      }
      break;
    }

    case 'reversed':
      a = Array.from({ length: n }, (_, i) => Math.round((n - i) * max / n));
      break;

    case 'dupes': {
      const base = Math.floor(max / 2);
      a = Array.from({ length: n }, () => base + Math.floor(Math.random() * 8) - 4);
      break;
    }

    case 'sawtooth': {
      const period = Math.ceil(n / 6);
      for (let i = 0; i < n; i++) {
        a.push(Math.round(((i % period) + 1) * max / period));
      }
      break;
    }

    default:
      for (let i = 0; i < n; i++) a.push(Math.floor(Math.random() * max) + 4);
  }

  return a.map(v => Math.max(2, v));
}

// ─── BUILD STEP ARRAY FROM GENERATOR ─────────────────────────────────────────
function buildSteps(algoKey, inputArray) {
  const gen = ALGO_GENERATORS[algoKey](inputArray);
  const steps = [];
  let result = gen.next();
  while (!result.done) {
    steps.push(result.value);
    result = gen.next();
  }
  return steps;
}

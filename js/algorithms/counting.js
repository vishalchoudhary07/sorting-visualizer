/**
 * counting.js
 * Counting Sort — step generator
 *
 * Creates a count array of occurrences for each value,
 * then rebuilds the sorted array from those counts.
 * Time: O(n + k)  |  Space: O(k)  |  Stable: Yes
 */

function* countingGen(inputArray) {
  const a = [...inputArray];
  const n = a.length;
  const sorted = new Set();
  const max = Math.max(...a);
  const cnt = new Array(max + 1).fill(0);

  // Phase 1: count occurrences
  for (let i = 0; i < n; i++) {
    yield {
      type: 'cmp', i, j: i,
      arr: [...a], sorted: new Set(sorted),
      why: `Counting value ${a[i]} at index ${i}. Count[${a[i]}] is now ${cnt[a[i]] + 1}.`
    };
    cnt[a[i]]++;
  }

  // Phase 2: cumulative counts
  for (let i = 1; i <= max; i++) {
    cnt[i] += cnt[i - 1];
  }

  // Phase 3: build output
  const out = new Array(n);
  for (let i = n - 1; i >= 0; i--) {
    yield {
      type: 'cmp', i, j: i,
      arr: [...a], sorted: new Set(sorted),
      why: `Placing a[${i}] = ${a[i]} at output position ${cnt[a[i]] - 1} using count array.`
    };
    out[cnt[a[i]] - 1] = a[i];
    cnt[a[i]]--;
  }

  // Phase 4: copy back with animation
  for (let i = 0; i < n; i++) {
    a[i] = out[i];
    sorted.add(i);
    yield {
      type: 'set', i, j: i,
      arr: [...a], sorted: new Set(sorted),
      why: `Writing sorted value ${a[i]} to final position ${i}.`
    };
  }

  yield { type: 'done', arr: [...a], sorted: new Set(sorted), why: 'Array is fully sorted!' };
}

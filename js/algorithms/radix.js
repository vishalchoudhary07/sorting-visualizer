/**
 * radix.js
 * Radix Sort — step generator
 *
 * Sorts integers digit-by-digit from least significant to most
 * significant using a stable counting sort as a subroutine.
 * Time: O(nk)  |  Space: O(n + k)  |  Stable: Yes
 */

function* radixGen(inputArray) {
  const a = [...inputArray];
  const n = a.length;
  const sorted = new Set();
  const max = Math.max(...a);

  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    const cnt = new Array(10).fill(0);
    const out = new Array(n);
    const digitPlace = exp === 1 ? 'ones' : exp === 10 ? 'tens' : exp === 100 ? 'hundreds' : `${exp}s`;

    // Count digit occurrences
    for (let i = 0; i < n; i++) {
      const digit = Math.floor(a[i] / exp) % 10;
      yield {
        type: 'cmp', i, j: i,
        arr: [...a], sorted: new Set(sorted),
        why: `Radix pass (${digitPlace} place): a[${i}] = ${a[i]}, digit = ${digit}.`
      };
      cnt[digit]++;
    }

    // Cumulative counts
    for (let i = 1; i < 10; i++) cnt[i] += cnt[i - 1];

    // Build output (right-to-left for stability)
    for (let i = n - 1; i >= 0; i--) {
      const digit = Math.floor(a[i] / exp) % 10;
      yield {
        type: 'cmp', i, j: i,
        arr: [...a], sorted: new Set(sorted),
        why: `Placing a[${i}] = ${a[i]} (digit ${digit}) at output index ${cnt[digit] - 1}.`
      };
      out[cnt[digit] - 1] = a[i];
      cnt[digit]--;
    }

    // Copy back
    for (let i = 0; i < n; i++) {
      a[i] = out[i];
      yield {
        type: 'set', i, j: i,
        arr: [...a], sorted: new Set(sorted),
        why: `After ${digitPlace} pass: writing ${a[i]} to index ${i}.`
      };
    }
  }

  for (let i = 0; i < n; i++) sorted.add(i);
  yield { type: 'done', arr: [...a], sorted: new Set(sorted), why: 'Array is fully sorted!' };
}

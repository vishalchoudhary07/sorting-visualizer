/**
 * quick.js
 * Quick Sort — step generator
 *
 * Picks a pivot, partitions elements around it (smaller left,
 * larger right), then recursively sorts each partition.
 * Time: O(n log n) avg, O(n²) worst  |  Space: O(log n)  |  Stable: No
 */

function* quickGen(inputArray) {
  const a = [...inputArray];
  const sorted = new Set();

  function* quickSort(lo, hi) {
    if (lo >= hi) {
      if (lo === hi) sorted.add(lo);
      return;
    }

    // partition
    const pivot = a[hi];
    yield {
      type: 'pivot', i: hi, j: hi,
      arr: [...a], sorted: new Set(sorted),
      why: `Pivot selected: a[${hi}] = ${pivot}. Elements smaller go left, larger go right.`
    };

    let p = lo - 1;

    for (let j = lo; j < hi; j++) {
      yield {
        type: 'cmp', i: j, j: hi,
        arr: [...a], sorted: new Set(sorted),
        why: `Comparing a[${j}] = ${a[j]} with pivot = ${pivot}.`
      };

      if (a[j] < pivot) {
        p++;
        [a[p], a[j]] = [a[j], a[p]];
        yield {
          type: 'swap', i: p, j,
          arr: [...a], sorted: new Set(sorted),
          why: `${a[j]} < pivot (${pivot}), swapping a[${p}] and a[${j}] to left partition.`
        };
      }
    }

    [a[p + 1], a[hi]] = [a[hi], a[p + 1]];
    sorted.add(p + 1);
    yield {
      type: 'swap', i: p + 1, j: hi,
      arr: [...a], sorted: new Set(sorted),
      why: `Placing pivot ${pivot} at its final sorted position ${p + 1}.`
    };

    const pivotPos = p + 1;
    yield* quickSort(lo, pivotPos - 1);
    yield* quickSort(pivotPos + 1, hi);
  }

  yield* quickSort(0, a.length - 1);

  for (let i = 0; i < a.length; i++) sorted.add(i);
  yield { type: 'done', arr: [...a], sorted: new Set(sorted), why: 'Array is fully sorted!' };
}

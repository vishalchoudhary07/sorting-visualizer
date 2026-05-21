/**
 * heap.js
 * Heap Sort — step generator
 *
 * Builds a max-heap from the array, then repeatedly extracts
 * the maximum element to build the sorted array in place.
 * Time: O(n log n)  |  Space: O(1)  |  Stable: No
 */

function* heapGen(inputArray) {
  const a = [...inputArray];
  const n = a.length;
  const sorted = new Set();

  function* heapify(size, root) {
    let largest = root;
    const l = 2 * root + 1;
    const r = 2 * root + 2;

    if (l < size) {
      yield {
        type: 'cmp', i: l, j: largest,
        arr: [...a], sorted: new Set(sorted),
        why: `Heapify: checking left child a[${l}] = ${a[l]} vs root a[${largest}] = ${a[largest]}.`
      };
      if (a[l] > a[largest]) largest = l;
    }

    if (r < size) {
      yield {
        type: 'cmp', i: r, j: largest,
        arr: [...a], sorted: new Set(sorted),
        why: `Heapify: checking right child a[${r}] = ${a[r]} vs current largest a[${largest}] = ${a[largest]}.`
      };
      if (a[r] > a[largest]) largest = r;
    }

    if (largest !== root) {
      [a[root], a[largest]] = [a[largest], a[root]];
      yield {
        type: 'swap', i: root, j: largest,
        arr: [...a], sorted: new Set(sorted),
        why: `Max-heap violated — swapping a[${root}] and a[${largest}] to restore heap property.`
      };
      yield* heapify(size, largest);
    }
  }

  // Phase 1: build max-heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapify(n, i);
  }

  // Phase 2: extract elements from heap
  for (let i = n - 1; i > 0; i--) {
    [a[0], a[i]] = [a[i], a[0]];
    sorted.add(i);
    yield {
      type: 'swap', i: 0, j: i,
      arr: [...a], sorted: new Set(sorted),
      why: `Extracting max ${a[i]} from heap root and placing it at sorted position ${i}.`
    };
    yield* heapify(i, 0);
  }

  sorted.add(0);
  yield { type: 'done', arr: [...a], sorted: new Set(sorted), why: 'Array is fully sorted!' };
}

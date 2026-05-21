/**
 * selection.js
 * Selection Sort — step generator
 *
 * Divides the array into a sorted and unsorted region.
 * Repeatedly selects the minimum from the unsorted region
 * and moves it to the end of the sorted region.
 * Time: O(n²)  |  Space: O(1)  |  Stable: No
 */

function* selectionGen(inputArray) {
  const a = [...inputArray];
  const n = a.length;
  const sorted = new Set();

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    yield {
      type: 'cmp', i: i, j: i,
      arr: [...a], sorted: new Set(sorted),
      why: `Finding the minimum in the unsorted portion starting at index ${i}.`
    };

    for (let j = i + 1; j < n; j++) {
      yield {
        type: 'cmp', i: minIdx, j,
        arr: [...a], sorted: new Set(sorted),
        why: `a[${j}] = ${a[j]} vs current min a[${minIdx}] = ${a[minIdx]}.`
      };

      if (a[j] < a[minIdx]) {
        minIdx = j;
      }
    }

    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      yield {
        type: 'swap', i, j: minIdx,
        arr: [...a], sorted: new Set(sorted),
        why: `Swapping minimum value ${a[i]} to position ${i}.`
      };
    }

    sorted.add(i);
  }

  sorted.add(n - 1);
  yield { type: 'done', arr: [...a], sorted: new Set(sorted), why: 'Array is fully sorted!' };
}

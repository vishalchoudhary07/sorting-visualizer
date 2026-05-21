/**
 * bubble.js
 * Bubble Sort — step generator
 *
 * Repeatedly steps through the list, compares adjacent elements,
 * and swaps them if they are in the wrong order.
 * Time: O(n²) avg/worst  |  Space: O(1)  |  Stable: Yes
 */

function* bubbleGen(inputArray) {
  const a = [...inputArray];
  const n = a.length;
  const sorted = new Set();

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;

    for (let j = 0; j < n - i - 1; j++) {
      yield {
        type: 'cmp', i: j, j: j + 1,
        arr: [...a], sorted: new Set(sorted),
        why: `Comparing a[${j}] = ${a[j]} and a[${j + 1}] = ${a[j + 1]}.`
      };

      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swapped = true;
        yield {
          type: 'swap', i: j, j: j + 1,
          arr: [...a], sorted: new Set(sorted),
          why: `${a[j + 1]} > ${a[j]}, swapping them into correct order.`
        };
      }
    }

    sorted.add(n - 1 - i);

    if (!swapped) break; // already sorted — early exit
  }

  // mark anything not yet marked
  for (let i = 0; i < n; i++) sorted.add(i);

  yield { type: 'done', arr: [...a], sorted: new Set(sorted), why: 'Array is fully sorted!' };
}

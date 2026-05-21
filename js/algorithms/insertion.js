/**
 * insertion.js
 * Insertion Sort — step generator
 *
 * Builds the sorted array one element at a time by taking each
 * element and inserting it in its correct position.
 * Time: O(n²) avg  |  Space: O(1)  |  Stable: Yes
 */

function* insertionGen(inputArray) {
  const a = [...inputArray];
  const n = a.length;
  const sorted = new Set([0]);

  for (let i = 1; i < n; i++) {
    const key = a[i];
    let j = i - 1;

    yield {
      type: 'cmp', i, j: i,
      arr: [...a], sorted: new Set(sorted),
      why: `Picking up a[${i}] = ${key} to insert into the sorted portion.`
    };

    while (j >= 0 && a[j] > key) {
      yield {
        type: 'cmp', i: j, j: i,
        arr: [...a], sorted: new Set(sorted),
        why: `a[${j}] = ${a[j]} > ${key}, shifting it one position to the right.`
      };

      a[j + 1] = a[j];

      yield {
        type: 'set', i: j + 1, j,
        arr: [...a], sorted: new Set(sorted),
        why: `Shifted a[${j}] = ${a[j]} to index ${j + 1}.`
      };

      j--;
    }

    a[j + 1] = key;
    sorted.add(i);

    yield {
      type: 'set', i: j + 1, j: j + 1,
      arr: [...a], sorted: new Set(sorted),
      why: `Placed ${key} at its correct position, index ${j + 1}.`
    };
  }

  yield { type: 'done', arr: [...a], sorted: new Set(sorted), why: 'Array is fully sorted!' };
}

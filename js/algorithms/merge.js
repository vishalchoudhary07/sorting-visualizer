/**
 * merge.js
 * Merge Sort — step generator
 *
 * Divide-and-conquer: recursively splits the array in half,
 * sorts each half, then merges them back in order.
 * Time: O(n log n)  |  Space: O(n)  |  Stable: Yes
 */

function* mergeGen(inputArray) {
  const a = [...inputArray];
  const sorted = new Set();

  function* mergeSort(l, r) {
    if (l >= r) {
      sorted.add(l);
      yield {
        type: 'sub', i: l, j: r,
        arr: [...a], sorted: new Set(sorted),
        why: `Single element at index ${l} is already sorted.`
      };
      return;
    }

    const m = Math.floor((l + r) / 2);

    yield {
      type: 'sub', i: l, j: r,
      arr: [...a], sorted: new Set(sorted),
      why: `Splitting array from index ${l} to ${r} at midpoint ${m}.`
    };

    yield* mergeSort(l, m);
    yield* mergeSort(m + 1, r);

    // merge step
    const L = a.slice(l, m + 1);
    const R = a.slice(m + 1, r + 1);
    let i = 0, j = 0, k = l;

    while (i < L.length && j < R.length) {
      yield {
        type: 'cmp', i: l + i, j: m + 1 + j,
        arr: [...a], sorted: new Set(sorted),
        why: `Merging: comparing L[${i}] = ${L[i]} and R[${j}] = ${R[j]}.`
      };

      if (L[i] <= R[j]) {
        a[k] = L[i++];
      } else {
        a[k] = R[j++];
      }

      sorted.add(k);
      yield {
        type: 'set', i: k, j: k,
        arr: [...a], sorted: new Set(sorted),
        why: `Placed ${a[k]} at index ${k} during merge.`
      };
      k++;
    }

    while (i < L.length) {
      a[k] = L[i++];
      sorted.add(k);
      yield {
        type: 'set', i: k, j: k,
        arr: [...a], sorted: new Set(sorted),
        why: `Copying remaining element ${a[k]} from left subarray.`
      };
      k++;
    }

    while (j < R.length) {
      a[k] = R[j++];
      sorted.add(k);
      yield {
        type: 'set', i: k, j: k,
        arr: [...a], sorted: new Set(sorted),
        why: `Copying remaining element ${a[k]} from right subarray.`
      };
      k++;
    }
  }

  yield* mergeSort(0, a.length - 1);

  for (let i = 0; i < a.length; i++) sorted.add(i);
  yield { type: 'done', arr: [...a], sorted: new Set(sorted), why: 'Array is fully sorted!' };
}

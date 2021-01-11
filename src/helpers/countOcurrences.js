export const countOccurrences = (arr) =>
  arr.reduce((prev, curr) => ((prev[curr] = ++prev[curr] || 1), prev), {});

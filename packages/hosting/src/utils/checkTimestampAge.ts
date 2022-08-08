/**
 * @param time
 * @param threshold
 * 2days: 1000 * 60 * 60 * 24 * 2
 * @returns
 */
export const checkTimestampAge = (time: number, threshold: number) => {
  const gap = Date.now() - time;
  return Number.isNaN(gap) || gap > threshold;
};

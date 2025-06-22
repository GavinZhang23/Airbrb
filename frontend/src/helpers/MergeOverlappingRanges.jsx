const mergeOverlappingRanges = (ranges) => {
  // sort ranges by start date
  ranges.sort((a, b) => new Date(a.start) - new Date(b.start));

  const mergedRanges = [];
  let currentRange = ranges[0];

  for (let i = 1; i < ranges.length; i++) {
    if (new Date(currentRange.end) >= new Date(ranges[i].start)) {
      // extend the current range's end date if there's an overlap
      currentRange.end = new Date(Math.max(new Date(currentRange.end), new Date(ranges[i].end))).toISOString().split('T')[0];
    } else {
      // no overlap, push the current range and start a new one
      mergedRanges.push(currentRange);
      currentRange = ranges[i];
    }
  }
  mergedRanges.push(currentRange); // Push the last range
  return mergedRanges;
};

export default mergeOverlappingRanges;

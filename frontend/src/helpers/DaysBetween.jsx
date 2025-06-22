const daysBetweenDates = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDiff = end - start;
  const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
  return Math.round(daysDiff);
};
export default daysBetweenDates;

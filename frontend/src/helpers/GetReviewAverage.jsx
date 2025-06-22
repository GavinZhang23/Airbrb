const getReviewAverage = (reviews) => {
  if (reviews.length === 0) {
    return 0;
  }
  return (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1);
}

export default getReviewAverage;

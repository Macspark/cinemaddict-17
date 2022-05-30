import dayjs from 'dayjs';

const sortMoviesByComments = (movieA, movieB) => movieB.comments.length - movieA.comments.length;

const sortMoviesByRating = (movieA, movieB) => movieB.rating - movieA.rating;

const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

const sortMoviesByDate = (movieA, movieB) => {
  const weight = getWeightForNullDate(movieA.releaseDate, movieB.releaseDate);

  return weight ?? dayjs(movieB.releaseDate).diff(dayjs(movieA.releaseDate));
};

export {sortMoviesByRating, sortMoviesByComments, sortMoviesByDate};

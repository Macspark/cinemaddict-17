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

const formatMovieRunningTime = (minutes) => {
  minutes = Number(minutes);
  const hours = Math.floor(minutes / 60);
  minutes = Math.floor(minutes % 3600 % 60);

  const hoursDisplay = hours > 0 ? `${hours}h ` : '';
  const minutesDisplay = minutes > 0 ? `${minutes}m` : '';
  return hoursDisplay + minutesDisplay;
};

export {sortMoviesByRating, sortMoviesByComments, sortMoviesByDate, formatMovieRunningTime};

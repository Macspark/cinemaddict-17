import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const getYear = (date) => date ? dayjs(date).format('YYYY') : '';

const getHumanDate = (date) => date ? dayjs(date).format('DD MMMM YYYY') : '';

const getHumanDateTime = (date) => date ? dayjs(date).format('YYYY/MM/DD hh:mm') : '';

const getHumanRelativeTime = (date) => date ? dayjs(date).fromNow() : '';

const formatMovieRunningTime = (minutes) => {
  minutes = Number(minutes);
  const hours = Math.floor(minutes / 60);
  minutes = Math.floor(minutes % 3600 % 60);

  const hoursDisplay = hours > 0 ? `${hours}h ` : '';
  const minutesDisplay = minutes > 0 ? `${minutes}m` : '';
  return hoursDisplay + minutesDisplay;
};

export {
  getYear,
  getHumanDate,
  getHumanDateTime,
  getHumanRelativeTime,
  formatMovieRunningTime,
};

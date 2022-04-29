import dayjs from 'dayjs';

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomDecimal = (a = 0, b = 1, fraction = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return (lower + Math.random() * (upper - lower + 1)).toFixed(fraction);
};

const getRandomElement = (arr, amount = 1) => {
  const result = arr.sort(() => .5 - Math.random()).slice(0, amount);
  return amount === 1 ? result[0] : result;
};

const getYear = (date) => dayjs(date).format('YYYY');

const getHumanDate = (date) => dayjs(date).format('DD MMMM YYYY');

export {getRandomInteger, getRandomDecimal, getRandomElement, getYear, getHumanDate};

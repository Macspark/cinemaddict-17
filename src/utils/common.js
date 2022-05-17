import dayjs from 'dayjs';

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomDecimal = (a = 0, b = 1, fraction = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return parseFloat((lower + Math.random() * (upper - lower + 1)).toFixed(fraction));
};

const getRandomArrayElement = (arr) => arr[Math.floor(Math.random()*arr.length)];

const getRandomArrayElements = (arr, amount = 1) => {
  const result = arr.sort(() => .5 - Math.random()).slice(0, amount);
  return result;
};

const getYear = (date) => date ? dayjs(date).format('YYYY') : '';

const getHumanDate = (date) => date ? dayjs(date).format('DD MMMM YYYY') : '';

const getHumanDateTime = (date) => date ? dayjs(date).format('YYYY/MM/DD hh:mm') : '';

export {getRandomInteger, getRandomDecimal, getRandomArrayElement, getRandomArrayElements, getYear, getHumanDate, getHumanDateTime};

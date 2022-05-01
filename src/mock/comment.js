import {getRandomInteger, getRandomArrayElements} from '../utils.js';
import dayjs from 'dayjs';

let currentId = 0;

const TEXTS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget. Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra. Fusce tristique felis at fermentum pharetra.',
];

const AUTHORS = [
  'Isaiah Phillips',
  'Clara Thornton',
  'Hope Goodman',
  'Amy Fulle',
  'Byron Kelly'
];

const EMOTIONS = [
  'smile',
  'sleeping',
  'puke',
  'angry'
];

const generateCommentId = () => {
  currentId++;
  return currentId - 1;
};

const generateDate = () => {
  const weeksGap = getRandomInteger(-1000, -100);

  return dayjs().add(weeksGap, 'week').toDate();
};

export const generateComment = () => ({
  id: generateCommentId(),
  text: getRandomArrayElements(TEXTS)[0],
  emotion: getRandomArrayElements(EMOTIONS)[0],
  author: getRandomArrayElements(AUTHORS)[0],
  date: generateDate()
});

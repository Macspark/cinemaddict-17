import { getRandomInteger, getRandomArrayElement } from '../utils/common.js';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';

const commentIds = [];

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

const generateDate = () => {
  const weeksGap = getRandomInteger(-1000, -100);

  return dayjs().add(weeksGap, 'week').toDate();
};

export const generateComment = () => {
  const commentId = nanoid();
  commentIds.push(commentId);

  return {
    id: commentId,
    text: getRandomArrayElement(TEXTS),
    emoji: getRandomArrayElement(EMOTIONS),
    author: getRandomArrayElement(AUTHORS),
    date: generateDate()
  };
};

export {commentIds};

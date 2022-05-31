import { getRandomInteger, getRandomDecimal, getRandomArrayElement, getRandomArrayElements } from '../utils/common.js';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import { commentIds } from './comment.js';

const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget. Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra. Fusce tristique felis at fermentum pharetra.',
];

const TITLES = [
  'Lorem Ipsum',
  'Vivamus eu',
  'Suspendisse',
  'Sodales quam',
  'Fusce dignissim'
];

const PEOPLE = [
  'Isaiah Phillips',
  'Clara Thornton',
  'Hope Goodman',
  'Amy Fulle',
  'Byron Kelly'
];

const GENRES = [
  'Comedy',
  'Drama',
  'Action',
  'Thriller',
  'Horror',
  'Adventure'
];

const COUNTRIES = [
  'France',
  'Russia',
  'UK',
  'USA',
  'Germany',
  'Spain'
];

const AGES = [
  '16+',
  '18+',
  '13+',
  '21+',
  '0+',
];

const generateDate = () => {
  const weeksGap = getRandomInteger(-1000, -100);

  return dayjs().add(weeksGap, 'week').toDate();
};

const generateRunningTime = () => getRandomInteger(60, 240);

const assignCommentIds = () => {
  if (!commentIds.length) {
    return [];
  }

  const amount = getRandomInteger(0, 4);

  const result = commentIds.splice(0, amount);

  return result;
};

export const generateMovie = () => ({
  id: nanoid(),
  poster: `https://picsum.photos/id/${getRandomInteger(1, 1000)}/232/342`,
  title: getRandomArrayElement(TITLES),
  originalTitle: getRandomArrayElement(TITLES),
  rating: getRandomDecimal(1, 9, 2),
  director: getRandomArrayElement(PEOPLE),
  writers: getRandomArrayElement(PEOPLE),
  stars: getRandomArrayElement(PEOPLE),
  releaseDate: generateDate(),
  runningTime: generateRunningTime(),
  country: getRandomArrayElement(COUNTRIES),
  genres: getRandomArrayElements(GENRES, getRandomInteger(1, 4)),
  fullDescription: getRandomArrayElement(DESCRIPTIONS),
  ageRestriction: getRandomArrayElement(AGES),
  comments: assignCommentIds(),
  isWatchlist: Boolean(getRandomInteger(0, 1)),
  isWatched: Boolean(getRandomInteger(0, 1)),
  isFavorite: Boolean(getRandomInteger(0, 1))
});

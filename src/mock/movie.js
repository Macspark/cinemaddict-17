import {getRandomInteger} from '../utils.js';
import {getRandomDecimal} from '../utils.js';
import {getRandomArrayElements} from '../utils.js';
import dayjs from 'dayjs';

let currentId = 0;

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

const generateRunningTime = () => {
  const total = getRandomInteger(60, 240);
  let hours = Math.floor(total / 60);
  let minutes = total - (hours * 60);
  hours = `${hours}h`;
  minutes = `${minutes}m`;

  return `${(hours !== '0h' ? hours : '')} ${(minutes !== '0m' ? minutes : '')}`;
};

const generateMovieId = () => {
  currentId++;
  return currentId - 1;
};

export const generateMovie = () => ({
  id: generateMovieId(),
  poster: `https://picsum.photos/id/${getRandomInteger(1, 1000)}/232/342`,
  title: getRandomArrayElements(TITLES)[0],
  originalTitle: getRandomArrayElements(TITLES)[0],
  rating: getRandomDecimal(1, 9, 2),
  director: getRandomArrayElements(PEOPLE)[0],
  writers: getRandomArrayElements(PEOPLE)[0],
  stars: getRandomArrayElements(PEOPLE)[0],
  releaseDate: generateDate(),
  runningTime: generateRunningTime(),
  country: getRandomArrayElements(COUNTRIES)[0],
  genres: getRandomArrayElements(GENRES, getRandomInteger(1, 4)),
  fullDescription: getRandomArrayElements(DESCRIPTIONS)[0],
  ageRestriction: getRandomArrayElements(AGES)[0],
  comments: Array.from({length: getRandomInteger(0, 4)}, () => getRandomInteger(1, 20))
});

import {getRandomInteger} from '../utils.js';
import {getRandomDecimal} from '../utils.js';
import {getRandomElement} from '../utils.js';
import dayjs from 'dayjs';

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

export const generateMovie = () => ({
  poster: `https://picsum.photos/id/${getRandomInteger(1, 1000)}/232/342`,
  title: getRandomElement(TITLES),
  originalTitle: getRandomElement(TITLES),
  rating: getRandomDecimal(1, 9, 2),
  director: getRandomElement(PEOPLE),
  writers: getRandomElement(PEOPLE),
  stars: getRandomElement(PEOPLE),
  releaseDate: generateDate(),
  runningTime: generateRunningTime(),
  country: getRandomElement(COUNTRIES),
  genres: getRandomElement(GENRES, getRandomInteger(2, 4)),
  fullDescription: getRandomElement(DESCRIPTIONS),
  ageRestriction: getRandomElement(AGES)
});

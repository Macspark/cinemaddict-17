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

const findIndexByValue = (arr, value) => {
  const index = arr.findIndex((element) => element === value);
  return index;
};

const removeIndexFromArray = (arr, index) => (
  [
    ...arr.slice(0, index),
    ...arr.slice(index + 1),
  ]
);

const flattenObject = (obj) => {
  const flattened = {};

  Object.keys(obj).forEach((key) => {
    const value = obj[key];

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(flattened, flattenObject(value));
    } else {
      flattened[key] = value;
    }
  })

  return flattened;
}

export {
  flattenObject,
  removeIndexFromArray,
  findIndexByValue,
  getRandomInteger,
  getRandomDecimal,
  getRandomArrayElement,
  getRandomArrayElements,
};

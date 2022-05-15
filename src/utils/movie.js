const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

const sortMoviesByComments = (movieA, movieB) => {
  return movieB.comments.length - movieA.comments.length;
}

const sortMoviesByRating = (movieA, movieB) => {
  return movieB.rating - movieA.rating;
}

export {updateItem, sortMoviesByRating, sortMoviesByComments};

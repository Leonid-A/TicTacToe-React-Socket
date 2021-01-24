const createBoard = (size) => {
  const squares = [];

  for (let b = 0; b < size; b++) {
    for (let a = 0; a < size; a++) {
      squares.push({ x: a, y: b, value: null });
    }
  }
  return squares;
};

module.exports = createBoard;

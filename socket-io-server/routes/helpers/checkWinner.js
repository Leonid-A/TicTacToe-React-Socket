function checkWinner(i, squares, n) {
  console.log(i)
  console.log(squares)
  console.log(n)


  const { value, x, y } = squares[i];
  const length = squares.length;
  let hor = 1;
  let vert = 1;
  let diagR = 1;
  let diagL = 1;
  let winner = null;

  let clickCount = 0;

  for (let j = 0; j < length; j++) {
    const current = squares[j];
    if (current.value) {
      clickCount++;
    }

    if (j === i || current.value !== value) {
      continue;
    }

    if (current.x === x) {
      vert++;
    }
    if (current.y === y) {
      hor++;
      console.log("hor", hor)

    }
    if (current.x === current.y && x === y) {
      diagL++;
    }
    if (current.x + current.y == n - 1 && x + y == n - 1) {
      diagL++;
    }
  }

  if (vert == n || hor == n || diagL == n || diagR == n) {
    winner = value;
  } else if (clickCount === Math.pow(n, 2)) {
    winner = "No one";
  }
  return winner;
}

module.exports.checkWinner = checkWinner;

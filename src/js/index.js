const borderSize = 6;
const matrix = initMatric(borderSize);

const imagePath = {
  forest: "../image/forest.svg",
  hill: "../image/hill.svg",
  rabbit: "../image/rabbit.png",
  wolf: "../image/wolf1.png"
};

/**
 * @param {number} n - The size of matic.
 * @returns {Array}
 * @description
 */
function initMatric(n) {
  const matric = [];
  for (i = 0; i < n; ++i) {
    matric[i] = [];
    for (j = 0; j < n; ++j) {
      matric[i][j] = 0;
    }
  }
  return matric;
}

const addHills = n => {
  for (i = 0; i < n; ++i) {
    const x = Math.floor(Math.random() * n - 1) + 1;
    matrix[x][i] = "*";
  }
};

function addWolf(n) {
  for (i = 0; i < n / 2; ++i) {
    let x = Math.floor(Math.random() * n - 1) + 1;
    let y = Math.floor(Math.random() * n - 1) + 1;
    if (checkForHills(x, y) && matrix[x][y] != "2") matrix[x][y] = "2";
    else {
      while (1) {
        if (x > 0 && checkForHills(x - 1, y) && matrix[x - 1][y] != "2") {
          --x;
          break;
        } else {
          if (
            x < borderSize - 1 &&
            checkForHills(x + 1, y) &&
            matrix[x + 1][y] != "2"
          ) {
            ++x;
            break;
          }
        }
        x = Math.floor(Math.random() * n - 1) + 1;
        y = Math.floor(Math.random() * n - 1) + 1;
      }
      matrix[x][y] = "2";
    }
  }
}
const checkForHills = (row, col) => {
  if (matrix[row][col] == "*") return false;
  return true;
};
const checkForWolfs = (i, j) => {
  if (matrix[i][j] == "2") return false;
  if (i + 1 < borderSize && matrix[i + 1][j] == "2") return false;
  if (i - 1 >= 0 && matrix[i - 1][j] == "2") return false;
  if (j - 1 >= 0 && matrix[i][j - 1] == "2") return false;
  if (j + 1 < borderSize && matrix[i][j + 1] == "2") return false;
  return true;
};

function addRabbit(n) {
  //debugger;
  let i = 0;
  let j = 0;
  while (matrix[i][j] != "1") {
    i = Math.floor(Math.random() * n - 1) + 1;
    j = Math.floor(Math.random() * n - 1) + 1;
    if (checkForHills(i, j) && checkForWolfs(i, j)) {
      matrix[i][j] = "1";
    }
  }
}

const getRabbitIndexes = () => {
  for (i = 0; i < borderSize; ++i) {
    for (j = 0; j < borderSize; ++j) {
      if (matrix[i][j] == "1") {
        const indexes = {
          row: i,
          col: j
        };
        return indexes;
      }
    }
  }
};

function left() {
  let row = getRabbitIndexes().row;
  let col = getRabbitIndexes().col;
  matrix[row][--col] = "1";
  matrix[row][col + 1] = 0;
  wolfStepes(getWolfIndexes);
  drawMatrix(matrix);
}

function right() {
  let row = getRabbitIndexes().row;
  let col = getRabbitIndexes().col;
  matrix[row][++col] = "1";
  matrix[row][col - 1] = 0;
  wolfStepes(getWolfIndexes);
  drawMatrix(matrix);
}
function down() {
  let row = getRabbitIndexes().row;
  let col = getRabbitIndexes().col;
  matrix[++row][col] = "1";
  matrix[row - 1][col] = 0;
  wolfStepes(getWolfIndexes);
  drawMatrix(matrix);
}

function up() {
  let row = getRabbitIndexes().row;
  let col = getRabbitIndexes().col;
  matrix[--row][col] = "1";
  matrix[row + 1][col] = 0;
  wolfStepes(getWolfIndexes);
  drawMatrix(matrix);
}
const checkForUp = (row, col) => {
  if (
    row == 0 ||
    !checkForHills(row - 1, col) ||
    !checkForWolfs(row - 1, col)
  ) {
    document.getElementById("up").disabled = true;
  } else {
    document.getElementById("up").disabled = false;
  }
};
const checkForDown = (row, col) => {
  if (
    row == borderSize - 1 ||
    !checkForHills(row + 1, col) ||
    !checkForWolfs(row + 1, col)
  ) {
    document.getElementById("down").disabled = true;
  } else {
    document.getElementById("down").disabled = false;
  }
};
const checkForLeft = (row, col) => {
  if (
    col == 0 ||
    !checkForHills(row, col - 1) ||
    !checkForWolfs(row, col - 1)
  ) {
    document.getElementById("left").disabled = true;
  } else {
    document.getElementById("left").disabled = false;
  }
};
const checkForRight = (row, col) => {
  if (
    col == borderSize - 1 ||
    !checkForHills(row, col + 1) ||
    !checkForWolfs(row, col + 1)
  ) {
    document.getElementById("right").disabled = true;
  } else {
    document.getElementById("right").disabled = false;
  }
};
function upDateButtons() {
  let row = getRabbitIndexes().row;
  let col = getRabbitIndexes().col;
  checkForUp(row, col);
  checkForDown(row, col);
  checkForLeft(row, col);
  checkForRight(row, col);
  if (gameOver()) {
    document.getElementById("end").innerHTML = "Game over";
  }
}
const fillPictures = (i, j) => {
  switch (matrix[i][j]) {
    case "2":
      document.getElementsByTagName("tr")[i].innerHTML += `<td> <img src='${
        imagePath.wolf
      }'> </td>`;
      break;
    case "1":
      document.getElementsByTagName("tr")[i].innerHTML += `<td> <img src='${
        imagePath.rabbit
      }'>  </td>`;
      break;
    case "*":
      document.getElementsByTagName("tr")[i].innerHTML += `<td> <img src='${
        imagePath.hill
      }'> </td>`;
      break;
    case 0:
      document.getElementsByTagName("tr")[i].innerHTML += `<td> <img src='${
        imagePath.forest
      }'> </td>`;
      break;
  }
};
function drawMatrix() {
  let mydiv = document.getElementById("root");
  mydiv.innerHTML = "";
  var table = document.createElement("table");
  mydiv.appendChild(table);
  for (i = 0; i < borderSize; ++i) {
    table.innerHTML += "<tr> </tr>";
    for (j = 0; j < borderSize; ++j) {
      fillPictures(i, j);
    }
  }
  upDateButtons();
}

function getWolfIndexes() {
  let index = {
    index1: 0,
    index2: 0
  };
  let boboIndexes = [];
  for (i = 0; i < borderSize; ++i) {
    for (j = 0; j < borderSize; ++j) {
      if (matrix[i][j] == "2") {
        index.index1 = i;
        index.index2 = j;
        boboIndexes.push(Object.assign({}, index));
      }
    }
  }
  return boboIndexes;
}
const isRabbit = (i, j) => {
  if (matrix[i][j] == "1") return true;
  return false;
};
function wolfStepes(callback) {
  arr = callback();
  for (i = 0; i < arr.length; ++i) {
    row = arr[i].index1;
    col = arr[i].index2;
    if (row + 1 < borderSize && checkForHills(row + 1, col)) {
      if (isRabbit(row + 1, col)) {
        break;
      }
      matrix[row + 1][col] = "2";
      matrix[row][col] = 0;
    } else if (row - 1 >= 0 && checkForHills(row - 1, col)) {
      if (isRabbit(row - 1, col)) {
        break;
      }
      matrix[row - 1][col] = "2";
      matrix[row][col] = 0;
    } else if (col + 1 < borderSize && checkForHills(row, col + 1)) {
      if (isRabbit(row, col + 1)) {
        break;
      }
      matrix[row][col + 1] = "2";
      matrix[row][col] = 0;
    } else if (col - 1 >= 0 && checkForHills(row, col - 1)) {
      if (isRabbit(row, col - 1)) {
        break;
      }
      matrix[row][col - 1] = "2";
      matrix[row][col] = 0;
    } else console.log("there isnot a way");
  }
}

const gameOver = () => {
  const left = document.getElementById("left").disabled;
  const right = document.getElementById("right").disabled;
  const up = document.getElementById("up").disabled;
  const down = document.getElementById("down").disabled;
  if (left && right && up && down) {
    return true;
  }
  return false;
};

addHills(borderSize);
addWolf(borderSize);
addRabbit(borderSize);
drawMatrix(matrix);

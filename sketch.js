//Create a 2D array
function make2DArray(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
    //fill arrays with 0s
    for (let j = 0; j < arr[i].length; j++) {
      arr[i][j] = 0;
    }
  }
  return arr;
}

//the grid
let grid;
//how big each square is
let w = 5;
let cols, rows;

// restrict hues to yellow tones
let minHue = 40;
let maxHue = 65;
let hueValue = minHue;

//check to see if column is in bounds
function withinCols(i) {
  return i >= 0 && i <= cols - 1;
}

//check to see if row is in bounds
function withinRows(j) {
  return j >= 0 && j <= rows - 1;
}

function setup() {
  createCanvas(600, 700);
  colorMode(HSB, 360, 255, 255);
  cols = width / w;
  rows = height / w;
  grid = make2DArray(cols, rows);

  matrixSize = createSlider(5, 30, 10, 1);
}

function mouseDragged() {
  let mouseCol = floor(mouseX / w);
  let mouseRow = floor(mouseY / w);

  //randomly add an area of sand around mouse click
  let matrix = matrixSize.value();
  let extent = floor(matrix/10);
  for (let i = -extent; i <= extent; i++) {
    for (let j = -extent; j <= extent; j ++) {
      if (random(1) < 0.75) {
        let col = mouseCol + i;
        let row = mouseRow + j;
        if (withinCols(col) && withinRows(row)) {
          grid[col][row] = hueValue;
        }
      }
    }
  }
  //change the color of the sand
  hueValue += 1;
  // keep the hue inside the yellow range
  if (hueValue > maxHue) {
    hueValue = minHue;
  }
} 

function mousePressed() {
  let mouseCol = floor(mouseX / w);
  let mouseRow = floor(mouseY / w);

  //randomly add an area of sand around mouse click
  let matrix = matrixSize.value() / 5; 
  let extent = floor(matrix/4);
  for (let i = -extent; i <= extent; i++) {
    for (let j = -extent; j <= extent; j ++) {
      if (random(1) < 0.75) {
        let col = mouseCol + i;
        let row = mouseRow + j;
        if (withinCols(col) && withinRows(row)) {
          grid[col][row] = hueValue;
        }
      }
    }
  }
  //change the color of the sand
  hueValue += 1;
  // keep the hue inside the yellow range
  if (hueValue > maxHue) {
    hueValue = minHue;
  }
}

function draw() {
  background(0);

  //draw the sand
  for (let i = 0; i < cols; i ++) {
    for (let j = 0; j < rows; j++) {
      noStroke();
      if (grid[i][j] > 0) {
        fill(grid[i][j], 255, 255); //change color to sand color and maybe even fading colors
        let x = i * w;
        let y = j * w;
        square(x, y, w);
      }
    }
  }

  //create an array for the next frame
  let nextGrid = make2DArray(cols, rows);
  //check every cell
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      //what is the state? (0 -no color or 1 -sand color)
      let state = grid[i][j];

      //if there is a piece of sand
      if (state > 0) {
        //check below
        let below = grid[i][j+1];

        //randomly chooses a direction to fall to
        let dir = 1;
        if (random(1) < 0.5) {
          dir *= -1;
        }

        //check below left and right
        let belowA = -1;
        let belowB = -1;
        if (withinCols(i + dir)) {
          belowA = grid[i + dir][j + 1];
        } 
        if (withinCols(i - dir)) {
          belowB = grid[i - dir][j + 1];
        }
        
        //move sand down/right/left
        if (below === 0) {
          nextGrid[i][j + 1] = state;
        } else if (belowA === 0 ){
          nextGrid[i + dir][j + 1] = state;
        } else if (belowB === 0) {
          nextGrid[i - dir][j + 1] = state;
        } else { //stay put
          nextGrid[i][j] = state;
        }
      }
    }
  }
  grid = nextGrid;
}

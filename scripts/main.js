main();

function main() {
  const coef = getCoef();
  let roots = new Set(solve(coef.a, coef.b, coef.c));
  roots.add(0);

  let borders = getBorder(roots, coef);

  const canvas = document.getElementById("canvas");
  if (canvas.getContext) {
    const ctx = canvas.getContext("2d");
    const cellSize = getCellSize(
      borders.leftX,
      borders.rightX,
      borders.bottomY,
      borders.topY
    );

    canvas.height = (borders.topY - borders.bottomY) * cellSize;
    canvas.width = (borders.rightX - borders.leftX) * cellSize;
    console.log(borders);
    const coordinatesCenter = getCenterCoordinates(
      cellSize,
      borders.leftX,
      borders.topY
    );
    drawCoordinateLines(
      cellSize,
      ctx,
      borders.leftX,
      borders.rightX,
      borders.bottomY,
      borders.topY,
      coordinatesCenter
    );

    drawFunc(
      coef,
      cellSize,
      ctx,
      borders.leftX,
      borders.rightX,
      borders.bottomY,
      borders.topY
    );
  }
}

/** Function for user input coefs
 * @returns {Object} object with coefficients a:Number,b:Number,c:Number
 */
function getCoef() {
  // let a = +prompt("Input a: ", 0);
  // let b = +prompt("Input b: ", 0);
  // let c = +prompt("Input c: ", 0);
  return { a: -1, b: -4, c: -10 };
}

/**Function for solving quadratic equation: ax^2 + bx + c = 0
 * @returns {Array} Roots
 */
function solve(a, b, c) {
  const D = Math.pow(b, 2) - 4 * a * c;
  if (D < 0) return [];
  if (D == 0) return [-b / 2 / a];
  return [(-b + Math.sqrt(D)) / 2 / a, (-b - Math.sqrt(D)) / 2 / a];
}
/**Get border of graph
 * @param {Array} roots - roots of ax^2 + bx + c = 0
 * @param {Object} coef - object with coefficients a:Number,b:Number,c:Number
 * @returns {Object} - borders
 */
function getBorder(roots, coef) {
  // console.log(roots);
  let leftX = Math.min(...roots);
  let rightX = Math.max(...roots);
  // console.log([leftX, rightX]);
  let topY;
  let bottomY;

  const xv = -coef.b / 2 / coef.a;
  const yv = coef.a * xv * xv + coef.b * xv + coef.c;
  // console.log([yv, xv]);
  if (yv < 0) {
    bottomY = yv * 2;
    topY = bottomY < -10 ? -yv / 2 : 10 + bottomY;
  } else {
    topY = yv * 2;
    bottomY = topY > 10 ? -yv / 2 : -10 + yv;
    // maximumY = yv;
  }
  // console.log([leftX, rightX, bottomY, topY]);

  let dif = rightX - leftX - (topY - bottomY);
  // console.log(dif);
  if (dif > 0) {
    topY += dif / 2;
    bottomY = -(rightX - leftX) + topY;
  } else {
    rightX -= dif / 2;
    leftX = -(topY - bottomY) + rightX;
  }

  rightX = Math.floor(rightX * 1.1);
  leftX = Math.ceil(leftX * 1.1);
  bottomY = Math.floor(bottomY * 1.1);
  topY = Math.ceil(topY * 1.1);
  // console.log([leftX, rightX, bottomY, topY]);
  return { leftX, rightX, bottomY, topY };
}

/**Function for getting size of cells
 * @param {Number} leftX -  left border
 * @param {Number} rightX - right border
 * @param {Number} bottomY - bottom border
 * @param {Number} topY - top border
 * @returns {Number} Size of cell
 */
function getCellSize(leftX, rightX, bottomY, topY) {
  return Math.min(
    window.innerWidth / (rightX - leftX) / 2,
    window.innerHeight / (topY - bottomY) / 2
  );
}

/**Function for getting size of cells
 * @param {Number} cellSize - Size of cell
 * @param {Number} leftX -  left border
 * @param {Number} topY - top border
 * @returns {Object} X and Y coordinates of center
 */
function getCenterCoordinates(cellSize, leftX, topY) {
  return { x: -leftX * cellSize, y: topY * cellSize };
}

/**Draws coordinate lines
 * @param {Number} cellSize - Size of cell
 * @param {} ctx - Canvas context
 * @param {Number} leftX -  left border
 * @param {Number} rightX - right border
 * @param {Number} bottomY - bottom border
 * @param {Number} topY - top border
 * @param {Object} coordinatesCenter object with X and Y coordinates of center
 */
function drawCoordinateLines(
  cellSize,
  ctx,
  leftX,
  rightX,
  bottomY,
  topY,
  coordinatesCenter
) {
  console.log("Center:");
  console.log(coordinatesCenter);
  ctx.fillStyle = "#808080";
  for (let y = 0; y < (topY - bottomY) * cellSize; y += cellSize) {
    ctx.fillRect(0, y, cellSize * (rightX - leftX), 1);
  }
  for (let x = 0; x < (rightX - leftX) * cellSize; x += cellSize) {
    ctx.fillRect(x, 0, 1, cellSize * (topY - bottomY));
  }
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, coordinatesCenter.y, cellSize * (rightX - leftX), 1);
  ctx.fillRect(coordinatesCenter.x, 0, 1, cellSize * (topY - bottomY));
}

/**Draws function graph
 * @param {Object} coef - object with coefficients a:Number,b:Number,c:Number
 * @param {Number} cellSize - Size of cell
 * @param {} ctx - Canvas context
 * @param {Number} leftX -  left border
 * @param {Number} rightX - right border
 * @param {Number} bottomY - bottom border
 * @param {Number} topY - top border
 */
function drawFunc(coef, cellSize, ctx, leftX, rightX, bottomY, topY) {
  // console.log([coef, ctx, cellSize, leftX, bottomY, topY, rightX]);
  ctx.fillStyle = "#000000";
  // let h=1e-10;
  let dif = 2 * coef.a * leftX + coef.b;
  // console.log([dif,leftX,topY]);
  for (let x = leftX; x <= rightX; x += 1 / 10 / Math.abs(dif) / cellSize) {
    let dif = 2 * coef.a * x + coef.b;
    // alert(x);
    let y = coef.a * x * x + coef.b * x + coef.c;
    if (y > topY || y < bottomY) continue;
    let coordinates = changeCoordinates(cellSize, x, y, leftX, topY);
    ctx.fillRect(coordinates.x, coordinates.y, 0.5, 0.5);

    // console.log(x);
  }
}

/**Function for converting default mathematic coordinates to computer
 * @param {Number} cellSize - Size of cell
 * @param {Number} coordinateX -  X coordinate to convert
 * @param {Number} coordinateY -  Y coordinate to convert
 * @param {Number} leftX -  left border
 * @param {Number} topY - top border
 * @returns {Object} X and Y coordinates
 */
function changeCoordinates(cellSize, coordinateX, coordinateY, leftX, topY) {
  let centerCoordinates = getCenterCoordinates(cellSize, leftX, topY);
  return {
    x: centerCoordinates.x + cellSize * coordinateX,
    y: centerCoordinates.y - cellSize * coordinateY,
  };
}

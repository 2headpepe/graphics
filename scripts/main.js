main();
function main() {
  const coef = getCoef();
  console.log("coef");
  console.log(coef);
  let roots = new Set(solve(coef.a, coef.b, coef.c));
  roots.add(0);
  console.log("roots");
  console.log(roots);
  let borders = getBorder(roots, coef);

  const canvas = document.getElementById("canvas");
  if (canvas.getContext) {
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(50, 100);
    ctx.lineTo(150, 100);
    ctx.stroke();
    const cellSize = getCellSize(
      borders.leftX,
      borders.rightX,
      borders.bottomY,
      borders.topY
    );
    console.log("cellSize");
    console.log(cellSize);
    console.log("scale");
    console.log(
      getScale(borders.leftX, borders.rightX, borders.bottomY, borders.topY)
    );
    let scale = getScale(
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
      borders.topY,
      scale
    );
    drawCoordinateLines(
      cellSize,
      ctx,
      borders.leftX,
      borders.rightX,
      borders.bottomY,
      borders.topY,
      coordinatesCenter,
      scale
    );

    drawFunc(
      coef,
      cellSize,
      ctx,
      borders.leftX,
      borders.rightX,
      borders.bottomY,
      borders.topY,
      scale
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
  let ans = prompt(
    `Enter "y" if you want enter coefficients
(by default it is random values from -50 to 50)`,
    ""
  );
  if (ans != "y") {
    return {
      a: Math.random() * 100 - 50,
      b: Math.random() * 100 - 50,
      c: Math.random() * 100 - 50,
    };
  } else {
    a = +prompt("okay! Enter first coefficient!", 0);
    b = +prompt("Enter second coefficient!", 0);
    c = +prompt("Enter third coefficient!", 0);
    return { a, b, c };
  }
}

/**Function for solving quadratic equation: ax^2 + bx + c = 0
 * @returns {Array} Roots
 */
function solve(a, b, c) {
  // console.log([a, b, c]);
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
  let topY = 10;
  let bottomY = -10;

  const xv = -coef.b / 2 / coef.a;
  const yv = f(coef, xv);
  // console.log([yv, xv]);
  if (yv < 0) {
    bottomY = yv * 1.1;
    if (bottomY < -50) {
      topY = 10;
    } else {
      topY = bottomY < -10 ? -yv / 2 : 10 + bottomY;
    }
  } else if (yv > 0) {
    topY = yv * 1.1;
    if (top > 50) {
      bottomY = -10;
    } else {
      bottomY = topY > 10 ? -yv / 2 : -10 + yv;
    }
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

  console.log("[leftX, rightX, bottomY, topY]");
  console.log([leftX, rightX, bottomY, topY]);
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
  // console.log([leftX, rightX, bottomY, topY]);
  let dif = rightX - leftX;
  let tmpSize = Math.min(
    window.innerWidth / (rightX - leftX),
    window.innerHeight / (topY - bottomY)
  );
  console.log(window.innerWidth);
  console.log(dif / 20);
  let scale = Math.ceil(dif / 20);
  console.log(scale);
  tmpSize *= scale;
  return tmpSize;
}
function getScale(leftX, rightX) {
  let dif = rightX - leftX;

  return Math.ceil(dif / 20);
}

/**Function for getting size of cells
 * @param {Number} cellSize - Size of cell
 * @param {Number} leftX -  left border
 * @param {Number} topY - top border
 * @returns {Object} X and Y coordinates of center
 */
function getCenterCoordinates(cellSize, leftX, topY, scale) {
  return { x: (-leftX * cellSize) / scale, y: (topY * cellSize) / scale };
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
  coordinatesCenter,
  scale
) {
  console.log("Center:");
  console.log(coordinatesCenter);
  ctx.fillStyle = "#000000";
  ctx.fillRect(
    0,
    coordinatesCenter.y,
    (cellSize * (rightX - leftX)) / scale,
    1
  );
  ctx.fillRect(
    coordinatesCenter.x,
    0,
    1,
    (cellSize * (topY - bottomY)) / scale
  );

  let i = 1;
  for (let y = coordinatesCenter.y - cellSize; y >= 0; y -= cellSize) {
    ctx.fillStyle = "#808080";
    ctx.fillRect(0, y, (cellSize * (rightX - leftX)) / scale, 1);
    // ctx.fillStyle = "#ffffff";
    // ctx.fillRect(coordinatesCenter.x, y, cellSize, 10);
    ctx.fillStyle = "#000000";
    ctx.font = "bold 10px serif";

    ctx.fillText(
      i * scale,
      coordinatesCenter.x + cellSize / 10,
      y - cellSize / 10,
      (cellSize * 9) / 10
    );
    ++i;
  }

  i = 0;
  for (
    let y = coordinatesCenter.y;
    y < ((topY - bottomY) * cellSize) / scale;
    y += cellSize
  ) {
    // console.log("hi");

    ctx.fillStyle = "#808080";
    ctx.fillRect(0, y, (cellSize * (rightX - leftX)) / scale, 1);
    ctx.fillStyle = "#000000";
    ctx.font = "bold 10px serif";

    ctx.fillText(
      -i * scale,
      coordinatesCenter.x + cellSize / 10,
      y - cellSize / 10,
      (cellSize * 9) / 10
    );
    ++i;
  }

  i = 1;
  for (
    let x = coordinatesCenter.x + cellSize;
    x < ((rightX - leftX) * cellSize) / scale;
    x += cellSize
  ) {
    ctx.fillStyle = "#808080";
    ctx.fillRect(x, 0, 1, (cellSize * (topY - bottomY)) / scale);
    ctx.fillStyle = "#000000";
    ctx.font = "bold 10px serif";

    ctx.fillText(
      i * scale,
      x + cellSize / 10,
      coordinatesCenter.y - cellSize / 10,
      (cellSize * 9) / 10
    );
    ++i;
  }
  i = 1;
  for (let x = coordinatesCenter.x - cellSize; x >= 0; x -= cellSize) {
    ctx.fillStyle = "#808080";
    ctx.fillRect(x, 0, 1, (cellSize * (topY - bottomY)) / scale);
    ctx.fillStyle = "#000000";
    ctx.font = "bold 10px serif";

    ctx.fillText(
      -i * scale,
      x + cellSize / 10,
      coordinatesCenter.y - cellSize / 10,
      (cellSize * 9) / 10
    );
    ++i;
  }
}
function f(coef, x) {
  return coef.a * x * x + coef.b * x + coef.c;
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
function drawFunc(coef, cellSize, ctx, leftX, rightX, bottomY, topY, scale) {
  // console.log([coef, ctx, cellSize, leftX, bottomY, topY, rightX]);
  ctx.fillStyle = "#000000";
  let dif = 2 * coef.a * leftX + coef.b;
  let cosx = Math.cos(Math.atan(dif));
  let sinx = Math.sin(Math.atan(dif));
  let h = 1 / 20;
  let i = 0;
  // console.log([dif,leftX,topY]);
  for (let x = leftX; x <= rightX; x += h * cosx) {
    dif = 2 * coef.a * x + coef.b;
    cosx = Math.cos(Math.atan(dif));
    let y = f(coef, x);
    if (y > topY || y < bottomY) continue;
    let tmpCoordinates = changeCoordinates(
      cellSize,
      x,
      f(coef, x),
      leftX,
      topY,
      scale
    );
    let newCoordinates = changeCoordinates(
      cellSize,
      x + h * cosx,
      f(coef, x + h * cosx),
      leftX,
      topY,
      scale
    );
    ctx.moveTo(tmpCoordinates.x, tmpCoordinates.y);
    ctx.lineTo(newCoordinates.x, newCoordinates.y);

    // console.log(x);
  }
  ctx.stroke();
}

/**Function for converting default mathematic coordinates to computer
 * @param {Number} cellSize - Size of cell
 * @param {Number} coordinateX -  X coordinate to convert
 * @param {Number} coordinateY -  Y coordinate to convert
 * @param {Number} leftX -  left border
 * @param {Number} topY - top border
 * @returns {Object} X and Y coordinates
 */
function changeCoordinates(
  cellSize,
  coordinateX,
  coordinateY,
  leftX,
  topY,
  scale
) {
  let centerCoordinates = getCenterCoordinates(cellSize, leftX, topY, scale);
  return {
    x: centerCoordinates.x + (cellSize * coordinateX) / scale,
    y: centerCoordinates.y - (cellSize * coordinateY) / scale,
  };
}

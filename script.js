let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;

// player cannt move until startBtnActive becomes false
let startBtnActive = true;
// player can move until gameOver = true;
let gameOver = false;

const main = document.querySelector("main");

//Player = 2, Wall = 1, Enemy = 3, Point = 0
let maze = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 0, 1, 0, 0, 0, 0, 3, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
  [1, 0, 0, 1, 0, 3, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 3, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

//Populates the maze in the HTML
for (let y of maze) {
  for (let x of y) {
    let block = document.createElement("div");
    block.classList.add("block");

    switch (x) {
      case 1:
        block.classList.add("wall");
        block.classList.add("solid");
        break;
      case 2:
        block.id = "player";
        let mouth = document.createElement("div");
        mouth.classList.add("mouth");
        block.appendChild(mouth);
        break;
      case 3:
        block.classList.add("enemy");
        // block.classList.add("solid");
        break;
      default:
        block.classList.add("point");
        block.style.height = "1vh";
        block.style.width = "1vh";
    }

    main.appendChild(block);
  }
}

//Player movement
function keyUp(event) {
  if (event.key === "ArrowUp") {
    upPressed = false;
  } else if (event.key === "ArrowDown") {
    downPressed = false;
  } else if (event.key === "ArrowLeft") {
    leftPressed = false;
  } else if (event.key === "ArrowRight") {
    rightPressed = false;
  }
}

function keyDown(event) {
  if (event.key === "ArrowUp") {
    upPressed = true;
  } else if (event.key === "ArrowDown") {
    downPressed = true;
  } else if (event.key === "ArrowLeft") {
    leftPressed = true;
  } else if (event.key === "ArrowRight") {
    rightPressed = true;
  }
}

const player = document.querySelector("#player");
const playerMouth = player.querySelector(".mouth");
let playerTop = 0;
let playerLeft = 0;

let gameLoopInterval; //used to clear interval

gameLoopInterval = setInterval(function () {
  touchedEnemy();
  Pointcheck();
  let currentPosition = player.getBoundingClientRect();
  // getting the new positions for point collision detection
  let newBottom = currentPosition.bottom + 1;
  let newTop = currentPosition.top - 1;
  let newLeft = currentPosition.left - 1;
  let newRight = currentPosition.right + 1;
  if (startBtnActive == false && gameOver == false) {
    // added to ensure player cant move until this is true
    if (downPressed) {
      let btmL = document.elementFromPoint(currentPosition.left, newBottom);
      let btmR = document.elementFromPoint(currentPosition.right, newBottom);

      if (
        btmL.classList.contains("solid") == false &&
        btmR.classList.contains("solid") == false
      ) {
        playerTop++;
        player.style.top = playerTop + "px";
        playerMouth.classList = "down";
      }
    } else if (upPressed) {
      let topL = document.elementFromPoint(currentPosition.left, newTop);
      let topR = document.elementFromPoint(currentPosition.right, newTop);
      if (
        topL.classList.contains("solid") == false &&
        topR.classList.contains("solid") == false
      ) {
        playerTop--;
        player.style.top = playerTop + "px";
        playerMouth.classList = "up";
      }
    } else if (leftPressed) {
      let topL = document.elementFromPoint(newLeft, currentPosition.top);
      let btmL = document.elementFromPoint(newLeft, currentPosition.bottom);
      if (
        topL.classList.contains("solid") == false &&
        btmL.classList.contains("solid") == false
      ) {
        playerLeft--;
        player.style.left = playerLeft + "px";
        playerMouth.classList = "left";
      }
    } else if (rightPressed) {
      let topR = document.elementFromPoint(newRight, currentPosition.top);
      let btmR = document.elementFromPoint(newRight, currentPosition.bottom);
      if (
        topR.classList.contains("solid") == false &&
        btmR.classList.contains("solid") == false
      ) {
        playerLeft++;
        player.style.left = playerLeft + "px";
        playerMouth.classList = "right";
      }
    }
  }
}, 10);

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

// my code

const startBtn = document.querySelector(".start");
function hideStart() {
  const startDiv = startBtn.parentElement;
  startDiv.style.display = "none";
  startDiv.style.pointerEvents = "none";
  startBtnActive = false;
}
startBtn.addEventListener("click", hideStart);

function Pointcheck() {
  const position = player.getBoundingClientRect();
  const points = document.querySelectorAll(".point");

  for (let point of points) {
    let pos = point.getBoundingClientRect();
    if (
      position.right > pos.left &&
      position.left < pos.right &&
      position.bottom > pos.top &&
      position.top < pos.bottom
    ) {
      // point.style.opacity = 0;
      // point.style.pointerEvents = "none";
      point.classList.remove("point");
      let score = document.querySelector(".score p");
      // console.log(score.firstChild.nodeValue);
      // console.log(parseInt(score.firstChild.nodeValue) + 1);
      score.firstChild.nodeValue = parseInt(score.firstChild.nodeValue) + 1;
      // if (score.firstChild.nodeValue == 50) {
      //   alert("Game Over!");
      // }
      checkGameOver(score);
    }
  }
}

function checkGameOver(score) {
  if (score.firstChild.nodeValue == 50) {
    displayGameOver();
  }
}

function touchedEnemy() {
  let enemies = document.querySelectorAll(".enemy");
  const position = player.getBoundingClientRect();
  for (let enemy of enemies) {
    let pos = enemy.getBoundingClientRect();
    if (
      position.right > pos.left &&
      position.left < pos.right &&
      position.bottom > pos.top &&
      position.top < pos.bottom
    ) {
      console.log("touched enemy");
      displayGameOver();
    }
  }
}

function displayGameOver() {
  console.log("GameOver");
  gameOver = true;
  clearInterval(gameLoopInterval);
  let gameOverDiv = document.createElement("div");
  let textNode = document.createTextNode("Game Over!");

  gameOverDiv.appendChild(textNode);
  gameOverDiv.style.display = "flex";
  gameOverDiv.style.alignItems = "center";
  gameOverDiv.style.justifyContent = "center";
  gameOverDiv.style.position = "fixed";
  gameOverDiv.style.position = "center center";
  gameOverDiv.style.backgroundColor = "white";
  gameOverDiv.style.width = "30vw";
  gameOverDiv.style.height = "10vw";
  gameOverDiv.style.backgroundColor = "#ccc";
  gameOverDiv.style.borderRadius = "20px";
  gameOverDiv.style.boxShadow = "4px 4px 4px #000";
  gameOverDiv.style.textShadow = "2px 2px 2px #000";
  gameOverDiv.style.fontSize = "2em";
  // gameOverDiv.style.top = "50vh";
  // gameOverDiv.style.left = "50vw";
  document.body.appendChild(gameOverDiv);
}

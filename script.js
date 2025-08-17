let score = 0;
let lives = 3;
let gameOver = false;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Road lanes
const lanes = [90, 220, 350]; 
let playerLane = 1; // middle lane

// Player car
let player = { x: lanes[playerLane], y: 450, w: 50, h: 70, color: "blue" };

// Obstacles
let obstacles = [];
let obstacleSpeed = 3;
let frameCount = 0;

// Create obstacle row with one free lane
function createObstacle() {
  let emptyLane = Math.floor(Math.random() * 3);
  for (let i = 0; i < 3; i++) {
    if (i !== emptyLane) {
      obstacles.push({ x: lanes[i], y: -80, w: 50, h: 70, speed: obstacleSpeed });
    }
  }
}

// Draw player
function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.w, player.h);
}

// Draw obstacles
function drawObstacles() {
  ctx.fillStyle = "red";
  obstacles.forEach(ob => {
    ctx.fillRect(ob.x, ob.y, ob.w, ob.h);
  });
}

// Draw road lanes
function drawRoad() {
  ctx.strokeStyle = "white";
  ctx.setLineDash([20, 20]);
  ctx.lineWidth = 2;
  for (let i = 1; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(i * 166, 0);
    ctx.lineTo(i * 166, canvas.height);
    ctx.stroke();
  }
  ctx.setLineDash([]);
}

// Update obstacles
function updateObstacles() {
  obstacles.forEach((ob, index) => {
    ob.y += ob.speed;

    // Off screen → remove & add score
    if (ob.y > canvas.height) {
      obstacles.splice(index, 1);
      score++;
      document.getElementById("score").textContent = score;

      // Speed up every 10 points
      if (score % 10 === 0) obstacleSpeed += 0.5;
    }

    // Collision detection
    if (
      player.x < ob.x + ob.w &&
      player.x + player.w > ob.x &&
      player.y < ob.y + ob.h &&
      player.y + player.h > ob.y
    ) {
      // Lose one life
      lives--;
      document.getElementById("lives").textContent = "❤️".repeat(lives);
      obstacles.splice(index, 1); // remove the car that hit
      if (lives <= 0) endGame();
    }
  });
}

// Game loop
function gameLoop() {
  if (gameOver) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawRoad();
  drawPlayer();
  drawObstacles();
  updateObstacles();

  // Spawn obstacle every 80 frames
  frameCount++;
  if (frameCount % 80 === 0) {
    createObstacle();
  }

  requestAnimationFrame(gameLoop);
}

// Player controls
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft" && playerLane > 0) {
    playerLane--;
    player.x = lanes[playerLane];
  }
  if (e.key === "ArrowRight" && playerLane < 2) {
    playerLane++;
    player.x = lanes[playerLane];
  }
});

// Game Over popup
function endGame() {
  gameOver = true;
  document.getElementById("finalScore").textContent = score;
  document.getElementById("gamePopup").style.display = "flex";
}

function closePopup() {
  document.getElementById("gamePopup").style.display = "none";
}

function restartGame() {
  score = 0;
  lives = 3;
  obstacleSpeed = 3;
  gameOver = false;
  obstacles = [];
  playerLane = 1;
  player.x = lanes[playerLane];
  document.getElementById("score").textContent = score;
  document.getElementById("lives").textContent = "❤️❤️❤️";
  document.getElementById("gamePopup").style.display = "none";
  gameLoop();
}

// Start game
gameLoop();

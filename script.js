let character;
let score = 0;
let projectiles = [];
let gameRunning = true;

function setup() {
  let canvasWidth = windowWidth - 100;
  let canvasHeight = windowHeight / 4;
  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('gameContainer'); // Optional: to place the canvas in a specific div
  character = createSprite(width / 10, height / 2, 50, 50);
}

function draw() {
  background(200);

  if (gameRunning) {
    handleInput();
    handleProjectiles();
    drawSprites();
    displayScore();
  } else {
    showGameOver();
  }
}

function handleInput() {
  // Replace with mouseWheel event if needed
  if (mouseIsPressed) {
    character.position.y -= 5;
  } else {
    character.position.y += 5;
  }
  character.position.y = constrain(character.position.y, character.height / 2, height - character.height / 2);
}

function handleProjectiles() {
  // Generate projectiles less frequently
  if (frameCount % 90 === 0) {
    let size = random(10, 40);
    let speed = random(4, 8); // Increased speed
    let projectile = createSprite(width + size / 2, random(size / 2, height - size / 2), size, size / 2);
    projectile.setSpeed(speed, 180);
    projectiles.push(projectile);
  }

  // Move and draw projectiles
  for (let i = projectiles.length - 1; i >= 0; i--) {
    let projectile = projectiles[i];
    if (projectile.position.x < 0) {
      projectile.remove();
      projectiles.splice(i, 1);
    } else if (projectile.overlap(character)) {
      gameRunning = false;
    }
  }
}

function displayScore() {
  fill(0);
  textSize(16);
  text(`Score: ${score}`, 10, 20);
}

function showGameOver() {
  fill(255, 0, 0);
  textSize(32);
  textAlign(CENTER, CENTER);
  text(`Game Over! Your score was: ${score}`, width / 2, height / 2);
}

// Optional: Handle mouse wheel event for character movement
function mouseWheel(event) {
  character.position.y += event.delta;
}

document.body.addEventListener('wheel', function(event) {
    const character = document.getElementById('character');
    let topValue = parseInt(window.getComputedStyle(character).getPropertyValue('top'));

    if (event.deltaY < 0) {
        topValue -= 10; // Move up
    } else {
        topValue += 10; // Move down
    }

    topValue = Math.max(0, Math.min(topValue, window.innerHeight - character.offsetHeight));
    character.style.top = topValue + 'px';
});

let score = 0;

function updateScore() {
    document.getElementById('score').textContent = `Score: ${score}`;
}

// Set the game loop to run at a typical frame rate
setInterval(gameLoop, 1000 / 60); // 60 FPS

let gameRunning = true;
const projectiles = [];

function gameLoop() {
    if (!gameRunning) return;

    moveProjectiles();

    // Create projectiles with a lower probability for less frequency
    if (Math.random() < 0.1) {
        createProjectile();
    }
}

function createProjectile() {
    const gameArea = document.getElementById('gameArea');
    const projectile = document.createElement('div');
    let type = Math.random();

    if (type < 0.3) {
        projectile.className = 'projectile large';
        projectile.speed = 3;
        projectile.style.width = '80px'; // Size increased from 40px
        projectile.style.height = '40px'; // Size increased from 20px
    } else if (type < 0.6) {
        projectile.className = 'projectile small';
        projectile.speed = 7;
        projectile.style.width = '40px'; // Size increased from 20px
        projectile.style.height = '20px'; // Size increased from 10px
    } else {
        projectile.className = 'projectile coin';
        projectile.speed = 4;
        projectile.style.width = '20px'; // Size increased from 10px
        projectile.style.height = '20px'; // Size increased for consistency
    }

    projectile.style.backgroundColor = type < 0.3 ? 'blue' : type < 0.6 ? 'red' : 'gold'; // Assign color
    projectile.style.top = Math.random() * (gameArea.offsetHeight - parseInt(projectile.style.height)) + 'px';
    projectile.style.left = gameArea.offsetWidth + 'px';
    gameArea.appendChild(projectile);
    projectiles.push(projectile);
}

function moveProjectiles() {
    projectiles.forEach(projectile => {
        let speed = projectile.speed; // Use the assigned speed for each projectile

        let currentPosition = parseInt(projectile.style.left, 10);
        projectile.style.left = `${currentPosition - speed}px`;

        if (detectCollision(projectile, document.getElementById('character'))) {
            if (projectile.classList.contains('coin')) {
                score += 10;
                updateScore();
            } else {
                gameRunning = false;
                alert(`Game Over! Your score was: ${score}`);
            }
            projectile.remove();
            projectiles.splice(projectiles.indexOf(projectile), 1);
        }

        // Remove the projectile if it's gone past the left edge of the game area
        if (currentPosition < -projectile.offsetWidth) {
            projectile.remove();
            projectiles.splice(projectiles.indexOf(projectile), 1);
        }
    });
}

function detectCollision(projectile, character) {
    const projectileRect = projectile.getBoundingClientRect();
    const characterRect = character.getBoundingClientRect();

    return !(
        projectileRect.top > characterRect.bottom ||
        projectileRect.right < characterRect.left ||
        projectileRect.bottom < characterRect.top ||
        projectileRect.left > characterRect.right
    );
}

// Set up the score display
document.addEventListener('DOMContentLoaded', () => {
    const scoreDiv = document.createElement('div');
    scoreDiv.id = 'score';
    scoreDiv.textContent = `Score: ${score}`;
    document.body.appendChild(scoreDiv);
});

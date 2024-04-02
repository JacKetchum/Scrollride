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

// Let's run the game loop at a more typical frame rate
setInterval(gameLoop, 1000 / 60); // 60 FPS

let gameRunning = true;
const projectiles = [];

function gameLoop() {
    if (!gameRunning) return;

    moveProjectiles();

    // Create projectiles more frequently
    if (Math.random() < 0.2) { // Adjust spawn rate as needed
        createProjectile();
    }
}

function createProjectile() {
    const gameArea = document.getElementById('gameArea');
    const projectile = document.createElement('div');
    let type = Math.random();

    if (type < 0.3) {
        projectile.className = 'projectile large';
    } else if (type < 0.6) {
        projectile.className = 'projectile small';
    } else {
        projectile.className = 'projectile coin';
    }

    projectile.style.top = Math.random() * (gameArea.offsetHeight - 20) + 'px';
    projectile.style.left = gameArea.offsetWidth + 'px'; // Start just outside the game area
    gameArea.appendChild(projectile);
    projectiles.push(projectile);
}

function moveProjectiles() {
    projectiles.forEach(projectile => {
        let speed;
        if (projectile.classList.contains('large')) {
            speed = 1; // Large and slow
        } else if (projectile.classList.contains('small')) {
            speed = 4; // Small and fast
        } else if (projectile.classList.contains('coin')) {
            speed = 2; // Coin speed
        }

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

        // Remove the projectile if it's gone past the left edge
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

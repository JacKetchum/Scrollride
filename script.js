document.body.addEventListener('wheel', function(event) {
    const character = document.getElementById('character');
    let topValue = parseInt(window.getComputedStyle(character).getPropertyValue('top'));

    // Scroll to change the elevation of the character
    if (event.deltaY < 0) {
        topValue -= 10; // Move up
    } else {
        topValue += 10; // Move down
    }

    // Keep the character within the bounds of the game area
    topValue = Math.max(0, Math.min(topValue, window.innerHeight - 50)); // 50 is the height of the character

    character.style.top = topValue + 'px';
});

// Run the game loop every 20ms
setInterval(gameLoop, 20);

// The game state
let gameRunning = true;
const projectiles = [];

function gameLoop() {
    if (!gameRunning) return;

    // Move projectiles
    moveProjectiles();

    // Spawn a new projectile every 2 seconds
    if (Date.now() % 2000 < 20) {
        createProjectile();
    }

    // Collision detection
    projectiles.forEach(projectile => {
        if (detectCollision(projectile, document.getElementById('character'))) {
            gameRunning = false;
            alert('Game Over!');
            // You can add more game over logic here
        }
    });
}

function createProjectile() {
    const gameArea = document.getElementById('gameArea');
    const projectile = document.createElement('div');
    projectile.className = 'projectile';
    projectile.style.top = Math.random() * (gameArea.offsetHeight - 20) + 'px'; // 20 is the height of the projectile
    projectile.style.right = '-20px';
    gameArea.appendChild(projectile);
    projectiles.push(projectile);
}

function moveProjectiles() {
    projectiles.forEach(projectile => {
        let currentPosition = parseInt(projectile.style.right, 10);
        currentPosition += 5; // Speed of the projectile
        projectile.style.right = `${currentPosition}px`;

        // Remove the projectile if it goes off screen
        if (currentPosition > gameArea.offsetWidth) {
            projectile.parentNode.removeChild(projectile);
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

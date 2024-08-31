


let pipes = [];
const pipeGap = 150; // Space between the top and bottom pipes
const pipeSpeed = 2; // Speed at which pipes move
const pipeSpacing = 300; // Distance between successive pipes

function createPipes() {
    const pipeTop = new PIXI.Sprite(PIXI.Loader.shared.resources['pipeTop'].texture);
    const pipeBottom = new PIXI.Sprite(PIXI.Loader.shared.resources['pipeBottom'].texture);

    // Position the pipes
    const pipeX = app.screen.width;
    const pipeY = Math.random() * (app.screen.height - pipeGap - 100) + 50;

    pipeTop.x = pipeX;
    pipeTop.y = pipeY - pipeTop.height;

    pipeBottom.x = pipeX;
    pipeBottom.y = pipeY + pipeGap;

    // Add pipes to stage
    app.stage.addChild(pipeTop);
    app.stage.addChild(pipeBottom);

    // Add to the pipes array for later movement
    pipes.push({ top: pipeTop, bottom: pipeBottom });
}

function movePipes() {
    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].top.x -= pipeSpeed;
        pipes[i].bottom.x -= pipeSpeed;

        // Remove pipes that are off-screen
        if (pipes[i].top.x + pipes[i].top.width < 0) {
            app.stage.removeChild(pipes[i].top);
            app.stage.removeChild(pipes[i].bottom);
            pipes.splice(i, 1); // Remove pipe from array
        }
    }
}

function gameLoop(delta) {
    // Apply gravity to the bird
    velocity += gravity;
    bird.y += velocity;

    // Move the background (if applicable)
    moveBackground();

    // Move pipes and check for collisions
    movePipes();

    // Create new pipes periodically
    if (app.ticker.lastTime % pipeSpacing === 0) {
        createPipes();
    }

    // Check for ground or ceiling collision
    if (bird.y > app.screen.height || bird.y < 0) {
        resetGame();
    }
}

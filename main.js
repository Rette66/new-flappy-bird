// Create a Pixi Application
let app = new PIXI.Application({
    width: 600,   // Width of the canvas
    height: window.innerHeight, // Height of the canvas
    backgroundColor: 0x1099bb,  // Background color
    resolution: window.devicePixelRatio || 1, // Resolution of the canvas
    autoDensity: true, // Automatically adjusts the canvas to the device's pixel density
});



// Add the canvas to the HTML document
document.body.appendChild(app.view);


let bird, gravity = 0.01, lift = -1, velocity = 0

// Load an image and create a sprite
PIXI.Loader.shared
    .add("pipeTop", "Assets/pipe-top.png")
    .add("pipeBottom", "Assets/pipe-bottom.png")
    .add('bird', 'Assets/birdFrames.json')
    .load(setup);

function setup() {

    let background = new PIXI.Sprite.from('Assets/bg.png');
    background.width = app.screen.width;
    background.height = app.screen.height;
    app.stage.addChild(background);



    let frames = [];

    for (let i = 0; i < 3; i++) { // Adjust the number based on the total frames
        const frameKey = `frame${i+1}.png`; // Change this based on your frame naming convention
        frames.push(PIXI.Texture.from(frameKey));
    }

    // console.log(frames);

    bird = new PIXI.AnimatedSprite(frames);

    // Position the sprite at the center of the screen
    bird.x = app.screen.width / 2;
    bird.y = app.screen.height / 2;
    bird.anchor.set(0.5);

    // Set animation speed and start playing the animation
    bird.animationSpeed = 0.1; // Adjust the speed (higher value means faster)
    bird.play();

    // Add the animated sprite to the stage
    app.stage.addChild(bird);

    window.addEventListener('keydown', flap );
    app.ticker.add(gameLoop);

    createPipes();
}

// Resize the canvas when the window is resized
window.addEventListener('resize', () => {
    app.renderer.resize(600, window.innerHeight);
});


function flap(event) {
    if (event.code === "Space") {
        velocity = lift;
    }
}

let pipes = [];
const pipeGap = 300; // Space between the top and bottom pipes
const pipeSpeed = 1; // Speed at which pipes move
const pipeSpacing = 300; // Distance between successive pipes
const pipeInterval = 2000;
 pipeTimer = 0;

function createPipes() {

    console.log(PIXI.Loader.shared.resources['pipeTop'])
    const pipeTop = new PIXI.Sprite(PIXI.Loader.shared.resources['pipeTop'].texture);
    const pipeBottom = new PIXI.Sprite(PIXI.Loader.shared.resources['pipeBottom'].texture);

    pipeTop.scale.set(2);
    pipeBottom.scale.set(2);



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

    // Update the pipe timer
    pipeTimer += app.ticker.deltaTime;


    // Check if it's time to create a new pipe
    if (pipeTimer >= pipeInterval) {
        createPipes();
        pipeTimer = 0; // Reset the timer
    }
    // Move the background (if applicable)
    // moveBackground();

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


function hitTestRectangle(r1, r2) {
    // 定义两个对象的边界
    let r1Bounds = r1.getBounds();
    let r2Bounds = r2.getBounds();

    // 检查是否重叠
    return r1Bounds.x < r2Bounds.x + r2Bounds.width &&
           r1Bounds.x + r1Bounds.width > r2Bounds.x &&
           r1Bounds.y < r2Bounds.y + r2Bounds.height &&
           r1Bounds.y + r1Bounds.height > r2Bounds.y;
}

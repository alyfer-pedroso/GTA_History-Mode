const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const spriteRunRight = "./img/runRight (1).png";
const spriteRunLeft = "./img/runLeft (1).png";
const spriteIdleRight = "./img/idleRight (1).png";
const spriteIdleLeft = "./img/idleLeft (1).png";
const spriteJumpRight = "./img/jumpRight (1).png";
const spriteJumpLeft = "./img/jumpLeft (1).png";
const spritePlatformRoad = "./img/platformRoadB.png";
const spriteBackground = "/img/background.png";
const spriteBuildings = "/img/hills.png";

canvas.width = 1024;
canvas.height = 574;

class Player {
    constructor() {
        this.position = {
            x: 100,
            y: 200,
        };
        this.velocity = {
            x: 0,
            y: 0,
        };
        this.width = 118;
        this.height = 120;
        this.frames = 0;
        this.sprites = {
            idle: {
                right: createSprite(spriteIdleRight),
                left: createSprite(spriteIdleLeft),
            },
            run: {
                right: createSprite(spriteRunRight),
                left: createSprite(spriteRunLeft),
            },
            jump: {
                right: createSprite(spriteJumpRight),
                left: createSprite(spriteJumpLeft),
            },
        };
        this.currentSprite = this.sprites.idle.right;
        this.canJump = true;
    }

    draw() {
        c.drawImage(this.currentSprite, 236 * this.frames, 0, 236, 240, this.position.x, this.position.y, this.width, this.height);
    }

    animate() {
        this.frames++;
        if (this.frames > 7) {
            this.frames = 0;
        }

        if (!this.canJump) {
            this.frames++;
            if (this.frames > 4) {
                this.frames = 0;
            }
        }
    }
}

class Platform {
    constructor(x, y, image) {
        this.position = {
            x,
            y,
        };
        this.image = image;
        this.width = image.width;
        this.height = image.height;
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y, this.image.width, this.image.height);
    }
}

class GenericObject {
    constructor(x, y, image) {
        this.position = {
            x,
            y,
        };
        this.image = image;
        this.width = image.width;
        this.height = image.height;
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y, this.image.width, this.image.height);
    }
}

// -----------------------------------------------------------------------------------------------

const keys = {
    right: { pressed: false },
    left: { pressed: false },
};
let scrollOffset = 0;

gravity = () => {
    const gravity = 1.5;
    player.position.x += player.velocity.x;
    player.position.y += player.velocity.y;

    if (player.position.y + player.height + player.velocity.y <= canvas.height) {
        player.velocity.y += gravity;
    } else {
        player.velocity.y = 0;
        player.canJump = true;
        if (player.currentSprite == player.sprites.jump.right) {
            player.currentSprite = player.sprites.idle.right;
        } else if (player.currentSprite == player.sprites.jump.left) {
            player.currentSprite = player.sprites.idle.left;
        }
    }
};

playerMoviment = () => {
    if (keys.right.pressed && player.position.x < 400) {
        player.velocity.x = 5;
        if (!player.canJump) {
            player.currentSprite = player.sprites.jump.right;
        } else {
            player.currentSprite = player.sprites.run.right;
        }
    } else if ((keys.left.pressed && player.position.x > 100) || keys.left.pressed && scrollOffset === 0 && player.position.x > 0) {
        player.velocity.x = -5;
        if (!player.canJump) {
            player.currentSprite = player.sprites.jump.left;
        } else {
            player.currentSprite = player.sprites.run.left;
        }
    } else {
        player.velocity.x = 0;

        if (keys.right.pressed) {
            if (!player.canJump) {
                player.currentSprite = player.sprites.jump.right;
            } else {
                player.currentSprite = player.sprites.run.right;
            }
            platforms.forEach((platform) => {
                platform.position.x -= 5;
            });
            genericObjects.forEach((genericObject) => {
                genericObject.position.x -= 3;
            });
            scrollOffset += 5
        } else if (keys.left.pressed && scrollOffset > 0) {
            if (!player.canJump) {
                player.currentSprite = player.sprites.jump.left;
            } else {
                player.currentSprite = player.sprites.run.left;
            }
            platforms.forEach((platform) => {
                platform.position.x += 5;
            });
            genericObjects.forEach((genericObject) => {
                genericObject.position.x += 3;
            });
            scrollOffset -= 5
        }
    }
};

playerJump = () => {
    if (player.canJump) {
        player.velocity.y -= 25;
        player.canJump = false;
    }

    if (player.currentSprite == player.sprites.idle.right) {
        player.currentSprite = player.sprites.jump.right;
    } else if (player.currentSprite == player.sprites.idle.left) {
        player.currentSprite = player.sprites.jump.left;
    }
};

playerCollision = () => {
    //player with platform
    platforms.forEach((platform) => {
        platform.draw();
        if (player.position.y + player.height <= platform.position.y + 35 && player.position.y + player.height + player.velocity.y >= platform.position.y + 35 && player.position.x + player.width >= platform.position.x && player.position.x <= platform.position.x + platform.width) {
            player.velocity.y = 0;
            player.canJump = true;
            if (player.currentSprite == player.sprites.jump.right) {
                player.currentSprite = player.sprites.idle.right;
            } else if (player.currentSprite == player.sprites.jump.left) {
                player.currentSprite = player.sprites.idle.left;
            }
        }
    });
};

createSprite = (imgSrc) => {
    image = new Image();
    image.src = imgSrc;
    return image;
};

playerFrames = setInterval(() => {
    player.animate();
}, 60);

platformRoad = createSprite(spritePlatformRoad);

let player = new Player();

let platforms = [
    new Platform(
        -1, 
        374, 
        platformRoad
        ), 
    new Platform(
        platformRoad.width - 2, 
        374, 
        platformRoad
    ), 
    new Platform(
        platformRoad.width * 2 - 2, 
        374, 
        platformRoad
    )
];

let genericObjects = [
    new GenericObject(
        -1,
        -200,
        createSprite(spriteBackground)
    ),
    new GenericObject(
        -1,
        -210,
        createSprite(spriteBuildings)
    )
]

// -----------------------------------------------------------------------------------------------

function start() {}

function update() {
    requestAnimationFrame(update);
    c.clearRect(0, 0, canvas.width, canvas.height);
    gravity();

    genericObjects.forEach((genericObject)=> {
        genericObject.draw()
    })
    platforms.forEach((platform) => {
        platform.draw();
    });

    playerCollision();
    player.draw();
    playerMoviment();
}

// -----------------------------------------------------------------------------------------------

addEventListener("keydown", ({ key }) => {
    switch (key) {
        case "w":
            playerJump();
            break;

        case "ArrowUp":
            playerJump();
            break;

        case " ":
            playerJump();
            break;

        case "a":
            keys.left.pressed = true;
            player.currentSprite = player.sprites.run.left;
            break;

        case "d":
            keys.right.pressed = true;
            player.currentSprite = player.sprites.run.right;
            break;

        case "ArrowLeft":
            keys.left.pressed = true;
            player.currentSprite = player.sprites.run.left;
            break;

        case "ArrowRight":
            keys.right.pressed = true;
            player.currentSprite = player.sprites.run.right;
            break;
    }
});
addEventListener("keyup", ({ key }) => {
    switch (key) {
        case "a":
            keys.left.pressed = false;
            player.currentSprite = player.sprites.idle.left;
            break;

        case "d":
            keys.right.pressed = false;
            player.currentSprite = player.sprites.idle.right;
            break;

        case "ArrowLeft":
            keys.left.pressed = false;
            player.currentSprite = player.sprites.idle.left;
            break;

        case "ArrowRight":
            keys.right.pressed = false;
            player.currentSprite = player.sprites.idle.right;
            break;
    }
});
window.setInterval(update(), 1000 / 60);

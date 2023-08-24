// inGAME PROPERTIES
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 574;

let isGame = false;

// PLAYER
const spriteRunRight = "./img/runRight (1).png";
const spriteRunLeft = "./img/runLeft (1).png";
const spriteIdleRight = "./img/idleRight (1).png";
const spriteIdleLeft = "./img/idleLeft (1).png";
const spriteJumpRight = "./img/jumpRight (1).png";
const spriteJumpLeft = "./img/jumpLeft (1).png";
const keys = {
    right: { pressed: false },
    left: { pressed: false },
};
let control = true;
let playerFrames;
let canTalk;
let player;

// NPC
const maverickIdleRight = "./img/maverickIdleRight (1).png";

// SCENE
const spritePlatformRoad = "./img/platformRoadB.png";
const spriteBackground = "./img/background.png";
const spriteBuildings = "./img/hills.png";
const spriteCondos = "./img/condosLuxury (1).png";
let scrollOffset = 0;
let platforms;
let genericObjects;
let isFirtScene = false;

// GAME HTML PROPERTIES
const $menu = document.querySelector(".menu");
const $menu_btn = document.querySelector(".menu-btn");
const $epilogue = document.querySelector(".epilogue");
const $sounds = document.querySelectorAll("audio");
const $decision = document.querySelector(".decision");
const $decision_opt = $decision.querySelectorAll("div");
const vagas = $decision_opt[0].querySelectorAll(".btns");
let vaga1 = false;
let vaga2 = false;

$decision.style.display = "none";
$decision_opt.forEach((opts) => {
    opts.style.display = "none";
});

// DIALOGUE
const dialogueBox = document.querySelector(".dialogue");
const dialogueIMG = document.querySelector(".dialogue img");
const dialogueP = document.querySelector(".dialogue p");
let isTalking = false;
let npcs;
let daniel;

function typeWritter(text, el) {
    const textArr = text.innerHTML.split("");
    el.innerHTML = "";
    textArr.forEach((char, i) => {
        setTimeout(() => {
            el.innerHTML += char;
        }, 75 * i);
    });
}

const npc1_speech = {
    speech_1: "Ricardo, boa tarde. Como eu te disse no telefone, você foi escolhido para entrar na empresa, mas precisa fazer uma decisão.",
    speech_2: "É o seguinte: temos duas vagas aqui na empresa, VAGA A: salário é maior, mas com menos benefícios. VAGA B: salário menor, mas com mais benefícios.",
    speech_3: "Na VAGA A  • Salário de R$ 4.000  • Vale-refeição  • Vale-transporte  • 9 horas de trabalho",
    speech_4: "Na VAGA B  • Salário de R$ 2.000  • Vale-refeição  • Vale-transporte  • Plano de saúde  • 8 horas de trabalho",
    speech_5: "Eae, qual você prefere?",
};
//-----------------------------------------------------------------------------------------------

function game() {
    // $menu_btn.addEventListener("click", () => {
    //     $menu_btn.removeEventListener;
    //     $menu.style.display = "none";
    //     $epilogue.style.display = "block";
    //     $sounds[0].play();
    //     typeWritter($epilogue.querySelector("p"), $epilogue.querySelector("p"));
    //     setTimeout(() => {
    //         callGame();
    //     }, 28000);
    // });

    callGame();
    function callGame() {
        isGame = true;
        $menu.style.display = "none";
        $epilogue.style.display = "none";

        class Player {
            constructor() {
                this.position = {
                    x: 100,
                    y: 288.5,
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

                this.speech = {
                    daniel: {
                        speech_1: "Boa tarde, Daniel. Que decisão seria essa? Isso não foi comentado na entrevista...",
                        speech_2: "hmm...",
                    },
                };
            }

            draw() {
                c.drawImage(this.currentSprite, 236 * this.frames, 0, 236, 240, this.position.x, this.position.y, this.width, this.height);
            }

            moviment() {
                if (keys.right.pressed && player.position.x < 400) {
                    this.velocity.x = 5;
                    if (!this.canJump) {
                        this.currentSprite = this.sprites.jump.right;
                    } else {
                        this.currentSprite = this.sprites.run.right;
                    }
                } else if ((keys.left.pressed && this.position.x > 100) || (keys.left.pressed && scrollOffset === 0 && this.position.x > 0)) {
                    this.velocity.x = -5;
                    if (!this.canJump) {
                        this.currentSprite = this.sprites.jump.left;
                    } else {
                        this.currentSprite = this.sprites.run.left;
                    }
                } else {
                    this.velocity.x = 0;

                    if ((keys.right.pressed && scrollOffset < 2300 && isFirtScene) || (keys.right.pressed && !isFirtScene)) {
                        if (!this.canJump) {
                            this.currentSprite = this.sprites.jump.right;
                        } else {
                            this.currentSprite = this.sprites.run.right;
                        }
                        platforms.forEach((platform) => {
                            platform.position.x -= 5;
                        });
                        npcs.forEach((npc) => {
                            npc.position.x -= 5;
                        });
                        genericObjects.forEach((genericObject) => {
                            genericObject.position.x -= 3;
                        });
                        scrollOffset += 5;
                    } else if (keys.left.pressed && scrollOffset > 0) {
                        if (!this.canJump) {
                            this.currentSprite = this.sprites.jump.left;
                        } else {
                            this.currentSprite = this.sprites.run.left;
                        }
                        platforms.forEach((platform) => {
                            platform.position.x += 5;
                        });
                        npcs.forEach((npc) => {
                            npc.position.x += 5;
                        });
                        genericObjects.forEach((genericObject) => {
                            genericObject.position.x += 3;
                        });
                        scrollOffset -= 5;
                    }
                }
            }

            gravity() {
                const gravity = 1.5;
                this.position.x += this.velocity.x;
                this.position.y += this.velocity.y;

                if (this.position.y + this.height + this.velocity.y <= canvas.height) {
                    this.velocity.y += gravity;
                } else {
                    // this.canJump = true;
                    if (this.currentSprite == this.sprites.jump.right) {
                        this.currentSprite = this.sprites.idle.right;
                    } else if (this.currentSprite == this.sprites.jump.left) {
                        this.currentSprite = this.sprites.idle.left;
                    }
                }
            }

            jump() {
                if (this.canJump) {
                    this.velocity.y -= 25;
                    this.canJump = false;
                }

                if (this.currentSprite == this.sprites.idle.right) {
                    this.currentSprite = this.sprites.jump.right;
                } else if (this.currentSprite == this.sprites.idle.left) {
                    this.currentSprite = this.sprites.jump.left;
                }
            }

            collision() {
                //player with platform
                platforms.forEach((platform) => {
                    if (this.position.y + this.height <= platform.position.y + 35 && this.position.y + this.height + this.velocity.y >= platform.position.y + 35 && this.position.x + this.width >= platform.position.x && this.position.x <= platform.position.x + platform.width) {
                        this.velocity.y = 0;
                        this.canJump = true;
                        if (this.currentSprite == this.sprites.jump.right) {
                            this.currentSprite = this.sprites.idle.right;
                        } else if (this.currentSprite == this.sprites.jump.left) {
                            this.currentSprite = this.sprites.idle.left;
                        }
                    }
                });

                //this with Daniel
                if ((this.position.x + this.width >= npcs[0].position.x && this.position.x <= npcs[0].position.x + npcs[0].width && vaga1 == false) || (this.position.x + this.width >= npcs[0].position.x && this.position.x <= npcs[0].position.x + npcs[0].width && vaga2 == false)) {
                    isTalking = true;
                    console.log(isTalking);
                } else {
                    isTalking = false;
                }

                if (this.position.y > canvas.height) {
                    firstScene();
                }
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

            interact() {
                if (isTalking) {
                    //player with Daniel
                    if (this.position.x + this.width >= npcs[0].position.x && this.position.x <= npcs[0].position.x + npcs[0].width) {
                        if (daniel == true) {
                            clearInterval(canTalk);
                            control = false;
                            daniel = false;
                            this.currentSprite = this.sprites.idle.right;
                            keys.left.pressed = false;
                            keys.right.pressed = false;
                            dialogueIMG.src = "./img/DanielTalk.png";
                            speech(npc1_speech.speech_1, dialogueP);
                            setTimeout(() => {
                                dialogueIMG.src = "./img/RicardoTalk.png";
                                speech(this.speech.daniel.speech_1, dialogueP);
                            }, 7500);
                            setTimeout(() => {
                                dialogueIMG.src = "./img/DanielTalk.png";
                                speech(npc1_speech.speech_2, dialogueP);
                            }, 14000);
                            setTimeout(() => {
                                dialogueIMG.src = "./img/RicardoTalk.png";
                                speech(this.speech.daniel.speech_2, dialogueP);
                            }, 23000);
                            setTimeout(() => {
                                dialogueIMG.src = "./img/DanielTalk.png";
                                speech(npc1_speech.speech_3, dialogueP);
                            }, 25000);
                            setTimeout(() => {
                                dialogueIMG.src = "./img/DanielTalk.png";
                                speech(npc1_speech.speech_4, dialogueP);
                            }, 32000);
                            setTimeout(() => {
                                dialogueIMG.src = "./img/DanielTalk.png";
                                speech(npc1_speech.speech_5, dialogueP);
                            }, 41000);
                            setTimeout(() => {
                                $decision.style.display = "flex";
                                $decision_opt[0].style.display = "flex";

                                vagas[0].addEventListener("click", () => {
                                    vaga1 = true;
                                    $decision.style.display = "none";
                                    $decision_opt.forEach((opts) => {
                                        opts.style.display = "none";
                                    });
                                    vagas.forEach((btn) => {
                                        btn.removeEventListener;
                                    });
                                    daniel = false;
                                    canTalk = setInterval(() => {
                                        player.interact();
                                    }, 100);
                                });
                                vagas[1].addEventListener("click", () => {
                                    vaga2 = true;
                                    $decision.style.display = "none";
                                    $decision_opt.forEach((opts) => {
                                        opts.style.display = "none";
                                    });
                                    vagas.forEach((btn) => {
                                        btn.removeEventListener;
                                    });
                                    daniel = false;
                                    canTalk = setInterval(() => {
                                        player.interact();
                                    }, 100);
                                });
                            }, 44500);
                        } else {
                            control = true;
                            dialogueBox.style.display = "none";
                            dialogueP.innerHTML = "";
                            isTalking = false;
                        }
                    }
                }
            }
        }

        class NPC {
            constructor(x, y, width, height, sprR, sprL, sx, sy, frame) {
                this.position = {
                    x,
                    y,
                };
                this.width = width;
                this.height = height;
                this.frames = 0;
                this.frame = frame;
                this.sx = sx;
                this.sy = sy;
                this.sprites = {
                    idle: {
                        right: createSprite(sprR),
                        left: createSprite(sprL),
                    },
                };
                this.currentSprite = this.sprites.idle.left;
            }

            draw() {
                c.drawImage(this.currentSprite, this.sx * this.frames, 0, this.sx, this.sy, this.position.x, this.position.y, this.width, this.height);
            }

            animate() {
                this.frames++;
                if (this.frames > this.frame) {
                    this.frames = 0;
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
                c.drawImage(this.image, this.position.x, this.position.y);
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
                c.drawImage(this.image, this.position.x, this.position.y);
            }
        }

        // -----------------------------------------------------------------------------------------------

        speech = (text, el) => {
            el.innerHTML = "";
            dialogueBox.style.display = "flex";
            const textArr = text.split("");
            textArr.forEach((char, i) => {
                setTimeout(() => {
                    el.innerHTML += char;
                }, 55 * i);
            });
        };

        createSprite = (imgSrc) => {
            image = new Image();
            image.src = imgSrc;
            return image;
        };

        // -----------------------------------------------------------------------------------------------

        function start() {
            firstScene();
        }

        function update() {
            requestAnimationFrame(update);
            c.fillStyle = "white";
            c.fillRect(0, 0, canvas.width, canvas.height);

            genericObjects.forEach((genericObject) => {
                genericObject.draw();
            });
            platforms.forEach((platform) => {
                platform.draw();
            });

            npcs.forEach((npc) => {
                npc.draw();
            });

            player.gravity();
            player.collision();
            player.moviment();
            player.draw();

            if (isTalking == false) {
                control = true;
                dialogueBox.style.display = "none";
                dialogueP.innerHTML = "";
            }
        }

        // -----------------------------------------------------------------------------------------------

        function firstScene() {
            daniel = true;
            isFirtScene = true;
            scrollOffset = 0;
            platformRoad = createSprite(spritePlatformRoad);

            player = new Player();
            platforms = [new Platform(-1, 374, platformRoad), new Platform(platformRoad.width - 2, 374, platformRoad), new Platform(platformRoad.width * 2 - 2, 374, platformRoad), new Platform(platformRoad.width * 2 + 50, -490, createSprite(spriteCondos)), new Platform(platformRoad.width * 3 - 2, 374, platformRoad), new Platform(platformRoad.width * 4 - 2, 374, platformRoad), new Platform(platformRoad.width * 5 - 2, 374, platformRoad)];
            npcs = [new NPC(platformRoad.width * 2 + 250, 245, 120, 164, maverickIdleRight, maverickIdleRight, 240, 328, 5)];

            genericObjects = [new GenericObject(-1, -200, createSprite(spriteBackground)), new GenericObject(-1, -210, createSprite(spriteBuildings))];

            playerFrames = setInterval(() => {
                player.animate();
                npcs.forEach((npc) => {
                    npc.animate();
                });
            }, 60);

            canTalk = setInterval(() => {
                player.interact();
            }, 100);
        }

        // -----------------------------------------------------------------------------------------------

        addEventListener("keydown", ({ key }) => {
            if (control) {
                switch (key) {
                    case "w":
                        player.jump();
                        break;

                    case "ArrowUp":
                        player.jump();
                        break;

                    case " ":
                        player.jump();
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
            }
        });
        addEventListener("keyup", ({ key }) => {
            if (control) {
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
            }
        });
        window.addEventListener("load", start());
        window.setInterval(update(), 1000 / 60);
    }
}
game();

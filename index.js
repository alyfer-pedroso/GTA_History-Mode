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
let playerFrames = null;
let player = null;

// NPC
const maverickIdleRight = "./img/maverickIdleRight (1).png";
const door = "./img/doorBank (2).png";

// SCENE
const spritePlatformRoad = "./img/platformRoadB.png";
const spriteBackground = "./img/background.png";
const spriteBuildings = "./img/hills.png";
const spriteCondos = "./img/condosLuxury (1).png";
const bank = "./img/bank (1).png";
let scrollOffset = 0;
let platforms = null;
let genericObjects = null;
let isFirtScene = false;
let isSecScene = false;
let isThirdScene = false;

// GAME HTML PROPERTIES
const $menu = document.querySelector(".menu");
const $menu_btn = document.querySelector(".menu-btn");
const $textScene = document.querySelector(".textScene");
const $sounds = document.querySelectorAll("audio");
const $decision = document.querySelector(".decision");
const $decision_opt = $decision.querySelectorAll("div");
const vagas = $decision_opt[0].querySelectorAll(".btns");
const contas = $decision_opt[1].querySelectorAll(".btns");
let vaga1 = false;
let vaga2 = false;
let contaCo = false;
let contaSa = false;
let contaPo = false;

$decision.style.display = "none";
$decision_opt.forEach((opts) => {
    opts.style.display = "none";
});

// DIALOGUE
let dialogueBox = document.querySelector(".dialogue");
const dialogueIMG = document.querySelector(".dialogue img");
let dialogueP = document.querySelector(".dialogue p");
let isInteract = false;
let npcs = null;
let daniel = false;
let banco = false;

function typeWritter(text, el) {
    const textArr = text.split("");
    el.innerHTML = "";
    textArr.forEach((char, i) => {
        setTimeout(() => {
            el.innerHTML += char;
        }, 75 * i);
    });
}

const textForScene = {
    epilogue: "Você vai assumir o papel de um jovem adulto chamado Ricardo, que está prestes a enfrentar os desafios do mundo financeiro após sair da faculdade. O objetivo é ajudar Ricardo a tomar decisões sábias e informadas sobre assuntos relacionados à educação financeira, desde a abertura da primeira conta bancária até o investimento em ações e planejamento para o futuro.",
    scene_2: "Um mês se passou e Ricardo recebeu seu primeiro salário...",
};

const npc1_speech = {
    speech_1: "Ricardo, boa tarde. Como eu te disse no telefone, você foi escolhido para entrar na empresa, mas precisa fazer uma decisão.",
    speech_2: "É o seguinte: temos duas vagas aqui na empresa, VAGA A: salário é maior, mas com menos benefícios. VAGA B: salário menor, mas com mais benefícios.",
    speech_3: "Na VAGA A  • Salário de R$ 3.250  • Vale-refeição  • Vale-transporte  • 10 horas de trabalho",
    speech_4: "Na VAGA B  • Salário de R$ 2.000  • Vale-refeição  • Vale-transporte  • Plano de saúde  • 8 horas de trabalho",
    speech_5: "Eae, qual você prefere?",
    speech_6: "Sábia decisão, Ricardo.",
};

//-----------------------------------------------------------------------------------------------

$menu_btn.addEventListener("click", () => {
    $menu_btn.removeEventListener;
    $menu.style.display = "none";
    $textScene.style.display = "block";
    $sounds[0].play();
    typeWritter(textForScene.epilogue, $textScene.querySelector("p"));
    setTimeout(() => {
        callGame();
    }, 28000);
    setTimeout(() => {
        $sounds[1].play();
    }, 307800);
});

// callGame();
function callGame() {
    isGame = true;
    $menu.style.display = "none";
    $textScene.style.display = "none";

    class Player {
        constructor(x, y) {
            this.position = {
                x: x,
                y: y,
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
                    speech_3: "Bom, eu ja vou indo. Preciso passar no banco aqui da esquina para criar a minha conta. Até amanhã!",
                    speech_vaga1: "Um salário maior é a melhor opção para meu início de carreira. Eu escolho a oferta com o salário mais alto e menos benefícios.",
                    speech_vaga2: "Eu opto pela oferta que oferece um salário menor, mas com benefícios mais abrangentes. Estou ansioso para equilibrar minha vida pessoal e profissional de maneira mais saudável.",
                },
                banco: {
                    speech_1: "Cheguei! Aqui é o banco Santo André.",
                    speech_2: "Agora preciso decidir que tipo de conta bancária vou abrir.",
                    contaCo_1: "Bom, uma conta corrente oferece uma série de vantagens financeiras, incluindo acesso fácil ao dinheiro através de saques, pagamentos e transferências, além de maior segurança em comparação com dinheiro em espécie.",
                    contaCo_2: "Com cartões de débito e cheques, permite compras e transações convenientes, enquanto o controle financeiro é aprimorado por meio de extratos e acesso online.",
                    contaCo_3: "É útil para receber salários, gerenciar múltiplas contas, acessar serviços bancários diversos e construir um histórico financeiro. No entanto, é importante estar ciente das possíveis taxas e encargos associados à conta.",
                    contaSa_1: "Uma conta salarial apresenta vantagens como o recebimento direto e seguro do salário, acesso fácil aos fundos através de cartão de débito, possibilidade de efetuar pagamentos e transferências, controle financeiro por meio de extratos detalhados e agilidade nos processos. ",
                    contaSa_2: "Com isenção de tarifas em muitos casos, a conta salarial oferece comodidade ao receber depósitos diretos, acesso a benefícios do empregador, facilidade na comprovação de renda e foco na economia, além de permitir acesso a serviços bancários e investimentos.",
                    contaSa_3: "Ela é uma solução prática para gerir eficazmente o salário e facilitar várias operações financeiras do cotidiano.",
                    contaPo_1: "Uma conta poupança oferece benefícios como rentabilidade modesta, segurança, disciplina financeira e acesso controlado aos fundos, tornando-a uma opção atrativa para economizar dinheiro e alcançar metas financeiras específicas.",
                    contaPo_2: "Embora as taxas de juros sejam geralmente baixas, a conta poupança proporciona uma alternativa segura para manter dinheiro em casa, com a vantagem adicional de serviços bancários, planejamento financeiro e proteção contra inflação.",
                },
            };
        }

        draw() {
            c.drawImage(this.currentSprite, 236 * this.frames, 0, 236, 240, this.position.x, this.position.y, this.width, this.height);
        }

        moviment() {
            if (keys.right.pressed && player.position.x < 400) {
                this.velocity.x = 5;
                $sounds[2].play();
                if (!this.canJump) {
                    this.currentSprite = this.sprites.jump.right;
                } else {
                    this.currentSprite = this.sprites.run.right;
                }
            } else if ((keys.left.pressed && this.position.x > 100) || (keys.left.pressed && scrollOffset === 0 && this.position.x > 0)) {
                this.velocity.x = -5;
                $sounds[2].play();
                if (!this.canJump) {
                    this.currentSprite = this.sprites.jump.left;
                } else {
                    this.currentSprite = this.sprites.run.left;
                }
            } else {
                this.velocity.x = 0;
                $sounds[2].pause();

                if ((keys.right.pressed && scrollOffset < 5340 && isFirtScene) || (keys.right.pressed && !isFirtScene)) {
                    $sounds[2].play();
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
                    $sounds[2].play();
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
                $sounds[3].play();
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

            if (this.position.y > canvas.height) {
                start();
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
            //player with Daniel
            if (this.position.x + this.width >= npcs[0].position.x && this.position.x <= npcs[0].position.x + npcs[0].width) {
                if (daniel == true) {
                    isInteract = true;
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
                            setTimeout(() => {
                                dialogueIMG.src = "./img/RicardoTalk.png";
                                speech(this.speech.daniel.speech_vaga1, dialogueP);
                            }, 1000);
                            setTimeout(() => {
                                dialogueIMG.src = "./img/DanielTalk.png";
                                speech(npc1_speech.speech_6, dialogueP);
                            }, 11000);
                            setTimeout(() => {
                                dialogueIMG.src = "./img/RicardoTalk.png";
                                speech(this.speech.daniel.speech_3, dialogueP);
                            }, 14500);
                            setTimeout(() => {
                                daniel = false;
                                isInteract = false;
                            }, 21000);
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
                            setTimeout(() => {
                                dialogueIMG.src = "./img/RicardoTalk.png";
                                speech(this.speech.daniel.speech_vaga2, dialogueP);
                            }, 1000);
                            setTimeout(() => {
                                dialogueIMG.src = "./img/DanielTalk.png";
                                speech(npc1_speech.speech_6, dialogueP);
                            }, 12000);
                            setTimeout(() => {
                                dialogueIMG.src = "./img/RicardoTalk.png";
                                speech(this.speech.daniel.speech_3, dialogueP);
                            }, 15000);
                            setTimeout(() => {
                                daniel = false;
                                isInteract = false;
                            }, 21500);
                        });
                    }, 44500);
                } else {
                    control = true;
                    dialogueBox.style.display = "none";
                    dialogueP.innerHTML = "";
                }
            }

            if (this.position.x + this.width - 100 >= npcs[1].position.x && this.position.x <= npcs[1].position.x + npcs[1].width) {
                if (banco == true) {
                    isInteract = true;
                    control = false;
                    this.currentSprite = this.sprites.idle.right;
                    keys.left.pressed = false;
                    keys.right.pressed = false;
                    dialogueIMG.src = "./img/RicardoTalk.png";
                    speech(this.speech.banco.speech_1, dialogueP);
                    setTimeout(() => {
                        speech(this.speech.banco.speech_2, dialogueP);
                    }, 3000);
                    setTimeout(() => {
                        $decision.style.display = "flex";
                        $decision_opt[1].style.display = "block";
                        setTimeout(() => {
                            $decision_opt[1].style.opacity = 1;
                            dialogueBox.style.display = "none";
                            dialogueP.innerHTML = "";
                        }, 100);

                        contas[0].addEventListener("click", () => {
                            contaCo = true;
                            setTimeout(() => {
                                $decision_opt[1].style.opacity = 0;
                            }, 100);
                            setTimeout(() => {
                                $decision.style.display = "none";
                                $decision_opt.forEach((opts) => {
                                    opts.style.display = "none";
                                });
                                contas.forEach((btn) => {
                                    btn.removeEventListener;
                                });
                            }, 2000);
                            setTimeout(() => {
                                speech(this.speech.banco.contaCo_1, dialogueP);
                            }, 3500);
                            setTimeout(() => {
                                speech(this.speech.banco.contaCo_2, dialogueP);
                            }, 18500);
                            setTimeout(() => {
                                speech(this.speech.banco.contaCo_3, dialogueP);
                            }, 30000);
                            setTimeout(() => {
                                banco = false;
                                isInteract = false;
                                secondScene();
                            }, 44000);
                        });

                        contas[1].addEventListener("click", () => {
                            contaSa = true;
                            setTimeout(() => {
                                $decision_opt[1].style.opacity = 0;
                            }, 100);
                            setTimeout(() => {
                                $decision.style.display = "none";
                                $decision_opt.forEach((opts) => {
                                    opts.style.display = "none";
                                });
                                contas.forEach((btn) => {
                                    btn.removeEventListener;
                                });
                            }, 2000);
                            setTimeout(() => {
                                speech(this.speech.banco.contaSa_1, dialogueP);
                            }, 3500);
                            setTimeout(() => {
                                speech(this.speech.banco.contaSa_2, dialogueP);
                            }, 19000);
                            setTimeout(() => {
                                speech(this.speech.banco.contaSa_3, dialogueP);
                            }, 33500);
                            setTimeout(() => {
                                banco = false;
                                isInteract = false;
                                secondScene();
                            }, 40500);
                        });

                        contas[2].addEventListener("click", () => {
                            contaPo = true;
                            setTimeout(() => {
                                $decision_opt[1].style.opacity = 0;
                            }, 100);
                            setTimeout(() => {
                                $decision.style.display = "none";
                                $decision_opt.forEach((opts) => {
                                    opts.style.display = "none";
                                });
                                contas.forEach((btn) => {
                                    btn.removeEventListener;
                                });
                            }, 2000);
                            setTimeout(() => {
                                speech(this.speech.banco.contaPo_1, dialogueP);
                            }, 3500);
                            setTimeout(() => {
                                speech(this.speech.banco.contaPo_2, dialogueP);
                            }, 19000);
                            setTimeout(() => {
                                banco = false;
                                isInteract = false;
                                secondScene();
                            }, 32000);
                        });
                    }, 7000);
                } else {
                    control = true;
                    dialogueBox.style.display = "none";
                    dialogueP.innerHTML = "";
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

    function speech(text, el) {
        el.innerHTML = "";
        dialogueBox.style.display = "flex";
        const textArr = text.split("");
        textArr.forEach((char, i) => {
            setTimeout(() => {
                el.innerHTML += char;
                $sounds[4].play();
            }, 55 * i);
        });
        setTimeout(() => {
            $sounds[4].pause();
        }, text.length * 55);
    }

    function createSprite(imgSrc) {
        image = new Image();
        image.src = imgSrc;
        return image;
    }

    // -----------------------------------------------------------------------------------------------

    function loop() {
        update();
        render();
    }

    function start() {
        firstScene();
    }

    function update() {
        if (!isInteract) {
            player.interact();
        }
    }

    function render() {
        // requestAnimationFrame(render);
        c.fillStyle = "white";
        c.fillRect(0, 0, canvas.width, canvas.height);

        if (isGame) {
            genericObjects.forEach((genericObject) => {
                genericObject.draw();
            });
            platforms.forEach((platform) => {
                platform.draw();
            });

            npcs.forEach((npc) => {
                npc.draw();
            });
            player.draw();
            player.gravity();
            player.collision();
            player.moviment();
        }
    }

    // -----------------------------------------------------------------------------------------------

    function firstScene() {
        daniel = true;
        banco = true;
        isFirtScene = true;
        scrollOffset = 0;
        platformRoad = createSprite(spritePlatformRoad);

        player = new Player(0, 280);

        platforms = [new Platform(-1, 374, platformRoad), new Platform(platformRoad.width - 2, 374, platformRoad), new Platform(platformRoad.width * 2 - 2, 374, platformRoad), new Platform(platformRoad.width * 3 - 2, 374, platformRoad), new Platform(platformRoad.width * 4 - 2, 374, platformRoad), new Platform(platformRoad.width * 5 - 2, 374, platformRoad), new Platform(platformRoad.width * 6 - 2, 374, platformRoad), new Platform(platformRoad.width * 7 - 2, 374, platformRoad), new Platform(platformRoad.width * 8 - 2, 374, platformRoad), new Platform(platformRoad.width * 9 - 2, 374, platformRoad), new Platform(platformRoad.width * 10 - 2, 374, platformRoad), new Platform(platformRoad.width * 2 + 50, -490, createSprite(spriteCondos)), new Platform(platformRoad.width * 2 + 3500, -458, createSprite(bank))];

        npcs = [new NPC(platformRoad.width * 2 + 250, 245, 120, 164, maverickIdleRight, maverickIdleRight, 240, 328, 5), new NPC(platformRoad.width * 2 + 3832, 52, 256, 252, door, door, 256, 232, 0)];

        genericObjects = [new GenericObject(-1, -200, createSprite(spriteBackground)), new GenericObject(-1, -210, createSprite(spriteBuildings))];
    }

    function secondScene() {
        isFirtScene = false;
        isSecScene = true;
        scrollOffset = 0;
        player = null;
        control = false;
        dialogueBox.style.display = "none";
        dialogueP.innerHTML = "";
        platform = null;
        npcs = null;
        genericObjects = null;
        isGame = false;
        $textScene.style.display = "block";
        typeWritter(textForScene.scene_2, $textScene.querySelector("p"));
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
    start();
    window.setInterval(loop, 1000 / 60);
    if (isGame == true) {
        playerFrames = setInterval(() => {
            player.animate();
            npcs.forEach((npc) => {
                npc.animate();
            });
        }, 60);
    }
}

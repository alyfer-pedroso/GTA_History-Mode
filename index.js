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
const seller = "./img/sellerLeft (1).png";

// SCENE
const spritePlatformRoad = "./img/platformRoadB.png";
const spriteBackground = "./img/background.png";
const spriteBuildings = "./img/hills.png";
const spriteCondos = "./img/condosLuxury (1).png";
const bank = "./img/bank (1).png";
const building1 = "./img/building 1.png";
const building2 = "./img/building 2.png";
let scrollOffset = 0;
let platforms = null;
let genericObjects = null;
let isFirtsScene = false;
let isSecScene = false;
let isThirdScene = false;
let isFourthScene = false;
let isFifthScene = false;
let isSixthScene = false;

// GAME HTML PROPERTIES
const $menu = document.querySelector(".menu");
const $menu_btn = document.querySelector(".menu-btn");
const $textScene = document.querySelector(".textScene");
const $sounds = document.querySelectorAll("audio");
const $decision = document.querySelector(".decision");
const $decision_opt = $decision.querySelectorAll("div");
const vagas = $decision_opt[0].querySelectorAll(".btns");
const contas = $decision_opt[1].querySelectorAll(".btns");
const $playerPlaying = document.querySelector(".playing");
const $painel = document.querySelector(".painel");
const apts = $decision_opt[2].querySelectorAll(".btns");
const bankbtns = $decision_opt[3].querySelectorAll(".btns");
const bankSaldo = $decision_opt[3].querySelector(".bank-main_saldo");
const bankInvestir = $decision_opt[3].querySelector(".bank-main_acoes");
const bankAcoes = document.querySelectorAll(".bank-main_acoes-acoes");
let $money = $painel.querySelector("b");
let vaga1 = false;
let vaga2 = false;
let contaCo = false;
let contaSa = false;
let contaPo = false;
let dpsInvestir = false;

$painel.style.display = "none";
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
let sell = false;

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
    scene_2: "Um mês se passou e Ricardo recebeu seu primeiro salário. Ele está muito feliz...",
    scene_4: "Ricardo percebeu que se manter só no salário do seu trabalho atual não é o suficiente para se manter na vida. Agora ele está em busca de um conselho para iniciar corretamente sua vida financeira e para isso ele vai atrá de um amigo.",
    scene_5: "",
};

const npc1_speech = {
    speech_1: "Ricardo, boa tarde. Como eu te disse no telefone, você foi escolhido para entrar na empresa, mas precisa fazer uma decisão.",
    speech_2: "É o seguinte: temos duas vagas aqui na empresa, VAGA A: salário é maior, mas com menos benefícios. VAGA B: salário menor, mas com mais benefícios.",
    speech_3: "Na VAGA A  • Salário de R$ 3.650  • Vale-refeição  • Vale-transporte  • 10 horas de trabalho",
    speech_4: "Na VAGA B  • Salário de R$ 2.600  • Vale-refeição  • Vale-transporte  • Plano de saúde  • 8 horas de trabalho",
    speech_5: "Eae, qual você prefere?",
    speech_6: "Sábia decisão, Ricardo.",
    speech_7: "Oi, Ricardo. O que faz aqui? Seu expediente de hoje ja acabou.",
    speech_8: "Olha, você poderia investir em ações.",
    speech_9: "Investir em ações envolve comprar uma parte de uma empresa e, potencialmente, lucrar com o crescimento do valor dessa empresa ao longo do tempo.",
    speech_10: "O processo envolve aprender sobre investimentos, escolher uma corretora confiável, pesquisar empresas, abrir uma conta, depositar dinheiro, comprar ações através da plataforma da corretora e monitorar seu desempenho.",
    speech_11: "Tomar decisões informadas com base na análise, diversificar para reduzir riscos e manter-se atualizado são partes essenciais do processo. Lembre-se de que investir em ações tem riscos e requer uma abordagem cuidadosa e educada.",
    speech_12: "Você pode fazer isso através de um banco. Muitos bancos também estão oferecendo serviços de investimento em ações e, integrados também às suas plataformas de aplicativos.",
    speech_13: "Abra o app do banco Santo André aí no seu smartphone.",
    speech_14: "Você acabou de comprar uma ação. Logo se torna um acionista da empresa da qual comprou a ação. Isso significa que você é proprietário de uma parte muito pequena dessa empresa.",
    speech_15: "Como acionista, você terá o direito de acompanhar o desempenho da empresa e tomar decisões relacionadas às suas ações. Isso pode incluir manter as ações a longo prazo, vendê-las em algum momento ou participar de assembleias de acionistas.",
};

const npc2_speech = {
    speech_1: "Boa tarde! Sou eu sim, sou a Julia.",
    speech_2: "O que achou desses imóveis?",
    speech_3: "Claro. O Apartamento da esquerda é mais compacto. Possui  • Aluguel mensal: R$ 1.200  • Depósito de segurança: R$ 1.200  • Despesas de utilidades: R$ 150.",
    speech_4: "O Apartamento da direita já é mais espaçoso. Possui  • Aluguel mensal: R$ 1.800  • Depósito de segurança: R$ 1.500  • Despesas de utilidades: R$ 200.",
    speech_5: "De quanto é sua renda mensal?",
    speech_6: "Negócio fechado! Foi um prazer fazer negócios com o senhor.",
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
    // setTimeout(() => {
    //     $sounds[1].play();
    // }, 307800);
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
                    speech_4: "Oi, Dan. Estou aqui por outra coisa.",
                    speech_5: "Você poderia me dar um conselho financeiro? Estou meio duro na carteira e preciso de ajuda sobre o que eu poderia fazer a mais além desse trabalho.",
                    speech_6: "Insvestir em ações?",
                    speech_7: "UAU! Mas por onde eu posso fazer isso?",
                    speech_8: "CARAMBA! Isso é fantástico, mas o mercado de ações pode ser volátil e envolve riscos. Preciso ter cuidado...",
                    speech_9: "Muito obrigado! Até mais, Dan.",
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
                sobre_apt: {
                    speech_1: "Agora preciso achar um apartamento adequado para mim, mas que caiba no meu orçamento.",
                    speech_2: "",
                    speech_3: "Oi, boa tarde. Você deve ser a proprietaria desses imóveis né? Sou o Ricardo, conversamos por telefone.",
                    speech_4: "Gostei muito dos dois, eles estão em ótimo estado! Poderia me passar novamente os detalhes, por favor?",
                    speech_5: "",
                    speech_6: "",
                    speech_cant: "Vish, vou ter que ficar com o menor, já que economizará no aluguel mensal e no depósito de segurança, além de gastar menos em despesas de utilidades. Só que o espaço é mais limitado né.",
                    speech_can: "Pela minha renda eu consigo alugar qualquer um dos dois. Hum... Qual eu pego?",
                    speech_time: null,
                    speech_apt1: "Com esse apartamento economizarei no aluguel mensal e no depósito de segurança, além de gastar menos em despesas de utilidades. Bom, o espaço vai ser menor.",
                    speech_apt2: "Agora com esse apartamento, eu terei mais espaço, mas o aluguel, o depósito de segurança e as despesas de utilidades serão mais altos.",
                },
            };
        }

        draw() {
            c.drawImage(this.currentSprite, 236 * this.frames, 0, 236, 240, this.position.x, this.position.y, this.width, this.height);
        }

        moviment() {
            if (keys.right.pressed && player.position.x < 400) {
                this.velocity.x = 5;
                $sounds[3].play();
                if (!this.canJump) {
                    this.currentSprite = this.sprites.jump.right;
                } else {
                    this.currentSprite = this.sprites.run.right;
                }
            } else if ((keys.left.pressed && this.position.x > 100) || (keys.left.pressed && scrollOffset === 0 && this.position.x > 0)) {
                this.velocity.x = -5;
                $sounds[3].play();
                if (!this.canJump) {
                    this.currentSprite = this.sprites.jump.left;
                } else {
                    this.currentSprite = this.sprites.run.left;
                }
            } else {
                this.velocity.x = 0;
                $sounds[3].pause();

                if ((keys.right.pressed && scrollOffset < 5340 && isFirtsScene) || (keys.right.pressed && !isFirtsScene && !isThirdScene) || (keys.right.pressed && scrollOffset < 1625 && isThirdScene) || (keys.right.pressed && scrollOffset < 5340 && isFifthScene)) {
                    $sounds[3].play();
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
                    $sounds[3].play();
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
                $sounds[4].play();
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
                if (isFirtsScene) {
                    firstScene();
                } else if (isThirdScene) {
                    thirdScene();
                } else if (isFifthScene) {
                    fifthScene();
                }
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
            if (isFirtsScene) {
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
                                $money.innerHTML = "R$ 3.650";
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
                                $money.innerHTML = "R$ 2.600";
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

                //player with door
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
                                }, 35000);
                            });
                        }, 7000);
                    } else {
                        control = true;
                        dialogueBox.style.display = "none";
                        dialogueP.innerHTML = "";
                    }
                }
            }

            if (isThirdScene) {
                if (this.position.x + this.width >= npcs[0].position.x && this.position.x <= npcs[0].position.x + npcs[0].width) {
                    if (sell == true) {
                        isInteract = true;
                        control = false;
                        this.currentSprite = this.sprites.idle.right;
                        keys.left.pressed = false;
                        keys.right.pressed = false;
                        setTimeout(() => {
                            dialogueIMG.src = "./img/RicardoTalk.png";
                            speech(this.speech.sobre_apt.speech_3, dialogueP);
                        }, 1000);
                        setTimeout(() => {
                            dialogueIMG.src = "./img/SellerTalk.png";
                            speech(npc2_speech.speech_1, dialogueP);
                        }, 10000);
                        setTimeout(() => {
                            dialogueIMG.src = "./img/SellerTalk.png";
                            speech(npc2_speech.speech_2, dialogueP);
                        }, 13000);
                        setTimeout(() => {
                            dialogueIMG.src = "./img/RicardoTalk.png";
                            speech(this.speech.sobre_apt.speech_4, dialogueP);
                        }, 16000);
                        setTimeout(() => {
                            dialogueIMG.src = "./img/SellerTalk.png";
                            speech(npc2_speech.speech_3, dialogueP);
                        }, 23000);
                        setTimeout(() => {
                            dialogueIMG.src = "./img/SellerTalk.png";
                            speech(npc2_speech.speech_4, dialogueP);
                        }, 33000);
                        setTimeout(() => {
                            dialogueIMG.src = "./img/SellerTalk.png";
                            speech(npc2_speech.speech_5, dialogueP);
                        }, 43000);
                        setTimeout(() => {
                            dialogueIMG.src = "./img/RicardoTalk.png";
                            speech(this.speech.sobre_apt.speech_5, dialogueP);
                        }, 46000);
                        setTimeout(() => {
                            dialogueIMG.src = "./img/RicardoTalk.png";
                            speech(this.speech.sobre_apt.speech_6, dialogueP);
                        }, 50000);
                        setTimeout(() => {
                            $decision.style.display = "flex";
                            $decision_opt[2].style.display = "block";

                            apts[0].addEventListener("click", () => {
                                if ($money.textContent == "R$ 2.600") {
                                    $money.innerHTML = "R$ 50";
                                } else if ($money.textContent == "R$ 3.650") {
                                    $money.innerHTML = "R$ 1.100";
                                }
                                $sounds[6].play();
                                $money.style.color = "orange";
                                $decision.style.display = "none";
                                $decision_opt[2].style.display = "none";

                                dialogueIMG.src = "./img/SellerTalk.png";
                                speech(npc2_speech.speech_6, dialogueP);
                                setTimeout(() => {
                                    dialogueIMG.src = "./img/RicardoTalk.png";
                                    speech(this.speech.sobre_apt.speech_apt1, dialogueP);
                                }, 5000);
                                setTimeout(() => {
                                    control = false;
                                    dialogueBox.style.display = "none";
                                    dialogueP.innerHTML = "";
                                    sell = false;
                                    isInteract = false;
                                    fourthScene();
                                }, 15000);
                            });

                            apts[1].addEventListener("click", () => {
                                $sounds[6].play();
                                $money.innerHTML = "R$ 150";
                                $money.style.color = "orange";
                                $decision.style.display = "none";
                                $decision_opt[2].style.display = "none";

                                dialogueIMG.src = "./img/SellerTalk.png";
                                speech(npc2_speech.speech_6, dialogueP);
                                setTimeout(() => {
                                    dialogueIMG.src = "./img/RicardoTalk.png";
                                    speech(this.speech.sobre_apt.speech_apt2, dialogueP);
                                }, 5000);
                                setTimeout(() => {
                                    control = false;
                                    dialogueBox.style.display = "none";
                                    dialogueP.innerHTML = "";
                                    sell = false;
                                    isInteract = false;
                                    fourthScene();
                                }, 14000);
                            });
                        }, this.speech.sobre_apt.speech_time);
                    }
                }
            }

            if (isFifthScene) {
                if (this.position.x + this.width >= npcs[0].position.x && this.position.x <= npcs[0].position.x + npcs[0].width) {
                    if (daniel == true) {
                        isInteract = true;
                        control = false;

                        this.currentSprite = this.sprites.idle.right;
                        keys.left.pressed = false;
                        keys.right.pressed = false;
                        setTimeout(() => {
                            dialogueIMG.src = "./img/DanielTalk.png";
                            speech(npc1_speech.speech_7, dialogueP);
                        }, 1000);
                        setTimeout(() => {
                            dialogueIMG.src = "./img/RicardoTalk.png";
                            speech(player.speech.daniel.speech_4, dialogueP);
                        }, 7000);
                        setTimeout(() => {
                            dialogueIMG.src = "./img/RicardoTalk.png";
                            speech(player.speech.daniel.speech_5, dialogueP);
                        }, 10000);
                        setTimeout(() => {
                            dialogueIMG.src = "./img/DanielTalk.png";
                            speech(npc1_speech.speech_8, dialogueP);
                        }, 20000);
                        setTimeout(() => {
                            dialogueIMG.src = "./img/RicardoTalk.png";
                            speech(player.speech.daniel.speech_6, dialogueP);
                        }, 24000);
                        setTimeout(() => {
                            dialogueIMG.src = "./img/DanielTalk.png";
                            speech(npc1_speech.speech_9, dialogueP);
                        }, 27000);
                        setTimeout(() => {
                            dialogueIMG.src = "./img/DanielTalk.png";
                            speech(npc1_speech.speech_10, dialogueP);
                        }, 37000);
                        setTimeout(() => {
                            dialogueIMG.src = "./img/DanielTalk.png";
                            speech(npc1_speech.speech_11, dialogueP);
                        }, 51000);
                        setTimeout(() => {
                            dialogueIMG.src = "./img/RicardoTalk.png";
                            speech(player.speech.daniel.speech_7, dialogueP);
                        }, 68000);
                        setTimeout(() => {
                            dialogueIMG.src = "./img/DanielTalk.png";
                            speech(npc1_speech.speech_12, dialogueP);
                        }, 73000);
                        setTimeout(() => {
                            dialogueIMG.src = "./img/DanielTalk.png";
                            speech(npc1_speech.speech_13, dialogueP);
                        }, 83000);
                        setTimeout(() => {
                            $decision.style.display = "flex";
                            $decision_opt[3].style.display = "block";
                            setTimeout(() => {
                                $decision_opt[3].style.opacity = 1;
                                dialogueBox.style.display = "none";
                                dialogueP.innerHTML = "";
                                bankbtns[0].style.display = "block";
                                bankbtns[0].addEventListener("click", (e) => {
                                    e.target.removeEventListener;
                                    e.target.style.display = "none";
                                    bankSaldo.style.display = "flex";
                                    bankSaldo.querySelector("p b").innerHTML = $money.innerHTML;
                                    $decision_opt[3].querySelector(".bank-main_acoes p b").innerHTML = $money.innerHTML;
                                    bankbtns[1].addEventListener("click", (e) => {
                                        e.target.style.display = "none";
                                        bankSaldo.style.display = "none";
                                        bankInvestir.style.display = "flex";

                                        bankAcoes[0].addEventListener("click", (e) => {
                                            e.target.removeEventListener;
                                            if ($money.innerHTML == "R$ 50") {
                                                $money.innerHTML = "R$ 47,07";
                                                $sounds[6].play();
                                                bankSaldo.querySelector("p b").innerHTML = $money.innerHTML;
                                                $decision_opt[3].querySelector(".bank-main_acoes p b").innerHTML = $money.innerHTML;
                                            } else if ($money.innerHTML == "R$ 150") {
                                                $money.innerHTML = "R$ 147,07";
                                                $sounds[6].play();
                                                bankSaldo.querySelector("p b").innerHTML = $money.innerHTML;
                                                $decision_opt[3].querySelector(".bank-main_acoes p b").innerHTML = $money.innerHTML;
                                            } else {
                                                $money.innerHTML = "R$ 1.097,07";
                                                $sounds[6].play();
                                                bankSaldo.querySelector("p b").innerHTML = $money.innerHTML;
                                                $decision_opt[3].querySelector(".bank-main_acoes p b").innerHTML = $money.innerHTML;
                                            }
                                            $decision_opt[3].style.opacity = 0;
                                            setTimeout(() => {
                                                $decision_opt[3].style.display = "none";
                                                $decision.style.display = "none";

                                                setTimeout(() => {
                                                    dialogueIMG.src = "./img/DanielTalk.png";
                                                    speech(npc1_speech.speech_14, dialogueP);
                                                    setTimeout(() => {
                                                        dialogueIMG.src = "./img/DanielTalk.png";
                                                        speech(npc1_speech.speech_15, dialogueP);
                                                    }, 10000);
                                                    setTimeout(() => {
                                                        dialogueIMG.src = "./img/RicardoTalk.png";
                                                        speech(player.speech.daniel.speech_8, dialogueP);
                                                    }, 25000);
                                                    setTimeout(() => {
                                                        dialogueIMG.src = "./img/RicardoTalk.png";
                                                        speech(player.speech.daniel.speech_9, dialogueP);
                                                    }, 33000);
                                                    setTimeout(() => {
                                                        control = false;
                                                        dialogueBox.style.display = "none";
                                                        dialogueP.innerHTML = "";
                                                        sell = false;
                                                        textForScene.scene_5 = "Parabéns, você acabou de dar os passos inicias após entrar no mundo financeiro. De acordo com suas escolhas, esse foi o final médio, pois investiu e cuidou do seu dinheiro mais ou menos.";
                                                        sixthScene();
                                                    }, 38000);
                                                }, 2000);
                                            }, 2100);
                                        });

                                        bankAcoes[1].addEventListener("click", (e) => {
                                            e.target.removeEventListener;
                                            if ($money.innerHTML == "R$ 50") {
                                                $money.innerHTML = "R$ 34,69";
                                                $sounds[6].play();
                                                bankSaldo.querySelector("p b").innerHTML = $money.innerHTML;
                                                $decision_opt[3].querySelector(".bank-main_acoes p b").innerHTML = $money.innerHTML;
                                            } else if ($money.innerHTML == "R$ 150") {
                                                $money.innerHTML = "R$ 134,69";
                                                $sounds[6].play();
                                                bankSaldo.querySelector("p b").innerHTML = $money.innerHTML;
                                                $decision_opt[3].querySelector(".bank-main_acoes p b").innerHTML = $money.innerHTML;
                                            } else {
                                                $money.innerHTML = "R$ 1.084,69";
                                                $sounds[6].play();
                                                bankSaldo.querySelector("p b").innerHTML = $money.innerHTML;
                                                $decision_opt[3].querySelector(".bank-main_acoes p b").innerHTML = $money.innerHTML;
                                            }
                                            $decision_opt[3].style.opacity = 0;
                                            setTimeout(() => {
                                                $decision_opt[3].style.display = "none";
                                                $decision.style.display = "none";

                                                setTimeout(() => {
                                                    dialogueIMG.src = "./img/DanielTalk.png";
                                                    speech(npc1_speech.speech_14, dialogueP);
                                                    setTimeout(() => {
                                                        dialogueIMG.src = "./img/DanielTalk.png";
                                                        speech(npc1_speech.speech_15, dialogueP);
                                                    }, 10000);
                                                    setTimeout(() => {
                                                        dialogueIMG.src = "./img/RicardoTalk.png";
                                                        speech(player.speech.daniel.speech_8, dialogueP);
                                                    }, 25000);
                                                    setTimeout(() => {
                                                        dialogueIMG.src = "./img/RicardoTalk.png";
                                                        speech(player.speech.daniel.speech_9, dialogueP);
                                                    }, 33000);
                                                    setTimeout(() => {
                                                        control = false;
                                                        dialogueBox.style.display = "none";
                                                        dialogueP.innerHTML = "";
                                                        sell = false;
                                                        textForScene.scene_5 = "Parabéns, você acabou de dar os passos inicias após entrar no mundo financeiro. De acordo com suas escolhas, esse foi o final bom, pois investiu e cuidou do seu dinheiro corretamente.";
                                                        sixthScene();
                                                    }, 38000);
                                                }, 2000);
                                            }, 2100);
                                        });

                                        bankAcoes[2].addEventListener("click", (e) => {
                                            e.target.removeEventListener;
                                            if ($money.innerHTML == "R$ 50") {
                                                $money.innerHTML = "R$ 45,46";
                                                $sounds[6].play();
                                                bankSaldo.querySelector("p b").innerHTML = $money.innerHTML;
                                                $decision_opt[3].querySelector(".bank-main_acoes p b").innerHTML = $money.innerHTML;
                                            } else if ($money.innerHTML == "R$ 150") {
                                                $money.innerHTML = "R$ 145,46";
                                                $sounds[6].play();
                                                bankSaldo.querySelector("p b").innerHTML = $money.innerHTML;
                                                $decision_opt[3].querySelector(".bank-main_acoes p b").innerHTML = $money.innerHTML;
                                            } else {
                                                $money.innerHTML = "R$ 1.095,46";
                                                $sounds[6].play();
                                                bankSaldo.querySelector("p b").innerHTML = $money.innerHTML;
                                                $decision_opt[3].querySelector(".bank-main_acoes p b").innerHTML = $money.innerHTML;
                                            }
                                            $decision_opt[3].style.opacity = 0;
                                            setTimeout(() => {
                                                $decision_opt[3].style.display = "none";
                                                $decision.style.display = "none";

                                                setTimeout(() => {
                                                    dialogueIMG.src = "./img/DanielTalk.png";
                                                    speech(npc1_speech.speech_14, dialogueP);
                                                    setTimeout(() => {
                                                        dialogueIMG.src = "./img/DanielTalk.png";
                                                        speech(npc1_speech.speech_15, dialogueP);
                                                    }, 10000);
                                                    setTimeout(() => {
                                                        dialogueIMG.src = "./img/RicardoTalk.png";
                                                        speech(player.speech.daniel.speech_8, dialogueP);
                                                    }, 25000);
                                                    setTimeout(() => {
                                                        dialogueIMG.src = "./img/RicardoTalk.png";
                                                        speech(player.speech.daniel.speech_9, dialogueP);
                                                    }, 33000);
                                                    setTimeout(() => {
                                                        control = false;
                                                        dialogueBox.style.display = "none";
                                                        dialogueP.innerHTML = "";
                                                        sell = false;
                                                        textForScene.scene_5 = "Parabéns, você acabou de dar os passos inicias após entrar no mundo financeiro. De acordo com suas escolhas, esse foi o final ruim, pois não investiu e cuidou do seu dinheiro de maneira correta.";
                                                        sixthScene();
                                                    }, 38000);
                                                }, 2000);
                                            }, 2100);
                                        });
                                    });
                                });
                            }, 100);
                        }, 88000);
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

    function speech(text, el) {
        el.innerHTML = "";
        dialogueBox.style.display = "flex";
        const textArr = text.split("");
        textArr.forEach((char, i) => {
            setTimeout(() => {
                el.innerHTML += char;
                $sounds[5].play();
            }, 55 * i);
        });
        setTimeout(() => {
            $sounds[5].pause();
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
        // secondScene();
        // thirdScene();
        // fourthScene();
        // fifthScene();
    }

    function update() {
        if (isGame) {
            if (!isInteract) {
                player.interact();
            }
        }
    }

    function render() {
        // requestAnimationFrame(render);
        if (isGame) {
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
        isFirtsScene = true;
        scrollOffset = 0;

        platformRoad = createSprite(spritePlatformRoad);

        player = new Player(0, 280);

        platforms = [new Platform(-1, 374, platformRoad), new Platform(platformRoad.width - 2, 374, platformRoad), new Platform(platformRoad.width * 2 - 2, 374, platformRoad), new Platform(platformRoad.width * 3 - 2, 374, platformRoad), new Platform(platformRoad.width * 4 - 2, 374, platformRoad), new Platform(platformRoad.width * 5 - 2, 374, platformRoad), new Platform(platformRoad.width * 6 - 2, 374, platformRoad), new Platform(platformRoad.width * 7 - 2, 374, platformRoad), new Platform(platformRoad.width * 8 - 2, 374, platformRoad), new Platform(platformRoad.width * 9 - 2, 374, platformRoad), new Platform(platformRoad.width * 10 - 2, 374, platformRoad), new Platform(platformRoad.width * 2 + 50, -490, createSprite(spriteCondos)), new Platform(platformRoad.width * 2 + 3500, -458, createSprite(bank))];

        npcs = [new NPC(platformRoad.width * 2 + 250, 245, 120, 164, maverickIdleRight, maverickIdleRight, 240, 328, 5), new NPC(platformRoad.width * 2 + 3832, 52, 256, 252, door, door, 256, 232, 0)];

        genericObjects = [new GenericObject(-1, -200, createSprite(spriteBackground)), new GenericObject(-1, -210, createSprite(spriteBuildings))];
    }

    function secondScene() {
        $sounds[0].pause();
        $sounds[1].pause();
        $sounds[2].play();
        isFirtsScene = false;
        isSecScene = true;
        isGame = false;
        player = null;
        control = false;
        $playerPlaying.style.display = "block";
        dialogueBox.style.display = "none";
        dialogueP.innerHTML = "";
        platform = null;
        npcs = null;
        genericObjects = null;
        scrollOffset = 0;
        $textScene.style.display = "block";
        typeWritter(textForScene.scene_2, $textScene.querySelector("p"));

        setTimeout(() => {
            thirdScene();
        }, 9500);
    }

    function thirdScene() {
        scrollOffset = 0;
        isGame = true;
        isSecScene = false;
        isThirdScene = true;
        $playerPlaying.style.display = "none";
        $textScene.style.display = "none";
        $painel.style.display = "block";
        platformRoad = createSprite(spritePlatformRoad);

        genericObjects = [new GenericObject(-1, -200, createSprite(spriteBackground)), new GenericObject(-1, -210, createSprite(spriteBuildings))];
        platforms = [new Platform(-1, 374, platformRoad), new Platform(platformRoad.width - 2, 374, platformRoad), new Platform(platformRoad.width * 2 - 2, 374, platformRoad), new Platform(platformRoad.width * 3 - 2, 374, platformRoad), new Platform(platformRoad.width * 4 - 2, 374, platformRoad), new Platform(platformRoad.width * 5 - 2, 374, platformRoad), new Platform(platformRoad.width * 6 - 2, 374, platformRoad), new Platform(platformRoad.width * 7 - 2, 374, platformRoad), new Platform(platformRoad.width * 8 - 2, 374, platformRoad), new Platform(platformRoad.width * 9 - 2, 374, platformRoad), new Platform(platformRoad.width * 10 - 2, 374, platformRoad), new Platform(platformRoad.width * 2, -520, createSprite(building1)), new Platform(platformRoad.width * 2 + 500, -230, createSprite(building2))];
        npcs = [new NPC(platformRoad.width * 2 + 440, 290, 58, 120, seller, seller, 116, 248, 3)];
        player = new Player(0, 280);

        if (vaga1) {
            $money.innerHTML = "R$ 3.650";
            player.speech.sobre_apt.speech_2 = `Atualmente eu possuo ${$money.textContent}`;
            player.speech.sobre_apt.speech_5 = `Minha renda mensal é de ${$money.textContent}`;
            player.speech.sobre_apt.speech_6 = `Pela minha renda eu consigo alugar qualquer um dos dois. Hum... Qual eu pego?`;
            player.speech.sobre_apt.speech_time = 55000;
        } else if (vaga2) {
            $money.innerHTML = "R$ 2.600";
            player.speech.sobre_apt.speech_2 = `Atualmente eu possuo ${$money.textContent}`;
            player.speech.sobre_apt.speech_5 = `Minha renda mensal é de ${$money.textContent}`;
            player.speech.sobre_apt.speech_6 = `Vish, vou ter que ficar com o menor, já que economizará no aluguel mensal e no depósito de segurança, além de gastar menos em despesas de utilidades. Só que o espaço é mais limitado né.`;
            player.speech.sobre_apt.speech_time = 61000;
            apts[1].style.display = "none";
        }

        control = false;
        player.currentSprite = player.sprites.idle.right;
        keys.left.pressed = false;
        keys.right.pressed = false;
        dialogueIMG.src = "./img/RicardoTalk.png";
        setTimeout(() => {
            speech(player.speech.sobre_apt.speech_1, dialogueP);
        }, 2000);
        setTimeout(() => {
            speech(player.speech.sobre_apt.speech_2, dialogueP);
        }, 9000);
        setTimeout(() => {
            control = true;
            dialogueBox.style.display = "none";
            dialogueP.innerHTML = "";
            sell = true;
        }, 12000);
    }

    function fourthScene() {
        $sounds[0].pause();
        $sounds[1].pause();
        $sounds[2].pause();
        $sounds[7].play();
        isFirtsScene = false;
        isSecScene = false;
        isThirdScene = false;
        isFourthScene = true;
        isGame = false;
        player = null;
        control = false;
        dialogueBox.style.display = "none";
        dialogueP.innerHTML = "";
        $painel.style.display = "none";
        platform = null;
        npcs = null;
        genericObjects = null;
        scrollOffset = 0;
        $textScene.style.display = "block";
        typeWritter(textForScene.scene_4, $textScene.querySelector("p"));

        setTimeout(() => {
            fifthScene();
        }, 18000);
    }

    function fifthScene() {
        daniel = true;
        isFirtsScene = false;
        isSecScene = false;
        isThirdScene = false;
        isFourthScene = false;
        isFifthScene = true;
        scrollOffset = 0;
        isGame = true;
        control = true;
        $textScene.style.display = "none";
        $painel.style.display = "block";
        platformRoad = createSprite(spritePlatformRoad);

        player = new Player(0, 280);

        platforms = [new Platform(-1, 374, platformRoad), new Platform(platformRoad.width - 2, 374, platformRoad), new Platform(platformRoad.width * 2 - 2, 374, platformRoad), new Platform(platformRoad.width * 3 - 2, 374, platformRoad), new Platform(platformRoad.width * 4 - 2, 374, platformRoad), new Platform(platformRoad.width * 5 - 2, 374, platformRoad), new Platform(platformRoad.width * 6 - 2, 374, platformRoad), new Platform(platformRoad.width * 7 - 2, 374, platformRoad), new Platform(platformRoad.width * 8 - 2, 374, platformRoad), new Platform(platformRoad.width * 9 - 2, 374, platformRoad), new Platform(platformRoad.width * 10 - 2, 374, platformRoad), new Platform(platformRoad.width * 2 + 50, -490, createSprite(spriteCondos)), new Platform(platformRoad.width * 2 + 3500, -458, createSprite(bank))];

        npcs = [new NPC(platformRoad.width * 2 + 250, 245, 120, 164, maverickIdleRight, maverickIdleRight, 240, 328, 5)];

        genericObjects = [new GenericObject(-1, -200, createSprite(spriteBackground)), new GenericObject(-1, -210, createSprite(spriteBuildings))];
    }

    function sixthScene() {
        isFirtsScene = false;
        isSecScene = false;
        isThirdScene = false;
        isFourthScene = true;
        isFourthScene = false;
        isSixthScene = true;
        isGame = false;
        player = null;
        control = false;
        dialogueBox.style.display = "none";
        dialogueP.innerHTML = "";
        $painel.style.display = "none";
        platform = null;
        npcs = null;
        genericObjects = null;
        scrollOffset = 0;
        $textScene.style.display = "block";
        typeWritter(textForScene.scene_5, $textScene.querySelector("p"));
        setTimeout(() => {
            location.reload();
        }, 18000);
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
    if (isGame) {
        if (player != null) {
            playerFrames = setInterval(() => {
                player.animate();
                npcs.forEach((npc) => {
                    npc.animate();
                });
            }, 60);
        }
    }
}

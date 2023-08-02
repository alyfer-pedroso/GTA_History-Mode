(() => {
    const $startMenu = document.querySelector(".startMenu");
    const $startBtn = document.querySelector(".startMenu__btn");
    const $scene = document.querySelector(".scene");
    const $player = document.querySelector(".player");
    const $playerAnim = document.querySelector(".playerAnim");
    const $audioPlay = document.querySelector(".audioPlay");
    const $soundTrack = document.querySelector(".soundTrack audio");

    let playing = false;
    let isPlaying = null;
    let playerX = 0;

    const startGame = () => {
        $startMenu.style.display = "none";
        $scene.style.display = "block";
        document.addEventListener("keydown", (e) => {
            if (e.key === "d") {
                playerX += 10;
                $player.style.left = `${playerX}px`;
                $playerAnim.style.setProperty("animation", "playerRun 0.6s steps(7) infinite");
                $player.style.transform = "scaleX(2) scaleY(2)";
            } else if (e.key === "a") {
                playerX -= 10;
                $player.style.left = `${playerX}px`;
                $playerAnim.style.setProperty("animation", "playerRun 0.6s steps(7) infinite");
                $player.style.transform = "scaleX(-2) scaleY(2)";
            }
        });

        document.addEventListener("keyup", () => {
            $playerAnim.style.setProperty("animation", "playerIdle 0.6s steps(7) infinite");
        });
    };

    isPlaying = setInterval(() => {
        if (playing) {
            startGame();
            clearInterval(isPlaying);
        }
    }, 50);

    $startBtn.addEventListener("click", () => {
        playing = true;
    });

    $soundTrack.pause();
    $audioPlay.addEventListener("click", () => {
        if ($soundTrack.classList.contains("paused")) {
            $soundTrack.play();
            $audioPlay.innerHTML = "&#x1F50A";
            $soundTrack.classList.remove("paused");
        } else {
            $soundTrack.pause();
            $audioPlay.innerHTML = "&#x1F508";
            $soundTrack.classList.add("paused");
        }
    });
})();

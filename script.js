document.addEventListener("DOMContentLoaded", () => {
    const gameArea = document.getElementById("game-area");
    const basket = document.getElementById("basket");
    const scoreElement = document.getElementById("score");
    const missedElement = document.getElementById("missed");
    const gameOverElement = document.getElementById("game-over");
    const finalScoreElement = document.getElementById("final-score");
    const highestScoreElement = document.getElementById("highest-score");
    const startButton = document.getElementById("start-button");
    const stopButton = document.getElementById("stop-button");
    const restartButton = document.getElementById("restart-button");
    const newGameButton = document.getElementById("new-game-button");

    let score = 0;
    let missed = 0;
    let highestScore = 0;
    let gameInterval;
    let isGameRunning = false;

    const vegetables = [
        { id: "potato", points: 1 },
        { id: "carrot", points: 2 },
        { id: "cabbage", points: 3 }
    ];

    function createFallingVegetable() {
        const vegetable = vegetables[Math.floor(Math.random() * vegetables.length)];
        const fallingVegetable = document.createElement("div");
        fallingVegetable.classList.add("falling-vegetable");
        fallingVegetable.id = vegetable.id;
        fallingVegetable.style.left = `${Math.random() * (gameArea.offsetWidth - 50)}px`;
        gameArea.appendChild(fallingVegetable);

        let fallingInterval = setInterval(() => {
            if (!isGameRunning) return;

            fallingVegetable.style.top = `${fallingVegetable.offsetTop + 5}px`;

            if (isCollision(fallingVegetable, basket)) {
                clearInterval(fallingInterval);
                gameArea.removeChild(fallingVegetable);
                score += vegetable.points;
                scoreElement.textContent = score;
            } else if (fallingVegetable.offsetTop > gameArea.offsetHeight) {
                clearInterval(fallingInterval);
                gameArea.removeChild(fallingVegetable);
                missed++;
                missedElement.textContent = missed;

                if (missed >= 3) {
                    endGame();
                }
            }
        }, 50);
    }

    function isCollision(obj1, obj2) {
        const obj1Rect = obj1.getBoundingClientRect();
        const obj2Rect = obj2.getBoundingClientRect();
        return !(
            obj1Rect.top > obj2Rect.bottom ||
            obj1Rect.bottom < obj2Rect.top ||
            obj1Rect.left > obj2Rect.right ||
            obj1Rect.right < obj2Rect.left
        );
    }

    function startGame() {
        if (isGameRunning) return;
        isGameRunning = true;
        gameInterval = setInterval(createFallingVegetable, 1000);
    }

    function stopGame() {
        isGameRunning = false;
        clearInterval(gameInterval);
    }

    function restartGame() {
        clearGameArea();
        score = 0;
        missed = 0;
        scoreElement.textContent = score;
        missedElement.textContent = missed;
        gameOverElement.style.display = "none";
        startGame();
    }

    function newGame() {
        clearGameArea();
        score = 0;
        missed = 0;
        highestScore = 0;
        scoreElement.textContent = score;
        missedElement.textContent = missed;
        highestScoreElement.textContent = highestScore;
        gameOverElement.style.display = "none";
        startGame();
    }

    function clearGameArea() {
        const objects = document.querySelectorAll(".falling-vegetable");
        objects.forEach(obj => obj.remove());
        stopGame();
    }

    function endGame() {
        stopGame();
        finalScoreElement.textContent = score;
        gameOverElement.style.display = "block";
        if (score > highestScore) {
            highestScore = score;
            highestScoreElement.textContent = highestScore;
        }
    }

    document.addEventListener("keydown", (e) => {
        const basketLeft = basket.offsetLeft;
        if (e.key === "ArrowLeft" && basketLeft > 0) {
            basket.style.left = `${basketLeft - 20}px`;
        } else if (e.key === "ArrowRight" && basketLeft < gameArea.offsetWidth - basket.offsetWidth) {
            basket.style.left = `${basketLeft + 20}px`;
        }
    });

    startButton.addEventListener("click", startGame);
    stopButton.addEventListener("click", stopGame);
    restartButton.addEventListener("click", restartGame);
    newGameButton.addEventListener("click", newGame);
});

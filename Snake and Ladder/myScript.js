import { snakeMap, ladderMap } from "./myConfig.js";

let backgroundMusic = new Audio("Resources/Sound/Background-Music.mp3");
let dices = document.querySelectorAll(".dice");
let audio = document.querySelector("#special-effects-audio");
let message = document.querySelector(".message");
let container = document.querySelector(".container");
let game = document.querySelector(".game");
let rollButton = document.querySelector("#roll-button");
let resetButton = document.querySelector("#reset-button");
let saveButton = document.querySelector("#save-button");
let settingsButton = document.querySelector("#settings-button");
let settingsBox = document.querySelector(".settings-box");
let selectBoard = document.querySelector("#select-board");
let boardImage = document.querySelector("#board-preview");
let volumeSlider = document.querySelector("#volume");
let forcedRollCheckbox = document.querySelector('input[name="forcedRoll"]');
let diceNumberInput1 = document.querySelector('#dice-number-1-forced');
let diceNumberInput2 = document.querySelector('#dice-number-2-forced');

let player = document.querySelector(".player");
let computer = document.querySelector(".computer");
let playerOld = document.querySelector(".player-old");
let computerOld = document.querySelector(".computer-old");

backgroundMusic.currentTime = 0;
backgroundMusic.loop = true;

let boardChanged = false;
let diceValueMinus1 = 0; //Ranges from 0 to 5
let playersTurn = true;
let playerMovesRight = true;
let computerMovesRight = true;
let boardIndex = 0;

function resetGame() {
    for (let dice of dices)
        dice.classList.remove("highlight");

    diceValueMinus1 = 0;
    playersTurn = true;
    playerMovesRight = true;
    computerMovesRight = true;

    player.classList.add("overlap");
    setNewCoordinates(player, 10, 1);
    setNewCoordinates(computer, 10, 1);
    setNewCoordinates(playerOld, 10, 1);
    setNewCoordinates(computerOld, 10, 1);
    message.classList.add("invisible");
}

function displayMessage(msg, time_duration = 3000, shadow_color = "white") {
    message.innerText = msg;
    container.style.boxShadow = '0px 0px 100px 50px ' + shadow_color + ' inset';
    message.classList.remove("invisible");
    setTimeout(() => {
        message.classList.add("invisible");
        container.style.boxShadow = "none";
    }, time_duration);

}

function playSound(sound_source, time_duration = 3000) {
    audio.src = sound_source;
    audio.play();
}

function getCoord(ele) {
    return [parseInt(ele.style.gridRowStart), parseInt(ele.style.gridColumnStart)];
}

function setNewCoordinates(ele, newRow, newCol) {

    ele.style.gridRowStart = newRow;
    ele.style.gridRowEnd = newRow + 1;
    ele.style.gridColumnStart = newCol;
    ele.style.gridColumnEnd = newCol + 1;
}

function movePlayerByOne() {
    let [row, col] = getCoord(player);
    if ((col === 10 && playerMovesRight) || (col === 1 && !playerMovesRight)) {
        playerMovesRight = !playerMovesRight;
        row--;
    }
    else
        col += ((playerMovesRight === true) ? 1 : -1);
    setNewCoordinates(player, row, col);
}

function moveComputerByOne() {
    let [row, col] = getCoord(computer);
    if ((col === 10 && computerMovesRight) || (col === 1 && !computerMovesRight)) {
        computerMovesRight = !computerMovesRight;
        row--;
    }
    else
        col += ((computerMovesRight === true) ? 1 : -1);
    setNewCoordinates(computer, row, col);
}

function overLap() {
    if (getCoord(player)[0] == getCoord(computer)[0] && getCoord(player)[1] == getCoord(computer)[1])
        return true;
    return false;
}

backgroundMusic.addEventListener("canplaythrough", () => {
    backgroundMusic.play();
});

volumeSlider.addEventListener('input', function () {
    backgroundMusic.volume = this.value / 100;
});

resetButton.addEventListener("click", () => {
    backgroundMusic.currentTime = 0;
    resetGame();
});

settingsButton.addEventListener("click", () => {
    settingsBox.classList.remove("invisible");
    settingsBox.disabled = true;
});

selectBoard.addEventListener("change", () => {
    boardImage.src = `Resources/Board/${selectBoard.value}.jpg`;
    boardChanged = true;
});

saveButton.addEventListener("click", () => {
    if (boardChanged) {
        resetGame();
        boardChanged = false;
    }
    boardIndex = parseInt(selectBoard.value.at(-1)) - 1;
    game.style.backgroundImage = `url(Resources/Board/${selectBoard.value}.jpg)`;
    settingsBox.classList.add("invisible");
    settingsBox.disabled = false;
});

rollButton.addEventListener("click", () => {
    let forced = forcedRollCheckbox.checked;
    let value1 = parseInt(diceNumberInput1.value);
    let value2 = parseInt(diceNumberInput2.value);
    let offset;

    /* Rolling the dice */
    if (!forced) {
        offset = 6 + (Math.floor(Math.random() * 6) + 1); // 6 + [1–6]
    }
    else if (playersTurn && value1 >= 1 && value1 <= 6) {
        offset = 12 + value1 - (diceValueMinus1 + 1); // Force this roll
    }
    else if (!playersTurn && value2 >= 1 && value2 <= 6) {
        offset = 12 + value2 - (diceValueMinus1 + 1); // Force this roll
    }
    let delay_ms = 75; // delay_ms between steps in ms
    rollButton.disabled = true; // disable rollButton during roll
    for (let i = 0; i < offset; i++) {
        setTimeout(() => {
            dices[diceValueMinus1].classList.remove("highlight");
            diceValueMinus1 = (diceValueMinus1 + 1) % 6;
            dices[diceValueMinus1].classList.add("highlight");
        }, i * delay_ms);
    }

    /* Conclusions of the roll */
    setTimeout(() => {
        console.log("Final dice value:", diceValueMinus1 + 1);

        /*                    Movements:                     */
        // Incremental movements:
        if (overLap()) {
            player.classList.remove("overlap");
        }
        let ele = (playersTurn) ? player : computer;
        let old = (playersTurn) ? playerOld : computerOld;
        let [row, col] = getCoord(ele);
        setNewCoordinates(old, row, col);

        if ((row !== 1) || (row === 1 && (col - (diceValueMinus1 + 1) > 0))) {
            for (let move = 0; move < diceValueMinus1 + 1; move++)
                setTimeout(playersTurn ? movePlayerByOne : moveComputerByOne, move * delay_ms * 2);
        }
        // Snake or Ladder movements:
        setTimeout(() => {
            let [currRow, currCol] = getCoord(ele);
            let key = `${currRow},${currCol}`;

            // Ladder:
            let newCoord = ladderMap[boardIndex].get(key);
            if (newCoord !== undefined) {
                setNewCoordinates(ele, newCoord.row, newCoord.col);
                if (playersTurn)
                    (newCoord.row & 1) ? (playerMovesRight = false) : (playerMovesRight = true);
                else
                    (newCoord.row & 1) ? (computerMovesRight = false) : (computerMovesRight = true);
                playSound("Resources/Sound/Ladder.mp3", 3000);
                displayMessage("Took the ladder!", 3000, "green");

            }

            // Snake:
            newCoord = snakeMap[boardIndex].get(key);
            if (newCoord !== undefined) {
                setNewCoordinates(ele, newCoord.row, newCoord.col);
                if (playersTurn)
                    (newCoord.row & 1) ? (playerMovesRight = false) : (playerMovesRight = true);
                else
                    (newCoord.row & 1) ? (computerMovesRight = false) : (computerMovesRight = true);
                playSound("Resources/Sound/Snake.mp3", 3000);
                displayMessage("Eaten by the snake!", 3000, "red");
            }

            // If overlapping now
            if (overLap()) {
                player.classList.add("overlap");
            }
            // Checking if the current player won:
            if (getCoord(ele)[0] === 1 && getCoord(ele)[1] === 1) {
                displayMessage(`${playersTurn ? 'Player 1' : 'Player 2'} won!`, 5000);
                rollButton.disabled = true;
                setTimeout(() => {
                    resetGame();
                    rollButton.disabled = false;
                }, 5000);
            }
            rollButton.disabled = false;    // Enabling the rollButton only after the animation ends
            playersTurn = !playersTurn;
        }, (diceValueMinus1 + 1) * delay_ms * 2);
    }, offset * delay_ms);
});

import { snakeMap, ladderMap } from "./myConfig.js";

let backgroundMusic = new Audio("Resources/Sound/Background-Music.mp3");
let dices = document.querySelectorAll(".dice");
let audio = document.querySelector("#special-effects-audio");
let message = document.querySelector(".message");
let container = document.querySelector(".container");
let game = document.querySelector(".game");
let rollButton = document.querySelector("#roll-button");
let resetButton = document.querySelector("#reset-button");
// Settings:
let saveButton = document.querySelector("#save-button");
let settingsButton = document.querySelector("#settings-button");
let settingsBox = document.querySelector(".settings-box");
let selectBoard = document.querySelector("#select-board");
let boardImage = document.querySelector("#board-preview");
let volumeSlider = document.querySelector("#volume");
let forcedRollCheckbox = document.querySelector('input[name="forcedRoll"]');
let diceNumberInput1 = document.querySelector('#dice-number-1-forced');
let diceNumberInput2 = document.querySelector('#dice-number-2-forced');
let saveGameButton = document.querySelector("#save-game-button");
let loadGameButton = document.querySelector("#load-game-button")
console.log("Save button is:", saveGameButton);
console.log("Load button is:", loadGameButton);

let player = document.querySelector(".player");
let computer = document.querySelector(".computer");
let playerOld = document.querySelector(".player-old");
let computerOld = document.querySelector(".computer-old");

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

    player.classList.add("indicate-turn-first");
    computer.classList.remove("indicate-turn-second");
    player.classList.add("overlap");
    setNewCoordinates(player, 10, 1);
    setNewCoordinates(computer, 10, 1);
    setNewCoordinates(playerOld, 10, 1);
    setNewCoordinates(computerOld, 10, 1);
    message.classList.add("invisible");
}

function displayMessage(msg, time_duration = 3000, shadow_color = "white") {
    // Prepare the Message Box UI
    message.innerText = msg;
    message.style.backgroundColor = shadow_color;
    if (shadow_color === "white")
        message.style.color = "black";
    container.style.boxShadow = '0px 0px 100px 50px ' + shadow_color + ' inset';

    // Make visible and then invisible again
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

// ********************************************* Settings **************************************************
settingsButton.addEventListener("click", () => {
    settingsBox.classList.remove("invisible");
    settingsBox.disabled = true;
});

selectBoard.addEventListener("change", () => {
    boardImage.src = `Resources/Board/${selectBoard.value}.jpg`;
    boardChanged = true;
});

volumeSlider.addEventListener('input', function () {
    backgroundMusic.volume = this.value / 100;
});

saveGameButton.addEventListener("click", () => {
    localStorage.setItem('playersTurn', playersTurn);
    localStorage.setItem('playerMovesRight', playerMovesRight);
    localStorage.setItem('computerMovesRight', computerMovesRight);
    localStorage.setItem('boardIndex', boardIndex);
    localStorage.setItem('playersX', getCoord(player)[0]);
    localStorage.setItem('playersY', getCoord(player)[1]);
    localStorage.setItem('computerX', getCoord(computer)[0]);
    localStorage.setItem('computerY', getCoord(computer)[1]);
    displayMessage("The game has been SAVED!", 3000, "blue");
});

loadGameButton.addEventListener("click", () => {
    playersTurn = localStorage.getItem('playersTurn') === 'true';
    playerMovesRight = localStorage.getItem('playerMovesRight') === 'true';
    computerMovesRight = localStorage.getItem('computerMovesRight') === 'true';
    boardIndex = parseInt(localStorage.getItem('boardIndex'), 10);
    game.style.backgroundImage = `url("Resources/Board/Board-${boardIndex + 1}.jpg")`;
    boardImage.src = `Resources/Board/Board-${boardIndex + 1}.jpg`;
    selectBoard.selectedIndex = boardIndex;

    const playersX = parseInt(localStorage.getItem('playersX'), 10);
    const playersY = parseInt(localStorage.getItem('playersY'), 10);
    const computerX = parseInt(localStorage.getItem('computerX'), 10);
    const computerY = parseInt(localStorage.getItem('computerY'), 10);
    setNewCoordinates(player, playersX, playersY);
    setNewCoordinates(computer, computerX, computerY);
    if (playersX == computerX && playersY == computerY)
        player.classList.add("overlap");
    else
        player.classList.remove("overlap");
    if(playersTurn)
    {
        player.classList.add("indicate-turn-first");
        computer.classList.remove("indicate-turn-second");
    }
    else
    {
        player.classList.remove("indicate-turn-first");
        computer.classList.add("indicate-turn-second");
    }
    displayMessage("The game has been LOADED!", 3000, "darkgreen")
});

resetButton.addEventListener("click", () => {
    backgroundMusic.currentTime = 0;
    resetGame();
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

// ********************************************* Rolling region **************************************************
rollButton.addEventListener("click", () => {
    rollButton.disabled = true; // disable rollButton during roll
    let delay_ms = 75; // delay_ms between steps in ms
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
    else {
        offset = 6 + (Math.floor(Math.random() * 6) + 1); // 6 + [1–6]
    }

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
        setNewCoordinates(old, row, col); // Moving the shadow to new location
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
                backgroundMusic.pause();
                backgroundMusic.currentTime = 0;
                playSound("Resources/Sound/Victory.wav");
                rollButton.disabled = true;
                setTimeout(() => {
                    resetGame();
                    rollButton.disabled = false;
                }, 5000);
            }
            playersTurn = !playersTurn;
            setTimeout(() => {
                player.classList.toggle("indicate-turn-first");
                computer.classList.toggle("indicate-turn-second");
            }, 300);

            rollButton.disabled = false;    // Enabling the rollButton only after the animation ends            
        }, (diceValueMinus1 + 1) * delay_ms * 2);
    }, offset * delay_ms);
});

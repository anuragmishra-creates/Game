import { snakeMap, ladderMap } from "./myConfig.js";

let dices = document.querySelectorAll(".dice");
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

let player = document.querySelector(".player");
let computer = document.querySelector(".computer");
let playerOld = document.querySelector(".player-old");
let computerOld = document.querySelector(".computer-old");

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

resetButton.addEventListener("click", () => {
    resetGame();
});

settingsButton.addEventListener("click", () => {
    settingsBox.classList.remove("invisible");
    settingsBox.disabled = true;
});

selectBoard.addEventListener("change", () => {
    boardImage.src = `Resources/Board/${selectBoard.value}.jpg`;
});

saveButton.addEventListener("click", () => {
    resetGame();
    boardIndex = parseInt(selectBoard.value.at(-1)) - 1;
    game.style.backgroundImage = `url(Resources/Board/${selectBoard.value}.jpg)`;
    settingsBox.classList.add("invisible");
    settingsBox.disabled = false;
});

rollButton.addEventListener("click", () => {
    /* Rolling the dice */
    let offset = 6 + Math.floor(Math.random() * 6) + 1; // 6 + [1–6]
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
        rollButton.disabled = false;    // Enabling the rollButton only after the animation ends

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

            let newCoord = ladderMap[boardIndex].get(key);
            if (newCoord !== undefined) {
                setNewCoordinates(ele, newCoord.row, newCoord.col);
                if (playersTurn)
                    (newCoord.row & 1) ? (playerMovesRight = false) : (playerMovesRight = true);
                else
                    (newCoord.row & 1) ? (computerMovesRight = false) : (computerMovesRight = true);

                displayMessage("Took the ladder!", 3000, "green");
            }

            newCoord = snakeMap[boardIndex].get(key);
            if (newCoord !== undefined) {

                setNewCoordinates(ele, newCoord.row, newCoord.col);
                if (playersTurn)
                    (newCoord.row & 1) ? (playerMovesRight = false) : (playerMovesRight = true);
                else
                    (newCoord.row & 1) ? (computerMovesRight = false) : (computerMovesRight = true);

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
            playersTurn = !playersTurn;
        }, (diceValueMinus1 + 1) * delay_ms * 2);
    }, offset * delay_ms);
});

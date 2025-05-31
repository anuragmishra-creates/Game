import { snakeMap, ladderMap, snakeMapReversed, ladderMapReversed } from "./myConfig.js";

// Background effects:
let backgroundMusic = new Audio("Resources/Sound/Background-Music.mp3");
// let audio = document.querySelector("#special-effects-audio");
let message = document.querySelector(".message");
let alertMessage = document.querySelector(".alert-message");
let container = document.querySelector(".container");
let game = document.querySelector(".game");
backgroundMusic.loop = true;

// Rolling region:
let dices = document.querySelectorAll(".dice");
let rollButton = document.querySelector("#roll-button");
let resetButton = document.querySelector("#reset-button");

// Settings:
let saveSettingsButton = document.querySelector("#save-button");
let settingsButton = document.querySelector("#settings-button");
let settingsBox = document.querySelector(".settings-box");
let selectBoard = document.querySelector("#select-board");
let boardImage = document.querySelector("#board-preview");
let selectMode = document.querySelector("#select-mode");
let volumeSlider = document.querySelector("#volume");
let forcedRollCheckbox = document.querySelector('input[name="forcedRoll"]');
let diceForcedOptions = document.querySelector(".dice-force-options");
let diceNumberInput1 = document.querySelector('#dice-number-1-forced');
let diceNumberInput2 = document.querySelector('#dice-number-2-forced');
let saveGameButton = document.querySelector("#save-game-button");
let loadGameButton = document.querySelector("#load-game-button");

// Tokens:
let player = document.querySelector(".player");
let computer = document.querySelector(".computer");
let playerOld = document.querySelector(".player-old");
let computerOld = document.querySelector(".computer-old");

// Dynamic variables' declaration and initializations:

// Settings variables:
let boardChanged = false;
let modeChanged = false;
let boardIndex = 0;
let gameReversed = false;
let modeIndex = 0;
// Playing variables:
let diceValueMinus1 = 0; //Ranges from 0 to 5
let playersTurn = true;
let gameStarting = true;

// Does NOT reset Settings (Board, Mode, Volume, Forced-Roll, etc)!
function resetGame() {
    for (let dice of dices)
        dice.classList.remove("highlight");

    diceValueMinus1 = 0;
    playersTurn = true;
    if (modeIndex === 0 || modeIndex === 2)
        gameReversed = false;
    else //Utmost necessary in Mixed-mode
        gameReversed = true;

    player.classList.add("indicate-turn-first");
    computer.classList.remove("indicate-turn-second");
    player.classList.add("overlap");
    setCoordinates(player, 10, 1);
    setCoordinates(computer, 10, 1);
    setCoordinates(playerOld, 10, 1);
    setCoordinates(computerOld, 10, 1);
    message.classList.add("invisible");
}

function displayMessage(msg, time_duration, shadow_color, font_color = "white") {
    // Prepare the Message Box UI
    message.innerText = msg;
    message.style.backgroundColor = shadow_color;
    message.style.color = font_color;
    container.style.boxShadow = '0px 0px 100px 50px ' + shadow_color + ' inset';

    // Make visible and then invisible again
    message.classList.remove("invisible");
    setTimeout(() => {
        message.classList.add("invisible");
        container.style.boxShadow = "none";
    }, time_duration);
}

function displayAlertMessage(msg, time_duration, shadow_color, font_color = "white") {
    // Prepare the Message Box UI
    rollButton.disabled = true;
    resetButton.disabled = true;
    alertMessage.innerHTML = `<h2> Alert Message! </h2> <br> ${msg}`;
    alertMessage.style.backgroundColor = shadow_color;
    alertMessage.style.color = font_color;
    container.style.boxShadow = '0px 0px 100px 50px ' + shadow_color + ' inset';

    // Make visible and then invisible again
    alertMessage.classList.remove("invisible");
    setTimeout(() => {
        rollButton.disabled = false;
        resetButton.disabled = false;


        alertMessage.classList.add("invisible");
        container.style.boxShadow = "none";
    }, time_duration);
}

function playSound(sound_source, time_duration = 3000) {
    let audio = new Audio(sound_source);
    audio.play();
}

function getCoordinates(ele) {
    return [parseInt(ele.style.gridRowStart), parseInt(ele.style.gridColumnStart)];
}

function setCoordinates(ele, newRow, newCol) {

    ele.style.gridRowStart = newRow;
    ele.style.gridRowEnd = newRow + 1;
    ele.style.gridColumnStart = newCol;
    ele.style.gridColumnEnd = newCol + 1;
}

function movesRight(ele) {
    console.log('movesRight called');
    // This function checks if the player is moving right or left based on the row number
    let [row, col] = getCoordinates(ele);
    return ((row & 1) ? false : true);
}

function moveTokenByOne(ele) {
    let [row, col] = getCoordinates(ele);
    if ((col === 10 && movesRight(ele)) || (col === 1 && !movesRight(ele))) row--;
    else col += (movesRight(ele) ? 1 : -1);
    setCoordinates(ele, row, col);
}

function overLap() {
    if (getCoordinates(player)[0] == getCoordinates(computer)[0] && getCoordinates(player)[1] == getCoordinates(computer)[1])
        return true;
    return false;
}

function mixedModeRandomness(reversalProbability) {
    if (modeIndex === 2) {
        if (Math.random() < reversalProbability) {
            playSound("Resources/Sound/Notification.mp3", 3000);
            if (!gameReversed) {
                displayAlertMessage("🌀Suddenly, everything is twisted. Let the chaos begin!", 3000, "purple", "white");
                gameReversed = true;
            }
            else {
                displayAlertMessage("✅Suddenly, everything is reverted-back to normal!", 3000, "white", "black");
                gameReversed = false;
            }
            console.log(`gameReverse: ${gameReversed}`);
        }
    }
}

function snakeAndLadderMovements(ele) {
    let [currRow, currCol] = getCoordinates(ele);
    let key = `${currRow},${currCol}`;
    let newCoord;

    // Snake or Ladder movements:
    if (getCoordinates(ele)[0] !== 1 || getCoordinates(ele)[1] !== 1) {
        switch (gameReversed) {

            // If snakes and ladders are NOT reversed
            case false:
                // Ladder:
                newCoord = ladderMap[boardIndex].get(key);
                if (newCoord !== undefined) {
                    setCoordinates(ele, newCoord.row, newCoord.col);
                    playSound("Resources/Sound/Ladder.mp3", 3000);
                    displayMessage("Climbed-up the ladder!", 3000, "green");
                }
                // Snake:
                newCoord = snakeMap[boardIndex].get(key);
                if (newCoord !== undefined) {
                    setCoordinates(ele, newCoord.row, newCoord.col);
                    playSound("Resources/Sound/Snake.mp3", 3000);
                    displayMessage("Eaten by the snake!", 3000, "red");
                }
                break;

            //If snakes and ladders are reversed
            case true:
                // Ladder:
                newCoord = ladderMapReversed[boardIndex].get(key);
                if (newCoord !== undefined) {
                    setCoordinates(ele, newCoord.row, newCoord.col);
                    playSound("Resources/Sound/Ladder.mp3", 3000);
                    displayMessage("Tripped down the ladder!", 3000, "red");
                }

                // Snake:
                newCoord = snakeMapReversed[boardIndex].get(key);
                if (newCoord !== undefined) {
                    setCoordinates(ele, newCoord.row, newCoord.col);
                    playSound("Resources/Sound/Snake.mp3", 3000);
                    displayMessage("Wait, the snake helped!?", 3000, "green");
                }
                break;
        }
    }
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

selectMode.addEventListener("change", () => {
    modeChanged = true;
});

volumeSlider.addEventListener('input', function () {
    backgroundMusic.volume = this.value / 100;
});

saveGameButton.addEventListener("click", () => {
    localStorage.setItem('playersTurn', playersTurn);
    localStorage.setItem('boardIndex', boardIndex);
    localStorage.setItem('playersX', getCoordinates(player)[0]);
    localStorage.setItem('playersY', getCoordinates(player)[1]);
    localStorage.setItem('computerX', getCoordinates(computer)[0]);
    localStorage.setItem('computerY', getCoordinates(computer)[1]);
    localStorage.setItem('modeIndex', modeIndex);
    localStorage.setItem('gameReversed', gameReversed);
    displayMessage("The game has been SAVED!", 3000, "blue", "white");
});

loadGameButton.addEventListener("click", () => {
    playersTurn = localStorage.getItem('playersTurn') === 'true';
    boardIndex = parseInt(localStorage.getItem('boardIndex'), 10);
    selectBoard.selectedIndex = boardIndex;
    modeIndex = parseInt(localStorage.getItem('modeIndex'), 10);
    selectMode.selectedIndex = modeIndex;
    gameReversed = localStorage.getItem('gameReversed') === 'true';
    // gameReversed is useful for determining the current state of the mixed-mode

    game.style.backgroundImage = `url("Resources/Board/Board-${boardIndex + 1}.jpg")`;
    boardImage.src = `Resources/Board/Board-${boardIndex + 1}.jpg`;

    const playersX = parseInt(localStorage.getItem('playersX'), 10);
    const playersY = parseInt(localStorage.getItem('playersY'), 10);
    const computerX = parseInt(localStorage.getItem('computerX'), 10);
    const computerY = parseInt(localStorage.getItem('computerY'), 10);
    setCoordinates(player, playersX, playersY);
    setCoordinates(computer, computerX, computerY);
    setCoordinates(playerOld, playersX, playersY);
    setCoordinates(computerOld, computerX, computerY);

    // Setting the tokens:
    if (playersX == computerX && playersY == computerY) player.classList.add("overlap");
    else player.classList.remove("overlap");

    if (playersTurn) {
        player.classList.add("indicate-turn-first");
        computer.classList.remove("indicate-turn-second");
    }
    else {
        player.classList.remove("indicate-turn-first");
        computer.classList.add("indicate-turn-second");
    }

    // Alert Messages:
    if (modeIndex === 0)
        displayAlertMessage("The game has been LOADED in CLASSIC!", 4000, "white", "black");
    else if (modeIndex === 1)
        displayAlertMessage("The game has been LOADED in REVERSED!", 4000, "purple", "white");
    else
        displayAlertMessage(`The game has been LOADED in MIXED: ${gameReversed ? 'Reversed' : 'Normal'}!`, 4000, "darkorange", "black");
    modeChanged = false; //Because on loading we don't want to force-reset otherwise no worth in it!
});

forcedRollCheckbox.addEventListener("click", () => {
    diceForcedOptions.classList.toggle("invisible");
});

resetButton.addEventListener("click", () => {
    backgroundMusic.currentTime = 0;
    resetGame();
});

saveSettingsButton.addEventListener("click", () => {

    if (modeChanged || boardChanged) {
        resetGame();
    }
    boardIndex = selectBoard.selectedIndex;
    modeIndex = selectMode.selectedIndex;

    game.style.backgroundImage = `url(Resources/Board/${selectBoard.value}.jpg)`;
    settingsBox.classList.add("invisible");
    settingsBox.disabled = false;

    // Mode-change message only when the mode and/or the board settings are changed!
    if (modeChanged || boardChanged || gameStarting) {
        playSound("Resources/Sound/Notification.mp3", 3000);
        if (modeIndex === 0) {
            displayAlertMessage("✅Everything is completely normal.", 3000, "white", "black");
            gameReversed = false;
        }
        else if (modeIndex === 1) {
            displayAlertMessage("🌀Everything is twisted. Let the chaos begin!", 3000, "purple", "white");
            gameReversed = true;
        }
        else if (modeIndex === 2) {
            displayAlertMessage("❓For now, everything 'seems' normal!", 3000, "darkorange", "black");
            gameReversed = false;
        }
        modeChanged = false;
        boardChanged = false;
        gameStarting = false;
    }
});

// ***************************************** Rolling region **********************************************
function mainFunction() {
    rollButton.disabled = true; // disable rollButton during roll
    resetButton.disabled = true; // disable resetButton during roll
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

        // If mixed mode, then sudden reversal possibility just after dice roll concluded:
        mixedModeRandomness(0.10);

        // Before movements:
        // Snake and Ladder Movements for both tokens (sudden reversal may affect the other player too!)
        snakeAndLadderMovements(player);
        snakeAndLadderMovements(computer);

        // Incremental movements:
        if (overLap()) player.classList.remove("overlap");
        let ele = (playersTurn) ? player : computer; //Refers to the current player
        let old = (playersTurn) ? playerOld : computerOld; //Refers to the current player's shadow
        let [currRow, currCol] = getCoordinates(ele);
        setCoordinates(old, currRow, currCol); // Moving the shadow to current location
        if ((currRow !== 1) || (currRow === 1 && (currCol - (diceValueMinus1 + 1)) > 0)) {
            for (let move = 0; move < diceValueMinus1 + 1; move++) {
                setTimeout(() => {
                    moveTokenByOne(ele);
                }, move * delay_ms * 2);
            }
        }

        setTimeout(() => {
            // After movement:
            // Snake and Ladder Movements for both tokens (sudden reversal may affect the other player too!)
            snakeAndLadderMovements(player);
            snakeAndLadderMovements(computer);

            // If overlapping now
            if (overLap()) player.classList.add("overlap");
            let winnerDecided = false;
            // Checking if the current player won:
            if (getCoordinates(ele)[0] === 1 && getCoordinates(ele)[1] === 1) {
                winnerDecided = true;
                displayMessage(`${playersTurn ? 'Player 1' : 'Player 2'} won!`, 6000, "yellow", "black");
                playSound("Resources/Sound/Victory.wav");
                rollButton.disabled = true;
                resetButton.disabled = true;
                setTimeout(() => {
                    resetGame();
                    rollButton.disabled = false;
                    resetButton.disabled = false;
                }, 6000);
            }
            playersTurn = !playersTurn;
            setTimeout(() => {
                player.classList.toggle("indicate-turn-first");
                computer.classList.toggle("indicate-turn-second");
            }, 200);

            if (!winnerDecided) {
                resetButton.disabled = false;   // Enabling the resetButton only after the animation ends 
                rollButton.disabled = false;    // Enabling the rollButton only after the animation ends  
            }

        }, (diceValueMinus1 + 1) * delay_ms * 2);
    }, offset * delay_ms);
}

rollButton.addEventListener("click", mainFunction);

document.addEventListener("keydown", (event) => {
    if (!rollButton.disabled) {
        if ((playersTurn && event.code === 'ControlLeft') || (!playersTurn && event.code == 'ControlRight'))
            mainFunction();
    }
});

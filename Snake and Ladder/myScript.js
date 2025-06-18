import { snakeMap, ladderMap, snakeMapReversed, ladderMapReversed } from "./myConfig.js";

// Background effects:
let backgroundMusic = new Audio("Resources/Sound/Background-Music.mp3");
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
let selectPlayers = document.querySelector("#select-players");
let volumeSlider = document.querySelector("#volume");
let forcedRollCheckbox = document.querySelector('input[name="forcedRoll"]');
let reversalProbabilityContainer = document.querySelector('.reversal-probability-options');
let reversalProbabilityInput = document.querySelector('input[name="reversal-probability"]');
let diceForcedOptions = document.querySelector(".dice-force-options");
let diceNumberInput1 = document.querySelector('#dice-number-1-forced');
let diceNumberInput2 = document.querySelector('#dice-number-2-forced');
let saveGameButton = document.querySelector("#save-game-button");
let loadGameButton = document.querySelector("#load-game-button");
let clearGameButton = document.querySelector("#clear-game-button");

// Credits box:
let creditsBox = document.querySelector(".credits-box");
let openCreditsButton = document.querySelector("#credits-button");
let closeCreditsButton = document.querySelector("#close-credits-button");
// Info box:
let infoBox = document.querySelector(".info-box");
let openInfoButton = document.querySelector("#info-button");
let closeInfoButton = document.querySelector("#close-info-button");

// Tokens:
let player = document.querySelector(".player");
let computer = document.querySelector(".computer");
let playerOld = document.querySelector(".player-old");
let computerOld = document.querySelector(".computer-old");
const statsBox = document.createElement("div");
statsBox.className = "token-stats-box invisible";
document.body.appendChild(statsBox);
// Dynamic variables' declaration and initializations:

// Settings variables:
let offset;
let winnerDecided = false; // Used for determining when the roll and reset button should be enabled back
let delay_ms = 75; // delay_ms between steps in ms
let boardChanged = false;
let modeChanged = false;
let boardIndex = 0;
let gameReversed = false;
let modeIndex = 0;
let reversalProbability = 0.10;
let playersIndex = 0; // The option corresponding to the PVP or PVC

// Playing variables:
let diceValueMinus1 = 0; //Ranges from 0 to 5
let playersTurn = true;
let gameStarting = true;
let stats = {
    player: {
        snakes: 0,
        ladders: 0,
        diceSum: 0,
        lastRoll: 0
    },
    computer: {
        snakes: 0,
        ladders: 0,
        diceSum: 0,
        lastRoll: 0
    }
};

// Winner Modal Logic
const winnerModal = document.querySelector('.winner-modal');
const winnerPlayerDiv = document.getElementById('winner-player');
const loserPlayerDiv = document.getElementById('loser-player');
const winnerStatsTbody = document.getElementById('winner-stats-tbody');
const winnerNewGameBtn = document.getElementById('winner-newgame-btn');
const winnerShareBtn = document.getElementById('winner-share-btn');
const backdrop = document.querySelector('.backdrop');

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
    stats.player = { snakes: 0, ladders: 0, diceSum: 0, lastRoll: 0 };
    stats.computer = { snakes: 0, ladders: 0, diceSum: 0, lastRoll: 0 };
    backgroundMusic.currentTime = 0;
    player.classList.add("indicate-turn-first");
    computer.classList.remove("indicate-turn-second");
    player.classList.add("overlap");
    setCoordinates(player, 10, 1);
    setCoordinates(computer, 10, 1);
    setCoordinates(playerOld, 10, 1);
    setCoordinates(computerOld, 10, 1);
    message.classList.add("invisible");
    winnerDecided = false;
    updateTurnInfoBox();
}

let messageTimeoutId = null;

function displayMessage(msg, time_duration, shadow_color, font_color = "white") {
    // Prepare the Message Box UI
    message.innerText = msg;
    message.style.backgroundColor = shadow_color;
    message.style.color = font_color;
    container.style.boxShadow = '0px 0px 100px 50px ' + shadow_color + ' inset';

    // Clear any previous timeout to prevent hiding the new message too early
    if (messageTimeoutId !== null) {
        clearTimeout(messageTimeoutId);
        messageTimeoutId = null;
    }

    // Make visible and then invisible again
    message.classList.remove("invisible");
    messageTimeoutId = setTimeout(() => {
        message.classList.add("invisible");
        container.style.boxShadow = "none";
        messageTimeoutId = null;
    }, time_duration);
}

let alertMessageTimeoutId = null;
function displayAlertMessage(msg, time_duration, shadow_color, font_color = "white") {
    // Prepare the Message Box UI
    rollButton.disabled = true;
    resetButton.disabled = true;
    alertMessage.innerHTML = `<h2> Alert Message! </h2> <p> ${msg} <p>`;
    alertMessage.style.backgroundColor = shadow_color;
    alertMessage.style.color = font_color;
    container.style.boxShadow = '0px 0px 100px 50px ' + shadow_color + ' inset';

    // Clear any previous timeout to prevent hiding the new message too early
    if (alertMessageTimeoutId !== null) {
        clearTimeout(alertMessageTimeoutId);
        alertMessageTimeoutId = null;
    }

    // Make visible and then invisible again
    alertMessage.classList.remove("invisible");
    alertMessageTimeoutId = setTimeout(() => {
        rollButton.disabled = false;
        resetButton.disabled = false;
        alertMessage.classList.add("invisible");
        container.style.boxShadow = "none";
        alertMessageTimeoutId = null;
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

// This function checks if the player is moving right or left based on the row number
function movesRight(ele) {
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

function updateTurnInfoBox() {
    const turnValue = document.getElementById("turn-value");
    const modeValue = document.getElementById("mode-value");
    const playersValue = document.getElementById("players-value");
    const mixedRow = document.getElementById("mixed-row");
    const mixedValue = document.getElementById("mixed-value");

    // Turn
    if (playersIndex === 0) {
        turnValue.textContent = playersTurn ? "Player 1" : "Computer";
    } else {
        turnValue.textContent = playersTurn ? "Player 1" : "Player 2";
    }

    // Mode
    if (modeIndex === 0) {
        modeValue.textContent = "Classic";
        modeValue.style.color = "white";
        mixedRow.style.display = "none";
    } else if (modeIndex === 1) {
        modeValue.textContent = "Reversed";
        modeValue.style.color = "purple";
        mixedRow.style.display = "none";
    } else if (modeIndex === 2) {
        modeValue.textContent = "Mixed";
        modeValue.style.color = "darkorange";
        mixedRow.style.display = "";
        mixedValue.textContent = gameReversed ? "Reversed" : "Normal";
        mixedValue.style.color = gameReversed ? "#b5179e" : "#00ffae";
    }

    // Players
    playersValue.textContent = playersIndex === 0 ? "Player Vs Computer" : "Player Vs Player";
}

function mixedModeRandomness() {
    if (modeIndex === 2) {
        if (Math.random() < reversalProbability) {
            playSound("Resources/Sound/Notification.mp3", 3000);
            if (!gameReversed) {
                displayAlertMessage("⏳🌀Suddenly, everything is twisted. Let the chaos begin!⏳", 3000, "purple", "white");
                gameReversed = true;
            }
            else {
                displayAlertMessage("⏳✅Suddenly, everything is reverted-back to normal!⏳", 3000, "white", "black");
                gameReversed = false;
            }
            console.log(`gameReverse: ${gameReversed}`);
        }
    }
}
// Helper: Get avatar image for player/computer
function getAvatar(type) {
    if (type === "player") return "Resources/Character/Character1.png";
    if (type === "computer") return "Resources/Character/Character2.png";
    return "";
}

// Helper: Get display name
function getDisplayName(type) {
    if (type === "player") return "Player 1";
    if (playersIndex === 0) return "Computer";
    return "Player 2";
}

// Show Winner Modal
function showWinnerModal(winnerType) {
    // Determine loser type
    const loserType = winnerType === "player" ? "computer" : "player";
    // Fill avatars and names
    winnerPlayerDiv.innerHTML = `
        <img class="winner-avatar" src="${getAvatar(winnerType)}" alt="${getDisplayName(winnerType)}"/>
        <span class="winner-name" style="color:#00b300;">${getDisplayName(winnerType)}<br><span style="font-size:1.3em;">🏆</span></span>
    `;
    winnerPlayerDiv.className = "winner-player winner";
    loserPlayerDiv.innerHTML = `
        <img class="winner-avatar" src="${getAvatar(loserType)}" alt="${getDisplayName(loserType)}"/>
        <span class="winner-name" style="color:#b5179e;">${getDisplayName(loserType)}</span>
    `;
    loserPlayerDiv.className = "winner-player loser";
    // Fill stats table
    winnerStatsTbody.innerHTML = `
      <tr>
        <td>${getDisplayName("player")}</td>
        <td>${stats.player.snakes}</td>
        <td>${stats.player.ladders}</td>
        <td>${stats.player.diceSum}</td>
        <td>${stats.player.lastRoll}</td>
      </tr>
      <tr>
        <td>${getDisplayName("computer")}</td>
        <td>${stats.computer.snakes}</td>
        <td>${stats.computer.ladders}</td>
        <td>${stats.computer.diceSum}</td>
        <td>${stats.computer.lastRoll}</td>
      </tr>
    `;
    // Show modal
    winnerModal.classList.remove('invisible');
    // Disable interaction with rest of UI
    document.body.classList.add('winner-modal-open');
    // Trap focus
    winnerNewGameBtn.focus();
}

// Hide Winner Modal
function hideWinnerModal() {
    winnerModal.classList.add('invisible');
    document.body.classList.remove('winner-modal-open');
}

// New Game: Go to settings
winnerNewGameBtn.onclick = () => {
    resetGame();
    hideWinnerModal();
    settingsBox.classList.remove("slide-out");
    backdrop.classList.remove("invisible");
};

// Share Result: Copy to clipboard
winnerShareBtn.onclick = () => {
    const winner = winnerPlayerDiv.querySelector('.winner-name').textContent.replace(/\s+/g, ' ').trim();
    const loser = loserPlayerDiv.querySelector('.winner-name').textContent.replace(/\s+/g, ' ').trim();
    const statsText = `🏆 ${winner} wins Snake & Ladder!\n\nStats:\nPlayer 1 - Snakes: ${stats.player.snakes}, Ladders: ${stats.player.ladders}, Dice Sum: ${stats.player.diceSum}, Last Roll: ${stats.player.lastRoll}\n${playersIndex === 0 ? "Computer" : "Player 2"} - Snakes: ${stats.computer.snakes}, Ladders: ${stats.computer.ladders}, Dice Sum: ${stats.computer.diceSum}, Last Roll: ${stats.computer.lastRoll}\n\nPlay now!`;
    navigator.clipboard.writeText(statsText).then(() => {
        winnerShareBtn.textContent = "Copied!";
        setTimeout(() => winnerShareBtn.textContent = "Share Result", 1200);
    });
};

// Prevent closing modal by clicking backdrop
backdrop.onclick = (e) => {
    // Do nothing
};

// Prevent tabbing out of modal
winnerModal.addEventListener('keydown', function (e) {
    if (e.key === "Tab") {
        e.preventDefault();
        winnerNewGameBtn.focus();
    }
});

// Prevent interaction with rest of UI while modal is open
document.body.addEventListener('click', function (e) {
    if (!winnerModal.classList.contains('invisible') && !winnerModal.contains(e.target)) {
        e.stopPropagation();
        e.preventDefault();
    }
}, true);

// Prevent scrolling while modal is open
const style = document.createElement('style');
style.innerHTML = `
body.winner-modal-open {
    overflow: hidden !important;
    pointer-events: none;
}
body.winner-modal-open .winner-modal,
body.winner-modal-open .winner-modal * {
    pointer-events: auto !important;
}
`;
document.head.appendChild(style);

function announceWinner(winnerType) {
    showWinnerModal(winnerType);
}

function showStatsBox(tokenType, event) {
    const s = stats[tokenType];
    statsBox.innerHTML = `
        <div class="token-stats-title">${tokenType === "player" ? "Player 1" : (playersIndex === 0 ? "Computer" : "Player 2")} Stats</div>
        <div class="token-stats-row"><span>🐍 Snakes:</span> <span>${s.snakes}</span></div>
        <div class="token-stats-row"><span>🪜 Ladders:</span> <span>${s.ladders}</span></div>
        <div class="token-stats-row"><span>🎲 Dice Sum:</span> <span>${s.diceSum}</span></div>
        <div class="token-stats-row"><span>🎯 Last Roll:</span> <span>${s.lastRoll}</span></div>
        <button class="close-stats-btn">✖</button>
    `;
    statsBox.classList.remove("invisible");

    // Position near the token (use event for mouse position, fallback to token position)
    let x = event.clientX, y = event.clientY;
    if (!x || !y) {
        const rect = event.target.getBoundingClientRect();
        x = rect.right + 10;
        y = rect.top + 10;
    }

    // --- Ensure the box stays within the viewport ---
    const boxWidth = 220; // Approximate width of your stats box
    const boxHeight = 180; // Approximate height of your stats box
    const padding = 12;

    // Default position
    let left = x + 10;
    let top = y - 10;

    // Adjust if overflowing right
    if (left + boxWidth > window.innerWidth - padding) {
        left = window.innerWidth - boxWidth - padding;
    }
    // Adjust if overflowing bottom
    if (top + boxHeight > window.innerHeight - padding) {
        top = window.innerHeight - boxHeight - padding;
    }
    // Adjust if overflowing left
    if (left < padding) left = padding;
    // Adjust if overflowing top
    if (top < padding) top = padding;

    statsBox.style.left = `${left}px`;
    statsBox.style.top = `${top}px`;

    // Close button
    statsBox.querySelector(".close-stats-btn").onclick = () => statsBox.classList.add("invisible");
}

// Hide stats box on click outside
document.addEventListener("click", (e) => {
    if (!statsBox.contains(e.target) && !e.target.classList.contains("player") && !e.target.classList.contains("computer")) {
        statsBox.classList.add("invisible");
    }
});

// --- Attach click listeners to tokens ---
player.addEventListener("click", (e) => {
    e.stopPropagation();
    showStatsBox("player", e);
});
computer.addEventListener("click", (e) => {
    e.stopPropagation();
    showStatsBox("computer", e);
});

function snakeAndLadderMovements(ele) {
    let [currRow, currCol] = getCoordinates(ele);
    let key = `${currRow},${currCol}`;
    let tokenType = (ele === player) ? "player" : "computer";
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
                    stats[tokenType].ladders += 1;
                }
                // Snake:
                newCoord = snakeMap[boardIndex].get(key);
                if (newCoord !== undefined) {
                    setCoordinates(ele, newCoord.row, newCoord.col);
                    playSound("Resources/Sound/Snake.mp3", 3000);
                    displayMessage("Eaten by the snake!", 3000, "red");
                    stats[tokenType].snakes += 1;
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
                    stats[tokenType].ladders += 1;
                }

                // Snake:
                newCoord = snakeMapReversed[boardIndex].get(key);
                if (newCoord !== undefined) {
                    setCoordinates(ele, newCoord.row, newCoord.col);
                    playSound("Resources/Sound/Snake.mp3", 3000);
                    displayMessage("Wait, the snake helped!?", 3000, "green");
                    stats[tokenType].snakes += 1;
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
    settingsBox.classList.remove("slide-out");
    backdrop.classList.remove("invisible");
    // settingsBox.disabled = true;
});

selectBoard.addEventListener("change", () => {
    boardImage.src = `Resources/Board/${selectBoard.value}.jpg`;
    boardChanged = true;
});

selectMode.addEventListener("change", () => {
    modeChanged = true;
    if (selectMode.selectedIndex === 2)
        reversalProbabilityContainer.classList.remove('invisible');
    else
        reversalProbabilityContainer.classList.add('invisible');
});

selectPlayers.addEventListener("change", () => {
    modeChanged = true;
})
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
    localStorage.setItem('playersIndex', playersIndex);
    localStorage.setItem('gameReversed', gameReversed);
    localStorage.setItem("stats", JSON.stringify(stats));
    // gameReversed is useful for determining the current state of the mixed-mode
    displayAlertMessage("The game has been SAVED!", 3000, "blue", "white");
});

loadGameButton.addEventListener("click", () => {

    //Checking if any save is there in the first place:
    if (localStorage.getItem('playersTurn') === null) {
        displayAlertMessage("NO saved game found!", 3000, "red", "white");
        return;
    }

    // Retrieving if there is a save file:
    let playersTurnStored = (localStorage.getItem('playersTurn') === 'true');
    let boardIndexStored = parseInt(localStorage.getItem('boardIndex'), 10);
    let modeIndexStored = parseInt(localStorage.getItem('modeIndex'), 10);
    let playersIndexStored = parseInt(localStorage.getItem('playersIndex'), 10);
    let gameReversedStored = (localStorage.getItem('gameReversed') === 'true');
    let statsStored = JSON.parse(localStorage.getItem("stats"));
    let playersX = parseInt(localStorage.getItem('playersX'), 10);
    let playersY = parseInt(localStorage.getItem('playersY'), 10);
    let computerX = parseInt(localStorage.getItem('computerX'), 10);
    let computerY = parseInt(localStorage.getItem('computerY'), 10);

    // Checking if any data is missing (i.e., if file is corrupted)
    for (let dataRetrieved of [playersTurnStored, boardIndexStored, modeIndexStored, playersIndexStored, gameReversedStored, statsStored, playersX, playersY, computerX, computerY]) {
        if (dataRetrieved === null || dataRetrieved === undefined || Number.isNaN(dataRetrieved)) {
            displayAlertMessage("The game CANNOT be loaded because it is corrupted!", 3000, "red", "white");
            return;
        }
    }

    // Updating only if no issues found in the loaded data:
    playersTurn = playersTurnStored;
    boardIndex = boardIndexStored;
    modeIndex = modeIndexStored;
    playersIndex = playersIndexStored;
    gameReversed = gameReversedStored;
    stats = statsStored;
    selectBoard.selectedIndex = boardIndex;
    selectMode.selectedIndex = modeIndex;
    selectPlayers.selectedIndex = playersIndex;
    game.style.backgroundImage = `url("Resources/Board/Board-${boardIndex + 1}.jpg")`;
    boardImage.src = `Resources/Board/Board-${boardIndex + 1}.jpg`;
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
    else {
        displayAlertMessage(`The game has been LOADED in MIXED: ${gameReversed ? 'Reversed' : 'Normal'}!`, 4000, "darkorange", "black");
        reversalProbabilityContainer.classList.remove("invisible");
    }
    modeChanged = false; //Because on loading we don't want to force-reset otherwise no worth in it!
    updateTurnInfoBox();
});

clearGameButton.addEventListener("click", () => {
    displayAlertMessage("⚠️ Warning! Double click to DELETE the stored save file!", 4000, "red", "white");
});

clearGameButton.addEventListener("dblclick", () => {
    localStorage.clear();
    displayAlertMessage("The game has been CLEARED!", 4000, "red", "white");
});

forcedRollCheckbox.addEventListener("click", () => {
    diceForcedOptions.classList.toggle("invisible");
});

resetButton.addEventListener("click", () => {
    resetGame();
});

saveSettingsButton.addEventListener("click", () => {

    backdrop.classList.add("invisible");
    if (modeChanged || boardChanged) {
        resetGame();
    }
    boardIndex = selectBoard.selectedIndex;
    modeIndex = selectMode.selectedIndex;
    playersIndex = selectPlayers.selectedIndex;
    reversalProbability = parseInt(reversalProbabilityInput.value);
    if (isNaN(reversalProbability)) {
        reversalProbabilityInput.value = 0; //If field is left empty
        reversalProbability = 0;
    }
    else
        reversalProbability = reversalProbability / 100;
    console.log('The reversal probability:', reversalProbability);
    game.style.backgroundImage = `url(Resources/Board/${selectBoard.value}.jpg)`;
    settingsBox.classList.add("slide-out");
    // settingsBox.disabled = false;

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
    updateTurnInfoBox();
});

openCreditsButton.addEventListener("click", () => {
    creditsBox.classList.remove("slide-out");
});

closeCreditsButton.addEventListener("click", () => {
    creditsBox.classList.add("slide-out");
});

openInfoButton.addEventListener("click", () => {
    infoBox.classList.remove("slide-out");
});

closeInfoButton.addEventListener("click", () => {
    infoBox.classList.add("slide-out");
});

// Validate Probability Input
reversalProbabilityInput.addEventListener("input", () => {
    let value = parseInt(reversalProbabilityInput.value, 10);
    if (value < 0) reversalProbabilityInput.value = 0;
    else if (value > 100) reversalProbabilityInput.value = 100;
});

// ***************************************** Rolling region **********************************************

// skipEnablingButtons being true implies that it doesn't need to re-enable them.
// Not enabling is useful when computer's turn is there just after.
function mainFunction(skipEnablingButtons = false) {
    rollButton.disabled = true; // disable rollButton during roll
    resetButton.disabled = true; // disable resetButton during roll
    let forced = forcedRollCheckbox.checked;
    let value1 = parseInt(diceNumberInput1.value);
    let value2 = parseInt(diceNumberInput2.value);

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
        // Update the token's stats once the roll ends
        console.log("Final dice value:", diceValueMinus1 + 1);
        if (playersTurn) {
            stats.player.lastRoll = diceValueMinus1 + 1;
            stats.player.diceSum += diceValueMinus1 + 1;
        } else {
            stats.computer.lastRoll = diceValueMinus1 + 1;
            stats.computer.diceSum += diceValueMinus1 + 1;
        }

        // If mixed mode, then sudden reversal possibility just after dice roll concluded:
        mixedModeRandomness();

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
        ele.style.zIndex = "4";
        if ((currRow !== 1) || (currRow === 1 && (currCol - (diceValueMinus1 + 1)) > 0)) {
            for (let move = 0; move < diceValueMinus1 + 1; move++) {
                setTimeout(() => {
                    moveTokenByOne(ele);
                }, move * delay_ms * 2);
            }
        }
        ele.style.zIndex = playersTurn ? "3" : "2";

        setTimeout(() => {
            // After movement:
            // Snake and Ladder Movements for both tokens (sudden reversal may affect the other player too!)
            snakeAndLadderMovements(player);
            snakeAndLadderMovements(computer);

            // If overlapping now
            if (overLap()) player.classList.add("overlap");
            if (getCoordinates(ele)[0] === 1 && getCoordinates(ele)[1] === 1) {
                winnerDecided = true;
                playSound("Resources/Sound/Victory.wav");
                announceWinner(playersTurn ? "player" : "computer");
                rollButton.disabled = false;
                resetButton.disabled = false;
                return;
            }
            playersTurn = !playersTurn;
            setTimeout(() => {
                player.classList.toggle("indicate-turn-first");
                computer.classList.toggle("indicate-turn-second");
            }, 200);

            // Enabling the game buttons only after the animation ends and no computers turn thereafter
            if (!winnerDecided && !skipEnablingButtons) {
                resetButton.disabled = false;
                rollButton.disabled = false;
            }
            updateTurnInfoBox();
        }, (diceValueMinus1 + 1) * delay_ms * 2);
    }, offset * delay_ms);
}

rollButton.addEventListener("click", () => {
    //enableSkip being true means that after the current roll is completed, we don't re-enable the rolling and reset buttons
    let enableSkip = (playersIndex === 0) ? true : false;
    mainFunction(enableSkip); //Player 1

    let totalAnimationTime = (offset * delay_ms) + ((diceValueMinus1 + 1) * delay_ms * 2);
    if (playersIndex == 0) {
        setTimeout(() => {
            if (!winnerDecided)
                mainFunction(false);
        }, totalAnimationTime + 500); // 500 ms is the gap time
    }
});

document.addEventListener("keydown", (event) => {
    if (!rollButton.disabled) {
        if ((playersTurn && event.code === 'ControlLeft') || (playersIndex === 1 && !playersTurn && event.code == 'ControlRight')) {
            //enableSkip being true means that after the current roll is completed, we don't re-enable the rolling and reset buttons
            let enableSkip = (playersIndex === 0) ? true : false;
            mainFunction(enableSkip); //Player 1

            let totalAnimationTime = (offset * delay_ms) + ((diceValueMinus1 + 1) * delay_ms * 2);
            if (playersIndex == 0) {
                setTimeout(() => {
                    if (!winnerDecided)
                        mainFunction(false);
                }, totalAnimationTime + 500); // 500 ms is the gap time
            }
        }
    }
});

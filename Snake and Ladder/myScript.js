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
let timerDisplay = document.querySelector("#timer-display");
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
let extraTurnForSixCheckbox = document.querySelector('input[name="extra-turn-for-six"]');
let unlockForSixOnlyCheckbox = document.querySelector('input[name="unlock-for-six-only"]');
let rollOnTimeoutCheckbox = document.querySelector('input[name="roll-on-timeout"]');
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
let arrow = document.querySelector("#turn-indicator-arrow");
let playerLocked = true;
let computerLocked = true;
player.append(arrow);
const statsBox = document.createElement("div");
statsBox.className = "token-stats-box invisible";
document.body.append(statsBox);
// Dynamic variables' declaration and initializations:

// Settings variables:
let offset;
let winnerDecided = false; // Used for determining when the roll and reset button should be enabled back
let delay_ms = 75; // delay_ms between steps in ms
let boardChanged = false;
let modeChanged = false;
let unlockForSixOnlyChanged = false;
let boardIndex = 0;
let gameReversed = false;
let modeIndex = 0;
let reversalProbability = 0.10;
let playersIndex = 0; // The option corresponding to the PVP or PVC
let timerID = null;
let timeLeft = 15;
rollButton.disabled = true;
resetButton.disabled = true;
player.style.zIndex = "3";
computer.style.zIndex = "2";

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


function resetTimer() {
    timeLeft = 15;
    timerDisplay.innerHTML = `<div>00:${timeLeft}</div>`;
}
function stopTimer() {
    clearInterval(timerID);
}
function startTimer() {
    // Starts after stopping and resetting only!
    stopTimer();
    resetTimer();
    timerID = setInterval(() => {
        timeLeft--;
        if (timeLeft < 10)
            timerDisplay.innerHTML = `<div>00:0${timeLeft}</div>`;
        else
            timerDisplay.innerHTML = `<div>00:${timeLeft}</div>`;

        if (timeLeft == 0) {
            //Everytime mainFunction is called, it automatically stops and resets the timer
            mainFunction();
        }
    }, 1000);
}

// Does NOT reset Settings (Board, Mode, Volume, Forced-Roll, etc)!
function resetGame() {
    for (let dice of dices)
        dice.classList.remove("highlight");

    if (rollOnTimeoutCheckbox.checked)
        startTimer();
    playerLocked = true;
    computerLocked = true;
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
    if (unlockForSixOnlyCheckbox.checked) {
        player.innerHTML = "<div>🔒</div>";
        computer.innerHTML = "<div>🔒</div>";
        player.classList.add("inactive");
        computer.classList.add("inactive");
    }
    else {
        player.innerHTML = "";
        computer.innerHTML = "";
        player.classList.remove("inactive");
        computer.classList.remove("inactive");
    }
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

function isTokenUnlocked(ele) {
    if (ele === player)
        return (!unlockForSixOnlyCheckbox.checked) || (unlockForSixOnlyCheckbox.checked && !playerLocked);
    else
        return (!unlockForSixOnlyCheckbox.checked) || (unlockForSixOnlyCheckbox.checked && !computerLocked);
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
    resetTimer();
    stopTimer();
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

function getCellCenter(row, col) {
    const gameRect = game.getBoundingClientRect();
    const rows = 10, cols = 10;
    const cellWidth = gameRect.width / cols;
    const cellHeight = gameRect.height / rows;
    return {
        x: gameRect.left + (col - 0.5) * cellWidth,
        y: gameRect.top + (row - 0.5) * cellHeight
    };
}

async function animateTokenDirect(ele, destRow, destCol, isLadder, duration = 500) {
    const [currRow, currCol] = getCoordinates(ele);
    const from = getCellCenter(currRow, currCol);
    const to = getCellCenter(destRow, destCol);

    const dx = to.x - from.x;
    const dy = to.y - from.y;

    if (isLadder) {
        ele.style.transition = `transform ${duration}ms linear`;
        ele.style.transform = `translate(${dx}px, ${dy}px)`;
    }
    else {
        ele.style.transition = `transform ${duration}ms linear, rotate ${duration}ms ease-in-out`;
        ele.style.transform = `translate(${dx}px, ${dy}px) rotate(720deg)`;
    }

    await new Promise((res) => setTimeout(res, duration));

    ele.style.transition = 'none';
    ele.style.transform = '';
    setCoordinates(ele, destRow, destCol);
    // Do NOT set ele.style.transition = '' here!
}

async function snakeAndLadderMovements(ele) {
    let [currRow, currCol] = getCoordinates(ele);
    let key = `${currRow},${currCol}`;
    let tokenType = (ele === player) ? "player" : "computer";
    let newCoord;

    if (getCoordinates(ele)[0] !== 1 || getCoordinates(ele)[1] !== 1) {
        switch (gameReversed) {
            case false:
                newCoord = ladderMap[boardIndex].get(key);
                if (newCoord !== undefined) {
                    playSound("Resources/Sound/Ladder.mp3", 3000);
                    displayMessage("Climbed-up the ladder!", 3000, "green");
                    await animateTokenDirect(ele, newCoord.row, newCoord.col, true);
                    stats[tokenType].ladders += 1;
                }
                newCoord = snakeMap[boardIndex].get(key);
                if (newCoord !== undefined) {
                    playSound("Resources/Sound/Snake.mp3", 3000);
                    displayMessage("Eaten by the snake!", 3000, "red");
                    await animateTokenDirect(ele, newCoord.row, newCoord.col, false);
                    stats[tokenType].snakes += 1;
                }
                break;
            case true:
                newCoord = ladderMapReversed[boardIndex].get(key);
                if (newCoord !== undefined) {
                    playSound("Resources/Sound/Ladder.mp3", 3000);
                    displayMessage("Tripped down the ladder!", 3000, "red");
                    await animateTokenDirect(ele, newCoord.row, newCoord.col, true);
                    stats[tokenType].ladders += 1;
                }
                newCoord = snakeMapReversed[boardIndex].get(key);
                if (newCoord !== undefined) {
                    playSound("Resources/Sound/Snake.mp3", 3000);
                    displayMessage("Wait, the snake helped!?", 3000, "green");
                    await animateTokenDirect(ele, newCoord.row, newCoord.col, false);
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
    stopTimer();
    resetTimer();
    rollButton.disabled = true;
    resetButton.disabled = true;
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
    localStorage.setItem('playersIndex', playersIndex);
    localStorage.setItem('gameReversed', gameReversed);
    localStorage.setItem('unlockForSixOnlyCheckboxChecked', unlockForSixOnlyCheckbox.checked);
    localStorage.setItem('extraTurnForSixCheckboxChecked', extraTurnForSixCheckbox.checked);
    localStorage.setItem('playerLocked', playerLocked);
    localStorage.setItem('computerLocked', computerLocked);
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
    let unlockForSixOnlyCheckboxCheckedStored = (localStorage.getItem('unlockForSixOnlyCheckboxChecked') === 'true');
    let extraTurnForSixCheckboxCheckedStored = (localStorage.getItem('extraTurnForSixCheckboxChecked') === 'true');
    let playerLockedStored = (localStorage.getItem('playerLocked') === 'true');
    let computerLockedStored = (localStorage.getItem('computerLocked') === 'true');
    let statsStored = JSON.parse(localStorage.getItem("stats"));

    let playersX = parseInt(localStorage.getItem('playersX'), 10);
    let playersY = parseInt(localStorage.getItem('playersY'), 10);
    let computerX = parseInt(localStorage.getItem('computerX'), 10);
    let computerY = parseInt(localStorage.getItem('computerY'), 10);

    // Checking if any data is missing (i.e., if file is corrupted)
    for (let dataRetrieved of [playersTurnStored, boardIndexStored, modeIndexStored, playersIndexStored, gameReversedStored, statsStored, playersX, playersY, computerX, computerY, unlockForSixOnlyCheckboxCheckedStored, extraTurnForSixCheckboxCheckedStored, playerLockedStored, computerLockedStored]) {
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
    unlockForSixOnlyCheckbox.checked = unlockForSixOnlyCheckboxCheckedStored;
    extraTurnForSixCheckbox.checked = extraTurnForSixCheckboxCheckedStored;
    playerLocked = playerLockedStored;
    computerLocked = computerLockedStored;
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
        arrow.style.borderTop = '10px solid darkgreen';
        player.append(arrow);
    }
    else {
        player.classList.remove("indicate-turn-first");
        computer.classList.add("indicate-turn-second");
        arrow.style.borderTop = '10px solid #301934';
        computer.append(arrow);
    }

    if (!isTokenUnlocked(player)) {
        player.innerHTML = "<div>🔒</div>";
        player.classList.add("inactive");
    }
    else {
        player.innerHTML = "";
        player.classList.remove("inactive");
    }
    if (!isTokenUnlocked(computer)) {
        computer.innerHTML = "<div>🔒</div>";
        computer.classList.add("inactive");
    }
    else {
        computer.innerHTML = "";
        computer.classList.remove("inactive");
    }

    // Alert Messages:
    if (modeIndex === 0)
        displayAlertMessage("The game has been LOADED in CLASSIC!", 3000, "white", "black");
    else if (modeIndex === 1)
        displayAlertMessage("The game has been LOADED in REVERSED!", 3000, "purple", "white");
    else {
        displayAlertMessage(`The game has been LOADED in MIXED: ${gameReversed ? 'Reversed' : 'Normal'}!`, 3000, "darkorange", "black");
        reversalProbabilityContainer.classList.remove("invisible");
    }
    modeChanged = false; //Because on loading we don't want to force-reset otherwise no worth in it!
    updateTurnInfoBox();
});

clearGameButton.addEventListener("click", () => {
    displayAlertMessage("⚠️ Warning! Double click to DELETE the stored save file!", 3000, "red", "white");
});

clearGameButton.addEventListener("dblclick", () => {
    localStorage.clear();
    displayAlertMessage("The game has been CLEARED!", 3000, "red", "white");
});

unlockForSixOnlyCheckbox.addEventListener("click", () => {
    if (unlockForSixOnlyCheckbox.checked) {
        player.innerHTML = "<div>🔒</div>";
        computer.innerHTML = "<div>🔒</div>";
        player.classList.add("inactive");
        computer.classList.add("inactive");
    }
    else {
        player.innerHTML = "";
        computer.innerHTML = "";
        player.classList.remove("inactive");
        computer.classList.remove("inactive");
    }
    unlockForSixOnlyChanged = true;
});

forcedRollCheckbox.addEventListener("click", () => {
    diceForcedOptions.classList.toggle("invisible");
});

resetButton.addEventListener("click", () => {
    resetGame();
});

saveSettingsButton.addEventListener("click", () => {

    backdrop.classList.add("invisible");
    if (modeChanged || boardChanged || unlockForSixOnlyChanged) {
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
    game.style.backgroundImage = `url(Resources/Board/${selectBoard.value}.jpg)`;
    settingsBox.classList.add("slide-out");
    // settingsBox.disabled = false;

    // Mode-change message only when the mode and/or the board settings are changed!
    if (modeChanged || boardChanged || unlockForSixOnlyChanged || gameStarting) {

        playSound("Resources/Sound/Notification.mp3", 3000);
        if (modeIndex === 0) {
            displayAlertMessage("✅Everything is completely normal.", 3000, "white", "black");
            if (stats.player.diceSum === 0 && stats.computer.diceSum === 0)
                gameReversed = false;
        }
        else if (modeIndex === 1) {
            displayAlertMessage("🌀Everything is twisted. Let the chaos begin!", 3000, "purple", "white");
            if (stats.player.diceSum === 0 && stats.computer.diceSum === 0)
                gameReversed = true;
        }
        else if (modeIndex === 2) {
            displayAlertMessage("❓For now, everything 'seems' normal!", 3000, "darkorange", "black");
            if (stats.player.diceSum === 0 && stats.computer.diceSum === 0)
                gameReversed = false;
            // We don't reset gameReversed when mixed game is loaded
        }
        modeChanged = false;
        boardChanged = false;
        unlockForSixOnlyChanged = false;
        gameStarting = false;
    }
    updateTurnInfoBox();

    if (playersIndex == 1 || playersIndex == 0 && playersTurn) {
        rollButton.disabled = false;
        resetButton.disabled = false;
    }
    if (rollOnTimeoutCheckbox.checked) startTimer();
});

rollOnTimeoutCheckbox.addEventListener("click", () => {
    stopTimer();
    resetTimer();
    timerDisplay.classList.toggle('invisible');
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

function diceRollingPromise() {
    return new Promise((resolve, reject) => {
        let forced = forcedRollCheckbox.checked;
        let value1 = parseInt(diceNumberInput1.value);
        let value2 = parseInt(diceNumberInput2.value);

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
        setTimeout(() => {
            console.log("Final dice value:", diceValueMinus1 + 1);
            resolve();
        }, offset * delay_ms);
    });
}

function incrementalMovementsPromise(ele, old) {
    return new Promise((resolve, reject) => {
        let [currRow, currCol] = getCoordinates(ele);
        setCoordinates(old, currRow, currCol); // Moving the shadow to current location

        let canMove = ((currRow !== 1) || (currRow === 1 && (currCol - (diceValueMinus1 + 1)) > 0));
        if (canMove) {
            for (let move = 0; move < diceValueMinus1 + 1; move++) {
                setTimeout(() => {
                    moveTokenByOne(ele);
                }, move * delay_ms * 2);
            }
            // Resolve after an extra (1 * delay_ms * 2)
            setTimeout(() => {
                resolve();
            }, (diceValueMinus1 + 1) * delay_ms * 2);
        }
        else {
            // Resolve after an extra (1 * delay_ms * 2)
            setTimeout(() => {
                // Taking the current token to its original zIndex
                resolve();
            }, 1 * delay_ms * 2);
        }
    });
}

function checkWinnerDecidedAndRunAnimation(ele) {
    let onWinningTile = (getCoordinates(ele)[0] === 1 && getCoordinates(ele)[1] === 1);
    if (onWinningTile) {
        winnerDecided = true;
        playSound("Resources/Sound/Victory.wav");
        announceWinner(playersTurn ? "player" : "computer");
        stopTimer();
        resetTimer();
    }
}

// ***************************************** Rolling region **********************************************
async function mainFunction() {

    stopTimer();
    resetTimer();
    let ele = (playersTurn) ? player : computer; //Refers to the current player
    let old = (playersTurn) ? playerOld : computerOld; //Refers to the current player's shadow

    /* Before the dice roll */
    // Showing which token is about to move by simply making it appear above the other token(s)
    ele.style.zIndex = "99";
    if (overLap()) player.classList.remove("overlap");

    /* During the dice roll */
    rollButton.disabled = true; // disable rollButton during roll
    resetButton.disabled = true; // disable resetButton during roll
    await diceRollingPromise();

    /* After the dice roll */
    // If mixed mode, then sudden reversal possibility just after dice roll concluded
    mixedModeRandomness();

    // Update the token's stats once the roll ends
    if (playersTurn) {
        stats.player.lastRoll = diceValueMinus1 + 1;
        if (isTokenUnlocked(player)) stats.player.diceSum += diceValueMinus1 + 1;
    } else {
        stats.computer.lastRoll = diceValueMinus1 + 1;
        if (isTokenUnlocked(computer)) stats.computer.diceSum += diceValueMinus1 + 1;
    }
    updateTurnInfoBox(); //For mixed mode reversals

    /* Token movements */
    // Pre-incremental movement: Snake and Ladder Movements for both tokens (sudden reversal may affect the other player too!)
    await snakeAndLadderMovements(player);
    await snakeAndLadderMovements(computer);
    checkWinnerDecidedAndRunAnimation(player);
    checkWinnerDecidedAndRunAnimation(computer);

    // Incremental movements: The basic token movements for the current token only.
    // Possible that sudden reversal caused the current token or another token to reach the 100 by ladder/snake (i.e., the winner got decided). Thus, we should not allow the current token to move in that case.
    if (!winnerDecided && isTokenUnlocked(ele)) {
        await incrementalMovementsPromise(ele, old);
        checkWinnerDecidedAndRunAnimation(ele);
    }

    // Post-incremental movement: Snake and Ladder Movements are now only possible for the current token as only it went through a change in position.
    // Possible that the winner (who is the current token) got decided due to the incremental movements.
    if (!winnerDecided && isTokenUnlocked(ele)) {
        await snakeAndLadderMovements(ele);
        checkWinnerDecidedAndRunAnimation(ele);
    }

    // Taking the current token to its original zIndex
    if (overLap()) player.classList.add("overlap");
    ele.style.zIndex = playersTurn ? "3" : "2";

    // Unlocking the token (if required) after the dice roll
    if (!isTokenUnlocked(ele) && diceValueMinus1 === 5) {
        ele.classList.remove("inactive");
        ele.innerText = "";
        playersTurn ? (playerLocked = false) : (computerLocked = false);
        playSound("Resources/Sound/Notification.mp3", 1000);
        displayMessage("🎲 Token unlocked due to a six ⭐!", 1000, "#1A237E", "white");
        // Waiting for sometime because, if extra turn for six is toggled as well, this message will be overwritten immediately
        await new Promise((res) => setTimeout(res, 1000));
    }

    // Give the dice to the next token only if necessary
    if ((!extraTurnForSixCheckbox.checked) || (extraTurnForSixCheckbox.checked && diceValueMinus1 != 5)) {
        playersTurn = !playersTurn;
        if (playersTurn) {
            arrow.style.borderTop = '10px solid darkgreen';
            player.append(arrow);
        }
        else {
            arrow.style.borderTop = '10px solid #301934';
            computer.append(arrow);
        }
        player.classList.toggle("indicate-turn-first");
        computer.classList.toggle("indicate-turn-second");
    }
    else {
        playSound("Resources/Sound/Notification.mp3", 2000);
        displayMessage("🎲 Extra turn for a six ⭐!", 2000, "#1A237E", "white");
    }
    updateTurnInfoBox();
    // Don't pass the next turn yet
    await new Promise((res) => setTimeout(res, 500));

    if (rollOnTimeoutCheckbox.checked && !winnerDecided)
        startTimer();
    // If the computer has its own token and it is the computer's turn now
    if (playersIndex == 0 && !playersTurn && !winnerDecided) {
        await mainFunction();
    }
    if (!winnerDecided) {
        resetButton.disabled = false;
        rollButton.disabled = false;
    }
}

rollButton.addEventListener("click", mainFunction);

document.addEventListener("keydown", (event) => {
    if (!rollButton.disabled) {
        if ((playersTurn && event.code === 'ControlLeft') || (playersIndex === 1 && !playersTurn && event.code == 'ControlRight')) {
            mainFunction();
        }
    }
});

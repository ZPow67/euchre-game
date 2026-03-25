// ---- DISPLAY.JS ----
// Responsible for: everything that shows on screen

// Maps a seat index to a visual slot name relative to the local player.
// offset 0 = me (bottom), 1 = left, 2 = across (top), 3 = right
function getDisplaySlot(seatIndex) {
    const offset = (seatIndex - myLocalSeatIndex + 4) % 4
    return ['player', 'opponent1', 'partner', 'opponent2'][offset]
}

function createCardHTML(card) {
    const suitSymbols = {
        "Hearts":   { symbol: "♥", color: "red" },
        "Diamonds": { symbol: "♦", color: "red" },
        "Spades":   { symbol: "♠", color: "black" },
        "Clubs":    { symbol: "♣", color: "black" }
    }
    const suit = suitSymbols[card.suit]
    return `
        <div class="card ${suit.color}">
            <div>${card.rank}</div>
            <div>${suit.symbol}</div>
        </div>
    `
}

function displayHand(cards, elementId, faceDown = false) {
    const container = document.getElementById(elementId)
    container.innerHTML = ""
    for (let card of cards) {
        if (faceDown) {
            container.innerHTML += `<div class="card-back"></div>`
        } else {
            container.innerHTML += createCardHTML(card)
        }
    }
}

function displayFaceUpCard(card) {
    const container = document.getElementById("face-up-card")
    container.innerHTML = createCardHTML(card)
}

function showButtons(buttons) {
    const container = document.getElementById("action-buttons")
    container.innerHTML = ""
    for (let btn of buttons) {
        container.innerHTML += `
            <button onclick="${btn.action}">${btn.label}</button>
        `
    }
}

function hideButtons() {
    const container = document.getElementById("action-buttons")
    container.innerHTML = ""
}

function showMessage(message) {
    const container = document.getElementById("game-message")
    container.innerHTML = message
}

function makeHandClickable(action, validIndices = null) {
    const cards = document.querySelectorAll(`#hand-${getDisplaySlot(myLocalSeatIndex)} .card`)
    cards.forEach((cardElement, index) => {
        const isValid = validIndices === null || validIndices.includes(index)
        
        if (isValid) {
            // Valid card — blue outline, pointer cursor
            cardElement.style.cursor = "pointer"
            cardElement.style.opacity = "1"
            cardElement.style.outline = "2px solid #5b9bd5"
        } else {
            // Invalid card — greyed out, not allowed
            cardElement.style.cursor = "not-allowed"
            cardElement.style.opacity = "0.4"
            cardElement.style.outline = "none"
        }
        
        cardElement.onclick = () => window[action](index)
    })
}

function makeHandUnclickable() {
    const cards = document.querySelectorAll(`#hand-${getDisplaySlot(myLocalSeatIndex)} .card`)
    cards.forEach(card => {
        card.style.cursor = "default"
        card.style.outline = "none"
        card.style.opacity = "1"
        card.onclick = null
    })
}

function displayScore() {
    document.getElementById("score-team1").innerHTML = scoreTeam1
    document.getElementById("score-team2").innerHTML = scoreTeam2
}

function displayDealer() {
    for (let i = 0; i < 4; i++) {
        const slot = getDisplaySlot(i)
        const el = document.getElementById("name-" + slot)
        let badges = ""
        if (i === dealerIndex)  badges += ` <span class="dealer-badge">D</span>`
        if (i === ordererIndex) badges += ` <span class="orderer-badge">O</span>`
        el.innerHTML = players[i].name + badges
    }
}

function displayTrump() {
    const suitSymbols = {
        "Hearts":   "♥ Hearts",
        "Diamonds": "♦ Diamonds",
        "Spades":   "♠ Spades",
        "Clubs":    "♣ Clubs"
    }
    const container = document.getElementById("trump-indicator")
    container.innerHTML = `Trump: ${suitSymbols[trumpSuit]}`
}

function displayPlayedCard(playerIndex, card) {
    const animMap = { player: "card-slide-up", opponent1: "card-slide-right", partner: "card-slide-down", opponent2: "card-slide-left" }
    const slotName = getDisplaySlot(playerIndex)
    const slotEl = document.getElementById("played-" + slotName)
    slotEl.innerHTML = createCardHTML(card)
    const cardEl = slotEl.querySelector('.card')
    if (cardEl) cardEl.classList.add(animMap[slotName])
}

function clearPlayedCards() {
    const slots = ["played-player", "played-opponent1",
                   "played-partner", "played-opponent2"]
    for (let slot of slots) {
        document.getElementById(slot).innerHTML = ""
    }
}

function animateTrickWinner(winnerIndex) {
    // Brief winner highlight, then fly all cards toward them
    const winnerSlot = document.getElementById("played-" + getDisplaySlot(winnerIndex))
    winnerSlot.style.border = "2px solid #5b9bd5"
    setTimeout(() => {
        winnerSlot.style.border = ""
        animateTrickWin(winnerIndex)
    }, 500)
}

function displaySittingOut(playerIndex) {
    const container = document.getElementById("hand-" + getDisplaySlot(playerIndex))
    container.innerHTML = `<p class="sitting-out">🪑 Sitting Out</p>`
}

function invalidCardFeedback(index) {
    const cards = document.querySelectorAll(`#hand-${getDisplaySlot(myLocalSeatIndex)} .card`)
    const card = cards[index]
    if (card) {
        card.classList.add("invalid-card")
        setTimeout(() => card.classList.remove("invalid-card"), 400)
    }
}

function updateDebug() {
    document.getElementById("debug-trump").innerHTML = trumpSuit || "-"
    document.getElementById("debug-lead").innerHTML = leadSuit || "-"
    document.getElementById("debug-bidround").innerHTML = biddingRound || "-"
    document.getElementById("debug-player").innerHTML = players[currentPlayerIndex]?.name || "-"
    document.getElementById("debug-dealer").innerHTML = players[dealerIndex]?.name || "-"
    document.getElementById("debug-tricks").innerHTML = tricksPlayed || "0"
    document.getElementById("debug-t1tricks").innerHTML = tricksTeam1 || "0"
    document.getElementById("debug-t2tricks").innerHTML = tricksTeam2 || "0"
    document.getElementById("debug-offence").innerHTML = team1IsOffence ? "Team 1" : "Team 2"
}
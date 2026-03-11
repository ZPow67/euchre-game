// ---- DISPLAY.JS ----
// Responsible for: everything that shows on screen

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

function makeHandClickable(action) {
    const cards = document.querySelectorAll("#hand-player .card")
    cards.forEach((cardElement, index) => {
        cardElement.style.cursor = "pointer"
        cardElement.style.outline = "2px solid #b8860b"
        cardElement.onclick = () => window[action](index)
    })
}

function makeHandUnclickable() {
    const cards = document.querySelectorAll("#hand-player .card")
    cards.forEach(card => {
        card.style.cursor = "default"
        card.style.outline = "none"
        card.onclick = null
    })
}

function displayScore() {
    document.getElementById("score-team1").innerHTML = scoreTeam1
    document.getElementById("score-team2").innerHTML = scoreTeam2
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
    const slotMap = {
        0: "played-player",
        1: "played-opponent1",
        2: "played-partner",
        3: "played-opponent2"
    }
    const slot = document.getElementById(slotMap[playerIndex])
    slot.innerHTML = createCardHTML(card)
}

function clearPlayedCards() {
    const slots = ["played-player", "played-opponent1",
                   "played-partner", "played-opponent2"]
    for (let slot of slots) {
        document.getElementById(slot).innerHTML = ""
    }
}

function animateTrickWinner(winnerIndex) {
    const slotMap = {
        0: "played-player",
        1: "played-opponent1",
        2: "played-partner",
        3: "played-opponent2"
    }
    const winnerSlot = document.getElementById(slotMap[winnerIndex])
    winnerSlot.style.border = "2px solid #b8860b"
    setTimeout(() => {
        winnerSlot.style.border = ""
        clearPlayedCards()
    }, 1000)
}

function displaySittingOut(playerIndex) {
    const elementMap = {
        0: "hand-player",
        1: "hand-opponent1",
        2: "hand-partner",
        3: "hand-opponent2"
    }
    const container = document.getElementById(elementMap[playerIndex])
    container.innerHTML = `<p class="sitting-out">🪑 Sitting Out</p>`
}

function invalidCardFeedback(index) {
    const cards = document.querySelectorAll("#hand-player .card")
    const card = cards[index]
    if (card) {
        card.classList.add("invalid-card")
        setTimeout(() => card.classList.remove("invalid-card"), 400)
    }
}
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
    cards.forEach((card, index) => {
        card.onclick = () => window[action](index)
    })
}

function makeHandUnclickable() {
    const cards = document.querySelectorAll("#hand-player .card")
    cards.forEach(card => {
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
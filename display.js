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
    const container = document.getElementById("action-buttons")
    container.innerHTML = `<p class="message">${message}</p>`
}
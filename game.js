// ---- THE DECK ----
const ranks = ["9", "10", "J", "Q", "K", "A"]
const suits = ["Hearts", "Clubs", "Spades", "Diamonds"]
let trumpsuit = null
let leftBowerSuit = null // Store left bower suit globally

const deck = []
for (let suit of suits) {
    for (let rank of ranks) {
        deck.push({ rank: rank, suit: suit })
    }
}

function getLeftBowerSuit(trumpSuit) {
    const pairs = {
        "Hearts": "Diamonds",
        "Diamonds": "Hearts",
        "Spades": "Clubs",
        "Clubs": "Spades"
    }
    return pairs[trumpSuit]
}

// ---- SHUFFLE ---- 
function shuffleDeck(deck) {
    for (let i = 0; i < 24; i++) {
        let posA = Math.floor(Math.random() * 24)
        let posB = Math.floor(Math.random() * 24)

        let temp = deck[posA]
        deck[posA] = deck[posB]
        deck[posB] = temp
    }

    // italian cut!
    let cut = deck.splice(0, 12)
    deck.push(...cut)

    return deck
}

// ---- PLAYERS ----
const players = [
    { name: "You",        hand: [], team: 1, tricksWon: 0 },
    { name: "Opponent 1", hand: [], team: 2, tricksWon: 0 },
    { name: "Partner",    hand: [], team: 1, tricksWon: 0 },
    { name: "Opponent 2", hand: [], team: 2, tricksWon: 0 }
]

// ---- DEAL ----
function dealCards(deck, players) {
    for (let card = 0; card < 5; card++) {
        for (let i = 1; i <= 4; i++) {
            let playerIndex = i % 4
            players[playerIndex].hand.push(deck.pop())
        }
    }

    let topCard = deck.pop()
    return topCard
}

function getCardPower(card, trumpSuit, leadSuit) {
    // Use global leftBowerSuit variable
    // Check if card is Right Bower
    if (card.rank === "J" && card.suit === trumpSuit) {
        return 14
    }

    // Check if card is Left Bower
    if (card.rank === "J" && card.suit === leftBowerSuit) {
        return 13
    }

    // Check if card is any other trump card
    if (card.suit === trumpSuit) {
        const trumpPower = {"9":8, "10":9, "Q":10, "K":11, "A":12}
        return trumpPower[card.rank]
    }

    // Check if card matches lead suit
    if (card.suit === leadSuit) {
        const leadPower = {"9":2, "10":3, "J":4, "Q":5, "K":6, "A":7}
        return leadPower[card.rank]
    }

    // Otherwise garbage card
    return 0
}

function hasLeadSuit(hand, leadSuit) {
    // Use global leftBowerSuit variable
    for (let card of hand) {
        // Left bower doesn't count as its original suit!
        if (card.rank === "J" && card.suit === leftBowerSuit) {
            continue
        }
        // Found a lead suit card!
        if (card.suit === leadSuit) {
            return true
        }
    }
    // No lead suit cards found
    return false
}

function createCardHTML(card) {
    // Match suit to symbol and color
    const suitSymbols = {
        "Hearts":   { symbol: "♥", color: "red" },
        "Diamonds": { symbol: "♦", color: "red" },
        "Spades":   { symbol: "♠", color: "black" },
        "Clubs":    { symbol: "♣", color: "black" }
    }

    const suit = suitSymbols[card.suit]

    // Build the card HTML
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
            // Show card back for opponents
            container.innerHTML += `<div class="card-back"></div>`
        } else {
            // Show actual card for player
            container.innerHTML += createCardHTML(card)
        }
    }
}

function displayFaceUpCard(card) {
    const container = document.getElementById("face-up-card")
    container.innerHTML = createCardHTML(card)
}

// ---- START THE GAME ----
shuffleDeck(deck)
const topCard = dealCards(deck, players)

// Display everything on screen
displayHand(players[0].hand, "hand-player")
displayHand(players[1].hand, "hand-opponent1", true)
displayHand(players[2].hand, "hand-partner", true)
displayHand(players[3].hand, "hand-opponent2", true)
displayFaceUpCard(topCard)
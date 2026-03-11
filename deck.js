// ---- DECK.JS ----
// Responsible for: creating, shuffling, dealing, and card logic

const ranks = ["9", "10", "J", "Q", "K", "A"]
const suits = ["Hearts", "Clubs", "Spades", "Diamonds"]

function buildDeck() {
    const deck = []
    for (let suit of suits) {
        for (let rank of ranks) {
            deck.push({ rank: rank, suit: suit })
        }
    }
    return deck
}

function shuffleDeck(deck) {
    for (let i = 0; i < 24; i++) {
        let posA = Math.floor(Math.random() * 24)
        let posB = Math.floor(Math.random() * 24)
        let temp = deck[posA]
        deck[posA] = deck[posB]
        deck[posB] = temp
    }
    let cut = deck.splice(0, 12)
    deck.push(...cut)
    return deck
}

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

function getLeftBowerSuit(trumpSuit) {
    const pairs = {
        "Hearts":   "Diamonds",
        "Diamonds": "Hearts",
        "Spades":   "Clubs",
        "Clubs":    "Spades"
    }
    return pairs[trumpSuit]
}

function getCardPower(card, trumpSuit, leadSuit) {
    const leftBowerSuit = getLeftBowerSuit(trumpSuit)

    if (card.rank === "J" && card.suit === trumpSuit) return 14
    if (card.rank === "J" && card.suit === leftBowerSuit) return 13
    if (card.suit === trumpSuit) {
        const trumpPower = { "9": 8, "10": 9, "Q": 10, "K": 11, "A": 12 }
        return trumpPower[card.rank]
    }
    if (leadSuit && card.suit === leadSuit) {
        const leadPower = { "9": 2, "10": 3, "J": 4, "Q": 5, "K": 6, "A": 7 }
        return leadPower[card.rank]
    }
    return 0
}

function hasLeadSuit(hand, leadSuit, trumpSuit) {
    const leftBowerSuit = getLeftBowerSuit(trumpSuit)
    for (let card of hand) {
        if (card.rank === "J" && card.suit === leftBowerSuit) continue
        if (card.suit === leadSuit) return true
    }
    return false
}

function sortHand(hand, trumpSuit) {
    hand.sort((a, b) => {
        const powerA = getCardPower(a, trumpSuit, null)
        const powerB = getCardPower(b, trumpSuit, null)
        return powerB - powerA
    })
}
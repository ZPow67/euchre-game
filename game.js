// ---- THE DECK ----
const ranks = ["9", "10", "J", "Q", "K", "A"]
const suits = ["Hearts", "Clubs", "Spades", "Diamonds"]
let trumpsuit = null

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

// ---- START THE GAME ----
shuffleDeck(deck)
const topCard = dealCards(deck, players)

console.log("Top card:", topCard)
console.log("Your hand:", players[0].hand)

function getCardPower(card, trumpSuit, leadSuit) {
    
    // First figure out the left bower suit
    // (same color as trump, different suit)
    const leftBowerSuit = {
        "Hearts": "Diamonds",
        "Diamonds": "Hearts",
        "Spades": "Clubs",
        "Clubs": "Spades"
    }[trumpSuit]

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

function hasLeadSuit(hand, leadSuit, trumpSuit) {

    const leftBowerSuit = {
        "Hearts": "Diamonds",
        "Diamonds": "Hearts",
        "Spades": "Clubs",
        "Clubs": "Spades"
    }[trumpSuit]

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

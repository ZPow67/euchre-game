// ---- GAME.JS ----
// Responsible for: starting and controlling the overall game flow

// ---- GAME STATE ----
let trumpSuit = null
let currentPlayerIndex = 1
let biddingRound = 1
let topCard = null
let goingAlone = false
let deck = []
let dealerIndex = 0

// Trick state
let currentTrick = []
let leadSuit = null
let tricksPlayed = 0

function startGame() {
    // Reset state
    trumpSuit = null
    goingAlone = false
    currentTrick = []
    leadSuit = null
    tricksPlayed = 0

    // Reset players
    for (let player of players) {
        player.hand = []
        player.tricksWon = 0
        player.isGoingAlone = false
        player.isSittingOut = false
    }

    // Build and shuffle deck
    deck = buildDeck()
    shuffleDeck(deck)

    // Deal cards
    topCard = dealCards(deck, players)

    // Display
    displayHand(players[0].hand, "hand-player")
    displayHand(players[1].hand, "hand-opponent1", true)
    displayHand(players[2].hand, "hand-partner", true)
    displayHand(players[3].hand, "hand-opponent2", true)
    displayFaceUpCard(topCard)
    displayScore()

    // Start bidding
    currentPlayerIndex = (dealerIndex + 1) % 4
    biddingRound = 1
    runBidding()
}

function startNewRound() {
    dealerIndex = (dealerIndex + 1) % 4
    resetTricks()
    startGame()
}

startGame()
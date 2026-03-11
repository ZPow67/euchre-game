// ---- GAME.JS ----

// ---- GAME STATE ----
let trumpSuit = null
let currentPlayerIndex = 1
let biddingRound = 1
let topCard = null
let goingAlone = false
let deck = []

// ---- START THE GAME ----
function startGame() {
    // Reset everything
    deck = buildDeck()
    shuffleDeck(deck)

    // Reset player hands
    for (let player of players) {
        player.hand = []
        player.tricksWon = 0
    }

    // Deal cards
    topCard = dealCards(deck, players)

    // Display everything
    displayHand(players[0].hand, "hand-player")
    displayHand(players[1].hand, "hand-opponent1", true)
    displayHand(players[2].hand, "hand-partner", true)
    displayHand(players[3].hand, "hand-opponent2", true)
    displayFaceUpCard(topCard)

    // Start bidding
    currentPlayerIndex = 1
    biddingRound = 1
    runBidding()
}

startGame()
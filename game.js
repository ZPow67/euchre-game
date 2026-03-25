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
let biddingStarted = false
let ordererIndex = null

// Trick state
let currentTrick = []
let leadSuit = null
let tricksPlayed = 0

// ---- BRIDGE FUNCTIONS ----
function beginTricks() {
    startTricks()
}

function beginSetup(playerIndex) {
    startSetup(playerIndex)
}

function startGame() {
    // Reset state
    trumpSuit = null
    goingAlone = false
    currentTrick = []
    leadSuit = null
    tricksPlayed = 0
    biddingStarted = false
    ordererIndex = null

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
    sortHand(players[0].hand, null)

    // Static UI
    displayDealer()
    displayScore()
    clearPlayedCards()

    // Clear hand displays before animation
    displayHand([], "hand-player")
    displayHand([], "hand-opponent1")
    displayHand([], "hand-partner")
    displayHand([], "hand-opponent2")
    document.getElementById('face-up-card').innerHTML = ''

    // Shuffle → deal (cards pile up) → fan out → start bidding
    animateShuffle(() => {
        animateDealCards(() => {
            fanOutHand(0, false)
            fanOutHand(1, true)
            fanOutHand(2, true)
            fanOutHand(3, true)
            displayFaceUpCard(topCard)

            // Wait for fan-out to finish before prompting
            setTimeout(() => {
                currentPlayerIndex = (dealerIndex + 1) % 4
                biddingRound = 1
                runBidding()
            }, 650)
        })
    })
}

function startNewRound() {
    dealerIndex = (dealerIndex + 1) % 4
    resetTricks()
    startGame()
}

startGame()
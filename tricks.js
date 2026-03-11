// ---- TRICKS.JS ----
// Responsible for: all trick playing logic

function startTricks() {
    currentTrick = []
    leadSuit = null
    tricksPlayed = 0
    currentPlayerIndex = (dealerIndex + 1) % 4

    showMessage(`${players[currentPlayerIndex].name} leads!`)
    setTimeout(() => playTurn(), 1000)
}

function playTurn() {
    const player = players[currentPlayerIndex]

    if (player.isSittingOut) {
        currentPlayerIndex = (currentPlayerIndex + 1) % 4
        playTurn()
        return
    }

    if (currentPlayerIndex === 0) {
        showMessage("Your turn! Pick a card to play!")
        makeHandClickable("playCard")
    } else {
        showMessage(`${player.name} is thinking...`)
        setTimeout(() => {
            const card = aiPlayCard(player)
            processPlayedCard(currentPlayerIndex, card)
        }, 1500)
    }
}

function playCard(index) {
    const player = players[0]
    const card = player.hand[index]

    if (!card) return

    // Validate follow suit
    if (leadSuit && hasLeadSuit(player.hand, leadSuit, trumpSuit)) {
        const power = getCardPower(card, trumpSuit, leadSuit)
        const leftBowerSuit = getLeftBowerSuit(trumpSuit)
        const isLeftBower = card.rank === "J" && card.suit === leftBowerSuit
        const followsSuit = card.suit === leadSuit || isLeftBower && leadSuit === trumpSuit

        if (!followsSuit && power < 8) {
            invalidCardFeedback(index)
            showMessage("You must follow suit!")
            return
        }
    }

    makeHandUnclickable()
    processPlayedCard(0, card)
}

function processPlayedCard(playerIndex, card) {

    console.log("currentTrick.length:", currentTrick.length)
    console.log("card being played:", card)

    // Safety check!
    if (!card) {
        console.log("Null card for player:", playerIndex)
        console.log("Hand:", players[playerIndex].hand)
        console.log("leadSuit:", leadSuit)
        console.log("trumpSuit:", trumpSuit)
        return
    }

    const player = players[playerIndex]
    const handIndex = player.hand.indexOf(card)

    // Set lead suit on first card
    if (currentTrick.length === 0) {
        const leftBowerSuit = getLeftBowerSuit(trumpSuit)
        if (card.rank === "J" && card.suit === leftBowerSuit) {
            leadSuit = trumpSuit
        } else {
            leadSuit = card.suit
        }
        updateDebug()  // ADD THIS
        console.log("leadSuit set to:", leadSuit)
    }


    // Remove card from hand
    player.hand.splice(handIndex, 1)

    // Add to trick
    currentTrick.push({ playerIndex: playerIndex, card: card })

    // Display on table
    displayPlayedCard(playerIndex, card)

    // Refresh human hand
    if (playerIndex === 0) {
        displayHand(player.hand, "hand-player")
    }

    // All players played?
    if (currentTrick.length === 4) {
        setTimeout(() => evaluateTrick(), 1500)
    } else {
        currentPlayerIndex = (currentPlayerIndex + 1) % 4
        setTimeout(() => playTurn(), 1000)
    }
}

function evaluateTrick() {
    let highestPower = -1
    let winnerIndex = -1

    for (let play of currentTrick) {
        const power = getCardPower(play.card, trumpSuit, leadSuit)
        if (power > highestPower) {
            highestPower = power
            winnerIndex = play.playerIndex
        }
    }

    const winner = players[winnerIndex]
    winner.tricksWon++

    if (winner.team === 1) {
        tricksTeam1++
    } else {
        tricksTeam2++
    }

    showMessage(`${winner.name} wins the trick! 🎉`)
    animateTrickWinner(winnerIndex)
    tricksPlayed++
    updateDebug()

    if (tricksPlayed === 5) {
        setTimeout(() => calculatePoints(), 2000)
    } else {
        setTimeout(() => {
            currentTrick = []
            leadSuit = null
            currentPlayerIndex = winnerIndex
            playTurn()
        }, 2000)
    }
}
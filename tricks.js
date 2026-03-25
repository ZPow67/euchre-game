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

function getValidCardIndices(player) {
    if (!leadSuit) return null // all cards valid

    // Special check when trump is led
    // Must include Left Bower as a valid trump card
    const leftBowerSuit = getLeftBowerSuit(trumpSuit)
    
    const hasTrumpCards = player.hand.some(card => {
        if (card.rank === "J" && card.suit === leftBowerSuit) return true
        return card.suit === trumpSuit
    })

    // If trump is led and player has trump cards — force trump
    if (leadSuit === trumpSuit && hasTrumpCards) {
        const validIndices = []
        player.hand.forEach((card, index) => {
            // Left bower counts as trump!
            if (card.rank === "J" && card.suit === leftBowerSuit) {
                validIndices.push(index)
            } else if (card.suit === trumpSuit) {
                validIndices.push(index)
            }
        })
        return validIndices
    }

    // Normal follow suit check
    if (!hasLeadSuit(player.hand, leadSuit, trumpSuit)) {
        return null // no lead suit cards — all cards valid
    }

    const validIndices = []
    player.hand.forEach((card, index) => {
        if (card.rank === "J" && card.suit === leftBowerSuit) return
        if (card.suit === leadSuit) validIndices.push(index)
    })

    return validIndices
}

function playTurn() {
    const player = players[currentPlayerIndex]

    if (player.isSittingOut) {
        currentPlayerIndex = (currentPlayerIndex + 1) % 4
        playTurn()
        return
    }

    if (isMyTurn()) {
        showMessage("Your turn! Pick a card to play!")
        const validIndices = getValidCardIndices(players[myLocalSeatIndex])
        makeHandClickable("playCard", validIndices)
    } else {
        showMessage(`${player.name} is thinking...`)
        setTimeout(() => {
            if (isMyTurn()) return
            const card = aiPlayCard(player)
            processPlayedCard(currentPlayerIndex, card)
        }, 1500)
    }
}

function playCard(index) {
    const player = players[myLocalSeatIndex]
    const card = player.hand[index]

    if (!card) return

    // Validate follow suit
    if (leadSuit && hasLeadSuit(player.hand, leadSuit, trumpSuit)) {
        const leftBowerSuit = getLeftBowerSuit(trumpSuit)
        const isLeftBower = card.rank === "J" && card.suit === leftBowerSuit
        const followsSuit = card.suit === leadSuit ||
                           (isLeftBower && leadSuit === trumpSuit)
        const power = getCardPower(card, trumpSuit, leadSuit)

        if (!followsSuit && power < 8) {
            invalidCardFeedback(index)
            showMessage("You must follow suit!")
            return
        }
    }

    makeHandUnclickable()
    processPlayedCard(myLocalSeatIndex, card)
}

function processPlayedCard(playerIndex, card) {
    // Safety check
    if (!card) {
        console.log("Null card for player:", playerIndex)
        console.log("Hand:", players[playerIndex].hand)
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
        updateDebug()
    }

    // Remove card from hand
    player.hand.splice(handIndex, 1)

    // Add to trick
    currentTrick.push({ playerIndex: playerIndex, card: card })

    // Display on table
    displayPlayedCard(playerIndex, card)

    // Refresh displayed hands
    if (playerIndex === myLocalSeatIndex) {
        const validIndices = getValidCardIndices(player)
        makeHandClickable("playCard", validIndices)
        displayHand(player.hand, "hand-" + getDisplaySlot(playerIndex))
    } else if (!player.isSittingOut) {
        displayHand(player.hand, "hand-" + getDisplaySlot(playerIndex), true)
    }

    // All active players played?
    const activePlayers = players.filter(p => !p.isSittingOut).length
    if (currentTrick.length === activePlayers) {
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
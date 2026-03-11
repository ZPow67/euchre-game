// ---- SETUP.JS ----
// Responsible for: everything between bidding ending and tricks starting

function checkGoingAlone(playerIndex) {
    const player = players[playerIndex]
    if (player.isGoingAlone) {
        const partnerIndex = (playerIndex + 2) % 4
        players[partnerIndex].isSittingOut = true
        showMessage(`${player.name} is going alone! ${players[partnerIndex].name} sits out!`)
        displaySittingOut(partnerIndex)
    }
}

function startSetup(playerIndex) {
    showMessage(`Trump is ${trumpSuit}! Getting ready...`)
    checkGoingAlone(playerIndex)

    if (biddingRound === 1) {
        players[dealerIndex].hand.push(topCard)
        displayHand(players[0].hand, "hand-player")

        if (dealerIndex === 0) {
            showMessage("Pick a card to discard!")
            makeHandClickable("discardCard")
        } else {
            aiDiscard(players[dealerIndex])
            sortHand(players[0].hand, trumpSuit)
            displayHand(players[0].hand, "hand-player")
            setTimeout(() => startTricks(), 1500)
        }
    } else {
        document.getElementById("face-up-card").innerHTML =
            `<div class="card-back"></div>`
        showMessage(`${trumpSuit} is trump! Let's play!`)
        sortHand(players[0].hand, trumpSuit)
        displayHand(players[0].hand, "hand-player")
        setTimeout(() => startTricks(), 1500)
    }
}

function discardCard(index) {
    makeHandUnclickable()

    // Just remove the card at this index
    // topCard is already in hand from startSetup!
    players[0].hand.splice(index, 1)

    sortHand(players[0].hand, trumpSuit)
    displayHand(players[0].hand, "hand-player")
    showMessage(`Card discarded! ${trumpSuit} is trump! Let's play!`)
    setTimeout(() => startTricks(), 1500)
}
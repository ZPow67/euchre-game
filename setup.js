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
        // Add top card to dealer's hand silently
        players[dealerIndex].hand.push(topCard)

        if (dealerIndex === 0 && players[0].isSittingOut) {
            // Human is dealer but sitting out — auto-discard silently
            aiDiscard(players[0])
            document.getElementById("face-up-card").innerHTML = `<div class="card-back"></div>`
            displaySittingOut(0)
            setTimeout(() => beginTricks(), 1500)
        } else if (dealerIndex === 0) {
            // Append top card to the already-displayed fanned hand, no rebuild
            document.getElementById("hand-player").insertAdjacentHTML("beforeend", createCardHTML(topCard))
            showMessage("Pick a card to discard!")
            // Only allow discarding the original 5 cards — not the picked-up top card
            makeHandClickable("discardCard", [0, 1, 2, 3, 4])
        } else {
            // AI dealer discards
            aiDiscard(players[dealerIndex])
            // Flip face up card face down
            document.getElementById("face-up-card").innerHTML =
                `<div class="card-back"></div>`
            sortHand(players[0].hand, trumpSuit)
            displayHand(players[0].hand, "hand-player")
            setTimeout(() => beginTricks(), 1500)
        }

    } else {
        // Round 2 — card was turned down
        document.getElementById("face-up-card").innerHTML =
            `<div class="card-back"></div>`
        showMessage(`${trumpSuit} is trump! Let's play!`)
        sortHand(players[0].hand, trumpSuit)
        displayHand(players[0].hand, "hand-player")
        setTimeout(() => beginTricks(), 1500)
    }
}

function discardCard(index) {
    makeHandUnclickable()

    // Remove selected card from hand
    players[0].hand.splice(index, 1)

    // Flip face up card face down after discard
    document.getElementById("face-up-card").innerHTML =
        `<div class="card-back"></div>`

    // Sort and show full hand including top card
    sortHand(players[0].hand, trumpSuit)
    displayHand(players[0].hand, "hand-player")

    showMessage(`Card discarded! ${trumpSuit} is trump! Let's play!`)
    setTimeout(() => beginTricks(), 1500)
}
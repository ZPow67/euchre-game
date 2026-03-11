// ---- BIDDING.JS ----
// Responsible for: all bidding logic

function runBidding() {
    const player = players[currentPlayerIndex]

    // Is this the human player?
    if (currentPlayerIndex === 0) {
        if (biddingRound === 1) {
            showMessage("Your turn! Order up or pass?")
            showButtons([
                { label: "Order Up", action: "orderUp()" },
                { label: "Pass",     action: "passBid()" }
            ])
        } else {
            showMessage("Your turn! Name a trump suit or pass?")
            showButtons([
                { label: "Hearts",   action: "nameTrumpSuit('Hearts')"   },
                { label: "Diamonds", action: "nameTrumpSuit('Diamonds')" },
                { label: "Spades",   action: "nameTrumpSuit('Spades')"   },
                { label: "Clubs",    action: "nameTrumpSuit('Clubs')"    },
                { label: "Pass",     action: "passBid()"                 }
            ])
        }
        return
    }

    // AI player's turn — show thinking message first
    showMessage(`${player.name} is thinking...`)

    setTimeout(() => {

        if (biddingRound === 1) {
            const decision = aiDecideRound1(player, topCard)

            if (decision === "orderUp") {
                showMessage(`${player.name} orders it up!`)
                setTimeout(() => setTrump(topCard.suit, currentPlayerIndex), 1500)
                return
            } else {
                showMessage(`${player.name} passes...`)
            }

        } else {
            const decision = aiDecideRound2(player, topCard.suit)

            if (decision) {
                showMessage(`${player.name} names ${decision} as trump!`)
                setTimeout(() => setTrump(decision, currentPlayerIndex), 1500)
                return
            } else {
                showMessage(`${player.name} passes...`)
            }
        }

        // AI passed — move to next player after delay
        setTimeout(() => nextBidder(), 1500)

    }, 1500)
}

function nextBidder() {
    currentPlayerIndex = (currentPlayerIndex + 1) % 4

    // Has everyone passed in round 1?
    if (currentPlayerIndex === 1 && biddingRound === 1) {
        biddingRound = 2
        showMessage("Everyone passed! Round 2 - Name a suit!")
        setTimeout(() => runBidding(), 1500)
        return
    }

    // Hang the dealer in round 2!
    if (currentPlayerIndex === 0 && biddingRound === 2) {
        showMessage("Everyone passed! You must name a suit - You're hung!")
        setTimeout(() => {
            showButtons([
                { label: "Hearts",   action: "nameTrumpSuit('Hearts')"   },
                { label: "Diamonds", action: "nameTrumpSuit('Diamonds')" },
                { label: "Spades",   action: "nameTrumpSuit('Spades')"   },
                { label: "Clubs",    action: "nameTrumpSuit('Clubs')"    }
            ])
        }, 1500)
        return
    }

    runBidding()
}

function setTrump(suit, playerIndex) {
    trumpSuit = suit
    const player = players[playerIndex]
    showMessage(`${player.name} set trump to ${suit}! 🎉`)
    hideButtons()

    // Set offence and display info
    setOffence(playerIndex)
    displayTrump()
    displayScore()

    // Check if partner forced a go alone
    if (playerIndex === 2 && biddingRound === 1) {
        goingAlone = true
        showMessage(`Partner ordered you up and must go alone!`)
    }

    // Kick off setup phase
    setTimeout(() => startSetup(playerIndex), 1500)
}

// Human clicks Order Up
function orderUp() {
    hideButtons()
    showMessage(`You ordered it up! Trump is ${topCard.suit}! 🎉`)
    setTimeout(() => setTrump(topCard.suit, 0), 1500)
}

// Human clicks Pass
function passBid() {
    hideButtons()
    showMessage("You pass...")
    setTimeout(() => nextBidder(), 1500)
}

// Human names a trump suit
function nameTrumpSuit(suit) {
    hideButtons()
    showMessage(`You named ${suit} as trump! 🎉`)
    setTimeout(() => setTrump(suit, 0), 1500)
}
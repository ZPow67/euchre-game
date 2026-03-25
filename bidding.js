// ---- BIDDING.JS ----
// Responsible for: all bidding logic

function runBidding() {

    console.log("=== RUN BIDDING ===")
    console.log("currentPlayerIndex:", currentPlayerIndex)
    console.log("dealerIndex:", dealerIndex)
    console.log("biddingRound:", biddingRound)
    
    const player = players[currentPlayerIndex]

    if (currentPlayerIndex === dealerIndex &&
        currentPlayerIndex !== (dealerIndex + 1) % 4) {
        // This is the dealer's turn in round 1
    }

    if (currentPlayerIndex === 0) {
        if (biddingRound === 1) {
            const isDealer = currentPlayerIndex === dealerIndex
            showMessage(isDealer ? "Your turn! Pick up or pass?" : "Your turn! Order up or pass?")
            showButtons([
                { label: isDealer ? "Pick Up" : "Order Up", action: "orderUp()" },
                { label: "Pass", action: "passBid()" }
            ])
        } else {
            showMessage("Your turn! Name a trump suit or pass?")

            // Can't name the turned down suit!
            const allSuits = ["Hearts", "Diamonds", "Spades", "Clubs"]
            const availableSuits = allSuits.filter(suit => suit !== topCard.suit)

            const buttons = availableSuits.map(suit => ({
                label: suit,
                action: `nameTrumpSuit('${suit}')`
            }))

            // Add pass button
            buttons.push({ label: "Pass", action: "passBid()" })

            showButtons(buttons)
        }
        return
    }

    showMessage(`${player.name} is thinking...`)
    setTimeout(() => {

        // Saftety check - if it's nmow the human's turn, don't run AI logic
        if (currentPlayerIndex === 0) return

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
        setTimeout(() => nextBidder(), 1500)
    }, 1500)
}

function nextBidder() {
    console.log("=== NEXT BIDDER ===")
    console.log("currentPlayerIndex before:", currentPlayerIndex)
    console.log("dealerIndex:", dealerIndex)
    console.log("biddingRound:", biddingRound)
    console.log("biddingStarted:", biddingStarted)
    
    currentPlayerIndex = (currentPlayerIndex + 1) % 4
    console.log("currentPlayerIndex after:", currentPlayerIndex)
    console.log("(dealerIndex + 1) % 4:", (dealerIndex + 1) % 4)
    
    // Mark that we've started going around
    biddingStarted = true

    if (biddingStarted && 
        currentPlayerIndex === (dealerIndex + 1) % 4 && 
        biddingRound === 1) {
        biddingRound = 2
        biddingStarted = false
        showMessage("Everyone passed! Round 2 - Name a suit!")
        setTimeout(() => runBidding(), 1500)
        return
    }

    if (currentPlayerIndex === dealerIndex && biddingRound === 2) {
        showMessage("You're hung! You must name a suit!")
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
    ordererIndex = playerIndex
    const player = players[playerIndex]
    showMessage(`${player.name} set trump to ${suit}! 🎉`)
    hideButtons()
    setOffence(playerIndex)
    displayTrump()
    displayScore()
    displayDealer()
    updateDebug()

    // Forced alone — if you ordered up your partner as dealer, you go alone
    if (biddingRound === 1 && dealerIndex === (playerIndex + 2) % 4) {
        players[playerIndex].isGoingAlone = true
        const orderer = players[playerIndex]
        const dealer = players[dealerIndex]
        showMessage(`${orderer.name} ordered up ${dealer.name} — going alone!`)
    }

    setTimeout(() => startSetup(playerIndex), 1500)
}

function orderUp() {
    hideButtons()
    showMessage(`You ordered it up! Trump is ${topCard.suit}! 🎉`)
    setTimeout(() => setTrump(topCard.suit, 0), 1500)
}

function passBid() {
    hideButtons()
    showMessage("You pass...")
    setTimeout(() => nextBidder(), 1500)
}

function nameTrumpSuit(suit) {
    hideButtons()
    showMessage(`You named ${suit} as trump! 🎉`)
    setTimeout(() => setTrump(suit, 0), 1500)
}
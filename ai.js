// ---- AI.JS ----
// Responsible for: all AI decision making

function scoreTrumpHand(hand, potentialTrump) {
    let score = 0
    for (let card of hand) {
        const power = getCardPower(card, potentialTrump, null)
        if (power === 14) score += 4      // right bower
        else if (power === 13) score += 3  // left bower
        else if (power === 12) score += 2  // ace of trump
        else if (power === 11) score += 1.5 // king of trump
        else if (power >= 8) score += 1    // Q, 10, 9 of trump
    }
    return score
}

function aiDecideRound1(player, topCard) {
    const score = scoreTrumpHand(player.hand, topCard.suit)
    // Threshold varies slightly so identical hands don't always behave the same
    const threshold = 3 + Math.random() * 1.5  // range: 3.0 – 4.5
    if (score >= threshold) return "orderUp"
    return "pass"
}

function aiDecideRound2(player, topCardSuit) {
    const allSuits = ["Hearts", "Diamonds", "Spades", "Clubs"]
    let bestSuit = null
    let bestScore = 0
    for (let suit of allSuits) {
        if (suit === topCardSuit) continue
        const score = scoreTrumpHand(player.hand, suit)
        if (score > bestScore) {
            bestScore = score
            bestSuit = suit
        }
    }
    // Higher threshold in round 2 — no card pickup, so need a stronger hand
    const threshold = 4 + Math.random() * 2  // range: 4.0 – 6.0
    if (bestScore >= threshold) return bestSuit
    return null  // pass
}

function aiDiscard(player) {
    const hand = player.hand
    let suitGroups = {}
    for (let card of hand) {
        if (getCardPower(card, trumpSuit, null) >= 8) continue
        if (!suitGroups[card.suit]) suitGroups[card.suit] = []
        suitGroups[card.suit].push(card)
    }

    let voidCandidate = null
    for (let suit in suitGroups) {
        const cards = suitGroups[suit]
        const hasHighCard = cards.some(c => c.rank === "A" || c.rank === "K")
        if (!hasHighCard && cards.length > 0) {
            voidCandidate = cards.reduce((lowest, card) =>
                getCardPower(card, trumpSuit, null) < getCardPower(lowest, trumpSuit, null) ? card : lowest
            )
        }
    }

    if (voidCandidate) {
        const index = hand.indexOf(voidCandidate)
        hand.splice(index, 1)
        return
    }

    let lowestCard = null
    let lowestPower = 999
    let lowestIndex = -1
    for (let i = 0; i < hand.length; i++) {
        const power = getCardPower(hand[i], trumpSuit, null)
        if (power >= 8) continue
        if (power < lowestPower) {
            lowestPower = power
            lowestCard = hand[i]
            lowestIndex = i
        }
    }

    if (lowestIndex === -1) {
        for (let i = 0; i < hand.length; i++) {
            const power = getCardPower(hand[i], trumpSuit, null)
            if (power < lowestPower) {
                lowestPower = power
                lowestCard = hand[i]
                lowestIndex = i
            }
        }
    }

    hand.splice(lowestIndex, 1)
}

function isTeammateWinning(currentPlayerIndex) {
    if (currentTrick.length === 0) return false
    let highestPower = -1
    let winningPlayerIndex = -1
    for (let play of currentTrick) {
        const power = getCardPower(play.card, trumpSuit, leadSuit)
        if (power > highestPower) {
            highestPower = power
            winningPlayerIndex = play.playerIndex
        }
    }
    const sameTeam = winningPlayerIndex % 2 === currentPlayerIndex % 2
    return sameTeam && winningPlayerIndex !== currentPlayerIndex
}

function getHighestTrump(hand) {
    let best = null
    let bestPower = -1
    for (let card of hand) {
        const power = getCardPower(card, trumpSuit, null)
        if (power >= 8 && power > bestPower) {
            best = card
            bestPower = power
        }
    }
    return best
}

function getHighestOffSuit(hand) {
    const rankOrder = { "9": 1, "10": 2, "J": 3, "Q": 4, "K": 5, "A": 6 }
    let best = null
    let bestRank = -1

    for (let card of hand) {
        const power = getCardPower(card, trumpSuit, null)
        // Skip trump cards
        if (power >= 8) continue
        // Use rank order for off suit cards
        if (rankOrder[card.rank] > bestRank) {
            best = card
            bestRank = rankOrder[card.rank]
        }
    }
    return best
}

function getLowestWinningCard(hand) {
    let highestPower = -1
    for (let play of currentTrick) {
        const power = getCardPower(play.card, trumpSuit, leadSuit)
        if (power > highestPower) highestPower = power
    }
    let best = null
    let bestPower = 999
    for (let card of hand) {
        const power = getCardPower(card, trumpSuit, leadSuit)
        if (power > highestPower && power < bestPower) {
            best = card
            bestPower = power
        }
    }
    return best
}

function getBestGarbageCard(hand) {
    const playedSuits = new Set(currentTrick.map(p => p.card.suit))
    let suitCounts = {}
    for (let card of hand) {
        const power = getCardPower(card, trumpSuit, null)
        if (power >= 8) continue
        if (!suitCounts[card.suit]) suitCounts[card.suit] = []
        suitCounts[card.suit].push(card)
    }
    for (let suit in suitCounts) {
        const cards = suitCounts[suit]
        const hasHighCard = cards.some(c => c.rank === "A" || c.rank === "K")
        const isUnplayed = !playedSuits.has(suit)
        if (!hasHighCard && isUnplayed && cards.length === 1) {
            return cards[0]
        }
    }
    let lowest = null
    let lowestPower = 999
    for (let card of hand) {
        const power = getCardPower(card, trumpSuit, null)
        if (power >= 8) continue
        if (power < lowestPower) {
            lowest = card
            lowestPower = power
        }
    }
    if (!lowest) {
        for (let card of hand) {
            const power = getCardPower(card, trumpSuit, null)
            if (power < lowestPower) {
                lowest = card
                lowestPower = power
            }
        }
    }
    return lowest
}

function aiPlayCard(player) {
    const hand = player.hand
    const position = currentTrick.length

    console.log("=== AI PLAYING ===")
    console.log("Player:", player.name)
    console.log("Hand:", hand.map(c => c.rank + " of " + c.suit))
    console.log("Lead suit:", leadSuit)
    console.log("Trump suit:", trumpSuit)
    console.log("Position:", position)

    const onOffence = (player.team === 1 && team1IsOffence) ||
        (player.team === 2 && team2IsOffence)

    console.log("=== AI PLAYING ===")
    console.log("Player:", player.name)
    console.log("Hand:", hand.map(c => c.rank + " of " + c.suit))
    console.log("Lead suit:", leadSuit)
    console.log("Trump suit:", trumpSuit)
    console.log("Position:", position)
    console.log("Has lead suit:", leadSuit ? hasLeadSuit(hand, leadSuit, trumpSuit) : "no lead yet")

    // Must follow suit check
    if (leadSuit && hasLeadSuit(hand, leadSuit, trumpSuit)) {
        const leftBowerSuit = getLeftBowerSuit(trumpSuit)
        const validCards = hand.filter(card => {
            if (card.rank === "J" && card.suit === leftBowerSuit) return false
            return card.suit === leadSuit
        })

        console.log("Valid cards to follow suit:", validCards.map(c => c.rank + " of " + c.suit))
        console.log("Valid cards length:", validCards.length)

        if (validCards.length > 0) {
            if (isTeammateWinning(currentPlayerIndex)) {
                return validCards.reduce((a, b) =>
                    getCardPower(a, trumpSuit, leadSuit) <
                        getCardPower(b, trumpSuit, leadSuit) ? a : b)
            } else {
                return validCards.reduce((a, b) =>
                    getCardPower(a, trumpSuit, leadSuit) >
                        getCardPower(b, trumpSuit, leadSuit) ? a : b)
            }
        }
    }

    // Position 0 — Leading
    if (position === 0) {
        if (onOffence) return getHighestTrump(hand) || getHighestOffSuit(hand)
        else return getHighestOffSuit(hand) || getHighestTrump(hand)
    }

    // Position 1 — Second
    if (position === 1) {
        return getLowestWinningCard(hand) || getBestGarbageCard(hand)
    }

    // Position 2 — Third
    if (position === 2) {
        if (isTeammateWinning(currentPlayerIndex)) {
            let highestPower = -1
            for (let play of currentTrick) {
                const power = getCardPower(play.card, trumpSuit, leadSuit)
                if (power > highestPower) highestPower = power
            }
            if (highestPower < 8) {
                return getHighestTrump(hand) || getBestGarbageCard(hand)
            } else {
                return getBestGarbageCard(hand)
            }
        } else {
            return getLowestWinningCard(hand) || getBestGarbageCard(hand)
        }
    }

    // Position 3 — Last
    if (position === 3) {
        if (isTeammateWinning(currentPlayerIndex)) {
            return getBestGarbageCard(hand)
        } else {
            return getLowestWinningCard(hand) || getBestGarbageCard(hand)
        }
    }

    return getBestGarbageCard(hand)
}
// ---- AI.JS ----
// Responsible for: all AI decision making

function countTrumpCards(hand, potentialTrump) {
    const leftBowerSuit = getLeftBowerSuit(potentialTrump)
    let count = 0
    for (let card of hand) {
        if (card.suit === potentialTrump) count++
        else if (card.rank === "J" && card.suit === leftBowerSuit) count++
    }
    return count
}

function aiDecideRound1(player, topCard) {
    const trumpCount = countTrumpCards(player.hand, topCard.suit)
    if (trumpCount >= 3) return "orderUp"
    return "pass"
}

function aiDecideRound2(player, topCardSuit) {
    let suitCounts = { "Hearts": 0, "Diamonds": 0, "Spades": 0, "Clubs": 0 }
    for (let card of player.hand) {
        suitCounts[card.suit]++
    }
    let bestSuit = null
    let bestCount = 0
    for (let suit in suitCounts) {
        if (suit !== topCardSuit && suitCounts[suit] > bestCount) {
            bestCount = suitCounts[suit]
            bestSuit = suit
        }
    }
    return bestSuit
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
        hand[index] = topCard
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

    hand[lowestIndex] = topCard
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
    const onOffence = (player.team === 1 && team1IsOffence) ||
                      (player.team === 2 && team2IsOffence)

    // Must follow suit check
    if (leadSuit && hasLeadSuit(hand, leadSuit, trumpSuit)) {
        const validCards = hand.filter(card => {
            const power = getCardPower(card, trumpSuit, leadSuit)
            return power >= 2 && power <= 7
        })
        if (validCards.length > 0) {
            if (isTeammateWinning(currentPlayerIndex)) {
                return validCards.reduce((a, b) =>
                    getCardPower(a, trumpSuit, leadSuit) < getCardPower(b, trumpSuit, leadSuit) ? a : b)
            } else {
                return validCards.reduce((a, b) =>
                    getCardPower(a, trumpSuit, leadSuit) > getCardPower(b, trumpSuit, leadSuit) ? a : b)
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
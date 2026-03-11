// AI utility functions moved from game.js

function countTrumpCards(hand, potentialTrump) {
	const leftBowerSuit = getLeftBowerSuit(potentialTrump)
	let count = 0

	for (let card of hand) {
		// Is it the same suit as trump?
		if (card.suit === potentialTrump) {
			count++
		}
		// Is it the left bower?
		else if (card.rank === "J" && card.suit === leftBowerSuit) {
			count++
		}
	}

	return count;
}

function aiDecideRound1(player, topCard) {
	const trumpCount = countTrumpCards(player.hand, topCard.suit);

	// AI orders up if they have 3 or more trump cards
	if (trumpCount >= 3) {
		return "orderUp";
	}
	return "pass";
}

function aiDecideRound2(player, topCardSuit) {
	// Count how many cards of each suit the AI has
	let suitCounts = { "Hearts": 0, "Diamonds": 0, "Spades": 0, "Clubs": 0 };

	for (let card of player.hand) {
		suitCounts[card.suit]++;
	}

	// Find the suit they have the most of
	// But can't name the suit that was turned down in round 1!
	let bestSuit = null;
	let bestCount = 0;

	for (let suit in suitCounts) {
		if (suit !== topCardSuit && suitCounts[suit] > bestCount) {
			bestCount = suitCounts[suit];
			bestSuit = suit;
		}
	}

	return bestSuit;
}

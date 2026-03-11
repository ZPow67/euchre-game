// ---- DECK.JS ----
// Responsible for: creating, shuffling, and dealing cards

const ranks = ["9", "10", "J", "Q", "K", "A"];
const suits = ["Hearts", "Clubs", "Spades", "Diamonds"];

function buildDeck() {
    const deck = [];
    for (let suit of suits) {
        for (let rank of ranks) {
            deck.push({ rank: rank, suit: suit });
        }
    }
    return deck;
}

function shuffleDeck(deck) {
    for (let i = 0; i < 24; i++) {
        let posA = Math.floor(Math.random() * 24);
        let posB = Math.floor(Math.random() * 24);
        let temp = deck[posA];
        deck[posA] = deck[posB];
        deck[posB] = temp;
    }
    let cut = deck.splice(0, 12);
    deck.push(...cut);
    return deck;
}

function dealCards(deck, players) {
    for (let card = 0; card < 5; card++) {
        for (let i = 1; i <= 4; i++) {
            let playerIndex = i % 4;
            players[playerIndex].hand.push(deck.pop());
        }
    }
    let topCard = deck.pop();
    return topCard;
}
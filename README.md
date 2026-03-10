# 🃏 Euchre

A browser-based Euchre card game built with HTML and JavaScript — playable on mobile and eventually supporting multiplayer with friends and family!

---

## About

This project is a from-scratch implementation of the classic North American trick-taking card game Euchre. It is being built step by step as a learning project, starting with single-player vs AI and expanding toward real-time multiplayer.

---

## How to Play

1. Clone or download this repository
2. Open `index.html` in your browser
3. Or use the **Live Server** extension in VSCode to run it locally

No installs. No dependencies. Just open and play! 🎉

---

## Features (Current)

- ✅ Full 24-card Euchre deck (9, 10, J, Q, K, A in all four suits)
- ✅ Deck shuffling with random swaps and an Italian cut
- ✅ Card dealing to 4 players with correct turn order
- ✅ Face-up card reveal for bidding phase
- ✅ Trump suit logic, including Right Bower and Left Bower
- ✅ Card power ranking system for trick evaluation
- ✅ Follow suit enforcement (with Left Bower edge case handled)

---

## Roadmap

### Phase 1 — Core Gameplay (In Progress)
- [ ] Bidding system (order up, pass, name trump, hang the dealer)
- [ ] Trick-taking logic
- [ ] Basic AI opponents
- [ ] Scoring system

### Phase 2 — Polish
- [ ] Mobile-friendly card UI
- [ ] Animations and sounds
- [ ] Score tracking across rounds

### Phase 3 — Multiplayer
- [ ] Real-time multiplayer via room codes
- [ ] Play with friends and family online

---

## Game Rules

Euchre is a 4-player trick-taking card game played in teams of 2.

- Players sit across from their partner
- A 24-card deck is used (9 through Ace in each suit)
- Each player is dealt 5 cards, with one card flipped face-up
- Players bid to set the **trump suit** — the dominant suit for the round
- The **Right Bower** (Jack of trump) is the highest card
- The **Left Bower** (Jack of the same-color suit) is the second highest
- The team that sets trump must win at least 3 of 5 tricks or get **Euchred**!

---

## Project Structure

```
euchre-game/
├── index.html      # Main HTML shell
└── game.js         # All game logic
```

---

## Built By

A beginner developer learning JavaScript by building something they love — one function at a time. 🚀

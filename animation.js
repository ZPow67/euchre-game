// ---- ANIMATION.JS ----
// Responsible for: shuffle, deal, and card play animations

// Track pile elements per player so we can clear them at fan-out
const dealPiles = { 0: [], 1: [], 2: [], 3: [] }

function clearAllDealPiles() {
    for (let i = 0; i < 4; i++) {
        dealPiles[i].forEach(el => el.remove())
        dealPiles[i] = []
    }
}

// ---- SHUFFLE ----

function animateShuffle(callback) {
    clearAllDealPiles()

    const tableEl = document.querySelector('.table')
    document.getElementById('face-up-card').innerHTML = '<div class="card-back"></div>'

    const overlay = document.createElement('div')
    overlay.className = 'shuffle-overlay'

    for (let i = 0; i < 8; i++) {
        const card = document.createElement('div')
        card.className = `card-back shuffle-card ${i % 2 === 0 ? 'shuffle-left' : 'shuffle-right'}`
        card.style.animationDelay = `${i * 0.04}s`
        overlay.appendChild(card)
    }

    tableEl.appendChild(overlay)
    showMessage('Shuffling...')

    setTimeout(() => {
        overlay.remove()
        callback()
    }, 1100)
}

// ---- DEAL ----

function animateDealCards(callback) {
    const tableEl = document.querySelector('.table')
    const tableRect = tableEl.getBoundingClientRect()
    const deckX = tableRect.left + tableRect.width / 2 - 22
    const deckY = tableRect.top + tableRect.height / 2 - 32

    const handIds = { 0: 'hand-player', 1: 'hand-opponent1', 2: 'hand-partner', 3: 'hand-opponent2' }
    const dealOrder = [1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0]
    const cardGap = 80

    showMessage('Dealing...')

    // Precompute target centres before any cards move
    const targets = {}
    for (const [idx, id] of Object.entries(handIds)) {
        const rect = document.getElementById(id).getBoundingClientRect()
        targets[idx] = { x: rect.left + rect.width / 2 - 22, y: rect.top }
    }

    dealOrder.forEach((playerIndex, i) => {
        setTimeout(() => {
            flyCardToPile(deckX, deckY, targets[playerIndex].x, targets[playerIndex].y, playerIndex)
        }, i * cardGap)
    })

    setTimeout(callback, dealOrder.length * cardGap + 400)
}

// Fly a card-back from deck to a player's pile and leave it there
function flyCardToPile(fromX, fromY, toX, toY, playerIndex) {
    const jitterX = (Math.random() - 0.5) * 6
    const jitterY = (Math.random() - 0.5) * 4

    const card = document.createElement('div')
    card.className = 'card-back'
    card.style.cssText = `
        position: fixed;
        left: ${fromX}px;
        top: ${fromY}px;
        width: 45px;
        height: 65px;
        z-index: 1000;
        pointer-events: none;
    `
    document.body.appendChild(card)
    dealPiles[playerIndex].push(card)

    requestAnimationFrame(() => requestAnimationFrame(() => {
        card.style.transition = 'left 0.26s ease-out, top 0.26s ease-out'
        card.style.left = (toX + jitterX) + 'px'
        card.style.top  = (toY + jitterY) + 'px'
    }))
    // No fade-out — card stays as part of the visible pile
}

// ---- TRICK WIN ----

// Clone all played cards, clear the slots, then fly the clones toward the winner
function animateTrickWin(winnerIndex) {
    const slotIds = { 0: "played-player", 1: "played-opponent1", 2: "played-partner", 3: "played-opponent2" }
    const flyDuration = 380

    // Capture winner target position before clearing anything
    const winnerRect = document.getElementById(slotIds[winnerIndex]).getBoundingClientRect()
    const toX = winnerRect.left + winnerRect.width  / 2 - 22
    const toY = winnerRect.top  + winnerRect.height / 2 - 32

    const clones = []

    // Clone every visible played card
    for (const id of Object.values(slotIds)) {
        const cardEl = document.getElementById(id).firstElementChild
        if (!cardEl) continue

        const rect = document.getElementById(id).getBoundingClientRect()
        const clone = cardEl.cloneNode(true)
        clone.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width / 2 - 22}px;
            top: ${rect.top + rect.height / 2 - 32}px;
            width: 45px;
            height: 65px;
            z-index: 500;
            pointer-events: none;
        `
        document.body.appendChild(clone)
        clones.push(clone)
    }

    // Clear originals immediately — clones are what we see
    clearPlayedCards()

    // Fly all clones to the winner's position, fading out toward the end
    requestAnimationFrame(() => requestAnimationFrame(() => {
        clones.forEach(clone => {
            clone.style.transition = `left ${flyDuration}ms ease-in, top ${flyDuration}ms ease-in, opacity 200ms ease-in ${flyDuration - 200}ms`
            clone.style.left    = toX + 'px'
            clone.style.top     = toY + 'px'
            clone.style.opacity = '0'
        })
    }))

    setTimeout(() => clones.forEach(el => el.remove()), flyDuration + 100)
}

// ---- FAN OUT ----

// Clear the pile for one player, render their actual hand, then spring-animate
// each card from a centre-stacked position out to its final flex position
function fanOutHand(playerIndex, faceDown) {
    const handIds = { 0: 'hand-player', 1: 'hand-opponent1', 2: 'hand-partner', 3: 'hand-opponent2' }
    const handId  = handIds[playerIndex]
    const container = document.getElementById(handId)

    // Remove pile elements
    dealPiles[playerIndex].forEach(el => el.remove())
    dealPiles[playerIndex] = []

    // Render the real cards
    displayHand(players[playerIndex].hand, handId, faceDown)

    const cardEls = Array.from(container.children)
    const total = cardEls.length
    if (total === 0) return

    const center     = (total - 1) / 2
    const cardSpacing = 50 // 45px card + 5px gap

    // Before any paint: stack all cards at the centre offset
    cardEls.forEach((card, i) => {
        card.style.transition = 'none'
        card.style.transform  = `translateX(${(center - i) * cardSpacing}px)`
    })

    // Next frame: fan out with spring easing + stagger
    requestAnimationFrame(() => requestAnimationFrame(() => {
        cardEls.forEach((card, i) => {
            card.style.transition      = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
            card.style.transitionDelay = `${i * 40}ms`
            card.style.transform       = 'translateX(0)'
        })
    }))

    // Clean up inline styles after animation finishes
    const cleanupDelay = (total - 1) * 40 + 450
    setTimeout(() => {
        cardEls.forEach(card => {
            card.style.transition      = ''
            card.style.transitionDelay = ''
            card.style.transform       = ''
        })
    }, cleanupDelay)
}

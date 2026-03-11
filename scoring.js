// ---- SCORING.JS ----
// Responsible for: tracking scores and determining round outcomes

// Team scores
let scoreTeam1 = 0
let scoreTeam2 = 0

// Which team is on offence this round
let team1IsOffence = false
let team2IsOffence = false

// How many points to win
const POINTS_TO_WIN = 10

// How many tricks each team has won this round
let tricksTeam1 = 0
let tricksTeam2 = 0

// Set which team is on offence based on who made trump
function setOffence(playerIndex) {
    if (players[playerIndex].team === 1) {
        team1IsOffence = true
        team2IsOffence = false
    } else {
        team1IsOffence = false
        team2IsOffence = true
    }
}

// Calculate points at the end of a round
function calculatePoints() {
    const offenceTeam = team1IsOffence ? 1 : 2
    const defenceTeam = team1IsOffence ? 2 : 1
    const offenceTricks = team1IsOffence ? tricksTeam1 : tricksTeam2

    let pointsScored = 0
    let scoringTeam = offenceTeam

    if (offenceTricks >= 3 && offenceTricks < 5) {
        // Makers won 3 or 4 tricks
        pointsScored = 1
        showMessage(`Makers win ${offenceTricks} tricks! 1 point! 🎉`)

    } else if (offenceTricks === 5 && !goingAlone) {
        // March! All 5 tricks!
        pointsScored = 3
        showMessage(`MARCH! All 5 tricks! 3 points! 🎉🎉`)

    } else if (offenceTricks === 5 && goingAlone) {
        // Going alone and won all 5!
        pointsScored = 4
        showMessage(`ALONE AND MARCH! 4 points! 🎉🎉🎉`)

    } else {
        // Euchred! Defence wins!
        pointsScored = 2
        scoringTeam = defenceTeam
        showMessage(`EUCHRED! Defenders get 2 points! 😈`)
    }

    // Add points to the right team
    if (scoringTeam === 1) {
        scoreTeam1 += pointsScored
    } else {
        scoreTeam2 += pointsScored
    }

    // Update the score display
    displayScore()

    // Check if someone won the game!
    checkForWinner()
}

// Check if a team has reached 10 points
function checkForWinner() {
    if (scoreTeam1 >= POINTS_TO_WIN) {
        showMessage(`🏆 You and your Partner WIN THE GAME! 🏆`)
        endGame()
    } else if (scoreTeam2 >= POINTS_TO_WIN) {
        showMessage(`😢 Opponents win the game! Better luck next time!`)
        endGame()
    } else {
        // Nobody won yet, start a new round!
        setTimeout(() => startNewRound(), 2000)
    }
}

// Reset trick counts for a new round
function resetTricks() {
    tricksTeam1 = 0
    tricksTeam2 = 0
    for (let player of players) {
        player.tricksWon = 0
    }
}
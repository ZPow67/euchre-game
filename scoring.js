// ---- SCORING.JS ----
// Responsible for: tracking scores and determining round outcomes

let scoreTeam1 = 0
let scoreTeam2 = 0
let team1IsOffence = false
let team2IsOffence = false
let tricksTeam1 = 0
let tricksTeam2 = 0

const POINTS_TO_WIN = 10

function setOffence(playerIndex) {
    if (players[playerIndex].team === 1) {
        team1IsOffence = true
        team2IsOffence = false
    } else {
        team1IsOffence = false
        team2IsOffence = true
    }
}

function calculatePoints() {
    const offenceTricks = team1IsOffence ? tricksTeam1 : tricksTeam2
    const offenceTeam = team1IsOffence ? 1 : 2
    const defenceTeam = team1IsOffence ? 2 : 1

    let pointsScored = 0
    let scoringTeam = offenceTeam

    if (offenceTricks >= 3 && offenceTricks < 5) {
        pointsScored = 1
        showMessage(`Makers win ${offenceTricks} tricks! 1 point! 🎉`)
    } else if (offenceTricks === 5 && !goingAlone) {
        pointsScored = 3
        showMessage(`MARCH! All 5 tricks! 3 points! 🎉🎉`)
    } else if (offenceTricks === 5 && goingAlone) {
        pointsScored = 4
        showMessage(`ALONE AND MARCH! 4 points! 🎉🎉🎉`)
    } else {
        pointsScored = 2
        scoringTeam = defenceTeam
        showMessage(`EUCHRED! Defenders get 2 points! 😈`)
    }

    if (scoringTeam === 1) {
        scoreTeam1 += pointsScored
    } else {
        scoreTeam2 += pointsScored
    }

    displayScore()
    setTimeout(() => checkForWinner(), 2000)
}

function checkForWinner() {
    if (scoreTeam1 >= POINTS_TO_WIN) {
        showMessage(`🏆 You and your Partner WIN THE GAME! 🏆`)
    } else if (scoreTeam2 >= POINTS_TO_WIN) {
        showMessage(`😢 Opponents win the game! Better luck next time!`)
    } else {
        setTimeout(() => startNewRound(), 2000)
    }
}

function resetTricks() {
    tricksTeam1 = 0
    tricksTeam2 = 0
    for (let player of players) {
        player.tricksWon = 0
    }
}
const express = require('express')
const app = express()
const cors = require('cors')
// app.use(cors())
const http = require('http')
const server = http.createServer(app)
const { Server } = require("socket.io")

const _ = require('lodash')

// TODO Move to shared
const GameState = require('../client/src/common/game-state')
const PlayerAction = require('../client/src/common/player-action')
const Lobby = require('../client/src/common/lobby')


const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000"
  }
})
const devToolsNamespace = io.of('/devtools')

const PORT = 4000

var lobbies = [new Lobby()]

server.listen(PORT, () => {
  console.log(`El-juego-backend - Listening on *:${PORT}`)
})

app.get('/', (req,res) => {
  res.sendFile(__dirname + '/socketiotest.html')
})

/****************** DEV-TOOLS ***************/
devToolsNamespace.on('connection', (socket) => {
  console.log('dev tools connected')

  socket.on('dev-start-game', () => {    
    initNewGame()

    if (lobbies[0].gameState) {
      socket.emit('new-game-state', lobbies[0].gameState)
    }
  })

  socket.on('dev-stop-game', () => {   
      lobbies[0].gameState = new GameState()

      console.log("Deleting game... ")
      socket.emit('new-game-state', lobbies[0].gameState)
  })
})

/****************** PLAYERS ***************/
io.on('connection', (socket) => {
  const uid = (Math.random() + 1).toString(36).substring(7)
  lobbies[0].addPlayer(socket.id, 'default_name', uid)
  io.to(socket.id).emit('get-uid', uid)

  var room = "room1"
  socket.join(room);

  socket.on('player-action', (playerAction) => {
    const action = PlayerAction.Create(playerAction) // reconstitute prototype.. how?

    updateGame(action)

    socket.to(room).emit("new-game-state",  lobbies[0].gameState)
  })

  socket.on('end-turn', (uid) => {
    // todo check that the emitter can end the turn
    endTurn(uid)

    socket.to(room).emit("new-game-state", lobbies[0].gameState)
  })
  
  socket.on('disconnect', () => {
    console.log('a user has disconnected')
    lobbies[0].removePlayer(socket.id)
  })
})

/**
 * Updates the game state when a player makes an action
 * todo
 * 1- validate game exists
 * @param {*} action 
 * @returns the new state of the game
 */
const updateGame = (action) => {
  var gameState = lobbies[0].gameState

  if (!gameState) {
    console.log("can't update game: no games.")
  } else {
    if (!isValidAction(action)) {
      console.log("THIS ACTION IS INVALID!!!!!!!!!")
      return gameState // defaults to returning the current game state
    } else {
      // place the card on top of the selected center pile
      gameState.setPile(action.pileId, action.cardPlayed)
      
      //remove card from player's hand
      gameState.removeCard(action.playerId, action.cardPlayed)

      if (gameState.cardsLeftToPlay > 0) {
        gameState.cardsLeftToPlay -= 1
      }

      //todo check if game is over after this action
      checkIfGameIsOver(gameState)
    }
  }
}

/************ GAME STATE UPDATES ***************/
// todo extract to file
const initNewGame = () => {
  const piles = [1, 100, 1, 100]
  var drawPile = _.range(2,99)
  var hands = []
  lobbies[0].players.forEach(player => {
    const drawnCards = _.sampleSize(drawPile, 6)
    drawPile = drawPile.filter(card => !drawnCards.includes(card))
    hands.push({
      uid: player.uid, 
      cards: drawnCards
    })
  })

  const firstToPlayUid = lobbies[0].players[0].uid // first palyer registered starts by default
  lobbies[0].gameState = new GameState(hands, piles, drawPile, firstToPlayUid)
  console.log('Creating new game...')    
}

/**
 * Checks if player can play a card with the current setup
 * @param {*} uid 
 */
const canPlayCard = (uid, gameState) => {
  var canPlay = false
  const hand = gameState.getCards(uid)
  if (hand.length > 0) {
    hand.forEach(card => {
      // si une carte peut etre jouee, not over
      if (card > gameState.pileOne 
        || card < gameState.pileTwo
        || card > gameState.pileThree
        || card < gameState.pileFour
        || card == gameState.pileOne - 10
        || card == gameState.pileTwo + 10
        || card == gameState.pileThree - 10
        || card == gameState.pileFour + 10) {
          canPlay = true
        }
    })
  } 

  return canPlay
}

/**
 * Checks if game is over. If so, ends the game
 */
const checkIfGameIsOver = (gameState) => {
  var canPlay = canPlayCard(gameState.turn, gameState)

  console.log('can Play?', canPlay, '. gameState.cardsLeftToPlay', gameState.cardsLeftToPlay)
  if (!canPlay) {
    const allHands = _.flattenDeep(gameState.hands.map(x => x.cards))
    // lose if
    // 1. Can't play but still needs to play a card
    // 2. Can't play and so can't the next player
    if (gameState.cardsLeftToPlay > 0 || (gameState.cardsLeftToPlay == 0 && !canPlayCard(getNextPlayer(), gameState))) {   
      console.log('next player cannot play?', !canPlayCard(getNextPlayer(), gameState))
      endGame(gameState, false)
    } 
    // win if there are no cards left
    else if (allHands.length == 0 && gameState.drawPile.length === 0) {
      endGame(gameState, true)
    }
    // otherwise, continue playing...
  }
}

const endGame = (gameState, isWin) => {
  const endResult = isWin ? 'win' : 'lose'
  gameState.endResult = endResult
  
  console.log("GAME OVER. RESULT: ", endResult)
}

const isValidAction = (action) => {
  var valid = true

  // Action form is not valid
  if (!action.isValid()) {
    console.log('The action form is invalid')
    valid = false
  }
  // Player is not registered in the lobby
  if (!lobbies[0].players.filter(p => p.uid === action.playerId).length > 0) {
    console.log(`The player with id ${action.playerId} is not found in this lobby.`)
    valid = false
  }
  // It is not the player's turn
  else if (action.playerId != lobbies[0].gameState.turn) {
    console.log(`It is not this player's turn to play (turn: ${lobbies[0].gameState.turn}). Action canceled`)
    valid = false
  }
  // Check if card can be played on ASCENDING piles
  else if (action.pileId == 0 || action.pileId === 2) {
    var pileCard = lobbies[0].gameState.piles[action.pileId]
    if (pileCard > action.cardPlayed && action.cardPlayed != pileCard - 10) { // +10 rule
      console.log(`The card ${action.cardPlayed} cannot be played on the pile ${action.pileId}. ${pileCard} > ${action.cardPlayed}, ${pileCard} - 10 != ${action.cardPlayed}`)
      valid = false
    }
  }
  // Check if card can be played on DESCENDING piles
  else if (action.pileId == 1 || action.pileId == 3) {
    var pileCard = lobbies[0].gameState.piles[action.pileId]
    if (pileCard < action.cardPlayed && action.cardPlayed != pileCard + 10) { // -10 rule
      console.log(`The card ${action.cardPlayed} cannot be played on the pile ${action.pileId}. ${pileCard} < ${action.cardPlayed}, ${pileCard} + 10 != ${action.cardPlayed}`)
      valid = false
    }
  } 
  
  return valid
}

const endTurn = (uid) => {
  var gameState = lobbies[0].gameState

  // set number of cards left to play if it is this player's turn to play
  if (gameState.cardsLeftToPlay == 0) {
    //give player a new card from the draw pile (if not empty)
    var drawPile = gameState.drawPile
    var hand = gameState.getCards(uid)
    while (hand.length < 6 && drawPile.length > 0) { // fill 
      var newCard = _.sample(drawPile)
      gameState.addCard(uid, newCard)

      // remove card from draw pile
      drawPile = drawPile.filter(card => card != newCard)
      gameState.drawPile = drawPile // todo necessary? seems so... is drawPile ref or value
    }
    // select next player
    const nextPlayerUid = getNextPlayer()
    if (nextPlayerUid != '') {
      gameState.turn = nextPlayerUid
    } else {
      console.log("ERROR: THERE IS NO NEXT PLAYER AND GAME NOT OVER")
    }
    if (gameState.drawPile.length == 0) {
      gameState.cardsLeftToPlay = 1
    } else {
      gameState.cardsLeftToPlay = 2
    }
  } else {
    console.log(`ERROR: ${gameState.turn} needs to play ${gameState.cardsLeftToPlay} cards. CAN'T END`)
  }
    
  checkIfGameIsOver(gameState)
}

/**
 * Returns the next player's uid whose turn it is to play.
 * If no player is chosen, returns an empty string (game over)
 */
 const getNextPlayer = () => {
  var players = lobbies[0].players

  const currentIndex = players.findIndex(player => player.uid == lobbies[0].gameState.turn)
  
  var nextPlayerUid = ''
  for (var i = 1; i <= players.length && nextPlayerUid == ''; i++) {
    const uid = players[(currentIndex + i) % players.length].uid
    if (lobbies[0].gameState.getCards(uid).length > 0) {
      nextPlayerUid = uid
    }
  }

  return nextPlayerUid
}
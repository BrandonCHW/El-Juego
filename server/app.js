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

    const newGameState = updateGame(socket.id, action)

    // console.log('new state: ', newGameState)
    socket.to(room).emit("new-game-state", newGameState)
  })
  
  socket.on('disconnect', () => {
    console.log('a user has disconnected')
    lobbies[0].removePlayer(socket.id)
  })
})


/**
 * Updates the game state when a player makes an action
 * todos
 * 1- validate action fields
 * 2- validate game exists
 * @param {*} action 
 * @returns the new state of the game
 */
const updateGame = (socket, action) => {
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
      
      // checkIfGameIsOver(lobbies[0].gameState)

      //remove card from player's hand
      var hand = gameState.getHand(action.playerId)
      hand.cards = hand.cards.filter(card => card != action.cardPlayed)

      //give player a new card from the draw pile (if not empty)
      var drawPile = gameState.drawPile
      if (drawPile.length > 0) {
        var newCard = _.sample(drawPile)
        hand.cards.push(newCard)

        // remove card from draw pile
        drawPile = drawPile.filter(card => card != newCard)
        gameState.drawPile = drawPile
      }

      return gameState
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

  const firstToPlayUid = lobbies[0].players[0].uid //player 1 starts by default...
  lobbies[0].gameState = new GameState(hands, piles, drawPile, firstToPlayUid)
  console.log('Creating new game...')    
}
/**
 * Checks if game is over (win/lose/ongoing)
 */
const checkIfGameIsOver = (gameState) => {
  var isOver = true
  var cardsInHands = _.flattenDeep(gameState.hands) // todo change: only the current player's hand
  if (cardsInHands.length > 0) {
    cardsInHands.forEach(card => {
      // si une carte peut etre jouee, not over
      if (card > gameState.pileOne 
        || card < gameState.pileTwo
        || card > gameState.pileThree
        || card < gameState.pileFour
        || card == gameState.pileOne - 10
        || card == gameState.pileTwo + 10
        || card == gameState.pileThree - 10
        || card == gameState.pileFour + 10) {
          isOver = false
        }
    })
  }
  
  return isOver
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
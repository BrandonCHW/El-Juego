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

io.on('connection', (socket) => {
  lobbies[0].addPlayer(socket.id, 'default_name')

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
  if (!lobbies[0].gameState) {
    console.log("can't update game: no games.")
  } else {
    if (!isValidAction(action)) {
      console.log("THIS ACTION IS INVALID!!!!!!!!!")
      return lobbies[0].gameState // defaults to returning the current game state
    } else {
      // place the card on top of the selected center pile
      lobbies[0].gameState.piles[action.pileId] = action.cardPlayed
      
      // checkIfGameIsOver(lobbies[0].gameState)

      //remove card from player's hand
      var hand = lobbies[0].gameState.hands[action.playerId]
      hand = hand.filter(card => card != action.cardPlayed)

      //give player a new card from the draw pile (if not empty)
      var drawPile = lobbies[0].gameState.drawPile
      if (drawPile.length > 0) {
        var newCard = _.sample(drawPile)
        hand.push(newCard)

        // remove card from draw pile
        drawPile = drawPile.filter(card => card != newCard)
        lobbies[0].gameState.drawPile = drawPile
      }

      // save
      lobbies[0].gameState.hands[action.playerId] = hand

      return lobbies[0].gameState
    }
  }
}

/************ GAME STATE UPDATES ***************/
// todo extract to file
const initNewGame = () => {
  const piles = [1, 100, 1, 100]
  var drawPile = _.range(2,99)
  var hands = []
  hands.push(_.sampleSize(drawPile, 6)) // player 1, 6 cards for now...
  drawPile = drawPile.filter(card => !hands[0].includes(card))

  hands.push(_.sampleSize(drawPile, 6)) // player 2, 6 cards for now...
  drawPile = drawPile.filter(card => !hands[1].includes(card))    
        
  lobbies[0].gameState = new GameState(hands, piles, drawPile)
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

  if (!action.isValid()) {
    console.log('The action form is invalid')
    valid = false
  }
  // Ascending piles
  else if (action.pileId == 0 || action.pileId === 2) {
    var pileCard = lobbies[0].gameState.piles[action.pileId]
    if (pileCard > action.cardPlayed && action.cardPlayed != pileCard - 10) { // +10 rule
      console.log(`The card ${action.cardPlayed} cannot be played on the pile ${action.pileId}. ${pileCard} > ${action.cardPlayed}, ${pileCard} - 10 != ${action.cardPlayed}`)
      valid = false
    }
  }
  // Descending piles
  else if (action.pileId == 1 || action.pileId == 3) {
    var pileCard = lobbies[0].gameState.piles[action.pileId]
    if (pileCard < action.cardPlayed && action.cardPlayed != pileCard + 10) { // -10 rule
      console.log(`The card ${action.cardPlayed} cannot be played on the pile ${action.pileId}. ${pileCard} < ${action.cardPlayed}, ${pileCard} + 10 != ${action.cardPlayed}`)
      valid = false
    }
  } 
  
  return valid
}
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


const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000"
  }
})

const PORT = 4000

var games = []

app.get('/', (req,res) => {
  res.sendFile(__dirname + '/socketiotest.html')
})

io.on('connection', (socket) => {
  console.log('a new user has connected')


  socket.on('disconnect', () => {
    console.log('a user has disconnected')
  })

  socket.on('player-action', (action) => {
    const newGameState = updateGame(action)

    console.log('sending new game: ', games[0])

    socket.emit("new-game-state", newGameState)
  })

  /*********** dev-tools ***********/
  socket.on('start-game', () => {    
    initNewGame()

    if (games[0]) {
      socket.emit('new-game-state', games[0])
    }
  })

  socket.on('stop-game', () => {    
    if (games.length > 0) {
      games = []

      console.log("Deleting all games... games: ", games.length)
      socket.emit('new-game-state', new GameState())
    } else {
      console.log('No games!')
    }
  })
})

server.listen(PORT, () => {
  console.log(`El-juego-backend - Listening on *:${PORT}`)
})

/**
 * Updates the game state when a player makes an action
 * todos
 * 1- validate action fields
 * 2- validate game exists
 * @param {*} action 
 * @returns the new state of the game
 */
const updateGame = (action) => {
  if (games[0]) {
    // place the card on top of the selected center pile
    games[0].piles[action.pileId] = action.cardPlayed

    //remove card from player's hand
    var hand = games[0].hands[action.playerId]
    hand = hand.filter(card => card != action.cardPlayed)

    //give player a new card from the draw pile
    var newCard = _.sample(games[0].drawPile)
    var drawPile = games[0].drawPile
    hand.push(newCard)
    games[0].hands[0] = hand

    // remove card from draw pile
    drawPile = drawPile.filter(card => card != newCard)
    games[0].drawPile = drawPile

    return games[0]
  } else {
    console.log("can't update game: no games.")
  }
}

/************ GAME STATE UPDATES ***************/
// todo extract to file
const initNewGame = () => {
  // todo enlever
  if (games.length == 0) {
    const piles = [1, 100, 1, 100]
    var drawPile = _.range(2,99)
    var hands = []
    hands.push(_.sampleSize(drawPile, 6)) // draw 6 cards for x players
    drawPile = drawPile.filter(card => !hands[0].includes(card))

    hands.push(_.sampleSize(drawPile, 6)) // draw 6 cards for x players
    drawPile = drawPile.filter(card => !hands[1].includes(card))    
      
    games.push(new GameState(hands, piles, drawPile))
    console.log('Creating new game... games: ', games.length)    
  } else {
    console.log('Game exists already...')
  }
}

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

    socket.emit("new-game-state", newGameState)
  })

  /*********** dev-tools ***********/
  socket.on('start-game', () => {    
    initNewGame()

    if (games[0])
      console.log('sending new game: ', games[0])
      socket.emit('new-game-state', games[0])
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
 * todos
 * 1- validate action fields
 * 2- validate game exists
 * @param {*} action 
 * @returns the new state of the game
 */
const updateGame = (action) => {
  if (games[0]) {
    var currentGame = games[0]
    var cardPlayed = action.cardPlayed
    var pileId = action.pileId

    currentGame.piles[pileId] = cardPlayed
    games[0] = currentGame // ??

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
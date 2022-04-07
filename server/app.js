const express = require('express')
const app = express()
const cors = require('cors')
// app.use(cors())
const http = require('http')
const server = http.createServer(app)
const { Server } = require("socket.io")
const { emit } = require('process')

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
    console.log(action) // PlayerAction

    socket.emit("new-game-state", { hello: 'yo' })
  })

  socket.on('player-action', (action) => {
    console.log(action) // PlayerAction

    socket.emit("new-game-state", { hello: 'yo' })
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
  console.log(`el-juego-backend: listening on *:${PORT}`)
})

const updateGame = (action) => {

  var newHands = action.hands
  return new GameState()
}

const initNewGame = () => {
  // todo enlever
  if (games.length == 0) {
    const hands = [
      ['9','2','3','4','5','6'],
      ['7','8','10','11','36','56'],
    ]
    const piles = [1, 100, 1, 100]
    const drawPile = []
  
    games.push(new GameState(hands, piles, drawPile))
    console.log('Creating new game... games: ', games.length)    
  } else {
    console.log('game exists already...')
  }
}

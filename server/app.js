const express = require('express')
const app = express()
const cors = require('cors')
// app.use(cors())
const http = require('http')
const server = http.createServer(app)
const { Server } = require("socket.io")
const { emit } = require('process')

// TODO Move to shared
const { GameState } = require('../client/src/common/game-state')
const { PlayerAction } = require('../client/src/common/player-action')


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
})

server.listen(PORT, () => {
  console.log(`el-juego-backend: listening on *:${PORT}`)
})

const updateGame = (action) => {

  var newHands = action.hands
  return new GameState()
}

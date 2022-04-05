const express = require('express')
const app = express()
const cors = require('cors')
// app.use(cors())
const http = require('http')
const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000"
  }
})

const PORT = 4000

app.get('/', (req,res) => {
  res.sendFile(__dirname + '/socketiotest.html')
})

io.on('connection', (socket) => {
  console.log('a new user has connected')

  socket.on('disconnect', () => {
    console.log('a user has disconnected')
  })
})

server.listen(PORT, () => {
  console.log(`el-juego-backend: listening on *:${PORT}`)
})

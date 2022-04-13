const _ = require('lodash')
const GameState = require('./game-state')

class Lobby {    
  constructor(gameState = null) {
    this.roomName = ''
    this.players = [] // {socketId: string, name?: string}
    this.gameState = gameState instanceof GameState ? gameState : new GameState()
  }

  addPlayer(socketId, name='',)  {
    if (this.players.filter(p => p.socketId === socketId).length === 0) {
      this.players.push({
        socketId: socketId,
        name: name,        
      })
      console.log('New player added. Players:', this.players)
    } else {
      console.log("player already registered")
    }
  }

  removePlayer(socketId) {
    _.remove(this.players, (entry) => entry.socketId === socketId)
    console.log('Player removed. players: ', this.players)
  }
}

module.exports = Lobby
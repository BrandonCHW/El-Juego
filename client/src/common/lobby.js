const _ = require('lodash')

class Lobby {
  
  roomName = ''
  players = [] // {socketId: string, name?: string}
  
  constructor() {
    this.roomName = ''
    this.players = []

    //todo add gamestate here. Lobby is superset of gamestate (1 <-> 1)
  }

  addPlayer(socketId, name='')  {
    if (this.players.filter(p => p.socketId === socketId).length === 0) {
      this.players.push({
        socketId: socketId,
        name: name
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
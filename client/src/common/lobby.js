class Lobby {
  
  roomName = ''
  joinedPlayers = [] // {socketId: string, name?: string}
  
  constructor() {
    this.joinedPlayers = []

    //todo add gamestate here. Lobby is superset of gamestate (1 <-> 1)
  }

  addPlayer(socketId, name='')  {
    this.joinedPlayers.push({
      socketId: socketId,
      name: name
    })
  }

  removePlayer(socketId) {
    this.joinedPlayers = _.remove(this.joinedPlayers, (entry) => entry.socketId === socketId)
  }
}

module.exports = Lobby
// the common/ folder has to reside inside of src: https://stackoverflow.com/questions/44114436/the-create-react-app-imports-restriction-outside-of-src-directory

export class PlayerAction {
  constructor(playerId, cardPlayed) {
    this.playerId = playerId
    this.cardPlayed = cardPlayed
  }   
}
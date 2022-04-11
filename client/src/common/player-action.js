// the /common/ folder has to reside inside of src: https://stackoverflow.com/questions/44114436/the-create-react-app-imports-restriction-outside-of-src-directory
// todo: yarn workspace for /shared/ folder: https://classic.yarnpkg.com/en/docs/workspaces/

class PlayerAction {
  /**
   * 
   * @param {*} playerId player id
   * @param {*} cardPlayed value of the card played (2-99)
   * @param {*} pileId id of the pile (1-4)
   */
  constructor(playerId, cardPlayed, pileId) {
    this.playerId = playerId // todo move to gamestate / lobby
    this.cardPlayed = cardPlayed
    this.pileId = pileId
  }

  static Create(action) {
    return new PlayerAction(action.playerId, action.cardPlayed, action.pileId)
  }

  isValid() {
    console.log(this)
    return this.playerId >= 0 
        && this.cardPlayed > 1 
        && this.cardPlayed < 100
        && this.pileId >= 0
        && this.pileId <= 3
  }
}

module.exports = PlayerAction
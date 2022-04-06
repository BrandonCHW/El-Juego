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
    this.playerId = playerId
    this.cardPlayed = cardPlayed
    this.pileId = pileId
  }   
}

module.exports = PlayerAction
// todo make this into a getter. Move all fields to lobby
class GameState {  
  constructor(hands = [], piles = [], drawPile = [], turn = -1) {
      this.hands = hands // { uid: string, cards: number[] } 
      this.piles = piles // TODO changer en []
      this.drawPile = drawPile
      this.turn = turn
  }

  // Returns the players hand object
  // todo find a better way to find a player's hand
  getHand(uid) {
    const hand = this.hands.find(x => x.uid === uid)
    return hand.length > 0 ? hand[0] : {}
  }

  // ascending
  get pileOne() { return this.piles[0] ?? '0' }

  // Descending
  get pileTwo() { return this.piles[1] ?? '0' }
  
  // ascending
  get pileThree() { return this.piles[2] ?? '0' }

  // Descending
  get pileFour() { return this.piles[3] ?? '0' }

  setPile(pileId, value) {
    this.piles[pileId] = value
  }
  // todo maybe do a diff-merge method??
}

module.exports = GameState
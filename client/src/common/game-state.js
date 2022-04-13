class GameState {  
  constructor(hands = [], piles = [], drawPile = [], turn = -1) {
      this.hands = hands
      this.piles = piles // TODO changer en []
      this.drawPile = drawPile
      this.turn = turn
  }

  // ascending
  get pileOne() { return this.piles[0] ?? '0' }

  // Descending
  get pileTwo() { return this.piles[1] ?? '0' }
  
  // ascending
  get pileThree() { return this.piles[2] ?? '0' }

  // Descending
  get pileFour() { return this.piles[3] ?? '0' }

  // todo maybe do a diff-merge method??
}

module.exports = GameState
class GameState {  
  constructor(hands = [], piles = [], drawPile = []) {
      this.hands = hands
      this.piles = piles // TODO changer en []
      this.drawPile = drawPile
  }

  // todo maybe do a diff-merge method??
}

module.exports = GameState
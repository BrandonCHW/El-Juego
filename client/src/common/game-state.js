class GameState {  
  constructor(hands = [], piles = [], drawPile = []) {
      this.hands = hands
      this.piles = piles // TODO changer en []
      this.drawPile = drawPile
  }
}

module.exports = GameState
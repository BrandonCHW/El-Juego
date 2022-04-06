// let GameState = function(hands = [], centerBoard = [], drawPile = []) {
//   this.hands = hands
//   this.centerBoard = centerBoard
//   this.drawPile = drawPile
// }

class GameState {  
  constructor(hands = [], centerBoard = [], drawPile = []) {
      this.hands = hands
      this.centerBoard = centerBoard
      this.drawPile = drawPile
  }
}

module.exports = GameState
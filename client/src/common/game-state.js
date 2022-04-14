// todo make this into a getter. Move all fields to lobby
class GameState {  
  constructor(hands = [], piles = [], drawPile = [], turn = -1, cardsLeftToPlay = 2) {
      this.hands = hands // { uid: string, cards: number[] } 
      this.piles = piles // TODO changer en []
      this.drawPile = drawPile
      this.turn = turn
      this.cardsLeftToPlay = 2 // # of cards left to play (2: pile not empty, 1: pile empty)
  }

  // Returns the players hand object
  getCards(uid) {
    const hand = this.hands.find(x => x.uid === uid)
    return hand.cards.length > 0 ? hand.cards : {}
  }

  setCards(uid, cards) {
    const hand = this.hands.find(x => x.uid === uid)
    if (hand) {
      hand.cards = cards
    } else {
      console.log(`Can't set card for uid ${uid}: uid not found!`)
    }
  }

  // todo find a better way to find a player's hand
  addCard(uid, card) {    
    var hand = this.hands.find(x => x.uid === uid)
    if (hand) {
      hand.cards.push(card)
    } else {
      console.log(`Can't remove card for uid ${uid}: uid not found!`)
    }
  }

  removeCard(uid, card) {
    var hand = this.hands.find(x => x.uid === uid)
    if (hand) {
      console.log("FOUND. REMOVING CARD SUCCESS FOR ", uid)
      console.log('BEFORE: ', hand.cards)
      hand.cards = hand.cards.filter(x => x !== card)
      console.log('AFTER: ', hand.cards)
    } else {
      console.log(`Can't remove card for uid ${uid}: uid not found!`)
    }
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
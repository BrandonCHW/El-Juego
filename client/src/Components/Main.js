import React, { useState, useEffect } from 'react';
import './Main.css';
import PlayerHand from './PlayerHand'
import CenterBoard from './CenterBoard';

function Main(props) {
    // 1 state per values that tend to change together
    const [selectedPileId, setSelectedPileId] = useState()
    const [selectedPlayedOneCard, setSelectedPlayedOneCard] = useState()
    const [selectedPlayedTwoCard, setSelectedPlayedTwoCard] = useState()
    const [playerOneCards, setPlayerOneCards] = useState(['1','2','3','97','98','99'])
    const [playerTwoCards, setPlayerTwoCards] = useState(['1','2','3','97','98','99'])

    useEffect(() => {
        console.log('lobby is loaded')
    })
        
    const handlePlayCard = (playerId, playedCardValue) => {
        if (playerId === 1) {
            setSelectedPlayedOneCard(playedCardValue)
        }
         else if (playerId === 2) {
            setSelectedPlayedTwoCard(playedCardValue)
        }
        console.log(`player ${playerId} played card ${playedCardValue} on pile ${selectedPileId}`)
    }

    return ( 
        <div className="Main">
            <h2>El Juego</h2>
            <CenterBoard onSelectPile={(id) => {
                console.log('change pile to: ', id)
                setSelectedPileId(id)
                }
            }/>
            <div>
                <PlayerHand name="Player1" hand={playerOneCards} onPlay={(value) => handlePlayCard(1, value)}/>
                <PlayerHand name="Player2" hand={playerTwoCards} onPlay={(value) => handlePlayCard(2, value)}/>
            </div>
        </div> 

        
    );
    
}
    
    export default Main;
import React, { useState, useEffect } from 'react';
import './Main.css';
import PlayerHand from './PlayerHand'
import CenterBoard from './CenterBoard';

function Main(props) {
    const [state, setState] = useState({ cards: ['1','2','3','97','98','99']})

    useEffect(() => {
        console.log('lobby is loaded')
    })
    
    const handlePlayCard = (playedCardValue) => {
        console.log('playing card: ', playedCardValue)
    }

    return ( 
        <div className="Main">
            <h2>El Juego</h2>
            <CenterBoard></CenterBoard>
            <div>
                <PlayerHand name="Player1" hand={state.cards} onPlay={(value) => handlePlayCard(value)}/>
                <PlayerHand name="Player2" hand={state.cards}/>
            </div>
        </div> 
    );
}
    
    export default Main;
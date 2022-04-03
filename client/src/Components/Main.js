import React, { useState, useEffect } from 'react';
import './Main.css';
import PlayerHand from './PlayerHand'

function Main(props) {
    const [state, setState] = useState({ cards: ['1','2','3','97','98','99']})

    useEffect(() => {
        console.log('lobby is loaded')
    })
    
    return ( 
        <div className="Main">
            <h2>HELLO</h2>
            <p style={{color: "red", background: '#282c34'}}>inside lobby</p>
            <div>
                <PlayerHand name="Player1" hand={state.cards}/>
                <PlayerHand name="Player2" hand={state.cards}/>
            </div>
        </div> 
    );
}
    
    export default Main;
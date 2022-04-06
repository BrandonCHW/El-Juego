import React, { useState, useEffect } from 'react';
import './Main.css';
import PlayerHand from './PlayerHand'
import CenterBoard from './CenterBoard';
import { Button } from 'react-bootstrap';
import io from 'socket.io-client'
import DevTools from './DevTools';
import PlayerAction from '../common/player-action'
import GameState from '../common/game-state';

function Main(props) {
    // 1 state per values that tend to change together
    const [selectedPileId, setSelectedPileId] = useState()
    const [selectedPlayedOneCard, setSelectedPlayedOneCard] = useState()
    const [selectedPlayedTwoCard, setSelectedPlayedTwoCard] = useState()
    const [playerOneCards, setPlayerOneCards] = useState(['1','2','3','97','98','99'])
    const [playerTwoCards, setPlayerTwoCards] = useState(['1','2','3','97','98','99'])
    let state = new GameState()
    const [gameState, setGameState] = useState(state)
        
    const [connect, setConnect] = useState(false)
    const [socket, setSocket] = useState(null)
        
    useEffect(() => {
        if (connect) {
            const newSocket = io(`http://${window.location.hostname}:4000`) 
            console.log(`connected to: http://${window.location.hostname}:4000`)

            // events
            newSocket.on('new-game-state', (gameState) => {
                console.log('new game state: ', gameState)
            })

            setSocket(newSocket)
            
            return () => {
                newSocket.close() // si la page rafraichit, va etablir une nouvelle connexion...
            }
        }
    }, [connect, setSocket])


    const connectToServer = () => {
        setConnect(!connect)
      }
    
    const handlePlayCard = (playerId, playedCardValue) => {
        if (playerId === 1) {
            setSelectedPlayedOneCard(playedCardValue)
        }
         else if (playerId === 2) {
            setSelectedPlayedTwoCard(playedCardValue)
        }
        console.log(`player ${playerId} played card ${playedCardValue} on pile ${selectedPileId}`)

        const action = new PlayerAction(playerId, playedCardValue, selectedPileId)

        socket.emit('player-action', action)
    }

    return ( 
        <>
            <div className="Main">
            <DevTools></DevTools>
                <h2>El Juego</h2>
                <CenterBoard 
                    onSelectPile={(id) => {
                        console.log('change pile to: ', id)
                        setSelectedPileId(id)
                    }
                }/>
                <div>
                    <PlayerHand name="Player1" hand={playerOneCards} onPlay={(value) => handlePlayCard(1, value)}/>
                    <Button onClick={() => connectToServer()}>P1 connect</Button>
                    { connect ? 
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-check" viewBox="0 0 16 16" color='lightgreen'>
                        <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                    </svg>
                    :       
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16" color='red'>
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                    </svg> }
                    <PlayerHand name="Player2" hand={playerTwoCards} onPlay={(value) => handlePlayCard(2, value)}/>
                </div>
            </div> 
        </>
    );
    
}
    
    export default Main;
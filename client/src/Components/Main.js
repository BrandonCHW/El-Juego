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
    const [gameState, setGameState] = useState(new GameState())
        
    const [connect, setConnect] = useState(true)
    const [socket, setSocket] = useState(null)

    // temp player 2
    const [connect2, setConnect2] = useState(true)
    const [socket2, setSocket2] = useState(null)
        
    useEffect(() => {
        if (connect) {
            const newSocket = io(`http://${window.location.hostname}:4000`) 
            console.log(`player 1 connected to: http://${window.location.hostname}:4000`)

            // events
            newSocket.on('new-game-state', (gameState) => {
                console.log('new game state: ', gameState)
                setGameState(gameState)
            })

            setSocket(newSocket)
            
            return () => {
                newSocket.close() // si la page rafraichit, va etablir une nouvelle connexion...
            }
        }
    }, [connect,setSocket])

    useEffect(() => {        
        if (connect2) {
            const newSocket2 = io(`http://${window.location.hostname}:4000`) 
            console.log(`player 2 connected to: http://${window.location.hostname}:4000`)
            
            newSocket2.on('new-game-state', (gameState) => {
                console.log('new game state: ', gameState)
                setGameState(gameState)
            })

            setSocket2(newSocket2) 
            
            return () => {
                newSocket2.close() // si la page rafraichit, va etablir une nouvelle connexion...
            }
        }
    }, [ connect2, setSocket2, ])

    const connectToServer = () => {
        console.log('player 1', connect ? "disconnects" : "connects")
        setConnect(!connect)
    }
    
    const connectToServer2 = () => {
        console.log('player 2', connect2 ? "disconnects" : "connects")
        setConnect2(!connect2)
    }
    
    const handlePlayCard = (playerSocket, playerId, playedCardValue) => {
        if (!playerSocket) {
            console.log("Can't play card: you are not connected lol")
        } else {
            console.log(`player ${playerId} played card ${playedCardValue} on pile ${selectedPileId}`)
    
            const action = new PlayerAction(playerId, playedCardValue, selectedPileId)
    
            playerSocket.emit('player-action', action)
        }
    }

    /******* DEV-TOOLS ONLY ********/ 
    const HandleManualNewGameState = (state) => {
        console.log(state)
        setGameState(state)
    }
    /*******************************/ 

    return ( 
        <>
            <div className="Main">
            <DevTools OnNewGameState={(state) => HandleManualNewGameState(state)}></DevTools>
                <h2>El Juego</h2>
                <CenterBoard
                    piles={gameState?.piles ?? []}
                    onSelectPile={(id) => {
                        console.log('change pile to: ', id)
                        setSelectedPileId(id)
                    }}/>
                <div>
                    <PlayerHand name="Player1" hand={gameState?.hands[0] ?? [0,0,0,0,0,0]} onPlay={(value) => handlePlayCard(socket, 0, value)}/>
                    <Button onClick={() => connectToServer()}>P1 connect</Button>
                    { connect ? 
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-check" viewBox="0 0 16 16" color='lightgreen'>
                        <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                    </svg>
                    :       
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16" color='red'>
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                    </svg> }

                    <PlayerHand name="Player2" hand={gameState?.hands[1] ?? [0,0,0,0,0,0]} onPlay={(value) => handlePlayCard(socket2, 1, value)}/>
                    <Button onClick={() => connectToServer2()}>P2 connect</Button>
                    { connect2 ? 
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-check" viewBox="0 0 16 16" color='lightgreen'>
                        <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                    </svg>
                    :       
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16" color='red'>
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                    </svg> }
                </div>
            </div> 
        </>
    );
}
    
export default Main;
import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import { io } from 'socket.io-client'

function DevTools(props) {
  const [connect, setConnect] = useState(false)
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    const newSocket = io("http://localhost:4000/devtools")
    setSocket(newSocket)
    setConnect(true)
    
    newSocket.on('new-game-state', (state) => {
      console.log('NEW GAME STATE!!!')
      props.OnNewGameState(state)
    },[setConnect])

    console.log('dev tools is connected to backend')
    
    return () => {
      newSocket.close()
      console.log('dev tools disconnected from backend')
    }
  },[setSocket])

  return (
    <>
      <div>DevTools</div>
      <Button onClick={() => socket.emit('dev-start-game')}>Start Game</Button>   
      <Button onClick={() => socket.emit('dev-stop-game')}>Stop Game</Button>   
      { connect ? 
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-check" viewBox="0 0 16 16" color='lightgreen'>
          <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
      </svg>
      :       
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16" color='red'>
          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
      </svg> }
    </>)
}

export default DevTools
import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import { io } from 'socket.io-client'

function DevTools(props) {
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    const newSocket = io("http://localhost:4000")
    setSocket(newSocket)
    
    newSocket.on('new-game-state', (state) => {
      console.log('NEW GAME STATE!!!')
      props.OnNewGameState(state)
    })

    console.log('dev tools is connected to backend')
    
    return () => {
      newSocket.close()
    }
  },[setSocket])

  return (
    <>
      <div>DevTools</div>
      <Button onClick={() => socket.emit('start-game')}>Start Game</Button>   
      <Button onClick={() => socket.emit('stop-game')}>Stop Game</Button>   
    </>)
}

export default DevTools
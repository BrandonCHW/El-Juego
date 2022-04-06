import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import { io } from 'socket.io-client'

function DevTools() {
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    const newSocket = io("http://localhost:4000")
    setSocket(newSocket)
    console.log('dev tools is connected to backend')
    
    return () => {
      newSocket.close()
    }
  },[setSocket])

  return (
    <>
      <div>DevTools</div>
      <Button>Start Game</Button>   
    </>)
}

export default DevTools
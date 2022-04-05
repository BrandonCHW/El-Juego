import Card from "./PlayerCard";
import { useState, useEffect, useRef } from "react";
import { Button } from "react-bootstrap";
import io from 'socket.io-client'

function PlayerHand(props) {
  const [connect, setConnect] = useState(false)
  const [socket, setSocket] = useState(null)
  const [selectedCard, setSelectedCard] = useState({ key: -1, value: 0 });

  useEffect(() => {
    if (connect) {
      console.log('BITCONNECT BECAUSE connect IS: ', connect)
      const newSocket = io(`http://${window.location.hostname}:4000`) 
      setSocket(newSocket)
      // console.log('new socket connection:', socket)
  
      return () => {
        newSocket.close() // si la page rafraichie, va etablir une nouvelle connexion...
      }
    }
  }, [connect, setSocket])

  const handleClick = (event, card) => {
    setSelectedCard(card);
    console.log('selected new card: ', card)
  };

  const handlePlayCard = () => {
    if (selectedCard.key <= 0) {
      console.log("nothing to play. please select a card");
    } else {
      props.onPlay(selectedCard.value);
    }
  };

  const connectToServer = () => {
    setConnect(true)
  }

  return (
    // todo make them radio buttons
    <div>
      <label>{props.name}: </label>
      {props.hand.map((cardLabel, i) => {
        return (
          <Card
            key={i}
            value={cardLabel}
            onClick={(event) =>
              handleClick(event, { key: i, value: cardLabel })
            }
            isSelectedCard={selectedCard.key === i}
          />
        );
      })}{" "}
      <Button onClick={() => handlePlayCard()}>Play Card</Button>{' '}
      <Button onClick={() => connectToServer()}>Bitconnect</Button>
      { connect ? 
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-check" viewBox="0 0 16 16" color='lightgreen'>
        <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
      </svg>
      :       
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16" color='red'>
        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
      </svg> }
    </div>
  );
}

export default PlayerHand;

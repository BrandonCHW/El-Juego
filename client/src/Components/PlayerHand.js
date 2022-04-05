import Card from "./PlayerCard";
import { useState, useEffect, useRef } from "react";
import { Button } from "react-bootstrap";
import io from 'socket.io-client'

function PlayerHand(props) {
  const [connect, setConnect] = useState(false)
  const [socket, setSocket] = useState(null)
  const [selectedCard, setSelectedCard] = useState({ key: -1, value: 0 });

  // useEffect(() => {
  //   const newSocket = io(`http://${window.location.hostname}:3010`) 
  //   setSocket(newSocket)
  //   // console.log('new socket connection:', socket)

  //   return () => {
  //     newSocket.close() // si la page rafraichie, va etablir une nouvelle connexion...
  //   }
  // }, [setSocket, setConnect])

  
  useEffect(() => {
    const socket = io('http://localhost:4000');

    return () => socket.disconnect()
  }, []);


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
    </div>
  );
}

export default PlayerHand;

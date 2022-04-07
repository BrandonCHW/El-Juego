import Card from "./PlayerCard";
import { useState, useEffect, useRef } from "react";
import { Button } from "react-bootstrap";
import io from 'socket.io-client'

function PlayerHand(props) {
  const [selectedCard, setSelectedCard] = useState({ key: -1, value: 0 });

  useEffect(() => {
    setSelectedCard({key: -1, value: 0})
  }, [props.hand])
  
  const handleClick = (event, card) => {
    setSelectedCard(card);
    console.log('selected new card: ', card)
  };

  const handlePlayCard = () => {
    if (selectedCard.key < 0) {
      console.log("nothing to play. please select a card");
    } else {
      props.onPlay(selectedCard.value);
    }
  };
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
    </div>
  );
}

export default PlayerHand;

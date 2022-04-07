import Card from "./PlayerCard";
import { useState, useEffect } from "react";
import "./CenterBoard.css";

function CenterBoard(props) {
  const [piles, setPiles] = useState([1, 100, 1, 100])
  const [selectedCard, setSelectedCard] = useState({ key: -1, value: 0 });

  useEffect(() => {
    setPiles(props.piles)
  }, [props.piles])

  const handleClick = (event, card) => {
    props.onSelectPile(card.key)
    setSelectedCard(card);
  };

  

  return (
    <>
      <div>
        <small>Pile 1 (UP)</small>{" "}
        <Card
          key={1}
          value={piles[0] ?? ''}
          onClick={(event) => handleClick(event, { key: 1, value: 1 })}
          isSelectedCard={selectedCard.key === 1}
          isCenterCard
        />
        <Card
          key={2}
          value={piles[1] ?? ''}
          onClick={(event) => handleClick(event, { key: 2, value: 100 })}
          isSelectedCard={selectedCard.key === 2}
          isCenterCard
        />{" "}
        <small>Pile 2 (DOWN)</small>
      </div>
      <div>
        <small>Pile 3 (UP)</small>{" "}
        <Card
          key={3}
          value={piles[2] ?? ''}
          onClick={(event) => handleClick(event, { key: 3, value: 1 })}
          isSelectedCard={selectedCard.key === 3}
          isCenterCard
        />
        <Card
          key={4}
          value={piles[3] ?? ''}
          onClick={(event) => handleClick(event, { key: 4, value: 100 })}
          isSelectedCard={selectedCard.key === 4}
          isCenterCard
        />{" "}
        <small>Pile 4 (DOWN)</small>
      </div>
    </>
  );
}

export default CenterBoard;

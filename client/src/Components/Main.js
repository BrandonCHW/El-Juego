import React, { useState, useEffect, useRef } from "react";
import "./Main.css";
import PlayerHand from "./PlayerHand";
import CenterBoard from "./CenterBoard";
import Button from "react-bootstrap/button";
import io from "socket.io-client";
import DevTools from "./DevTools";
import PlayerAction from "../common/player-action";
import GameState from "../common/game-state";
import { Col, Container, Row } from "react-bootstrap";

function Main(props) {
  // 1 state per values that tend to change together
  const [selectedPileId, setSelectedPileId] = useState();
  const [gameState, setGameState] = useState(new GameState());

  const [connect, setConnect] = useState(true);
  const [socket, setSocket] = useState(null);
  const uid = useRef(0);

  useEffect(() => {
    if (connect) {
      const newSocket = io(`http://${window.location.hostname}:4000`);
      console.log(
        `player 1 connected to: http://${window.location.hostname}:4000`
      );
      // events
      newSocket.on("new-game-state", (gameState) => {
        console.log('RECEIVED NEW GAME STATE', gameState)
        console.log(uid.current)
        setGameState(gameState);
      });

      newSocket.on("get-uid", (playerUid) => {
        uid.current = playerUid;
      });

      setSocket(newSocket);

      return () => {
        newSocket.close(); // si la page rafraichit, va etablir une nouvelle connexion...
      };
    }
  }, [connect, setSocket]);

  // todo remove this
  useEffect(() => {
    console.log("NEW STATE: ", gameState)
  },[gameState])

  const connectToServer = () => {
    console.log("player 1", connect ? "disconnects" : "connects");
    setConnect(!connect);
  };

  const handlePlayCard = (playerSocket, uid, playedCardValue) => {
    if (!playerSocket) {
      console.log("Can't play card: you are not connected lol");
    } else {
      console.log(
        `player ${uid.current} played card ${playedCardValue} on pile ${selectedPileId}`
      );

      const action = new PlayerAction(
        uid.current,
        playedCardValue,
        selectedPileId
      );

      playerSocket.emit("player-action", action);
    }
  };

  const handleEndTurn = (playerSocket, uid) => {
    if (playerSocket) {
      playerSocket.emit('end-turn', uid)
    }
  }

  /******* DEV-TOOLS ONLY ********/
  const HandleManualNewGameState = (state) => {
    setGameState(state);
  };
  /*******************************/

  return (
    <Container fluid className="Main">
      <Row sm={2} className="Bordered-Row">
        <Col className="Bordered-Col">
          <DevTools
            OnNewGameState={(state) => HandleManualNewGameState(state)}>
          </DevTools>
        </Col>
      </Row>
      <Row sm={8} className="Bordered-Row">
        <Col className="Bordered-Col">
          <h2>El Juego</h2>
          <div>Pile Size: '{gameState.drawPile.length}'</div>
          <div>Current Player: '{gameState.turn}'</div>
          { gameState.cardsLeftToPlay === 0 ? 
          <div>'{gameState.turn}' can still play</div>
          : 
          <div>Need to play: '{gameState.cardsLeftToPlay}' cards</div>
          }
          <h3>{gameState.endResult}</h3>
          <CenterBoard
            piles={gameState?.piles ?? []}
            onSelectPile={(id) => {
              console.log("change pile to: ", id);
              setSelectedPileId(id);
            }}
          />
        </Col>
      </Row>
      <Row sm={2} className="Bordered-Row">
        <Col className="Bordered-Col">
            <PlayerHand
              name={"Player1 (" + uid.current + ")"}
              hand={gameState?.hands.find(h => h.uid === uid.current)?.cards ?? [0, 0, 0, 0, 0, 0]}
              onPlay={(value) => handlePlayCard(socket, uid, value)}
            />
            <Button onClick={() => connectToServer()}>P1 connect</Button>
            {connect ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="currentColor"
                className="bi bi-check"
                viewBox="0 0 16 16"
                color="lightgreen"
              >
                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="currentColor"
                className="bi bi-x"
                viewBox="0 0 16 16"
                color="red"
              >
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
              </svg>
            )}
            <Button onClick={() => handleEndTurn(socket, uid.current)} disabled={gameState.turn!==uid.current} variant='secondary' size='sm'>P1 End Turn</Button>
          </Col>
      </Row>
    </Container>
  );
}

export default Main;

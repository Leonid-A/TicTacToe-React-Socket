import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
import Square from "./Square.js";
import { appSocket, socketEvents } from "../constants";

function Board(props) {
  const gameData = props.location.game;
  const [squares, setSquares] = useState(gameData.squares);
  const [status, setStatus] = useState(null);
  const { playerType } = props.location;
  const [players, setPlayers] = useState({
    player1: gameData.player1,
    player2: gameData.player2,
  });
  const [gameStarted, SetGameStarted] = useState(false);

  useEffect(() => {
    appSocket.on(socketEvents.gameUpdated, (res) => {
      setPlayers({
        player1: res.player1,
        player2: res.player2,
      });
      setSquares(res.squares);
    });

    appSocket.on(socketEvents.userEntered, (res) => {
      setPlayers({
        player1: res.player1,
        player2: res.player2,
      });
    });

    appSocket.on(socketEvents.startGame, (res) => {
      if (res.status === "playing") {
        SetGameStarted(true);
      }
    });

    appSocket.on(socketEvents.clickedSquare, (res) => {
      if (res.winner) {
        setStatus(res.winner);
      }
      setSquares(res.squares);
    });

    return () => {
      appSocket.removeAllListeners(socketEvents.userEntered);
      appSocket.removeAllListeners(socketEvents.startGame);
      appSocket.removeAllListeners(socketEvents.gameUpdated);
      appSocket.removeAllListeners(socketEvents.clickedSquare);
      appSocket.emit(socketEvents.userExitedBoard, {
        id: gameData._id,
        userName: localStorage.getItem("userName"),
      });
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // const { size, id } = useParams();

  const renderSquare = (i) => {
    return (
      <Square key={i} value={squares[i].value} onClick={() => handleClick(i)} />
    );
  };

  const handleClick = async (i) => {
    if (squares[i].value || status || !gameStarted) {
      return;
    }

    const body = { id: gameData._id, i, type: playerType };
    makeSocketCall(body);
  };

  const makeSocketCall = (data) => {
    appSocket.emit(socketEvents.clickedSquare, data, (res) => {
      if (res.winner) {
        setStatus(res.winner);
      }
      setSquares(res.squares);
    });
  };

  const startButtonClick = (data) => {
    if (!gameStarted) {
      data.target.classList.add("passive");
      const body = { id: gameData._id, type: playerType };
      appSocket.emit(socketEvents.startGame, body, (game) => {
        if (game.status === "playing") {
          SetGameStarted(true);
        }
      });
    }
  };
  const resetGame = () => {
    appSocket.emit(socketEvents.playAgain, gameData._id, (game) => {
      console.log(game);
    });
  };

  const style = {
    width: 50 * gameData.size + "px",
    height: 50 * gameData.size + "px",
  };

  return (
    <>
      <div>
        <p>Player1+: {players.player1 ? players.player1.userName : null}</p>
        <p>Player2+: {players.player2 ? players.player2.userName : null}</p>
      </div>
      <div style={style} className="game-block">
        {squares.map((item, index) => renderSquare(index))}
      </div>
      <div className="buttonsBlock">
        <p id="info">{status ? `${status} is Win` : status}</p>

        {status ? (
          <button className="button" onClick={resetGame}>
            RESET GAME
          </button>
        ) : players.player1 && players.player2 ? (
          <button id="startButton" onClick={startButtonClick}>
            START
          </button>
        ) : null}
      </div>
    </>
  );
}

export default Board;
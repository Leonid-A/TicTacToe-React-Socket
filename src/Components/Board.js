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
  const [buttonStyle, setButtonStyle] = useState("");
  // const { size, id } = useParams();

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

    appSocket.on(socketEvents.playAgain, (res) => {
      if (res.status === "playing") {
        setSquares(res.squares);
        setStatus(null);
      }
    });

    appSocket.on(socketEvents.clickedSquare, (res) => {
      if (res.winner) {
        setStatus(res.winner);
        setButtonStyle("");
      }
      setSquares(res.squares);
    });

    return () => {
      appSocket.removeAllListeners(socketEvents.userEntered);
      appSocket.removeAllListeners(socketEvents.startGame);
      appSocket.removeAllListeners(socketEvents.playAgain);
      appSocket.removeAllListeners(socketEvents.gameUpdated);
      appSocket.removeAllListeners(socketEvents.clickedSquare);
      appSocket.emit(socketEvents.userExitedBoard, {
        id: gameData._id,
        userName: localStorage.getItem("userName"),
      });
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
        setButtonStyle("");
      }
      setSquares(res.squares);
    });
  };

  const startButtonClick = (data) => {
    if (!gameStarted) {
      setButtonStyle("passive");
      const body = { id: gameData._id, type: playerType };
      appSocket.emit(socketEvents.startGame, body, (game) => {
        if (game.status === "playing") {
          SetGameStarted(true);
        }
      });
    }
  };

  const playAgain = (data) => {
    const body = { id: gameData._id, type: playerType };
    setButtonStyle("passive");
    appSocket.emit(socketEvents.playAgain, body, (game) => {
      if (game.status === "playing") {
        setSquares(game.squares);
        setStatus(null);
      }
    });
  };

  const style = {
    width: 50 * gameData.size + "px",
    height: 50 * gameData.size + "px",
  };

  let btn = null;
  if (status) {
    btn = (
      <button id="playAgain" className={buttonStyle} onClick={playAgain}>
        Play Again
      </button>
    );
  } else if (players.player1 && players.player2) {
    btn = (
      <button
        id="startButton"
        className={buttonStyle}
        onClick={startButtonClick}
      >
        START
      </button>
    );
  }

  return (
    <>
      <div>
        <p>Player1: {players.player1 ? players.player1.userName : null}</p>
        <p>Player2: {players.player2 ? players.player2.userName : null}</p>
      </div>
      <div style={style} className="game-block">
        {squares.map((item, index) => renderSquare(index))}
      </div>
      <div className="buttonsBlock">
        <p id="info">{status ? `${status} is Win` : status}</p>
        {btn}
      </div>
    </>
  );
}

export default Board;
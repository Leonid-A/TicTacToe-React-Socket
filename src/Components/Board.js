import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import checkWinner from "../helpers/checkWinner";
import Square from "./Square.js";
// import Button from "./Button/Button";

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

    appSocket.on(socketEvents.clickedSquare, (res) => {
      if (res.winner) {
        setStatus(res.winner);
      }
      setSquares(res.squares);
    });

    return () => {
      appSocket.removeAllListeners(socketEvents.userEntered);
      appSocket.removeAllListeners(socketEvents.gameUpdated);
      appSocket.removeAllListeners(socketEvents.clickedSquare);
      appSocket.emit(socketEvents.userExitedBoard, {
        id: gameData._id,
        userName: localStorage.getItem("userName"),
      });
    };
  }, []);

  const { size, id } = useParams();

  const renderSquare = (i) => {
    return (
      <Square key={i} value={squares[i].value} onClick={() => handleClick(i)} />
    );
  };

  const handleClick = async (i) => {
    if (squares[i].value || status) {
      return;
    }

    // squares[i].value = status.xIsNext ? "X" : "O";
    // const winner = checkWinner(i, squares, props.value);
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

  // const resetGame = () => {
  //   setSquares(fillInfo());
  //   setStatus({
  //     status: null,
  //     xIsNext: true,
  //   });
  // };

  // useEffect(() => {
  //   resetGame();
  // }, [size]); // eslint-disable-line react-hooks/exhaustive-deps

  const style = {
    width: 50 * size + "px",
    height: 50 * size + "px",
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
      <div className="center">
        {/* <Button class="green" clicked={resetGame} text="RESET" /> */}
        <p id="info">{status ? `${status} is Win` : status}</p>
      </div>
    </>
  );
}

export default Board;

import { useEffect, useState } from "react";
import Room from "./Room.js";
import Home from "./Home.js";
import { appSocket, socketEvents } from "../constants.js";
import { useHistory } from "react-router-dom";
import classes from "./Styles/HomeBlock.module.css";

function HomeBlock() {
  const [filteredSize, setFilteredSize] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState(null);
  const history = useHistory();

  const handleHomeClick = (props) => {
    setFilteredSize(props.target.id);
  };

  const roomsRender = (data) => {
    const length = data.length;
    let rooms = [];
    for (let i = 0; i < length; i++) {
      rooms.push(
        <Room
          key={data[i]._id}
          id={data[i]._id}
          size={data[i].size}
          player2={data[i].player2}
          status={data[i].status}
          player1={data[i].player1}
          click={() => handleRoomClick(data[i])}
        />
      );
    }
    return rooms;
  };

  const renderCreatedRoom = (data) => {
    setRooms([renderOneRoom(data), ...rooms]);
  };

  const renderOneRoom = (data) => {
    return (
      <Room
        key={data._id}
        id={data._id}
        size={data.size}
        status={data.status}
        player2={data.player2}
        player1={data.player1}
        click={() => handleRoomClick(data)}
      />
    );
  };

  const handleRoomClick = (props) => {
    const roomData = {
      player: localStorage.getItem("userName"),
      id: props._id,
    };
    appSocket.emit(socketEvents.openRoom, roomData, (game, type) => {
      history.push({
        pathname: `/room/${game.size}/${game._id}`,
        game,
        playerType: type,
      });
    });
  };

  useEffect(() => {
    appSocket.emit(socketEvents.getAllRooms, null, (response) => {
      setRooms(roomsRender(response));
    });

    return () => {};
  }, []);

  useEffect(() => {
    if (!rooms.length && !filteredSize) {
      return;
    }

    const filtRooms = rooms.filter((item) => item.props.size === filteredSize);
    setFilteredRooms(filtRooms);
  }, [rooms, filteredSize]);

  useEffect(() => {
    removeListeners();
    appSocket.on(socketEvents.roomIsMade, (response) => {
      renderCreatedRoom(response);
    });

    appSocket.on(socketEvents.gameDeleted, (id) => {
      const filtRooms = rooms.filter((item) => item.props.id !== id);
      setRooms(filtRooms);
    });

    appSocket.on(socketEvents.gameUpdated, (resp) => {
      const updatedRooms = rooms.map((item) => {
        if (item.props.id === resp._id) {
          item = renderOneRoom(resp);
        }
        return item;
      });
      setRooms(updatedRooms);
    });

    return () => removeListeners();
  }, [rooms]);

  const removeListeners = () => {
    appSocket.removeAllListeners(socketEvents.roomIsMade);
    appSocket.removeAllListeners(socketEvents.gameDeleted);
    appSocket.removeAllListeners(socketEvents.gameUpdated);
  };

  const handleCreateRoom = () => {
    const roomData = {
      userName: localStorage.getItem("userName"),
      size: filteredSize,
    };

    //send socket to create and redirect
    appSocket.emit(socketEvents.createRoom, roomData, (response) => {
      renderCreatedRoom(response);
      history.push({
        pathname: `/room/${response.size}/${response._id}`,
        game: response,
        playerType: response.player1.type,
      });
    });
  };

  return (
    <>
      <div className={classes.houseBlock}>
        <Home id="3" click={handleHomeClick} />
        <Home id="5" click={handleHomeClick} />
      </div>
      <h1>
        TicTacToe Rooms{" "}
        {filteredSize ? `${filteredSize}x${filteredSize}` : null}{" "}
        {filteredSize ? (
          <button onClick={handleCreateRoom}>Create new game</button>
        ) : null}
      </h1>
      <div className={classes.houseBlock}>
        {filteredSize ? filteredRooms : rooms}
      </div>
    </>
  );
}

export default HomeBlock;

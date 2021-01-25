const {
  dbClient,
  dbName,
  mongodb,
  gameStatus,
  playerTypes,
  socketEvents,
} = require("../constants");

function openRoom(io, socket, data, callBack) {
  dbClient.connect(async (err, client) => {
    const db = client.db(dbName);
    const roomsCol = db.collection("rooms");
    const findID = { _id: new mongodb.ObjectId(data.id) };
    const gameData = await roomsCol.findOne(findID);

    if (gameData.status == gameStatus.waiting) {
      const updatedObj = {};
      let userType = "";

      if (!gameData.player1) {
        userType = playerTypes.X;
        updatedObj.player1 = { userName: data.player, type: userType };
        gameData.player1 = { userName: data.player, type: userType };
      } else {
        userType = playerTypes.O;
        updatedObj.player2 = { userName: data.player, type: userType };
        gameData.player2 = { userName: data.player, type: userType };
      }

      updatedObj.status = gameStatus.playing;
      gameData.status = gameStatus.playing;

      try {
        await roomsCol.updateOne(findID, {
          $set: updatedObj,
        });

        socket.broadcast.emit(socketEvents.gameUpdated, gameData);

        socket.join(data.id);
        socket.to(data.id).emit(socketEvents.userEntered, gameData);

        callBack(gameData, userType);
      } catch (error) {
        console.log("something went wrong");
      }
    }
  });
}

module.exports = openRoom;

const { dbClient, dbName, mongodb, gameStatus, socketEvents } = require("../constants");

function userExitedBoard(socket, data) {
  dbClient.connect(async (err, client) => {
    const db = client.db(dbName);
    const roomsCol = db.collection("rooms");
    const findID = { _id: new mongodb.ObjectId(data.id) };
    const gameData = await roomsCol.findOne(findID);

    if (gameData.player1 && gameData.player2) {
      const updatedObj = {};
      if (gameData.player1.userName == data.userName) {
        updatedObj.player1 = null;
        gameData.player1 = null;
      } else {
        updatedObj.player2 = null;
        gameData.player2 = null;

      }
      updatedObj.status = gameStatus.waiting;
      gameData.status = gameStatus.waiting;

      roomsCol.updateOne(findID, {
        $set: updatedObj,
      }).then(() => {
        socket.broadcast.emit(socketEvents.gameUpdated, gameData);
      })
    } else {
      roomsCol.deleteOne(findID);
      socket.broadcast.emit(socketEvents.gameDeleted, data.id);
    }
  });
}

module.exports = userExitedBoard;

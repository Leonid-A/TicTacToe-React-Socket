const {
  dbClient,
  dbName,
  mongodb,
  gameStatus,
  socketEvents,
} = require("../constants");

function startGame(socket, data, callBack) {
  dbClient.connect(async (err, client) => {
    const db = client.db(dbName);
    const roomsCol = db.collection("rooms");
    const findID = { _id: new mongodb.ObjectId(data.id) };
    const gameData = await roomsCol.findOne(findID);
    if (gameData.player1 && gameData.player2) {
      const updatedObj = {};
      if (gameData.player1.type === data.type && !gameData.player1.startGame) {
        gameData.player1.startGame = true;
        updatedObj.player1 = {
          userName: gameData.player1.userName,
          type: gameData.player1.type,
          startGame: gameData.player1.startGame,
        };
        gameData;
      } else if (gameData.player2.type === data.type && !gameData.player2.startGame) {
        gameData.player2.startGame = true;
        updatedObj.player2 = {
          userName: gameData.player2.userName,
          type: gameData.player2.type,
          startGame: gameData.player2.startGame,
        };
      } else {
        return;
      }
      if (gameData.player1.startGame && gameData.player2.startGame) {
        updatedObj.status = gameStatus.playing;
        gameData.status = gameStatus.playing;
        socket.broadcast.emit(socketEvents.gameUpdated, gameData);
      }
      try {
        await roomsCol.updateOne(findID, {
          $set: updatedObj,
        });
        socket.to(data.id).emit(socketEvents.startGame, gameData);
        callBack(gameData);
      } catch (error) {
        console.log("something went wrong");
      }
    }
  });
}

module.exports = startGame;

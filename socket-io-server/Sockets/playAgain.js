const {
  dbClient,
  dbName,
  mongodb,
  gameStatus,
  socketEvents,
} = require("../constants");
const createBoard = require("../routes/helpers/squares");

function playAgain(socket, data, callBack) {
  dbClient.connect(async (err, client) => {
    const db = client.db(dbName);
    const roomsCol = db.collection("rooms");
    const findID = { _id: new mongodb.ObjectId(data.id) };
    const gameData = await roomsCol.findOne(findID);
    let updatedObj = {};
    if (gameData.player1.type === data.type && !gameData.player1.playAgain) {
      gameData.player1.playAgain = true;
      updatedObj.player1 = {
        userName: gameData.player1.userName,
        type: gameData.player1.type,
        startGame: gameData.player1.startGame,
        playAgain: gameData.player1.playAgain,
      };
      gameData;
    } else if (
      gameData.player2.type === data.type &&
      !gameData.player2.playAgain
    ) {
      gameData.player2.playAgain = true;
      updatedObj.player2 = {
        userName: gameData.player2.userName,
        type: gameData.player2.type,
        startGame: gameData.player2.startGame,
        playAgain: gameData.player2.playAgain,
      };
    } else {
      return;
    }
    if (gameData.player1.playAgain && gameData.player2.playAgain) {
      gameData.status = gameStatus.playing;
      gameData.xIsNext = true;
      gameData.squares = createBoard(gameData.size);
      updatedObj = gameData;
      updatedObj.player1.playAgain = false;
      updatedObj.player2.playAgain = false;
      socket.broadcast.emit(socketEvents.gameUpdated, gameData);
    }
    try {
      socket.to(data.id).emit(socketEvents.playAgain, gameData);
      callBack(gameData);
      await roomsCol.updateOne(findID, {
        $set: updatedObj,
      });
    } catch (error) {
      console.log("something went wrong");
      console.log(error);
    }
  });
}

module.exports = playAgain;

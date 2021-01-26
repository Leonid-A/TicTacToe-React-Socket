const {
    dbClient,
    dbName,
    mongodb,
    gameStatus,
    socketEvents,
  } = require("../constants");
  const createBoard = require("../routes/helpers/squares");
  
  function playAgain(socket, data) {
    dbClient.connect(async (err, client) => {
      const db = client.db(dbName);
      const roomsCol = db.collection("rooms");
      const findID = { _id: new mongodb.ObjectId(data.id) };
      const gameData = await roomsCol.findOne(findID);
  
    //   if (gameData.player1 && gameData.player2) {
    //     const updatedObj = {};
    //     if (gameData.player1.userName == data.userName) {
    //       updatedObj.player1 = null;
    //       gameData.player1 = null;
    //     } else {
    //       updatedObj.player2 = null;
    //       gameData.player2 = null;
    //     }
    //     const squares = createBoard(gameData.size);
    //     gameData.xIsNext = true;
    //     updatedObj.xIsNext = true;
    //     updatedObj.status = gameStatus.waiting;
    //     updatedObj.squares = squares;
    //     gameData.status = gameStatus.waiting;
    //     gameData.squares = squares;
  
    //     roomsCol
    //       .updateOne(findID, {
    //         $set: updatedObj,
    //       })
    //       .then(() => {
    //         socket.broadcast.emit(socketEvents.gameUpdated, gameData);
    //       });
    //   } else {
    //     roomsCol.deleteOne(findID);
    //     socket.broadcast.emit(socketEvents.gameDeleted, data.id);
    //   }
    });
  }
  
  module.exports = playAgain;
  
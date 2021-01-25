const {
  dbClient,
  dbName,
  mongodb,
  gameStatus,
  socketEvents,
  playerTypes,
} = require("../constants");
const { checkWinner } = require("../routes/helpers/checkWinner");

function clickedSquare(socket, data, callBack) {
  dbClient.connect(async (err, client) => {
    const db = client.db(dbName);
    const roomsCol = db.collection("rooms");
    const findID = { _id: new mongodb.ObjectId(data.id) };
    const gameData = await roomsCol.findOne(findID);

    let { value } = gameData.squares[data.i];
    if (!value && gameData.status === gameStatus.playing) {
      if (gameData.xIsNext && data.type === playerTypes.X) {
        value = playerTypes.X;
      } else if (!gameData.xIsNext && data.type === playerTypes.O) {
        value = playerTypes.O;
      } else {
        return;
      }

      gameData.squares[data.i].value = value;
      gameData.xIsNext = !gameData.xIsNext;
      gameData.winner = checkWinner(data.i, gameData.squares, gameData.size);

      if (gameData.winner) {
        gameData.status = gameStatus.over;
        socket.broadcast.emit(socketEvents.gameUpdated, gameData);
      }

      await roomsCol.updateOne(findID, {
        $set: {
          squares: gameData.squares,
          xIsNext: gameData.xIsNext,
          status: gameData.status,
        },
      });

      socket.join(data.id);
      socket.to(data.id).emit(socketEvents.clickedSquare, gameData);
      callBack(gameData);
    }
  });
}

module.exports = clickedSquare;

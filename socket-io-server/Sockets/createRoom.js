const {
  dbClient,
  dbName,
  socketEvents,
  gameStatus,
  playerTypes,
} = require("../constants");
const createBoard = require("../routes/helpers/squares");

function createRoom(socket, data, callBack) {
  dbClient.connect((err, client) => {
    const db = client.db(dbName);
    db.collection("rooms").insertOne(
      {
        player1: { userName: data.userName, type: playerTypes.X },
        size: data.size,
        squares: createBoard(data.size),
        player2: null,
        xIsNext: true,
        status: gameStatus.waiting,
      },
      (err, result) => {
        socket.join(result.insertedId);
        console.log("12345678-create", result.insertedId);
        const response = result.ops[0];
        socket.broadcast.emit(socketEvents.roomIsMade, response);
        callBack(response);
      }
    );
  });
}

module.exports = createRoom;

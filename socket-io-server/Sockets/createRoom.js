const {
  dbClient,
  dbName,
  socketEvents,
  gameStatus,
  playerTypes,
} = require("../constants");
const createBoard = require("../routes/helpers/squares");

function createRoom(io, socket, data, callBack) {
  dbClient.connect((err, client) => {
    const db = client.db(dbName);

    try {
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
          const response = result.ops[0];
          socket.broadcast.emit(socketEvents.roomIsMade, response);
          callBack(response);
          socket.join(`${result.insertedId}`);
        }
      );
    } catch (error) {
      console.log("SOMETHING WEND WRONG");
      console.log(error);
    }
  });
}

module.exports = createRoom;

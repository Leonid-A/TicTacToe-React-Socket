const mongodb = require("mongodb");
const { MongoClient } = mongodb;

const socketEvents = {
  connected: "connected",
  clickedSquare: "clickedSquare",
  createRoom: "createRoom",
  roomIsMade: "roomIsMade",
  getAllRooms: "getAllRooms",
  userExitedBoard: "userExitedBoard",
  gameDeleted: "gameDeleted",
  openRoom: "openRoom",
  gameUpdated: "gameUpdated",
  userEntered: "userEntered",
  startGame: "startGame",
  playAgain: "playAgain",
};

const gameStatus = {
  waiting: "waiting",
  playing: "playing",
  over: "over",
};

const playerTypes = { X: "X", O: "O" };
const mondoDBUser = "tic-tac-toe";
const dbName = "tic-tac-toe-db";
const mondoDBUserPassword = "MewrapRWjGq3wno5";
const MongoUrl = `mongodb+srv://${mondoDBUser}:${mondoDBUserPassword}@cluster0.sx5wp.mongodb.net/${dbName}?retryWrites=true&w=majority`;
const dbClient = new MongoClient(MongoUrl);

module.exports.dbClient = dbClient;
module.exports.dbName = dbName;
module.exports.socketEvents = socketEvents;
module.exports.gameStatus = gameStatus;
module.exports.MongoUrl = MongoUrl;
module.exports.mongodb = mongodb;
module.exports.playerTypes = playerTypes;

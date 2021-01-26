const express = require("express");
const http = require("http");


const socketIo = require("socket.io");
const { socketEvents, gameStatus } = require("./constants");
const { checkWinner } = require("./routes/helpers/checkWinner");
const createBoard = require("./routes/helpers/squares");

const port = process.env.PORT || 3001;
const index = require("./routes/index");
const clickedSquare = require("./Sockets/clickedSquare");
const createRoom = require("./Sockets/CreateRoom");
const getAllRooms = require("./Sockets/getAllRooms");
const startGame = require("./Sockets/startGame");
const openRoom = require("./Sockets/openRoom");
const userExitedBoard = require("./Sockets/userExitedBoard");
const playAgain = require("./Sockets/playAgain");

const app = express();
app.use(index);

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    // methods: ["GET", "POST"],
    // allowedHeaders: ["my-custom-header"],
    // credentials: true
  },
});

io.on("connection", (socket) => {
  console.log("connected");

  socket.on(socketEvents.userExitedBoard, (data) => userExitedBoard(socket, data));
  socket.on(socketEvents.playAgain, (data) => playAgain(socket, data));
  socket.on(socketEvents.createRoom, (data, callBack) => createRoom(socket, data, callBack));
  socket.on(socketEvents.openRoom, (data, callBack) => openRoom(socket, data, callBack));
  socket.on(socketEvents.startGame, (data, callBack) => startGame(socket, data, callBack));
  socket.on(socketEvents.clickedSquare, (data, callBack) => clickedSquare(socket, data, callBack));
  socket.on(socketEvents.getAllRooms, (data, callBack) => getAllRooms(callBack));

  getApiAndEmit(socket);

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const getApiAndEmit = (socket) => {
  socket.emit(socketEvents.connected, { status: 200 });
};

server.listen(port, () => console.log(`Listening on port ${port}`));

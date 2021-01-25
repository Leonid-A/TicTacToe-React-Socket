import socketIOClient from "socket.io-client";

export const ENDPOINT = "ws://localhost:3001";

export const appSocket = socketIOClient(ENDPOINT);

export const socketEvents = {
    connected: "connected",
    clickedSquare: "clickedSquare",
    createRoom: "createRoom",
    roomIsMade: "roomIsMade",
    getAllRooms: "getAllRooms",
    userExitedBoard: "userExitedBoard",
    openRoom: "openRoom",
    gameDeleted: "gameDeleted",
    gameUpdated: "gameUpdated",
    userEntered: "userEntered",
}

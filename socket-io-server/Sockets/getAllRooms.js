const { dbClient, dbName } = require("../constants");

function getAllRooms(callBack) {
  dbClient.connect(async (err, client) => {
    const db = client.db(dbName);
    await db
      .collection("rooms")
      .find({})
      .toArray((err, result) => {
        callBack(result);
      });
  });
}

module.exports = getAllRooms;

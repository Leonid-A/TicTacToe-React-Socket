const { dbClient, dbName } = require("../constants");

function getAllRooms(callBack) {
  dbClient.connect((err, client) => {
    setTimeout(async () => {
      const db = client.db(dbName);
      await db
        .collection("rooms")
        .find({})
        .toArray((err, result) => {
          callBack(result);
        });
    }, 1000);
  });
}

module.exports = getAllRooms;

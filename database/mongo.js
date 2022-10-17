const mongoose = require("mongoose");

let database = null;

async function startDatabase() {
  const connection = await mongoose.connect(
    "mongodb://localhost:27017/chatDatabase"
  ).catch(error => console.error(error));
  database = mongoose.connection;
}

async function getDatabase() {
  if (!database) await startDatabase();
  return database;
}

module.exports = {
  getDatabase,
  startDatabase,
};

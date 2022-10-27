const { MongoMemoryServer } = require("mongodb-memory-server");
const MongoClient = require("mongodb").MongoClient;

let database = null;

async function startDatabase() {
  const mongo = new MongoMemoryServer();
  
  connection = await MongoClient.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
  });
  
}

async function getDatabase() {
  if (!database) await startDatabase();
  return database;
}

module.exports = {
  getDatabase,
  startDatabase,
};

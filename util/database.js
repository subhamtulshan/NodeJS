const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  mongoClient
    .connect(
      "mongodb+srv://Subham:subham@123@cluster0-bwsd5.mongodb.net/shop?retryWrites=true&w=majority",
      { useUnifiedTopology: true }
    )
    .then((client) => {
      console.log("conneted");
      _db = client.db();
      callback();
    })
    .catch((err) => {
      console.log(err);
    });
};

const getDb = () => {
  if (_db) return _db;

  throw "no Database found";
};
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
//###########SQL#############s
// const mysql = require("mysql2");

// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   database: "node_complete",
//   password: "Developer@000",
// });

// module.exports = pool.promise();

// const { Sequelize } = require("sequelize");

// const sequelize = new Sequelize("node_complete", "root", "Developer@000", {
//   dialect: "mysql",
//   host: "localhost",
// });

// module.exports = sequelize;

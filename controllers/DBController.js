const DBModel = require("../models/DBModel");

class DBController {
  async initializeDatabase() {
    await DBModel.connect();
    console.log("Database connected successfully");
  }

  async closeDatabase() {
    await DBModel.disconnect();
    console.log("Database disconnected successfully");
  }
}

module.exports = new DBController();

const DBModel = require("../models/DBModel");

class DBController {
  async initializeDatabase() {
    try {
      await DBModel.connect();
      console.log("Database connected successfully");
    } catch (err) {
      console.error("Database connection failed:", err);
      throw err;
    }
  }

  async closeDatabase() {
    try {
      await DBModel.disconnect();
      console.log("Database disconnected successfully");
    } catch (err) {
      console.error("Failed to disconnect database:", err);
      throw err;
    }
  }
}

module.exports = new DBController();
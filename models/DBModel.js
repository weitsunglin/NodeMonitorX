const sql = require("mssql");

class DBModel {
  constructor() {
    this.config = {
      user: "sa",
      password: "YourStrong@Passw0rd",
      server: "localhost",
      port: 1433,
      database: "MyDatabase",
      options: {
        encrypt: false,                  // 使用非加密連接
        enableArithAbort: true,
        trustServerCertificate: true     // 忽略自簽名證書驗證
      }
    };
    this.connection = null;
  }

  async connect() {
    if (!this.connection) {
      try {
        this.connection = await sql.connect(this.config);
        console.log("Connected to the SQL Server database.");
      } catch (err) {
        console.error("Database connection failed:", err);
        throw err;
      }
    }
    return this.connection;
  }

  async disconnect() {
    if (this.connection) {
      try {
        await sql.close();
        this.connection = null;
        console.log("Disconnected from the SQL Server database.");
      } catch (err) {
        console.error("Failed to disconnect:", err);
      }
    }
  }
}

module.exports = new DBModel();
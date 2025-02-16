const sql = require("mssql");

class DBModel {
  constructor() {
    this.config = {
      user: "sa",
      password: "YourStrong@Passw0rd",
      server: "docker-sqlserver-1",
      port: 1433,
      database: "MyDatabase",
      options: {
        encrypt: false,
        enableArithAbort: true,
        trustServerCertificate: true
      }
    };
    this.connection = null;
  }

  async connect() {
    if (!this.connection || !this.connection.connected) {
      try {
        this.connection = await sql.connect(this.config);
        console.log("✅ Connected to SQL Server.");
      } catch (err) {
        console.error("❌ Database connection failed:", err);
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
        console.log("✅ Disconnected from SQL Server.");
      } catch (err) {
        console.error("❌ Failed to disconnect:", err);
      }
    }
  }

  async query(queryString, params = {}) {
    const pool = await this.connect();
    try {
      const request = pool.request();
      Object.entries(params).forEach(([key, value]) => {
        request.input(key, value);
      });
      return await request.query(queryString);
    } catch (err) {
      console.error("❌ Query failed:", err);
      throw err;
    } finally {
      pool.close(); // 確保釋放連線
    }
  }
}

module.exports = new DBModel();

class MainModel {
    constructor() {
      this.systemInfo = { name: "MyApp System", version: "1.0.0", status: "Running" };
    }
  
    getSystemInfo() {
      this.systemInfo.uptime = this.getUptime();
      return this.systemInfo;
    }
  
    getUptime() {
      const secs = process.uptime();
      return `${Math.floor(secs / 3600)}h ${Math.floor((secs % 3600) / 60)}m ${Math.floor(secs % 60)}s`;
    }
  }
  
  module.exports = MainModel;
  
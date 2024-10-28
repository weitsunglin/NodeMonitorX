class systemInfoModel {
    constructor() {
      this.systemInfo = { name: "MyApp System", version: "1.0.0", status: "Running" };
    }
  
    getSystemInfo() {
        const secs = process.uptime();
        this.systemInfo.uptime = `${Math.floor(secs / 3600)}h ${Math.floor((secs % 3600) / 60)}m ${Math.floor(secs % 60)}s`;
        return this.systemInfo;
    }
    
  }
  
  module.exports = systemInfoModel;
  
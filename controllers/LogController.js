const fs = require("fs");
const path = require("path");
const os = require("os");

class LogController {
  constructor() {
    this.logFilePath = path.join(__dirname, "../logs/system_usage.txt");
    this.lastCpuUsage = process.cpuUsage();
    this.lastTime = Date.now();

    if (!fs.existsSync(path.dirname(this.logFilePath))) {
      fs.mkdirSync(path.dirname(this.logFilePath));
    }

    setInterval(() => this.logSystemUsage(), 1000);
  }

  calculateInstantCpuUsage() {
    const currentCpuUsage = process.cpuUsage();
    const currentTime = Date.now();
    const elapsedUser = currentCpuUsage.user - this.lastCpuUsage.user;
    const elapsedSystem = currentCpuUsage.system - this.lastCpuUsage.system;
    const elapsedTime = currentTime - this.lastTime;

    this.lastCpuUsage = currentCpuUsage;
    this.lastTime = currentTime;

    const cpuPercent = ((elapsedUser + elapsedSystem) / 1000 / elapsedTime / os.cpus().length).toFixed(2);
    const userCpuPercent = ((elapsedUser / 1000) / elapsedTime / os.cpus().length).toFixed(2);
    const systemCpuPercent = ((elapsedSystem / 1000) / elapsedTime / os.cpus().length).toFixed(2);

    return { cpuPercent, userCpuPercent, systemCpuPercent };
  }

  logSystemUsage() {
    const { cpuPercent, userCpuPercent, systemCpuPercent } = this.calculateInstantCpuUsage();
    const formattedTime = new Date().toLocaleTimeString("zh-TW", { hour12: false });
    const currentLoadAvg = os.loadavg()[0].toFixed(2);

    const memoryUsage = process.memoryUsage();
    const memoryDetails = {
      rss: (memoryUsage.rss / 1024 / 1024).toFixed(2),
      heapTotal: (memoryUsage.heapTotal / 1024 / 1024).toFixed(2),
      heapUsed: (memoryUsage.heapUsed / 1024 / 1024).toFixed(2),
      external: (memoryUsage.external / 1024 / 1024).toFixed(2),
    };

    const logEntry = `${formattedTime} - CPU Usage: ${cpuPercent}% (User: ${userCpuPercent}%, System: ${systemCpuPercent}%)\n` +
                     `Load Average: ${currentLoadAvg}\n` +
                     `Memory Usage: RSS ${memoryDetails.rss} MB, Heap Total ${memoryDetails.heapTotal} MB, Heap Used ${memoryDetails.heapUsed} MB, External ${memoryDetails.external} MB\n\n`;

    fs.appendFile(this.logFilePath, logEntry, (err) => {
      if (err) console.error("無法寫入系統日誌:", err);
    });
  }
}

module.exports = LogController;

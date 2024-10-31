const fs = require("fs");
const path = require("path");
const os = require("os");

class LogController {
  constructor() {
    this.logFilePath = path.join(__dirname, "../logs", "system_usage.txt");
    this.lastCpuUsage = process.cpuUsage();
    this.lastTime = Date.now();

    // 確保 logs 資料夾存在
    if (!fs.existsSync(path.dirname(this.logFilePath))) {
      fs.mkdirSync(path.dirname(this.logFilePath));
    }

    // 每 1 秒紀錄
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

  // 紀錄系統的 CPU、負載平均值和記憶體使用情況
  logSystemUsage() {
    const now = new Date();
    const formattedTime = `${now.getHours()}時${now.getMinutes()}分${now.getSeconds()}秒`;

    // 獲取應用程式的 CPU 使用率
    const { cpuPercent, userCpuPercent, systemCpuPercent } = this.calculateInstantCpuUsage();

    // 獲取當前負載平均值 (1 分鐘的負載)
    const currentLoadAvg = os.loadavg()[0].toFixed(2);

    // 獲取記憶體使用的各個細項
    const memoryUsage = process.memoryUsage();
    const memoryDetails = {
      rss: (memoryUsage.rss / 1024 / 1024).toFixed(2),         // 常駐集大小
      heapTotal: (memoryUsage.heapTotal / 1024 / 1024).toFixed(2), // 堆總內存
      heapUsed: (memoryUsage.heapUsed / 1024 / 1024).toFixed(2),   // 已使用的堆內存
      external: (memoryUsage.external / 1024 / 1024).toFixed(2)    // 外部依賴記憶體
    };

    // 構建日誌條目
    const logEntry = `${formattedTime} - CPU Usage: ${cpuPercent}% (User: ${userCpuPercent}%, System: ${systemCpuPercent}%)\n` +
                     `Current Load Average: ${currentLoadAvg}\n` +
                     `Memory Usage: RSS ${memoryDetails.rss} MB, App Heap Total ${memoryDetails.heapTotal} MB, App Heap Used ${memoryDetails.heapUsed} MB, App外部依賴 ${memoryDetails.external} MB\n\n`;

    fs.appendFile(this.logFilePath, logEntry, (err) => {
      if (err) {
        console.error("無法寫入系統日誌:", err);
      }
    });
  }
}

module.exports = LogController;

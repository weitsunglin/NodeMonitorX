const fs = require("fs");
const path = require("path");

const ServiceStatus = Object.freeze({
  RUNNING: "Running",
  MAINTENANCE: "Maintenance"
});

class SystemInfoController {
  constructor() {
    this.systemInfo = { name: "Services", version: "1.0.0", status: ServiceStatus.MAINTENANCE };
  }

  getSystemInfo(req, res) {
    // 計算系統運行時間
    const secs = process.uptime();
    this.systemInfo.uptime = `${Math.floor(secs / 3600)}h ${Math.floor((secs % 3600) / 60)}m ${Math.floor(secs % 60)}s`;
    
    // 回應給clinet端的view範本
    fs.readFile(path.join(__dirname, "../views/SystemInfoView.html"), "utf-8", (err, data) => {
      if (err) return res.writeHead(500).end("Error loading view");

      const renderedView = data.replace(
        /<div id="system-info">.*<\/div>/s,
        `<div id="system-info">${Object.entries(this.systemInfo).map(([key, val]) => `<p><strong>${key}:</strong> ${val}</p>`).join("")}</div>`
      );
      
      res.writeHead(200, { "Content-Type": "text/html" }).end(renderedView);
    });
  }
}

module.exports = SystemInfoController;
//依賴
const fs = require("fs");
const path = require("path");

//Model
const systemInfoModel = require("../models/systemInfoModel");

class systemInfoController {
  constructor() {
    this.systemInfoModel = new systemInfoModel();
  }

  getSystemInfo(req, res) {
    const systemInfo = this.systemInfoModel.getSystemInfo();
    fs.readFile(path.join(__dirname, "../views/SystemInfoView.html"), "utf-8", (err, data) => {
      if (err) return res.writeHead(500).end("Error loading view");
      const renderedView = data.replace(
        /<div id="system-info">.*<\/div>/s,
        `<div id="system-info">${Object.entries(systemInfo).map(([key, val]) => `<p><strong>${key}:</strong> ${val}</p>`).join("")}</div>`
      );
      res.writeHead(200, { "Content-Type": "text/html" }).end(renderedView);
    });
  }
}

module.exports = systemInfoController;
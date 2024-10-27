const fs = require("fs");
const path = require("path");
const MainModel = require("../models/MainModel");

class MainController {
  constructor() {
    this.mainModel = new MainModel();
  }

  getSystemInfo(req, res) {
    const systemInfo = this.mainModel.getSystemInfo();
    fs.readFile(path.join(__dirname, "../views/mainView.html"), "utf-8", (err, data) => {
      if (err) return res.writeHead(500).end("Error loading view");
      const renderedView = data.replace(
        /<div id="system-info">.*<\/div>/s,
        `<div id="system-info">${Object.entries(systemInfo).map(([key, val]) => `<p><strong>${key}:</strong> ${val}</p>`).join("")}</div>`
      );
      res.writeHead(200, { "Content-Type": "text/html" }).end(renderedView);
    });
  }
}

module.exports = MainController;

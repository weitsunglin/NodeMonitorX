// controllers/DownloadController.js
const fs = require("fs");
const path = require("path");

class DownloadController {
  constructor() {
    this.downloadFilePath = path.join("C:/Users/User/Desktop/work_space/node_js_server_app/download", "file.txt");
  }

  handleFileDownload(req, res) {
    fs.access(this.downloadFilePath, fs.constants.F_OK, (err) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain" }).end("File not found");
        return;
      }
      res.writeHead(200, {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": "attachment; filename=file.txt"
      });
      fs.createReadStream(this.downloadFilePath).pipe(res);
    });
  }
}

module.exports = DownloadController;
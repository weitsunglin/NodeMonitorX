// controllers/MonitorController.js

const http = require("http");
const { URL } = require("url");
const WebSocket = require("ws");

// 引入其他 Controllers
const SystemInfoController = require("./SystemInfoController");
const DownloadController = require("./DownloadController");
const LogController = require("./LogController");
const StressTestController = require("./StressTestController");

// Controller 初始化
const systemInfoController = new SystemInfoController();
const downloadController = new DownloadController();
const logController = new LogController();
const stressController = new StressTestController();

// 維護模式設定
let maintenanceMode = false; // 默認為非維護模式

class MonitorController {
  // 啟動 HTTP 伺服器
  createHttpServer() {
    const httpServer = http.createServer(this.handleHttpRequest.bind(this));
    httpServer.listen(3001, () => {
      console.log("HTTP server running on http://localhost:3001");
    });
  }

  // HTTP 請求處理
  handleHttpRequest(request, response) {
    const { pathname } = new URL(request.url, `http://${request.headers.host}`);

    // 維護模式檢查
    if (maintenanceMode && pathname !== "/system") {
      response.writeHead(503, { "Content-Type": "text/plain" }).end("Service is under maintenance. Please try again later.");
      return;
    }

    // 路由請求
    if (pathname === "/system" && request.method === "GET") {
      systemInfoController.getSystemInfo(request, response);
    } else if (pathname === "/download" && request.method === "GET") {
      downloadController.handleFileDownload(request, response);
    } else if (pathname === "/cpu-stress/start" && request.method === "GET") {
      stressController.startStressTest(request, response);
    } else if (pathname === "/cpu-stress/stop" && request.method === "GET") {
      stressController.stopStressTest(request, response);
    } else {
      console.log("Received unmatched request:", pathname);
      response.writeHead(404, { "Content-Type": "text/plain" }).end("Not Found");
    }
  }

  // 建立 WebSocket 伺服器
  createWebSocketServer() {
    const wsServer = new WebSocket.Server({ port: 3002 });
    wsServer.on("connection", this.handleWebSocketConnection.bind(this));
    console.log("WebSocket server running on ws://localhost:3002");
    return wsServer;
  }

  // WebSocket 連線處理
  handleWebSocketConnection(ws) {
    if (maintenanceMode) {
      ws.send("Service is under maintenance. WebSocket connection will be closed.");
      ws.close();
      return;
    }

    console.log("WebSocket client connected");

    ws.on("message", (message) => {
      console.log("Received message:", message.toString());
    });

    ws.on("close", () => {
      console.log("WebSocket client disconnected");
    });
  }

  // 啟動所有伺服器
  startServers() {
    this.createHttpServer();
    this.createWebSocketServer();
  }

  // 切換維護模式
  toggleMaintenanceMode() {
    maintenanceMode = !maintenanceMode;
    console.log(`Maintenance mode is now ${maintenanceMode ? "enabled" : "disabled"}.`);
  }
}

module.exports = MonitorController;
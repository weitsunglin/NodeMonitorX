// =============================================================
// 依賴設定
// =============================================================
const http = require("http");
const { URL } = require("url");
const WebSocket = require("ws");


// =============================================================
// 維護模式設定
// =============================================================
let maintenanceMode = true; // 初始狀態為非維護模式

// =============================================================
// Controller
// =============================================================
const SystemInfoController = require("./controllers/SystemInfoController");
const _systemInfoController = new SystemInfoController();
const DownloadController = require("./controllers/DownloadController");
const _downloadController = new DownloadController();
const LogController = require("./controllers/LogController");
const _logController = new LogController();
const StressTestController = require("./controllers/StressTestController");
const StressController = new StressTestController();
const DBController = require("./controllers/DBController");  // 新增 DBController


// =============================================================
//  HTTP 路由處理函式
// =============================================================
function handleHttpRequest(request, response) {
  const { pathname } = new URL(request.url, `http://${request.headers.host}`);

  // 檢查維護模式
  if (maintenanceMode && pathname !== "/system") {
    response.writeHead(503, { "Content-Type": "text/plain" }).end("Service is under maintenance. Please try again later.");
    return;
  }

  if (pathname === "/system" && request.method === "GET") {
    _systemInfoController.getSystemInfo(request, response);
  } else if (pathname === "/download" && request.method === "GET") {
    _downloadController.handleFileDownload(request, response);
  } else if (pathname === "/cpu-stress/start" && request.method === "GET") {
    StressController.startStressTest(request, response);
  } else if (pathname === "/cpu-stress/stop" && request.method === "GET") {
    StressController.stopStressTest(request, response);
  } else {
    console.log("Received request with no match:", request, response);
  }
}

// =============================================================
//  啟動 HTTP 伺服器
// =============================================================
function createHttpServer() {
  const httpServer = http.createServer(handleHttpRequest);
  httpServer.listen(3001, () => {
    console.log("HTTP server running on http://localhost:3001");
  });
}

// =============================================================
//  建立 WebSocket 伺服器
// =============================================================
function createWebSocketServer() {
  const wsServer = new WebSocket.Server({ port: 3002 });
  wsServer.on("connection", handleWebSocketConnection);
  console.log("WebSocket server running on ws://localhost:3002");
  return wsServer;
}

// =============================================================
//  處理 WebSocket 連線
// =============================================================
function handleWebSocketConnection(ws) {
  // 檢查維護模式
  if (maintenanceMode) {
    ws.send("Service is under maintenance. WebSocket connection will be closed.");
    ws.close(); // 關閉連線
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

// =============================================================
//  啟動 HTTP 和 WebSocket 伺服器
// =============================================================
function startServers() {
  createHttpServer();
  createWebSocketServer();
}


async function initializeApp() {
  try {
    await DBController.initializeDatabase();
    startServers();
  } catch (err) {
    console.error("Failed to initialize the app:", err);
    process.exit(1);
  }
}

initializeApp();
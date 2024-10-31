// =============================================================
// 依賴設定
// =============================================================
const http = require("http");
const { URL } = require("url");
const WebSocket = require("ws");


// =============================================================
// 維護模式設定
// =============================================================
let maintenanceMode = false; // 初始狀態為非維護模式

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
const DBController = require("./controllers/DBController");

const MetricsController = require("./controllers/MetricsController");

// =============================================================
//  HTTP 路由處理函式
// =============================================================
function handleHttpRequest(request, response) {
  const start = Date.now();
  const { pathname } = new URL(request.url, `http://${request.headers.host}`);
  const method = request.method;
  let statusCode = 200; 

  // 檢查維護模式
  if (maintenanceMode && pathname !== "/system") {
    statusCode = 503;
    MetricsController.countRequest(method, pathname, statusCode);
    response.writeHead(503, { "Content-Type": "text/plain" }).end("Service is under maintenance. Please try again later.");
    return;
  }

  // 增加 `/metrics` 路徑供 Prometheus 獲取數據
  if (pathname === "/metrics" && request.method === "GET") {
    return MetricsController.getMetrics(request, response);
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
    statusCode = 404;
    console.log("Received request with no match:", request, response);
  }

  // 計算請求的處理時間並更新指標
  const duration = (Date.now() - start) / 1000;
  MetricsController.countRequest(method, pathname, statusCode);
  MetricsController.observeRequestDuration(method, pathname, statusCode, duration);
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
  let statusCode = 300; 
  // 檢查維護模式
  if (maintenanceMode) {
    ws.send("Service is under maintenance. WebSocket connection will be closed.");
    ws.close(); // 關閉連線
    return;
  }

  console.log("WebSocket client connected");
  MetricsController.incrementWebSocketConnections();
  MetricsController.countRequest("WebSocket", "/ws/connect", statusCode);

  ws.on("message", (message) => {
    console.log("Received message:", message.toString());
  });

  ws.on("close", () => {
    console.log("WebSocket client disconnected");
    MetricsController.decrementWebSocketConnections();
    MetricsController.countRequest("WebSocket", "/ws/disconnect", statusCode);
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
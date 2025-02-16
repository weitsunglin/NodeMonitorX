// =============================================================
// 依賴設定
// =============================================================
const http = require("http");
const { URL } = require("url");
const WebSocket = require("ws");
const fs = require("fs");
const path = require("path");


// =============================================================
// 維護模式設定
// =============================================================
let maintenanceMode = false; // 初始狀態為非維護模式，可吃資料庫設定，目前先寫死

// =============================================================
// Controller
// =============================================================
const SystemInfoController = require("./controllers/SystemInfoController");
const _systemInfoController = new SystemInfoController();

const DownloadController = require("./controllers/DownloadController");
const _downloadController = new DownloadController();

const LogController = require("./controllers/LogController");
const _logController = new LogController();

const DBController = require("./controllers/DBController");
const MetricsController = require("./controllers/MetricsController");

// =============================================================
// HTTP 路由處理函式
// =============================================================

async function parseRequestBody(request) {
  return new Promise((resolve) => {
    let body = '';
    request.on("data", (chunk) => { body += chunk.toString(); });
    request.on("end", () => resolve(JSON.parse(body)));
  });
}

async function handleHttpRequest(request, response) {
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

  // 服務 DatabaseOperations.html
  if (pathname === "/db-operations" && method === "GET") {
    fs.readFile(path.join(__dirname, "views/DatabaseOperations.html"), "utf-8", (err, data) => {
      if (err) {
        response.writeHead(500, { "Content-Type": "text/plain" }).end("Error loading DatabaseOperations view");
        return;
      }
      response.writeHead(200, { "Content-Type": "text/html" }).end(data);
    });
    return;
  }

  // CRUD API
  if (pathname === "/db/execute-query" && method === "POST") {
    const { query } = await parseRequestBody(request);
    
    try {
      const result = await DBController.executeQuery(query);
      response.writeHead(200, { "Content-Type": "application/json" }).end(JSON.stringify(result.recordset || []));
    } catch (error) {
      response.writeHead(500, { "Content-Type": "application/json" }).end(JSON.stringify({ error: "Failed to execute query" }));
    }
    return;
  }

  // 增加 `/metrics` 路徑供 Prometheus 獲取數據
  if (pathname === "/metrics" && request.method === "GET") {
    await MetricsController.getMetrics(request, response);
    return; // 確保請求在這裡結束
  }

  // 系統資訊和下載處理
  if (pathname === "/system" && request.method === "GET") {
    _systemInfoController.getSystemInfo(request, response);
    return;
  } else if (pathname === "/download" && request.method === "GET") {
    _downloadController.handleFileDownload(request, response);
    return;
  }

  // 無法匹配的路徑
  statusCode = 404;
  MetricsController.countRequest(method, pathname, statusCode);
  response.writeHead(404, { "Content-Type": "text/plain" }).end("Not Found");

  // 計算請求的處理時間並更新指標
  const duration = (Date.now() - start) / 1000;
  MetricsController.countRequest(method, pathname, statusCode);
  MetricsController.observeRequestDuration(method, pathname, statusCode, duration);
}

// =============================================================
// 啟動 HTTP 伺服器
// =============================================================
function createHttpServer() {
  const httpServer = http.createServer(handleHttpRequest);
  httpServer.listen(3001, () => {
    console.log("HTTP server running on http://localhost:3001");
  });
}

// =============================================================
// 建立 WebSocket 伺服器
// =============================================================
function createWebSocketServer() {
  const wsServer = new WebSocket.Server({ port: 3002 });
  wsServer.on("connection", handleWebSocketConnection);
  console.log("WebSocket server running on ws://localhost:3002");
  return wsServer;
}

// =============================================================
// 處理 WebSocket 連線
// =============================================================
function handleWebSocketConnection(ws) {
  let statusCode = 300;

  // 檢查維護模式
  if (maintenanceMode) {
    ws.send("Service is under maintenance. WebSocket connection will be closed.");
    ws.close();
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
// 啟動 HTTP 和 WebSocket 伺服器
// =============================================================
function startServers() {
  createHttpServer();
  createWebSocketServer();
}

// 初始化並啟動應用
DBController.initializeDatabase();
startServers();
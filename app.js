// 依賴
const http = require("http");
const { URL } = require("url");
const WebSocket = require("ws");

// Controllers
const systemInfoController = require("./controllers/systemInfoController");
const _systemInfoController = new systemInfoController();
const DownloadController = require("./controllers/DownloadController");
const _downloadController = new DownloadController();

// HTTP 路由處理函式
function handleHttpRequest(req, res) {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  
  if (pathname === "/system" && req.method === "GET") {
    _systemInfoController.getSystemInfo(req, res);
  } else if (pathname === "/download" && req.method === "GET") {
    _downloadController.handleFileDownload(req, res);
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" }).end("Not Found");
  }
}

// 創建 HTTP 伺服器
const httpServer = http.createServer(handleHttpRequest);
httpServer.listen(3001, () => console.log("HTTP server running on http://localhost:3001"));

// WebSocket 伺服器設置
const wsServer = new WebSocket.Server({ port: 3002 });

wsServer.on("connection", (ws) => {
  console.log("WebSocket client connected");

  ws.on("message", (message) => {
    console.log("Received message:", message.toString());
  });

  ws.on("close", () => {
    console.log("WebSocket client disconnected");
  });
});

console.log("WebSocket server running on ws://localhost:3002");
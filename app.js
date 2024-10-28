//依賴
const http = require("http");
const { URL } = require("url");
const WebSocket = require("ws");

//Controller
const systemInfoController = require("./controllers/systemInfoController");
const _systemInfoController = new systemInfoController();

//http server [一直監聽]
http.createServer((req, res) => {
  const { pathname, searchParams } = new URL(req.url, `http://${req.headers.host}`);
  if (pathname === "/system" && req.method === "GET") {
    _systemInfoController.getSystemInfo(req, res);
  } else {
    res.writeHead(404).end("Not Found");
  }
}).listen(3001, () => console.log("Server running on http://localhost:3001"));


// WebSocket server [一直監聽]
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
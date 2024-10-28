const WebSocket = require('ws');
const ws = new WebSocket("ws://localhost:3002");

ws.on("open", () => {
    console.log("已連接到 WebSocket 伺服器");
    // 向伺服器發送一條測試訊息
    ws.send("Hello from Node.js client!");
});

ws.on("message", (message) => {
    console.log("收到伺服器訊息:", message);
});

ws.on("close", () => {
    console.log("已從 WebSocket 伺服器斷開連接");
});

ws.on("error", (error) => {
    console.error("WebSocket 發生錯誤:", error);
});

const client = require("prom-client");

// 初始化 Prometheus 指標
const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP and WebSocket requests",
  labelNames: ["method", "route", "status"],
});

const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route", "status"],
  buckets: [0.1, 0.5, 1, 2, 5],
});

// Gauge 用於跟蹤當前活躍的 WebSocket 連接數
const activeWebSocketConnections = new client.Gauge({
  name: "active_websocket_connections",
  help: "Number of active WebSocket connections",
});

client.collectDefaultMetrics();

class MetricsController {
  static async getMetrics(req, res) {
    res.writeHead(200, { "Content-Type": client.register.contentType });
    res.end(await client.register.metrics());
  }

  static countRequest(method, route, status) {
    httpRequestCounter.inc({ method, route, status });
  }

  static observeRequestDuration(method, route, status, duration) {
    httpRequestDuration.observe({ method, route, status }, duration);
  }

  static incrementWebSocketConnections() {
    activeWebSocketConnections.inc(); // 增加 WebSocket 連接計數
  }

  static decrementWebSocketConnections() {
    activeWebSocketConnections.dec(); // 減少 WebSocket 連接計數
  }
}

module.exports = MetricsController;

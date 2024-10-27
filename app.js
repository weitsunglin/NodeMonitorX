const http = require("http");
const { URL } = require("url");
const MainController = require("./controllers/MainController");
const mainController = new MainController();

http.createServer((req, res) => {
  const { pathname, searchParams } = new URL(req.url, `http://${req.headers.host}`);
  if (pathname === "/system" && req.method === "GET") {
    mainController.getSystemInfo(req, res);
  } else {
    res.writeHead(404).end("Not Found");
  }
}).listen(3001, () => console.log("Server running on http://localhost:3001"));

const { Worker, isMainThread, parentPort } = require('worker_threads');

class CpuStressController {
  constructor() {
    this.isStressing = false;
    this.workers = [];
  }

  startStressTest(req, res) {
    if (this.isStressing) {
      return res.writeHead(400, { "Content-Type": "text/plain" }).end("CPU Stress Test is already running");
    }

    this.isStressing = true;
    res.writeHead(200, { "Content-Type": "text/plain" }).end("Started CPU Stress Test");
    console.log("Starting CPU Stress Test...");

    // 創建多個工作線程以增加 CPU 使用率
    const stressTasks = 4;
    for (let i = 0; i < stressTasks; i++) {
      const worker = new Worker(__filename); // 當前文件作為 worker
      this.workers.push(worker);
    }
  }

  stopStressTest(req, res) {
    if (!this.isStressing) {
      return res.writeHead(400, { "Content-Type": "text/plain" }).end("No CPU Stress Test running");
    }

    this.isStressing = false;
    res.writeHead(200, { "Content-Type": "text/plain" }).end("Stopped CPU Stress Test");

    this.workers.forEach(worker => worker.terminate());
    this.workers = [];
    console.log("Stopped CPU Stress Test");
  }
}

if (!isMainThread) {
  setInterval(() => {
    for (let i = 0; i < 1e8; i++) {
      Math.sqrt(Math.random() * i);
    }
  }, 0);
} else {
  module.exports = CpuStressController;
}
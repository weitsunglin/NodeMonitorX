# Node.js Server App

### 使用說明

1. 安裝docker
    https://www.docker.com/
2. 安裝node.js
    https://nodejs.org/en
3. 使用npm安裝server依賴套件 
    npm install ws mssql
    npm install prom-client
4. 啟動docker 
    cd C:\Users\User\Desktop\work_space\node_js_server_app\docker
    docker-compose up --build -d 
5. 啟動伺服器
    cd C:\Users\User\Desktop\work_space\node_js_server_app
    node app.js

6. 查看 Grafana  http://localhost:3000，預設使用者名稱和密碼是 admin / admin

7. 添加 Prometheus 數據源，URL 填寫 http://prometheus:9090


### 測試方式

1. 測試 HTTP 請求
```
/metrics 路徑（用於獲取 Prometheus 指標）
curl http://localhost:3001/metrics   


/system 路徑
curl http://localhost:3001/system
這將調用 _systemInfoController.getSystemInfo() 方法，應會返回系統資訊。


/download 路徑
curl http://localhost:3001/download


/cpu-stress/start 路徑（開始壓力測試）
curl http://localhost:3001/cpu-stress/start


/cpu-stress/stop路徑（停止壓力測試）
curl http://localhost:3001/cpu-stress/stop
```

2. 測試 WebSocket 連線
```
使用 wscat 測試 WebSocket 連線

npm install -g wscat

連接到 WebSocket 伺服器
wscat -c ws://localhost:3002

發送消息以測試 WebSocket：
> Hello, WebSocket!

```

3. 測試 SQL 連線
```
http://localhost:3001/db-operations
```
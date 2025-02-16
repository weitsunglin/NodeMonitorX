# NodeMonitorX

![logo](https://github.com/weitsunglin/node_js_server_app/blob/main/demo/logo.png)


### Docker 介面

![DEMO_2](https://github.com/weitsunglin/node_js_server_app/blob/main/demo/06.jpg)


### 模組介面

#### 系統資訊

http://localhost:3001/system

![DEMO_1](https://github.com/weitsunglin/node_js_server_app/blob/main/demo/01.png)


#### 操控資料庫

http://localhost:3001/db-operations

![DEMO_2](https://github.com/weitsunglin/node_js_server_app/blob/main/demo/08.jpg)


#### Prometheus

http://localhost:9090/query

![DEMO_2](https://github.com/weitsunglin/node_js_server_app/blob/main/demo/04.png)



#### Grafana

http://localhost:3000/login

![DEMO_2](https://github.com/weitsunglin/node_js_server_app/blob/main/demo/03.png)



### 使用說明

1. 安裝docker
    https://www.docker.com/

2. 執行start.bat

3. 第一次啟動可能會錯誤，因為DB Model 會去連資料庫 (MyDatabase)，而資料庫可能還沒被建立 !

4. 查看 Grafana
   http://localhost:3000，預設使用者名稱和密碼是 admin / admin

5. 添加 Prometheus 數據源
   URL 填寫 http://prometheus:9090


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

© 2024 weitusnglin. All rights reserved.
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

6. 查看 Grafana  http://localhost:3000，預設使用者名稱和密碼是 admin / admin，添加 Prometheus 數據源，URL 填寫 http://prometheus:9090


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


### 資料庫還原

1. 先搬運bak到docker內，在下指令

```
docker exec -it <container_name> /opt/mssql-tools/bin/sqlcmd \  # <container_name>: 替換為 SQL Server 容器的名稱
   -S localhost -U sa -P <YourPassword> \                        # <YourPassword>: 替換為 sa 使用者的密碼
   -Q "                                                          # -Q: 指定要執行的 T-SQL 查詢

   RESTORE DATABASE [YourDatabase]                               # [YourDatabase]: 還原後的目標資料庫名稱
   FROM DISK = N'/var/opt/mssql/backup/，.bak'           # ，.bak: 備份檔案的名稱及路徑

   WITH MOVE 'OriginalDBName_Data'                               # 'OriginalDBName_Data': 備份檔案中的邏輯名稱，用於資料檔 (.mdf)
   TO '/var/opt/mssql/data/YourDatabase_Data.mdf',               # YourDatabase_Data.mdf: 新還原資料檔案的目標名稱和路徑

   MOVE 'OriginalDBName_Log'                                     # 'OriginalDBName_Log': 備份檔案中的邏輯名稱，用於日誌檔 (.ldf)
   TO '/var/opt/mssql/data/YourDatabase_Log.ldf'"                # YourDatabase_Log.ldf: 新還原日誌檔案的目標名稱和路徑
```
# Node.js Server App

### 使用說明

1. 安裝docker
    https://www.docker.com/
2. 安裝node.js
    https://nodejs.org/en
3. 使用npm安裝server依賴套件 
    npm install ws mssql
4. 啟動docker 
    cd C:\Users\User\Desktop\work_space\node_js_server_app\docker
    docker-compose up --build -d 
5. 啟動伺服器
    cd C:\Users\User\Desktop\work_space\node_js_server_app
    node app.js


### 備註

1. database 還原

docker exec -it <container_name> /opt/mssql-tools/bin/sqlcmd \  # <container_name>: 替換為 SQL Server 容器的名稱
   -S localhost -U sa -P <YourPassword> \                        # <YourPassword>: 替換為 sa 使用者的密碼
   -Q "                                                          # -Q: 指定要執行的 T-SQL 查詢

   RESTORE DATABASE [YourDatabase]                               # [YourDatabase]: 還原後的目標資料庫名稱
   FROM DISK = N'/var/opt/mssql/backup/sql_backup.bak'           # sql_backup.bak: 備份檔案的名稱及路徑

   WITH MOVE 'OriginalDBName_Data'                               # 'OriginalDBName_Data': 備份檔案中的邏輯名稱，用於資料檔 (.mdf)
   TO '/var/opt/mssql/data/YourDatabase_Data.mdf',               # YourDatabase_Data.mdf: 新還原資料檔案的目標名稱和路徑

   MOVE 'OriginalDBName_Log'                                     # 'OriginalDBName_Log': 備份檔案中的邏輯名稱，用於日誌檔 (.ldf)
   TO '/var/opt/mssql/data/YourDatabase_Log.ldf'"                # YourDatabase_Log.ldf: 新還原日誌檔案的目標名稱和路徑
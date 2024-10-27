# Node.js Server App

A simple server built with Node.js.

## 目錄結構

- **mainView**: 提供給 client 的 HTML 模板，用於展示系統資訊。
- **app.js**: 設置伺服器路由並處理請求的進入點。
- **Model**: 負責數據的管理與處理，例如從數據庫獲取或計算動態數據。
- **Controller**: 接收請求，從模型獲取數據，渲染視圖後返回給客戶端。


### 使用說明

1. 啟動伺服器 node app.js

2. 測試伺服器 在瀏覽器中訪問 http://localhost:3001/system，即可查看系統資訊頁面。
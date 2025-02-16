# 使用輕量版 Node.js
FROM node:14-alpine

# 設置工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json
COPY package*.json ./

# 執行 npm install 安裝所有依賴
RUN npm install

# 複製所有檔案到容器
COPY . .

# 確保 node_modules 目錄存在
RUN ls -l node_modules

# 暴露端口
EXPOSE 3001 3002

# 啟動應用
CMD ["npm", "start"]

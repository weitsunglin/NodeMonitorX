@echo off
echo Installing project dependencies...
npm install ws mssql
echo Installation complete.

echo Start Service...
node app.js
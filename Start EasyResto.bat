@echo off

rem Укажите путь к Node.js
set NODE_PATH="C:\Program Files\nodejs\node.exe"

rem Укажите путь к вашему Node.js проекту
set PROJECT_PATH=server

cd %PROJECT_PATH%
%NODE_PATH% server.js
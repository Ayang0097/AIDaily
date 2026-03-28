#!/bin/bash

# AI日报 App - 一键安装脚本

echo "🚀 正在安装 AI日报 App..."

# Frontend
echo "📦 安装前端依赖..."
cd frontend && npm install
cd ..

# Backend
echo "📦 安装后端依赖..."
cd backend && npm install
cd ..

echo ""
echo "✅ 安装完成！"
echo ""
echo "启动方式："
echo "  前端: cd frontend && npm run dev"
echo "  后端: cd backend && npm run dev"
echo ""
echo "访问 http://localhost:3000 查看应用"

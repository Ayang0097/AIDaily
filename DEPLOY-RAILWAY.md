# Railway 部署指南

## 后端部署

### 1. 创建 Railway 项目
```bash
npm install -g @railway/cli
railway login
cd ai-daily-app/backend
railway init
```

### 2. 配置环境变量
在 Railway 面板设置：
- `PORT` = `3001`
- `DATABASE_PATH` = `/data/ai-daily.db`

### 3. 添加持久化磁盘
在 Railway 面板 → 后端服务 → Add Persistent Disk
- 挂载点：`/data`

### 4. 部署
```bash
railway up
```

## 前端部署（静态站点）

### 方案A：Railway 静态站点
1. 在 Railway 创建新服务，选择 "Static Site"
2. 连接 Git 仓库
3. 构建命令：`npm install && npm run build`
4. 输出目录：`dist`
5. 环境变量：`VITE_API_BASE_URL` = 你的后端URL

### 方案B：Vercel（推荐）
```bash
cd frontend
npm install -g vercel
vercel
```
构建命令：`npm run build`
输出目录：`dist`

## 更新说明

Railway 每次 push 到 connected repo 会自动部署。

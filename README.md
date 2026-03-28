# AI日报 App

一站式AI资讯聚合与消费平台，为AI从业者提供每日精选资讯。

## 📱 功能特性

- **资讯聚合**：自动抓取虎嗅、爱范儿、钛媒体等AI相关内容
- **智能摘要**：AI生成一句话点评和摘要
- **分类浏览**：按模型/工具/行业/观点分类
- **收藏分享**：收藏感兴趣的内容，一键分享
- **定时推送**：每日早8点自动推送日报到微信

## 🛠️ 技术栈

### 前端
- React 18
- TailwindCSS
- Zustand (状态管理)
- Vite (构建工具)

### 后端
- Node.js + Express
- SQLite (数据库)
- RSS Parser (资讯抓取)
- Node Schedule (定时任务)

## 🚀 快速开始

### 前端

```bash
cd frontend
npm install
npm run dev
```

访问 http://localhost:3000

### 后端

```bash
cd backend
npm install
npm run dev
```

API 运行在 http://localhost:3001

## 📁 项目结构

```
ai-daily-app/
├── PRD.md                 # 产品需求文档
├── prototype/             # 原型设计
│   └── index.html         # 可交互HTML原型
├── frontend/              # React前端
│   ├── src/
│   │   ├── components/    # UI组件
│   │   ├── pages/         # 页面
│   │   ├── store.js       # 状态管理
│   │   └── App.jsx        # 主应用
│   └── package.json
├── backend/               # Node.js后端
│   ├── src/
│   │   ├── index.js       # API入口
│   │   ├── db.js          # 数据库
│   │   ├── scraper.js     # 资讯抓取
│   │   ├── ai.js          # AI摘要
│   │   └── scheduler.js   # 定时任务
│   └── package.json
├── ui-design.png          # UI设计图
└── README.md
```

## 🔌 API 接口

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/daily/latest | 获取最新日报 |
| GET | /api/daily/:date | 获取指定日期日报 |
| GET | /api/dailies | 获取历史日报列表 |
| GET | /api/search?q= | 搜索资讯 |
| GET | /api/sources | 获取资讯来源 |
| POST | /api/admin/regenerate | 重新生成日报 |
| DELETE | /api/admin/daily/:date | 删除日报 |

## 📹 演示视频

视频脚本已生成，演示内容：
1. 产品介绍 (30秒)
2. 核心功能展示 (60秒)
3. 操作教程 (30秒)

## 🔧 开发说明

### 数据库初始化
首次运行会自动创建SQLite数据库和默认数据源。

### RSS 源配置
默认配置了6个中文AI资讯源：
- 虎嗅
- 爱范儿
- 钛媒体
- 少数派
- Solidot
- 36kr

### 定时任务
- 每日 06:00 自动生成日报
- 每 20 分钟检查 Twitter 更新

## 📄 License

MIT
